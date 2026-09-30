// app.js -- ManoSaathi frontend
// Talks to the Flask backend at API_BASE. Change this if you deploy the
// backend somewhere other than your own machine.
const API_BASE = "";

const STRINGS = {
  en: {
    title: "ManoSaathi",
    tagline: "A mental-health companion for every phone, every language.",
    langLabel: "Language",
    placeholder: "Type in English...",
    send: "Send",
    crisisTitle: "Need to talk right now?",
    note: "ManoSaathi doesn't save your chat. To write replies, your messages may be processed by an AI service.",
    disclaimer: "This is a hackathon prototype, not a substitute for medical care. If you're in immediate danger, call 112.",
    greetingMsg: "Hi, I'm ManoSaathi. Pick a topic below, or just type what's on your mind.",
    backendDown: "Couldn't reach the backend. Make sure backend/app.py is running (see README), then try again.",
    topics: [
      { key: "anxiety", label: "Anxiety", starter: "I've been feeling really anxious lately." },
      { key: "low_mood", label: "Low mood", starter: "I've been feeling really low lately." },
      { key: "sleep", label: "Sleep", starter: "I can't sleep properly at night." },
      { key: "exam_stress", label: "Exam stress", starter: "I'm really stressed about my exams." },
      { key: "anger", label: "Anger", starter: "I've been getting angry very easily." },
      { key: "loneliness", label: "Loneliness", starter: "I feel really lonely these days." },
      { key: "family", label: "Family", starter: "There's a lot of tension at home right now." },
      { key: "addiction", label: "Addiction", starter: "I'm struggling to control a habit like drinking or smoking." }
    ],
    helplines: [
      { name: "Tele MANAS", number: "14416", note: "Call or SMS, free, 24x7" },
      { name: "KIRAN", number: "1800-599-0019", note: "Government helpline" },
      { name: "iCall", number: "9152987821", note: "Mon-Sat" },
      { name: "Emergency", number: "112", note: "If you're in immediate danger" }
    ]
  },
  hi: {
    title: "मनोसाथी",
    tagline: "हर फ़ोन और हर भाषा के लिए एक साथी।",
    langLabel: "भाषा",
    placeholder: "हिंदी में लिखें...",
    send: "भेजें",
    crisisTitle: "अभी बात करनी है?",
    note: "मनोसाथी आपकी चैट सेव नहीं करता। जवाब लिखने के लिए आपके मैसेज एक AI सेवा से प्रोसेस हो सकते हैं।",
    disclaimer: "यह एक हैकाथॉन प्रोटोटाइप है, मेडिकल इलाज का विकल्प नहीं। तुरंत खतरे में हों तो 112 पर कॉल करें।",
    greetingMsg: "नमस्ते, मैं मनोसाथी हूं। नीचे कोई topic चुनिए, या जो मन में है सीधे लिखिए।",
    backendDown: "बैकएंड से जुड़ नहीं पाया। backend/app.py चला हुआ है या नहीं देख लीजिए (README देखें), फिर कोशिश करें।",
    topics: [
      { key: "anxiety", label: "चिंता", starter: "मुझे आजकल बहुत चिंता होती है।" },
      { key: "low_mood", label: "उदासी", starter: "मन आजकल बहुत उदास रहता है।" },
      { key: "sleep", label: "नींद", starter: "रात को ठीक से नींद नहीं आती।" },
      { key: "exam_stress", label: "पढ़ाई तनाव", starter: "परीक्षा को लेकर बहुत तनाव है।" },
      { key: "anger", label: "गुस्सा", starter: "मुझे बहुत जल्दी गुस्सा आ जाता है।" },
      { key: "loneliness", label: "अकेलापन", starter: "मैं आजकल बहुत अकेला महसूस करता हूं।" },
      { key: "family", label: "परिवार", starter: "घर में आजकल बहुत तनाव है।" },
      { key: "addiction", label: "नशा", starter: "मैं अपनी शराब या सिगरेट की आदत को काबू नहीं कर पा रहा।" }
    ],
    helplines: [
      { name: "Tele MANAS", number: "14416", note: "कॉल या SMS, मुफ़्त, 24x7" },
      { name: "KIRAN", number: "1800-599-0019", note: "सरकारी हेल्पलाइन" },
      { name: "iCall", number: "9152987821", note: "सोम-शनि" },
      { name: "आपातकाल", number: "112", note: "तुरंत खतरे में हों तो" }
    ]
  }
};

Object.assign(STRINGS.en, {
  games: "Mini games", talk: "Talk to a counsellor",
  offer: "Would you like a counsellor to reach out to you? Tap here (optional).",
  sfTitle: "Ask a counsellor to contact you",
  sfIntro: "This is optional. Only what you type in this form is saved, and only ManoSaathi admins can see it. Your chat itself is never saved.",
  sfName: "Your name (optional)", sfContact: "Phone number or email", sfMsg: "Anything you'd like them to know (optional)",
  sfConsent: "I agree to share these details so a counsellor can contact me.",
  sfCancel: "Cancel", sfSend: "Send request",
  sfOk: "Thank you. A counsellor will reach out. If you need help right now, call Tele MANAS 14416 or 112.",
  sfErr: "Couldn't send. Please try again, or call Tele MANAS 14416."
});
Object.assign(STRINGS.hi, {
  games: "मिनी गेम्स", talk: "काउंसलर से बात करें",
  offer: "क्या आप चाहेंगे कि कोई काउंसलर आपसे संपर्क करे? यहां टैप करें (वैकल्पिक)।",
  sfTitle: "काउंसलर से संपर्क का अनुरोध करें",
  sfIntro: "यह वैकल्पिक है। सिर्फ़ वही जानकारी सेव होती है जो आप इस फ़ॉर्म में लिखते हैं, और उसे केवल मनोसाथी के एडमिन देख सकते हैं। आपकी चैट कभी सेव नहीं होती।",
  sfName: "आपका नाम (वैकल्पिक)", sfContact: "फ़ोन नंबर या ईमेल", sfMsg: "कुछ और बताना चाहें तो (वैकल्पिक)",
  sfConsent: "मैं सहमत हूं कि काउंसलर मुझसे संपर्क कर सके, इसके लिए ये जानकारी साझा की जाए।",
  sfCancel: "रद्द करें", sfSend: "अनुरोध भेजें",
  sfOk: "धन्यवाद। एक काउंसलर आपसे संपर्क करेगा। अभी मदद चाहिए तो Tele MANAS 14416 या 112 पर कॉल करें।",
  sfErr: "भेज नहीं पाया। फिर कोशिश करें, या Tele MANAS 14416 पर कॉल करें।"
});


Object.assign(STRINGS.en, {
  heroTitle: "A safe first step when your mind feels heavy.", heroSub: "Talk to ManoSaathi, try a calming tool, or connect with a counsellor when you choose.",
  support: "I need support", online: "ManoSaathi support online", privacy: "Chat is not stored", chatTitle: "AI support companion", chatSub: "English, Hindi and Hinglish supported.",
  wbTitle: "How have you been feeling?", wbIntro: "Choose what feels closest. This is a reflection tool, not a diagnosis.",
  toolsTitle: "Calm & grounding tools", toolsSub: "Breathing, grounding and thought reframing", keypadTitle: "Keypad-phone mode", keypadSub: "A prototype menu for basic phones",
  humanTitle: "Human support", humanSub: "Request a counsellor — optional", toolsNav: "🧘 Tools", keypadNav: "📟 Keypad mode",
  wbOptions: [
    ["😌", "Mostly okay", "I feel generally okay"], ["😰", "Anxious or tense", "My mind feels overactive"], ["😔", "Low or drained", "I have been feeling down"], ["😴", "Sleep trouble", "My sleep has been difficult"], ["🧍", "Lonely", "I want more connection"], ["📚", "Overwhelmed", "Study/work feels too much"]
  ],
  wbResults: {
    calm: "Thanks for checking in. Keep doing what is helping, and remember you can talk to ManoSaathi whenever you need a listening space.",
    anxious: "A small next step: try the breathing tool for one minute, then tell ManoSaathi what is making you feel tense.",
    low: "You do not have to solve everything at once. Consider a small supportive step and, if this feeling persists or worsens, consider talking with a trusted person or counsellor.",
    sleep: "Try the breathing tool before bed and keep the next step small. If sleep problems persist, consider speaking with a healthcare professional.",
    lonely: "Connection can start small. You could message one trusted person, or use the counsellor request if you would like human support.",
    overwhelmed: "Let's break it into one small step. Try a grounding exercise, then use the chat to talk through what feels most urgent."
  },
  kpTitle: "Keypad-phone mode", kpIntro: "Prototype of a low-bandwidth menu flow. No real telecom connection is used in this demo.",
  qAnxiety:"Anxious",qAnxietySub:"Help me calm down",qLow:"Low mood",qLowSub:"I want to talk",qExam:"Exam stress",qExamSub:"I'm overwhelmed",qSleep:"Sleep",qSleepSub:"Help me relax",
  toolModalTitle:"Calm & grounding tools"
});
Object.assign(STRINGS.hi, {
  heroTitle: "जब मन भारी लगे, यहां से शुरुआत करें।", heroSub: "मनोसाथी से बात करें, शांत करने वाला टूल आज़माएं या अपनी इच्छा से काउंसलर से जुड़ें।",
  support: "मुझे अभी मदद चाहिए", online: "मनोसाथी सहायता ऑनलाइन", privacy: "चैट सेव नहीं होती", chatTitle: "एआई सहायता साथी", chatSub: "हिंदी, अंग्रेज़ी और हिंग्लिश समर्थित है।",
  wbTitle: "आप हाल में कैसा महसूस कर रहे हैं?", wbIntro: "जो सबसे करीब लगे उसे चुनें। यह केवल रिफ्लेक्शन टूल है, निदान नहीं।",
  toolsTitle: "शांत और ग्राउंडिंग टूल्स", toolsSub: "सांस, ग्राउंडिंग और विचारों को रीफ्रेम करें", keypadTitle: "कीपैड-फोन मोड", keypadSub: "बेसिक फोन के लिए प्रोटोटाइप मेन्यू", humanTitle: "मानवीय सहायता", humanSub: "काउंसलर से संपर्क का अनुरोध — वैकल्पिक", toolsNav: "🧘 टूल्स", keypadNav: "📟 कीपैड मोड",
  wbOptions: [["😌","ठीक-ठाक","मैं सामान्य रूप से ठीक महसूस कर रहा हूं"],["😰","चिंता या तनाव","दिमाग बहुत चल रहा है"],["😔","उदास या थका","मन भारी लग रहा है"],["😴","नींद की परेशानी","नींद ठीक नहीं है"],["🧍","अकेलापन","मुझे जुड़ाव चाहिए"],["📚","बहुत दबाव","पढ़ाई/काम बहुत ज्यादा लग रहा है"]],
  wbResults: {calm:"चेक-इन करने के लिए धन्यवाद। जो चीजें मदद कर रही हैं उन्हें जारी रखें। जब चाहें मनोसाथी से बात कर सकते हैं।",anxious:"एक छोटा कदम: एक मिनट का ब्रीदिंग टूल आज़माएं, फिर मनोसाथी को बताएं कि तनाव किस वजह से है।",low:"सब कुछ एक साथ हल करना जरूरी नहीं। एक छोटा सहायक कदम लें और अगर यह भावना बनी रहे या बढ़े तो किसी भरोसेमंद व्यक्ति या काउंसलर से बात करने पर विचार करें।",sleep:"सोने से पहले ब्रीदिंग टूल आज़माएं और अगला कदम छोटा रखें। अगर नींद की परेशानी बनी रहे तो स्वास्थ्य विशेषज्ञ से बात करने पर विचार करें।",lonely:"जुड़ाव की शुरुआत छोटी हो सकती है। किसी भरोसेमंद व्यक्ति को मैसेज करें या चाहें तो काउंसलर रिक्वेस्ट भेजें।",overwhelmed:"इसे एक छोटे कदम में बांटते हैं। ग्राउंडिंग एक्सरसाइज करें, फिर चैट में बताएं कि अभी सबसे जरूरी क्या लग रहा है।"},
  kpTitle:"कीपैड-फोन मोड",kpIntro:"लो-बैंडविड्थ मेन्यू फ्लो का प्रोटोटाइप। इस डेमो में वास्तविक टेलीकॉम कनेक्शन नहीं है।",
  qAnxiety:"चिंता",qAnxietySub:"शांत होने में मदद",qLow:"उदासी",qLowSub:"बात करना है",qExam:"पढ़ाई तनाव",qExamSub:"बहुत दबाव है",qSleep:"नींद",qSleepSub:"आराम करना है",toolModalTitle:"शांत और ग्राउंडिंग टूल्स"
});


// ---- Hindi/English text for the tools and the keypad simulator ----
STRINGS.en.tl = {
  tabs: [["Breathing", "Slow your breathing"], ["5-4-3-2-1", "Anchor to the present"], ["Reframe", "Find a balanced thought"], ["Release worries", "Tap away a worry"]],
  breatheMsg: "Breathe in slowly", start: "Start", stop: "Stop", phases: ["Breathe in", "Hold", "Breathe out"],
  ground: ["5 things you can see", "4 things you can touch", "3 things you can hear", "2 things you can smell", "1 thing you can taste"],
  groundSuffix: " \u2014 take a moment to notice them.", next: "Next", done: "Done",
  thoughtLabel: "Thought:", thought: "\u201cOne mistake means I am a failure.\u201d", which: "Which is more balanced?",
  good: "\u201cA mistake is one event; I can learn and improve.\u201d",
  goodMsg: "Good reframe: it acknowledges the mistake without turning it into a judgment about your whole self.",
  worries: ["Overthinking", "Self-doubt", "Pressure", "Fear of failure", "Perfectionism"],
  worryNote: "Tap a worry to replace it with a kinder statement.", worryDone: "One small step at a time is enough."
};
STRINGS.hi.tl = {
  tabs: [["\u0938\u093e\u0902\u0938", "\u0938\u093e\u0902\u0938 \u0927\u0940\u092e\u0940 \u0915\u0930\u0947\u0902"], ["5-4-3-2-1", "\u0905\u092d\u0940 \u092e\u0947\u0902 \u0932\u094c\u091f\u0947\u0902"], ["\u0930\u0940\u092b\u094d\u0930\u0947\u092e", "\u0938\u0902\u0924\u0941\u0932\u093f\u0924 \u0935\u093f\u091a\u093e\u0930 \u0916\u094b\u091c\u0947\u0902"], ["\u091a\u093f\u0902\u0924\u093e \u091b\u094b\u0921\u093c\u0947\u0902", "\u091a\u093f\u0902\u0924\u093e \u092a\u0930 \u091f\u0948\u092a \u0915\u0930\u0947\u0902"]],
  breatheMsg: "\u0927\u0940\u092e\u0947 \u0938\u0947 \u0938\u093e\u0902\u0938 \u0932\u0947\u0902", start: "\u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902", stop: "\u0930\u094b\u0915\u0947\u0902", phases: ["\u0938\u093e\u0902\u0938 \u0932\u0947\u0902", "\u0930\u094b\u0915\u0947\u0902", "\u0938\u093e\u0902\u0938 \u091b\u094b\u0921\u093c\u0947\u0902"],
  ground: ["5 \u091a\u0940\u091c\u093c\u0947\u0902 \u091c\u094b \u0906\u092a \u0926\u0947\u0916 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902", "4 \u091a\u0940\u091c\u093c\u0947\u0902 \u091c\u093f\u0928\u094d\u0939\u0947\u0902 \u0906\u092a \u091b\u0942 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902", "3 \u0906\u0935\u093e\u091c\u093c\u0947\u0902 \u091c\u094b \u0906\u092a \u0938\u0941\u0928 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902", "2 \u091a\u0940\u091c\u093c\u0947\u0902 \u091c\u093f\u0928\u0915\u0940 \u0917\u0902\u0927 \u0906\u092a \u092e\u0939\u0938\u0942\u0938 \u0915\u0930 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902", "1 \u091a\u0940\u091c\u093c \u091c\u093f\u0938\u0915\u093e \u0938\u094d\u0935\u093e\u0926 \u0906\u092a \u0932\u0947 \u0938\u0915\u0924\u0947 \u0939\u0948\u0902"],
  groundSuffix: " \u2014 \u0907\u0928\u094d\u0939\u0947\u0902 \u092e\u0939\u0938\u0942\u0938 \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f \u090f\u0915 \u092a\u0932 \u0930\u0941\u0915\u0947\u0902\u0964", next: "\u0905\u0917\u0932\u093e", done: "\u092a\u0942\u0930\u093e \u0939\u0941\u0906",
  thoughtLabel: "\u0935\u093f\u091a\u093e\u0930:", thought: "\u201c\u090f\u0915 \u0917\u0932\u0924\u0940 \u092f\u093e\u0928\u0940 \u092e\u0948\u0902 \u092a\u0942\u0930\u0940 \u0924\u0930\u0939 \u0905\u0938\u092b\u0932 \u0939\u0942\u0902\u0964\u201d", which: "\u0907\u0928\u092e\u0947\u0902 \u091c\u093c\u094d\u092f\u093e\u0926\u093e \u0938\u0902\u0924\u0941\u0932\u093f\u0924 \u0915\u094c\u0928 \u0938\u093e \u0939\u0948?",
  good: "\u201c\u0917\u0932\u0924\u0940 \u092c\u0938 \u090f\u0915 \u0918\u091f\u0928\u093e \u0939\u0948; \u0909\u0938\u0938\u0947 \u0938\u0940\u0916\u0915\u0930 \u0906\u0917\u0947 \u092c\u0922\u093c\u093e \u091c\u093e \u0938\u0915\u0924\u093e \u0939\u0948\u0964\u201d",
  goodMsg: "\u0905\u091a\u094d\u091b\u093e \u0930\u0940\u092b\u094d\u0930\u0947\u092e: \u092f\u0939 \u0917\u0932\u0924\u0940 \u0915\u094b \u092e\u093e\u0928\u0924\u093e \u0939\u0948, \u092a\u0930 \u0909\u0938\u0947 \u0906\u092a\u0915\u0940 \u092a\u0942\u0930\u0940 \u092a\u0939\u091a\u093e\u0928 \u092a\u0930 \u092b\u093c\u0948\u0938\u0932\u093e \u0928\u0939\u0940\u0902 \u092c\u0928\u0928\u0947 \u0926\u0947\u0924\u093e\u0964",
  worries: ["\u091c\u093c\u094d\u092f\u093e\u0926\u093e \u0938\u094b\u091a\u0928\u093e", "\u0916\u0941\u0926 \u092a\u0930 \u0936\u0915", "\u0926\u092c\u093e\u0935", "\u0905\u0938\u092b\u0932\u0924\u093e \u0915\u093e \u0921\u0930", "\u092a\u0930\u092b\u0947\u0915\u094d\u0936\u0928\u093f\u091c\u093c\u094d\u092e"],
  worryNote: "\u0915\u093f\u0938\u0940 \u091a\u093f\u0902\u0924\u093e \u092a\u0930 \u091f\u0948\u092a \u0915\u0930\u0947\u0902, \u0909\u0938\u0915\u0940 \u091c\u0917\u0939 \u090f\u0915 \u0928\u0930\u092e \u0935\u093e\u0915\u094d\u092f \u0906 \u091c\u093e\u090f\u0917\u093e\u0964", worryDone: "\u090f\u0915 \u092c\u093e\u0930 \u092e\u0947\u0902 \u090f\u0915 \u091b\u094b\u091f\u093e \u0915\u0926\u092e \u0915\u093e\u092b\u093c\u0940 \u0939\u0948\u0964"
};
STRINGS.en.kp = {
  home: "Welcome to ManoSaathi\n\n1 Stress / anxiety\n2 Low mood\n3 Sleep\n4 Talk to counsellor\n5 Emergency help",
  stress: "Stress / anxiety\n\n1 Breathing\n2 Talk to ManoSaathi\n3 Back",
  breathing: "Breathing\n\nInhale 4s\nHold 4s\nExhale 6s\n\nRepeat for a few cycles.",
  emergency: "If you are in immediate danger, call 112.\n\nTele MANAS: 14416",
  stressMsg: "I am feeling stressed and need support.", reset: "Reset"
};
STRINGS.hi.kp = {
  home: "\u092e\u0928\u094b\u0938\u093e\u0925\u0940 \u092e\u0947\u0902 \u0938\u094d\u0935\u093e\u0917\u0924 \u0939\u0948\n\n1 \u0924\u0928\u093e\u0935 / \u091a\u093f\u0902\u0924\u093e\n2 \u0909\u0926\u093e\u0938\u0940\n3 \u0928\u0940\u0902\u0926\n4 \u0915\u093e\u0909\u0902\u0938\u0932\u0930 \u0938\u0947 \u092c\u093e\u0924\n5 \u0906\u092a\u093e\u0924\u0915\u093e\u0932\u0940\u0928 \u092e\u0926\u0926",
  stress: "\u0924\u0928\u093e\u0935 / \u091a\u093f\u0902\u0924\u093e\n\n1 \u0938\u093e\u0902\u0938 \u0915\u093e \u0905\u092d\u094d\u092f\u093e\u0938\n2 \u092e\u0928\u094b\u0938\u093e\u0925\u0940 \u0938\u0947 \u092c\u093e\u0924\n3 \u0935\u093e\u092a\u0938",
  breathing: "\u0938\u093e\u0902\u0938 \u0915\u093e \u0905\u092d\u094d\u092f\u093e\u0938\n\n\u0938\u093e\u0902\u0938 \u0932\u0947\u0902 4 \u0938\u0947\u0915\u0902\u0921\n\u0930\u094b\u0915\u0947\u0902 4 \u0938\u0947\u0915\u0902\u0921\n\u091b\u094b\u0921\u093c\u0947\u0902 6 \u0938\u0947\u0915\u0902\u0921\n\n\u0915\u0941\u091b \u092c\u093e\u0930 \u0926\u094b\u0939\u0930\u093e\u090f\u0902\u0964",
  emergency: "\u0924\u0941\u0930\u0902\u0924 \u0916\u0924\u0930\u0947 \u092e\u0947\u0902 \u0939\u094b\u0902 \u0924\u094b 112 \u092a\u0930 \u0915\u0949\u0932 \u0915\u0930\u0947\u0902\u0964\n\nTele MANAS: 14416",
  stressMsg: "\u092e\u0941\u091d\u0947 \u0906\u091c\u0915\u0932 \u092c\u0939\u0941\u0924 \u0924\u0928\u093e\u0935 \u0914\u0930 \u091a\u093f\u0902\u0924\u093e \u0930\u0939\u0924\u0940 \u0939\u0948\u0964", reset: "\u0930\u0940\u0938\u0947\u091f"
};

function topicStarter(key) {
  const tp = t().topics.filter(function (x) { return x.key === key; })[0];
  return tp ? tp.starter : "";
}

let currentLang = "en";
let chatLog = [];
let crisisFlagged = false;  // set once a crisis message is detected in this session

function t() { return STRINGS[currentLang]; }

function applyStrings() {
  const s = t();
  document.getElementById("txtTitle").textContent = s.title;
  document.getElementById("txtTagline").textContent = s.tagline;
  document.getElementById("txtLangLabel").textContent = s.langLabel;
  document.getElementById("chatInput").placeholder = s.placeholder;
  document.getElementById("sendBtn").textContent = s.send;
  document.getElementById("txtCrisisTitle").textContent = s.crisisTitle;
  document.getElementById("txtNote").textContent = s.note;
  document.getElementById("txtDisclaimer").textContent = s.disclaimer;
  document.title = s.title;
  const setIf = (id,v) => { const el=document.getElementById(id); if(el) el.textContent=v; };
  setIf("heroTitle",s.heroTitle); setIf("heroSub",s.heroSub); setIf("heroHelpTxt",s.support); setIf("statusText",s.online); setIf("privacyText",s.privacy);
  setIf("chatTitle",s.chatTitle); setIf("chatSub",s.chatSub); setIf("wellbeingTitle",s.wbTitle); setIf("wellbeingSub",s.wbIntro); setIf("toolsTitle",s.toolsTitle); setIf("toolsSub",s.toolsSub); setIf("keypadTitle",s.keypadTitle); setIf("keypadSub",s.keypadSub); setIf("counsellorTitle",s.humanTitle); setIf("counsellorSub",s.humanSub);
  setIf("btnTools",s.toolsNav); setIf("btnKeypad",s.keypadNav); setIf("btnTools",s.toolsNav); setIf("toolModalTitle",s.toolModalTitle); setIf("wbTitle",s.wbTitle); setIf("wbIntro",s.wbIntro); setIf("kpTitle",s.kpTitle); setIf("kpIntro",s.kpIntro);
  setIf("qAnxiety",s.qAnxiety); setIf("qAnxietySub",s.qAnxietySub); setIf("qLow",s.qLow); setIf("qLowSub",s.qLowSub); setIf("qExam",s.qExam); setIf("qExamSub",s.qExamSub); setIf("qSleep",s.qSleep); setIf("qSleepSub",s.qSleepSub);

  t().tl.tabs.forEach(function (tb, n) { setIf("tb" + (n + 1), tb[0]); setIf("tbs" + (n + 1), tb[1]); });
  setIf("kpReset", t().kp.reset);

  renderChips();
  renderCrisisBody();
  applyExtra();
}

function applyExtra() {
  const s = t(), set = (id, v) => { document.getElementById(id).textContent = v; };
  set("lnkGames", s.games); set("btnTalk", s.talk); set("sfTitle", s.sfTitle); set("sfIntro", s.sfIntro);
  set("sfConsentTxt", s.sfConsent); set("sfCancel", s.sfCancel); set("sfSend", s.sfSend);
  document.getElementById("sfName").placeholder = s.sfName;
  document.getElementById("sfContact").placeholder = s.sfContact;
  document.getElementById("sfMsg").placeholder = s.sfMsg;
}

function openSupport() {
  document.getElementById("sfStatus").textContent = "";
  document.getElementById("supportModal").hidden = false;
}

function initSupport() {
  const modal = document.getElementById("supportModal");
  document.getElementById("btnTalk").addEventListener("click", openSupport);
  document.getElementById("sfCancel").addEventListener("click", function () { modal.hidden = true; });
  document.getElementById("supportForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const status = document.getElementById("sfStatus");
    try {
      const res = await fetch(API_BASE + "/api/support-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: document.getElementById("sfName").value,
          contact: document.getElementById("sfContact").value,
          message: document.getElementById("sfMsg").value,
          consent: document.getElementById("sfConsent").checked,
          flagged: crisisFlagged,
          lang: currentLang
        })
      });
      if (!res.ok) throw new Error("bad status " + res.status);
      e.target.reset();
      status.textContent = t().sfOk;
    } catch (err) {
      status.textContent = t().sfErr;
    }
  });
}

function renderChips() {
  const row = document.getElementById("chipsRow");
  row.innerHTML = "";
  t().topics.forEach(function (topic) {
    const b = document.createElement("button");
    b.className = "chip";
    b.textContent = topic.label;
    b.addEventListener("click", function () { sendMessage(topic.starter); });
    row.appendChild(b);
  });
}

function renderCrisisBody() {
  const body = document.getElementById("crisisBody");
  body.innerHTML = "";
  t().helplines.forEach(function (h) {
    const div = document.createElement("div");
    div.className = "crisis-item";
    div.innerHTML = "<b>" + escapeHtml(h.name) + " \u00b7 " + escapeHtml(h.number) + "</b>" + escapeHtml(h.note);
    body.appendChild(div);
  });
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderChat() {
  const box = document.getElementById("chatbox");
  box.innerHTML = "";
  chatLog.forEach(function (m) {
    if (m.role === "offer") {
      const b = document.createElement("button");
      b.className = "msg offer"; b.textContent = m.text; b.addEventListener("click", openSupport);
      box.appendChild(b);
      return;
    }
    const div = document.createElement("div");
    div.className = "msg " + m.role;
    div.textContent = m.text;
    box.appendChild(div);
  });
  box.scrollTop = box.scrollHeight;
}

function buildHistory() {
  // last few turns (before the message being sent), so replies can follow the conversation
  return chatLog.slice(0, -1)
    .filter(function (m) { return m.role === "user" || m.role === "bot" || m.role === "crisis"; })
    .slice(-10)
    .map(function (m) { return { role: m.role === "user" ? "user" : "assistant", text: m.text }; });
}

async function sendMessage(text) {
  if (!text || !text.trim()) return;
  chatLog.push({ role: "user", text: text });
  const history = buildHistory();
  chatLog.push({ role: "typing", text: "..." });
  renderChat();

  try {
    const res = await fetch(API_BASE + "/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, lang: currentLang, history: history })
    });
    if (!res.ok) throw new Error("bad status " + res.status);
    const data = await res.json();

    chatLog = chatLog.filter(function (m) { return m.role !== "typing"; });
    chatLog.push({ role: data.crisis ? "crisis" : "bot", text: data.reply });
    if (data.crisis) {
      crisisFlagged = true;
      chatLog.push({ role: "offer", text: t().offer });
      document.getElementById("crisisBody").classList.add("open");  // show helplines right away
    }
    renderChat();
  } catch (err) {
    chatLog = chatLog.filter(function (m) { return m.role !== "typing"; });
    chatLog.push({ role: "error", text: t().backendDown });
    renderChat();
  }
}

function initLangSwitch() {
  const select = document.getElementById("langSelect");
  select.value = localStorage.getItem("ms_lang") === "hi" ? "hi" : currentLang;
  select.addEventListener("change", function () {
    currentLang = select.value;
    localStorage.setItem("ms_lang", currentLang);
    document.documentElement.lang = currentLang;
    applyStrings();
    // Restart the visible conversation in the newly chosen language so the
    // whole chat reads in one language at a time, as requested.
    chatLog = [{ role: "bot", text: t().greetingMsg }];
    renderChat();
  });
}

function initCrisisToggle() {
  const toggle = document.getElementById("crisisToggle");
  const body = document.getElementById("crisisBody");
  toggle.addEventListener("click", function () {
    body.classList.toggle("open");
  });
}

function initComposer() {
  const form = document.getElementById("composerForm");
  const input = document.getElementById("chatInput");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const value = input.value;
    input.value = "";
    sendMessage(value);
  });
}


function initQuickActions(){
  document.querySelectorAll('.quick-card').forEach(function(b){ b.addEventListener('click',function(){ sendMessage(topicStarter(b.dataset.key)); }); });
  ['heroHelp','counsellorBtn'].forEach(function(id){ const e=document.getElementById(id); if(e) e.addEventListener('click',openSupport); });
  ['btnTools','toolsBtn'].forEach(function(id){ const e=document.getElementById(id); if(e) e.addEventListener('click',function(){ document.getElementById('toolsModal').hidden=false; renderToolStage('breathe'); }); });
  ['btnKeypad','keypadBtn'].forEach(function(id){ const e=document.getElementById(id); if(e) e.addEventListener('click',openKeypad); });
  document.getElementById('wellbeingBtn').addEventListener('click',openWellbeing);
  document.querySelectorAll('[data-close]').forEach(function(e){ e.addEventListener('click',function(){ document.getElementById(e.dataset.close).hidden=true; }); });
  document.getElementById('sfClose').addEventListener('click',function(){document.getElementById('supportModal').hidden=true;});
}

function openWellbeing(){
  const modal=document.getElementById('wellbeingModal'); modal.hidden=false;
  const box=document.getElementById('wbOptions'); box.innerHTML=''; document.getElementById('wbResult').hidden=true;
  t().wbOptions.forEach(function(o,i){ const b=document.createElement('button'); b.innerHTML='<span style="font-size:1.4rem">'+o[0]+'</span><b>'+escapeHtml(o[1])+'</b><small>'+escapeHtml(o[2])+'</small>'; b.onclick=function(){showWellbeingResult(i)}; box.appendChild(b); });
}
function showWellbeingResult(i){
  const keys=['calm','anxious','low','sleep','lonely','overwhelmed']; const r=document.getElementById('wbResult'); r.hidden=false; r.textContent=t().wbResults[keys[i]];
}
function renderToolStage(tool){
  const s=document.getElementById('toolStage'), L=t().tl;
  if(tool==='breathe'){
    s.innerHTML='<div class="breath-demo"><div class="circle" id="toolCircle"></div></div><p id="toolMsg" class="note" style="text-align:center">'+escapeHtml(L.breatheMsg)+'</p><button class="primary" id="toolStart">'+escapeHtml(L.start)+'</button>';
    let running=false,timer;
    document.getElementById('toolStart').onclick=function(){
      if(running){running=false;clearTimeout(timer);this.textContent=L.start;return;}
      running=true;this.textContent=L.stop;let phase=0;
      const run=()=>{
        if(!running)return;
        const c=document.getElementById('toolCircle'),m=document.getElementById('toolMsg');
        if(!c||!m){running=false;return;}
        const phases=[[L.phases[0],1.35],[L.phases[1],1.35],[L.phases[2],.7]];
        m.textContent=phases[phase][0];
        c.style.transform=phase===2?'scale(.7)':'scale(1.45)';
        timer=setTimeout(()=>{phase=(phase+1)%3;run()},phases[phase][1]*1000);
      };
      run();
    };
  } else if(tool==='ground'){
    let i=0;
    s.innerHTML='<div class="ground-steps"><p id="groundText"></p><button class="primary" id="groundNext"></button></div>';
    const draw=()=>{document.getElementById('groundText').textContent=L.ground[i]+L.groundSuffix;document.getElementById('groundNext').textContent=i===4?L.done:L.next;};
    document.getElementById('groundNext').onclick=()=>{ i = i<4 ? i+1 : 0; draw(); };
    draw();
  } else if(tool==='reframe'){
    s.innerHTML='<p><b>'+escapeHtml(L.thoughtLabel)+'</b> '+escapeHtml(L.thought)+'</p><p class="note">'+escapeHtml(L.which)+'</p><button class="primary" id="refGood">'+escapeHtml(L.good)+'</button><p id="refMsg" class="note"></p>';
    document.getElementById('refGood').onclick=()=>{document.getElementById('refMsg').textContent=L.goodMsg;};
  } else {
    s.innerHTML='<p class="note">'+escapeHtml(L.worryNote)+'</p><div id="worryGrid" class="checkin-options"></div>';
    const grid=document.getElementById('worryGrid');
    L.worries.forEach(w=>{const b=document.createElement('button');b.textContent='\uD83C\uDF88 '+w;b.onclick=()=>{b.textContent='\uD83C\uDF31 '+L.worryDone;b.disabled=true;};grid.appendChild(b);});
  }
}
function initTools(){ document.querySelectorAll('#toolsModal [data-tool]').forEach(function(b){b.addEventListener('click',function(){renderToolStage(b.dataset.tool)});}); }
function openKeypad(){
  const modal=document.getElementById('keypadModal'); modal.hidden=false;
  const screen=document.getElementById('kpScreen'); const keys=document.getElementById('kpKeys');
  const K=t().kp;
  const render=(text,items)=>{
    screen.innerHTML='<div style="white-space:pre-line">'+escapeHtml(text)+'</div>';
    keys.innerHTML=''; items.forEach(function(item){ const b=document.createElement('button'); b.textContent=item[0]; b.onclick=item[1]; keys.appendChild(b); });
  };
  const chat=(msg)=>{modal.hidden=true;sendMessage(msg);};
  const home=()=>render(K.home,[
    ['1',()=>stress()],['2',()=>chat(topicStarter('low_mood'))],['3',()=>chat(topicStarter('sleep'))],['4',()=>{modal.hidden=true;openSupport();}],['5',()=>emergency()],['0',home]
  ]);
  const stress=()=>render(K.stress,[
    ['1',()=>render(K.breathing,[['0',home]])],
    ['2',()=>chat(K.stressMsg)],['3',home]
  ]);
  const emergency=()=>render(K.emergency,[['0',home]]);
  home(); document.getElementById('kpReset').onclick=home;
}

// If an OLD backend is still running (common: the previous terminal was never closed),
// tell the person instead of silently giving old-style replies.
async function checkBackendVersion() {
  try {
    const h = await (await fetch(API_BASE + "/api/health")).json();
    if (!h.build) {
      chatLog.push({ role: "error", text: "Developer notice: an OLD ManoSaathi backend is running. Close every terminal running app.py, then start backend/app.py again from the newest folder." });
      renderChat();
    }
  } catch (err) { /* backend not reachable; sendMessage() will show the normal error */ }
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("ms_lang") === "hi") { currentLang = "hi"; document.documentElement.lang = "hi"; }
  initSupport();
  initLangSwitch();
  initCrisisToggle();
  initComposer();
  initQuickActions();
  initTools();
  applyStrings();
  chatLog = [{ role: "bot", text: t().greetingMsg }];
  renderChat();
  checkBackendVersion();
});
