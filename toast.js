// Consulting & Beyond — Technology Spearheads Committee
// Small toast-notification helper. Include after style.css is in place;
// call showToast("message", "success" | "error" | "") from anywhere.

function ensureToastContainer() {
  let box = document.getElementById("toastContainer");
  if (!box) {
    box = document.createElement("div");
    box.id = "toastContainer";
    box.className = "toast-container";
    document.body.appendChild(box);
  }
  return box;
}

function showToast(message, type) {
  const box = ensureToastContainer();
  const el = document.createElement("div");
  el.className = "toast" + (type ? " " + type : "");
  el.textContent = message;
  box.appendChild(el);

  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 250);
  }, 3200);
}
