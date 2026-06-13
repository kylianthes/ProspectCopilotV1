use std::net::{SocketAddr, TcpStream};
use std::time::Duration;

use tauri::Manager;
use tauri_plugin_shell::ShellExt;

fn backend_is_running() -> bool {
    let address: SocketAddr = "127.0.0.1:8000"
        .parse()
        .expect("valid backend address");
    TcpStream::connect_timeout(&address, Duration::from_millis(300)).is_ok()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if !backend_is_running() {
                let sidecar = app.shell().sidecar("prospect-copilot-backend")?;
                let (_rx, child) = sidecar.spawn()?;
                app.manage(child);
            }
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running Prospect Copilot");
}
