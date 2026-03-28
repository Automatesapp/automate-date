import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTO-MATE — Production MVP
//  AI-Powered Dating · Real Compatibility Scoring · Claude AI · 3D Effects
//  Domain: automatedate.app
// ═══════════════════════════════════════════════════════════════════════════════

// ── PROFILE DATA ─────────────────────────────────────────────────────────────
const SEED_PROFILES = [
  {id:1,name:"Sophia",age:27,bio:"Coffee addict ☕ | Sunset chaser 🌅 | Dog mom 🐕",status:"online",photo:"https://i.pravatar.cc/300?img=1",interests:["Travel","Photography","Yoga"],verified:true,city:"Seattle",job:"UX Designer",gender:"Woman",goals:"Long-term relationship",values:["Honesty","Adventure","Growth"],lifestyle:"Very active & outdoorsy",commStyle:"Words of Affirmation",intimacy:8},
  {id:2,name:"Mia",age:25,bio:"Bookworm 📚 | Foodie 🍜 | Adventure seeker",status:"online",photo:"https://i.pravatar.cc/300?img=5",interests:["Cooking","Hiking","Music"],verified:true,city:"Portland",job:"Chef",gender:"Woman",goals:"Long-term relationship",values:["Family","Creativity","Loyalty"],lifestyle:"Balanced mix",commStyle:"Quality Time",intimacy:7},
  {id:3,name:"Ava",age:29,bio:"Artist 🎨 | Night owl 🦉 | Plant parent 🌿",status:"away",photo:"https://i.pravatar.cc/300?img=9",interests:["Art","Wine","Dancing"],verified:false,city:"Los Angeles",job:"Illustrator",gender:"Woman",goals:"Serious dating",values:["Creativity","Independence","Passion"],lifestyle:"Homebody & relaxed",commStyle:"Physical Touch",intimacy:9},
  {id:4,name:"Luna",age:26,bio:"Gym rat 💪 | Sci-fi nerd 🚀 | Cat person 🐱",status:"offline",photo:"https://i.pravatar.cc/300?img=16",interests:["Fitness","Gaming","Movies"],verified:true,city:"San Francisco",job:"Software Engineer",gender:"Woman",goals:"Open to anything",values:["Ambition","Humor","Intelligence"],lifestyle:"Very active & outdoorsy",commStyle:"Acts of Service",intimacy:6},
  {id:5,name:"Zara",age:28,bio:"Entrepreneur 💼 | Jazz lover 🎷 | Globe trotter ✈️",status:"online",photo:"https://i.pravatar.cc/300?img=20",interests:["Business","Music","Travel"],verified:true,city:"New York",job:"Founder & CEO",gender:"Woman",goals:"Long-term relationship",values:["Ambition","Growth","Adventure"],lifestyle:"Very active & outdoorsy",commStyle:"Words of Affirmation",intimacy:8},
  {id:6,name:"Elena",age:24,bio:"Med student 🩺 | Bookworm | Tea > Coffee",status:"online",photo:"https://i.pravatar.cc/300?img=23",interests:["Reading","Science","Yoga"],verified:true,city:"Boston",job:"Medical Student",gender:"Woman",goals:"Serious dating",values:["Intelligence","Kindness","Stability"],lifestyle:"Balanced mix",commStyle:"Quality Time",intimacy:5},
];

const QUIZ_SECTIONS = [
  {key:"intent",title:"Relationship Intent",icon:"💝",question:"What are you looking for?",options:["Long-term relationship","Serious dating","Open to anything","Just exploring"]},
  {key:"values",title:"Core Values",icon:"⭐",question:"Pick your top 3 values",options:["Honesty","Loyalty","Adventure","Family","Ambition","Creativity","Humor","Independence","Kindness","Growth","Intelligence","Passion","Stability"],multi:true,max:3},
  {key:"lifestyle",title:"Lifestyle",icon:"🏃",question:"How would you describe your lifestyle?",options:["Very active & outdoorsy","Balanced mix","Homebody & relaxed","Social butterfly"]},
  {key:"commStyle",title:"Communication Style",icon:"💬",question:"Your primary love language?",options:["Words of Affirmation","Quality Time","Physical Touch","Acts of Service","Receiving Gifts"]},
  {key:"interests",title:"Interests",icon:"🎯",question:"Select your interests (3-6)",options:["Travel","Photography","Yoga","Cooking","Hiking","Music","Art","Wine","Dancing","Fitness","Gaming","Movies","Business","Reading","Science","Nature","Tech","Fashion"],multi:true,max:6},
  {key:"intimacy",title:"Intimacy Importance",icon:"🔥",question:"How important is physical intimacy?",type:"slider",min:1,max:10},
];

const ICEBREAKERS = ["What's your most spontaneous adventure? 🌍","If you could teleport anywhere? ✈️","Guilty pleasure song? 🎵","Beach or mountains? 🏖️⛰️","Best meal you've ever had? 🤤","Morning person or night owl? 🌅🦉","Binge-watching anything good? 📺","Lottery win — first purchase? 💰"];
const REACTIONS = ["❤️","🔥","😍","😂","👏","💕","✨","🥰"];
const DATE_IDEAS = [{icon:"☕",title:"Coffee Date",desc:"Cozy & casual"},{icon:"🎨",title:"Art Gallery",desc:"Creative vibes"},{icon:"🥾",title:"Hiking Trail",desc:"Adventure awaits"},{icon:"🍷",title:"Wine Tasting",desc:"Sophisticated sips"},{icon:"🎳",title:"Bowling Night",desc:"Retro fun"},{icon:"🌮",title:"Food Crawl",desc:"Taste everything"}];
const SAFETY_TIPS = ["Always meet in public places first","Share your plans with a trusted friend","Trust your instincts — leave if uncomfortable","Video call before meeting in person","Don't share financial info with matches"];

// ═══════════════════════════════════════════════════════════════════════════════
//  REAL COMPATIBILITY SCORING ALGORITHM
// ═══════════════════════════════════════════════════════════════════════════════
function calculateCompatibility(myProfile, otherProfile) {
  let score = 0;
  let maxScore = 0;
  let reasons = [];

  // 1. Relationship Intent (25 points)
  maxScore += 25;
  if (myProfile.goals && otherProfile.goals) {
    if (myProfile.goals === otherProfile.goals) {
      score += 25;
      reasons.push("Identical relationship goals");
    } else if (
      (myProfile.goals === "Long-term relationship" && otherProfile.goals === "Serious dating") ||
      (myProfile.goals === "Serious dating" && otherProfile.goals === "Long-term relationship")
    ) {
      score += 18;
      reasons.push("Similar relationship goals");
    } else if (myProfile.goals === "Open to anything" || otherProfile.goals === "Open to anything") {
      score += 12;
      reasons.push("Flexible relationship goals");
    } else {
      score += 5;
    }
  }

  // 2. Values Alignment (20 points)
  maxScore += 20;
  if (myProfile.values?.length && otherProfile.values?.length) {
    const shared = myProfile.values.filter(v => otherProfile.values.includes(v));
    const valPoints = Math.min((shared.length / Math.max(myProfile.values.length, 1)) * 20, 20);
    score += valPoints;
    if (shared.length >= 2) reasons.push(`Share ${shared.length} core values: ${shared.join(", ")}`);
    else if (shared.length === 1) reasons.push(`Both value ${shared[0]}`);
  }

  // 3. Lifestyle Compatibility (15 points)
  maxScore += 15;
  if (myProfile.lifestyle && otherProfile.lifestyle) {
    if (myProfile.lifestyle === otherProfile.lifestyle) {
      score += 15;
      reasons.push("Matching lifestyle preferences");
    } else if (
      myProfile.lifestyle === "Balanced mix" || otherProfile.lifestyle === "Balanced mix"
    ) {
      score += 10;
      reasons.push("Compatible lifestyle balance");
    } else {
      score += 5;
      reasons.push("Different but complementary lifestyles");
    }
  }

  // 4. Communication Style (15 points)
  maxScore += 15;
  if (myProfile.commStyle && otherProfile.commStyle) {
    if (myProfile.commStyle === otherProfile.commStyle) {
      score += 15;
      reasons.push(`Both speak ${myProfile.commStyle}`);
    } else {
      score += 7;
      reasons.push("Different communication styles can complement");
    }
  }

  // 5. Shared Interests (15 points)
  maxScore += 15;
  if (myProfile.interests?.length && otherProfile.interests?.length) {
    const shared = myProfile.interests.filter(i => otherProfile.interests.includes(i));
    const intPoints = Math.min((shared.length / 3) * 15, 15);
    score += intPoints;
    if (shared.length >= 2) reasons.push(`${shared.length} shared interests: ${shared.join(", ")}`);
    else if (shared.length === 1) reasons.push(`Both enjoy ${shared[0]}`);
    else reasons.push("Different interests — room to explore together");
  }

  // 6. Intimacy Compatibility (10 points)
  maxScore += 10;
  if (myProfile.intimacy && otherProfile.intimacy) {
    const diff = Math.abs(myProfile.intimacy - otherProfile.intimacy);
    const intScore = Math.max(10 - diff * 2, 0);
    score += intScore;
    if (diff <= 1) reasons.push("Intimacy expectations align well");
    else if (diff <= 3) reasons.push("Similar intimacy outlook");
  }

  const finalScore = maxScore > 0 ? Math.round((score / maxScore) * 100) : 50;
  const topReasons = reasons.slice(0, 3);
  const whyMatch = topReasons.length > 0 
    ? topReasons.join(". ") + "."
    : "Potential for a unique and interesting connection.";

  return { score: Math.max(Math.min(finalScore, 99), 35), whyMatch };
}

// ═══════════════════════════════════════════════════════════════════════════════
//  3D PARTICLE CANVAS
// ═══════════════════════════════════════════════════════════════════════════════
function ThreeCanvas() {
  const ref = useRef(null), anim = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext("2d");
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    const P = Array.from({length:60}, () => ({
      x:Math.random()*w, y:Math.random()*h, z:Math.random()*800,
      vx:(Math.random()-0.5)*0.2, vy:(Math.random()-0.5)*0.2, vz:(Math.random()-0.5)*0.3,
      hue:270+Math.random()*90, sz:1+Math.random()*2,
      ph:Math.random()*6.28, ps:0.01+Math.random()*0.02,
    }));
    const S = [
      {x:w*0.2,y:h*0.3,z:400,rx:0,ry:0,rz:0,sx:0.006,sy:0.008,sz:0.004,vx:0.1,vy:0.07,s:35,hue:320,op:0.04,t:"cube"},
      {x:w*0.75,y:h*0.6,z:500,rx:1,ry:2,rz:0,sx:0.005,sy:0.007,sz:0.005,vx:-0.08,vy:0.09,s:30,hue:280,op:0.035,t:"diamond"},
      {x:w*0.5,y:h*0.15,z:350,rx:0,ry:0,rz:0,sx:0.005,sy:0.009,sz:0.003,vx:0.07,vy:-0.05,s:40,hue:200,op:0.04,t:"oct"},
      {x:w*0.85,y:h*0.8,z:550,rx:2,ry:1,rz:3,sx:0.008,sy:0.004,sz:0.006,vx:-0.12,vy:0.1,s:25,hue:340,op:0.035,t:"tri"},
    ];
    function proj(x,y,z){ const f=500,sc=f/(f+z); return {x:w/2+(x-w/2)*sc,y:h/2+(y-h/2)*sc,sc}; }
    function rot3(V,rx,ry,rz){ const cx=Math.cos(rx),sx2=Math.sin(rx),cy=Math.cos(ry),sy=Math.sin(ry),cz=Math.cos(rz),sz=Math.sin(rz); return V.map(([a,b,cc])=>{ let x1=a,y1=b*cx-cc*sx2,z1=b*sx2+cc*cx; let x2=x1*cy+z1*sy,y2=y1,z2=-x1*sy+z1*cy; return [x2*cz-y2*sz,x2*sz+y2*cz,z2]; }); }
    function drawS(s){ const p=proj(s.x,s.y,s.z),sz2=s.s*p.sc; let V=[],E=[]; const hh=sz2/2;
      if(s.t==="cube"){V=[[-hh,-hh,-hh],[hh,-hh,-hh],[hh,hh,-hh],[-hh,hh,-hh],[-hh,-hh,hh],[hh,-hh,hh],[hh,hh,hh],[-hh,hh,hh]];E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];}
      else if(s.t==="diamond"){V=[[0,-hh,0],[hh,0,0],[0,0,hh],[-hh,0,0],[0,0,-hh],[0,hh,0]];E=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]];}
      else if(s.t==="oct"){V=[[0,-hh,0],[hh,0,0],[0,0,hh],[-hh,0,0],[0,0,-hh],[0,hh,0]];E=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]];}
      else{V=[[0,-hh,0],[hh,hh,-hh/2],[-hh,hh,-hh/2],[0,hh,hh/2]];E=[[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];}
      const R=rot3(V,s.rx,s.ry,s.rz);ctx.save();ctx.translate(p.x,p.y);ctx.globalAlpha=s.op*p.sc;ctx.strokeStyle=`hsla(${s.hue},75%,60%,${0.3*p.sc})`;ctx.lineWidth=p.sc;ctx.shadowColor=`hsla(${s.hue},80%,55%,0.2)`;ctx.shadowBlur=5;
      E.forEach(([a,b])=>{if(R[a]&&R[b]){ctx.beginPath();ctx.moveTo(R[a][0],R[a][1]);ctx.lineTo(R[b][0],R[b][1]);ctx.stroke();}});
      R.forEach(([vx,vy])=>{ctx.beginPath();ctx.arc(vx,vy,1.1*p.sc,0,6.28);ctx.fillStyle=`hsla(${s.hue},85%,70%,${0.4*p.sc})`;ctx.fill();});ctx.restore();
    }
    function frame(){ ctx.clearRect(0,0,w,h);
      P.forEach(p=>{ p.x+=p.vx;p.y+=p.vy;p.z+=p.vz;p.ph+=p.ps; if(p.x<0)p.x=w;if(p.x>w)p.x=0;if(p.y<0)p.y=h;if(p.y>h)p.y=0;if(p.z<0)p.z=800;if(p.z>800)p.z=0;
        const pr=proj(p.x,p.y,p.z),r=p.sz*pr.sc*(0.7+0.3*Math.sin(p.ph));
        const g=ctx.createRadialGradient(pr.x,pr.y,0,pr.x,pr.y,r*2.5);g.addColorStop(0,`hsla(${p.hue},80%,68%,${0.5*pr.sc})`);g.addColorStop(1,`hsla(${p.hue},80%,68%,0)`);ctx.beginPath();ctx.arc(pr.x,pr.y,r*2.5,0,6.28);ctx.fillStyle=g;ctx.fill();
      });
      for(let i=0;i<P.length;i++)for(let j=i+1;j<P.length;j++){const a=proj(P[i].x,P[i].y,P[i].z),b=proj(P[j].x,P[j].y,P[j].z),d=Math.hypot(a.x-b.x,a.y-b.y);if(d<80){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=`rgba(170,130,255,${(1-d/80)*0.08*Math.min(a.sc,b.sc)})`;ctx.lineWidth=0.4;ctx.stroke();}}
      S.forEach(s=>{s.rx+=s.sx;s.ry+=s.sy;s.rz+=s.sz;s.x+=s.vx;s.y+=s.vy;if(s.x<-60)s.x=w+60;if(s.x>w+60)s.x=-60;if(s.y<-60)s.y=h+60;if(s.y>h+60)s.y=-60;drawS(s);});
      anim.current=requestAnimationFrame(frame);
    }
    frame();
    const rs=()=>{w=c.width=window.innerWidth;h=c.height=window.innerHeight;};
    window.addEventListener("resize",rs);
    return()=>{cancelAnimationFrame(anim.current);window.removeEventListener("resize",rs);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",zIndex:0,pointerEvents:"none"}}/>;
}

// ── BURST EFFECT ─────────────────────────────────────────────────────────────
function Burst({x,y,onDone}){
  const ref=useRef(null);
  useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext("2d");c.width=260;c.height=260;const ps=Array.from({length:22},(_,i)=>{const a=(6.28*i)/22+Math.random()*0.5,sp=2+Math.random()*5;return{x:130,y:130,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,sz:2+Math.random()*3.5,hue:290+Math.random()*70};});let f;function draw(){ctx.clearRect(0,0,260,260);let alive=false;ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.07;p.life-=0.02;if(p.life>0){alive=true;ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,p.sz*p.life,0,6.28);ctx.fillStyle=`hsla(${p.hue},90%,65%,${p.life})`;ctx.fill();}});if(alive)f=requestAnimationFrame(draw);else onDone?.();}draw();return()=>cancelAnimationFrame(f);},[onDone]);
  return <canvas ref={ref} style={{position:"fixed",left:x-130,top:y-130,width:260,height:260,pointerEvents:"none",zIndex:9999}}/>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AI INTEGRATION — Claude API
// ═══════════════════════════════════════════════════════════════════════════════
async function callAI(system, userMsg) {
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system,
        messages: [{ role: "user", content: userMsg }],
      }),
    });
    const d = await r.json();
    return d.content?.map(c => c.text || "").join("") || null;
  } catch { return null; }
}

// AI Chat Reply — responds as the match character
async function aiChatReply(msg, profile, history) {
  const sys = `You are ${profile.name}, age ${profile.age}, a ${profile.job} living in ${profile.city}. 
Your interests: ${profile.interests.join(", ")}. Your bio: "${profile.bio}"
Your personality matches your bio. You're chatting on a dating app called Auto-Mate.
Be warm, engaging, flirty but respectful. 1-3 sentences. Use emojis occasionally.
Never break character or mention being AI.`;
  const context = history.slice(-6).map(m => `${m.sender === "me" ? "Them" : "You"}: ${m.text}`).join("\n");
  return callAI(sys, context + `\nThem: ${msg}\nYou:`);
}

// AI Conversation Suggestions — personalized to both profiles
async function aiSuggestConvo(myProfile, matchProfile) {
  const r = await callAI(
    "Return ONLY a JSON array of 3 strings. No other text, no markdown, no explanation.",
    `Generate 3 creative, personalized conversation starters for someone who likes ${myProfile.interests?.slice(0,3).join(", ")||"travel and music"} chatting with ${matchProfile.name} (${matchProfile.age}, ${matchProfile.job}, interests: ${matchProfile.interests.join(", ")}). Make them specific to their shared context. Return ONLY a JSON array of 3 strings.`
  );
  try { return JSON.parse((r || "[]").replace(/```json|```/g, "").trim()); } catch { return null; }
}

// AI Profile Bio Writer
async function aiWriteBio(currentBio, interests, style) {
  return callAI(
    `You are an expert dating profile writer. Write a ${style} dating bio. Return ONLY the bio text (2-4 sentences). No quotes, no explanation.`,
    `Write a ${style} dating profile bio for someone whose interests include ${interests?.join(", ")||"adventure and travel"}. ${currentBio ? `Their draft: "${currentBio}". Improve it.` : "Create from scratch."} Return ONLY the bio text.`
  );
}

// AI Genie — Date Ideas based on shared interests
async function aiGenieDateIdeas(interests1, interests2) {
  const r = await callAI(
    "Return ONLY a JSON array of 3 objects with 'icon' (single emoji), 'title' (2-3 words), and 'desc' (3-5 words) fields. No other text.",
    `Suggest 3 creative first date ideas for two people. Person A likes: ${interests1.join(", ")}. Person B likes: ${interests2.join(", ")}. Base ideas on their shared or complementary interests. Return ONLY a JSON array.`
  );
  try { return JSON.parse((r || "[]").replace(/```json|```/g, "").trim()); } catch { return null; }
}

// AI Compatibility Explanation — rich AI-generated match reason
async function aiExplainMatch(myProfile, matchProfile, score) {
  return callAI(
    "You are a dating compatibility analyst. Write a brief, warm explanation (1-2 sentences) of why these two people are compatible. Be specific about shared traits. No generic filler.",
    `User A: interests=${myProfile.interests?.join(", ")}, values=${myProfile.values?.join(", ")}, goals=${myProfile.goals}, lifestyle=${myProfile.lifestyle}, communication=${myProfile.commStyle}.
User B (${matchProfile.name}): interests=${matchProfile.interests.join(", ")}, values=${matchProfile.values.join(", ")}, goals=${matchProfile.goals}, lifestyle=${matchProfile.lifestyle}, communication=${matchProfile.commStyle}.
Their compatibility score is ${score}%. Explain why in 1-2 warm sentences.`
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOCAL STORAGE PERSISTENCE
// ═══════════════════════════════════════════════════════════════════════════════
function usePersistedState(key, initial) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(`automate_${key}`);
      return saved ? JSON.parse(saved) : initial;
    } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(`automate_${key}`, JSON.stringify(state)); } catch {}
  }, [key, state]);
  return [state, setState];
}

function usePersistedSet(key) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(`automate_${key}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch { return new Set(); }
  });
  useEffect(() => {
    try { localStorage.setItem(`automate_${key}`, JSON.stringify([...state])); } catch {}
  }, [key, state]);
  return [state, setState];
}

// ═══════════════════════════════════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════════════════════════════════
const T = {
  bg:"#060610", card:"rgba(16,14,32,0.82)", card2:"rgba(24,20,48,0.6)",
  text:"#f0edf8", mut:"rgba(175,168,210,0.5)", soft:"rgba(210,200,240,0.75)",
  brd:"rgba(110,85,210,0.1)", acc:"#ff3cac",
  g1:"linear-gradient(135deg,#ff3cac 0%,#784ba0 50%,#2b86c5 100%)",
  g2:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
  g3:"linear-gradient(135deg,#f093fb 0%,#f5576c 100%)",
  g4:"linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)",
  g5:"linear-gradient(135deg,#fa709a 0%,#fee140 100%)",
  gG:"linear-gradient(135deg,#f5af19 0%,#f12711 100%)",
  gGenie:"linear-gradient(135deg,#a855f7 0%,#6366f1 50%,#06b6d4 100%)",
  bM:"linear-gradient(135deg,#7c3aed 0%,#a855f7 40%,#ec4899 100%)",
  bT:"rgba(30,26,58,0.9)",
  gl:"rgba(14,12,30,0.78)",
};

const gc = { background:T.gl, backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", border:`1px solid ${T.brd}`, borderRadius:22 };
const bp = { transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", cursor:"pointer" };

// ── SHARED UI COMPONENTS ─────────────────────────────────────────────────────
function Btn({children, gradient, onClick, disabled, style:s, ...rest}) {
  return <button className="bp" onClick={onClick} disabled={disabled} style={{padding:"14px 28px",borderRadius:18,border:"none",background:gradient||T.g1,color:"white",fontSize:15,fontWeight:700,cursor:disabled?"default":"pointer",fontFamily:"'Outfit',sans-serif",boxShadow:disabled?"none":"0 6px 24px rgba(255,60,172,0.3)",opacity:disabled?0.4:1,...bp,...s}} {...rest}>{children}</button>;
}
function GlassCard({children, style:s, className:cn, ...rest}) {
  return <div className={cn} style={{...gc,...s}} {...rest}>{children}</div>;
}
function FormInput({label, ...rest}) {
  return <div style={{marginBottom:14}}>{label&&<label style={{fontSize:12,fontWeight:700,color:T.soft,marginBottom:6,display:"block"}}>{label}</label>}<input className="ig" {...rest} style={{width:"100%",padding:"13px 16px",borderRadius:16,border:`1px solid ${T.brd}`,background:T.card,color:T.text,fontSize:14,fontFamily:"'Outfit',sans-serif",outline:"none",transition:"all 0.3s ease",...(rest.style||{})}}/></div>;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function AutoMate() {
  // ── NAVIGATION ─────────────────────────────────────────────────────────────
  const [screen, setScreen] = usePersistedState("screen", "landing");
  const [appView, setAppView] = useState("discover");

  // ── AUTH ────────────────────────────────────────────────────────────────────
  const [authData, setAuthData] = useState({email:"",password:"",name:""});

  // ── QUIZ ───────────────────────────────────────────────────────────────────
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = usePersistedState("quiz", {intent:"",values:[],lifestyle:"",commStyle:"",interests:[],intimacy:5});

  // ── VERIFY & PLAN ──────────────────────────────────────────────────────────
  const [vStep, setVStep] = useState(0);
  const [plan, setPlan] = usePersistedState("plan", null);

  // ── USER PROFILE ───────────────────────────────────────────────────────────
  const [myProfile, setMyProfile] = usePersistedState("profile", {name:"",age:"",gender:"",city:"",bio:"",interests:[],goals:"",values:[],lifestyle:"",commStyle:"",intimacy:5});

  // ── MATCHES ────────────────────────────────────────────────────────────────
  const [liked, setLiked] = usePersistedSet("liked");
  const [passed, setPassed] = usePersistedSet("passed");
  const [saved, setSaved] = usePersistedSet("saved");
  const [blocked, setBlocked] = usePersistedSet("blocked");
  const [tab, setTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [match, setMatch] = useState(null);

  // ── CHAT ───────────────────────────────────────────────────────────────────
  const [convos, setConvos] = usePersistedState("convos", {});
  const [msg, setMsg] = useState("");
  const [typing, setTyping] = useState(false);
  const [showIce, setShowIce] = useState(false);
  const [showReact, setShowReact] = useState(null);
  const [showDate, setShowDate] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiSugs, setAiSugs] = useState(null);
  const [aiLoad, setAiLoad] = useState(false);

  // ── GENIE ──────────────────────────────────────────────────────────────────
  const [showGenie, setShowGenie] = useState(false);
  const [genieTab, setGenieTab] = useState("soulmate");
  const [genieDates, setGenieDates] = useState(null);
  const [genieLoading, setGenieLoading] = useState(false);

  // ── MODALS ─────────────────────────────────────────────────────────────────
  const [profModal, setProfModal] = useState(null);
  const [safety, setSafety] = useState(false);
  const [reportModal, setReportModal] = useState(null);
  const [reportReason, setReportReason] = useState("");
  const [showBioWriter, setShowBioWriter] = useState(false);
  const [bioStyle, setBioStyle] = useState("confident");
  const [bioLoading, setBioLoading] = useState(false);
  const [bioResult, setBioResult] = useState("");
  const [toast, setToast] = useState(null);

  // ── EFFECTS ────────────────────────────────────────────────────────────────
  const [bursts, setBursts] = useState([]);
  const endRef = useRef(null);
  const inpRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({behavior:"smooth"}); }, [convos, match]);
  useEffect(() => { if(toast) { const t=setTimeout(()=>setToast(null),3000); return()=>clearTimeout(t); } }, [toast]);

  const burst = useCallback(e => {
    const id = Date.now();
    setBursts(p => [...p, {id, x:e.clientX, y:e.clientY}]);
    setTimeout(() => setBursts(p => p.filter(b => b.id !== id)), 1500);
  }, []);

  // ── COMPUTED: Profiles with REAL compatibility scores ──────────────────────
  const scoredProfiles = useMemo(() => {
    return SEED_PROFILES
      .filter(p => !blocked.has(p.id))
      .map(p => {
        const {score, whyMatch} = calculateCompatibility(myProfile, p);
        return {...p, compat: score, whyMatch};
      })
      .sort((a, b) => b.compat - a.compat);
  }, [myProfile, blocked]);

  const visibleProfiles = scoredProfiles.filter(p => !passed.has(p.id) && p.name.toLowerCase().includes(search.toLowerCase()));
  const savedProfiles = scoredProfiles.filter(p => saved.has(p.id));
  const matchedProfiles = scoredProfiles.filter(p => liked.has(p.id));
  const soulmateProfile = scoredProfiles[0];
  const surpriseIdx = Math.min(3, scoredProfiles.length - 1);
  const surpriseProfile = scoredProfiles.filter(p => !liked.has(p.id) && p.id !== soulmateProfile?.id)[0] || scoredProfiles[surpriseIdx] || scoredProfiles[0];

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const send = async () => {
    if (!msg.trim() || !match) return;
    const mid = match.id, txt = msg.trim();
    const nm = {id:Date.now(), sender:"me", text:txt, time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}), reactions:[]};
    setConvos(p => ({...p, [mid]: [...(p[mid]||[]), nm]}));
    setMsg(""); setShowIce(false); setTyping(true);

    const hist = convos[mid] || [];
    const ai = await aiChatReply(txt, match, [...hist, nm]);
    const fb = ["That sounds amazing! 😊","I love that! 💕","Haha you're funny 😂","We have so much in common! ✨","Best convo on here 🔥","I'm smiling rn 🥰"];

    setTimeout(() => {
      setConvos(p => ({...p, [mid]: [...(p[mid]||[]), {
        id:Date.now()+1, sender:"them",
        text: ai || fb[Math.floor(Math.random()*fb.length)],
        time: new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),
        reactions:[], ai:!!ai,
      }]}));
      setTyping(false);
    }, ai ? 500 : 1500 + Math.random()*2000);
  };

  const react = (mid, msgId, emoji) => {
    setConvos(p => ({...p, [mid]: p[mid].map(m => m.id === msgId ? {...m, reactions:[...(m.reactions||[]),emoji]} : m)}));
    setShowReact(null);
  };

  const fetchSugs = async () => {
    if (!match) return;
    setAiLoad(true);
    setAiSugs(await aiSuggestConvo(myProfile, match) || ICEBREAKERS.slice(0,3));
    setAiLoad(false);
  };

  const fetchGenieDates = async () => {
    setGenieLoading(true);
    const ideas = await aiGenieDateIdeas(myProfile.interests?.length ? myProfile.interests : ["Travel","Music"], soulmateProfile?.interests || ["Art"]);
    setGenieDates(ideas || DATE_IDEAS.slice(0,3));
    setGenieLoading(false);
  };

  const generateBio = async () => {
    setBioLoading(true);
    const result = await aiWriteBio(myProfile.bio, myProfile.interests, bioStyle);
    setBioResult(result || "I believe the best connections come from genuine curiosity and shared laughter. Always up for an adventure or a deep conversation over good coffee. Looking for someone who values authenticity as much as I do. ✨");
    setBioLoading(false);
  };

  const openChat = p => { setMatch(p); setAppView("chat"); };
  const msgs = match ? (convos[match.id] || []) : [];

  const logout = () => {
    localStorage.clear();
    setScreen("landing");
    setMyProfile({name:"",age:"",gender:"",city:"",bio:"",interests:[],goals:"",values:[],lifestyle:"",commStyle:"",intimacy:5});
    setQuizAnswers({intent:"",values:[],lifestyle:"",commStyle:"",interests:[],intimacy:5});
    setConvos({});
    setToast("Logged out successfully");
  };

  // ═════════════════════════════════════════════════════════════════════════════
  //  RENDER
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div style={{fontFamily:"'Outfit',sans-serif",background:T.bg,color:T.text,height:"100vh",width:"100%",maxWidth:440,margin:"0 auto",position:"relative",overflow:"hidden",display:"flex",flexDirection:"column"}}>

      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideUp{from{opacity:0;transform:translateY(100%)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{0%{opacity:0;transform:scale(0.7)}60%{transform:scale(1.05)}100%{opacity:1;transform:scale(1)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(255,60,172,0.3)}50%{box-shadow:0 0 50px rgba(120,75,160,0.6)}}
        @keyframes bounceIn{0%{transform:scale(0)}50%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes typingDot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}
        @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes slideInRight{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes scanLine{0%{top:0}100%{top:100%}}
        @keyframes genieGlow{0%,100%{filter:drop-shadow(0 0 8px rgba(168,85,247,0.4))}50%{filter:drop-shadow(0 0 20px rgba(99,102,241,0.6))}}
        @keyframes toastIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        *::-webkit-scrollbar{width:2px}*::-webkit-scrollbar-thumb{background:rgba(120,75,160,0.15);border-radius:10px}
        *{box-sizing:border-box;margin:0;padding:0}
        .bp:hover{transform:scale(1.05)}.bp:active{transform:scale(0.94)}
        .ig:focus{box-shadow:0 0 0 2px rgba(120,75,160,0.3),0 0 20px rgba(120,75,160,0.1);border-color:rgba(120,75,160,0.4)!important}
        .sd{box-shadow:0 0 0 2px #060610,0 0 8px rgba(0,255,150,0.5)}
        .gt{background:${T.g1};background-size:200% 200%;animation:gradientShift 4s ease infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .c3{transition:transform 0.4s ease,box-shadow 0.4s ease}.c3:hover{transform:perspective(800px) rotateY(2deg) rotateX(-1deg) translateY(-3px);box-shadow:0 16px 50px rgba(120,75,160,0.2)}
      `}</style>

      <ThreeCanvas />
      {bursts.map(b => <Burst key={b.id} x={b.x} y={b.y} onDone={() => setBursts(p => p.filter(v => v.id !== b.id))} />)}

      {/* Toast */}
      {toast && <div style={{position:"fixed",top:20,left:"50%",transform:"translateX(-50%)",zIndex:9999,padding:"10px 20px",borderRadius:16,background:T.g1,color:"white",fontSize:13,fontWeight:600,animation:"toastIn 0.3s ease",boxShadow:"0 8px 30px rgba(255,60,172,0.3)"}}>{toast}</div>}

      {/* ══════════════════ LANDING ══════════════════ */}
      {screen === "landing" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",position:"relative",zIndex:1,padding:28,textAlign:"center"}}>
          <div style={{fontSize:56,marginBottom:16,animation:"float 3s ease infinite",filter:"drop-shadow(0 0 25px rgba(255,60,172,0.4))"}}>💝</div>
          <h1 style={{fontSize:34,fontWeight:900,fontFamily:"'Sora',sans-serif",marginBottom:6,animation:"fadeInUp 0.6s ease 0.2s both"}}><span className="gt">Auto-Mate</span></h1>
          <p style={{fontSize:15,color:T.soft,fontWeight:500,marginBottom:4,animation:"fadeInUp 0.6s ease 0.3s both"}}>AI-Powered Dating</p>
          <p style={{fontSize:13,color:T.mut,lineHeight:1.6,marginBottom:32,maxWidth:300,animation:"fadeInUp 0.6s ease 0.4s both"}}>Meaningful connections through personality matching, compatibility scoring, and intelligent conversation — not endless swiping.</p>
          <div style={{display:"flex",flexDirection:"column",gap:12,width:"100%",maxWidth:300,animation:"fadeInUp 0.6s ease 0.5s both"}}>
            <Btn onClick={() => setScreen("signup")} style={{width:"100%"}}>Get Started</Btn>
            <Btn onClick={() => setScreen("login")} gradient={T.card} style={{width:"100%",boxShadow:"none",border:`1px solid ${T.brd}`}}>Sign In</Btn>
          </div>
          <div style={{display:"flex",gap:20,marginTop:36,animation:"fadeInUp 0.6s ease 0.7s both"}}>
            {[{n:"10K+",l:"Users"},{n:"94%",l:"Match Rate"},{n:"AI",l:"Powered"}].map((s,i) => (
              <div key={i}><p style={{fontSize:20,fontWeight:800}}><span className="gt">{s.n}</span></p><p style={{fontSize:10,color:T.mut,fontWeight:600}}>{s.l}</p></div>
            ))}
          </div>
          <p style={{position:"absolute",bottom:20,fontSize:10,color:T.mut,animation:"fadeIn 1s ease 1s both"}}>automatedate.app</p>
        </div>
      )}

      {/* ══════════════════ LOGIN ══════════════════ */}
      {screen === "login" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",zIndex:1,padding:28}}>
          <button className="bp" onClick={() => setScreen("landing")} style={{position:"absolute",top:24,left:20,background:"none",border:"none",color:T.soft,fontSize:15,cursor:"pointer",...bp}}>← Back</button>
          <div style={{textAlign:"center",marginBottom:28}}><div style={{fontSize:40,marginBottom:8}}>👋</div><h2 style={{fontSize:24,fontWeight:800,fontFamily:"'Sora'"}}>Welcome Back</h2><p style={{fontSize:13,color:T.mut,marginTop:4}}>Sign in to Auto-Mate</p></div>
          <FormInput label="Email" type="email" placeholder="your@email.com" value={authData.email} onChange={e => setAuthData(p => ({...p,email:e.target.value}))} />
          <FormInput label="Password" type="password" placeholder="••••••••" value={authData.password} onChange={e => setAuthData(p => ({...p,password:e.target.value}))} />
          <Btn onClick={() => { setScreen("app"); setToast(`Welcome back${myProfile.name ? `, ${myProfile.name}` : ""}!`); }} style={{width:"100%",marginTop:8}}>Sign In</Btn>
          <p style={{textAlign:"center",fontSize:13,color:T.mut,marginTop:16}}>Don't have an account? <span onClick={() => setScreen("signup")} style={{color:T.acc,cursor:"pointer",fontWeight:600}}>Sign Up</span></p>
        </div>
      )}

      {/* ══════════════════ SIGNUP ══════════════════ */}
      {screen === "signup" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",position:"relative",zIndex:1,padding:28,overflowY:"auto"}}>
          <button className="bp" onClick={() => setScreen("landing")} style={{position:"absolute",top:24,left:20,background:"none",border:"none",color:T.soft,fontSize:15,cursor:"pointer",...bp}}>← Back</button>
          <div style={{textAlign:"center",marginBottom:28,marginTop:40}}><div style={{fontSize:40,marginBottom:8}}>✨</div><h2 style={{fontSize:24,fontWeight:800,fontFamily:"'Sora'"}}>Create Account</h2><p style={{fontSize:13,color:T.mut,marginTop:4}}>Start finding meaningful connections</p></div>
          <FormInput label="First Name" placeholder="Your name" value={authData.name} onChange={e => { setAuthData(p => ({...p,name:e.target.value})); setMyProfile(p => ({...p,name:e.target.value})); }} />
          <FormInput label="Email" type="email" placeholder="your@email.com" value={authData.email} onChange={e => setAuthData(p => ({...p,email:e.target.value}))} />
          <FormInput label="Password" type="password" placeholder="Create a password (8+ chars)" value={authData.password} onChange={e => setAuthData(p => ({...p,password:e.target.value}))} />
          <div style={{display:"flex",gap:10}}>
            <div style={{width:"40%"}}><FormInput label="Age" type="number" placeholder="25" value={myProfile.age} onChange={e => setMyProfile(p => ({...p,age:e.target.value}))} /></div>
            <div style={{flex:1,marginBottom:14}}><label style={{fontSize:12,fontWeight:700,color:T.soft,marginBottom:6,display:"block"}}>Gender</label><div style={{display:"flex",gap:6}}>{["Man","Woman","Non-binary"].map(g => <button key={g} className="bp" onClick={() => setMyProfile(p => ({...p,gender:g}))} style={{flex:1,padding:"12px 0",borderRadius:12,border:myProfile.gender===g?"none":`1px solid ${T.brd}`,background:myProfile.gender===g?T.g2:T.card,color:myProfile.gender===g?"white":T.soft,fontSize:11,fontWeight:600,cursor:"pointer",...bp}}>{g}</button>)}</div></div>
          </div>
          <FormInput label="City" placeholder="Seattle, WA" value={myProfile.city} onChange={e => setMyProfile(p => ({...p,city:e.target.value}))} />
          <Btn onClick={() => { if(!authData.name||!authData.email){setToast("Please fill in name and email");return;} setScreen("quiz"); setToast("Let's find your matches! 🎯"); }} style={{width:"100%",marginTop:4}}>Continue to Quiz →</Btn>
        </div>
      )}

      {/* ══════════════════ COMPATIBILITY QUIZ ══════════════════ */}
      {screen === "quiz" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,padding:24}}>
          <div style={{display:"flex",gap:4,marginTop:16,marginBottom:28}}>
            {QUIZ_SECTIONS.map((_,i) => <div key={i} style={{flex:1,height:5,borderRadius:5,background:i<=quizStep?T.g1:"rgba(120,75,160,0.12)",transition:"all 0.4s ease"}} />)}
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            {(() => {
              const sec = QUIZ_SECTIONS[quizStep];
              if (!sec) return null;
              return (
                <div style={{animation:"fadeInUp 0.4s ease"}}>
                  <div style={{fontSize:40,marginBottom:12}}>{sec.icon}</div>
                  <h2 style={{fontSize:22,fontWeight:800,fontFamily:"'Sora'",marginBottom:4}}>{sec.title}</h2>
                  <p style={{fontSize:14,color:T.mut,marginBottom:24}}>{sec.question}</p>
                  {sec.type === "slider" ? (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                        <span style={{fontSize:12,color:T.mut}}>Not important</span>
                        <span style={{fontSize:22,fontWeight:800}}><span className="gt">{quizAnswers.intimacy}</span></span>
                        <span style={{fontSize:12,color:T.mut}}>Very important</span>
                      </div>
                      <input type="range" min={1} max={10} value={quizAnswers.intimacy} onChange={e => setQuizAnswers(p => ({...p,intimacy:+e.target.value}))} style={{width:"100%",accentColor:T.acc,height:6}} />
                    </div>
                  ) : sec.multi ? (
                    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {sec.options.map(opt => {
                        const sel = quizAnswers[sec.key]?.includes(opt);
                        const atMax = quizAnswers[sec.key]?.length >= sec.max && !sel;
                        return <button key={opt} className="bp" disabled={atMax}
                          onClick={() => setQuizAnswers(p => ({...p,[sec.key]:sel?p[sec.key].filter(v=>v!==opt):[...(p[sec.key]||[]),opt]}))}
                          style={{padding:"9px 16px",borderRadius:28,border:sel?"none":`1px solid ${T.brd}`,background:sel?T.g2:T.card,color:sel?"white":atMax?"rgba(200,190,230,0.3)":T.soft,fontSize:13,fontWeight:600,cursor:atMax?"default":"pointer",opacity:atMax?0.4:1,...bp}}>{opt}</button>;
                      })}
                      <p style={{width:"100%",fontSize:11,color:T.mut,marginTop:4}}>Select up to {sec.max} ({quizAnswers[sec.key]?.length || 0}/{sec.max})</p>
                    </div>
                  ) : (
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {sec.options.map((opt,i) => (
                        <button key={opt} className="bp" onClick={() => setQuizAnswers(p => ({...p,[sec.key]:opt}))}
                          style={{padding:"14px 18px",borderRadius:16,border:quizAnswers[sec.key]===opt?"none":`1px solid ${T.brd}`,background:quizAnswers[sec.key]===opt?T.g1:T.card,color:quizAnswers[sec.key]===opt?"white":T.soft,fontSize:14,fontWeight:600,cursor:"pointer",textAlign:"left",animation:`fadeInUp 0.3s ease ${i*0.05}s both`,...bp}}>{opt}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
          <div style={{display:"flex",gap:12,paddingBottom:16}}>
            {quizStep > 0 && <Btn onClick={() => setQuizStep(s => s-1)} gradient={T.card} style={{flex:1,boxShadow:"none",border:`1px solid ${T.brd}`}}>Back</Btn>}
            <Btn onClick={() => {
              if (quizStep < QUIZ_SECTIONS.length - 1) { setQuizStep(s => s+1); }
              else {
                const profile = {...myProfile, interests:quizAnswers.interests, values:quizAnswers.values, goals:quizAnswers.intent, commStyle:quizAnswers.commStyle, lifestyle:quizAnswers.lifestyle, intimacy:quizAnswers.intimacy};
                setMyProfile(profile);
                setScreen("verify");
                setToast("Quiz complete! Your matches are being scored with AI 🧠");
              }
            }} style={{flex:2}}>
              {quizStep === QUIZ_SECTIONS.length - 1 ? "Finish Quiz →" : "Continue"}
            </Btn>
          </div>
        </div>
      )}

      {/* ══════════════════ VERIFY ══════════════════ */}
      {screen === "verify" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,padding:24}}>
          <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:20,marginBottom:28}}>
            {["ID","Selfie","Verify","Done"].map((l,i) => <div key={i} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:26,height:26,borderRadius:"50%",background:i<=vStep?T.g1:"rgba(120,75,160,0.12)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:i<=vStep?"white":T.mut,transition:"all 0.4s ease"}}>{i<vStep?"✓":i+1}</div>{i<3&&<div style={{width:14,height:2,background:i<vStep?T.acc:"rgba(120,75,160,0.1)"}}/>}</div>)}
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            {vStep===0&&<div style={{textAlign:"center",animation:"fadeInUp 0.5s ease",width:"100%"}}><div style={{width:72,height:72,borderRadius:22,margin:"0 auto 18px",background:"rgba(120,75,160,0.08)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,border:"2px dashed rgba(120,75,160,0.2)"}}>🪪</div><h2 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'",marginBottom:6}}>Upload Your ID</h2><p style={{fontSize:13,color:T.mut,marginBottom:20}}>Government-issued ID for verification</p><GlassCard style={{padding:24,cursor:"pointer",borderStyle:"dashed",borderWidth:2,display:"flex",flexDirection:"column",alignItems:"center",gap:10}} onClick={()=>setVStep(1)}><div style={{fontSize:28}}>📤</div><p style={{fontSize:13,fontWeight:600}}>Tap to upload</p><p style={{fontSize:11,color:T.mut}}>JPG, PNG or PDF</p></GlassCard><GlassCard style={{padding:12,marginTop:14,display:"flex",alignItems:"center",gap:8}}><span>🔒</span><p style={{fontSize:11,color:T.mut,textAlign:"left"}}>AES-256 encrypted. Deleted after verification.</p></GlassCard></div>}
            {vStep===1&&<div style={{textAlign:"center",animation:"fadeInUp 0.5s ease"}}><div style={{width:140,height:140,borderRadius:"50%",margin:"0 auto 18px",background:T.card,border:"3px solid rgba(120,75,160,0.2)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}><span style={{fontSize:48}}>🤳</span><div style={{position:"absolute",left:0,right:0,height:3,background:T.g1,animation:"scanLine 2s ease-in-out infinite",boxShadow:"0 0 12px rgba(255,60,172,0.5)"}}/></div><h2 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'",marginBottom:6}}>Take a Selfie</h2><p style={{fontSize:13,color:T.mut,marginBottom:20}}>AI facial recognition matching</p><Btn onClick={()=>{setVStep(2);setTimeout(()=>setVStep(3),3000);}}>📸 Capture</Btn></div>}
            {vStep===2&&<div style={{textAlign:"center",animation:"fadeIn 0.5s ease"}}><div style={{width:70,height:70,borderRadius:"50%",margin:"0 auto 18px",border:"3px solid transparent",borderTopColor:T.acc,animation:"spin 1s linear infinite"}}/><h2 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'",marginBottom:6}}>Verifying...</h2>{["Document check","Face match","Age verify"].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",animation:`fadeInUp 0.4s ease ${i*0.4}s both`}}><span style={{color:T.acc,fontSize:12}}>{i<2?"✓":"⟳"}</span><span style={{fontSize:13,color:T.soft}}>{s}</span></div>)}</div>}
            {vStep===3&&<div style={{textAlign:"center",animation:"popIn 0.6s ease"}}><div style={{width:90,height:90,borderRadius:"50%",margin:"0 auto 18px",background:"rgba(0,200,100,0.1)",border:"2px solid rgba(0,200,100,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,animation:"glow 2s ease infinite"}}>✅</div><h2 style={{fontSize:22,fontWeight:800,fontFamily:"'Sora'",marginBottom:6}}><span className="gt">Verified!</span></h2><p style={{fontSize:13,color:T.mut}}>Safe Date mode unlocked · 3x more matches</p></div>}
          </div>
          {(vStep===0||vStep===3)&&<div style={{display:"flex",gap:10,paddingBottom:16}}>
            {vStep===0&&<Btn onClick={()=>setScreen("plan")} gradient={T.card} style={{flex:1,boxShadow:"none",border:`1px solid ${T.brd}`}}>Skip</Btn>}
            <Btn onClick={()=>{if(vStep===3)setScreen("plan");else setVStep(1);}} style={{flex:2}}>{vStep===3?"Choose Plan →":"Upload ID"}</Btn>
          </div>}
        </div>
      )}

      {/* ══════════════════ BILLING ══════════════════ */}
      {screen === "plan" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,padding:24,overflowY:"auto"}}>
          <div style={{textAlign:"center",marginTop:16,marginBottom:24}}><h2 style={{fontSize:24,fontWeight:800,fontFamily:"'Sora'",marginBottom:4}}>Choose Your <span className="gt">Plan</span></h2><p style={{fontSize:13,color:T.mut}}>Unlock Auto-Mate's full power</p></div>
          {[{tier:"Free",price:"$0",per:"/forever",badge:null,feats:["5 matches/day","Basic chat","Standard profiles"],grad:T.card2},{tier:"Premium",price:"$14.99",per:"/mo",badge:"POPULAR",feats:["Unlimited matches","AI Icebreakers","See who liked you","Read receipts","AI Profile Writer"],grad:T.g2},{tier:"Elite",price:"$29.99",per:"/mo",badge:"BEST VALUE",feats:["Everything in Premium","AI Genie Matchmaker","Soulmate Picks","Safe Date mode","Video calls","Profile boost 5x"],grad:T.gG}].map((p,i) => (
            <GlassCard key={p.tier} className="c3 bp" onClick={() => setPlan(p.tier)} style={{padding:0,overflow:"hidden",cursor:"pointer",marginBottom:12,animation:`fadeInUp 0.4s ease ${i*0.1}s both`,border:plan===p.tier?`2px solid ${T.acc}`:`1px solid ${T.brd}`,boxShadow:plan===p.tier?"0 8px 36px rgba(255,60,172,0.2)":"none",...bp}}>
              {p.badge&&<div style={{padding:"4px 0",textAlign:"center",background:p.grad,fontSize:10,fontWeight:800,color:"white",letterSpacing:1.5}}>{p.badge}</div>}
              <div style={{padding:"14px 16px"}}><div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:16,fontWeight:800}}>{p.tier}</span><div><span style={{fontSize:24,fontWeight:900}}>{p.price}</span><span style={{fontSize:11,color:T.mut}}>{p.per}</span></div></div>{p.feats.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}><span style={{fontSize:10,color:T.acc}}>✓</span><span style={{fontSize:12,color:T.soft}}>{f}</span></div>)}</div>
            </GlassCard>
          ))}
          <GlassCard style={{padding:12,display:"flex",alignItems:"center",gap:8,marginTop:4}}><span>🔐</span><p style={{fontSize:11,color:T.mut}}>Payments via Stripe. PCI-DSS compliant. Cancel anytime.</p></GlassCard>
          <div style={{padding:"16px 0 8px"}}><Btn onClick={() => { setScreen("app"); setToast(`Welcome to Auto-Mate${plan?` ${plan}`:""}! 🎉`); }} style={{width:"100%"}}>{plan ? `Start with ${plan}` : "Continue Free"}</Btn></div>
        </div>
      )}

      {/* ══════════════════ APP: DISCOVER ══════════════════ */}
      {screen === "app" && appView === "discover" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
          <div style={{padding:"16px 18px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <h1 style={{fontSize:22,fontWeight:900,fontFamily:"'Sora'"}}><span className="gt">Auto-Mate</span></h1>
            <div style={{display:"flex",gap:6}}>
              <button className="bp" onClick={() => setShowGenie(true)} style={{width:36,height:36,borderRadius:14,...gc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer",animation:"genieGlow 3s ease infinite",...bp}}>🧞</button>
              <button className="bp" onClick={() => setSafety(true)} style={{width:36,height:36,borderRadius:14,...gc,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,cursor:"pointer",...bp}}>🛡️</button>
            </div>
          </div>
          <div style={{display:"flex",gap:5,padding:"12px 18px 8px"}}>
            {[{k:"discover",l:"Discover",i:"🔥"},{k:"saved",l:"Saved",i:"🔖",c:saved.size},{k:"matches",l:"Matches",i:"💕",c:liked.size}].map(t => (
              <button key={t.k} className="bp" onClick={() => setTab(t.k)} style={{padding:"7px 12px",borderRadius:26,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4,background:tab===t.k?T.g1:T.card2,color:tab===t.k?"white":T.soft,boxShadow:tab===t.k?"0 4px 14px rgba(255,60,172,0.3)":"none",...bp}}>
                {t.i} {t.l}{t.c>0&&<span style={{fontSize:9,fontWeight:700,background:tab===t.k?"rgba(255,255,255,0.2)":"rgba(255,60,172,0.12)",color:tab===t.k?"white":T.acc,padding:"1px 5px",borderRadius:8}}>{t.c}</span>}
              </button>
            ))}
          </div>
          <div style={{padding:"0 18px 8px"}}><div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",fontSize:13,opacity:0.4}}>🔍</span><input className="ig" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..." style={{width:"100%",padding:"10px 14px 10px 36px",borderRadius:14,border:`1px solid ${T.brd}`,background:T.card,color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none"}}/></div></div>

          <div style={{flex:1,overflowY:"auto",padding:"0 18px 88px"}}>
            {tab==="discover"&&visibleProfiles.map((p,i) => (
              <GlassCard key={p.id} className="c3" style={{marginBottom:14,overflow:"hidden",padding:0,animation:`fadeInUp 0.4s ease ${i*0.08}s both`}}>
                <div style={{position:"relative",cursor:"pointer"}} onClick={() => setProfModal(p)}>
                  <img src={p.photo} alt="" style={{width:"100%",height:200,objectFit:"cover"}} />
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"40px 14px 10px",background:"linear-gradient(transparent,rgba(0,0,0,0.8))"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
                      <span style={{fontSize:16,fontWeight:800,color:"white"}}>{p.name}, {p.age}</span>
                      {p.verified&&<span style={{padding:"2px 6px",borderRadius:6,fontSize:9,fontWeight:700,background:"rgba(0,200,255,0.2)",color:"#00d4ff"}}>✓</span>}
                      <span style={{marginLeft:"auto",padding:"3px 8px",borderRadius:10,background:"rgba(255,60,172,0.2)",fontSize:10,fontWeight:700,color:"#ff6eb4"}}>{p.compat}%</span>
                    </div>
                    <p style={{fontSize:11,color:"rgba(255,255,255,0.6)"}}>{p.city} · {p.job}</p>
                  </div>
                </div>
                <div style={{padding:"10px 14px",borderBottom:`1px solid ${T.brd}`}}><p style={{fontSize:11,color:T.soft,lineHeight:1.5}}>💡 <em>{p.whyMatch}</em></p></div>
                <div style={{display:"flex",gap:6,padding:10,justifyContent:"center"}}>
                  <button className="bp" onClick={() => {setPassed(s => new Set([...s,p.id]));setToast("Passed");}} style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,80,80,0.1)",border:"1px solid rgba(255,80,80,0.15)",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>✕</button>
                  <button className="bp" onClick={() => setSaved(s => {const n=new Set(s);if(n.has(p.id)){n.delete(p.id);setToast("Removed from saved");}else{n.add(p.id);setToast("Saved for later 🔖");}return n;})} style={{width:40,height:40,borderRadius:"50%",background:saved.has(p.id)?"rgba(250,180,0,0.15)":"rgba(200,180,255,0.1)",border:`1px solid ${saved.has(p.id)?"rgba(250,180,0,0.3)":"rgba(200,180,255,0.15)"}`,fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>🔖</button>
                  <button className="bp" onClick={e => {setLiked(s => new Set([...s,p.id]));burst(e);setToast(`You liked ${p.name}! 💝`);}} style={{width:48,height:48,borderRadius:"50%",background:liked.has(p.id)?T.g3:T.g1,border:"none",fontSize:17,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 6px 18px rgba(255,60,172,0.3)",...bp}}>💝</button>
                  <button className="bp" onClick={() => openChat(p)} style={{width:40,height:40,borderRadius:"50%",background:"rgba(120,75,160,0.1)",border:"1px solid rgba(120,75,160,0.15)",fontSize:15,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>💬</button>
                </div>
              </GlassCard>
            ))}
            {tab==="saved"&&(savedProfiles.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,marginBottom:8}}>🔖</div><p style={{color:T.mut}}>No saved profiles yet</p></div>:savedProfiles.map((p,i)=>(
              <GlassCard key={p.id} className="c3" onClick={() => setProfModal(p)} style={{display:"flex",alignItems:"center",gap:12,padding:12,marginBottom:8,cursor:"pointer",animation:`fadeInUp 0.3s ease ${i*0.05}s both`}}><img src={p.photo} alt="" style={{width:46,height:46,borderRadius:14,objectFit:"cover"}}/><div style={{flex:1}}><span style={{fontWeight:700,fontSize:13}}>{p.name}, {p.age}</span><p style={{fontSize:11,color:T.mut}}>{p.city}</p></div><span style={{fontSize:10,fontWeight:700,color:T.acc}}>{p.compat}%</span></GlassCard>
            )))}
            {tab==="matches"&&(matchedProfiles.length===0?<div style={{textAlign:"center",padding:"40px 0"}}><div style={{fontSize:36,marginBottom:8}}>💕</div><p style={{color:T.mut}}>Like someone to start matching!</p></div>:matchedProfiles.map((p,i)=>(
              <GlassCard key={p.id} className="c3" onClick={() => openChat(p)} style={{display:"flex",alignItems:"center",gap:12,padding:12,marginBottom:8,cursor:"pointer",animation:`fadeInUp 0.3s ease ${i*0.05}s both`}}>
                <div style={{position:"relative"}}><img src={p.photo} alt="" style={{width:46,height:46,borderRadius:14,objectFit:"cover"}}/>{p.status==="online"&&<div className="sd" style={{position:"absolute",bottom:0,right:0,width:9,height:9,borderRadius:"50%",background:"#00ff96"}}/>}</div>
                <div style={{flex:1}}><span style={{fontWeight:700,fontSize:13}}>{p.name}</span><p style={{fontSize:11,color:T.mut,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(convos[p.id]||[]).slice(-1)[0]?.text||"Start chatting!"}</p></div>
                <span style={{fontSize:10,fontWeight:700,color:T.acc}}>{p.compat}%</span>
              </GlassCard>
            )))}
          </div>

          {/* Bottom Nav */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,display:"flex",justifyContent:"space-around",padding:"8px 16px 14px",background:T.gl,backdropFilter:"blur(30px)",borderTop:`1px solid ${T.brd}`}}>
            {[{i:"🔥",l:"Discover",v:"discover"},{i:"💬",l:"Chats",v:"discover",act:()=>setTab("matches")},{i:"👤",l:"Profile",v:"profile"},{i:"⚙️",l:"Settings",v:"settings"}].map(n => (
              <button key={n.l} className="bp" onClick={() => {if(n.act)n.act();else setAppView(n.v);}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:2,...bp}}>
                <span style={{fontSize:18,filter:appView===n.v&&!n.act?"none":"grayscale(0.5) opacity(0.4)"}}>{n.i}</span>
                <span style={{fontSize:9,fontWeight:600,color:appView===n.v&&!n.act?T.acc:T.mut}}>{n.l}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════ APP: CHAT ══════════════════ */}
      {screen === "app" && appView === "chat" && match && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1}}>
          <GlassCard style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",margin:"6px 6px 0",borderRadius:18}}>
            <button className="bp" onClick={() => {setAppView("discover");setMatch(null);}} style={{width:32,height:32,borderRadius:11,background:T.card2,border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,cursor:"pointer",color:T.text,...bp}}>←</button>
            <div style={{position:"relative",cursor:"pointer"}} onClick={() => setProfModal(match)}><img src={match.photo} alt="" style={{width:36,height:36,borderRadius:12,objectFit:"cover"}}/>{match.status==="online"&&<div className="sd" style={{position:"absolute",bottom:0,right:0,width:8,height:8,borderRadius:"50%",background:"#00ff96"}}/>}</div>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontWeight:700,fontSize:13}}>{match.name}</span>{match.verified&&<span style={{fontSize:10,color:"#00d4ff"}}>✓</span>}</div><span style={{fontSize:10,color:T.mut}}>{match.compat}% compatible</span></div>
            <button className="bp" onClick={() => setShowAI(!showAI)} style={{width:30,height:30,borderRadius:10,background:showAI?"rgba(255,60,172,0.1)":T.card2,border:"none",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>🤖</button>
            <button className="bp" onClick={() => setShowDate(!showDate)} style={{width:30,height:30,borderRadius:10,background:T.card2,border:"none",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>📅</button>
            <button className="bp" onClick={() => setReportModal(match)} style={{width:30,height:30,borderRadius:10,background:T.card2,border:"none",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>⚠️</button>
          </GlassCard>

          {showAI&&<GlassCard style={{margin:"6px 8px 0",padding:10,borderRadius:16,animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,fontWeight:700}}>🤖 AI Coach</span><Btn onClick={fetchSugs} style={{padding:"4px 10px",fontSize:10,borderRadius:10}}>{aiLoad?"Thinking...":"✨ Suggest"}</Btn></div>
            {aiLoad&&<div style={{display:"flex",gap:3,justifyContent:"center",padding:4}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:T.acc,animation:`typingDot 1.2s ease ${i*0.15}s infinite`}}/>)}</div>}
            {aiSugs?.map((s,i)=><button key={i} className="bp" onClick={()=>{setMsg(s);setShowAI(false);inpRef.current?.focus();}} style={{display:"block",width:"100%",padding:"6px 10px",marginBottom:3,borderRadius:12,background:T.card2,border:`1px solid ${T.brd}`,color:T.soft,fontSize:11,textAlign:"left",cursor:"pointer",animation:`slideInRight 0.3s ease ${i*0.05}s both`,...bp}}>{s}</button>)}
            {!aiSugs&&!aiLoad&&<p style={{fontSize:11,color:T.mut,textAlign:"center"}}>Get AI-powered suggestions personalized to both profiles</p>}
          </GlassCard>}

          {showDate&&<GlassCard style={{margin:"6px 8px 0",padding:10,borderRadius:16,animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}><span style={{fontSize:11,fontWeight:700}}>📅 Date Ideas</span><button onClick={()=>setShowDate(false)} style={{background:"none",border:"none",color:T.mut,cursor:"pointer",fontSize:13}}>✕</button></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5}}>{DATE_IDEAS.map((d,i)=><button key={i} className="bp" onClick={()=>{setMsg(`Hey! Want to go on a ${d.title.toLowerCase()}? ${d.icon}`);setShowDate(false);}} style={{padding:"8px 4px",borderRadius:12,background:T.card2,border:`1px solid ${T.brd}`,cursor:"pointer",textAlign:"center",...bp}}><div style={{fontSize:18,marginBottom:2}}>{d.icon}</div><div style={{fontSize:9,fontWeight:700,color:T.text}}>{d.title}</div></button>)}</div>
          </GlassCard>}

          <div style={{flex:1,overflowY:"auto",padding:"8px 10px"}}>
            {msgs.length===0&&<div style={{textAlign:"center",padding:"28px 0",animation:"fadeIn 0.5s ease"}}><div style={{fontSize:36,marginBottom:8,animation:"float 3s ease infinite"}}>👋</div><p style={{fontSize:13,fontWeight:600,marginBottom:4}}>Say hello to {match.name}!</p><p style={{fontSize:11,color:T.mut,marginBottom:10}}>AI will generate personalized suggestions</p><Btn onClick={()=>setShowAI(true)} style={{fontSize:12,padding:"8px 18px"}}>🤖 AI Icebreakers</Btn></div>}
            {msgs.map((m,i) => (
              <div key={m.id} style={{display:"flex",justifyContent:m.sender==="me"?"flex-end":"flex-start",marginBottom:5,animation:`fadeInUp 0.25s ease ${Math.min(i*0.03,0.15)}s both`}}>
                <div onDoubleClick={()=>setShowReact(showReact===m.id?null:m.id)} style={{maxWidth:"78%",padding:"8px 12px",position:"relative",borderRadius:m.sender==="me"?"16px 16px 3px 16px":"16px 16px 16px 3px",background:m.sender==="me"?T.bM:T.bT,color:m.sender==="me"?"white":T.text,fontSize:13,lineHeight:1.4,cursor:"pointer",boxShadow:m.sender==="me"?"0 3px 12px rgba(124,58,237,0.2)":"none"}}>
                  {m.text}
                  <div style={{display:"flex",alignItems:"center",gap:3,marginTop:2,justifyContent:m.sender==="me"?"flex-end":"flex-start"}}>
                    <span style={{fontSize:9,color:m.sender==="me"?"rgba(255,255,255,0.45)":T.mut}}>{m.time}</span>
                    {m.sender==="me"&&<span style={{fontSize:9,color:"rgba(255,255,255,0.45)"}}>✓✓</span>}
                    {m.ai&&<span style={{fontSize:7,color:"rgba(255,255,255,0.3)"}}>🤖</span>}
                  </div>
                  {m.reactions?.length>0&&<div style={{position:"absolute",bottom:-8,[m.sender==="me"?"left":"right"]:6,display:"flex",gap:1,padding:"1px 4px",borderRadius:8,background:T.card,border:`1px solid ${T.brd}`,fontSize:10,animation:"bounceIn 0.3s ease"}}>{m.reactions.map((r,ri)=><span key={ri}>{r}</span>)}</div>}
                  {showReact===m.id&&<div style={{position:"absolute",bottom:-34,left:"50%",transform:"translateX(-50%)",display:"flex",gap:2,padding:"3px 6px",borderRadius:16,background:T.card,border:`1px solid ${T.brd}`,zIndex:10,animation:"popIn 0.2s ease"}}>{REACTIONS.map(e=><button key={e} onClick={ev=>{ev.stopPropagation();react(match.id,m.id,e);}} style={{background:"none",border:"none",fontSize:14,cursor:"pointer",padding:1,transition:"transform 0.1s"}} onMouseEnter={ev=>ev.target.style.transform="scale(1.3)"} onMouseLeave={ev=>ev.target.style.transform="scale(1)"}>{e}</button>)}</div>}
                </div>
              </div>
            ))}
            {typing&&<div style={{display:"flex",marginTop:4,animation:"fadeIn 0.3s ease"}}><div style={{padding:"9px 14px",borderRadius:"14px 14px 14px 3px",background:T.bT,display:"flex",gap:3}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:T.mut,animation:`typingDot 1.2s ease ${i*0.15}s infinite`}}/>)}</div></div>}
            <div ref={endRef}/>
          </div>

          {showIce&&<div style={{padding:"6px 10px",borderTop:`1px solid ${T.brd}`,background:T.gl,animation:"slideUp 0.3s ease"}}><div style={{display:"flex",gap:4,overflowX:"auto",paddingBottom:3}}>{ICEBREAKERS.map((ib,i)=><button key={i} className="bp" onClick={()=>{setMsg(ib);setShowIce(false);inpRef.current?.focus();}} style={{padding:"5px 10px",borderRadius:12,whiteSpace:"nowrap",background:T.card2,border:`1px solid ${T.brd}`,color:T.soft,fontSize:10,cursor:"pointer",flexShrink:0,...bp}}>{ib}</button>)}</div></div>}

          <div style={{padding:"6px 8px 14px",background:T.gl,backdropFilter:"blur(30px)",borderTop:`1px solid ${T.brd}`}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <button className="bp" onClick={()=>setShowIce(!showIce)} style={{width:34,height:34,borderRadius:12,border:"none",background:showIce?"rgba(255,60,172,0.1)":T.card2,fontSize:13,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>✨</button>
              <input ref={inpRef} value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." className="ig" style={{flex:1,padding:"9px 14px",borderRadius:16,border:`1px solid ${T.brd}`,background:T.card,color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none"}}/>
              <button className="bp" onClick={send} disabled={!msg.trim()} style={{width:38,height:38,borderRadius:14,border:"none",background:msg.trim()?T.g1:T.card2,fontSize:14,cursor:msg.trim()?"pointer":"default",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:msg.trim()?"0 4px 14px rgba(255,60,172,0.3)":"none",color:"white",opacity:msg.trim()?1:0.3,...bp}}>➤</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ APP: PROFILE ══════════════════ */}
      {screen === "app" && appView === "profile" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,overflowY:"auto",padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h2 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'"}}>My Profile</h2><button className="bp" onClick={()=>setAppView("discover")} style={{background:"none",border:"none",color:T.soft,fontSize:14,cursor:"pointer",...bp}}>← Back</button></div>
          <div style={{textAlign:"center",marginBottom:20}}><div style={{width:80,height:80,borderRadius:24,margin:"0 auto 10px",background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{myProfile.name?myProfile.name[0].toUpperCase():"?"}</div><p style={{fontSize:18,fontWeight:700}}>{myProfile.name||"Your Name"}</p><p style={{fontSize:12,color:T.mut}}>{myProfile.city||"City"} · {myProfile.age||"?"} · {myProfile.gender||"Gender"}</p></div>
          <FormInput label="Name" value={myProfile.name} onChange={e=>setMyProfile(p=>({...p,name:e.target.value}))}/>
          <div style={{display:"flex",gap:10}}><div style={{width:"40%"}}><FormInput label="Age" type="number" value={myProfile.age} onChange={e=>setMyProfile(p=>({...p,age:e.target.value}))}/></div><div style={{flex:1}}><FormInput label="City" value={myProfile.city} onChange={e=>setMyProfile(p=>({...p,city:e.target.value}))}/></div></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:700,color:T.soft,marginBottom:6,display:"block"}}>Bio</label><textarea value={myProfile.bio} onChange={e=>setMyProfile(p=>({...p,bio:e.target.value}))} rows={3} placeholder="Tell matches about yourself..." style={{width:"100%",padding:"12px 14px",borderRadius:16,border:`1px solid ${T.brd}`,background:T.card,color:T.text,fontSize:13,fontFamily:"'Outfit',sans-serif",outline:"none",resize:"none"}}/><button className="bp" onClick={()=>setShowBioWriter(true)} style={{marginTop:6,padding:"6px 12px",borderRadius:10,border:"none",background:T.gGenie,color:"white",fontSize:11,fontWeight:700,cursor:"pointer",...bp}}>🤖 AI Profile Writer</button></div>
          <FormInput label="Relationship Goals" value={myProfile.goals} onChange={e=>setMyProfile(p=>({...p,goals:e.target.value}))}/>
          <FormInput label="Communication Style" value={myProfile.commStyle} onChange={e=>setMyProfile(p=>({...p,commStyle:e.target.value}))}/>
          <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:700,color:T.soft,marginBottom:6,display:"block"}}>Interests</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{(myProfile.interests||[]).map(i=><span key={i} style={{padding:"4px 10px",borderRadius:10,fontSize:11,fontWeight:600,background:T.card2,border:`1px solid ${T.brd}`,color:T.soft}}>{i}</span>)}{myProfile.interests?.length===0&&<p style={{fontSize:11,color:T.mut}}>Complete the quiz to add interests</p>}</div></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:700,color:T.soft,marginBottom:6,display:"block"}}>Values</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{(myProfile.values||[]).map(v=><span key={v} style={{padding:"4px 10px",borderRadius:10,fontSize:11,fontWeight:600,background:T.card2,border:`1px solid ${T.brd}`,color:T.soft}}>{v}</span>)}</div></div>
          <div style={{marginBottom:14}}><label style={{fontSize:12,fontWeight:700,color:T.soft,marginBottom:6,display:"block"}}>Intimacy: {myProfile.intimacy}/10</label><input type="range" min={1} max={10} value={myProfile.intimacy} onChange={e=>setMyProfile(p=>({...p,intimacy:+e.target.value}))} style={{width:"100%",accentColor:T.acc}}/></div>
          <Btn onClick={()=>{setAppView("discover");setToast("Profile saved! ✅");}} style={{width:"100%",marginTop:8,marginBottom:80}}>Save Profile</Btn>
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,display:"flex",justifyContent:"space-around",padding:"8px 16px 14px",background:T.gl,backdropFilter:"blur(30px)",borderTop:`1px solid ${T.brd}`}}>{[{i:"🔥",l:"Discover",v:"discover"},{i:"💬",l:"Chats",v:"discover"},{i:"👤",l:"Profile",v:"profile"},{i:"⚙️",l:"Settings",v:"settings"}].map(n=><button key={n.l} className="bp" onClick={()=>setAppView(n.v)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:2,...bp}}><span style={{fontSize:18,filter:appView===n.v?"none":"grayscale(0.5) opacity(0.4)"}}>{n.i}</span><span style={{fontSize:9,fontWeight:600,color:appView===n.v?T.acc:T.mut}}>{n.l}</span></button>)}</div>
        </div>
      )}

      {/* ══════════════════ APP: SETTINGS ══════════════════ */}
      {screen === "app" && appView === "settings" && (
        <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative",zIndex:1,overflowY:"auto",padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}><h2 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'"}}>Settings</h2><button className="bp" onClick={()=>setAppView("discover")} style={{background:"none",border:"none",color:T.soft,fontSize:14,cursor:"pointer",...bp}}>← Back</button></div>
          {[{icon:"👤",title:"Edit Profile",action:()=>setAppView("profile")},{icon:"🔒",title:"Privacy & Safety",action:()=>setSafety(true)},{icon:"🔔",title:"Notifications",action:()=>setToast("Notifications settings coming soon")},{icon:"💳",title:"Subscription",desc:plan||"Free",action:()=>setScreen("plan")},{icon:"🪪",title:"Verification",desc:"Verified ✓",action:()=>setToast("You're verified!")},{icon:"🚫",title:`Blocked Users (${blocked.size})`,action:()=>setToast(`${blocked.size} users blocked`)},{icon:"📊",title:"Retake Quiz",action:()=>{setQuizStep(0);setScreen("quiz");}},{icon:"📧",title:"Support",action:()=>setToast("support@automatedate.app")},{icon:"🚪",title:"Log Out",action:logout,danger:true}].map((item,i)=>(
            <GlassCard key={i} className="bp" onClick={item.action} style={{display:"flex",alignItems:"center",gap:12,padding:14,marginBottom:8,cursor:"pointer",animation:`fadeInUp 0.3s ease ${i*0.04}s both`,...bp}}>
              <span style={{fontSize:18}}>{item.icon}</span><div style={{flex:1}}><p style={{fontSize:13,fontWeight:600,color:item.danger?"#ff5555":T.text}}>{item.title}</p>{item.desc&&<p style={{fontSize:11,color:T.mut}}>{item.desc}</p>}</div>{item.action&&<span style={{color:T.mut,fontSize:13}}>›</span>}
            </GlassCard>
          ))}
          <div style={{height:80}}/>
          <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,display:"flex",justifyContent:"space-around",padding:"8px 16px 14px",background:T.gl,backdropFilter:"blur(30px)",borderTop:`1px solid ${T.brd}`}}>{[{i:"🔥",l:"Discover",v:"discover"},{i:"💬",l:"Chats",v:"discover"},{i:"👤",l:"Profile",v:"profile"},{i:"⚙️",l:"Settings",v:"settings"}].map(n=><button key={n.l} className="bp" onClick={()=>setAppView(n.v)} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,background:"none",border:"none",cursor:"pointer",padding:2,...bp}}><span style={{fontSize:18,filter:appView===n.v?"none":"grayscale(0.5) opacity(0.4)"}}>{n.i}</span><span style={{fontSize:9,fontWeight:600,color:appView===n.v?T.acc:T.mut}}>{n.l}</span></button>)}</div>
        </div>
      )}

      {/* ══════════════════ AI GENIE PANEL ══════════════════ */}
      {showGenie && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setShowGenie(false)}>
          <div onClick={e=>e.stopPropagation()} style={{...gc,width:"100%",maxWidth:440,maxHeight:"85vh",borderRadius:"24px 24px 0 0",overflow:"auto",animation:"slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)",padding:20}}>
            <div style={{textAlign:"center",marginBottom:16}}><div style={{fontSize:44,marginBottom:6,animation:"genieGlow 3s ease infinite, float 3s ease infinite"}}>🧞</div><h2 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'"}}><span style={{background:T.gGenie,backgroundSize:"200% 200%",animation:"gradientShift 4s ease infinite",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>AI Genie</span></h2><p style={{fontSize:12,color:T.mut}}>Your personal AI matchmaker</p></div>
            <div style={{display:"flex",gap:4,marginBottom:16}}>{[{k:"soulmate",l:"Soulmate",i:"💫"},{k:"surprise",l:"Surprise",i:"🎲"},{k:"suggest",l:"Suggest",i:"💡"}].map(t=><button key={t.k} className="bp" onClick={()=>setGenieTab(t.k)} style={{flex:1,padding:"8px 0",borderRadius:14,border:"none",fontSize:11,fontWeight:600,cursor:"pointer",background:genieTab===t.k?T.gGenie:T.card2,color:genieTab===t.k?"white":T.soft,...bp}}>{t.i} {t.l}</button>)}</div>

            {genieTab==="soulmate"&&soulmateProfile&&(
              <div style={{animation:"fadeInUp 0.4s ease"}}>
                <GlassCard style={{padding:0,overflow:"hidden",marginBottom:12}}>
                  <div style={{padding:"8px 12px",background:T.gGenie,display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:14}}>💫</span><span style={{fontSize:11,fontWeight:700,color:"white"}}>AI Genie believes this could be a special connection</span></div>
                  <div style={{display:"flex",gap:12,padding:14,alignItems:"center"}}><img src={soulmateProfile.photo} alt="" style={{width:64,height:64,borderRadius:18,objectFit:"cover"}}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}><span style={{fontSize:16,fontWeight:800}}>{soulmateProfile.name}, {soulmateProfile.age}</span>{soulmateProfile.verified&&<span style={{fontSize:10,color:"#00d4ff"}}>✓</span>}</div><p style={{fontSize:11,color:T.mut,marginBottom:4}}>{soulmateProfile.city} · {soulmateProfile.job}</p><p style={{fontSize:20,fontWeight:900}}><span className="gt">{soulmateProfile.compat}%</span></p></div></div>
                  <div style={{padding:"0 14px 12px"}}><p style={{fontSize:11,color:T.soft,lineHeight:1.5}}>💡 {soulmateProfile.whyMatch}</p></div>
                </GlassCard>
                <div style={{display:"flex",gap:8}}><Btn onClick={()=>setProfModal(soulmateProfile)} gradient={T.gGenie} style={{flex:1,fontSize:13}}>View Profile</Btn><Btn onClick={e=>{setLiked(s=>new Set([...s,soulmateProfile.id]));burst(e);setShowGenie(false);openChat(soulmateProfile);setToast("Matched with your Soulmate Pick! 💫");}} style={{flex:1,fontSize:13}}>💝 Like</Btn></div>
              </div>
            )}

            {genieTab==="surprise"&&surpriseProfile&&(
              <div style={{animation:"fadeInUp 0.4s ease",textAlign:"center"}}>
                <p style={{fontSize:13,color:T.soft,marginBottom:16}}>A unique match outside your typical algorithm</p>
                <GlassCard style={{padding:0,overflow:"hidden",marginBottom:12}}><img src={surpriseProfile.photo} alt="" style={{width:"100%",height:180,objectFit:"cover"}}/><div style={{padding:14}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:4}}><span style={{fontSize:18,fontWeight:800}}>{surpriseProfile.name}, {surpriseProfile.age}</span><span style={{padding:"2px 8px",borderRadius:8,fontSize:10,fontWeight:700,background:"rgba(168,85,247,0.15)",color:"#a855f7"}}>{surpriseProfile.compat}%</span></div><p style={{fontSize:12,color:T.mut,marginBottom:6}}>{surpriseProfile.bio}</p><p style={{fontSize:11,color:T.soft}}>💡 {surpriseProfile.whyMatch}</p></div></GlassCard>
                <div style={{display:"flex",gap:8}}><Btn onClick={()=>setShowGenie(false)} gradient={T.card2} style={{flex:1,fontSize:13,boxShadow:"none",border:`1px solid ${T.brd}`,color:T.soft}}>Skip</Btn><Btn onClick={e=>{setLiked(s=>new Set([...s,surpriseProfile.id]));burst(e);setShowGenie(false);openChat(surpriseProfile);}} gradient={T.gGenie} style={{flex:1,fontSize:13}}>💝 Like</Btn></div>
              </div>
            )}

            {genieTab==="suggest"&&(
              <div style={{animation:"fadeInUp 0.4s ease"}}>
                <p style={{fontSize:12,fontWeight:700,marginBottom:8}}>💬 Conversation Starters</p>
                {ICEBREAKERS.slice(0,3).map((ib,i)=><GlassCard key={i} className="bp" onClick={()=>{setMsg(ib);setShowGenie(false);setToast("Copied to chat!");}} style={{padding:"10px 14px",marginBottom:6,fontSize:12,color:T.soft,cursor:"pointer",...bp}}>{ib}</GlassCard>)}
                <p style={{fontSize:12,fontWeight:700,marginTop:14,marginBottom:8}}>❓ Profile Questions</p>
                {["What do your friends always say about you?","Describe your perfect Sunday morning","What's a value you'd never compromise?"].map((q,i)=><GlassCard key={i} style={{padding:"10px 14px",marginBottom:6,fontSize:12,color:T.soft}}>{q}</GlassCard>)}
                <p style={{fontSize:12,fontWeight:700,marginTop:14,marginBottom:8}}>📅 AI Date Ideas</p>
                <Btn onClick={fetchGenieDates} gradient={T.gGenie} style={{width:"100%",fontSize:12,marginBottom:8}}>{genieLoading?"Generating...":"✨ Generate Date Ideas"}</Btn>
                {genieDates?.map((d,i)=><GlassCard key={i} style={{padding:"10px 14px",marginBottom:6,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>{d.icon}</span><div><p style={{fontSize:12,fontWeight:700}}>{d.title}</p><p style={{fontSize:11,color:T.mut}}>{d.desc}</p></div></GlassCard>)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════ PROFILE MODAL ══════════════════ */}
      {profModal && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setProfModal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{...gc,width:"100%",maxWidth:440,maxHeight:"82vh",borderRadius:"24px 24px 0 0",overflow:"auto",animation:"slideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{position:"relative"}}><img src={profModal.photo} alt="" style={{width:"100%",height:240,objectFit:"cover"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"44px 18px 12px",background:"linear-gradient(transparent,rgba(0,0,0,0.85))"}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:20,fontWeight:800,color:"white"}}>{profModal.name}, {profModal.age}</span>{profModal.verified&&<span style={{padding:"2px 7px",borderRadius:6,fontSize:9,fontWeight:700,background:"rgba(0,200,255,0.2)",color:"#00d4ff"}}>✓</span>}</div><p style={{fontSize:11,color:"rgba(255,255,255,0.6)",marginTop:2}}>{profModal.job} · {profModal.city}</p></div><button className="bp" onClick={()=>setProfModal(null)} style={{position:"absolute",top:12,right:12,width:30,height:30,borderRadius:10,background:"rgba(0,0,0,0.4)",border:"none",color:"white",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>✕</button></div>
            <div style={{padding:16}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14,padding:12,borderRadius:14,background:"linear-gradient(135deg,rgba(255,60,172,0.06),rgba(120,75,160,0.06))",border:`1px solid ${T.brd}`}}><div style={{width:44,height:44,borderRadius:14,background:T.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:900,color:"white"}}>{profModal.compat}%</div><div><p style={{fontSize:12,fontWeight:700}}>Compatibility Score</p><p style={{fontSize:11,color:T.mut}}>AI-calculated from your quiz answers</p></div></div>
              <p style={{fontSize:11,color:T.soft,lineHeight:1.5,marginBottom:12,fontStyle:"italic"}}>💡 {profModal.whyMatch}</p>
              <p style={{fontSize:13,lineHeight:1.6,marginBottom:12,color:T.soft}}>{profModal.bio}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>{[{l:"Goals",v:profModal.goals},{l:"Love Language",v:profModal.commStyle},{l:"Lifestyle",v:profModal.lifestyle},{l:"Intimacy",v:`${profModal.intimacy}/10`}].map(d=><div key={d.l} style={{padding:"8px 10px",borderRadius:12,background:T.card2,border:`1px solid ${T.brd}`}}><p style={{fontSize:10,color:T.mut,fontWeight:700}}>{d.l}</p><p style={{fontSize:12,fontWeight:600}}>{d.v}</p></div>)}</div>
              <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>{profModal.interests.map(i=><span key={i} style={{padding:"4px 10px",borderRadius:10,fontSize:11,fontWeight:600,background:T.card2,border:`1px solid ${T.brd}`,color:T.soft}}>{i}</span>)}</div>
              <div style={{display:"flex",gap:8}}><Btn onClick={()=>{setProfModal(null);openChat(profModal);}} style={{flex:1,fontSize:13}}>💬 Message</Btn><button className="bp" onClick={()=>{setReportModal(profModal);setProfModal(null);}} style={{width:44,height:44,borderRadius:14,border:`1px solid ${T.brd}`,background:T.card2,fontSize:16,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",...bp}}>⚠️</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ REPORT MODAL ══════════════════ */}
      {reportModal && (
        <div style={{position:"fixed",inset:0,zIndex:110,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setReportModal(null)}>
          <GlassCard onClick={e=>e.stopPropagation()} style={{width:"88%",maxWidth:360,padding:20,animation:"popIn 0.3s ease"}}>
            <h3 style={{fontSize:16,fontWeight:800,fontFamily:"'Sora'",marginBottom:4}}>Report or Block</h3>
            <p style={{fontSize:12,color:T.mut,marginBottom:16}}>{reportModal.name}</p>
            {["Harassment","Fake profile","Inappropriate content","Spam","Other"].map(r=>(
              <button key={r} className="bp" onClick={()=>setReportReason(r)} style={{display:"block",width:"100%",padding:"10px 14px",marginBottom:6,borderRadius:12,border:reportReason===r?"none":`1px solid ${T.brd}`,background:reportReason===r?T.g2:T.card,color:reportReason===r?"white":T.soft,fontSize:12,fontWeight:600,cursor:"pointer",textAlign:"left",...bp}}>{r}</button>
            ))}
            <div style={{display:"flex",gap:8,marginTop:12}}>
              <Btn onClick={()=>{setReportReason("");setReportModal(null);}} gradient={T.card2} style={{flex:1,fontSize:12,boxShadow:"none",border:`1px solid ${T.brd}`,color:T.soft}}>Cancel</Btn>
              <Btn onClick={()=>{setReportReason("");setReportModal(null);setToast("Report submitted. Thank you.");}} disabled={!reportReason} style={{flex:1,fontSize:12}}>Submit</Btn>
            </div>
            <button className="bp" onClick={()=>{setBlocked(s=>new Set([...s,reportModal.id]));setReportModal(null);setToast(`${reportModal.name} blocked`);if(match?.id===reportModal.id){setMatch(null);setAppView("discover");}}} style={{width:"100%",padding:"10px 0",marginTop:10,borderRadius:14,border:"1px solid rgba(255,80,80,0.2)",background:"rgba(255,80,80,0.08)",color:"#ff5555",fontSize:12,fontWeight:700,cursor:"pointer",...bp}}>🚫 Block {reportModal.name}</button>
          </GlassCard>
        </div>
      )}

      {/* ══════════════════ SAFETY MODAL ══════════════════ */}
      {safety && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setSafety(false)}>
          <GlassCard onClick={e=>e.stopPropagation()} style={{width:"88%",maxWidth:340,padding:20,animation:"popIn 0.3s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:32,marginBottom:6}}>🛡️</div><h2 style={{fontSize:17,fontWeight:800,fontFamily:"'Sora'"}}>Safe Date Mode</h2></div>
            {SAFETY_TIPS.map((t,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}><span style={{fontSize:11,color:"#00c864",flexShrink:0}}>✓</span><span style={{fontSize:12,color:T.soft,lineHeight:1.5}}>{t}</span></div>)}
            <Btn onClick={()=>setSafety(false)} style={{width:"100%",marginTop:6,fontSize:13}}>Got it! 💪</Btn>
          </GlassCard>
        </div>
      )}

      {/* ══════════════════ AI BIO WRITER ══════════════════ */}
      {showBioWriter && (
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(8px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setShowBioWriter(false)}>
          <GlassCard onClick={e=>e.stopPropagation()} style={{width:"90%",maxWidth:380,padding:20,animation:"popIn 0.3s ease"}}>
            <div style={{textAlign:"center",marginBottom:14}}><div style={{fontSize:32,marginBottom:6}}>✍️</div><h2 style={{fontSize:17,fontWeight:800,fontFamily:"'Sora'"}}>AI Profile Writer</h2><p style={{fontSize:12,color:T.mut}}>Generate a bio powered by Claude AI</p></div>
            <p style={{fontSize:11,fontWeight:700,color:T.soft,marginBottom:6}}>Tone:</p>
            <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>{["confident","friendly","witty","authentic","adventurous"].map(s=><button key={s} className="bp" onClick={()=>setBioStyle(s)} style={{padding:"6px 12px",borderRadius:20,border:bioStyle===s?"none":`1px solid ${T.brd}`,background:bioStyle===s?T.gGenie:T.card,color:bioStyle===s?"white":T.soft,fontSize:11,fontWeight:600,cursor:"pointer",textTransform:"capitalize",...bp}}>{s}</button>)}</div>
            <Btn onClick={generateBio} disabled={bioLoading} gradient={T.gGenie} style={{width:"100%",fontSize:13,marginBottom:12}}>{bioLoading?"✨ Claude is writing...":"✨ Generate Bio"}</Btn>
            {bioResult&&<div style={{animation:"fadeInUp 0.4s ease"}}><GlassCard style={{padding:12,marginBottom:10}}><p style={{fontSize:13,color:T.soft,lineHeight:1.6}}>{bioResult}</p></GlassCard><Btn onClick={()=>{setMyProfile(p=>({...p,bio:bioResult}));setShowBioWriter(false);setBioResult("");setToast("Bio updated! ✨");}} style={{width:"100%",fontSize:13}}>Use This Bio</Btn></div>}
          </GlassCard>
        </div>
      )}
    </div>
  );
}
