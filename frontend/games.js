// games.js -- small stress-relief games, no backend needed. English / Hindi.
const G = {
  en: { title: "Mini games", back: "Back to chat", start: "Start", again: "Play again", stop: "Stop",
    tabs: { bubbles: "Pop the worries", memory: "Memory match", breathe: "Breathe", thought: "Kind thought" },
    score: "Popped", time: "Time", moves: "Moves", winMsg: "All matched in {n} moves. Nice work!", doneMsg: "Time's up! You popped {n} worries.",
    in: "Breathe in", hold: "Hold", out: "Breathe out", another: "Another one",
    thoughts: ["You don't have to solve everything today.", "Small steps still count as progress.", "Asking for help is a strength, not a weakness.", "This feeling will pass, even if it doesn't feel like it now.", "Rest is productive too.", "You've handled hard days before."] },
  hi: { title: "मिनी गेम्स", back: "चैट पर वापस", start: "शुरू करें", again: "फिर खेलें", stop: "रोकें",
    tabs: { bubbles: "चिंताएं फोड़ो", memory: "मेमोरी मैच", breathe: "सांस लें", thought: "अच्छी बात" },
    score: "फूटे", time: "समय", moves: "चालें", winMsg: "सब मिल गए, सिर्फ़ {n} चालों में। शाबाश!", doneMsg: "समय ख़त्म! आपने {n} चिंताएं फोड़ीं।",
    in: "सांस अंदर लें", hold: "रोकें", out: "सांस बाहर छोड़ें", another: "एक और",
    thoughts: ["आपको आज ही सब कुछ हल नहीं करना है।", "छोटे कदम भी तरक्की हैं।", "मदद मांगना कमज़ोरी नहीं, हिम्मत है।", "यह एहसास गुज़र जाएगा, भले अभी ऐसा न लगे।", "आराम करना भी काम का हिस्सा है।", "आप पहले भी मुश्किल दिन संभाल चुके हैं।"] }
};
let lang = localStorage.getItem("ms_lang") === "hi" ? "hi" : "en";
let current = "bubbles", cleanup = function () {};
const $ = (id) => document.getElementById(id);
const stage = () => $("gStage");
const tr = () => G[lang];

function bubbles() {
  const s = stage(); let score = 0, left = 30, tick, spawn;
  s.innerHTML = '<div class="hud"><span id="bS"></span><span id="bT"></span></div><div class="arena" id="arena"></div><button class="primary" id="bGo"></button>';
  const hud = () => { $("bS").textContent = tr().score + ": " + score; $("bT").textContent = tr().time + ": " + left + "s"; };
  const stop = () => { clearInterval(tick); clearInterval(spawn); };
  cleanup = stop; $("bGo").textContent = tr().start; hud();
  $("bGo").onclick = () => {
    stop(); score = 0; left = 30; hud(); $("arena").innerHTML = "";
    $("bGo").textContent = tr().again;
    spawn = setInterval(() => {
      const b = document.createElement("button"); b.className = "bubble";
      const size = 40 + Math.random() * 30; b.style.cssText = "width:" + size + "px;height:" + size + "px;left:" + Math.random() * (100 - 18) + "%;top:" + Math.random() * 78 + "%";
      b.textContent = ["😟", "💭", "😰", "📚", "⏰"][Math.floor(Math.random() * 5)];
      b.onclick = () => { b.remove(); score++; hud(); };
      $("arena").appendChild(b); setTimeout(() => b.remove(), 2200);
    }, 550);
    tick = setInterval(() => {
      left--; hud();
      if (left <= 0) { stop(); $("arena").innerHTML = '<p class="arena-msg">' + tr().doneMsg.replace("{n}", score) + "</p>"; }
    }, 1000);
  };
}

function memory() {
  const s = stage(); const icons = ["🪔", "🌸", "🌿", "☀️", "🌙", "🦋", "🍵", "🎵"];
  let deck, open, moves, matched, lock;
  s.innerHTML = '<div class="hud"><span id="mM"></span></div><div class="grid" id="mGrid"></div><p class="arena-msg" id="mWin"></p><button class="primary" id="mGo"></button>';
  cleanup = function () {};
  const reset = () => {
    deck = icons.concat(icons).sort(() => Math.random() - 0.5); open = []; moves = 0; matched = 0; lock = false;
    $("mWin").textContent = ""; $("mM").textContent = tr().moves + ": 0"; $("mGo").textContent = tr().again;
    $("mGrid").innerHTML = "";
    deck.forEach((ic) => {
      const c = document.createElement("button"); c.className = "card"; c.textContent = "?";
      c.onclick = () => {
        if (lock || c.classList.contains("up")) return;
        c.classList.add("up"); c.textContent = ic; open.push({ c: c, ic: ic });
        if (open.length === 2) {
          moves++; $("mM").textContent = tr().moves + ": " + moves;
          if (open[0].ic === open[1].ic) { matched++; open = []; if (matched === 8) $("mWin").textContent = tr().winMsg.replace("{n}", moves); }
          else { lock = true; setTimeout(() => { open.forEach((o) => { o.c.classList.remove("up"); o.c.textContent = "?"; }); open = []; lock = false; }, 700); }
        }
      };
      $("mGrid").appendChild(c);
    });
  };
  $("mGo").onclick = reset; reset();
}

function breathe() {
  const s = stage(); let timer, running = false;
  s.innerHTML = '<div class="breath-wrap"><div class="breath" id="bb"></div></div><p class="arena-msg" id="bMsg">&nbsp;</p><button class="primary" id="bGo"></button>';
  const stop = () => { running = false; clearTimeout(timer); $("bb").style.transform = "scale(.6)"; $("bMsg").innerHTML = "&nbsp;"; $("bGo").textContent = tr().start; };
  cleanup = () => { running = false; clearTimeout(timer); };
  $("bb").style.transform = "scale(.6)"; $("bGo").textContent = tr().start;
  const phases = [["in", 4, 1], ["hold", 4, 1], ["out", 6, 0.6]];
  const run = (i) => {
    if (!running) return; const p = phases[i % 3];
    $("bMsg").textContent = tr()[p[0]]; $("bb").style.transitionDuration = p[1] + "s"; $("bb").style.transform = "scale(" + p[2] + ")";
    timer = setTimeout(() => run(i + 1), p[1] * 1000);
  };
  $("bGo").onclick = () => { if (running) return stop(); running = true; $("bGo").textContent = tr().stop; run(0); };
}

function thought() {
  const s = stage();
  s.innerHTML = '<p class="thought" id="tTxt"></p><button class="primary" id="tGo"></button>'; cleanup = function () {};
  const next = () => { const a = tr().thoughts; $("tTxt").textContent = a[Math.floor(Math.random() * a.length)]; };
  $("tGo").textContent = tr().another; $("tGo").onclick = next; next();
}

const GAMES = { bubbles: bubbles, memory: memory, breathe: breathe, thought: thought };
function openGame(name) { cleanup(); current = name; renderTabs(); GAMES[name](); }
function renderTabs() {
  $("gTabs").innerHTML = "";
  Object.keys(GAMES).forEach((k) => {
    const b = document.createElement("button"); b.className = "chip" + (k === current ? " active" : ""); b.textContent = tr().tabs[k];
    b.onclick = () => openGame(k); $("gTabs").appendChild(b);
  });
  $("gTitle").textContent = tr().title; $("gBack").textContent = tr().back; document.title = "ManoSaathi · " + tr().title;
}
$("gLang").value = lang;
$("gLang").onchange = () => { lang = $("gLang").value; localStorage.setItem("ms_lang", lang); openGame(current); };
openGame("bubbles");
