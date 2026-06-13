use std::io::{Read, Write};
use std::net::{SocketAddr, TcpStream};
use std::sync::Mutex;
use std::thread;
use std::time::Duration;

use serde::Serialize;
use tauri::Emitter;
use tauri::Manager;
use tauri::WindowEvent;
use tauri_plugin_deep_link::DeepLinkExt;
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;
use url::Url;

struct BackendProcess(Mutex<Option<CommandChild>>);

#[derive(Debug)]
struct ExtensionProspect {
    username: String,
    display_name: Option<String>,
    bio: String,
    source: String,
    profile_url: String,
}

#[derive(Clone, Serialize)]
struct ProspectImportEvent {
    message: String,
}

fn backend_is_running() -> bool {
    let address: SocketAddr = "127.0.0.1:8000"
        .parse()
        .expect("valid backend address");
    TcpStream::connect_timeout(&address, Duration::from_millis(300)).is_ok()
}

fn wait_for_backend() -> bool {
    for _ in 0..30 {
        if backend_is_running() {
            return true;
        }
        thread::sleep(Duration::from_millis(250));
    }
    false
}

fn read_query(url: &Url, key: &str) -> Option<String> {
    url.query_pairs()
        .find(|(name, _)| name == key)
        .map(|(_, value)| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn parse_add_prospect_url(url: &Url) -> Result<ExtensionProspect, String> {
    if url.scheme() != "prospectcopilot" {
        return Err("Unsupported protocol".into());
    }

    let is_add_prospect = url.host_str() == Some("add-prospect") || url.path() == "/add-prospect";
    if !is_add_prospect {
        return Err("Unsupported deep link action".into());
    }

    let username = read_query(url, "username").ok_or("Missing username")?;
    let bio = read_query(url, "bio").ok_or("Missing bio")?;
    if bio.chars().count() > 4000 {
        return Err("Bio is too long".into());
    }

    let source = read_query(url, "source").ok_or("Missing source")?.to_lowercase();
    if source != "instagram" && source != "tiktok" {
        return Err("Unsupported source".into());
    }

    Ok(ExtensionProspect {
        username,
        display_name: read_query(url, "display_name"),
        bio,
        source,
        profile_url: read_query(url, "profile_url").ok_or("Missing profile_url")?,
    })
}

fn post_extension_prospect(prospect: &ExtensionProspect) -> Result<(), String> {
    if !wait_for_backend() {
        return Err("Backend is not available".into());
    }

    let body = serde_json::json!({
        "username": prospect.username,
        "display_name": prospect.display_name,
        "bio": prospect.bio,
        "source": prospect.source,
        "profile_url": prospect.profile_url,
    })
    .to_string();

    let mut stream = TcpStream::connect("127.0.0.1:8000").map_err(|error| error.to_string())?;
    stream
        .set_read_timeout(Some(Duration::from_secs(8)))
        .map_err(|error| error.to_string())?;
    stream
        .set_write_timeout(Some(Duration::from_secs(8)))
        .map_err(|error| error.to_string())?;

    let request = format!(
        "POST /extension/prospects HTTP/1.1\r\nHost: 127.0.0.1:8000\r\nContent-Type: application/json\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
        body.len(),
        body
    );
    stream
        .write_all(request.as_bytes())
        .map_err(|error| error.to_string())?;

    let mut response = String::new();
    stream
        .read_to_string(&mut response)
        .map_err(|error| error.to_string())?;

    if response.starts_with("HTTP/1.1 2") || response.starts_with("HTTP/1.0 2") {
        Ok(())
    } else {
        Err("Prospect import failed".into())
    }
}

fn handle_deep_link(app: tauri::AppHandle, url: Url) {
    thread::spawn(move || {
        let result = parse_add_prospect_url(&url).and_then(|prospect| post_extension_prospect(&prospect));
        match result {
            Ok(()) => {
                let _ = app.emit(
                    "prospect-copilot://prospect-added",
                    ProspectImportEvent {
                        message: "Prospect ajouté depuis le navigateur.".into(),
                    },
                );
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            Err(error) => {
                let _ = app.emit(
                    "prospect-copilot://prospect-add-error",
                    ProspectImportEvent {
                        message: format!("Import navigateur impossible: {error}"),
                    },
                );
            }
        }
    });
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if !backend_is_running() {
                let sidecar = app.shell().sidecar("prospect-copilot-backend")?;
                let (_rx, child) = sidecar.spawn()?;
                app.manage(BackendProcess(Mutex::new(Some(child))));
            } else {
                app.manage(BackendProcess(Mutex::new(None)));
            }

            let app_handle = app.handle().clone();
            app.deep_link().on_open_url(move |event| {
                for url in event.urls() {
                    handle_deep_link(app_handle.clone(), url);
                }
            });

            if let Ok(Some(urls)) = app.deep_link().get_current() {
                for url in urls {
                    handle_deep_link(app.handle().clone(), url);
                }
            }

            Ok(())
        })
        .on_window_event(|window, event| {
            if matches!(event, WindowEvent::CloseRequested { .. }) {
                if let Some(child) = window
                    .state::<BackendProcess>()
                    .0
                    .lock()
                    .expect("backend process lock poisoned")
                    .take()
                {
                    let _ = child.kill();
                }
            }
        })
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .run(tauri::generate_context!())
        .expect("error while running Prospect Copilot");
}
