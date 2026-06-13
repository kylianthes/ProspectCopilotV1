(function () {
  const API_URL = "http://127.0.0.1:8000/extension/prospects";
  const BUTTON_ID = "prospect-copilot-add-button";
  const TOAST_ID = "prospect-copilot-toast";

  const INSTAGRAM_RESERVED_PATHS = new Set([
    "accounts",
    "direct",
    "explore",
    "p",
    "reel",
    "reels",
    "stories",
    "tv"
  ]);

  function platform() {
    if (location.hostname.includes("instagram.com")) return "instagram";
    if (location.hostname.includes("tiktok.com")) return "tiktok";
    return null;
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function currentPathParts() {
    return location.pathname.split("/").filter(Boolean);
  }

  function isSupportedProfilePage() {
    const site = platform();
    const parts = currentPathParts();

    if (site === "instagram") {
      return parts.length === 1 && !INSTAGRAM_RESERVED_PATHS.has(parts[0].toLowerCase());
    }

    if (site === "tiktok") {
      return parts.length >= 1 && parts[0].startsWith("@");
    }

    return false;
  }

  function readMeta(name) {
    const escaped = name.replace(/"/g, '\\"');
    return cleanText(
      document.querySelector(`meta[property="${escaped}"]`)?.content ||
      document.querySelector(`meta[name="${escaped}"]`)?.content
    );
  }

  function parseInstagramTitle(username) {
    const title = readMeta("og:title") || document.title;
    const match = title.match(/^(.+?)\s+\(@([^)]+)\)/);
    if (match) return cleanText(match[1]);
    return username;
  }

  function extractInstagramProfile() {
    const username = currentPathParts()[0] || "";
    const description = readMeta("og:description") || readMeta("description");
    const visibleHeader = cleanText(document.querySelector("header")?.innerText);
    const bio = description || visibleHeader || "Bio visible non détectée.";

    return {
      source: "instagram",
      username,
      display_name: parseInstagramTitle(username),
      bio,
      profile_url: location.href.split("?")[0]
    };
  }

  function extractTikTokProfile() {
    const username = (currentPathParts()[0] || "").replace(/^@/, "");
    const displayName =
      cleanText(document.querySelector('[data-e2e="user-title"]')?.textContent) ||
      cleanText(document.querySelector("h1")?.textContent) ||
      username;
    const subtitle = cleanText(document.querySelector('[data-e2e="user-subtitle"]')?.textContent);
    const bio =
      cleanText(document.querySelector('[data-e2e="user-bio"]')?.textContent) ||
      readMeta("description") ||
      "Bio visible non détectée.";

    return {
      source: "tiktok",
      username,
      display_name: displayName === username && subtitle ? subtitle : displayName,
      bio,
      profile_url: location.href.split("?")[0]
    };
  }

  function extractProfile() {
    if (!isSupportedProfilePage()) return null;
    return platform() === "instagram" ? extractInstagramProfile() : extractTikTokProfile();
  }

  function buildDeepLink(profile) {
    const params = new URLSearchParams({
      username: profile.username,
      display_name: profile.display_name || "",
      bio: profile.bio,
      source: profile.source,
      profile_url: profile.profile_url
    });

    return `prospectcopilot://add-prospect?${params.toString()}`;
  }

  async function sendFallback(profile) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile)
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => null);
      throw new Error(detail?.detail || "Impossible d'ajouter le prospect.");
    }

    return response.json();
  }

  function openDeepLink(profile) {
    window.location.href = buildDeepLink(profile);
  }

  function showToast(message, type) {
    document.getElementById(TOAST_ID)?.remove();

    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = message;
    toast.style.cssText = [
      "position:fixed",
      "right:20px",
      "bottom:20px",
      "z-index:2147483647",
      "max-width:340px",
      "padding:12px 14px",
      "border-radius:10px",
      "font:13px/1.4 system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "color:#E8EDF5",
      "background:" + (type === "error" ? "#3A101A" : "#0F2530"),
      "border:1px solid " + (type === "error" ? "rgba(255,77,106,.35)" : "rgba(0,212,255,.35)"),
      "box-shadow:0 14px 40px rgba(0,0,0,.35)"
    ].join(";");

    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 4200);
  }

  async function addCurrentProfile() {
    const profile = extractProfile();
    if (!profile) {
      showToast("Ouvre un profil Instagram ou TikTok avant d'ajouter un prospect.", "error");
      return { ok: false, error: "Profil non détecté." };
    }

    const confirmed = window.confirm(
      `Ajouter ${profile.display_name || profile.username} à Prospect Copilot ?`
    );
    if (!confirmed) return { ok: false, cancelled: true };

    openDeepLink(profile);

    try {
      const created = await new Promise((resolve, reject) => {
        window.setTimeout(() => {
          sendFallback(profile).then(resolve).catch(reject);
        }, 2500);
      });
      showToast("Prospect ajouté à Prospect Copilot.", "success");
      return { ok: true, prospect: created };
    } catch (error) {
      showToast("Prospect envoyé à Prospect Copilot. Si rien ne s'ouvre, lance l'application puis réessaie.", "success");
      return { ok: true, deepLinkOnly: true };
    }
  }

  function ensureButton() {
    const existing = document.getElementById(BUTTON_ID);
    if (!isSupportedProfilePage()) {
      existing?.remove();
      return;
    }
    if (existing) return;

    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.textContent = "Ajouter à Prospect Copilot";
    button.style.cssText = [
      "position:fixed",
      "right:20px",
      "top:88px",
      "z-index:2147483647",
      "border:1px solid rgba(0,212,255,.35)",
      "border-radius:999px",
      "padding:10px 14px",
      "background:#0F1420",
      "color:#E8EDF5",
      "font:600 13px system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif",
      "cursor:pointer",
      "box-shadow:0 12px 34px rgba(0,0,0,.32)"
    ].join(";");

    button.addEventListener("click", async () => {
      button.disabled = true;
      button.textContent = "Ajout...";
      try {
        await addCurrentProfile();
      } catch (error) {
        showToast(error.message || "Erreur Prospect Copilot.", "error");
      } finally {
        button.disabled = false;
        button.textContent = "Ajouter à Prospect Copilot";
      }
    });

    document.body.appendChild(button);
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type !== "PC_ADD_CURRENT_PROFILE") return false;

    addCurrentProfile()
      .then(sendResponse)
      .catch((error) => sendResponse({ ok: false, error: error.message || "Erreur inconnue." }));

    return true;
  });

  ensureButton();
  let lastUrl = location.href;
  window.setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      window.setTimeout(ensureButton, 500);
    } else {
      ensureButton();
    }
  }, 1000);
})();
