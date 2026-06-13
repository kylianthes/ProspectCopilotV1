const addButton = document.getElementById("addButton");
const statusEl = document.getElementById("status");

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = type;
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

addButton.addEventListener("click", async () => {
  addButton.disabled = true;
  setStatus("Ajout en cours...");

  try {
    const tab = await getActiveTab();
    if (!tab?.id || !/^https:\/\/(www\.)?(instagram|tiktok)\.com\//.test(tab.url || "")) {
      setStatus("Ouvre d'abord un profil Instagram ou TikTok.", "error");
      return;
    }

    const response = await chrome.tabs.sendMessage(tab.id, { type: "PC_ADD_CURRENT_PROFILE" });
    if (response?.ok) {
      setStatus("Prospect ajouté.", "ok");
    } else if (response?.cancelled) {
      setStatus("Ajout annulé.");
    } else {
      setStatus(response?.error || "Profil non détecté.", "error");
    }
  } catch (error) {
    setStatus("Recharge la page puis réessaie.", "error");
  } finally {
    addButton.disabled = false;
  }
});
