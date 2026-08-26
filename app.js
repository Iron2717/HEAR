const dateEl = document.getElementById("date");
const referenceEl = document.getElementById("reference");
const highlightEl = document.getElementById("highlight");
const explainEl = document.getElementById("explain");
const applyEl = document.getElementById("apply");
const respondEl = document.getElementById("respond");
const copyStatusEl = document.getElementById("copyStatus");

document.getElementById("newEntryBtn").addEventListener("click", clearFields);
document.getElementById("copyBtn").addEventListener("click", copyAllText);
document.getElementById("shareBtn").addEventListener("click", shareToNotes);

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function clearFields() {
  dateEl.value = todayISO();
  referenceEl.value = "";
  highlightEl.value = "";
  explainEl.value = "";
  applyEl.value = "";
  respondEl.value = "";
  copyStatusEl.textContent = "";
}

function buildShareText() {
  const lines = [];
  if (referenceEl.value.trim()) lines.push(referenceEl.value.trim());
  if (dateEl.value) lines.push(dateEl.value);
  lines.push("");
  lines.push("Highlight:", highlightEl.value.trim() || "—", "");
  lines.push("Explain:", explainEl.value.trim() || "—", "");
  lines.push("Apply:", applyEl.value.trim() || "—", "");
  lines.push("Respond:", respondEl.value.trim() || "—");
  return lines.join("\n");
}

async function copyAllText() {
  const text = buildShareText();
  try {
    await navigator.clipboard.writeText(text);
    copyStatusEl.textContent = "Copied to clipboard!";
  } catch {
    copyStatusEl.textContent = "Could not copy automatically — please copy manually.";
  }
  setTimeout(() => (copyStatusEl.textContent = ""), 2500);
}

// On iOS/Android this opens the native share sheet, where "Notes" can be picked to create a new note.
async function shareToNotes() {
  const text = buildShareText();
  const title = referenceEl.value.trim() || "HEAR Journal Entry";

  if (navigator.share) {
    try {
      await navigator.share({ title, text });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  // Fallback for browsers without the Web Share API (e.g. desktop).
  try {
    await navigator.clipboard.writeText(text);
    copyStatusEl.textContent = "Sharing isn't supported here — copied instead, paste into Notes.";
  } catch {
    copyStatusEl.textContent = "Could not share or copy automatically — please copy manually.";
  }
  setTimeout(() => (copyStatusEl.textContent = ""), 4000);
}

clearFields();
