# ManoSaathi

A bilingual (English / Hindi) mental-health first-aid chatbot, built as a
starter project for training your own intent-classification dataset.
Made for Amity University's InnoVenture 2026 challenge.

The person using the app picks **one** language at a time from a dropdown —
the whole interface and every reply switch to that language. Nothing is
mixed on screen.

## The two portals + games

| Page | URL (backend running) | Who it is for |
|---|---|---|
| User portal (chat) | `http://localhost:5000/` | Anyone. Simple chat, language switch, helplines. |
| Mini games | `http://localhost:5000/games` | Anyone. Pop the worries, memory match, breathing balloon, kind thoughts. |
| Admin portal | `http://localhost:5000/admin` | Counsellors/admins only. Login required. |

**How cases get into the admin portal:** chat messages are still never saved.
When a crisis phrase is detected the chat offers an *optional* "ask a counsellor
to contact me" form (the "Talk to a counsellor" button is always available too).
A record is created only if the person fills the form **and ticks the consent
box**. Crisis-flagged requests are marked `critical`, all others `serious`.
Admins can filter, mark new / contacted / closed, add notes, export CSV and
delete records.

**Admin login:** on first run the backend prints a generated admin password once
in the terminal. To choose your own, set `ADMIN_USERNAME` and `ADMIN_PASSWORD`
before the first run (the database is `backend/manosaathi.db`; delete it to reset).
Set `MANOSAATHI_SECRET` to keep admin sessions valid across restarts. The server
listens on 127.0.0.1 with debug off; before any real deployment use HTTPS, a
production server, and a proper security review, since this now holds contact
details of people who may be at risk.

## Replies: AI mode vs. offline mode

ManoSaathi can answer **anything** the person types using an AI model.
**When Hindi is selected, every reply is in Hindi (Devanagari)**, even if the
person types in English or Hinglish. With English selected, it replies in
English (or mirrors Hindi/Hinglish if the person writes that way). To switch it on, set your
key before starting the backend:

```
# Windows PowerShell
$env:ANTHROPIC_API_KEY="your-key-here"
python backend/app.py
# Windows cmd:  set ANTHROPIC_API_KEY=your-key-here
```

`GET /api/health` shows `"ai_enabled": true` when it is active. Without a key
(or if the AI call fails) the app falls back to offline mode: keyword/classifier
routing with several rotating replies per topic, never the same line twice in a row.
The default model is `claude-haiku-4-5-20251001`; override it with `MANOSAATHI_MODEL`.
Never put the key in the code or commit it.

**Safety layers, in order:** (1) a deterministic crisis phrase check (English,
Hinglish, Hindi) always runs first and returns a fixed, vetted reply plus
helplines; (2) the AI is also told to flag any hint of self-harm, which shows
the same helplines; (3) offline templates. In AI mode, message text is sent to
the AI provider to generate the reply, so the app's privacy note says so.

## Folder structure

```
manosaathi-project/
├── README.md
├── dataset/
│   ├── intents_dataset.csv   <- the trainable dataset (text, lang, intent)
│   └── helplines.json        <- crisis helpline numbers, bilingual
├── ml/
│   ├── train_model.py        <- trains the intent classifier from the CSV
│   ├── requirements.txt
│   └── model/
│       └── intent_model.joblib   <- a starter model, already trained once
├── backend/
│   ├── app.py                <- Flask API (chat, support requests, admin)
│   ├── responses.json        <- bilingual reply templates, per intent
│   └── requirements.txt
└── frontend/
    ├── index.html            <- user portal (chat)
    ├── admin.html / admin.js <- admin portal
    ├── games.html / games.js <- mini games
    ├── style.css
    └── app.js                <- language toggle + chat UI, calls the API
```

## Quick start

```bash
cd manosaathi-project

# 1. Backend
pip install -r backend/requirements.txt
python backend/app.py          # runs on http://localhost:5000

# 2. (Optional) retrain the classifier after editing the dataset
pip install -r ml/requirements.txt
python ml/train_model.py       # writes ml/model/intent_model.joblib

# 3. Frontend
# just open frontend/index.html in a browser -- no build step needed.
# (If your browser blocks local fetch() calls, serve it instead:
#  cd frontend && python -m http.server 8000, then open localhost:8000)
```

A pre-trained starter model is already included, so the backend works
immediately even before you run step 2. Retrain any time you grow the
dataset.

## How a message is handled (architecture)

```
frontend (index.html/app.js)
   │  POST /api/chat  { message, lang: "en" | "hi" }
   ▼
backend/app.py
   1. Crisis keyword/regex check (bilingual, deterministic) ─── always wins
   2. else: trained intent classifier (ml/train_model.py output)
        - only trusted if its confidence ≥ 0.35
   3. else: simple keyword fallback
   4. look up the reply for (intent, lang) in backend/responses.json
   ▼
frontend renders the reply, and shows the crisis banner + helpline
numbers if the message was flagged as a crisis
```

**Why this layering matters:** a text classifier trained on ~190 example
sentences is genuinely useful for routing everyday conversation ("I can't
sleep" → sleep tips), but it is not something to trust as the only safety
net for self-harm signals. That check is a plain keyword/regex match that
runs first and overrides everything else, on purpose.

## The dataset — and its current limits

`dataset/intents_dataset.csv` has 192 rows: 12 intents × 2 languages × 8
example sentences each (`greeting, thanks, anxiety, low_mood, sleep,
exam_stress, anger, loneliness, family, addiction, crisis, smalltalk`).

That's enough to prove the whole pipeline works end to end, but it's a
**seed dataset, not a finished one** — with only 8 examples per
intent/language, the trained classifier's hold-out accuracy is roughly
30-35% (see the printed classification report when you run
`train_model.py`). The keyword fallback and crisis regex cover the gap for
this prototype, but before relying on the model more heavily:

- Add more real (anonymised) examples per intent — aim for 50-100+ per
  language as a next milestone.
- Add **Romanised Hindi / Hinglish** examples (e.g. "mujhe bahut tension ho
  rahi hai") — right now Hindi rows are written in Devanagari only, but a
  lot of real typing on basic phones happens in Roman letters.
- Consider adding a few more regional languages the same way — just add
  rows with a new `lang` value and a matching block in `responses.json`.

## Extending it

- **New intent:** add rows to the CSV with a new `intent` value, add a
  matching key to both language blocks in `backend/responses.json`, then
  re-run `python ml/train_model.py`.
- **New language:** add rows with a new `lang` code, add a new top-level
  block to `responses.json` and `dataset/helplines.json`, and add an
  `<option>` + a `STRINGS` entry in `frontend/app.js`.
- **Swap the model:** `ml/train_model.py` is a plain scikit-learn
  `Pipeline` (TF-IDF + Logistic Regression). Swap in a different
  vectoriser/classifier there without touching the backend, as long as it
  still exposes `.predict_proba()`.

## Privacy & safety notes

- Chat messages are never stored or logged. The only data saved is the
  opt-in counsellor request form (see the portals section above). Keep it that way if you deploy this; a
  mental-health tool that logs conversations needs a much more careful
  consent and security design than a hackathon prototype.
- The crisis banner always shows Tele MANAS (14416), KIRAN
  (1800-599-0019), iCall, and Emergency (112) regardless of language.
- This is a prototype, not a diagnostic or medical device, and it doesn't
  replace a doctor, counsellor, or emergency service.

## Roadmap (for the pitch / Round 1 write-up)

1. **Pilot (month 1-2):** one campus or district, web + WhatsApp, linked to
   the local ASHA network for escalation.
2. **Reach every phone (month 3-4):** USSD/SMS gateway with a telecom
   partner so the same intents/responses reach basic keypad phones with no
   internet and no app — the backend's `/api/chat` logic is already
   phone-agnostic, it just needs a USSD/SMS adapter in front of it instead
   of the web frontend.
3. **Scale (month 5-8):** more languages (see "Extending it" above), and a
   direct escalation path into Tele MANAS / the District Mental Health
   Programme for anything the classifier flags as high-risk.
4. **Sustain / ROI:** CSR- or government-sponsored free SMS; cost per
   conversation is a fraction of one in-person visit, and fully anonymised
   aggregate intent trends (never raw text) could help district planners
   see where demand for which kind of support is highest.

## Deployment (GitHub + Render)

This project is configured so the Flask backend serves the frontend from the same origin.
The browser uses relative `/api/...` URLs, so no localhost URL needs to be changed after deployment.

For Render, use the included `render.yaml` or configure:
- Build command: `pip install -r backend/requirements.txt`
- Start command: `gunicorn backend.app:app --bind 0.0.0.0:$PORT --workers 1 --timeout 120`

Set these environment variables in the hosting dashboard:
- `ADMIN_USERNAME` — your private admin username
- `ADMIN_PASSWORD` — a strong private admin password
- `MANOSAATHI_SECRET` — a long random secret (Render can generate this)
- `ANTHROPIC_API_KEY` — optional; leave unset for offline/classifier mode
- `MANOSAATHI_MODEL` — optional AI model override

Never commit API keys, admin passwords, or the SQLite database to GitHub.

### Prototype deployment limitation

The counsellor-request data is stored in SQLite (`backend/manosaathi.db`). On a host with an ephemeral filesystem, that data may not survive a service restart/redeploy. For a public/real-world deployment, move case storage to a persistent managed database before collecting real personal contact information.

## Merged Innoventure build

The frontend in this build combines the original ManoSaathi backend-first architecture with the stronger interaction ideas from the companion UI prototype.

### Added in the merged build
- Polished dashboard-style user interface.
- Quick-start emotional topic cards.
- Well-being check-in explicitly framed as reflection, not diagnosis.
- Calm & grounding tools: breathing, 5-4-3-2-1 grounding, thought reframing and worry release.
- Keypad-phone interaction simulator demonstrating a low-bandwidth numbered-menu flow.
- Existing mini-games remain available on the dedicated games page.
- Existing Flask API, deterministic crisis safety layer, ML/keyword intent routing, privacy-first chat handling and consent-based counsellor workflow remain the core architecture.

### Important product boundary
The well-being check-in is not a clinical diagnostic tool. Crisis messages continue to use the backend's deterministic safety path before normal intent/AI replies.

### Demo flow
1. Open the home page and try English, Hindi or Hinglish chat.
2. Try a quick topic card.
3. Open Well-being Check-in and Calm & Grounding Tools.
4. Open Keypad Mode to demonstrate the basic-phone flow.
5. Trigger a crisis test phrase only in a controlled demo environment to show the crisis response and helplines.
6. Submit a counsellor request and show the case in the admin portal.
