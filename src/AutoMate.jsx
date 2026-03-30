import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { supabase } from "./supabaseClient";

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTO-MATE v4.0 — Production Build with Supabase
//  Real Auth · Real Database · Real-time Messaging · AI Proxy · 3D Effects
//  automatedate.app
// ═══════════════════════════════════════════════════════════════════════════════

// ── SEED PROFILES (shown before real users exist) ────────────────────────────
const SEED = [
  {id:"seed-1",name:"Sophia",age:27,bio:"Coffee addict ☕ | Sunset chaser 🌅 | Dog mom who'll show you 400 photos on the first date 🐕",status:"online",photo_url:"https://i.pravatar.cc/300?img=1",interests:["Travel","Photography","Yoga"],verified:true,city:"Seattle",job:"UX Designer",gender:"Woman",goals:"Long-term relationship",values:["Honesty","Adventure","Growth"],lifestyle:"Very active & outdoorsy",comm_style:"Words of Affirmation",intimacy:8},
  {id:"seed-2",name:"Marcus",age:28,bio:"Rock climber who reads philosophy at camp. Will make you the best espresso you've ever had ☕🧗",status:"online",photo_url:"https://i.pravatar.cc/300?img=51",interests:["Hiking","Cooking","Reading"],verified:true,city:"Denver",job:"Data Scientist",gender:"Man",goals:"Long-term relationship",values:["Honesty","Growth","Adventure"],lifestyle:"Very active & outdoorsy",comm_style:"Quality Time",intimacy:7},
  {id:"seed-3",name:"Ava",age:29,bio:"Artist who paints at 2am. Plant mom to 47 succulents. Will judge your wine choice (lovingly) 🎨🌿",status:"away",photo_url:"https://i.pravatar.cc/300?img=9",interests:["Art","Wine","Dancing"],verified:false,city:"Los Angeles",job:"Illustrator",gender:"Woman",goals:"Serious dating",values:["Creativity","Independence","Passion"],lifestyle:"Homebody & relaxed",comm_style:"Physical Touch",intimacy:9},
  {id:"seed-4",name:"James",age:30,bio:"Architect by day, DJ by night. I design buildings and playlists with equal passion 🏗️🎧",status:"online",photo_url:"https://i.pravatar.cc/300?img=52",interests:["Music","Art","Travel"],verified:true,city:"Chicago",job:"Architect",gender:"Man",goals:"Serious dating",values:["Creativity","Ambition","Loyalty"],lifestyle:"Balanced mix",comm_style:"Words of Affirmation",intimacy:8},
  {id:"seed-5",name:"Zara",age:28,bio:"Built my company from a coffee shop. Jazz bars > nightclubs. 23 countries and counting ✈️🎷",status:"online",photo_url:"https://i.pravatar.cc/300?img=20",interests:["Business","Music","Travel"],verified:true,city:"New York",job:"Founder & CEO",gender:"Woman",goals:"Long-term relationship",values:["Ambition","Growth","Adventure"],lifestyle:"Very active & outdoorsy",comm_style:"Words of Affirmation",intimacy:8},
  {id:"seed-6",name:"Daniel",age:26,bio:"ER nurse who surfs at dawn. I've seen it all but still believe in the good stuff 🏄‍♂️🩺",status:"online",photo_url:"https://i.pravatar.cc/300?img=53",interests:["Fitness","Science","Nature"],verified:true,city:"San Diego",job:"ER Nurse",gender:"Man",goals:"Long-term relationship",values:["Kindness","Stability","Humor"],lifestyle:"Very active & outdoorsy",comm_style:"Acts of Service",intimacy:6},
  {id:"seed-7",name:"Mia",age:25,bio:"Will cook you dinner on the second date. Bookworm who hikes on weekends 📚🥾",status:"online",photo_url:"https://i.pravatar.cc/300?img=5",interests:["Cooking","Hiking","Music"],verified:true,city:"Portland",job:"Chef",gender:"Woman",goals:"Long-term relationship",values:["Family","Creativity","Loyalty"],lifestyle:"Balanced mix",comm_style:"Quality Time",intimacy:7},
  {id:"seed-8",name:"Alex",age:27,bio:"Filmmaker with too many cameras. I'll document our adventures whether you like it or not 🎬📸",status:"away",photo_url:"https://i.pravatar.cc/300?img=54",interests:["Photography","Movies","Travel"],verified:true,city:"Austin",job:"Filmmaker",gender:"Man",goals:"Open to anything",values:["Creativity","Independence","Adventure"],lifestyle:"Balanced mix",comm_style:"Physical Touch",intimacy:7},
  {id:"seed-9",name:"Luna",age:24,bio:"Yoga instructor who can't stop adopting cats. My love language is cooking for you at midnight 🧘‍♀️🐱",status:"online",photo_url:"https://i.pravatar.cc/300?img=32",interests:["Yoga","Cooking","Meditation","Pets"],verified:true,city:"Portland",job:"Yoga Instructor",gender:"Woman",goals:"Serious dating",values:["Kindness","Growth","Honesty"],lifestyle:"Very active & outdoorsy",comm_style:"Acts of Service",intimacy:7,identity:"Woman",seeking:["Men","Women"],education:"Bachelor's",smoking:"Never",drinking:"Socially",cannabis:"Sometimes",has_kids:"No",wants_kids:"Maybe someday",pets:"Cat person 🐈",exercise:"Daily",diet:"Vegetarian",religion:"Spiritual",star_sign:"Pisces ♓"},
  {id:"seed-10",name:"Priya",age:26,bio:"Software engineer by day, stand-up comedian at open mics by night. My code compiles, my jokes... sometimes 💻😂",status:"online",photo_url:"https://i.pravatar.cc/300?img=25",interests:["Tech","Movies","Cooking","Reading"],verified:true,city:"San Francisco",job:"Software Engineer",gender:"Woman",goals:"Long-term relationship",values:["Intelligence","Humor","Ambition"],lifestyle:"Balanced mix",comm_style:"Words of Affirmation",intimacy:6,identity:"Woman",seeking:["Men"],education:"Master's",smoking:"Never",drinking:"Socially",cannabis:"No",has_kids:"No",wants_kids:"Yes",pets:"Want one soon",exercise:"Few times a week",diet:"No preference",religion:"Hindu",star_sign:"Virgo ♍"},
  {id:"seed-11",name:"Jordan",age:28,bio:"Non-binary artist & barista. I'll make your latte and steal your heart. Let's go to a museum then argue about the art 🎨☕",status:"online",photo_url:"https://i.pravatar.cc/300?img=35",interests:["Art","Music","Dancing","Fashion"],verified:true,city:"Brooklyn",job:"Barista & Artist",gender:"Non-binary",goals:"Open to anything",values:["Creativity","Independence","Passion"],lifestyle:"Social butterfly",comm_style:"Quality Time",intimacy:8,identity:"Non-binary",seeking:["Everyone"],education:"Some college",smoking:"Socially",drinking:"Socially",cannabis:"Yes",has_kids:"No",wants_kids:"Open to it",pets:"Both!",exercise:"Occasionally",diet:"Vegan",politics:"Progressive",star_sign:"Aquarius ♒"},
  {id:"seed-12",name:"Natasha",age:31,bio:"ER doctor who runs ultramarathons for fun. I've stitched people up and still believe in butterflies 🏥🦋",status:"online",photo_url:"https://i.pravatar.cc/300?img=26",interests:["Fitness","Science","Travel","Nature"],verified:true,city:"Boston",job:"Emergency Physician",gender:"Woman",goals:"Long-term relationship",values:["Stability","Kindness","Growth"],lifestyle:"Very active & outdoorsy",comm_style:"Quality Time",intimacy:7,identity:"Woman",seeking:["Men"],education:"PhD / Doctorate",smoking:"Never",drinking:"Socially",cannabis:"No",has_kids:"No",wants_kids:"Yes",pets:"Dog person 🐕",exercise:"Daily",diet:"No preference",religion:"Agnostic",star_sign:"Capricorn ♑"},
  {id:"seed-13",name:"Camille",age:23,bio:"Fashion student with too many houseplants. I'll thrift you the perfect outfit and make you a playlist 🌱👗🎵",status:"online",photo_url:"https://i.pravatar.cc/300?img=23",interests:["Fashion","Music","Art","Dancing"],verified:false,city:"Miami",job:"Fashion Design Student",gender:"Woman",goals:"Just exploring",values:["Creativity","Independence","Adventure"],lifestyle:"Social butterfly",comm_style:"Physical Touch",intimacy:9,identity:"Woman",seeking:["Men","Women"],education:"Some college",smoking:"Socially",drinking:"Socially",cannabis:"Sometimes",has_kids:"No",wants_kids:"Maybe someday",pets:"No pets",exercise:"Occasionally",diet:"No preference",star_sign:"Leo ♌"},
  {id:"seed-14",name:"Elena",age:29,bio:"Immigration lawyer fighting the good fight. Salsa dancing is my therapy. Cook me arroz con pollo and I'm yours 💃⚖️",status:"online",photo_url:"https://i.pravatar.cc/300?img=28",interests:["Dancing","Cooking","Reading","Volunteering"],verified:true,city:"Houston",job:"Immigration Attorney",gender:"Woman",goals:"Serious dating",values:["Family","Loyalty","Honesty"],lifestyle:"Balanced mix",comm_style:"Words of Affirmation",intimacy:7,identity:"Woman",seeking:["Men"],education:"PhD / Doctorate",smoking:"Never",drinking:"Socially",cannabis:"No",has_kids:"No",wants_kids:"Yes",pets:"Dog person 🐕",exercise:"Few times a week",diet:"No preference",religion:"Catholic",politics:"Liberal",star_sign:"Scorpio ♏"},
  {id:"seed-15",name:"Kai",age:25,bio:"Marine biologist who talks to dolphins (they talk back). Surf, science, and sunset picnics are my love language 🐬🌊",status:"online",photo_url:"https://i.pravatar.cc/300?img=30",interests:["Science","Nature","Fitness","Photography"],verified:true,city:"Honolulu",job:"Marine Biologist",gender:"Woman",goals:"Long-term relationship",values:["Adventure","Growth","Kindness"],lifestyle:"Very active & outdoorsy",comm_style:"Quality Time",intimacy:6,identity:"Woman",seeking:["Men","Women","Everyone"],education:"Master's",smoking:"Never",drinking:"Socially",cannabis:"Sometimes",has_kids:"No",wants_kids:"Open to it",pets:"No pets",exercise:"Daily",diet:"Pescatarian",religion:"Spiritual",star_sign:"Sagittarius ♐"},
  {id:"seed-16",name:"Harper",age:27,bio:"Country girl turned city nurse. I'll two-step you under the stars then check your vitals in the morning 🤠💉",status:"online",photo_url:"https://i.pravatar.cc/300?img=38",interests:["Music","Hiking","Cooking","Pets"],verified:true,city:"Nashville",job:"Registered Nurse",gender:"Woman",goals:"Long-term relationship",values:["Family","Honesty","Loyalty"],lifestyle:"Balanced mix",comm_style:"Acts of Service",intimacy:7,identity:"Woman",seeking:["Men"],education:"Bachelor's",smoking:"Never",drinking:"Socially",cannabis:"No",has_kids:"No",wants_kids:"Yes",pets:"Dog person 🐕",exercise:"Few times a week",diet:"No preference",religion:"Christian",politics:"Moderate",star_sign:"Taurus ♉"},
  {id:"seed-17",name:"Yuki",age:26,bio:"Anime nerd & pastry chef. I'll bake you a cake that looks too pretty to eat, then we'll eat it anyway 🎂🍰",status:"away",photo_url:"https://i.pravatar.cc/300?img=24",interests:["Cooking","Art","Gaming","Movies"],verified:true,city:"Seattle",job:"Pastry Chef",gender:"Woman",goals:"Serious dating",values:["Creativity","Loyalty","Humor"],lifestyle:"Homebody & relaxed",comm_style:"Receiving Gifts",intimacy:6,identity:"Woman",seeking:["Men"],education:"Trade school",smoking:"Never",drinking:"Socially",cannabis:"No",has_kids:"No",wants_kids:"Maybe someday",pets:"Cat person 🐈",exercise:"Occasionally",diet:"No preference",religion:"Buddhist",star_sign:"Cancer ♋"},
  {id:"seed-18",name:"Destiny",age:30,bio:"Real estate mogul in training. Church on Sunday, brunch on Saturday, gym every damn day. God first, gains second 💪🙏",status:"online",photo_url:"https://i.pravatar.cc/300?img=39",interests:["Business","Fitness","Volunteering","Travel"],verified:true,city:"Atlanta",job:"Real Estate Agent",gender:"Woman",goals:"Long-term relationship",values:["Faith","Ambition","Family"],lifestyle:"Very active & outdoorsy",comm_style:"Words of Affirmation",intimacy:5,identity:"Woman",seeking:["Men"],education:"Bachelor's",smoking:"Never",drinking:"Never",cannabis:"No",has_kids:"No",wants_kids:"Yes",pets:"No pets",exercise:"Daily",diet:"No preference",religion:"Christian",politics:"Moderate",star_sign:"Aries ♈"},
];

const IDENTITY_OPTS = ["Man", "Woman", "Non-binary", "Trans Man", "Trans Woman", "Genderqueer", "Genderfluid", "Other", "Prefer not to say"];
const SEEKING_OPTS = ["Men", "Women", "Non-binary people", "Everyone"];

const QUIZ_STEPS = [
  {key:"identity",title:"I Identify As",icon:"🌈",q:"How do you identify?",opts:IDENTITY_OPTS},
  {key:"seeking",title:"I'm Looking For",icon:"💕",q:"Who are you interested in?",opts:SEEKING_OPTS,multi:true,max:4},
  {key:"intent",title:"Relationship Intent",icon:"💝",q:"What are you looking for?",opts:["Long-term relationship","Serious dating","Open to anything","Just looking for fun","Friends first","Just exploring"]},
  {key:"education",title:"Education",icon:"🎓",q:"Education level?",opts:["High school","Some college","Associate's","Bachelor's","Master's","PhD / Doctorate","Trade school","Self-taught / Life experience","Prefer not to say"]},
  {key:"profession",title:"Career",icon:"💼",q:"What field are you in?",opts:["Tech / Engineering","Healthcare","Creative / Arts","Business / Finance","Education","Trades / Skilled labor","Legal","Food / Hospitality","Student","Entrepreneur","Military / Government","Retired","Other"]},
  {key:"smoking",title:"Smoking",icon:"🚬",q:"Do you smoke?",opts:["Never","Socially","Regularly","Trying to quit","Prefer not to say"]},
  {key:"drinking",title:"Drinking",icon:"🍷",q:"Do you drink?",opts:["Never","Socially","Regularly","Sober","Prefer not to say"]},
  {key:"cannabis",title:"420 Friendly?",icon:"🌿",q:"Cannabis use?",opts:["Yes","No","Sometimes","Prefer not to say"]},
  {key:"has_kids",title:"Kids",icon:"👶",q:"Do you have kids?",opts:["No","Yes — live with me","Yes — don't live with me","Prefer not to say"]},
  {key:"wants_kids",title:"Future Kids",icon:"🍼",q:"Do you want kids?",opts:["Yes","No","Maybe someday","Already have enough","Open to it","Prefer not to say"]},
  {key:"values",title:"Core Values",icon:"⭐",q:"Pick your top 3 values",opts:["Honesty","Loyalty","Adventure","Family","Ambition","Creativity","Humor","Independence","Kindness","Growth","Intelligence","Passion","Stability","Faith","Freedom"],multi:true,max:3},
  {key:"lifestyle",title:"Lifestyle",icon:"🏃",q:"Your lifestyle?",opts:["Very active & outdoorsy","Balanced mix","Homebody & relaxed","Social butterfly"]},
  {key:"exercise",title:"Exercise",icon:"💪",q:"How often do you exercise?",opts:["Daily","Few times a week","Occasionally","Rarely","Never"]},
  {key:"diet",title:"Diet",icon:"🥗",q:"Any diet preference?",opts:["No preference","Vegetarian","Vegan","Pescatarian","Keto","Halal","Kosher","Gluten-free","Other"]},
  {key:"pets",title:"Pets",icon:"🐾",q:"Pets?",opts:["Dog person 🐕","Cat person 🐈","Both!","No pets","Allergic","Want one soon"]},
  {key:"religion",title:"Faith / Spirituality",icon:"🙏",q:"Your beliefs? (optional)",opts:["Christian","Catholic","Muslim","Jewish","Hindu","Buddhist","Spiritual","Agnostic","Atheist","Other","Prefer not to say"],optional:true},
  {key:"politics",title:"Political Views",icon:"🗳️",q:"Where do you lean? (optional)",opts:["Liberal","Progressive","Moderate","Conservative","Libertarian","Not political","Prefer not to say"],optional:true},
  {key:"star_sign",title:"Star Sign",icon:"♈",q:"What's your sign? (optional)",opts:["Aries ♈","Taurus ♉","Gemini ♊","Cancer ♋","Leo ♌","Virgo ♍","Libra ♎","Scorpio ♏","Sagittarius ♐","Capricorn ♑","Aquarius ♒","Pisces ♓","Don't know","Don't care"],optional:true},
  {key:"comm_style",title:"Love Language",icon:"💬",q:"Your primary love language?",opts:["Words of Affirmation","Quality Time","Physical Touch","Acts of Service","Receiving Gifts"]},
  {key:"interests",title:"Interests",icon:"🎯",q:"Pick your interests (3–6)",opts:["Travel","Photography","Yoga","Cooking","Hiking","Music","Art","Wine","Dancing","Fitness","Gaming","Movies","Business","Reading","Science","Nature","Tech","Fashion","Sports","Meditation","Volunteering","Pets","Cars","Crafts"],multi:true,max:6},
  {key:"intimacy",title:"Intimacy",icon:"🔥",q:"How important is physical intimacy?",slider:true},
];

const ICEBREAKERS=["What's your most spontaneous adventure? 🌍","If you could teleport anywhere right now? ✈️","Guilty pleasure song? 🎵","Beach vacation or mountain cabin? 🏖️⛰️","Best meal you've ever had? 🤤","Morning person or night owl? 🌅🦉","What are you binge-watching? 📺","Lottery win — first purchase? 💰"];
const EMOJIS=["❤️","🔥","😍","😂","👏","💕","✨","🥰"];
const DATE_IDEAS=[{e:"☕",t:"Coffee Date",d:"Cozy & casual"},{e:"🎨",t:"Art Gallery",d:"Creative vibes"},{e:"🥾",t:"Hiking Trail",d:"Adventure awaits"},{e:"🍷",t:"Wine Tasting",d:"Sophisticated sips"},{e:"🎳",t:"Bowling Night",d:"Retro fun"},{e:"🌮",t:"Food Crawl",d:"Taste everything"}];

// ── COMPATIBILITY ────────────────────────────────────────────────────────────
function calcCompat(me, them) {
  let s = 0, mx = 0, reasons = [];
  mx += 25;
  if (me.goals && them.goals) {
    if (me.goals === them.goals) { s += 25; reasons.push("Identical relationship goals"); }
    else if ((me.goals.includes("Long") && them.goals.includes("Serious")) || (me.goals.includes("Serious") && them.goals.includes("Long"))) { s += 18; reasons.push("Similar relationship goals"); }
    else if (me.goals === "Open to anything" || them.goals === "Open to anything") { s += 12; reasons.push("Flexible on relationship type"); }
    else s += 5;
  }
  mx += 20;
  if (me.values?.length && them.values?.length) {
    const sh = me.values.filter(v => them.values.includes(v));
    s += Math.min((sh.length / Math.max(me.values.length, 1)) * 20, 20);
    if (sh.length >= 2) reasons.push(`Share values: ${sh.join(", ")}`);
    else if (sh.length === 1) reasons.push(`Both value ${sh[0]}`);
  }
  mx += 15;
  if (me.lifestyle && them.lifestyle) {
    if (me.lifestyle === them.lifestyle) { s += 15; reasons.push("Matching lifestyle"); }
    else if (me.lifestyle === "Balanced mix" || them.lifestyle === "Balanced mix") { s += 10; reasons.push("Compatible lifestyles"); }
    else { s += 5; reasons.push("Complementary lifestyles"); }
  }
  mx += 15;
  if (me.comm_style && them.comm_style) {
    if (me.comm_style === them.comm_style) { s += 15; reasons.push(`Both speak ${me.comm_style}`); }
    else { s += 7; reasons.push("Communication styles complement"); }
  }
  mx += 15;
  if (me.interests?.length && them.interests?.length) {
    const sh = me.interests.filter(i => them.interests.includes(i));
    s += Math.min((sh.length / 3) * 15, 15);
    if (sh.length >= 2) reasons.push(`${sh.length} shared interests`);
    else if (sh.length === 1) reasons.push(`Both enjoy ${sh[0]}`);
  }
  mx += 10;
  if (me.intimacy != null && them.intimacy != null) {
    const d = Math.abs(me.intimacy - them.intimacy);
    s += Math.max(10 - d * 2, 0);
    if (d <= 1) reasons.push("Intimacy alignment");
  }
  const score = mx > 0 ? Math.round((s / mx) * 100) : 50;
  return { score: Math.max(Math.min(score, 99), 35), why: reasons.slice(0, 3).join(". ") + "." || "Potential for something special." };
}

// ── 3D CANVAS ────────────────────────────────────────────────────────────────
function BG() {
  const ref = useRef(null), af = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return; const x = c.getContext("2d");
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    const dots = Array.from({ length: 75 }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * 800, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, vz: (Math.random() - 0.5) * 0.4, hue: 250 + Math.random() * 110, r: 1 + Math.random() * 2.5, p: Math.random() * 6.28, ps: 0.01 + Math.random() * 0.025 }));
    const shapes = [
      { cx: w * 0.12, cy: h * 0.22, z: 380, rx: 0, ry: 0, rz: 0, drx: 0.007, dry: 0.01, drz: 0.004, dx: 0.13, dy: 0.09, s: 42, hue: 330, a: 0.06, t: 0 },
      { cx: w * 0.82, cy: h * 0.55, z: 480, rx: 1, ry: 2, rz: 0, drx: 0.005, dry: 0.008, drz: 0.006, dx: -0.1, dy: 0.11, s: 36, hue: 270, a: 0.05, t: 1 },
      { cx: w * 0.48, cy: h * 0.1, z: 280, rx: 0, ry: 0, rz: 0, drx: 0.006, dry: 0.011, drz: 0.003, dx: 0.09, dy: -0.06, s: 48, hue: 185, a: 0.055, t: 2 },
      { cx: w * 0.88, cy: h * 0.88, z: 520, rx: 2, ry: 1, rz: 3, drx: 0.009, dry: 0.005, drz: 0.007, dx: -0.14, dy: 0.12, s: 30, hue: 350, a: 0.045, t: 3 },
      { cx: w * 0.28, cy: h * 0.72, z: 420, rx: 0, ry: 0, rz: 0, drx: 0.004, dry: 0.008, drz: 0.005, dx: 0.11, dy: -0.1, s: 52, hue: 210, a: 0.04, t: 4 },
    ];
    function pj(px, py, pz) { const f = 500, sc = f / (f + pz); return { x: w / 2 + (px - w / 2) * sc, y: h / 2 + (py - h / 2) * sc, sc }; }
    function r3(V, rx, ry, rz) { const cx2 = Math.cos(rx), sx2 = Math.sin(rx), cy2 = Math.cos(ry), sy2 = Math.sin(ry), cz2 = Math.cos(rz), sz2 = Math.sin(rz); return V.map(([a, b, c2]) => { let x1 = a, y1 = b * cx2 - c2 * sx2, z1 = b * sx2 + c2 * cx2; let x2 = x1 * cy2 + z1 * sy2, y2 = y1, z2 = -x1 * sy2 + z1 * cy2; return [x2 * cz2 - y2 * sz2, x2 * sz2 + y2 * cz2, z2]; }); }
    function ds(sh) { const p = pj(sh.cx, sh.cy, sh.z), sz = sh.s * p.sc, hh = sz / 2; let V = [], E = [];
      if (sh.t === 0) { V = [[-hh, -hh, -hh], [hh, -hh, -hh], [hh, hh, -hh], [-hh, hh, -hh], [-hh, -hh, hh], [hh, -hh, hh], [hh, hh, hh], [-hh, hh, hh]]; E = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]]; }
      else if (sh.t === 1) { V = [[0, -hh, 0], [hh, 0, 0], [0, 0, hh], [-hh, 0, 0], [0, 0, -hh], [0, hh, 0]]; E = [[0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [5, 3], [5, 4], [1, 2], [2, 3], [3, 4], [4, 1]]; }
      else if (sh.t === 2) { V = [[0, -hh, 0], [hh, 0, 0], [0, 0, hh], [-hh, 0, 0], [0, 0, -hh], [0, hh, 0]]; E = [[0, 1], [0, 2], [0, 3], [0, 4], [5, 1], [5, 2], [5, 3], [5, 4]]; }
      else if (sh.t === 3) { V = [[0, -hh, 0], [hh, hh, -hh / 2], [-hh, hh, -hh / 2], [0, hh, hh / 2]]; E = [[0, 1], [0, 2], [0, 3], [1, 2], [2, 3], [3, 1]]; }
      else { const n = 12; for (let i = 0; i < n; i++) { const a2 = (i / n) * 6.28; V.push([Math.cos(a2) * hh, Math.sin(a2) * hh, 0]); V.push([Math.cos(a2) * hh * 0.55, Math.sin(a2) * hh * 0.55, 0]); } for (let i = 0; i < n; i++) { const nx = (i + 1) % n; E.push([i * 2, nx * 2]); E.push([i * 2 + 1, nx * 2 + 1]); E.push([i * 2, i * 2 + 1]); } }
      const R = r3(V, sh.rx, sh.ry, sh.rz); x.save(); x.translate(p.x, p.y); x.globalAlpha = sh.a * p.sc;
      x.strokeStyle = `hsla(${sh.hue},85%,68%,${0.4 * p.sc})`; x.lineWidth = 1.3 * p.sc; x.shadowColor = `hsla(${sh.hue},90%,62%,0.35)`; x.shadowBlur = 10;
      E.forEach(([a2, b2]) => { if (R[a2] && R[b2]) { x.beginPath(); x.moveTo(R[a2][0], R[a2][1]); x.lineTo(R[b2][0], R[b2][1]); x.stroke(); } });
      R.forEach(([vx, vy]) => { x.beginPath(); x.arc(vx, vy, 1.8 * p.sc, 0, 6.28); x.fillStyle = `hsla(${sh.hue},92%,78%,${0.55 * p.sc})`; x.fill(); }); x.restore(); }
    function frame() { x.clearRect(0, 0, w, h);
      dots.forEach(d => { d.x += d.vx; d.y += d.vy; d.z += d.vz; d.p += d.ps; if (d.x < 0) d.x = w; if (d.x > w) d.x = 0; if (d.y < 0) d.y = h; if (d.y > h) d.y = 0; if (d.z < 0) d.z = 800; if (d.z > 800) d.z = 0;
        const pp = pj(d.x, d.y, d.z), rr = d.r * pp.sc * (0.7 + 0.3 * Math.sin(d.p));
        const g = x.createRadialGradient(pp.x, pp.y, 0, pp.x, pp.y, rr * 3.5); g.addColorStop(0, `hsla(${d.hue},88%,72%,${0.6 * pp.sc})`); g.addColorStop(1, `hsla(${d.hue},88%,72%,0)`);
        x.beginPath(); x.arc(pp.x, pp.y, rr * 3.5, 0, 6.28); x.fillStyle = g; x.fill(); });
      for (let i = 0; i < dots.length; i++) for (let j = i + 1; j < dots.length; j++) { const a = pj(dots[i].x, dots[i].y, dots[i].z), b = pj(dots[j].x, dots[j].y, dots[j].z), dd = Math.hypot(a.x - b.x, a.y - b.y);
        if (dd < 95) { x.beginPath(); x.moveTo(a.x, a.y); x.lineTo(b.x, b.y); x.strokeStyle = `rgba(190,150,255,${(1 - dd / 95) * 0.12 * Math.min(a.sc, b.sc)})`; x.lineWidth = 0.6; x.stroke(); } }
      shapes.forEach(sh => { sh.rx += sh.drx; sh.ry += sh.dry; sh.rz += sh.drz; sh.cx += sh.dx; sh.cy += sh.dy; if (sh.cx < -80) sh.cx = w + 80; if (sh.cx > w + 80) sh.cx = -80; if (sh.cy < -80) sh.cy = h + 80; if (sh.cy > h + 80) sh.cy = -80; ds(sh); });
      af.current = requestAnimationFrame(frame); }
    frame(); const rs = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; }; window.addEventListener("resize", rs);
    return () => { cancelAnimationFrame(af.current); window.removeEventListener("resize", rs); };
  }, []);
  return <canvas ref={ref} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />;
}

function Boom({ x, y, onDone }) { const ref = useRef(null); useEffect(() => { const c = ref.current; if (!c) return; const ctx = c.getContext("2d"); c.width = 320; c.height = 320; const ps = Array.from({ length: 30 }, (_, i) => { const a = (6.28 * i) / 30 + Math.random() * 0.4, sp = 3 + Math.random() * 7; return { x: 160, y: 160, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: 1, sz: 2 + Math.random() * 5, hue: 270 + Math.random() * 90 }; }); let f; function draw() { ctx.clearRect(0, 0, 320, 320); let alive = false; ps.forEach(p => { p.x += p.vx; p.y += p.vy; p.vy += 0.09; p.life -= 0.016; if (p.life > 0) { alive = true; ctx.globalAlpha = p.life; ctx.beginPath(); ctx.arc(p.x, p.y, p.sz * p.life, 0, 6.28); const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.sz * p.life); g.addColorStop(0, `hsla(${p.hue},95%,70%,${p.life})`); g.addColorStop(1, `hsla(${p.hue},95%,70%,0)`); ctx.fillStyle = g; ctx.fill(); } }); if (alive) f = requestAnimationFrame(draw); else onDone?.(); } draw(); return () => cancelAnimationFrame(f); }, [onDone]); return <canvas ref={ref} style={{ position: "fixed", left: x - 160, top: y - 160, width: 320, height: 320, pointerEvents: "none", zIndex: 9999 }} />; }

// ── AI (via Vercel proxy) ────────────────────────────────────────────────────
async function callAI(sys, prompt) {
  try {
    const r = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system: sys, prompt }),
    });
    if (!r.ok) return null;
    const d = await r.json();
    return d.text || null;
  } catch (e) { console.error("AI:", e); return null; }
}

// ── THEME ────────────────────────────────────────────────────────────────────
const C = {
  bg: "#05050d", card: "rgba(18,15,38,0.88)", card2: "rgba(28,24,55,0.7)",
  text: "#f4f0fc", dim: "rgba(180,172,220,0.5)", soft: "rgba(218,210,248,0.82)",
  brd: "rgba(118,92,220,0.1)", pop: "#ff3cac", green: "#00e87b",
  g1: "linear-gradient(135deg,#ff3cac 0%,#784ba0 50%,#2b86c5 100%)",
  g2: "linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
  g3: "linear-gradient(135deg,#f093fb 0%,#f5576c 100%)",
  g4: "linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)",
  g5: "linear-gradient(135deg,#fa709a 0%,#fee140 100%)",
  gX: "linear-gradient(135deg,#f5af19 0%,#f12711 100%)",
  gAI: "linear-gradient(135deg,#a855f7 0%,#6366f1 50%,#06b6d4 100%)",
  mine: "linear-gradient(135deg,#7c3aed 0%,#a855f7 40%,#ec4899 100%)",
  them: "rgba(34,30,64,0.94)",
  glass: "rgba(14,12,34,0.82)",
};

// ── SHARED STYLES ────────────────────────────────────────────────────────────
const glass = { background: C.glass, backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)", border: `1px solid ${C.brd}`, borderRadius: 22 };
const bpS = { transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)", cursor: "pointer" };

// ── UI COMPONENTS (outside main function to prevent re-creation) ─────────────
const Btn = ({ children, g, disabled: dis, onClick: oc, s }) => <button className="bp" disabled={dis} onClick={oc} style={{ padding: "16px 32px", borderRadius: 20, border: "none", background: g || C.g1, color: "white", fontSize: 16, fontWeight: 700, cursor: dis ? "default" : "pointer", fontFamily: "'Outfit'", boxShadow: dis ? "none" : "0 6px 28px rgba(255,60,172,0.35)", opacity: dis ? 0.35 : 1, ...bpS, ...(s || {}) }}>{children}</button>;
const Card = ({ children, s, cn, ...r }) => <div className={cn || ""} style={{ ...glass, ...(s || {}) }} {...r}>{children}</div>;
const Inp = ({ label: l, ...r }) => <div style={{ marginBottom: 18 }}>{l && <label style={{ fontSize: 13, fontWeight: 700, color: C.soft, marginBottom: 8, display: "block" }}>{l}</label>}<input className="ig" {...r} style={{ width: "100%", padding: "15px 20px", borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card, color: C.text, fontSize: 15, fontFamily: "'Outfit'", outline: "none", transition: "all 0.3s", ...(r.style || {}) }} /></div>;

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function AutoMate() {
  // ── Auth state ─────────────────────────────────────────────────────────────
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [page, setPage] = useState("landing");
  const [view, setView] = useState("discover");
  const [authForm, setAuthForm] = useState({ name: "", email: "", pw: "", age: "", gender: "", city: "" });
  const [authError, setAuthError] = useState("");

  // ── Profile & Quiz state ───────────────────────────────────────────────────
  const [me, setMe] = useState({ name: "", age: "", gender: "", city: "", bio: "", interests: [], goals: "", values: [], lifestyle: "", comm_style: "", intimacy: 5, photo_url: "", job: "", identity: "", seeking: [], relationship_mode: "", education: "", profession: "", smoking: "", drinking: "", cannabis: "", has_kids: "", wants_kids: "", height: "", religion: "", politics: "", pets: "", exercise: "", diet: "", star_sign: "", languages: [], zip_code: "", latitude: null, longitude: null, discovery_prefs: { age_min: 18, age_max: 99, distance_max: 15, ai_override: true } });
  const [quiz, setQuiz] = useState({ identity: "", seeking: [], intent: "", education: "", profession: "", smoking: "", drinking: "", cannabis: "", has_kids: "", wants_kids: "", values: [], lifestyle: "", exercise: "", diet: "", pets: "", religion: "", politics: "", star_sign: "", comm_style: "", interests: [], intimacy: 5 });
  const [qStep, setQStep] = useState(0);
  const [vStep, setVStep] = useState(0);
  const [plan, setPlan] = useState(null);

  // ── App state ──────────────────────────────────────────────────────────────
  const [profiles, setProfiles] = useState(SEED);
  const [liked, setLiked] = useState(new Set());
  const [passed, setPassed] = useState(new Set());
  const [saved, setSaved] = useState(new Set());
  const [blocked, setBlocked] = useState(new Set());
  const [tab, setTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [match, setMatch] = useState(null);
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [showIce, setShowIce] = useState(false);
  const [showRx, setShowRx] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [showCoach, setShowCoach] = useState(false);
  const [coachSugs, setCoachSugs] = useState(null);
  const [coachLoad, setCoachLoad] = useState(false);
  const [genie, setGenie] = useState(false);
  const [genieTab, setGenieTab] = useState("soul");
  const [genieDates, setGenieDates] = useState(null);
  const [genieLoad, setGenieLoad] = useState(false);
  const [modal, setModal] = useState(null);
  const [safety, setSafety] = useState(false);
  const [report, setReport] = useState(null);
  const [reportR, setReportR] = useState("");
  const [bioWriter, setBioWriter] = useState(false);
  const [bioTone, setBioTone] = useState("confident");
  const [bioLoad, setBioLoad] = useState(false);
  const [bioOut, setBioOut] = useState("");
  const [toast, setToast] = useState(null);
  const [booms, setBooms] = useState([]);
  const [matchAnim, setMatchAnim] = useState(null);
  const [matchDeepDive, setMatchDeepDive] = useState(null);
  const [deepDiveLoad, setDeepDiveLoad] = useState(false);
  const [moodStatus, setMoodStatus] = useState("Looking to chat 💬");
  const [convos, setConvos] = useState({});
  // ── New feature states ─────────────────────────────────────────────────────
  const [showStars, setShowStars] = useState(false);
  const [starsResult, setStarsResult] = useState(null);
  const [starsLoad, setStarsLoad] = useState(false);
  const [starsTarget, setStarsTarget] = useState(null);
  const [dailyA, setDailyA] = useState("");
  const [dailyAnswers, setDailyAnswers] = useState({});
  const [showDaily, setShowDaily] = useState(false);
  const [showGames, setShowGames] = useState(false);
  const [gameType, setGameType] = useState(null);
  const [gameQ, setGameQ] = useState(null);
  const [gameA, setGameA] = useState(null);
  const [gameTheirA, setGameTheirA] = useState(null);
  const [showVibe, setShowVibe] = useState(false);
  const [vibeStep, setVibeStep] = useState(0);
  const [vibeAnswers, setVibeAnswers] = useState([]);
  const [vibeResult, setVibeResult] = useState(null);
  const [vibeLoad, setVibeLoad] = useState(false);
  const endRef = useRef(null);
  const inpRef = useRef(null);

  // ── Auth: Check session on mount ───────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) { setPage("app"); loadProfile(s.user.id); loadLikes(s.user.id); }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) loadProfile(s.user.id);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Load profile from Supabase ─────────────────────────────────────────────
  const loadProfile = async (uid) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", uid).single();
    if (data) {
      setMe({
        name: data.name || "", age: data.age || "", gender: data.gender || "",
        city: data.city || "", bio: data.bio || "", interests: data.interests || [],
        goals: data.goals || "", values: data.values || [], lifestyle: data.lifestyle || "",
        comm_style: data.comm_style || "", intimacy: data.intimacy || 5,
        photo_url: data.photo_url || "", job: data.job || "",
        identity: data.identity || "", seeking: data.seeking || [], relationship_mode: data.relationship_mode || "",
        education: data.education || "", profession: data.profession || "",
        smoking: data.smoking || "", drinking: data.drinking || "", cannabis: data.cannabis || "",
        has_kids: data.has_kids || "", wants_kids: data.wants_kids || "",
        height: data.height || "", religion: data.religion || "", politics: data.politics || "",
        pets: data.pets || "", exercise: data.exercise || "", diet: data.diet || "",
        star_sign: data.star_sign || "", languages: data.languages || [],
        zip_code: data.zip_code || "", latitude: data.latitude || null, longitude: data.longitude || null,
        discovery_prefs: data.discovery_prefs || { age_min: 18, age_max: 99, distance_max: 15, ai_override: true },
      });
      if (data.name) setPage("app");
    }
    // Load other user profiles - combine with seed profiles
    const { data: others } = await supabase.from("profiles").select("*").neq("id", uid).not("name", "eq", "");
    if (others && others.length > 0) setProfiles([...others, ...SEED]);
    else setProfiles(SEED);
  };

  // ── Load likes from Supabase ───────────────────────────────────────────────
  const loadLikes = async (uid) => {
    const { data } = await supabase.from("likes").select("to_user, like_type").eq("from_user", uid);
    if (data) {
      setLiked(new Set(data.filter(l => l.like_type === "like" || l.like_type === "super").map(l => l.to_user)));
      setSaved(new Set(data.filter(l => l.like_type === "save").map(l => l.to_user)));
    }
    const { data: bl } = await supabase.from("blocks").select("blocked").eq("blocker", uid);
    if (bl) setBlocked(new Set(bl.map(b => b.blocked)));
  };

  // ── Save profile to Supabase ───────────────────────────────────────────────
  const saveProfile = async (updates) => {
    const newMe = { ...me, ...updates };
    setMe(newMe);
    if (user) {
      await supabase.from("profiles").update({
        name: newMe.name, age: parseInt(newMe.age) || null, gender: newMe.gender,
        city: newMe.city, bio: newMe.bio, interests: newMe.interests,
        goals: newMe.goals, values: newMe.values, lifestyle: newMe.lifestyle,
        comm_style: newMe.comm_style, intimacy: newMe.intimacy,
        photo_url: newMe.photo_url, job: newMe.job,
        identity: newMe.identity, seeking: newMe.seeking, relationship_mode: newMe.relationship_mode,
        education: newMe.education, profession: newMe.profession,
        smoking: newMe.smoking, drinking: newMe.drinking, cannabis: newMe.cannabis,
        has_kids: newMe.has_kids, wants_kids: newMe.wants_kids,
        height: newMe.height, religion: newMe.religion, politics: newMe.politics,
        pets: newMe.pets, exercise: newMe.exercise, diet: newMe.diet,
        star_sign: newMe.star_sign, languages: newMe.languages,
        zip_code: newMe.zip_code, latitude: newMe.latitude, longitude: newMe.longitude,
        discovery_prefs: newMe.discovery_prefs,
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
    }
  };

  // ── Sign Up ────────────────────────────────────────────────────────────────
  const signUp = async () => {
    setAuthError("");
    if (!authForm.email || !authForm.pw || !authForm.name) { setAuthError("Please fill in all fields"); return; }
    if (authForm.pw.length < 6) { setAuthError("Password must be at least 6 characters"); return; }
    const { data, error } = await supabase.auth.signUp({ email: authForm.email, password: authForm.pw });
    if (error) { setAuthError(error.message); return; }
    if (data.user && !data.session) {
      // Email confirmation required - user exists but can't authenticate yet
      // Store signup info locally so quiz data persists until they confirm
      setMe(p => ({ ...p, name: authForm.name, age: authForm.age, gender: authForm.gender, city: authForm.city }));
      setToast("Check your email to confirm, then log in! 📧");
      setPage("login");
      setAuthError("We sent a confirmation link to " + authForm.email + ". Click it, then log in here.");
    } else if (data.user && data.session) {
      // Auto-confirmed (or confirm is disabled) - proceed normally
      await supabase.from("profiles").update({
        name: authForm.name, age: parseInt(authForm.age) || null,
        gender: authForm.gender, city: authForm.city,
      }).eq("id", data.user.id);
      setMe(p => ({ ...p, name: authForm.name, age: authForm.age, gender: authForm.gender, city: authForm.city }));
      setToast("Welcome to Auto-Mate! 🎉");
      setPage("quiz");
    }
  };

  // ── Log In ─────────────────────────────────────────────────────────────────
  const logIn = async () => {
    setAuthError("");
    if (!authForm.email || !authForm.pw) { setAuthError("Please fill in all fields"); return; }
    const { data, error } = await supabase.auth.signInWithPassword({ email: authForm.email, password: authForm.pw });
    if (error) { setAuthError(error.message); return; }
    // Check if profile is complete (has interests = did quiz)
    if (data.user) {
      const { data: profile } = await supabase.from("profiles").select("name, interests").eq("id", data.user.id).single();
      if (profile && (!profile.interests || profile.interests.length === 0)) {
        // Profile exists but quiz not done yet
        if (profile.name) setMe(p => ({ ...p, name: profile.name }));
        setPage("quiz");
        setToast("Let's finish setting up your profile! ✨");
      } else {
        setPage("app");
        setToast("Welcome back! 💝");
      }
    }
  };

  // ── Log Out ────────────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null); setSession(null); setPage("landing");
    setMe({ name: "", age: "", gender: "", city: "", bio: "", interests: [], goals: "", values: [], lifestyle: "", comm_style: "", intimacy: 5, photo_url: "", job: "", identity: "", seeking: [], relationship_mode: "", education: "", profession: "", smoking: "", drinking: "", cannabis: "", has_kids: "", wants_kids: "", height: "", religion: "", politics: "", pets: "", exercise: "", diet: "", star_sign: "", languages: [], zip_code: "", latitude: null, longitude: null, discovery_prefs: { age_min: 18, age_max: 99, distance_max: 15, ai_override: true } });
    setToast("Logged out");
  };

  // ── Like / Save / Block (persist to Supabase) ─────────────────────────────
  const doLike = async (p, e) => {
    if (liked.has(p.id)) {
      // Unlike — toggle off
      setLiked(s => { const n = new Set(s); n.delete(p.id); return n; });
      setToast("Unliked");
      if (user && !p.id.startsWith("seed")) {
        try { await supabase.from("likes").delete().eq("from_user", user.id).eq("to_user", p.id).eq("like_type", "like"); } catch (err) { console.error("Unlike error:", err); }
      }
      return;
    }
    setLiked(s => new Set([...s, p.id]));
    boom(e);
    setMatchAnim(p);
    setTimeout(() => setMatchAnim(null), 3000);
    if (user && !p.id.startsWith("seed")) {
      try {
        await supabase.from("likes").upsert({ from_user: user.id, to_user: p.id, like_type: "like" }, { onConflict: "from_user,to_user" });
        const { data: mutual } = await supabase.from("likes").select("id").eq("from_user", p.id).eq("to_user", user.id).eq("like_type", "like");
        if (mutual?.length > 0) {
          await supabase.from("matches").upsert({ user_a: user.id, user_b: p.id, status: "matched", compat_score: p.compat }, { onConflict: "user_a,user_b" });
        }
      } catch (err) { console.error("Like error:", err); }
    }
  };

  const doSave = async (p) => {
    const isSaved = saved.has(p.id);
    setSaved(s => { const n = new Set(s); if (isSaved) n.delete(p.id); else n.add(p.id); return n; });
    setToast(isSaved ? "Removed" : "Saved for later 🔖");
    if (user && !p.id.startsWith("seed")) {
      try {
        if (isSaved) await supabase.from("likes").delete().eq("from_user", user.id).eq("to_user", p.id).eq("like_type", "save");
        else await supabase.from("likes").upsert({ from_user: user.id, to_user: p.id, like_type: "save" }, { onConflict: "from_user,to_user" });
      } catch (err) { console.error("Save error:", err); }
    }
  };

  const doBlock = async (p) => {
    setBlocked(s => new Set([...s, p.id]));
    setToast(`${p.name} blocked`);
    if (match?.id === p.id) { setMatch(null); setView("discover"); }
    if (user && !p.id.startsWith("seed")) {
      await supabase.from("blocks").upsert({ blocker: user.id, blocked: p.id }, { onConflict: "blocker,blocked" });
    }
  };

  const doReport = async (p, reason) => {
    setToast("Report submitted ✓");
    if (user && !p.id.startsWith("seed")) {
      await supabase.from("reports").insert({ reporter: user.id, reported: p.id, reason });
    }
  };

  // ── Photo upload ───────────────────────────────────────────────────────────
  const uploadPhoto = async (file) => {
    if (!user || !file) return;
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { setToast("Upload failed: " + error.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    saveProfile({ photo_url: publicUrl });
    setToast("Photo uploaded! 📸");
  };

  // ── Real-time messages (load + subscribe) ──────────────────────────────────
  const loadMessages = async (matchUserId, matchRecordId) => {
    try {
      const { data } = await supabase.from("messages").select("*").eq("match_id", matchRecordId).order("created_at", { ascending: true });
      if (data && data.length > 0) {
        const formatted = data.map(m => ({
          id: m.id, from: m.sender_id === user.id ? "me" : "them",
          text: m.content, time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          rx: [], dbMsg: true,
        }));
        setConvos(p => ({ ...p, [matchUserId]: formatted }));
      }
    } catch (err) { console.error("Load messages error:", err); }
  };

  useEffect(() => {
    if (!match || match.id.startsWith("seed") || !user) return;
    const findMatch = async () => {
      try {
        // Use two separate queries instead of .or(and()) which has syntax issues
        const { data: m1 } = await supabase.from("matches").select("id").eq("user_a", user.id).eq("user_b", match.id);
        const { data: m2 } = await supabase.from("matches").select("id").eq("user_a", match.id).eq("user_b", user.id);
        const matchRecord = m1?.[0] || m2?.[0];
        if (matchRecord) loadMessages(match.id, matchRecord.id);
      } catch (err) { console.error("Find match error:", err); }
    };
    findMatch();
    const channel = supabase.channel(`messages-${match.id}`).on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
      const m = payload.new;
      if (m.sender_id !== user.id) {
        const formatted = { id: m.id, from: "them", text: m.content, time: new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), rx: [], dbMsg: true };
        setConvos(p => ({ ...p, [match.id]: [...(p[match.id] || []), formatted] }));
      }
    }).subscribe();
    return () => supabase.removeChannel(channel);
  }, [match, user]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [convos, match]);
  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); } }, [toast]);

  const boom = useCallback(e => { const id = Date.now(); setBooms(p => [...p, { id, x: e.clientX, y: e.clientY }]); setTimeout(() => setBooms(p => p.filter(b => b.id !== id)), 1800); }, []);

  // ── Scored profiles ────────────────────────────────────────────────────────
  const scored = useMemo(() =>
    profiles.filter(p => !blocked.has(p.id)).map(p => { const { score, why } = calcCompat(me, p); return { ...p, compat: score, why }; }).sort((a, b) => b.compat - a.compat)
  , [me, blocked, profiles]);
  const visible = scored.filter(p => !passed.has(p.id) && p.name.toLowerCase().includes(search.toLowerCase()));
  const savedP = scored.filter(p => saved.has(p.id));
  const matchedP = scored.filter(p => liked.has(p.id));
  const soul = scored[0];
  const surprise = scored.filter(p => !liked.has(p.id) && p.id !== soul?.id)[0] || scored[1];

  // ── AI helpers ─────────────────────────────────────────────────────────────
  const aiReply = async (txt, prof, hist) => callAI(`You are ${prof.name}, ${prof.age}, ${prof.job || "professional"} in ${prof.city}. Identity: ${prof.identity || prof.gender || "not specified"}. Interests: ${prof.interests?.join(", ")}. Values: ${prof.values?.join(", ") || "not specified"}. Goals: ${prof.goals || "not specified"}. Lifestyle: ${prof.lifestyle || "not specified"}. Bio: "${prof.bio}". You're on a dating app chat. Be warm, genuine, flirty but respectful. Match their energy. 1-3 sentences. Emojis sometimes. Never say you're AI. Never be generic.`, hist.slice(-8).map(m => `${m.from === "me" ? "Them" : "You"}: ${m.text}`).join("\n") + `\nThem: ${txt}\nYou:`);
  const aiSuggest = async (prof) => { const r = await callAI("You are a dating coach AI. Return ONLY a JSON array of 3 strings. Each suggestion should be specific, creative, and reference something from BOTH profiles. Never generic.", `Generate 3 creative conversation starters for this match:\n\nMY PROFILE: Interests: ${me.interests?.slice(0, 5).join(", ") || "travel"}. Values: ${me.values?.join(", ") || "not set"}. Goals: ${me.goals || "not set"}. Lifestyle: ${me.lifestyle || "not set"}. Bio: "${me.bio || "not set"}"\n\nTHEIR PROFILE: ${prof.name}, ${prof.age}, ${prof.job || "professional"}. Interests: ${prof.interests?.join(", ")}. Values: ${prof.values?.join(", ") || "not set"}. Goals: ${prof.goals || "not set"}. Bio: "${prof.bio}"\n\nMake each one specific to what we have in common or what's interesting about their profile. ONLY return JSON array of 3 strings.`); try { return JSON.parse((r || "[]").replace(/```json|```/g, "").trim()); } catch { return null; } };
  const aiBio = async () => callAI(`Expert dating profile writer. ${bioTone} tone. Return ONLY 2-4 sentences. Make it deeply specific to their personality quiz answers, interests, and lifestyle. Never generic. Reference real details from their profile to make it feel human-written.`, `Write a ${bioTone} dating bio using ALL of these real quiz answers from the person:\nName: ${me.name || "someone"}\nAge: ${me.age || "?"}\nIdentity: ${me.identity || me.gender || "not specified"}\nLooking for: ${me.seeking?.join(", ") || "not set"}\nRelationship goal: ${me.goals || "not set"}\nInterests: ${me.interests?.join(", ") || "adventure"}\nValues: ${me.values?.join(", ") || "honesty"}\nLifestyle: ${me.lifestyle || "balanced"}\nLove language: ${me.comm_style || "not set"}\nJob: ${me.job || "professional"}\nCity: ${me.city || "not set"}\nEducation: ${me.education || "not set"}\nExercise: ${me.exercise || "not set"}\nDiet: ${me.diet || "not set"}\nPets: ${me.pets || "not set"}\nSmoking: ${me.smoking || "not set"}\nDrinking: ${me.drinking || "not set"}\n420: ${me.cannabis || "not set"}\nKids: ${me.has_kids || "not set"}, Wants: ${me.wants_kids || "not set"}\nReligion: ${me.religion || "not set"}\nStar sign: ${me.star_sign || "not set"}\n${me.bio ? `Current draft: "${me.bio}". Improve it using their quiz answers.` : "Create from scratch using their quiz answers."}\nMake the bio feel like a real human wrote it — warm, specific, referencing their actual hobbies and personality. ONLY return the bio text, nothing else.`);
  const aiDates = async () => { const r = await callAI('Return ONLY JSON array of 3 objects with "e" (emoji), "t" (title), "d" (one sentence description).', `Suggest 3 creative, specific date ideas for two people:\nPerson 1 likes: ${me.interests?.slice(0, 3).join(", ") || "travel"}, lives in ${me.city || "the city"}\nPerson 2 likes: ${soul?.interests?.join(", ") || "art"}, lives in ${soul?.city || "the city"}\nMake them unique and fun, not generic coffee dates. ONLY JSON.`); try { return JSON.parse((r || "[]").replace(/```json|```/g, "").trim()); } catch { return null; } };

  // ── AI Compatibility Deep-Dive ─────────────────────────────────────────────
  const aiDeepDive = async (prof) => {
    setDeepDiveLoad(true);
    const r = await callAI(
      'You are a relationship compatibility expert AI. Return ONLY valid JSON with these exact keys: "strengths" (array of 3 strings), "growth" (array of 2 strings), "starters" (array of 3 conversation starter strings), "forecast" (one sentence prediction), "score_breakdown" (object with keys "values","lifestyle","communication","interests","goals" each 0-100 integer).',
      `Analyze compatibility between these two people:\n\nPERSON 1: ${me.name || "User"}, ${me.age || "?"}, ${me.identity || me.gender || "not specified"}. Interests: ${me.interests?.join(", ") || "not set"}. Values: ${me.values?.join(", ") || "not set"}. Goals: ${me.goals || "not set"}. Lifestyle: ${me.lifestyle || "not set"}. Love language: ${me.comm_style || "not set"}. Education: ${me.education || "not set"}. Smoking: ${me.smoking || "not set"}. Drinking: ${me.drinking || "not set"}. Kids: ${me.has_kids || "not set"}. Wants kids: ${me.wants_kids || "not set"}. Pets: ${me.pets || "not set"}. Exercise: ${me.exercise || "not set"}. Diet: ${me.diet || "not set"}. Bio: "${me.bio || "not set"}"\n\nPERSON 2: ${prof.name}, ${prof.age}, ${prof.identity || prof.gender || "not specified"}. Interests: ${prof.interests?.join(", ") || "not set"}. Values: ${prof.values?.join(", ") || "not set"}. Goals: ${prof.goals || "not set"}. Lifestyle: ${prof.lifestyle || "not set"}. Love language: ${prof.comm_style || "not set"}. Education: ${prof.education || "not set"}. Bio: "${prof.bio || "not set"}"\n\nBe specific and personal, not generic. ONLY return the JSON.`
    );
    try {
      const parsed = JSON.parse((r || "{}").replace(/```json|```/g, "").trim());
      setMatchDeepDive(parsed);
    } catch { setMatchDeepDive({ strengths: ["You share core values", "Compatible lifestyles", "Aligned relationship goals"], growth: ["Different communication styles could complement each other", "Explore each other's interests for new experiences"], starters: ["Ask about their favorite adventure", "Share your ideal weekend plans", "Talk about what matters most to you"], forecast: "Strong potential for a meaningful connection.", score_breakdown: { values: 80, lifestyle: 75, communication: 70, interests: 65, goals: 85 } }); }
    setDeepDiveLoad(false);
  };

  // ── IN THE STARS — soul-level cosmic matching ──────────────────────────────
  const STAR_ELEMENTS = { "Aries ♈": "Fire", "Leo ♌": "Fire", "Sagittarius ♐": "Fire", "Taurus ♉": "Earth", "Virgo ♍": "Earth", "Capricorn ♑": "Earth", "Gemini ♊": "Air", "Libra ♎": "Air", "Aquarius ♒": "Air", "Cancer ♋": "Water", "Scorpio ♏": "Water", "Pisces ♓": "Water" };
  const aiStars = async (prof) => {
    setStarsLoad(true); setStarsTarget(prof);
    const r = await callAI('You are a cosmic relationship astrologer AI. Return ONLY valid JSON with: "cosmic_score" (0-100 integer), "element_match" (string like "Fire meets Water"), "soul_reading" (2-3 sentence poetic reading), "strengths" (array of 3 strings), "challenges" (array of 2 strings), "cosmic_advice" (one sentence), "best_date_night" (one sentence themed to their signs).', `Analyze the cosmic/astrological compatibility:\n\nPerson 1: ${me.name || "User"}, ${me.star_sign || "unknown sign"}, ${me.identity || me.gender || ""}. Values: ${me.values?.join(", ") || "not set"}. Love language: ${me.comm_style || "not set"}. Interests: ${me.interests?.join(", ") || "not set"}. Lifestyle: ${me.lifestyle || "not set"}.\n\nPerson 2: ${prof.name}, ${prof.star_sign || "unknown sign"}, ${prof.identity || prof.gender || ""}. Values: ${prof.values?.join(", ") || "not set"}. Love language: ${prof.comm_style || "not set"}. Interests: ${prof.interests?.join(", ") || "not set"}.\n\nBe mystical but grounded. Reference their actual traits. ONLY return JSON.`);
    try { setStarsResult(JSON.parse((r || "{}").replace(/```json|```/g, "").trim())); } catch { setStarsResult({ cosmic_score: 78, element_match: `${STAR_ELEMENTS[me.star_sign] || "Spirit"} meets ${STAR_ELEMENTS[prof.star_sign] || "Spirit"}`, soul_reading: "The universe sees a rare alignment between your energies. Your souls vibrate on complementary frequencies, creating a harmony that few connections achieve.", strengths: ["Deep emotional resonance", "Complementary communication rhythms", "Shared growth trajectory"], challenges: ["Different pacing in vulnerability", "Balancing independence with togetherness"], cosmic_advice: "Let conversations flow like water — the deeper you go, the more treasure you'll find.", best_date_night: "Stargazing picnic with homemade food and a shared playlist." }); }
    setStarsLoad(false);
  };

  // ── DAILY QUESTION ─────────────────────────────────────────────────────────
  const DAILY_QUESTIONS = [
    "What's a small thing that instantly makes your day better? ☀️",
    "If you could master one skill overnight, what would it be? 🎯",
    "What's the most spontaneous thing you've ever done? 🎲",
    "Describe your ideal Sunday morning in 3 words 🌅",
    "What song do you play when you need a mood boost? 🎵",
    "If you could live anywhere for a year, where? 🌍",
    "What's a dealbreaker that most people wouldn't expect from you? 🚩",
    "What does 'home' feel like to you? 🏠",
    "What's a belief you've changed your mind about? 💭",
    "If we went on a date tonight, where are we going? 💫",
    "What makes you laugh until you cry? 😂",
    "What's your love language in action? 💕",
    "Coffee order that says everything about you? ☕",
    "What's the most romantic thing you've experienced? 🌹",
    "What do you need more of in your life right now? ✨",
    "What topic can you talk about for hours? 🗣️",
    "What childhood dream do you still secretly have? 🌈",
    "What's your green flag? 💚",
    "What are you most proud of that no one knows about? 🏆",
    "What does your perfect Friday night look like? 🌙",
    "What scares you about falling in love? 💔",
    "What hobby do you want to try with a partner? 🎨",
    "What quality do you value most in a person? ⭐",
    "What's your unpopular opinion about dating? 🔥",
    "If your life had a theme song, what would it be? 🎶",
    "What's the best compliment you've ever received? 💛",
    "What adventure is on your bucket list? 🗺️",
    "What do you look for in someone's eyes? 👀",
    "When did you last feel truly understood? 🤝",
    "What would your friends say is your best quality? 💎",
    "What makes you feel most alive? ⚡",
  ];
  const getTodayQ = () => { const d = new Date(); const idx = (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % DAILY_QUESTIONS.length; return DAILY_QUESTIONS[idx]; };
  const submitDailyA = () => { if (!dailyA.trim()) return; setDailyAnswers(p => ({ ...p, [me.name || "You"]: dailyA.trim() })); setToast("Answer saved! See how your matches responded 💬"); const fakeAnswers = {}; scored.slice(0, 5).forEach(p => { const answers = ["That's such a good question! For me it's definitely quality time with someone special 💕", "Honestly? A really good playlist and nowhere to be 🎵", "I'd say travel — there's nothing like exploring somewhere new together 🌍", "Cooking for someone I care about. It's my love language 🍳", "Being outside, especially near water. It resets everything 🌊"]; fakeAnswers[p.name] = answers[Math.floor(Math.random() * answers.length)]; }); setTimeout(() => setDailyAnswers(p => ({ ...p, ...fakeAnswers })), 800); };

  // ── COMPATIBILITY GAMES ────────────────────────────────────────────────────
  const GAME_BANKS = {
    wyr: [ ["Travel the world for a year OR have a year-long stay-cation with unlimited budget?", "🌍", "🏠"], ["Always say what you're thinking OR never speak again?", "🗣️", "🤐"], ["Give up social media OR give up Netflix?", "📱", "📺"], ["Date someone super funny OR super romantic?", "😂", "🌹"], ["Know when you'll die OR know how you'll die?", "📅", "❓"], ["Live in the mountains OR by the beach?", "⛰️", "🏖️"] ],
    tot: [ ["Dogs or Cats?", "🐕", "🐈"], ["Morning dates or Night dates?", "🌅", "🌙"], ["Text first or Wait for them?", "📱", "⏳"], ["Cook together or Order in?", "👨‍🍳", "🍕"], ["Road trip or Flight?", "🚗", "✈️"], ["Big wedding or Elope?", "💒", "🏝️"], ["PDA or Private?", "💏", "🤫"], ["Meet online or Meet IRL?", "💻", "🍸"] ],
  };
  const startGame = (type) => {
    setGameType(type); setGameA(null); setGameTheirA(null);
    const bank = GAME_BANKS[type]; const q = bank[Math.floor(Math.random() * bank.length)];
    setGameQ(q);
  };
  const answerGame = (choice) => {
    setGameA(choice);
    setTimeout(() => { setGameTheirA(Math.random() > 0.5 ? 0 : 1); }, 800 + Math.random() * 1200);
  };

  // ── VIBE CHECK ─────────────────────────────────────────────────────────────
  const VIBE_QS = [
    { q: "How are you feeling about this date?", opts: ["Excited! 🎉", "A little nervous 😅", "Chill & curious 🤔", "Cautiously optimistic 🤞"] },
    { q: "What's your ideal first date energy?", opts: ["Fun & lighthearted 😄", "Deep & meaningful 🌊", "Adventurous 🗺️", "Relaxed & cozy ☕"] },
    { q: "How do you handle awkward silences?", opts: ["Make a joke 😂", "Ask a question 💬", "Embrace it 🧘", "Change the subject 🔄"] },
    { q: "What's most important on a first date?", opts: ["Chemistry ⚡", "Conversation 🗣️", "Feeling safe 🛡️", "Having fun 🎯"] },
    { q: "After a great date, you'd want to...", opts: ["Plan the next one ASAP 📅", "Text them that night 💕", "Sleep on it 😴", "Tell your friends everything 👯"] },
  ];
  const submitVibe = async () => {
    setVibeLoad(true);
    const theirAnswers = VIBE_QS.map(q => q.opts[Math.floor(Math.random() * q.opts.length)]);
    const r = await callAI('Return ONLY valid JSON with: "readiness_score" (0-100 integer), "vibe_match" (string like "Great energy alignment!"), "tips" (array of 3 short strings), "emoji_summary" (3 emojis that represent your dynamic).', `Two people are about to go on a date. Compare their pre-date vibe check answers:\n\nPerson 1 (${me.name || "User"}) answered:\n${VIBE_QS.map((q, i) => `${q.q}: ${vibeAnswers[i] || "skipped"}`).join("\n")}\n\nPerson 2 (${match?.name || "Match"}) answered:\n${VIBE_QS.map((q, i) => `${q.q}: ${theirAnswers[i]}`).join("\n")}\n\nBe encouraging and specific. ONLY return JSON.`);
    try { setVibeResult(JSON.parse((r || "{}").replace(/```json|```/g, "").trim())); } catch { setVibeResult({ readiness_score: 82, vibe_match: "You're both bringing great energy!", tips: ["Start with something you both mentioned caring about", "Keep it light early — depth will come naturally", "Trust the chemistry and be yourself"], emoji_summary: "⚡💕🎯" }); }
    setVibeLoad(false);
  };

  // ── Send message ───────────────────────────────────────────────────────────
  const send = async () => {
    if (!msg.trim() || !match) return;
    const mid = match.id, txt = msg.trim();
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const nm = { id: Date.now(), from: "me", text: txt, time: timeStr, rx: [] };
    setConvos(p => ({ ...p, [mid]: [...(p[mid] || []), nm] }));
    setMsg(""); setShowIce(false); setTyping(true);

    // Save to Supabase if real user chatting with real user
    if (user && !mid.startsWith("seed")) {
      try {
        const { data: m1 } = await supabase.from("matches").select("id").eq("user_a", user.id).eq("user_b", mid);
        const { data: m2 } = await supabase.from("matches").select("id").eq("user_a", mid).eq("user_b", user.id);
        const matchRecord = m1?.[0] || m2?.[0];
        if (matchRecord) {
          await supabase.from("messages").insert({ match_id: matchRecord.id, sender_id: user.id, content: txt });
        }
      } catch (err) { console.error("Message save error:", err); }
    }

    const hist = convos[mid] || [];
    const rep = await aiReply(txt, match, [...hist, nm]);
    const fb = ["That sounds amazing! 😊", "I love that! Tell me more 💕", "Haha you're so funny 😂", "We have so much in common! ✨", "Best convo I've had on here 🔥", "I'm literally smiling reading this 🥰"];
    setTimeout(() => {
      setConvos(p => ({ ...p, [mid]: [...(p[mid] || []), { id: Date.now() + 1, from: "them", text: rep || fb[Math.floor(Math.random() * fb.length)], time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), rx: [], ai: !!rep }] }));
      setTyping(false);
    }, rep ? 600 : 1500 + Math.random() * 2000);
  };
  const rxMsg = (mid, msgId, emoji) => { setConvos(p => ({ ...p, [mid]: p[mid].map(m => m.id === msgId ? { ...m, rx: [...(m.rx || []), emoji] } : m) })); setShowRx(null); };
  const fetchCoach = async () => { if (!match) return; setCoachLoad(true); setCoachSugs(await aiSuggest(match) || ICEBREAKERS.slice(0, 3)); setCoachLoad(false); };
  const fetchDates = async () => { setGenieLoad(true); setGenieDates(await aiDates() || DATE_IDEAS.slice(0, 3)); setGenieLoad(false); };
  const genBio = async () => { setBioLoad(true); setBioOut(await aiBio() || "I believe the best connections start with genuine curiosity and shared laughter. Always up for an adventure or a deep conversation over good coffee. ✨"); setBioLoad(false); };
  const openChat = p => { setMatch(p); setView("chat"); };
  const msgs = match ? (convos[match.id] || []) : [];

  // ── Quiz validation ────────────────────────────────────────────────────────
  const quizValid = () => { const s = QUIZ_STEPS[qStep]; if (!s) return false; if (s.optional) return true; if (s.slider) return true; if (s.multi) return (quiz[s.key]?.length || 0) >= 1; return !!quiz[s.key]; };

  const Nav = () => (
    <div role="navigation" aria-label="Main navigation" style={{ display: "flex", justifyContent: "space-around", padding: "12px 20px 18px", background: C.glass, backdropFilter: "blur(30px)", borderTop: `1px solid ${C.brd}`, width: "100%" }}>
      {[{ i: "🔥", l: "Discover", v: "discover" }, { i: "💬", l: "Chats", v: "chats" }, { i: "👤", l: "Profile", v: "profile" }, { i: "⚙️", l: "Settings", v: "settings" }].map(n => (
        <button key={n.l} className="bp" onClick={() => { setView(n.v); if (n.v === "chats") setTab("matches"); if (n.v === "discover") setTab("discover"); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", padding: 6, ...bpS }}>
          <span style={{ fontSize: 24, filter: view === n.v ? "none" : "grayscale(0.5) opacity(0.35)", transition: "all 0.3s" }}>{n.i}</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: view === n.v ? C.pop : C.dim, transition: "color 0.3s" }}>{n.l}</span>
          {view === n.v && <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.pop, marginTop: -2, animation: "pop 0.3s ease" }} />}
        </button>
      ))}
    </div>
  );

  // ── Loading screen ─────────────────────────────────────────────────────────
  if (authLoading) return (
    <div style={{ fontFamily: "'Outfit'", background: C.bg, color: C.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <BG />
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <div style={{ fontSize: 60, marginBottom: 16, animation: "float 2s ease infinite" }}>💝</div>
        <h1 style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Sora'" }}><span className="gt">Auto-Mate</span></h1>
        <p style={{ fontSize: 14, color: C.dim, marginTop: 8 }}>Loading...</p>
      </div>
    </div>
  );

  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{ fontFamily: "'Outfit'", background: C.bg, color: C.text, minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{opacity:0;transform:scale(0.6)}50%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.35}}
        @keyframes glow{0%,100%{box-shadow:0 0 25px rgba(255,60,172,0.35)}50%{box-shadow:0 0 55px rgba(120,75,160,0.65)}}
        @keyframes bounce{0%{transform:scale(0)}50%{transform:scale(1.25)}100%{transform:scale(1)}}
        @keyframes dots{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-8px)}}
        @keyframes grad{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes slideR{from{opacity:0;transform:translateX(28px)}to{opacity:1;transform:translateX(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scan{0%{top:0}100%{top:100%}}
        @keyframes aiGlow{0%,100%{filter:drop-shadow(0 0 10px rgba(168,85,247,0.5))}50%{filter:drop-shadow(0 0 25px rgba(99,102,241,0.7))}}
        @keyframes aiMsgGlow{0%,100%{box-shadow:0 0 12px rgba(99,102,241,0.3),0 0 4px rgba(168,85,247,0.2)}50%{box-shadow:0 0 24px rgba(99,102,241,0.5),0 0 8px rgba(6,182,212,0.3)}}
        @keyframes toast{from{opacity:0;transform:translateX(-50%) translateY(-24px) scale(0.9)}to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)}}
        @keyframes heartbeat{0%,100%{transform:scale(1)}15%{transform:scale(1.2)}30%{transform:scale(1)}45%{transform:scale(1.14)}}
        @keyframes matchReveal{0%{opacity:0;transform:scale(0.3) rotate(-10deg)}50%{transform:scale(1.1) rotate(2deg)}100%{opacity:1;transform:scale(1) rotate(0deg)}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0)}100%{transform:translateY(100vh) rotate(720deg)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        *{box-sizing:border-box;margin:0;padding:0}
        *::-webkit-scrollbar{width:4px}*::-webkit-scrollbar-thumb{background:rgba(120,75,160,0.2);border-radius:10px}
        html,body,#root{height:100%}
        .bp{transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1);cursor:pointer}
        .bp:hover{transform:scale(1.06);filter:brightness(1.1)}
        .bp:active{transform:scale(0.93)}
        .ig{transition:all 0.3s ease}
        .ig:focus{box-shadow:0 0 0 3px rgba(255,60,172,0.2),0 0 28px rgba(120,75,160,0.15);border-color:rgba(255,60,172,0.4)!important}
        .gt{background:${C.g1};background-size:200% 200%;animation:grad 4s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hov{transition:transform 0.4s,box-shadow 0.4s}.hov:hover{transform:perspective(800px) rotateY(2deg) rotateX(-2deg) translateY(-5px);box-shadow:0 22px 65px rgba(120,75,160,0.25)}
        .w{width:100%;max-width:800px;flex:1;display:flex;flex-direction:column;position:relative;z-index:1;min-height:100vh;overflow-y:auto}
        @media(min-width:768px){.w{border-left:1px solid rgba(118,92,220,0.06);border-right:1px solid rgba(118,92,220,0.06)}}
        .glow-btn{position:relative;overflow:hidden}
        .glow-btn::after{content:'';position:absolute;inset:-2px;border-radius:inherit;background:${C.g1};opacity:0;transition:opacity 0.3s;z-index:-1;filter:blur(12px)}
        .glow-btn:hover::after{opacity:0.4}
        /* ── ACCESSIBILITY ── */
        *:focus-visible{outline:3px solid rgba(255,60,172,0.6)!important;outline-offset:2px;border-radius:inherit}
        @media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important}}
        .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
        @media(prefers-contrast:high){.bp{border:2px solid currentColor!important}}
        button,input,textarea,select{font-family:inherit}
        img{max-width:100%}
      `}</style>

      <BG />
      {booms.map(b => <Boom key={b.id} x={b.x} y={b.y} onDone={() => setBooms(p => p.filter(v => v.id !== b.id))} />)}
      {toast && <div style={{ position: "fixed", top: 28, left: "50%", transform: "translateX(-50%)", zIndex: 9999, padding: "14px 28px", borderRadius: 20, background: C.g1, color: "white", fontSize: 15, fontWeight: 600, animation: "toast 0.35s cubic-bezier(0.34,1.56,0.64,1)", boxShadow: "0 10px 40px rgba(255,60,172,0.45)", whiteSpace: "nowrap" }}>{toast}</div>}

      {/* ══ MATCH ANIMATION ══ */}
      {matchAnim && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(5,5,13,0.92)", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.3s ease" }} onClick={() => { setMatchAnim(null); openChat(matchAnim); }}>
          {Array.from({ length: 20 }).map((_, i) => <div key={i} style={{ position: "absolute", top: -20, left: `${5 + Math.random() * 90}%`, width: 8 + Math.random() * 8, height: 8 + Math.random() * 8, borderRadius: Math.random() > 0.5 ? "50%" : "2px", background: `hsla(${260 + Math.random() * 100},90%,65%,0.8)`, animation: `confetti ${2 + Math.random() * 3}s linear ${Math.random() * 0.5}s forwards` }} />)}
          <div style={{ animation: "matchReveal 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: 30, overflow: "hidden", border: `3px solid ${C.pop}`, boxShadow: "0 0 40px rgba(255,60,172,0.4)", zIndex: 2 }}><img src={matchAnim.photo_url || matchAnim.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: C.g1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 -15px", zIndex: 3, boxShadow: "0 0 30px rgba(255,60,172,0.5)", animation: "heartbeat 1s ease infinite" }}>💝</div>
              <div style={{ width: 100, height: 100, borderRadius: 30, overflow: "hidden", border: "3px solid rgba(120,75,160,0.5)", boxShadow: "0 0 40px rgba(120,75,160,0.3)", zIndex: 2, background: C.g1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40 }}>{me.photo_url ? <img src={me.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : me.name ? me.name[0] : "?"}</div>
            </div>
            <h2 style={{ fontSize: 32, fontWeight: 900, fontFamily: "'Sora'", textAlign: "center", marginBottom: 8 }}><span className="gt">It's a Match!</span></h2>
            <p style={{ fontSize: 15, color: C.soft, textAlign: "center", marginBottom: 6 }}>You and {matchAnim.name} liked each other</p>
            <p style={{ fontSize: 22, fontWeight: 800, textAlign: "center", marginBottom: 24 }}><span className="gt">{matchAnim.compat}%</span> <span style={{ fontSize: 14, color: C.dim }}>compatible</span></p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Btn onClick={() => { setMatchAnim(null); openChat(matchAnim); }} s={{ fontSize: 16, padding: "16px 36px" }}>💬 Send a Message</Btn>
              <Btn onClick={() => { aiDeepDive(matchAnim); }} g={C.gAI} s={{ fontSize: 16, padding: "16px 28px" }}>{deepDiveLoad ? "🔮 Analyzing..." : "🔮 Relationship Forecast"}</Btn>
              <Btn onClick={() => setMatchAnim(null)} g={C.card2} s={{ fontSize: 16, padding: "16px 28px", boxShadow: "none", border: `1px solid ${C.brd}` }}>Later</Btn>
            </div>
            {/* Deep Dive Results */}
            {matchDeepDive && <div style={{ marginTop: 24, maxWidth: 500, width: "100%", animation: "fadeUp 0.5s ease" }}>
              <Card s={{ padding: 20, marginBottom: 14 }}>
                <h3 style={{ fontSize: 18, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 14, textAlign: "center" }}><span className="gt">🔮 Relationship Forecast</span></h3>
                <p style={{ fontSize: 15, color: C.soft, textAlign: "center", fontStyle: "italic", marginBottom: 18, lineHeight: 1.6 }}>{matchDeepDive.forecast}</p>
                {matchDeepDive.score_breakdown && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 18 }}>
                  {Object.entries(matchDeepDive.score_breakdown).map(([k, v]) => <div key={k} style={{ textAlign: "center", padding: "10px 6px", borderRadius: 14, background: C.card2, border: `1px solid ${C.brd}` }}><p style={{ fontSize: 11, color: C.dim, textTransform: "capitalize", marginBottom: 4 }}>{k}</p><p style={{ fontSize: 20, fontWeight: 800 }}><span className="gt">{v}%</span></p></div>)}
                </div>}
                <p style={{ fontSize: 13, fontWeight: 700, color: C.green, marginBottom: 8 }}>💪 Strengths</p>
                {matchDeepDive.strengths?.map((s, i) => <p key={i} style={{ fontSize: 14, color: C.soft, marginBottom: 6, paddingLeft: 16, borderLeft: `2px solid ${C.green}` }}>{s}</p>)}
                <p style={{ fontSize: 13, fontWeight: 700, color: C.pop, marginTop: 14, marginBottom: 8 }}>🌱 Growth Areas</p>
                {matchDeepDive.growth?.map((g, i) => <p key={i} style={{ fontSize: 14, color: C.soft, marginBottom: 6, paddingLeft: 16, borderLeft: `2px solid ${C.pop}` }}>{g}</p>)}
                <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(99,102,241,0.9)", marginTop: 14, marginBottom: 8 }}>💬 Conversation Starters</p>
                {matchDeepDive.starters?.map((s, i) => <button key={i} className="bp" onClick={() => { setMatchAnim(null); setMatchDeepDive(null); openChat(matchAnim); setMsg(s); }} style={{ display: "block", width: "100%", padding: "10px 14px", marginBottom: 6, borderRadius: 14, background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.2)", color: C.soft, fontSize: 13, textAlign: "left", ...bpS }}>{s}</button>)}
              </Card>
            </div>}
          </div>
        </div>
      )}

      {/* ══════════════════ LANDING ══════════════════ */}
      {page === "landing" && (
        <div className="w" style={{ alignItems: "center", justifyContent: "center", padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 22, animation: "float 3s ease infinite", filter: "drop-shadow(0 0 35px rgba(255,60,172,0.5))" }}>💝</div>
          <h1 style={{ fontSize: 48, fontWeight: 900, fontFamily: "'Sora'", marginBottom: 10, animation: "fadeUp 0.7s ease 0.2s both", lineHeight: 1.1 }}><span className="gt">Auto-Mate</span></h1>
          <p style={{ fontSize: 18, color: C.soft, fontWeight: 500, marginBottom: 8, animation: "fadeUp 0.7s ease 0.3s both" }}>AI-Powered Dating</p>
          <p style={{ fontSize: 15, color: C.dim, lineHeight: 1.8, marginBottom: 40, maxWidth: 500, animation: "fadeUp 0.7s ease 0.4s both" }}>Meaningful connections through personality matching, compatibility scoring, and intelligent conversation.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 36, maxWidth: 400, width: "100%", animation: "fadeUp 0.7s ease 0.5s both" }}>
            {[{ e: "🧠", t: "AI Matching", d: "Smart compatibility" }, { e: "🛡️", t: "Safe Dating", d: "ID verified" }, { e: "💬", t: "AI Coach", d: "Conversation help" }, { e: "✨", t: "Real Connections", d: "Not endless swiping" }].map((f, i) => (
              <Card key={i} className="hov" s={{ padding: 18, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{f.e}</div>
                <p style={{ fontSize: 14, fontWeight: 700 }}>{f.t}</p>
                <p style={{ fontSize: 12, color: C.dim }}>{f.d}</p>
              </Card>
            ))}
          </div>
          <div style={{ display: "flex", gap: 14, animation: "fadeUp 0.7s ease 0.6s both" }}>
            <Btn onClick={() => setPage("signup")} s={{ fontSize: 18, padding: "18px 40px" }}>Get Started</Btn>
            <Btn onClick={() => setPage("login")} g={C.card2} s={{ fontSize: 18, padding: "18px 32px", boxShadow: "none", border: `1px solid ${C.brd}` }}>Log In</Btn>
          </div>
        </div>
      )}

      {/* ══════════════════ SIGNUP ══════════════════ */}
      {page === "signup" && (
        <div className="w" style={{ padding: 30, justifyContent: "center" }}>
          <button className="bp" onClick={() => setPage("landing")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: C.soft, fontSize: 15, marginBottom: 20, ...bpS }}>← Back</button>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✨</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Sora'" }}>Create Account</h2>
            <p style={{ fontSize: 14, color: C.dim, marginTop: 6 }}>Start finding meaningful connections</p>
          </div>
          {authError && <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff6b6b", fontSize: 14, marginBottom: 16 }}>{authError}</div>}
          <Inp label="Full Name" placeholder="Your name" value={authForm.name} onChange={e => setAuthForm(p => ({ ...p, name: e.target.value }))} />
          <Inp label="Email" placeholder="you@email.com" type="email" value={authForm.email} onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} />
          <Inp label="Password" placeholder="Min 6 characters" type="password" value={authForm.pw} onChange={e => setAuthForm(p => ({ ...p, pw: e.target.value }))} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Inp label="Age" placeholder="25" type="number" value={authForm.age} onChange={e => setAuthForm(p => ({ ...p, age: e.target.value }))} />
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 700, color: C.soft, marginBottom: 8, display: "block" }}>I Identify As</label>
              <select className="ig" value={authForm.gender} onChange={e => setAuthForm(p => ({ ...p, gender: e.target.value }))} style={{ width: "100%", padding: "15px 20px", borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card, color: C.text, fontSize: 15, fontFamily: "'Outfit'" }}>
                <option value="">Select</option><option>Man</option><option>Woman</option><option>Non-binary</option><option>Trans Man</option><option>Trans Woman</option><option>Genderqueer</option><option>Genderfluid</option><option>Other</option><option>Prefer not to say</option>
              </select>
            </div>
          </div>
          <Inp label="City" placeholder="Seattle, WA" value={authForm.city} onChange={e => setAuthForm(p => ({ ...p, city: e.target.value }))} />
          <Btn onClick={signUp} s={{ width: "100%", fontSize: 17, marginTop: 8 }}>Create Account →</Btn>
          <p style={{ textAlign: "center", fontSize: 14, color: C.dim, marginTop: 18 }}>Already have an account? <button className="bp" onClick={() => setPage("login")} style={{ background: "none", border: "none", color: C.pop, fontWeight: 700, fontSize: 14, ...bpS }}>Log In</button></p>
        </div>
      )}

      {/* ══════════════════ LOGIN ══════════════════ */}
      {page === "login" && (
        <div className="w" style={{ padding: 30, justifyContent: "center" }}>
          <button className="bp" onClick={() => setPage("landing")} style={{ alignSelf: "flex-start", background: "none", border: "none", color: C.soft, fontSize: 15, marginBottom: 20, ...bpS }}>← Back</button>
          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>💝</div>
            <h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Sora'" }}>Welcome Back</h2>
            <p style={{ fontSize: 14, color: C.dim, marginTop: 6 }}>Log in to continue</p>
          </div>
          {authError && <div style={{ padding: "12px 16px", borderRadius: 14, background: "rgba(255,80,80,0.1)", border: "1px solid rgba(255,80,80,0.2)", color: "#ff6b6b", fontSize: 14, marginBottom: 16 }}>{authError}</div>}
          <Inp label="Email" placeholder="you@email.com" type="email" value={authForm.email} onChange={e => setAuthForm(p => ({ ...p, email: e.target.value }))} />
          <Inp label="Password" placeholder="Your password" type="password" value={authForm.pw} onChange={e => setAuthForm(p => ({ ...p, pw: e.target.value }))} />
          <Btn onClick={logIn} s={{ width: "100%", fontSize: 17, marginTop: 8 }}>Log In →</Btn>
          <button className="bp" onClick={async () => { if (!authForm.email) { setAuthError("Enter your email first"); return; } const { error } = await supabase.auth.resetPasswordForEmail(authForm.email); if (error) setAuthError(error.message); else setToast("Password reset email sent! 📧"); }} style={{ display: "block", width: "100%", textAlign: "center", background: "none", border: "none", color: C.dim, fontSize: 13, marginTop: 14, cursor: "pointer" }}>Forgot password?</button>
          <p style={{ textAlign: "center", fontSize: 14, color: C.dim, marginTop: 14 }}>Don't have an account? <button className="bp" onClick={() => setPage("signup")} style={{ background: "none", border: "none", color: C.pop, fontWeight: 700, fontSize: 14, ...bpS }}>Sign Up</button></p>
        </div>
      )}

      {/* ══════════════════ QUIZ ══════════════════ */}
      {page === "quiz" && (
        <div className="w" style={{ padding: 30 }}>
          <div style={{ display: "flex", gap: 6, justifyContent: "center", marginTop: 22, marginBottom: 30 }}>
            {QUIZ_STEPS.map((_, i) => <div key={i} style={{ width: i === qStep ? 28 : 10, height: 10, borderRadius: 10, background: i <= qStep ? C.g1 : "rgba(120,75,160,0.12)", transition: "all 0.5s", boxShadow: i === qStep ? "0 2px 12px rgba(255,60,172,0.3)" : "none" }} />)}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {(() => { const sec = QUIZ_STEPS[qStep]; if (!sec) return null; return (
              <div style={{ animation: "fadeUp 0.4s ease" }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{ fontSize: 48, marginBottom: 10, animation: "bounce 0.6s ease" }}>{sec.icon}</div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 6 }}>{sec.title}</h2>
                  <p style={{ fontSize: 16, color: C.dim }}>{sec.q}</p>
                  {sec.optional && <p style={{ fontSize: 12, color: C.pop, marginTop: 6 }}>Optional — skip if you prefer</p>}
                  <p style={{ fontSize: 12, color: "rgba(180,172,220,0.3)", marginTop: 8 }}>{qStep + 1} of {QUIZ_STEPS.length}</p>
                </div>
                {sec.slider ? (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: 56, fontWeight: 900, marginBottom: 16 }}><span className="gt">{quiz.intimacy}/10</span></div>
                    <input type="range" min={1} max={10} value={quiz.intimacy} onChange={e => setQuiz(p => ({ ...p, intimacy: parseInt(e.target.value) }))} style={{ width: "100%", maxWidth: 400 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", maxWidth: 400, margin: "10px auto", color: C.dim, fontSize: 13 }}><span>Not important</span><span>Very important</span></div>
                  </div>
                ) : sec.multi ? (
                  <div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
                      {sec.opts.map(o => { const sel = quiz[sec.key]?.includes(o), full = quiz[sec.key]?.length >= sec.max && !sel;
                        return <button key={o} className="bp" disabled={full} onClick={() => setQuiz(p => ({ ...p, [sec.key]: sel ? p[sec.key].filter(v => v !== o) : [...(p[sec.key] || []), o] }))}
                          style={{ padding: "12px 22px", borderRadius: 30, border: sel ? "none" : `1px solid ${C.brd}`, background: sel ? C.g2 : C.card, color: sel ? "white" : full ? "rgba(200,190,230,0.2)" : C.soft, fontSize: 15, fontWeight: 600, opacity: full ? 0.3 : 1, ...bpS }}>{o}</button>; })}
                    </div>
                    <p style={{ fontSize: 13, color: C.dim, marginTop: 10, textAlign: "center" }}>Selected {quiz[sec.key]?.length || 0}/{sec.max}</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sec.opts.map((o, i) => <button key={o} className="bp" onClick={() => setQuiz(p => ({ ...p, [sec.key]: o }))}
                      style={{ padding: "17px 22px", borderRadius: 20, border: quiz[sec.key] === o ? "none" : `1px solid ${C.brd}`, background: quiz[sec.key] === o ? C.g1 : C.card, color: quiz[sec.key] === o ? "white" : C.soft, fontSize: 16, fontWeight: 600, textAlign: "left", animation: `fadeUp 0.3s ease ${i * 0.05}s both`, boxShadow: quiz[sec.key] === o ? "0 6px 25px rgba(255,60,172,0.25)" : "none", ...bpS }}>{o}</button>)}
                  </div>
                )}
              </div>
            ); })()}
          </div>
          <div style={{ display: "flex", gap: 14, paddingBottom: 22 }}>
            {qStep > 0 && <Btn onClick={() => setQStep(s => s - 1)} g={C.card} s={{ flex: 1, boxShadow: "none", border: `1px solid ${C.brd}` }}>Back</Btn>}
            {QUIZ_STEPS[qStep]?.optional && <Btn onClick={() => { if (qStep < QUIZ_STEPS.length - 1) setQStep(s => s + 1); else { const updates = { interests: quiz.interests, values: quiz.values, goals: quiz.intent, comm_style: quiz.comm_style, lifestyle: quiz.lifestyle, intimacy: quiz.intimacy, identity: quiz.identity, seeking: quiz.seeking, relationship_mode: quiz.intent, education: quiz.education, profession: quiz.profession, smoking: quiz.smoking, drinking: quiz.drinking, cannabis: quiz.cannabis, has_kids: quiz.has_kids, wants_kids: quiz.wants_kids, exercise: quiz.exercise, diet: quiz.diet, pets: quiz.pets, religion: quiz.religion, politics: quiz.politics, star_sign: quiz.star_sign }; saveProfile(updates); setPage("verify"); setToast("Quiz complete! 🧠"); } }} g={C.card2} s={{ flex: 1, boxShadow: "none", border: `1px solid ${C.brd}` }}>Skip</Btn>}
            <Btn onClick={() => {
              if (!quizValid()) { setToast("Please make a selection"); return; }
              if (qStep < QUIZ_STEPS.length - 1) setQStep(s => s + 1);
              else {
                const updates = { interests: quiz.interests, values: quiz.values, goals: quiz.intent, comm_style: quiz.comm_style, lifestyle: quiz.lifestyle, intimacy: quiz.intimacy, identity: quiz.identity, seeking: quiz.seeking, relationship_mode: quiz.intent, education: quiz.education, profession: quiz.profession, smoking: quiz.smoking, drinking: quiz.drinking, cannabis: quiz.cannabis, has_kids: quiz.has_kids, wants_kids: quiz.wants_kids, exercise: quiz.exercise, diet: quiz.diet, pets: quiz.pets, religion: quiz.religion, politics: quiz.politics, star_sign: quiz.star_sign };
                saveProfile(updates);
                // Request location for distance-based matching
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(pos => {
                    saveProfile({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
                  }, () => {}, { enableHighAccuracy: false, timeout: 5000 });
                }
                // Save quiz to Supabase
                if (user) {
                  supabase.from("quiz_answers").upsert({ user_id: user.id, intent: quiz.intent, core_values: quiz.values, lifestyle: quiz.lifestyle, comm_style: quiz.comm_style, interests: quiz.interests, intimacy: quiz.intimacy }, { onConflict: "user_id" }).then(() => {});
                }
                setPage("verify");
                setToast("Quiz complete! AI scoring your matches 🧠");
              }
            }} s={{ flex: 2 }} disabled={!quizValid()}>{qStep === QUIZ_STEPS.length - 1 ? "Finish Quiz →" : "Continue"}</Btn>
          </div>
        </div>
      )}

      {/* ══════════════════ VERIFY ══════════════════ */}
      {page === "verify" && (
        <div className="w" style={{ padding: 30 }}>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 26, marginBottom: 34 }}>
            {["ID", "Selfie", "Verify", "Done"].map((l, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 32, height: 32, borderRadius: "50%", background: i <= vStep ? C.g1 : "rgba(120,75,160,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800, color: i <= vStep ? "white" : C.dim, transition: "all 0.5s", boxShadow: i <= vStep ? "0 4px 15px rgba(255,60,172,0.25)" : "none" }}>{i < vStep ? "✓" : i + 1}</div>{i < 3 && <div style={{ width: 20, height: 3, borderRadius: 3, background: i < vStep ? C.pop : "rgba(120,75,160,0.08)", transition: "all 0.5s" }} />}</div>)}
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            {vStep === 0 && <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease", width: "100%", maxWidth: 500 }}><div style={{ width: 96, height: 96, borderRadius: 28, margin: "0 auto 24px", background: "rgba(120,75,160,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 42, border: "2px dashed rgba(120,75,160,0.2)" }}>🪪</div><h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 10 }}>Upload Your ID</h2><p style={{ fontSize: 15, color: C.dim, marginBottom: 28 }}>Government-issued ID for verification</p><Card className="hov" s={{ padding: 32, cursor: "pointer", borderStyle: "dashed", borderWidth: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }} onClick={() => setVStep(1)}><div style={{ fontSize: 38 }}>📤</div><p style={{ fontSize: 16, fontWeight: 600 }}>Tap to upload</p><p style={{ fontSize: 13, color: C.dim }}>JPG, PNG or PDF</p></Card></div>}
            {vStep === 1 && <div style={{ textAlign: "center", animation: "fadeUp 0.5s ease" }}><div style={{ width: 170, height: 170, borderRadius: "50%", margin: "0 auto 24px", background: C.card, border: "3px solid rgba(120,75,160,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}><span style={{ fontSize: 60 }}>🤳</span><div style={{ position: "absolute", left: 0, right: 0, height: 4, background: C.g1, animation: "scan 2s ease-in-out infinite", boxShadow: "0 0 20px rgba(255,60,172,0.5)" }} /></div><h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 10 }}>Take a Selfie</h2><p style={{ fontSize: 15, color: C.dim, marginBottom: 28 }}>AI facial recognition matching</p><Btn onClick={() => { setVStep(2); setTimeout(() => setVStep(3), 3500); }}>📸 Capture Selfie</Btn></div>}
            {vStep === 2 && <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}><div style={{ width: 86, height: 86, borderRadius: "50%", margin: "0 auto 24px", border: "4px solid transparent", borderTopColor: C.pop, borderRightColor: "rgba(120,75,160,0.2)", animation: "spin 0.8s linear infinite" }} /><h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 10 }}>Verifying...</h2>{["Document authenticity", "Facial recognition match", "Age verification"].map((st, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", justifyContent: "center", animation: `fadeUp 0.5s ease ${i * 0.5}s both` }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: i < 2 ? C.green : "transparent", border: i >= 2 ? `2px solid ${C.pop}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "white" }}>{i < 2 ? "✓" : ""}</div><span style={{ fontSize: 15, color: C.soft }}>{st}</span></div>)}</div>}
            {vStep === 3 && <div style={{ textAlign: "center", animation: "pop 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}><div style={{ width: 110, height: 110, borderRadius: "50%", margin: "0 auto 24px", background: "rgba(0,232,123,0.08)", border: "3px solid rgba(0,232,123,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, animation: "glow 2s ease infinite" }}>✅</div><h2 style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 10 }}><span className="gt">Identity Verified!</span></h2><p style={{ fontSize: 15, color: C.dim }}>Safe Date mode unlocked</p></div>}
          </div>
          {(vStep === 0 || vStep === 3) && <div style={{ display: "flex", gap: 14, paddingBottom: 22 }}>
            {vStep === 0 && <Btn onClick={() => setPage("plan")} g={C.card} s={{ flex: 1, boxShadow: "none", border: `1px solid ${C.brd}` }}>Skip</Btn>}
            <Btn onClick={() => { if (vStep === 3) { if (user) saveProfile({ verified: true }); setPage("plan"); } else setVStep(1); }} s={{ flex: 2 }}>{vStep === 3 ? "Continue →" : "Upload ID"}</Btn>
          </div>}
        </div>
      )}

      {/* ══════════════════ PLAN ══════════════════ */}
      {page === "plan" && (
        <div className="w" style={{ padding: 30, overflowY: "auto" }}>
          <div style={{ textAlign: "center", marginTop: 22, marginBottom: 30 }}><h2 style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 8 }}>Choose Your <span className="gt">Plan</span></h2><p style={{ fontSize: 15, color: C.dim }}>Unlock Auto-Mate's full power</p></div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16, marginBottom: 18 }}>
            {[{ t: "Free", p: "$0", per: "/forever", badge: null, feats: ["5 matches/day", "Basic chat", "Standard profiles"], gr: C.card2 }, { t: "Premium", p: "$14.99", per: "/mo", badge: "POPULAR", feats: ["Unlimited matches", "AI Icebreakers", "See who liked you", "Read receipts", "AI Profile Writer"], gr: C.g2 }, { t: "Elite", p: "$29.99", per: "/mo", badge: "BEST VALUE", feats: ["Everything in Premium", "AI Genie Matchmaker", "Soulmate Picks", "Safe Date mode", "Video calls", "Profile boost 5x"], gr: C.gX }].map((pl, i) => (
              <Card key={pl.t} className="hov bp" onClick={() => setPlan(pl.t)} s={{ padding: 0, overflow: "hidden", animation: `fadeUp 0.5s ease ${i * 0.12}s both`, border: plan === pl.t ? `2px solid ${C.pop}` : `1px solid ${C.brd}`, boxShadow: plan === pl.t ? "0 10px 45px rgba(255,60,172,0.25)" : "none", ...bpS }}>
                {pl.badge && <div style={{ padding: "7px 0", textAlign: "center", background: pl.gr, fontSize: 12, fontWeight: 800, color: "white", letterSpacing: 1.5 }}>{pl.badge}</div>}
                <div style={{ padding: "20px 22px" }}><div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 20, fontWeight: 800 }}>{pl.t}</span><div><span style={{ fontSize: 30, fontWeight: 900 }}>{pl.p}</span><span style={{ fontSize: 13, color: C.dim }}>{pl.per}</span></div></div>{pl.feats.map(f => <div key={f} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 7 }}><span style={{ fontSize: 13, color: C.green }}>✓</span><span style={{ fontSize: 14, color: C.soft }}>{f}</span></div>)}</div>
              </Card>
            ))}
          </div>
          <div style={{ padding: "22px 0 14px" }}><Btn onClick={() => { if (user) saveProfile({ plan: plan || "free" }); setPage("app"); setToast(`Welcome to Auto-Mate${plan ? ` ${plan}` : ""}! 🎉`); }} s={{ width: "100%", fontSize: 18 }}>{plan ? `Start with ${plan}` : "Continue Free"}</Btn></div>
        </div>
      )}

      {/* ══════════════════ APP: DISCOVER ══════════════════ */}
      {page === "app" && view === "discover" && (
        <div className="w" role="main" aria-label="Discover matches">
          <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between", background: "linear-gradient(180deg, rgba(120,75,160,0.12) 0%, transparent 100%)" }}>
            <h1 style={{ fontSize: 28, fontWeight: 900, fontFamily: "'Sora'" }}><span className="gt">Auto-Mate</span></h1>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="bp" onClick={() => setShowStars(true)} style={{ width: 42, height: 42, borderRadius: 16, ...glass, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, ...bpS }} aria-label="In The Stars">🌌</button>
              <button className="bp" onClick={() => setGenie(true)} style={{ width: 42, height: 42, borderRadius: 16, ...glass, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, animation: "aiGlow 3s ease infinite", ...bpS }} aria-label="AI Genie">🧞</button>
              <button className="bp" onClick={() => setSafety(true)} style={{ width: 42, height: 42, borderRadius: 16, ...glass, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, ...bpS }} aria-label="Safe Date">🛡️</button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, padding: "16px 24px 12px" }}>
            {[{ k: "discover", l: "Discover", i: "🔥" }, { k: "saved", l: "Saved", i: "🔖", c: saved.size }, { k: "matches", l: "Matches", i: "💕", c: liked.size }].map(t => (
              <button key={t.k} className="bp" onClick={() => setTab(t.k)} style={{ padding: "10px 18px", borderRadius: 30, border: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, background: tab === t.k ? C.g1 : C.card2, color: tab === t.k ? "white" : C.soft, boxShadow: tab === t.k ? "0 5px 20px rgba(255,60,172,0.35)" : "none", ...bpS }}>
                {t.i} {t.l}{t.c > 0 && <span style={{ fontSize: 11, fontWeight: 700, background: tab === t.k ? "rgba(255,255,255,0.22)" : "rgba(255,60,172,0.12)", color: tab === t.k ? "white" : C.pop, padding: "2px 7px", borderRadius: 10 }}>{t.c}</span>}
              </button>
            ))}
          </div>
          <div style={{ padding: "0 24px 12px" }}><div style={{ position: "relative" }}><span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 16, opacity: 0.4 }}>🔍</span><input className="ig" aria-label="Search matches" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search matches..." style={{ width: "100%", padding: "14px 18px 14px 46px", borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card, color: C.text, fontSize: 15, fontFamily: "'Outfit'", outline: "none" }} /></div></div>
          {/* Mood Status */}
          <div style={{ padding: "0 24px 12px", display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none" }}>
            {["Looking to chat 💬", "Open to meeting 🌙", "Just browsing 👀", "Taking it slow 🐢"].map(mood => (
              <button key={mood} className="bp" onClick={() => { setMoodStatus(mood); setToast(`Status: ${mood}`); }} style={{ padding: "8px 14px", borderRadius: 20, border: moodStatus === mood ? "none" : `1px solid ${C.brd}`, background: moodStatus === mood ? C.gAI : "transparent", color: moodStatus === mood ? "white" : C.dim, fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", ...bpS }}>{mood}</button>
            ))}
          </div>
          {/* Daily Question Banner */}
          <button className="bp" onClick={() => setShowDaily(true)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px", margin: "0 24px 12px", borderRadius: 20, background: "linear-gradient(135deg, rgba(255,60,172,0.08), rgba(120,75,160,0.08))", border: "1px solid rgba(255,60,172,0.15)", textAlign: "left", ...bpS }}>
            <div style={{ fontSize: 28, flexShrink: 0 }}>📝</div>
            <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 13, fontWeight: 700, color: C.pop, marginBottom: 2 }}>Today's Question</p><p style={{ fontSize: 14, color: C.soft, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{getTodayQ()}</p></div>
            <span style={{ fontSize: 12, color: C.dim, flexShrink: 0 }}>Answer →</span>
          </button>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 100px" }}>
            {tab === "discover" && visible.length === 0 && <div style={{ textAlign: "center", padding: "60px 0", animation: "fadeUp 0.5s ease" }}><div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div><p style={{ fontSize: 16, color: C.dim }}>No more profiles to show</p><Btn onClick={() => { setPassed(new Set()); setToast("Profiles refreshed!"); }} s={{ marginTop: 16, fontSize: 14 }}>Reset Passes</Btn></div>}
            {tab === "discover" && visible.map((p, i) => (
              <Card key={p.id} className="hov" s={{ marginBottom: 18, overflow: "hidden", padding: 0, animation: `fadeUp 0.45s ease ${i * 0.1}s both` }}>
                <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setModal(p)}>
                  <img src={p.photo_url || p.photo || "https://i.pravatar.cc/300"} alt={`${p.name}, ${p.age}`} style={{ width: "100%", height: 260, objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "55px 20px 14px", background: "linear-gradient(transparent,rgba(0,0,0,0.88))" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 22, fontWeight: 800, color: "white" }}>{p.name}, {p.age}</span>
                      {p.verified && <span style={{ padding: "3px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: "rgba(0,232,123,0.2)", color: C.green }}>✓ Verified</span>}
                      <span style={{ marginLeft: "auto", padding: "5px 12px", borderRadius: 14, background: "rgba(255,60,172,0.2)", fontSize: 14, fontWeight: 700, color: "#ff6eb4" }}>{p.compat}%</span>
                    </div>
                    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)" }}>{p.city} · {p.job}</p>
                  </div>
                </div>
                <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.brd}` }}><p style={{ fontSize: 14, color: C.soft, lineHeight: 1.65 }}>💡 <em>{p.why}</em></p></div>
                <div style={{ display: "flex", gap: 10, padding: 14, justifyContent: "center" }} role="group" aria-label="Actions">
                  <button className="bp" aria-label={`Pass on ${p.name}`} onClick={() => { setPassed(s => new Set([...s, p.id])); setToast("Passed"); }} style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(255,80,80,0.08)", border: "1.5px solid rgba(255,80,80,0.2)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", ...bpS }}>✕</button>
                  <button className="bp" aria-label={saved.has(p.id) ? `Unsave ${p.name}` : `Save ${p.name}`} onClick={() => doSave(p)} style={{ width: 50, height: 50, borderRadius: "50%", background: saved.has(p.id) ? "rgba(250,180,0,0.12)" : "rgba(200,180,255,0.06)", border: `1.5px solid ${saved.has(p.id) ? "rgba(250,180,0,0.3)" : "rgba(200,180,255,0.12)"}`, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", ...bpS }}>🔖</button>
                  <button className="bp glow-btn" aria-label={liked.has(p.id) ? `Unlike ${p.name}` : `Like ${p.name}`} onClick={e => doLike(p, e)} style={{ width: 58, height: 58, borderRadius: "50%", background: liked.has(p.id) ? C.g3 : C.g1, border: "none", fontSize: 24, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 28px rgba(255,60,172,0.4)", ...bpS }}>💝</button>
                  <button className="bp" aria-label={`Chat with ${p.name}`} onClick={() => openChat(p)} style={{ width: 50, height: 50, borderRadius: "50%", background: "rgba(120,75,160,0.08)", border: "1.5px solid rgba(120,75,160,0.15)", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", ...bpS }}>💬</button>
                </div>
              </Card>
            ))}
            {tab === "saved" && (savedP.length === 0 ? <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease infinite" }}>🔖</div><p style={{ fontSize: 16, color: C.dim }}>No saved profiles yet</p></div> : savedP.map((p, i) => (<Card key={p.id} className="hov" onClick={() => setModal(p)} s={{ display: "flex", alignItems: "center", gap: 16, padding: 16, marginBottom: 12, cursor: "pointer", animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}><img src={p.photo_url || p.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 56, height: 56, borderRadius: 18, objectFit: "cover" }} /><div style={{ flex: 1 }}><span style={{ fontWeight: 700, fontSize: 16 }}>{p.name}, {p.age}</span><p style={{ fontSize: 13, color: C.dim }}>{p.city} · {p.job}</p></div><span style={{ fontSize: 14, fontWeight: 700, color: C.pop }}>{p.compat}%</span></Card>)))}
            {tab === "matches" && (matchedP.length === 0 ? <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease infinite" }}>💕</div><p style={{ fontSize: 16, color: C.dim }}>Like someone to start matching!</p></div> : matchedP.map((p, i) => (<Card key={p.id} className="hov" onClick={() => openChat(p)} s={{ display: "flex", alignItems: "center", gap: 16, padding: 16, marginBottom: 12, cursor: "pointer", animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}><img src={p.photo_url || p.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 56, height: 56, borderRadius: 18, objectFit: "cover" }} /><div style={{ flex: 1 }}><span style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</span><p style={{ fontSize: 13, color: C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(convos[p.id] || []).slice(-1)[0]?.text || "Start chatting!"}</p></div><span style={{ fontSize: 14, fontWeight: 700, color: C.pop }}>{p.compat}%</span></Card>)))}
          </div>
          <Nav />
        </div>
      )}

      {/* ══════════════════ APP: CHATS ══════════════════ */}
      {page === "app" && view === "chats" && (
        <div className="w">
          <div style={{ padding: "20px 24px 16px", background: "linear-gradient(180deg, rgba(120,75,160,0.12) 0%, transparent 100%)" }}><h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Sora'" }}>Messages</h2></div>
          <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 100px" }}>
            {matchedP.length === 0 ? <div style={{ textAlign: "center", padding: "60px 0" }}><div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease infinite" }}>💬</div><p style={{ fontSize: 16, color: C.dim }}>No conversations yet</p><p style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>Like someone to start chatting!</p></div> : matchedP.map((p, i) => (
              <Card key={p.id} className="hov" onClick={() => openChat(p)} s={{ display: "flex", alignItems: "center", gap: 16, padding: 16, marginBottom: 12, cursor: "pointer", animation: `fadeUp 0.3s ease ${i * 0.06}s both` }}>
                <div style={{ position: "relative" }}><img src={p.photo_url || p.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 56, height: 56, borderRadius: 18, objectFit: "cover" }} />{p.status === "online" && <div style={{ position: "absolute", bottom: 1, right: 1, width: 13, height: 13, borderRadius: "50%", background: C.green, boxShadow: `0 0 0 3px ${C.bg}` }} />}</div>
                <div style={{ flex: 1, minWidth: 0 }}><span style={{ fontWeight: 700, fontSize: 16 }}>{p.name}</span><p style={{ fontSize: 13, color: C.dim, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{(convos[p.id] || []).slice(-1)[0]?.text || "Start chatting!"}</p></div>
              </Card>
            ))}
          </div>
          <Nav />
        </div>
      )}

      {/* ══════════════════ APP: CHAT ══════════════════ */}
      {page === "app" && view === "chat" && match && (
        <div className="w" style={{ minHeight: "100vh" }}>
          <Card s={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", margin: "10px 12px 0", borderRadius: 22 }}>
            <button className="bp" onClick={() => { setView("discover"); setMatch(null); }} style={{ width: 38, height: 38, borderRadius: 14, background: C.card2, border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, color: C.text, ...bpS }}>←</button>
            <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setModal(match)}><img src={match.photo_url || match.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 44, height: 44, borderRadius: 16, objectFit: "cover" }} />{match.status === "online" && <div style={{ position: "absolute", bottom: 0, right: 0, width: 11, height: 11, borderRadius: "50%", background: C.green, boxShadow: `0 0 0 2px ${C.bg}` }} />}</div>
            <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontWeight: 700, fontSize: 16 }}>{match.name}</span>{match.verified && <span style={{ fontSize: 12, color: C.green }}>✓</span>}</div><span style={{ fontSize: 12, color: C.dim }}>{match.compat}% compatible</span></div>
            <button className="bp" onClick={() => setShowCoach(!showCoach)} style={{ width: 36, height: 36, borderRadius: 13, background: showCoach ? "rgba(255,60,172,0.12)" : C.card2, border: "none", fontSize: 15, ...bpS }} aria-label="AI Coach">🤖</button>
            <button className="bp" onClick={() => { aiDeepDive(match); setMatchAnim(match); }} style={{ width: 36, height: 36, borderRadius: 13, background: C.card2, border: "none", fontSize: 15, animation: "aiGlow 3s ease infinite", ...bpS }} aria-label="Relationship Forecast">🔮</button>
            <button className="bp" onClick={() => { setShowVibe(true); setVibeStep(0); setVibeAnswers([]); setVibeResult(null); }} style={{ width: 36, height: 36, borderRadius: 13, background: C.card2, border: "none", fontSize: 15, ...bpS }} aria-label="Vibe Check">🎯</button>
            <button className="bp" onClick={() => setShowGames(true)} style={{ width: 36, height: 36, borderRadius: 13, background: C.card2, border: "none", fontSize: 15, ...bpS }} aria-label="Games">🎮</button>
            <button className="bp" onClick={() => setShowDate(!showDate)} style={{ width: 36, height: 36, borderRadius: 13, background: C.card2, border: "none", fontSize: 15, ...bpS }} aria-label="Date Ideas">📅</button>
            <button className="bp" onClick={() => setReport(match)} style={{ width: 36, height: 36, borderRadius: 13, background: C.card2, border: "none", fontSize: 15, ...bpS }} aria-label="Report">⚠️</button>
          </Card>

          {showCoach && <Card s={{ margin: "8px 12px 0", padding: 14, borderRadius: 20, animation: "slideUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 14, fontWeight: 700 }}>🤖 AI Coach</span><Btn onClick={fetchCoach} s={{ padding: "6px 16px", fontSize: 12, borderRadius: 14 }}>{coachLoad ? "Thinking..." : "✨ Suggest"}</Btn></div>
            {coachLoad && <div style={{ display: "flex", gap: 5, justifyContent: "center", padding: 8 }}>{[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.pop, animation: `dots 1.2s ease ${i * 0.15}s infinite` }} />)}</div>}
            {coachSugs?.map((s, i) => <button key={i} className="bp" onClick={() => { setMsg(s); setShowCoach(false); inpRef.current?.focus(); }} style={{ display: "block", width: "100%", padding: "10px 14px", marginBottom: 5, borderRadius: 16, background: C.card2, border: `1px solid ${C.brd}`, color: C.soft, fontSize: 14, textAlign: "left", animation: `slideR 0.3s ease ${i * 0.07}s both`, ...bpS }}>{s}</button>)}
            {!coachSugs && !coachLoad && <p style={{ fontSize: 13, color: C.dim, textAlign: "center" }}>Get AI-powered conversation suggestions</p>}
          </Card>}

          {showDate && <Card s={{ margin: "8px 12px 0", padding: 16, borderRadius: 20, animation: "slideUp 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}><span style={{ fontSize: 16, fontWeight: 700 }}>📅 Date Ideas</span><button onClick={() => setShowDate(false)} style={{ background: "none", border: "none", color: C.dim, cursor: "pointer", fontSize: 16 }}>✕</button></div>
            <Btn onClick={fetchDates} disabled={genieLoad} g={C.gAI} s={{ width: "100%", fontSize: 14, marginBottom: 14 }}>{genieLoad ? "✨ AI is thinking..." : "✨ Generate AI Date Ideas"}</Btn>
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>{(genieDates || DATE_IDEAS).map((d, i) => <button key={i} className="bp" onClick={() => { setMsg(`Hey! I had a fun idea — want to go on a ${d.t.toLowerCase()}? ${d.d} ${d.e}`); setShowDate(false); }} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: 18, background: C.card2, border: `1px solid ${C.brd}`, textAlign: "left", ...bpS }}><div style={{ fontSize: 32, flexShrink: 0 }}>{d.e}</div><div><div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 3 }}>{d.t}</div><div style={{ fontSize: 13, color: C.dim }}>{d.d}</div></div></button>)}</div>
          </Card>}

          <div style={{ flex: 1, overflowY: "auto", padding: "12px 14px" }}>
            {msgs.length === 0 && <div style={{ textAlign: "center", padding: "40px 0", animation: "fadeIn 0.5s ease" }}><div style={{ fontSize: 48, marginBottom: 12, animation: "float 3s ease infinite" }}>👋</div><p style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Say hello to {match.name}!</p><div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}><Btn onClick={async () => { setCoachLoad(true); const greeting = await callAI("You are a dating app icebreaker AI. Write a SHORT, warm, personalized first message (1-2 sentences) that references something specific from the recipient's profile. Be genuine, not cheesy. Include one relevant emoji.", `Write a first message from someone with these interests: ${me.interests?.slice(0, 4).join(", ") || "travel"} to ${match.name}, ${match.age}, who is a ${match.job || "professional"} who likes ${match.interests?.slice(0, 3).join(", ") || "adventure"}. Bio: "${match.bio || ""}". Make it specific and natural.`); const wave = greeting || `Hey ${match.name}! Love your profile — I think we'd really hit it off! 👋`; setMsg(wave); setCoachLoad(false); }} s={{ fontSize: 15, padding: "12px 26px" }}>{coachLoad ? "✨ AI thinking..." : "👋 Wave with AI Intro"}</Btn><Btn onClick={() => setShowCoach(true)} g={C.gAI} s={{ fontSize: 15, padding: "12px 26px" }}>🤖 AI Icebreakers</Btn></div></div>}
            {msgs.map((m, i) => (
              <div key={m.id} style={{ display: "flex", justifyContent: m.from === "me" ? "flex-end" : "flex-start", marginBottom: 8, animation: `fadeUp 0.25s ease ${Math.min(i * 0.03, 0.15)}s both` }}>
                <div onDoubleClick={() => setShowRx(showRx === m.id ? null : m.id)} style={{ maxWidth: "75%", padding: "12px 16px", position: "relative", borderRadius: m.from === "me" ? "20px 20px 4px 20px" : "20px 20px 20px 4px", background: m.from === "me" ? C.mine : m.ai ? "rgba(99,102,241,0.12)" : C.them, color: m.from === "me" ? "white" : C.text, fontSize: 15, lineHeight: 1.5, cursor: "pointer", border: m.ai ? "1px solid rgba(99,102,241,0.3)" : "none", animation: m.ai ? "aiMsgGlow 3s ease infinite" : "none" }}>
                  <p>{m.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: m.from === "me" ? "rgba(255,255,255,0.5)" : C.dim }}>{m.time}</span>
                    {m.ai && <span style={{ fontSize: 10, color: "rgba(168,85,247,0.7)" }}>✨ AI</span>}
                    {m.from === "me" && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>✓✓</span>}
                  </div>
                  {(m.rx || []).length > 0 && <div style={{ position: "absolute", bottom: -10, [m.from === "me" ? "left" : "right"]: 8, background: C.card, borderRadius: 12, padding: "2px 6px", fontSize: 14, border: `1px solid ${C.brd}` }}>{m.rx.join("")}</div>}
                  {showRx === m.id && <div style={{ position: "absolute", bottom: -40, [m.from === "me" ? "right" : "left"]: 0, display: "flex", gap: 4, background: C.card, borderRadius: 16, padding: "6px 8px", border: `1px solid ${C.brd}`, animation: "pop 0.25s ease", zIndex: 10 }}>{EMOJIS.map(em => <button key={em} onClick={() => rxMsg(match.id, m.id, em)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", padding: 2 }}>{em}</button>)}</div>}
                </div>
              </div>
            ))}
            {typing && <div style={{ display: "flex", gap: 5, padding: "12px 16px", animation: "fadeIn 0.3s ease" }}><span style={{ fontSize: 13, color: C.dim }}>{match.name} is typing</span>{[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.pop, animation: `dots 1.2s ease ${i * 0.15}s infinite` }} />)}</div>}
            <div ref={endRef} />
          </div>

          <div style={{ padding: "10px 14px 16px", display: "flex", gap: 10, alignItems: "center", background: C.glass, backdropFilter: "blur(20px)", borderTop: `1px solid ${C.brd}` }}>
            <button className="bp" onClick={() => setShowIce(!showIce)} style={{ width: 42, height: 42, borderRadius: 14, background: C.card2, border: "none", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center", ...bpS }}>💡</button>
            <input ref={inpRef} className="ig" aria-label="Type a message" value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type a message..." style={{ flex: 1, padding: "14px 18px", borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card, color: C.text, fontSize: 15, fontFamily: "'Outfit'", outline: "none" }} />
            <button className="bp glow-btn" onClick={send} style={{ width: 48, height: 48, borderRadius: 16, background: C.g1, border: "none", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 16px rgba(255,60,172,0.3)", ...bpS }}>↑</button>
          </div>
          {showIce && <div style={{ padding: "0 14px 10px", display: "flex", gap: 6, flexWrap: "wrap", animation: "slideUp 0.3s ease" }}>{ICEBREAKERS.map((ice, i) => <button key={i} className="bp" onClick={() => { setMsg(ice); setShowIce(false); inpRef.current?.focus(); }} style={{ padding: "8px 14px", borderRadius: 14, background: C.card2, border: `1px solid ${C.brd}`, color: C.soft, fontSize: 13, ...bpS }}>{ice}</button>)}</div>}
        </div>
      )}

      {/* ══════════════════ APP: PROFILE ══════════════════ */}
      {page === "app" && view === "profile" && (
        <div className="w" style={{ overflowY: "auto" }}>
          <div style={{ padding: "20px 24px 16px", background: "linear-gradient(180deg, rgba(120,75,160,0.12) 0%, transparent 100%)" }}><h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Sora'" }}>My Profile</h2></div>
          <div style={{ padding: "0 24px 100px" }}>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ width: 100, height: 100, borderRadius: 30, margin: "0 auto 16px", background: C.g1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, overflow: "hidden", border: `3px solid ${C.brd}`, cursor: "pointer", position: "relative" }} onClick={() => document.getElementById("photo-upload")?.click()}>
                {me.photo_url ? <img src={me.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : me.name ? me.name[0] : "?"}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 4, background: "rgba(0,0,0,0.6)", fontSize: 11, color: "white" }}>📸 Edit</div>
              </div>
              <input id="photo-upload" type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
              <h3 style={{ fontSize: 20, fontWeight: 800 }}>{me.name || "Your Name"}{me.age ? `, ${me.age}` : ""}</h3>
              <p style={{ fontSize: 14, color: C.dim }}>{me.city || "Your City"} {me.job ? `· ${me.job}` : ""}</p>
            </div>
            <Inp label="Name" value={me.name} onChange={e => setMe(p => ({ ...p, name: e.target.value }))} onBlur={() => saveProfile({ name: me.name })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Inp label="Age" type="number" value={me.age} onChange={e => setMe(p => ({ ...p, age: e.target.value }))} onBlur={() => saveProfile({ age: me.age })} />
              <Inp label="City" value={me.city} onChange={e => setMe(p => ({ ...p, city: e.target.value }))} onBlur={() => saveProfile({ city: me.city })} />
            </div>
            <Inp label="Job" value={me.job} onChange={e => setMe(p => ({ ...p, job: e.target.value }))} onBlur={() => saveProfile({ job: me.job })} />
            <div style={{ marginBottom: 18 }}><label style={{ fontSize: 13, fontWeight: 700, color: C.soft, marginBottom: 8, display: "block" }}>Bio</label><textarea className="ig" value={me.bio} onChange={e => setMe(p => ({ ...p, bio: e.target.value }))} onBlur={() => saveProfile({ bio: me.bio })} rows={3} style={{ width: "100%", padding: "15px 20px", borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card, color: C.text, fontSize: 15, fontFamily: "'Outfit'", outline: "none", resize: "vertical" }} /></div>
            <Btn onClick={() => setBioWriter(true)} g={C.gAI} s={{ width: "100%", fontSize: 14, marginBottom: 20 }}>✍️ AI Bio Writer</Btn>
            <Card s={{ padding: 16, marginBottom: 16 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.soft, marginBottom: 10 }}>Interests</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{(me.interests || []).map(i => <span key={i} style={{ padding: "6px 14px", borderRadius: 14, fontSize: 13, background: C.g2, color: "white", fontWeight: 600 }}>{i}</span>)}</div>
            </Card>
          </div>
          <Nav />
        </div>
      )}

      {/* ══════════════════ APP: SETTINGS ══════════════════ */}
      {page === "app" && view === "settings" && (
        <div className="w" style={{ overflowY: "auto" }}>
          <div style={{ padding: "20px 24px 16px", background: "linear-gradient(180deg, rgba(120,75,160,0.12) 0%, transparent 100%)" }}><h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Sora'" }}>Settings</h2></div>
          <div style={{ padding: "0 24px 100px" }}>
            {[{ i: "🛡️", t: "Safe Date Mode", d: "Safety tips", fn: () => setSafety(true) }, { i: "📝", t: "Retake Quiz", d: "Update compatibility", fn: () => { setQStep(0); setPage("quiz"); } }, { i: "💳", t: "Subscription", d: plan || "Free", fn: () => setPage("plan") }, { i: "🔔", t: "Notifications", d: "Manage alerts" }, { i: "🔒", t: "Privacy", d: "Control your data" }, { i: "🎨", t: "Theme", d: "Dark mode" }, { i: "❓", t: "Help & Support", d: "FAQs" }, { i: "📄", t: "Terms & Privacy", d: "Legal" }].map((item, i) => (
              <Card key={i} className="hov" onClick={item.fn} s={{ display: "flex", alignItems: "center", gap: 16, padding: 16, marginBottom: 10, cursor: item.fn ? "pointer" : "default", animation: `fadeUp 0.3s ease ${i * 0.04}s both` }}>
                <div style={{ fontSize: 24, width: 44, height: 44, borderRadius: 14, background: C.card2, display: "flex", alignItems: "center", justifyContent: "center" }}>{item.i}</div>
                <div style={{ flex: 1 }}><p style={{ fontSize: 15, fontWeight: 700 }}>{item.t}</p><p style={{ fontSize: 13, color: C.dim }}>{item.d}</p></div>
                <span style={{ fontSize: 16, color: C.dim }}>›</span>
              </Card>
            ))}
            <Btn onClick={logout} g="rgba(255,80,80,0.1)" s={{ width: "100%", color: "#ff5555", border: "1.5px solid rgba(255,80,80,0.25)", boxShadow: "none", marginTop: 16, fontSize: 15 }}>Log Out</Btn>
            <p style={{ textAlign: "center", fontSize: 12, color: C.dim, marginTop: 16 }}>Auto-Mate v4.0 · {user?.email}</p>
          </div>
          <Nav />
        </div>
      )}

      {/* ══════════════════ GENIE ══════════════════ */}
      {genie && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setGenie(false)}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "94%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 48, marginBottom: 10, animation: "float 3s ease infinite" }}>🧞</div><h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: "'Sora'" }}><span className="gt">AI Genie</span></h2><p style={{ fontSize: 14, color: C.dim, marginTop: 6 }}>Your AI matchmaking assistant</p></div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {[{ k: "soul", l: "💝 Soulmate" }, { k: "surprise", l: "🎲 Surprise" }, { k: "dates", l: "📅 Dates" }].map(t => <button key={t.k} className="bp" onClick={() => setGenieTab(t.k)} style={{ flex: 1, padding: "10px 0", borderRadius: 16, border: "none", fontSize: 13, fontWeight: 700, background: genieTab === t.k ? C.g1 : C.card2, color: genieTab === t.k ? "white" : C.soft, ...bpS }}>{t.l}</button>)}
            </div>
            {genieTab === "soul" && soul && <Card s={{ padding: 18, marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><img src={soul.photo_url || soul.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 60, height: 60, borderRadius: 20, objectFit: "cover" }} /><div><p style={{ fontSize: 18, fontWeight: 800 }}>{soul.name}, {soul.age}</p><p style={{ fontSize: 13, color: C.dim }}>{soul.city} · {soul.compat}% match</p></div></div><p style={{ fontSize: 14, color: C.soft, marginTop: 12, lineHeight: 1.6 }}>💡 {soul.why}</p><Btn onClick={() => { setGenie(false); openChat(soul); }} s={{ width: "100%", marginTop: 14, fontSize: 14 }}>💬 Message {soul.name}</Btn></Card>}
            {genieTab === "surprise" && surprise && <Card s={{ padding: 18, marginBottom: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 14 }}><img src={surprise.photo_url || surprise.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 60, height: 60, borderRadius: 20, objectFit: "cover" }} /><div><p style={{ fontSize: 18, fontWeight: 800 }}>{surprise.name}, {surprise.age}</p><p style={{ fontSize: 13, color: C.dim }}>{surprise.city} · {surprise.compat}% match</p></div></div><p style={{ fontSize: 14, color: C.soft, marginTop: 12, lineHeight: 1.6 }}>🎲 Someone outside your usual type — but the compatibility is there!</p><Btn onClick={() => { setGenie(false); openChat(surprise); }} s={{ width: "100%", marginTop: 14, fontSize: 14 }}>💬 Say Hi</Btn></Card>}
            {genieTab === "dates" && <div><Btn onClick={fetchDates} disabled={genieLoad} g={C.gAI} s={{ width: "100%", fontSize: 14, marginBottom: 14 }}>{genieLoad ? "✨ Generating..." : "✨ AI Date Ideas"}</Btn>{(genieDates || DATE_IDEAS).map((d, i) => <Card key={i} s={{ padding: 16, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}><div style={{ fontSize: 28 }}>{d.e}</div><div><p style={{ fontSize: 15, fontWeight: 700 }}>{d.t}</p><p style={{ fontSize: 13, color: C.dim }}>{d.d}</p></div></Card>)}</div>}
          </Card>
        </div>
      )}

      {/* ══════════════════ MODAL ══════════════════ */}
      {modal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setModal(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: "94%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
            <button className="bp" onClick={() => setModal(null)} style={{ position: "absolute", top: 12, left: 12, zIndex: 10, width: 40, height: 40, borderRadius: 14, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(10px)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "white", ...bpS }}>←</button>
            <img src={modal.photo_url || modal.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: "100%", height: 280, objectFit: "cover", borderRadius: "22px 22px 0 0" }} />
            <Card s={{ borderRadius: "0 0 22px 22px", padding: 22, borderTop: "none" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}><div><h2 style={{ fontSize: 24, fontWeight: 800 }}>{modal.name}, {modal.age}</h2><p style={{ fontSize: 14, color: C.dim }}>{modal.city} · {modal.job}</p></div><div style={{ width: 52, height: 52, borderRadius: 16, background: C.g1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 900, color: "white", boxShadow: "0 6px 20px rgba(255,60,172,0.3)" }}>{modal.compat}%</div></div>
              <p style={{ fontSize: 14, color: C.soft, lineHeight: 1.6, marginBottom: 16, fontStyle: "italic" }}>💡 {modal.why}</p>
              <p style={{ fontSize: 16, lineHeight: 1.7, marginBottom: 18, color: C.soft }}>{modal.bio}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>{[{ l: "Goals", v: modal.goals }, { l: "Love Language", v: modal.comm_style }, { l: "Lifestyle", v: modal.lifestyle }, { l: "Intimacy", v: `${modal.intimacy}/10` }, ...(modal.identity ? [{ l: "Identity", v: modal.identity }] : []), ...(modal.relationship_mode ? [{ l: "Looking For", v: modal.relationship_mode }] : []), ...(modal.education ? [{ l: "Education", v: modal.education }] : []), ...(modal.smoking ? [{ l: "Smoking", v: modal.smoking }] : []), ...(modal.drinking ? [{ l: "Drinking", v: modal.drinking }] : []), ...(modal.cannabis ? [{ l: "420", v: modal.cannabis }] : []), ...(modal.has_kids ? [{ l: "Kids", v: modal.has_kids }] : []), ...(modal.wants_kids ? [{ l: "Wants Kids", v: modal.wants_kids }] : []), ...(modal.exercise ? [{ l: "Exercise", v: modal.exercise }] : []), ...(modal.pets ? [{ l: "Pets", v: modal.pets }] : []), ...(modal.religion && modal.religion !== "Prefer not to say" ? [{ l: "Faith", v: modal.religion }] : []), ...(modal.star_sign && modal.star_sign !== "Don't care" && modal.star_sign !== "Don't know" ? [{ l: "Sign", v: modal.star_sign }] : []), ...(modal.diet && modal.diet !== "No preference" ? [{ l: "Diet", v: modal.diet }] : [])].map(d => <div key={d.l} style={{ padding: "12px 14px", borderRadius: 16, background: C.card2, border: `1px solid ${C.brd}` }}><p style={{ fontSize: 12, color: C.dim, fontWeight: 700, marginBottom: 3 }}>{d.l}</p><p style={{ fontSize: 14, fontWeight: 600 }}>{d.v}</p></div>)}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>{(modal.interests || []).map(i => <span key={i} style={{ padding: "7px 16px", borderRadius: 14, fontSize: 13, fontWeight: 600, background: C.card2, border: `1px solid ${C.brd}`, color: C.soft }}>{i}</span>)}</div>
              <div style={{ display: "flex", gap: 12 }}><Btn onClick={() => { setModal(null); openChat(modal); }} s={{ flex: 1, fontSize: 15 }}>💬 Message</Btn><button className="bp" onClick={() => { setReport(modal); setModal(null); }} style={{ width: 54, height: 54, borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card2, fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", ...bpS }}>⚠️</button></div>
            </Card>
          </div>
        </div>
      )}

      {/* ══════════════════ REPORT ══════════════════ */}
      {report && (
        <div style={{ position: "fixed", inset: 0, zIndex: 110, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setReport(null)}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "92%", maxWidth: 520, padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, fontFamily: "'Sora'", marginBottom: 6 }}>Report or Block</h3>
            <p style={{ fontSize: 14, color: C.dim, marginBottom: 20 }}>{report.name}</p>
            {["Harassment", "Fake profile", "Inappropriate content", "Spam", "Other"].map(r => <button key={r} className="bp" onClick={() => setReportR(r)} style={{ display: "block", width: "100%", padding: "14px 18px", marginBottom: 8, borderRadius: 16, border: reportR === r ? "none" : `1px solid ${C.brd}`, background: reportR === r ? C.g2 : C.card, color: reportR === r ? "white" : C.soft, fontSize: 14, fontWeight: 600, textAlign: "left", ...bpS }}>{r}</button>)}
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <Btn onClick={() => { setReportR(""); setReport(null); }} g={C.card2} s={{ flex: 1, fontSize: 14, boxShadow: "none", border: `1px solid ${C.brd}`, color: C.soft }}>Cancel</Btn>
              <Btn onClick={() => { doReport(report, reportR); setReportR(""); setReport(null); }} disabled={!reportR} s={{ flex: 1, fontSize: 14 }}>Submit Report</Btn>
            </div>
            <button className="bp" onClick={() => { doBlock(report); setReport(null); }} style={{ width: "100%", padding: "14px 0", marginTop: 14, borderRadius: 18, border: "1.5px solid rgba(255,80,80,0.25)", background: "rgba(255,80,80,0.06)", color: "#ff5555", fontSize: 14, fontWeight: 700, ...bpS }}>🚫 Block {report.name}</button>
          </Card>
        </div>
      )}

      {/* ══════════════════ SAFETY ══════════════════ */}
      {safety && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setSafety(false)}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "92%", maxWidth: 520, padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}><div style={{ fontSize: 44, marginBottom: 10 }}>🛡️</div><h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'" }}>Safe Date Mode</h2></div>
            {["Always meet in public places for first dates", "Share your date plans with a trusted friend", "Trust your instincts — leave if uncomfortable", "Video call before meeting in person", "Never share financial information with matches"].map((t, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14, animation: `fadeUp 0.3s ease ${i * 0.08}s both` }}><div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(0,232,123,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}><span style={{ fontSize: 12, color: C.green }}>✓</span></div><span style={{ fontSize: 15, color: C.soft, lineHeight: 1.6 }}>{t}</span></div>)}
            <Btn onClick={() => setSafety(false)} s={{ width: "100%", marginTop: 10, fontSize: 15 }}>Got it! 💪</Btn>
          </Card>
        </div>
      )}

      {/* ══════════════════ BIO WRITER ══════════════════ */}
      {bioWriter && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setBioWriter(false)}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "94%", maxWidth: 560, padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
            <button className="bp" onClick={() => setBioWriter(false)} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: 12, background: C.card2, border: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.text, zIndex: 2, ...bpS }}>←</button>
            <div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 44, marginBottom: 10 }}>✍️</div><h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'" }}>AI Profile Writer</h2></div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.soft, marginBottom: 10 }}>Choose your tone:</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 22, flexWrap: "wrap" }}>{["confident", "friendly", "witty", "authentic", "adventurous"].map(s => <button key={s} className="bp" onClick={() => setBioTone(s)} style={{ padding: "10px 20px", borderRadius: 24, border: bioTone === s ? "none" : `1px solid ${C.brd}`, background: bioTone === s ? C.gAI : C.card, color: bioTone === s ? "white" : C.soft, fontSize: 14, fontWeight: 600, textTransform: "capitalize", ...bpS }}>{s}</button>)}</div>
            <Btn onClick={genBio} disabled={bioLoad} g={C.gAI} s={{ width: "100%", fontSize: 15, marginBottom: 16 }}>{bioLoad ? "✨ Writing your bio..." : "✨ Generate Bio"}</Btn>
            {bioOut && <div style={{ animation: "fadeUp 0.4s ease" }}><Card s={{ padding: 16, marginBottom: 14 }}><p style={{ fontSize: 15, color: C.soft, lineHeight: 1.7 }}>{bioOut}</p></Card><Btn onClick={() => { saveProfile({ bio: bioOut }); setBioWriter(false); setBioOut(""); setToast("Bio updated! ✨"); }} s={{ width: "100%", fontSize: 15 }}>Use This Bio</Btn></div>}
          </Card>
        </div>
      )}

      {/* ══════════════════ IN THE STARS ══════════════════ */}
      {showStars && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.85)", backdropFilter: "blur(16px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => { setShowStars(false); setStarsResult(null); }}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "94%", maxWidth: 560, maxHeight: "85vh", overflowY: "auto", padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)", position: "relative", background: "linear-gradient(160deg, rgba(18,15,38,0.95) 0%, rgba(30,20,60,0.95) 50%, rgba(15,10,35,0.95) 100%)" }}>
            <button className="bp" onClick={() => { setShowStars(false); setStarsResult(null); }} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: 12, background: C.card2, border: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.text, zIndex: 2, ...bpS }}>←</button>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ fontSize: 52, marginBottom: 10, animation: "float 3s ease infinite", filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))" }}>🌌</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Sora'" }}><span className="gt">In The Stars</span></h2>
              <p style={{ fontSize: 14, color: C.dim, marginTop: 6 }}>Soul-level cosmic compatibility</p>
            </div>
            {!starsResult && !starsLoad && <div>
              <p style={{ fontSize: 14, color: C.soft, textAlign: "center", marginBottom: 18, lineHeight: 1.7 }}>Select a match to reveal your cosmic connection — powered by AI astrology analysis of your full profiles.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {scored.slice(0, 6).map((p, i) => (
                  <button key={p.id} className="bp" onClick={() => aiStars(p)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 18, background: C.card2, border: `1px solid ${C.brd}`, textAlign: "left", animation: `fadeUp 0.3s ease ${i * 0.06}s both`, ...bpS }}>
                    <img src={p.photo_url || p.photo || "https://i.pravatar.cc/300"} alt={p.name} style={{ width: 48, height: 48, borderRadius: 16, objectFit: "cover" }} />
                    <div style={{ flex: 1 }}><span style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{p.name}, {p.age}</span><p style={{ fontSize: 12, color: C.dim }}>{p.star_sign || "Mystery sign"} · {p.compat}% match</p></div>
                    <span style={{ fontSize: 20 }}>✨</span>
                  </button>
                ))}
              </div>
            </div>}
            {starsLoad && <div style={{ textAlign: "center", padding: 30 }}><div style={{ fontSize: 48, animation: "spin 3s linear infinite", marginBottom: 16 }}>🌌</div><p style={{ fontSize: 16, fontWeight: 600, color: C.soft }}>Reading the cosmos...</p><div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 12 }}>{[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(168,85,247,0.8)", animation: `dots 1.2s ease ${i*0.15}s infinite` }} />)}</div></div>}
            {starsResult && starsTarget && <div style={{ animation: "fadeUp 0.5s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ textAlign: "center" }}><div style={{ width: 60, height: 60, borderRadius: 20, overflow: "hidden", border: "2px solid rgba(168,85,247,0.5)" }}>{me.photo_url ? <img src={me.photo_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ width: "100%", height: "100%", background: C.gAI, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{me.name?.[0] || "?"}</div>}</div><p style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{me.star_sign || "?"}</p></div>
                <div style={{ fontSize: 32, animation: "float 2s ease infinite" }}>⭐</div>
                <div style={{ textAlign: "center" }}><img src={starsTarget.photo_url || starsTarget.photo || "https://i.pravatar.cc/300"} alt="" style={{ width: 60, height: 60, borderRadius: 20, objectFit: "cover", border: "2px solid rgba(168,85,247,0.5)" }} /><p style={{ fontSize: 11, color: C.dim, marginTop: 4 }}>{starsTarget.star_sign || "?"}</p></div>
              </div>
              <div style={{ textAlign: "center", marginBottom: 18 }}><span style={{ fontSize: 48, fontWeight: 900, background: "linear-gradient(135deg,#a855f7,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{starsResult.cosmic_score}%</span><p style={{ fontSize: 13, color: "rgba(168,85,247,0.8)", fontWeight: 700, marginTop: 4 }}>{starsResult.element_match}</p></div>
              <Card s={{ padding: 16, marginBottom: 14, background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.2)" }}><p style={{ fontSize: 15, color: C.soft, lineHeight: 1.7, textAlign: "center", fontStyle: "italic" }}>{starsResult.soul_reading}</p></Card>
              <p style={{ fontSize: 13, fontWeight: 700, color: "rgba(168,85,247,0.9)", marginBottom: 8 }}>✨ Cosmic Strengths</p>
              {starsResult.strengths?.map((s, i) => <p key={i} style={{ fontSize: 14, color: C.soft, marginBottom: 6, paddingLeft: 16, borderLeft: "2px solid rgba(168,85,247,0.4)" }}>{s}</p>)}
              <p style={{ fontSize: 13, fontWeight: 700, color: C.pop, marginTop: 14, marginBottom: 8 }}>🌙 Cosmic Challenges</p>
              {starsResult.challenges?.map((c, i) => <p key={i} style={{ fontSize: 14, color: C.soft, marginBottom: 6, paddingLeft: 16, borderLeft: `2px solid ${C.pop}` }}>{c}</p>)}
              <Card s={{ padding: 14, marginTop: 14, marginBottom: 14, background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.2)" }}><p style={{ fontSize: 13, fontWeight: 700, color: "rgba(6,182,212,0.9)", marginBottom: 4 }}>💫 Cosmic Advice</p><p style={{ fontSize: 14, color: C.soft }}>{starsResult.cosmic_advice}</p></Card>
              <Card s={{ padding: 14, marginBottom: 14, background: "rgba(250,180,0,0.06)", border: "1px solid rgba(250,180,0,0.2)" }}><p style={{ fontSize: 13, fontWeight: 700, color: "rgba(250,180,0,0.9)", marginBottom: 4 }}>🌃 Best Date Night</p><p style={{ fontSize: 14, color: C.soft }}>{starsResult.best_date_night}</p></Card>
              <Btn onClick={() => { setShowStars(false); setStarsResult(null); openChat(starsTarget); }} s={{ width: "100%", fontSize: 15 }}>💬 Message {starsTarget.name}</Btn>
            </div>}
          </Card>
        </div>
      )}

      {/* ══════════════════ DAILY QUESTION ══════════════════ */}
      {showDaily && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => setShowDaily(false)}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "94%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto", padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
            <button className="bp" onClick={() => setShowDaily(false)} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: 12, background: C.card2, border: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.text, zIndex: 2, ...bpS }}>←</button>
            <div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 44, marginBottom: 10 }}>📝</div><h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'" }}><span className="gt">Daily Question</span></h2><p style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>Everyone answers. See what your matches said.</p></div>
            <Card s={{ padding: 18, marginBottom: 18, background: "linear-gradient(135deg, rgba(255,60,172,0.08), rgba(120,75,160,0.08))", border: "1px solid rgba(255,60,172,0.2)" }}><p style={{ fontSize: 18, fontWeight: 700, color: C.text, lineHeight: 1.6, textAlign: "center" }}>{getTodayQ()}</p></Card>
            {!dailyAnswers[me.name || "You"] ? <div>
              <textarea value={dailyA} onChange={e => setDailyA(e.target.value)} placeholder="Your answer..." rows={3} style={{ width: "100%", padding: "14px 18px", borderRadius: 18, border: `1px solid ${C.brd}`, background: C.card, color: C.text, fontSize: 15, fontFamily: "'Outfit'", outline: "none", resize: "none", marginBottom: 12 }} />
              <Btn onClick={submitDailyA} disabled={!dailyA.trim()} s={{ width: "100%", fontSize: 15 }}>Submit Answer ✨</Btn>
            </div> : <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.green, marginBottom: 12 }}>✓ Your answer submitted!</p>
              {Object.entries(dailyAnswers).map(([name, answer], i) => (
                <Card key={name} s={{ padding: 14, marginBottom: 10, animation: `fadeUp 0.3s ease ${i * 0.08}s both` }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: name === (me.name || "You") ? C.pop : C.soft, marginBottom: 4 }}>{name === (me.name || "You") ? "You" : name}</p>
                  <p style={{ fontSize: 14, color: C.soft, lineHeight: 1.6 }}>{answer}</p>
                </Card>
              ))}
            </div>}
          </Card>
        </div>
      )}

      {/* ══════════════════ COMPATIBILITY GAMES ══════════════════ */}
      {showGames && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => { setShowGames(false); setGameType(null); setGameQ(null); setGameA(null); setGameTheirA(null); }}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "94%", maxWidth: 520, padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
            <button className="bp" onClick={() => { if (gameType) { setGameType(null); setGameQ(null); setGameA(null); setGameTheirA(null); } else setShowGames(false); }} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: 12, background: C.card2, border: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.text, zIndex: 2, ...bpS }}>←</button>
            <div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 44, marginBottom: 10 }}>🎮</div><h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'" }}><span className="gt">Compatibility Games</span></h2></div>
            {!gameType && <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="bp" onClick={() => startGame("wyr")} style={{ padding: "20px 22px", borderRadius: 20, background: "linear-gradient(135deg, rgba(255,60,172,0.1), rgba(120,75,160,0.1))", border: `1px solid rgba(255,60,172,0.2)`, textAlign: "left", ...bpS }}><div style={{ fontSize: 24, marginBottom: 6 }}>🤔</div><p style={{ fontSize: 17, fontWeight: 700, color: C.text }}>Would You Rather</p><p style={{ fontSize: 13, color: C.dim }}>Choose between two scenarios — see if your match agrees</p></button>
              <button className="bp" onClick={() => startGame("tot")} style={{ padding: "20px 22px", borderRadius: 20, background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(6,182,212,0.1))", border: "1px solid rgba(99,102,241,0.2)", textAlign: "left", ...bpS }}><div style={{ fontSize: 24, marginBottom: 6 }}>⚡</div><p style={{ fontSize: 17, fontWeight: 700, color: C.text }}>This or That</p><p style={{ fontSize: 13, color: C.dim }}>Quick-fire choices that reveal your personality</p></button>
            </div>}
            {gameType && gameQ && <div style={{ animation: "fadeUp 0.4s ease" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: C.text, textAlign: "center", marginBottom: 22, lineHeight: 1.6 }}>{gameQ[0]}</p>
              <div style={{ display: "flex", gap: 12 }}>
                {[0, 1].map(choice => (
                  <button key={choice} className="bp" onClick={() => !gameA && answerGame(choice)} style={{ flex: 1, padding: "24px 16px", borderRadius: 20, background: gameA === choice ? C.g1 : gameA != null && gameTheirA === choice ? C.gAI : C.card2, border: gameA === choice ? "none" : gameA != null && gameTheirA === choice ? "2px solid rgba(168,85,247,0.5)" : `1px solid ${C.brd}`, textAlign: "center", opacity: gameA != null && gameA !== choice && gameTheirA !== choice ? 0.4 : 1, ...bpS }}>
                    <div style={{ fontSize: 36, marginBottom: 8 }}>{gameQ[choice + 1]}</div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: gameA === choice ? "white" : C.soft }}>{gameQ[0].split(" OR ")[choice] || (choice === 0 ? "Option A" : "Option B")}</p>
                    {gameA === choice && <p style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>Your pick ✓</p>}
                    {gameA != null && gameTheirA === choice && <p style={{ fontSize: 11, color: "rgba(168,85,247,0.9)", marginTop: 6 }}>{match?.name || "Their"} pick</p>}
                  </button>
                ))}
              </div>
              {gameA != null && gameTheirA != null && <div style={{ textAlign: "center", marginTop: 18, animation: "pop 0.4s ease" }}>
                <p style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{gameA === gameTheirA ? <span className="gt">You matched! 🎉</span> : <span style={{ color: C.pop }}>Different vibes! 😄</span>}</p>
                <p style={{ fontSize: 14, color: C.dim, marginBottom: 16 }}>{gameA === gameTheirA ? "Great minds think alike!" : "Opposites attract — that's chemistry!"}</p>
                <Btn onClick={() => { setGameQ(null); setGameA(null); setGameTheirA(null); startGame(gameType); }} s={{ fontSize: 14, padding: "12px 28px" }}>Next Question →</Btn>
              </div>}
            </div>}
          </Card>
        </div>
      )}

      {/* ══════════════════ VIBE CHECK ══════════════════ */}
      {showVibe && match && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(5,5,13,0.7)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeIn 0.2s ease" }} onClick={() => { setShowVibe(false); setVibeStep(0); setVibeAnswers([]); setVibeResult(null); }}>
          <Card onClick={e => e.stopPropagation()} s={{ width: "94%", maxWidth: 520, maxHeight: "85vh", overflowY: "auto", padding: 26, animation: "pop 0.35s cubic-bezier(0.34,1.56,0.64,1)", position: "relative" }}>
            <button className="bp" onClick={() => { setShowVibe(false); setVibeStep(0); setVibeAnswers([]); setVibeResult(null); }} style={{ position: "absolute", top: 14, left: 14, width: 36, height: 36, borderRadius: 12, background: C.card2, border: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: C.text, zIndex: 2, ...bpS }}>←</button>
            <div style={{ textAlign: "center", marginBottom: 22 }}><div style={{ fontSize: 44, marginBottom: 10 }}>🎯</div><h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: "'Sora'" }}><span className="gt">Vibe Check</span></h2><p style={{ fontSize: 13, color: C.dim, marginTop: 6 }}>Pre-date readiness with {match.name}</p><div style={{ display: "flex", gap: 4, justifyContent: "center", marginTop: 12 }}>{VIBE_QS.map((_, i) => <div key={i} style={{ width: i === vibeStep ? 24 : 8, height: 8, borderRadius: 8, background: i < vibeStep ? C.green : i === vibeStep ? C.g1 : "rgba(120,75,160,0.12)", transition: "all 0.3s" }} />)}</div></div>
            {!vibeResult && !vibeLoad && vibeStep < VIBE_QS.length && <div style={{ animation: "fadeUp 0.3s ease" }}>
              <p style={{ fontSize: 17, fontWeight: 700, color: C.text, textAlign: "center", marginBottom: 18, lineHeight: 1.5 }}>{VIBE_QS[vibeStep].q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {VIBE_QS[vibeStep].opts.map((opt, i) => (
                  <button key={opt} className="bp" onClick={() => { const newA = [...vibeAnswers]; newA[vibeStep] = opt; setVibeAnswers(newA); if (vibeStep < VIBE_QS.length - 1) setTimeout(() => setVibeStep(s => s + 1), 300); else setTimeout(() => submitVibe(), 400); }} style={{ padding: "16px 20px", borderRadius: 18, border: vibeAnswers[vibeStep] === opt ? "none" : `1px solid ${C.brd}`, background: vibeAnswers[vibeStep] === opt ? C.g1 : C.card2, color: vibeAnswers[vibeStep] === opt ? "white" : C.soft, fontSize: 15, fontWeight: 600, textAlign: "left", animation: `fadeUp 0.3s ease ${i * 0.06}s both`, ...bpS }}>{opt}</button>
                ))}
              </div>
            </div>}
            {vibeLoad && <div style={{ textAlign: "center", padding: 30 }}><div style={{ fontSize: 48, animation: "float 2s ease infinite", marginBottom: 16 }}>🎯</div><p style={{ fontSize: 16, fontWeight: 600, color: C.soft }}>Comparing your vibes...</p></div>}
            {vibeResult && <div style={{ animation: "fadeUp 0.5s ease" }}>
              <div style={{ textAlign: "center", marginBottom: 18 }}><span style={{ fontSize: 52, fontWeight: 900 }}><span className="gt">{vibeResult.readiness_score}%</span></span><p style={{ fontSize: 15, fontWeight: 700, color: C.soft, marginTop: 6 }}>Date Readiness</p><p style={{ fontSize: 28, marginTop: 8 }}>{vibeResult.emoji_summary}</p></div>
              <Card s={{ padding: 16, marginBottom: 14, background: "rgba(0,232,123,0.06)", border: "1px solid rgba(0,232,123,0.2)" }}><p style={{ fontSize: 15, fontWeight: 700, color: C.green, marginBottom: 4 }}>{vibeResult.vibe_match}</p></Card>
              <p style={{ fontSize: 13, fontWeight: 700, color: C.soft, marginBottom: 8 }}>💡 Tips for your date:</p>
              {vibeResult.tips?.map((t, i) => <p key={i} style={{ fontSize: 14, color: C.soft, marginBottom: 6, paddingLeft: 16, borderLeft: `2px solid ${C.green}` }}>{t}</p>)}
              <Btn onClick={() => { setShowVibe(false); setVibeStep(0); setVibeAnswers([]); setVibeResult(null); }} s={{ width: "100%", marginTop: 16, fontSize: 15 }}>Got it! Let's do this 💪</Btn>
            </div>}
          </Card>
        </div>
      )}
    </div>
  );
}
