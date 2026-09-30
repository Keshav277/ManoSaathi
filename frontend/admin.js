// admin.js -- ManoSaathi admin portal (login + case list)
const API_BASE = "";
let token = sessionStorage.getItem("ms_admin") || "";
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

async function api(path, opts) {
  opts = opts || {};
  const res = await fetch(API_BASE + path, Object.assign({}, opts, {
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }
  }));
  if (res.status === 401 && path !== "/api/admin/login") { logout(); throw new Error("Session expired"); }
  return res;
}

function show(loggedIn) {
  $("loginForm").hidden = loggedIn;
  $("dash").hidden = !loggedIn;
  $("logoutBtn").hidden = !loggedIn;
}
function logout() { token = ""; sessionStorage.removeItem("ms_admin"); show(false); }

$("logoutBtn").onclick = logout;
$("loginForm").onsubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ username: $("u").value, password: $("p").value }) });
    const d = await res.json();
    if (!res.ok) { $("loginMsg").textContent = d.error; return; }
    token = d.token; sessionStorage.setItem("ms_admin", token);
    $("p").value = ""; $("loginMsg").textContent = "";
    show(true); load();
  } catch (err) { $("loginMsg").textContent = "Couldn't reach the backend. Is backend/app.py running?"; }
};

const cardHtml = (c) => `
<div class="case ${esc(c.severity)}" data-id="${c.id}">
  <div class="case-head">
    <span class="badge ${esc(c.severity)}">${esc(c.severity)}</span>
    <b>${esc(c.name || "(no name given)")}</b>
    <span class="note">${esc(c.created_at.slice(0, 16).replace("T", " "))} UTC · ${esc(c.lang)}</span>
  </div>
  <div>📞 ${esc(c.contact)}</div>
  ${c.message ? `<p class="case-msg">${esc(c.message)}</p>` : ""}
  <div class="case-actions">
    <select class="st">${["new", "contacted", "closed"].map((s) => `<option ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}</select>
    <input class="an" placeholder="Admin notes" value="${esc(c.admin_notes)}">
    <button class="save">Save</button><button class="del">Delete</button>
  </div>
</div>`;

async function load() {
  try {
    const q = new URLSearchParams({ severity: $("fSev").value, status: $("fStat").value });
    const d = await (await api("/api/admin/cases?" + q)).json();
    const s = d.stats;
    $("stats").innerHTML = [["Critical (open)", s.critical_open], ["Serious (open)", s.serious_open], ["New", s.new], ["Total", s.total]]
      .map((x) => `<div class="stat"><b>${x[1]}</b>${x[0]}</div>`).join("");
    $("cases").innerHTML = d.cases.length ? d.cases.map(cardHtml).join("") : '<p class="note">No cases match.</p>';
  } catch (err) { /* session expiry already handled in api() */ }
}

$("cases").onclick = async (e) => {
  const card = e.target.closest(".case");
  if (!card) return;
  const id = card.dataset.id;
  if (e.target.classList.contains("save")) {
    await api("/api/admin/cases/" + id, { method: "PATCH", body: JSON.stringify({ status: card.querySelector(".st").value, admin_notes: card.querySelector(".an").value }) });
    load();
  } else if (e.target.classList.contains("del") && confirm("Permanently delete this record?")) {
    await api("/api/admin/cases/" + id, { method: "DELETE" });
    load();
  }
};

$("exportBtn").onclick = async () => {
  const res = await api("/api/admin/export.csv");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(await res.blob());
  a.download = "manosaathi-cases.csv";
  a.click();
};

$("fSev").onchange = $("fStat").onchange = load;
if (token) { show(true); load(); } else { show(false); }
