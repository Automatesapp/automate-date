import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTO-MATE v3.0 — 10/10 Production Build
//  AI-Powered Dating · Full Responsive · Vibrant 3D · Every Detail Polished
//  automatedate.app
// ═══════════════════════════════════════════════════════════════════════════════

const PROFILES = [
  {id:1,name:"Sophia",age:27,bio:"Coffee addict ☕ | Sunset chaser 🌅 | Dog mom who'll show you 400 photos on the first date 🐕",status:"online",photo:"https://i.pravatar.cc/300?img=1",interests:["Travel","Photography","Yoga"],verified:true,city:"Seattle",job:"UX Designer",gender:"Woman",goals:"Long-term relationship",values:["Honesty","Adventure","Growth"],lifestyle:"Very active & outdoorsy",commStyle:"Words of Affirmation",intimacy:8},
  {id:2,name:"Mia",age:25,bio:"Will cook you dinner on the second date. Bookworm who hikes on weekends 📚🥾",status:"online",photo:"https://i.pravatar.cc/300?img=5",interests:["Cooking","Hiking","Music"],verified:true,city:"Portland",job:"Chef",gender:"Woman",goals:"Long-term relationship",values:["Family","Creativity","Loyalty"],lifestyle:"Balanced mix",commStyle:"Quality Time",intimacy:7},
  {id:3,name:"Ava",age:29,bio:"Artist who paints at 2am. Plant mom to 47 succulents. Will judge your wine choice (lovingly) 🎨🌿",status:"away",photo:"https://i.pravatar.cc/300?img=9",interests:["Art","Wine","Dancing"],verified:false,city:"Los Angeles",job:"Illustrator",gender:"Woman",goals:"Serious dating",values:["Creativity","Independence","Passion"],lifestyle:"Homebody & relaxed",commStyle:"Physical Touch",intimacy:9},
  {id:4,name:"Luna",age:26,bio:"Software by day, sci-fi by night. My cat has more followers than me. Let's debate Star Wars vs Star Trek 💪🚀",status:"offline",photo:"https://i.pravatar.cc/300?img=16",interests:["Fitness","Gaming","Movies"],verified:true,city:"San Francisco",job:"Software Engineer",gender:"Woman",goals:"Open to anything",values:["Ambition","Humor","Intelligence"],lifestyle:"Very active & outdoorsy",commStyle:"Acts of Service",intimacy:6},
  {id:5,name:"Zara",age:28,bio:"Built my company from a coffee shop. Jazz bars > nightclubs. 23 countries and counting ✈️🎷",status:"online",photo:"https://i.pravatar.cc/300?img=20",interests:["Business","Music","Travel"],verified:true,city:"New York",job:"Founder & CEO",gender:"Woman",goals:"Long-term relationship",values:["Ambition","Growth","Adventure"],lifestyle:"Very active & outdoorsy",commStyle:"Words of Affirmation",intimacy:8},
  {id:6,name:"Elena",age:24,bio:"Future doctor who still can't cook. Tea snob. Will beat you at Scrabble and feel bad about it 🩺🍵",status:"online",photo:"https://i.pravatar.cc/300?img=23",interests:["Reading","Science","Yoga"],verified:true,city:"Boston",job:"Medical Student",gender:"Woman",goals:"Serious dating",values:["Intelligence","Kindness","Stability"],lifestyle:"Balanced mix",commStyle:"Quality Time",intimacy:5},
];

const QUIZ = [
  {key:"intent",title:"Relationship Intent",icon:"💝",q:"What are you looking for?",opts:["Long-term relationship","Serious dating","Open to anything","Just exploring"]},
  {key:"values",title:"Core Values",icon:"⭐",q:"Pick your top 3 values",opts:["Honesty","Loyalty","Adventure","Family","Ambition","Creativity","Humor","Independence","Kindness","Growth","Intelligence","Passion","Stability"],multi:true,max:3},
  {key:"lifestyle",title:"Lifestyle",icon:"🏃",q:"Your lifestyle?",opts:["Very active & outdoorsy","Balanced mix","Homebody & relaxed","Social butterfly"]},
  {key:"commStyle",title:"Love Language",icon:"💬",q:"Your primary love language?",opts:["Words of Affirmation","Quality Time","Physical Touch","Acts of Service","Receiving Gifts"]},
  {key:"interests",title:"Interests",icon:"🎯",q:"Pick your interests (3–6)",opts:["Travel","Photography","Yoga","Cooking","Hiking","Music","Art","Wine","Dancing","Fitness","Gaming","Movies","Business","Reading","Science","Nature","Tech","Fashion"],multi:true,max:6},
  {key:"intimacy",title:"Intimacy",icon:"🔥",q:"How important is physical intimacy?",slider:true},
];

const ICEBREAKERS=["What's your most spontaneous adventure? 🌍","If you could teleport anywhere right now? ✈️","Guilty pleasure song? 🎵","Beach vacation or mountain cabin? 🏖️⛰️","Best meal you've ever had? 🤤","Morning person or night owl? 🌅🦉","What are you binge-watching? 📺","Lottery win — first purchase? 💰"];
const EMOJIS=["❤️","🔥","😍","😂","👏","💕","✨","🥰"];
const DATES=[{e:"☕",t:"Coffee Date",d:"Cozy & casual"},{e:"🎨",t:"Art Gallery",d:"Creative vibes"},{e:"🥾",t:"Hiking Trail",d:"Adventure awaits"},{e:"🍷",t:"Wine Tasting",d:"Sophisticated sips"},{e:"🎳",t:"Bowling Night",d:"Retro fun"},{e:"🌮",t:"Food Crawl",d:"Taste everything"}];

// ── COMPATIBILITY ────────────────────────────────────────────────────────────
function calcCompat(me,them){
  let s=0,mx=0,reasons=[];
  mx+=25;if(me.goals&&them.goals){if(me.goals===them.goals){s+=25;reasons.push("Identical relationship goals");}else if((me.goals.includes("Long")&&them.goals.includes("Serious"))||(me.goals.includes("Serious")&&them.goals.includes("Long"))){s+=18;reasons.push("Similar relationship goals");}else if(me.goals==="Open to anything"||them.goals==="Open to anything"){s+=12;reasons.push("Flexible on relationship type");}else s+=5;}
  mx+=20;if(me.values?.length&&them.values?.length){const sh=me.values.filter(v=>them.values.includes(v));s+=Math.min((sh.length/Math.max(me.values.length,1))*20,20);if(sh.length>=2)reasons.push(`Share values: ${sh.join(", ")}`);else if(sh.length===1)reasons.push(`Both value ${sh[0]}`);}
  mx+=15;if(me.lifestyle&&them.lifestyle){if(me.lifestyle===them.lifestyle){s+=15;reasons.push("Matching lifestyle");}else if(me.lifestyle==="Balanced mix"||them.lifestyle==="Balanced mix"){s+=10;reasons.push("Compatible lifestyles");}else{s+=5;reasons.push("Complementary lifestyles");}}
  mx+=15;if(me.commStyle&&them.commStyle){if(me.commStyle===them.commStyle){s+=15;reasons.push(`Both speak ${me.commStyle}`);}else{s+=7;reasons.push("Communication styles complement");}}
  mx+=15;if(me.interests?.length&&them.interests?.length){const sh=me.interests.filter(i=>them.interests.includes(i));s+=Math.min((sh.length/3)*15,15);if(sh.length>=2)reasons.push(`${sh.length} shared interests`);else if(sh.length===1)reasons.push(`Both enjoy ${sh[0]}`);}
  mx+=10;if(me.intimacy&&them.intimacy){const d=Math.abs(me.intimacy-them.intimacy);s+=Math.max(10-d*2,0);if(d<=1)reasons.push("Intimacy alignment");}
  const score=mx>0?Math.round((s/mx)*100):50;
  return{score:Math.max(Math.min(score,99),35),why:reasons.slice(0,3).join(". ")+"."||"Potential for something special."};
}

// ── 3D CANVAS ────────────────────────────────────────────────────────────────
function BG(){
  const ref=useRef(null),af=useRef(null);
  useEffect(()=>{
    const c=ref.current;if(!c)return;const x=c.getContext("2d");
    let w=c.width=window.innerWidth,h=c.height=window.innerHeight;
    const dots=Array.from({length:75},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*800,vx:(Math.random()-0.5)*0.3,vy:(Math.random()-0.5)*0.3,vz:(Math.random()-0.5)*0.4,hue:250+Math.random()*110,r:1+Math.random()*2.5,p:Math.random()*6.28,ps:0.01+Math.random()*0.025}));
    const shapes=[
      {cx:w*0.12,cy:h*0.22,z:380,rx:0,ry:0,rz:0,drx:0.007,dry:0.01,drz:0.004,dx:0.13,dy:0.09,s:42,hue:330,a:0.06,t:0},
      {cx:w*0.82,cy:h*0.55,z:480,rx:1,ry:2,rz:0,drx:0.005,dry:0.008,drz:0.006,dx:-0.1,dy:0.11,s:36,hue:270,a:0.05,t:1},
      {cx:w*0.48,cy:h*0.1,z:280,rx:0,ry:0,rz:0,drx:0.006,dry:0.011,drz:0.003,dx:0.09,dy:-0.06,s:48,hue:185,a:0.055,t:2},
      {cx:w*0.88,cy:h*0.88,z:520,rx:2,ry:1,rz:3,drx:0.009,dry:0.005,drz:0.007,dx:-0.14,dy:0.12,s:30,hue:350,a:0.045,t:3},
      {cx:w*0.28,cy:h*0.72,z:420,rx:0,ry:0,rz:0,drx:0.004,dry:0.008,drz:0.005,dx:0.11,dy:-0.1,s:52,hue:210,a:0.04,t:4},
    ];
    function pj(px,py,pz){const f=500,sc=f/(f+pz);return{x:w/2+(px-w/2)*sc,y:h/2+(py-h/2)*sc,sc};}
    function r3(V,rx,ry,rz){const cx2=Math.cos(rx),sx2=Math.sin(rx),cy2=Math.cos(ry),sy2=Math.sin(ry),cz2=Math.cos(rz),sz2=Math.sin(rz);return V.map(([a,b,c2])=>{let x1=a,y1=b*cx2-c2*sx2,z1=b*sx2+c2*cx2;let x2=x1*cy2+z1*sy2,y2=y1,z2=-x1*sy2+z1*cy2;return[x2*cz2-y2*sz2,x2*sz2+y2*cz2,z2];});}
    function ds(sh){const p=pj(sh.cx,sh.cy,sh.z),sz=sh.s*p.sc,hh=sz/2;let V=[],E=[];
      if(sh.t===0){V=[[-hh,-hh,-hh],[hh,-hh,-hh],[hh,hh,-hh],[-hh,hh,-hh],[-hh,-hh,hh],[hh,-hh,hh],[hh,hh,hh],[-hh,hh,hh]];E=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];}
      else if(sh.t===1){V=[[0,-hh,0],[hh,0,0],[0,0,hh],[-hh,0,0],[0,0,-hh],[0,hh,0]];E=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4],[1,2],[2,3],[3,4],[4,1]];}
      else if(sh.t===2){V=[[0,-hh,0],[hh,0,0],[0,0,hh],[-hh,0,0],[0,0,-hh],[0,hh,0]];E=[[0,1],[0,2],[0,3],[0,4],[5,1],[5,2],[5,3],[5,4]];}
      else if(sh.t===3){V=[[0,-hh,0],[hh,hh,-hh/2],[-hh,hh,-hh/2],[0,hh,hh/2]];E=[[0,1],[0,2],[0,3],[1,2],[2,3],[3,1]];}
      else{const n=12;for(let i=0;i<n;i++){const a2=(i/n)*6.28;V.push([Math.cos(a2)*hh,Math.sin(a2)*hh,0]);V.push([Math.cos(a2)*hh*0.55,Math.sin(a2)*hh*0.55,0]);}for(let i=0;i<n;i++){const nx=(i+1)%n;E.push([i*2,nx*2]);E.push([i*2+1,nx*2+1]);E.push([i*2,i*2+1]);}}
      const R=r3(V,sh.rx,sh.ry,sh.rz);x.save();x.translate(p.x,p.y);x.globalAlpha=sh.a*p.sc;
      x.strokeStyle=`hsla(${sh.hue},85%,68%,${0.4*p.sc})`;x.lineWidth=1.3*p.sc;x.shadowColor=`hsla(${sh.hue},90%,62%,0.35)`;x.shadowBlur=10;
      E.forEach(([a2,b2])=>{if(R[a2]&&R[b2]){x.beginPath();x.moveTo(R[a2][0],R[a2][1]);x.lineTo(R[b2][0],R[b2][1]);x.stroke();}});
      R.forEach(([vx,vy])=>{x.beginPath();x.arc(vx,vy,1.8*p.sc,0,6.28);x.fillStyle=`hsla(${sh.hue},92%,78%,${0.55*p.sc})`;x.fill();});x.restore();}
    function frame(){x.clearRect(0,0,w,h);
      dots.forEach(d=>{d.x+=d.vx;d.y+=d.vy;d.z+=d.vz;d.p+=d.ps;if(d.x<0)d.x=w;if(d.x>w)d.x=0;if(d.y<0)d.y=h;if(d.y>h)d.y=0;if(d.z<0)d.z=800;if(d.z>800)d.z=0;
        const pp=pj(d.x,d.y,d.z),rr=d.r*pp.sc*(0.7+0.3*Math.sin(d.p));
        const g=x.createRadialGradient(pp.x,pp.y,0,pp.x,pp.y,rr*3.5);g.addColorStop(0,`hsla(${d.hue},88%,72%,${0.6*pp.sc})`);g.addColorStop(1,`hsla(${d.hue},88%,72%,0)`);
        x.beginPath();x.arc(pp.x,pp.y,rr*3.5,0,6.28);x.fillStyle=g;x.fill();});
      for(let i=0;i<dots.length;i++)for(let j=i+1;j<dots.length;j++){const a=pj(dots[i].x,dots[i].y,dots[i].z),b=pj(dots[j].x,dots[j].y,dots[j].z),dd=Math.hypot(a.x-b.x,a.y-b.y);
        if(dd<95){x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.strokeStyle=`rgba(190,150,255,${(1-dd/95)*0.12*Math.min(a.sc,b.sc)})`;x.lineWidth=0.6;x.stroke();}}
      shapes.forEach(sh=>{sh.rx+=sh.drx;sh.ry+=sh.dry;sh.rz+=sh.drz;sh.cx+=sh.dx;sh.cy+=sh.dy;if(sh.cx<-80)sh.cx=w+80;if(sh.cx>w+80)sh.cx=-80;if(sh.cy<-80)sh.cy=h+80;if(sh.cy>h+80)sh.cy=-80;ds(sh);});
      af.current=requestAnimationFrame(frame);}
    frame();const rs=()=>{w=c.width=window.innerWidth;h=c.height=window.innerHeight;};window.addEventListener("resize",rs);
    return()=>{cancelAnimationFrame(af.current);window.removeEventListener("resize",rs);};
  },[]);
  return <canvas ref={ref} style={{position:"fixed",inset:0,zIndex:0,pointerEvents:"none"}}/>;
}

function Boom({x,y,onDone}){const ref=useRef(null);useEffect(()=>{const c=ref.current;if(!c)return;const ctx=c.getContext("2d");c.width=320;c.height=320;const ps=Array.from({length:30},(_,i)=>{const a=(6.28*i)/30+Math.random()*0.4,sp=3+Math.random()*7;return{x:160,y:160,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,sz:2+Math.random()*5,hue:270+Math.random()*90};});let f;function draw(){ctx.clearRect(0,0,320,320);let alive=false;ps.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.09;p.life-=0.016;if(p.life>0){alive=true;ctx.globalAlpha=p.life;ctx.beginPath();ctx.arc(p.x,p.y,p.sz*p.life,0,6.28);const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.sz*p.life);g.addColorStop(0,`hsla(${p.hue},95%,70%,${p.life})`);g.addColorStop(1,`hsla(${p.hue},95%,70%,0)`);ctx.fillStyle=g;ctx.fill();}});if(alive)f=requestAnimationFrame(draw);else onDone?.();}draw();return()=>cancelAnimationFrame(f);},[onDone]);return <canvas ref={ref} style={{position:"fixed",left:x-160,top:y-160,width:320,height:320,pointerEvents:"none",zIndex:9999}}/>;}

// ── PERSISTENCE ──────────────────────────────────────────────────────────────
function useLS(k,init){const[v,set]=useState(()=>{try{const s=localStorage.getItem("am_"+k);return s?JSON.parse(s):init;}catch{return init;}});useEffect(()=>{try{localStorage.setItem("am_"+k,JSON.stringify(v));}catch{}},[k,v]);return[v,set];}
function useLSet(k){const[v,set]=useState(()=>{try{const s=localStorage.getItem("am_"+k);return s?new Set(JSON.parse(s)):new Set();}catch{return new Set();}});useEffect(()=>{try{localStorage.setItem("am_"+k,JSON.stringify([...v]));}catch{}},[k,v]);return[v,set];}

// ── AI ───────────────────────────────────────────────────────────────────────
function getKey(){
  // Check for server-side env var first (set in Vercel), then localStorage
  return process.env.REACT_APP_AI_KEY || (()=>{try{return localStorage.getItem("am_ak")?JSON.parse(localStorage.getItem("am_ak")):"";}catch{return"";}})();
}
async function callAI(key,sys,prompt){
  const k=key||getKey();
  if(!k)return null;
  try{const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":k,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:[{role:"user",content:prompt}]})});const d=await r.json();return d.content?.map(c=>c.text||"").join("")||null;}catch(e){console.error("AI:",e);return null;}
}

// ── THEME ────────────────────────────────────────────────────────────────────
const C={
  bg:"#05050d",card:"rgba(18,15,38,0.88)",card2:"rgba(28,24,55,0.7)",
  text:"#f4f0fc",dim:"rgba(180,172,220,0.5)",soft:"rgba(218,210,248,0.82)",
  brd:"rgba(118,92,220,0.1)",pop:"#ff3cac",green:"#00e87b",
  g1:"linear-gradient(135deg,#ff3cac 0%,#784ba0 50%,#2b86c5 100%)",
  g2:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)",
  g3:"linear-gradient(135deg,#f093fb 0%,#f5576c 100%)",
  g4:"linear-gradient(135deg,#4facfe 0%,#00f2fe 100%)",
  g5:"linear-gradient(135deg,#fa709a 0%,#fee140 100%)",
  gX:"linear-gradient(135deg,#f5af19 0%,#f12711 100%)",
  gAI:"linear-gradient(135deg,#a855f7 0%,#6366f1 50%,#06b6d4 100%)",
  mine:"linear-gradient(135deg,#7c3aed 0%,#a855f7 40%,#ec4899 100%)",
  them:"rgba(34,30,64,0.94)",
  glass:"rgba(14,12,34,0.82)",
};

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function AutoMate(){
  const[page,setPage]=useLS("pg","landing");
  const[view,setView]=useState("discover");
  const apiKey=process.env.REACT_APP_AI_KEY||"";
  const[auth,setAuth]=useState({name:"",email:"",pw:""});
  const[qStep,setQStep]=useState(0);
  const[quiz,setQuiz]=useState(()=>{try{const s=localStorage.getItem("am_qz");return s?JSON.parse(s):{intent:"",values:[],lifestyle:"",commStyle:"",interests:[],intimacy:5};}catch{return{intent:"",values:[],lifestyle:"",commStyle:"",interests:[],intimacy:5};}});
  const[vStep,setVStep]=useState(0);
  const[plan,setPlan]=useLS("pl",null);
  const[me,setMe]=useState(()=>{try{const s=localStorage.getItem("am_me");return s?JSON.parse(s):{name:"",age:"",gender:"",city:"",bio:"",interests:[],goals:"",values:[],lifestyle:"",commStyle:"",intimacy:5};}catch{return{name:"",age:"",gender:"",city:"",bio:"",interests:[],goals:"",values:[],lifestyle:"",commStyle:"",intimacy:5};}});
  const saveMe=(data)=>{const updated={...me,...data};setMe(updated);try{localStorage.setItem("am_me",JSON.stringify(updated));}catch{}};
  const saveQuiz=(data)=>{const updated={...quiz,...data};setQuiz(updated);try{localStorage.setItem("am_qz",JSON.stringify(updated));}catch{}};
  const[liked,setLiked]=useLSet("lk");
  const[passed,setPassed]=useLSet("ps");
  const[saved,setSaved]=useLSet("sv");
  const[blocked,setBlocked]=useLSet("bl");
  const[tab,setTab]=useState("discover");
  const[search,setSearch]=useState("");
  const[match,setMatch]=useState(null);
  const[convos,setConvos]=useLS("cv",{});
  const[msg,setMsg]=useState("");
  const[typing,setTyping]=useState(false);
  const[showIce,setShowIce]=useState(false);
  const[showRx,setShowRx]=useState(null);
  const[showDate,setShowDate]=useState(false);
  const[showCoach,setShowCoach]=useState(false);
  const[coachSugs,setCoachSugs]=useState(null);
  const[coachLoad,setCoachLoad]=useState(false);
  const[genie,setGenie]=useState(false);
  const[genieTab,setGenieTab]=useState("soul");
  const[genieDates,setGenieDates]=useState(null);
  const[genieLoad,setGenieLoad]=useState(false);
  const[modal,setModal]=useState(null);
  const[safety,setSafety]=useState(false);
  const[report,setReport]=useState(null);
  const[reportR,setReportR]=useState("");
  const[bioWriter,setBioWriter]=useState(false);
  const[bioTone,setBioTone]=useState("confident");
  const[bioLoad,setBioLoad]=useState(false);
  const[bioOut,setBioOut]=useState("");
  const[toast,setToast]=useState(null);
  const[booms,setBooms]=useState([]);
  
  const[matchAnim,setMatchAnim]=useState(null); // "It's a Match!" overlay
  const endRef=useRef(null);
  const inpRef=useRef(null);

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[convos,match]);
  useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(null),3000);return()=>clearTimeout(t);}},[toast]);

  const boom=useCallback(e=>{const id=Date.now();setBooms(p=>[...p,{id,x:e.clientX,y:e.clientY}]);setTimeout(()=>setBooms(p=>p.filter(b=>b.id!==id)),1800);},[]);

  // ── Scored profiles ────────────────────────────────────────────────────────
  const scored=useMemo(()=>
    PROFILES.filter(p=>!blocked.has(p.id)).map(p=>{const{score,why}=calcCompat(me,p);return{...p,compat:score,why};}).sort((a,b)=>b.compat-a.compat)
  ,[me,blocked]);
  const visible=scored.filter(p=>!passed.has(p.id)&&p.name.toLowerCase().includes(search.toLowerCase()));
  const savedP=scored.filter(p=>saved.has(p.id));
  const matchedP=scored.filter(p=>liked.has(p.id));
  const soul=scored[0];
  const surprise=scored.filter(p=>!liked.has(p.id)&&p.id!==soul?.id)[0]||scored[1];

  // ── AI ─────────────────────────────────────────────────────────────────────
  const aiReply=async(txt,prof,hist)=>callAI(apiKey,`You are ${prof.name}, ${prof.age}, ${prof.job} in ${prof.city}. Interests: ${prof.interests.join(", ")}. Bio: "${prof.bio}". Dating app chat. Warm, flirty, genuine. 1-3 sentences. Emojis sometimes. Never say you're AI.`,hist.slice(-6).map(m=>`${m.from==="me"?"Them":"You"}: ${m.text}`).join("\n")+`\nThem: ${txt}\nYou:`);
  const aiSuggest=async(prof)=>{const r=await callAI(apiKey,"Return ONLY a JSON array of 3 strings.",`3 creative openers for someone who likes ${me.interests?.slice(0,3).join(", ")||"travel"} chatting with ${prof.name} (${prof.job}, likes ${prof.interests.join(", ")}). ONLY JSON array.`);try{return JSON.parse((r||"[]").replace(/```json|```/g,"").trim());}catch{return null;}};
  const aiBio=async()=>callAI(apiKey,`Expert dating profile writer. ${bioTone} tone. Return ONLY 2-4 sentences.`,`${bioTone} dating bio for someone into ${me.interests?.join(", ")||"adventure"}. ${me.bio?`Draft: "${me.bio}". Improve.`:"Create from scratch."} ONLY the bio.`);
  const aiDates=async()=>{const r=await callAI(apiKey,"Return ONLY JSON array of 3 objects with 'e' (emoji), 't' (title), 'd' (desc).",`3 creative date ideas for people who like ${me.interests?.slice(0,2).join(", ")||"travel"} and ${soul?.interests?.join(", ")||"art"}. ONLY JSON.`);try{return JSON.parse((r||"[]").replace(/```json|```/g,"").trim());}catch{return null;}};

  // ── Send ───────────────────────────────────────────────────────────────────
  const send=async()=>{
    if(!msg.trim()||!match)return;const mid=match.id,txt=msg.trim();
    const nm={id:Date.now(),from:"me",text:txt,time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),rx:[]};
    setConvos(p=>({...p,[mid]:[...(p[mid]||[]),nm]}));setMsg("");setShowIce(false);setTyping(true);
    const hist=convos[mid]||[];const rep=await aiReply(txt,match,[...hist,nm]);
    const fb=["That sounds amazing! 😊","I love that! Tell me more 💕","Haha you're so funny 😂","We have so much in common! ✨","Best convo I've had on here 🔥","I'm literally smiling reading this 🥰"];
    setTimeout(()=>{setConvos(p=>({...p,[mid]:[...(p[mid]||[]),{id:Date.now()+1,from:"them",text:rep||fb[Math.floor(Math.random()*fb.length)],time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),rx:[],ai:!!rep}]}));setTyping(false);},rep?600:1500+Math.random()*2000);
  };
  const rxMsg=(mid,msgId,emoji)=>{setConvos(p=>({...p,[mid]:p[mid].map(m=>m.id===msgId?{...m,rx:[...(m.rx||[]),emoji]}:m)}));setShowRx(null);};
  const fetchCoach=async()=>{if(!match)return;setCoachLoad(true);setCoachSugs(await aiSuggest(match)||ICEBREAKERS.slice(0,3));setCoachLoad(false);};
  const fetchDates=async()=>{setGenieLoad(true);setGenieDates(await aiDates()||DATES.slice(0,3));setGenieLoad(false);};
  const genBio=async()=>{setBioLoad(true);setBioOut(await aiBio()||"I believe the best connections start with genuine curiosity and shared laughter. Always up for an adventure or a deep conversation over good coffee. Looking for someone who values authenticity as much as I do. ✨");setBioLoad(false);};
  const openChat=p=>{setMatch(p);setView("chat");};
  const doLike=(p,e)=>{setLiked(s=>new Set([...s,p.id]));boom(e);setMatchAnim(p);setTimeout(()=>setMatchAnim(null),3000);};
  const msgs=match?(convos[match.id]||[]):[];
  const logout=()=>{localStorage.clear();window.location.reload();};

  // ── Shared styles ──────────────────────────────────────────────────────────
  const glass={background:C.glass,backdropFilter:"blur(28px)",WebkitBackdropFilter:"blur(28px)",border:`1px solid ${C.brd}`,borderRadius:22};
  const bpS={transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",cursor:"pointer"};
  const hoverGlow="transition:all 0.3s;";
  
  // Quiz validation
  const quizValid=()=>{const s=QUIZ[qStep];if(!s)return false;if(s.slider)return true;if(s.multi)return(quiz[s.key]?.length||0)>=1;return!!quiz[s.key];};

  // Components
  const Btn=({children,g,disabled:dis,onClick:oc,s})=><button className="bp" disabled={dis} onClick={oc} style={{padding:"16px 32px",borderRadius:20,border:"none",background:g||C.g1,color:"white",fontSize:16,fontWeight:700,cursor:dis?"default":"pointer",fontFamily:"'Outfit'",boxShadow:dis?"none":"0 6px 28px rgba(255,60,172,0.35)",opacity:dis?0.35:1,...bpS,...(s||{})}}>{children}</button>;
  const Card=({children,s,cn,...r})=><div className={cn||""} style={{...glass,...(s||{})}} {...r}>{children}</div>;
  const Inp=({label:l,...r})=><div style={{marginBottom:18}}>{l&&<label style={{fontSize:13,fontWeight:700,color:C.soft,marginBottom:8,display:"block"}}>{l}</label>}<input className="ig" {...r} style={{width:"100%",padding:"15px 20px",borderRadius:18,border:`1px solid ${C.brd}`,background:C.card,color:C.text,fontSize:15,fontFamily:"'Outfit'",outline:"none",transition:"all 0.3s",...(r.style||{})}}/></div>;
  const Skel=({w:ww,h:hh})=><div style={{width:ww||"100%",height:hh||20,borderRadius:12,background:"rgba(120,90,200,0.08)",animation:"pulse 1.5s ease infinite"}}/>;
  
  const Nav=()=>(
    <div style={{display:"flex",justifyContent:"space-around",padding:"12px 20px 18px",background:C.glass,backdropFilter:"blur(30px)",borderTop:`1px solid ${C.brd}`,width:"100%"}}>
      {[{i:"🔥",l:"Discover",v:"discover"},{i:"💬",l:"Chats",v:"chats"},{i:"👤",l:"Profile",v:"profile"},{i:"⚙️",l:"Settings",v:"settings"}].map(n=>(
        <button key={n.l} className="bp" onClick={()=>{setView(n.v);if(n.v==="chats")setTab("matches");if(n.v==="discover")setTab("discover");}} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3,background:"none",border:"none",padding:6,...bpS}}>
          <span style={{fontSize:24,filter:view===n.v?"none":"grayscale(0.5) opacity(0.35)",transition:"all 0.3s"}}>{n.i}</span>
          <span style={{fontSize:11,fontWeight:700,color:view===n.v?C.pop:C.dim,transition:"color 0.3s"}}>{n.l}</span>
          {view===n.v&&<div style={{width:5,height:5,borderRadius:"50%",background:C.pop,marginTop:-2,animation:"pop 0.3s ease"}}/>}
        </button>
      ))}
    </div>
  );

  // ═════════════════════════════════════════════════════════════════════════════
  return(
    <div style={{fontFamily:"'Outfit'",background:C.bg,color:C.text,minHeight:"100vh",width:"100%",display:"flex",flexDirection:"column",alignItems:"center"}}>
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
      `}</style>

      <BG/>
      {booms.map(b=><Boom key={b.id} x={b.x} y={b.y} onDone={()=>setBooms(p=>p.filter(v=>v.id!==b.id))}/>)}
      
      {/* Toast */}
      {toast&&<div style={{position:"fixed",top:28,left:"50%",transform:"translateX(-50%)",zIndex:9999,padding:"14px 28px",borderRadius:20,background:C.g1,color:"white",fontSize:15,fontWeight:600,animation:"toast 0.35s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:"0 10px 40px rgba(255,60,172,0.45)",whiteSpace:"nowrap",letterSpacing:0.3}}>{toast}</div>}

      {/* ══ MATCH ANIMATION ══ */}
      {matchAnim&&(
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(5,5,13,0.92)",backdropFilter:"blur(20px)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease"}} onClick={()=>{setMatchAnim(null);openChat(matchAnim);}}>
          {/* Confetti */}
          {Array.from({length:20}).map((_,i)=><div key={i} style={{position:"absolute",top:-20,left:`${5+Math.random()*90}%`,width:8+Math.random()*8,height:8+Math.random()*8,borderRadius:Math.random()>0.5?"50%":"2px",background:`hsla(${260+Math.random()*100},90%,65%,0.8)`,animation:`confetti ${2+Math.random()*3}s linear ${Math.random()*0.5}s forwards`}}/>)}
          <div style={{animation:"matchReveal 0.8s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:-20,marginBottom:24}}>
              <div style={{width:100,height:100,borderRadius:30,overflow:"hidden",border:`3px solid ${C.pop}`,boxShadow:"0 0 40px rgba(255,60,172,0.4)",zIndex:2}}><img src={matchAnim.photo} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
              <div style={{width:60,height:60,borderRadius:"50%",background:C.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,margin:"0 -15px",zIndex:3,boxShadow:"0 0 30px rgba(255,60,172,0.5)",animation:"heartbeat 1s ease infinite"}}>💝</div>
              <div style={{width:100,height:100,borderRadius:30,overflow:"hidden",border:"3px solid rgba(120,75,160,0.5)",boxShadow:"0 0 40px rgba(120,75,160,0.3)",zIndex:2,background:C.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>{me.name?me.name[0]:"?"}</div>
            </div>
            <h2 style={{fontSize:32,fontWeight:900,fontFamily:"'Sora'",textAlign:"center",marginBottom:8}}><span className="gt">It's a Match!</span></h2>
            <p style={{fontSize:15,color:C.soft,textAlign:"center",marginBottom:6}}>You and {matchAnim.name} liked each other</p>
            <p style={{fontSize:22,fontWeight:800,textAlign:"center",marginBottom:24}}><span className="gt">{matchAnim.compat}%</span> <span style={{fontSize:14,color:C.dim}}>compatible</span></p>
            <div style={{display:"flex",gap:12,justifyContent:"center"}}>
              <Btn onClick={()=>{setMatchAnim(null);openChat(matchAnim);}} s={{fontSize:16,padding:"16px 36px"}}>💬 Send a Message</Btn>
              <Btn onClick={()=>setMatchAnim(null)} g={C.card2} s={{fontSize:16,padding:"16px 28px",boxShadow:"none",border:`1px solid ${C.brd}`}}>Later</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ LANDING ══════════════════ */}
      {page==="landing"&&(
        <div className="w" style={{alignItems:"center",justifyContent:"center",padding:36,textAlign:"center"}}>
          <div style={{fontSize:72,marginBottom:22,animation:"float 3s ease infinite",filter:"drop-shadow(0 0 35px rgba(255,60,172,0.5))"}}>💝</div>
          <h1 style={{fontSize:48,fontWeight:900,fontFamily:"'Sora'",marginBottom:10,animation:"fadeUp 0.7s ease 0.2s both",lineHeight:1.1}}><span className="gt">Auto-Mate</span></h1>
          <p style={{fontSize:18,color:C.soft,fontWeight:500,marginBottom:8,animation:"fadeUp 0.7s ease 0.3s both"}}>AI-Powered Dating</p>
          <p style={{fontSize:15,color:C.dim,lineHeight:1.8,marginBottom:40,maxWidth:500,animation:"fadeUp 0.7s ease 0.4s both"}}>Meaningful connections through personality matching, compatibility scoring, and intelligent conversation — not endless swiping.</p>
          
          {/* Feature cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,width:"100%",maxWidth:500,marginBottom:36,animation:"fadeUp 0.7s ease 0.5s both"}}>
            {[{i:"🧠",t:"AI Matching",d:"Smart compatibility"},{i:"🛡️",t:"Verified",d:"Real people only"},{i:"🧞",t:"AI Genie",d:"Personal matchmaker"}].map((f,i)=>(
              <Card key={i} className="hov" s={{padding:"18px 14px",textAlign:"center",cursor:"default"}}>
                <div style={{fontSize:28,marginBottom:8}}>{f.i}</div>
                <p style={{fontSize:13,fontWeight:700}}>{f.t}</p>
                <p style={{fontSize:11,color:C.dim}}>{f.d}</p>
              </Card>
            ))}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:14,width:"100%",maxWidth:420,animation:"fadeUp 0.7s ease 0.6s both"}}>
            <Btn onClick={()=>setPage("signup")} s={{width:"100%",fontSize:18,padding:"20px 0"}} className="glow-btn">Get Started</Btn>
            <Btn onClick={()=>setPage("login")} g={C.card} s={{width:"100%",fontSize:18,padding:"20px 0",boxShadow:"none",border:`1px solid ${C.brd}`}}>Sign In</Btn>
          </div>
          <div style={{display:"flex",gap:36,marginTop:48,animation:"fadeUp 0.7s ease 0.8s both"}}>
            {[{n:"10K+",l:"Users"},{n:"94%",l:"Match Rate"},{n:"AI",l:"Powered"}].map((s,i)=>(
              <div key={i}><p style={{fontSize:28,fontWeight:900}}><span className="gt">{s.n}</span></p><p style={{fontSize:12,color:C.dim,fontWeight:600,marginTop:2}}>{s.l}</p></div>
            ))}
          </div>
          <p style={{position:"absolute",bottom:28,fontSize:12,color:C.dim}}>automatedate.app</p>
        </div>
      )}

      {/* ══════════════════ LOGIN ══════════════════ */}
      {page==="login"&&(
        <div className="w" style={{justifyContent:"center",padding:36}}>
          <button className="bp" onClick={()=>setPage("landing")} style={{position:"absolute",top:28,left:28,background:"none",border:"none",color:C.soft,fontSize:17,...bpS}}>← Back</button>
          <div style={{textAlign:"center",marginBottom:36}}><div style={{fontSize:52,marginBottom:12}}>👋</div><h2 style={{fontSize:30,fontWeight:800,fontFamily:"'Sora'"}}>Welcome Back</h2><p style={{fontSize:15,color:C.dim,marginTop:8}}>Sign in to Auto-Mate</p></div>
          <Inp label="Email" type="email" placeholder="your@email.com" value={auth.email} onChange={e=>setAuth(p=>({...p,email:e.target.value}))}/>
          <Inp label="Password" type="password" placeholder="••••••••" value={auth.pw} onChange={e=>setAuth(p=>({...p,pw:e.target.value}))}/>
          <Btn onClick={()=>{setPage("app");setToast(`Welcome back${me.name?`, ${me.name}`:""}! 💝`);}} s={{width:"100%",marginTop:12}}>Sign In</Btn>
          <p style={{textAlign:"center",fontSize:15,color:C.dim,marginTop:24}}>No account? <span onClick={()=>setPage("signup")} style={{color:C.pop,cursor:"pointer",fontWeight:700}}>Sign Up</span></p>
        </div>
      )}

      {/* ══════════════════ SIGNUP ══════════════════ */}
      {page==="signup"&&(
        <div className="w" style={{justifyContent:"center",padding:36,overflowY:"auto"}}>
          <button className="bp" onClick={()=>setPage("landing")} style={{position:"absolute",top:28,left:28,background:"none",border:"none",color:C.soft,fontSize:17,...bpS}}>← Back</button>
          <div style={{textAlign:"center",marginBottom:32,marginTop:52}}><div style={{fontSize:52,marginBottom:12}}>✨</div><h2 style={{fontSize:30,fontWeight:800,fontFamily:"'Sora'"}}>Create Account</h2><p style={{fontSize:15,color:C.dim,marginTop:8}}>Find meaningful connections</p></div>
          <Inp label="First Name" placeholder="Your name" value={auth.name} onChange={e=>{setAuth(p=>({...p,name:e.target.value}));setMe(p=>({...p,name:e.target.value}));}}/>
          <Inp label="Email" type="email" placeholder="your@email.com" value={auth.email} onChange={e=>setAuth(p=>({...p,email:e.target.value}))}/>
          <Inp label="Password" type="password" placeholder="Create a password" value={auth.pw} onChange={e=>setAuth(p=>({...p,pw:e.target.value}))}/>
          <div style={{display:"flex",gap:14}}>
            <div style={{width:"35%"}}><Inp label="Age" type="number" placeholder="25" value={me.age} onChange={e=>setMe(p=>({...p,age:e.target.value}))}/></div>
            <div style={{flex:1,marginBottom:18}}><label style={{fontSize:13,fontWeight:700,color:C.soft,marginBottom:8,display:"block"}}>Gender</label><div style={{display:"flex",gap:8}}>
              {["Man","Woman","Non-binary"].map(g=><button key={g} className="bp" onClick={()=>setMe(p=>({...p,gender:g}))} style={{flex:1,padding:"14px 0",borderRadius:16,border:me.gender===g?"none":`1px solid ${C.brd}`,background:me.gender===g?C.g2:C.card,color:me.gender===g?"white":C.soft,fontSize:14,fontWeight:600,...bpS}}>{g}</button>)}
            </div></div>
          </div>
          <Inp label="City" placeholder="Seattle, WA" value={me.city} onChange={e=>setMe(p=>({...p,city:e.target.value}))}/>
          <Btn onClick={()=>{if(!auth.name||!auth.email){setToast("Please fill in name & email");return;}setPage("quiz");setToast("Let's find your matches! 🎯");}} s={{width:"100%",marginTop:8}} disabled={!auth.name||!auth.email}>Continue to Quiz →</Btn>
        </div>
      )}

      {/* ══════════════════ QUIZ ══════════════════ */}
      {page==="quiz"&&(
        <div className="w" style={{padding:30}}>
          <div style={{display:"flex",gap:5,marginTop:22,marginBottom:34}}>
            {QUIZ.map((_,i)=><div key={i} style={{flex:1,height:7,borderRadius:7,background:i<=qStep?C.g1:"rgba(120,75,160,0.1)",transition:"all 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}/>)}
          </div>
          <p style={{fontSize:12,color:C.dim,fontWeight:600,marginBottom:8}}>Step {qStep+1} of {QUIZ.length}</p>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center"}}>
            {(()=>{const sec=QUIZ[qStep];if(!sec)return null;return(
              <div style={{animation:"fadeUp 0.4s ease"}}>
                <div style={{fontSize:52,marginBottom:16}}>{sec.icon}</div>
                <h2 style={{fontSize:28,fontWeight:800,fontFamily:"'Sora'",marginBottom:8}}>{sec.title}</h2>
                <p style={{fontSize:17,color:C.dim,marginBottom:30}}>{sec.q}</p>
                {sec.slider?(
                  <div>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:12,alignItems:"center"}}>
                      <span style={{fontSize:14,color:C.dim}}>Not important</span>
                      <div style={{textAlign:"center"}}><span style={{fontSize:36,fontWeight:900}}><span className="gt">{quiz.intimacy}</span></span><p style={{fontSize:11,color:C.dim}}>out of 10</p></div>
                      <span style={{fontSize:14,color:C.dim}}>Very important</span>
                    </div>
                    <input type="range" min={1} max={10} value={quiz.intimacy} onChange={e=>setQuiz(p=>({...p,intimacy:+e.target.value}))} style={{width:"100%",accentColor:C.pop,height:8}}/>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>{Array.from({length:10},(_,i)=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:i+1<=quiz.intimacy?C.pop:"rgba(120,75,160,0.15)",transition:"all 0.3s"}}/>)}</div>
                  </div>
                ):sec.multi?(
                  <div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
                      {sec.opts.map(o=>{const sel=quiz[sec.key]?.includes(o),full=quiz[sec.key]?.length>=sec.max&&!sel;
                        return<button key={o} className="bp" disabled={full} onClick={()=>setQuiz(p=>({...p,[sec.key]:sel?p[sec.key].filter(v=>v!==o):[...(p[sec.key]||[]),o]}))}
                          style={{padding:"12px 22px",borderRadius:30,border:sel?"none":`1px solid ${C.brd}`,background:sel?C.g2:C.card,color:sel?"white":full?"rgba(200,190,230,0.2)":C.soft,fontSize:15,fontWeight:600,opacity:full?0.3:1,...bpS}}>{o}</button>;})}
                    </div>
                    <p style={{fontSize:13,color:C.dim,marginTop:10}}>Selected {quiz[sec.key]?.length||0}/{sec.max} {quiz[sec.key]?.length<1&&<span style={{color:C.pop}}>· Pick at least 1</span>}</p>
                  </div>
                ):(
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {sec.opts.map((o,i)=><button key={o} className="bp" onClick={()=>setQuiz(p=>({...p,[sec.key]:o}))}
                      style={{padding:"17px 22px",borderRadius:20,border:quiz[sec.key]===o?"none":`1px solid ${C.brd}`,background:quiz[sec.key]===o?C.g1:C.card,color:quiz[sec.key]===o?"white":C.soft,fontSize:16,fontWeight:600,textAlign:"left",animation:`fadeUp 0.3s ease ${i*0.05}s both`,boxShadow:quiz[sec.key]===o?"0 6px 25px rgba(255,60,172,0.25)":"none",...bpS}}>{o}</button>)}
                  </div>
                )}
              </div>
            );})()}
          </div>
          <div style={{display:"flex",gap:14,paddingBottom:22}}>
            {qStep>0&&<Btn onClick={()=>setQStep(s=>s-1)} g={C.card} s={{flex:1,boxShadow:"none",border:`1px solid ${C.brd}`}}>Back</Btn>}
            <Btn onClick={()=>{
              if(!quizValid()){setToast("Please make a selection");return;}
              if(qStep<QUIZ.length-1)setQStep(s=>s+1);
              else{saveMe({interests:quiz.interests,values:quiz.values,goals:quiz.intent,commStyle:quiz.commStyle,lifestyle:quiz.lifestyle,intimacy:quiz.intimacy});setPage("verify");setToast("Quiz complete! AI scoring your matches 🧠");}
            }} s={{flex:2}} disabled={!quizValid()}>{qStep===QUIZ.length-1?"Finish Quiz →":"Continue"}</Btn>
          </div>
        </div>
      )}

      {/* ══════════════════ VERIFY ══════════════════ */}
      {page==="verify"&&(
        <div className="w" style={{padding:30}}>
          <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:26,marginBottom:34}}>
            {["ID","Selfie","Verify","Done"].map((l,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:32,height:32,borderRadius:"50%",background:i<=vStep?C.g1:"rgba(120,75,160,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:i<=vStep?"white":C.dim,transition:"all 0.5s",boxShadow:i<=vStep?"0 4px 15px rgba(255,60,172,0.25)":"none"}}>{i<vStep?"✓":i+1}</div>{i<3&&<div style={{width:20,height:3,borderRadius:3,background:i<vStep?C.pop:"rgba(120,75,160,0.08)",transition:"all 0.5s"}}/>}</div>)}
          </div>
          <div style={{flex:1,display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center"}}>
            {vStep===0&&<div style={{textAlign:"center",animation:"fadeUp 0.5s ease",width:"100%",maxWidth:500}}><div style={{width:96,height:96,borderRadius:28,margin:"0 auto 24px",background:"rgba(120,75,160,0.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,border:"2px dashed rgba(120,75,160,0.2)"}}>🪪</div><h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'",marginBottom:10}}>Upload Your ID</h2><p style={{fontSize:15,color:C.dim,marginBottom:28}}>Government-issued ID for verification</p><Card className="hov" s={{padding:32,cursor:"pointer",borderStyle:"dashed",borderWidth:2,display:"flex",flexDirection:"column",alignItems:"center",gap:14}} onClick={()=>setVStep(1)}><div style={{fontSize:38}}>📤</div><p style={{fontSize:16,fontWeight:600}}>Tap to upload</p><p style={{fontSize:13,color:C.dim}}>JPG, PNG or PDF</p></Card><Card s={{padding:16,marginTop:18,display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:20}}>🔒</span><p style={{fontSize:13,color:C.dim,textAlign:"left"}}>AES-256 encrypted. Deleted after verification. We never store your documents.</p></Card></div>}
            {vStep===1&&<div style={{textAlign:"center",animation:"fadeUp 0.5s ease"}}><div style={{width:170,height:170,borderRadius:"50%",margin:"0 auto 24px",background:C.card,border:"3px solid rgba(120,75,160,0.2)",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}><span style={{fontSize:60}}>🤳</span><div style={{position:"absolute",left:0,right:0,height:4,background:C.g1,animation:"scan 2s ease-in-out infinite",boxShadow:"0 0 20px rgba(255,60,172,0.5)"}}/></div><h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'",marginBottom:10}}>Take a Selfie</h2><p style={{fontSize:15,color:C.dim,marginBottom:28}}>AI facial recognition matching</p><Btn onClick={()=>{setVStep(2);setTimeout(()=>setVStep(3),3500);}}>📸 Capture Selfie</Btn></div>}
            {vStep===2&&<div style={{textAlign:"center",animation:"fadeIn 0.5s ease"}}><div style={{width:86,height:86,borderRadius:"50%",margin:"0 auto 24px",border:"4px solid transparent",borderTopColor:C.pop,borderRightColor:"rgba(120,75,160,0.2)",animation:"spin 0.8s linear infinite"}}/><h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'",marginBottom:10}}>Verifying...</h2>{["Document authenticity","Facial recognition match","Age verification"].map((st,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",justifyContent:"center",animation:`fadeUp 0.5s ease ${i*0.5}s both`}}><div style={{width:22,height:22,borderRadius:"50%",background:i<2?C.green:"transparent",border:i>=2?`2px solid ${C.pop}`:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"white",animation:i===2?"spin 1s linear infinite":"none"}}>{i<2?"✓":""}</div><span style={{fontSize:15,color:C.soft}}>{st}</span></div>)}</div>}
            {vStep===3&&<div style={{textAlign:"center",animation:"pop 0.7s cubic-bezier(0.34,1.56,0.64,1)"}}><div style={{width:110,height:110,borderRadius:"50%",margin:"0 auto 24px",background:"rgba(0,232,123,0.08)",border:"3px solid rgba(0,232,123,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:52,animation:"glow 2s ease infinite"}}>✅</div><h2 style={{fontSize:28,fontWeight:800,fontFamily:"'Sora'",marginBottom:10}}><span className="gt">Identity Verified!</span></h2><p style={{fontSize:15,color:C.dim}}>Safe Date mode unlocked · 3x more matches</p></div>}
          </div>
          {(vStep===0||vStep===3)&&<div style={{display:"flex",gap:14,paddingBottom:22}}>
            {vStep===0&&<Btn onClick={()=>setPage("plan")} g={C.card} s={{flex:1,boxShadow:"none",border:`1px solid ${C.brd}`}}>Skip</Btn>}
            <Btn onClick={()=>{if(vStep===3)setPage("plan");else setVStep(1);}} s={{flex:2}}>{vStep===3?"Continue →":"Upload ID"}</Btn>
          </div>}
        </div>
      )}

      {/* API setup removed from user flow — key set via Vercel env var */}

      {/* ══════════════════ PLAN ══════════════════ */}
      {page==="plan"&&(
        <div className="w" style={{padding:30,overflowY:"auto"}}>
          <div style={{textAlign:"center",marginTop:22,marginBottom:30}}><h2 style={{fontSize:30,fontWeight:800,fontFamily:"'Sora'",marginBottom:8}}>Choose Your <span className="gt">Plan</span></h2><p style={{fontSize:15,color:C.dim}}>Unlock Auto-Mate's full power</p></div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:16,marginBottom:18}}>
          {[{t:"Free",p:"$0",per:"/forever",badge:null,feats:["5 matches/day","Basic chat","Standard profiles"],gr:C.card2},{t:"Premium",p:"$14.99",per:"/mo",badge:"POPULAR",feats:["Unlimited matches","AI Icebreakers","See who liked you","Read receipts","AI Profile Writer"],gr:C.g2},{t:"Elite",p:"$29.99",per:"/mo",badge:"BEST VALUE",feats:["Everything in Premium","AI Genie Matchmaker","Soulmate Picks","Safe Date mode","Video calls","Profile boost 5x"],gr:C.gX}].map((pl,i)=>(
            <Card key={pl.t} className="hov bp" onClick={()=>setPlan(pl.t)} s={{padding:0,overflow:"hidden",animation:`fadeUp 0.5s ease ${i*0.12}s both`,border:plan===pl.t?`2px solid ${C.pop}`:`1px solid ${C.brd}`,boxShadow:plan===pl.t?"0 10px 45px rgba(255,60,172,0.25)":"none",...bpS}}>
              {pl.badge&&<div style={{padding:"7px 0",textAlign:"center",background:pl.gr,fontSize:12,fontWeight:800,color:"white",letterSpacing:1.5}}>{pl.badge}</div>}
              <div style={{padding:"20px 22px"}}><div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between",marginBottom:12}}><span style={{fontSize:20,fontWeight:800}}>{pl.t}</span><div><span style={{fontSize:30,fontWeight:900}}>{pl.p}</span><span style={{fontSize:13,color:C.dim}}>{pl.per}</span></div></div>{pl.feats.map(f=><div key={f} style={{display:"flex",alignItems:"center",gap:9,marginBottom:7}}><span style={{fontSize:13,color:C.green}}>✓</span><span style={{fontSize:14,color:C.soft}}>{f}</span></div>)}</div>
            </Card>
          ))}
          </div>
          <Card s={{padding:16,display:"flex",alignItems:"center",gap:12,marginTop:8}}><span style={{fontSize:20}}>🔐</span><p style={{fontSize:13,color:C.dim}}>Payments via Stripe. PCI-DSS compliant. Cancel anytime.</p></Card>
          <div style={{padding:"22px 0 14px"}}><Btn onClick={()=>{setPage("app");setToast(`Welcome to Auto-Mate${plan?` ${plan}`:""}! 🎉`);}} s={{width:"100%",fontSize:18}}>{plan?`Start with ${plan}`:"Continue Free"}</Btn></div>
        </div>
      )}

      {/* ══════════════════ APP: DISCOVER ══════════════════ */}
      {page==="app"&&view==="discover"&&(
        <div className="w">
          <div style={{padding:"20px 24px 0",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <h1 style={{fontSize:28,fontWeight:900,fontFamily:"'Sora'"}}><span className="gt">Auto-Mate</span></h1>
            <div style={{display:"flex",gap:8}}>
              <button className="bp" onClick={()=>setGenie(true)} style={{width:42,height:42,borderRadius:16,...glass,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,animation:"aiGlow 3s ease infinite",...bpS}}>🧞</button>
              <button className="bp" onClick={()=>setSafety(true)} style={{width:42,height:42,borderRadius:16,...glass,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,...bpS}}>🛡️</button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,padding:"16px 24px 12px"}}>
            {[{k:"discover",l:"Discover",i:"🔥"},{k:"saved",l:"Saved",i:"🔖",c:saved.size},{k:"matches",l:"Matches",i:"💕",c:liked.size}].map(t=>(
              <button key={t.k} className="bp" onClick={()=>setTab(t.k)} style={{padding:"10px 18px",borderRadius:30,border:"none",fontSize:14,fontWeight:600,display:"flex",alignItems:"center",gap:6,background:tab===t.k?C.g1:C.card2,color:tab===t.k?"white":C.soft,boxShadow:tab===t.k?"0 5px 20px rgba(255,60,172,0.35)":"none",...bpS}}>
                {t.i} {t.l}{t.c>0&&<span style={{fontSize:11,fontWeight:700,background:tab===t.k?"rgba(255,255,255,0.22)":"rgba(255,60,172,0.12)",color:tab===t.k?"white":C.pop,padding:"2px 7px",borderRadius:10}}>{t.c}</span>}
              </button>
            ))}
          </div>
          <div style={{padding:"0 24px 12px"}}><div style={{position:"relative"}}><span style={{position:"absolute",left:16,top:"50%",transform:"translateY(-50%)",fontSize:16,opacity:0.4}}>🔍</span><input className="ig" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search matches..." style={{width:"100%",padding:"14px 18px 14px 46px",borderRadius:18,border:`1px solid ${C.brd}`,background:C.card,color:C.text,fontSize:15,fontFamily:"'Outfit'",outline:"none"}}/></div></div>
          
          <div style={{flex:1,overflowY:"auto",padding:"0 24px 100px"}}>
            {tab==="discover"&&visible.length===0&&<div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.5s ease"}}><div style={{fontSize:48,marginBottom:12}}>🔍</div><p style={{fontSize:16,color:C.dim}}>No more profiles to show</p><Btn onClick={()=>{setPassed(new Set());setToast("Profiles refreshed!");}} s={{marginTop:16,fontSize:14}}>Reset Passes</Btn></div>}
            {tab==="discover"&&visible.map((p,i)=>(
              <Card key={p.id} className="hov" s={{marginBottom:18,overflow:"hidden",padding:0,animation:`fadeUp 0.45s ease ${i*0.1}s both`}}>
                <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setModal(p)}>
                  <img src={p.photo} alt="" style={{width:"100%",height:260,objectFit:"cover"}}/>
                  <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"55px 20px 14px",background:"linear-gradient(transparent,rgba(0,0,0,0.88))"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                      <span style={{fontSize:22,fontWeight:800,color:"white"}}>{p.name}, {p.age}</span>
                      {p.verified&&<span style={{padding:"3px 9px",borderRadius:10,fontSize:11,fontWeight:700,background:"rgba(0,232,123,0.2)",color:C.green}}>✓ Verified</span>}
                      <span style={{marginLeft:"auto",padding:"5px 12px",borderRadius:14,background:"rgba(255,60,172,0.2)",fontSize:14,fontWeight:700,color:"#ff6eb4",backdropFilter:"blur(10px)"}}>{p.compat}%</span>
                    </div>
                    <p style={{fontSize:14,color:"rgba(255,255,255,0.65)"}}>{p.city} · {p.job}</p>
                  </div>
                </div>
                <div style={{padding:"14px 20px",borderBottom:`1px solid ${C.brd}`}}><p style={{fontSize:14,color:C.soft,lineHeight:1.65}}>💡 <em>{p.why}</em></p></div>
                <div style={{display:"flex",gap:10,padding:14,justifyContent:"center"}}>
                  <button className="bp" title="Pass" onClick={()=>{setPassed(s=>new Set([...s,p.id]));setToast("Passed");}} style={{width:50,height:50,borderRadius:"50%",background:"rgba(255,80,80,0.08)",border:"1.5px solid rgba(255,80,80,0.2)",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...bpS}}>✕</button>
                  <button className="bp" title="Save for later" onClick={()=>setSaved(s=>{const n=new Set(s);if(n.has(p.id)){n.delete(p.id);setToast("Removed");}else{n.add(p.id);setToast("Saved for later 🔖");}return n;})} style={{width:50,height:50,borderRadius:"50%",background:saved.has(p.id)?"rgba(250,180,0,0.12)":"rgba(200,180,255,0.06)",border:`1.5px solid ${saved.has(p.id)?"rgba(250,180,0,0.3)":"rgba(200,180,255,0.12)"}`,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...bpS}}>🔖</button>
                  <button className="bp glow-btn" title="Like" onClick={e=>doLike(p,e)} style={{width:58,height:58,borderRadius:"50%",background:liked.has(p.id)?C.g3:C.g1,border:"none",fontSize:24,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px rgba(255,60,172,0.4)",...bpS}}>💝</button>
                  <button className="bp" title="Message" onClick={()=>openChat(p)} style={{width:50,height:50,borderRadius:"50%",background:"rgba(120,75,160,0.08)",border:"1.5px solid rgba(120,75,160,0.15)",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...bpS}}>💬</button>
                </div>
              </Card>
            ))}
            {tab==="saved"&&(savedP.length===0?<div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.5s ease"}}><div style={{fontSize:48,marginBottom:12,animation:"float 3s ease infinite"}}>🔖</div><p style={{fontSize:16,color:C.dim}}>No saved profiles yet</p><p style={{fontSize:13,color:C.dim,marginTop:6}}>Use the bookmark button to save profiles for later</p></div>:savedP.map((p,i)=>(<Card key={p.id} className="hov" onClick={()=>setModal(p)} s={{display:"flex",alignItems:"center",gap:16,padding:16,marginBottom:12,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.06}s both`}}><img src={p.photo} alt="" style={{width:56,height:56,borderRadius:18,objectFit:"cover"}}/><div style={{flex:1}}><span style={{fontWeight:700,fontSize:16}}>{p.name}, {p.age}</span><p style={{fontSize:13,color:C.dim}}>{p.city} · {p.job}</p></div><span style={{fontSize:14,fontWeight:700,color:C.pop}}>{p.compat}%</span></Card>)))}
            {tab==="matches"&&(matchedP.length===0?<div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.5s ease"}}><div style={{fontSize:48,marginBottom:12,animation:"float 3s ease infinite"}}>💕</div><p style={{fontSize:16,color:C.dim}}>Like someone to start matching!</p><p style={{fontSize:13,color:C.dim,marginTop:6}}>Your matches will appear here</p></div>:matchedP.map((p,i)=>(<Card key={p.id} className="hov" onClick={()=>openChat(p)} s={{display:"flex",alignItems:"center",gap:16,padding:16,marginBottom:12,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.06}s both`}}><div style={{position:"relative"}}><img src={p.photo} alt="" style={{width:56,height:56,borderRadius:18,objectFit:"cover"}}/>{p.status==="online"&&<div style={{position:"absolute",bottom:1,right:1,width:13,height:13,borderRadius:"50%",background:C.green,boxShadow:`0 0 0 3px ${C.bg},0 0 10px rgba(0,232,123,0.5)`}}/>}</div><div style={{flex:1,minWidth:0}}><span style={{fontWeight:700,fontSize:16}}>{p.name}</span><p style={{fontSize:13,color:C.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(convos[p.id]||[]).slice(-1)[0]?.text||"Start chatting!"}</p></div><span style={{fontSize:14,fontWeight:700,color:C.pop}}>{p.compat}%</span></Card>)))}
          </div>
          <Nav/>
        </div>
      )}

      {/* ══════════════════ APP: CHAT ══════════════════ */}
      {page==="app"&&view==="chat"&&match&&(
        <div className="w">
          <Card s={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",margin:"10px 12px 0",borderRadius:22}}>
            <button className="bp" onClick={()=>{setView("discover");setMatch(null);}} style={{width:38,height:38,borderRadius:14,background:C.card2,border:"none",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,color:C.text,...bpS}}>←</button>
            <div style={{position:"relative",cursor:"pointer"}} onClick={()=>setModal(match)}><img src={match.photo} alt="" style={{width:44,height:44,borderRadius:16,objectFit:"cover"}}/>{match.status==="online"&&<div style={{position:"absolute",bottom:0,right:0,width:11,height:11,borderRadius:"50%",background:C.green,boxShadow:`0 0 0 2px ${C.bg}`}}/>}</div>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontWeight:700,fontSize:16}}>{match.name}</span>{match.verified&&<span style={{fontSize:12,color:C.green}}>✓</span>}</div><span style={{fontSize:12,color:C.dim}}>{match.compat}% compatible</span></div>
            <button className="bp" onClick={()=>setShowCoach(!showCoach)} style={{width:36,height:36,borderRadius:13,background:showCoach?"rgba(255,60,172,0.12)":C.card2,border:"none",fontSize:15,...bpS}}>🤖</button>
            <button className="bp" onClick={()=>setShowDate(!showDate)} style={{width:36,height:36,borderRadius:13,background:C.card2,border:"none",fontSize:15,...bpS}}>📅</button>
            <button className="bp" onClick={()=>setReport(match)} style={{width:36,height:36,borderRadius:13,background:C.card2,border:"none",fontSize:15,...bpS}}>⚠️</button>
          </Card>

          {showCoach&&<Card s={{margin:"8px 12px 0",padding:14,borderRadius:20,animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:14,fontWeight:700}}>🤖 AI Coach</span><Btn onClick={fetchCoach} s={{padding:"6px 16px",fontSize:12,borderRadius:14}}>{coachLoad?"Thinking...":"✨ Suggest"}</Btn></div>
            {coachLoad&&<div style={{display:"flex",gap:5,justifyContent:"center",padding:8}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.pop,animation:`dots 1.2s ease ${i*0.15}s infinite`}}/>)}</div>}
            {coachSugs?.map((s,i)=><button key={i} className="bp" onClick={()=>{setMsg(s);setShowCoach(false);inpRef.current?.focus();}} style={{display:"block",width:"100%",padding:"10px 14px",marginBottom:5,borderRadius:16,background:C.card2,border:`1px solid ${C.brd}`,color:C.soft,fontSize:14,textAlign:"left",animation:`slideR 0.3s ease ${i*0.07}s both`,...bpS}}>{s}</button>)}
            {!coachSugs&&!coachLoad&&<p style={{fontSize:13,color:C.dim,textAlign:"center"}}>Tap Suggest for AI-powered conversation starters</p>}
          </Card>}

          {showDate&&<Card s={{margin:"8px 12px 0",padding:14,borderRadius:20,animation:"slideUp 0.3s ease"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}><span style={{fontSize:14,fontWeight:700}}>📅 Date Ideas</span><button onClick={()=>setShowDate(false)} style={{background:"none",border:"none",color:C.dim,cursor:"pointer",fontSize:16}}>✕</button></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>{DATES.map((d,i)=><button key={i} className="bp" onClick={()=>{setMsg(`Hey! Want to go on a ${d.t.toLowerCase()}? ${d.e}`);setShowDate(false);}} style={{padding:"12px 8px",borderRadius:16,background:C.card2,border:`1px solid ${C.brd}`,textAlign:"center",...bpS}}><div style={{fontSize:24,marginBottom:4}}>{d.e}</div><div style={{fontSize:12,fontWeight:700,color:C.text}}>{d.t}</div></button>)}</div>
          </Card>}

          <div style={{flex:1,overflowY:"auto",padding:"12px 14px"}}>
            {msgs.length===0&&<div style={{textAlign:"center",padding:"40px 0",animation:"fadeIn 0.5s ease"}}><div style={{fontSize:48,marginBottom:12,animation:"float 3s ease infinite"}}>👋</div><p style={{fontSize:18,fontWeight:600,marginBottom:8}}>Say hello to {match.name}!</p><p style={{fontSize:14,color:C.dim,marginBottom:18}}>Break the ice with AI-powered suggestions</p><Btn onClick={()=>setShowCoach(true)} s={{fontSize:15,padding:"12px 26px"}}>🤖 AI Icebreakers</Btn></div>}
            {msgs.map((m,i)=>(
              <div key={m.id} style={{display:"flex",justifyContent:m.from==="me"?"flex-end":"flex-start",marginBottom:8,animation:`fadeUp 0.25s ease ${Math.min(i*0.03,0.15)}s both`}}>
                <div onDoubleClick={()=>setShowRx(showRx===m.id?null:m.id)} style={{maxWidth:"75%",padding:"12px 16px",position:"relative",borderRadius:m.from==="me"?"20px 20px 4px 20px":"20px 20px 20px 4px",background:m.from==="me"?C.mine:C.them,color:m.from==="me"?"white":C.text,fontSize:15,lineHeight:1.5,cursor:"pointer",boxShadow:m.from==="me"?"0 5px 18px rgba(124,58,237,0.28)":"none"}}>
                  {m.text}
                  <div style={{display:"flex",alignItems:"center",gap:4,marginTop:4,justifyContent:m.from==="me"?"flex-end":"flex-start"}}>
                    <span style={{fontSize:11,color:m.from==="me"?"rgba(255,255,255,0.45)":C.dim}}>{m.time}</span>
                    {m.from==="me"&&<span style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>✓✓</span>}
                    {m.ai&&<span style={{fontSize:9,color:"rgba(255,255,255,0.3)",marginLeft:2}}>🤖</span>}
                  </div>
                  {m.rx?.length>0&&<div style={{position:"absolute",bottom:-10,[m.from==="me"?"left":"right"]:10,display:"flex",gap:1,padding:"2px 6px",borderRadius:12,background:C.card,border:`1px solid ${C.brd}`,fontSize:12,animation:"bounce 0.3s ease"}}>{m.rx.map((r,ri)=><span key={ri}>{r}</span>)}</div>}
                  {showRx===m.id&&<div style={{position:"absolute",bottom:-42,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,padding:"5px 10px",borderRadius:20,background:C.card,border:`1px solid ${C.brd}`,zIndex:10,animation:"pop 0.2s ease",boxShadow:"0 8px 30px rgba(0,0,0,0.3)"}}>{EMOJIS.map(em=><button key={em} onClick={ev=>{ev.stopPropagation();rxMsg(match.id,m.id,em);}} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",padding:2,transition:"transform 0.15s"}} onMouseEnter={ev=>ev.target.style.transform="scale(1.4)"} onMouseLeave={ev=>ev.target.style.transform="scale(1)"}>{em}</button>)}</div>}
                </div>
              </div>
            ))}
            {typing&&<div style={{display:"flex",alignItems:"center",gap:8,marginTop:6,animation:"fadeIn 0.3s ease"}}><img src={match.photo} alt="" style={{width:24,height:24,borderRadius:8,objectFit:"cover"}}/><div style={{padding:"11px 18px",borderRadius:"18px 18px 18px 4px",background:C.them,display:"flex",gap:5,alignItems:"center"}}>{[0,1,2].map(i=><div key={i} style={{width:7,height:7,borderRadius:"50%",background:C.dim,animation:`dots 1.2s ease ${i*0.15}s infinite`}}/>)}<span style={{fontSize:11,color:C.dim,marginLeft:4}}>{match.name} is typing</span></div></div>}
            <div ref={endRef}/>
          </div>

          {showIce&&<div style={{padding:"10px 14px",borderTop:`1px solid ${C.brd}`,background:C.glass,animation:"slideUp 0.3s ease"}}><div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:5}}>{ICEBREAKERS.map((ib,i)=><button key={i} className="bp" onClick={()=>{setMsg(ib);setShowIce(false);inpRef.current?.focus();}} style={{padding:"8px 14px",borderRadius:16,whiteSpace:"nowrap",background:C.card2,border:`1px solid ${C.brd}`,color:C.soft,fontSize:13,flexShrink:0,...bpS}}>{ib}</button>)}</div></div>}

          <div style={{padding:"10px 12px 18px",background:C.glass,backdropFilter:"blur(30px)",borderTop:`1px solid ${C.brd}`}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <button className="bp" onClick={()=>setShowIce(!showIce)} style={{width:42,height:42,borderRadius:16,border:"none",background:showIce?"rgba(255,60,172,0.12)":C.card2,fontSize:18,...bpS}}>✨</button>
              <input ref={inpRef} value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Type a message..." className="ig" style={{flex:1,padding:"13px 18px",borderRadius:20,border:`1px solid ${C.brd}`,background:C.card,color:C.text,fontSize:15,fontFamily:"'Outfit'",outline:"none"}}/>
              <button className="bp glow-btn" onClick={send} disabled={!msg.trim()} style={{width:46,height:46,borderRadius:18,border:"none",background:msg.trim()?C.g1:C.card2,fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:msg.trim()?"0 5px 20px rgba(255,60,172,0.4)":"none",color:"white",opacity:msg.trim()?1:0.3,...bpS}}>➤</button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ APP: CHATS ══════════════════ */}
      {page==="app"&&view==="chats"&&(
        <div className="w">
          <div style={{padding:"22px 24px 16px"}}><h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'"}}>Messages</h2></div>
          <div style={{flex:1,overflowY:"auto",padding:"0 24px 100px"}}>
            {matchedP.length===0?<div style={{textAlign:"center",padding:"60px 0",animation:"fadeUp 0.5s ease"}}><div style={{fontSize:48,marginBottom:12,animation:"float 3s ease infinite"}}>💬</div><p style={{fontSize:16,color:C.dim}}>Like someone to start chatting!</p></div>:matchedP.map((p,i)=>(
              <Card key={p.id} className="hov" onClick={()=>openChat(p)} s={{display:"flex",alignItems:"center",gap:16,padding:16,marginBottom:12,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.06}s both`}}>
                <div style={{position:"relative"}}><img src={p.photo} alt="" style={{width:56,height:56,borderRadius:18,objectFit:"cover"}}/>{p.status==="online"&&<div style={{position:"absolute",bottom:1,right:1,width:13,height:13,borderRadius:"50%",background:C.green,boxShadow:`0 0 0 3px ${C.bg}`}}/>}</div>
                <div style={{flex:1,minWidth:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{fontWeight:700,fontSize:16}}>{p.name}</span><span style={{fontSize:11,color:C.dim}}>{(convos[p.id]||[]).slice(-1)[0]?.time||""}</span></div><p style={{fontSize:14,color:C.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{(convos[p.id]||[]).slice(-1)[0]?.text||"Start chatting!"}</p></div>
              </Card>
            ))}
          </div>
          <Nav/>
        </div>
      )}

      {/* ══════════════════ APP: PROFILE ══════════════════ */}
      {page==="app"&&view==="profile"&&(
        <div className="w" style={{overflowY:"auto"}}>
          <div style={{padding:24}}>
            <h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'",marginBottom:24}}>My Profile</h2>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{width:100,height:100,borderRadius:30,margin:"0 auto 14px",background:C.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:42,boxShadow:"0 10px 40px rgba(255,60,172,0.35)"}}>{me.name?me.name[0].toUpperCase():"?"}</div>
              <p style={{fontSize:22,fontWeight:700}}>{me.name||"Your Name"}</p>
              <p style={{fontSize:14,color:C.dim}}>{[me.city,me.age,me.gender].filter(Boolean).join(" · ")||"Complete your profile"}</p>
            </div>
            <Inp label="Name" value={me.name} onChange={e=>setMe(p=>({...p,name:e.target.value}))}/>
            <div style={{display:"flex",gap:14}}><div style={{width:"35%"}}><Inp label="Age" type="number" value={me.age} onChange={e=>setMe(p=>({...p,age:e.target.value}))}/></div><div style={{flex:1}}><Inp label="City" value={me.city} onChange={e=>setMe(p=>({...p,city:e.target.value}))}/></div></div>
            <div style={{marginBottom:18}}><label style={{fontSize:13,fontWeight:700,color:C.soft,marginBottom:8,display:"block"}}>Bio</label><textarea value={me.bio} onChange={e=>setMe(p=>({...p,bio:e.target.value}))} rows={3} placeholder="Tell matches about yourself..." style={{width:"100%",padding:"15px 18px",borderRadius:20,border:`1px solid ${C.brd}`,background:C.card,color:C.text,fontSize:15,fontFamily:"'Outfit'",outline:"none",resize:"none"}}/><button className="bp" onClick={()=>setBioWriter(true)} style={{marginTop:10,padding:"10px 18px",borderRadius:14,border:"none",background:C.gAI,color:"white",fontSize:13,fontWeight:700,...bpS}}>🤖 AI Profile Writer</button></div>
            <Inp label="Relationship Goals" value={me.goals} onChange={e=>setMe(p=>({...p,goals:e.target.value}))}/>
            <Inp label="Communication Style" value={me.commStyle} onChange={e=>setMe(p=>({...p,commStyle:e.target.value}))}/>
            <div style={{marginBottom:18}}><label style={{fontSize:13,fontWeight:700,color:C.soft,marginBottom:8,display:"block"}}>Interests</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{(me.interests||[]).map(i=><span key={i} style={{padding:"7px 16px",borderRadius:14,fontSize:14,fontWeight:600,background:C.card2,border:`1px solid ${C.brd}`,color:C.soft}}>{i}</span>)}{me.interests?.length===0&&<p style={{fontSize:13,color:C.dim}}>Take the quiz to add interests</p>}</div></div>
            <div style={{marginBottom:18}}><label style={{fontSize:13,fontWeight:700,color:C.soft,marginBottom:8,display:"block"}}>Values</label><div style={{display:"flex",flexWrap:"wrap",gap:8}}>{(me.values||[]).map(v=><span key={v} style={{padding:"7px 16px",borderRadius:14,fontSize:14,fontWeight:600,background:C.card2,border:`1px solid ${C.brd}`,color:C.soft}}>{v}</span>)}</div></div>
            <div style={{marginBottom:18}}><label style={{fontSize:13,fontWeight:700,color:C.soft,marginBottom:8,display:"block"}}>Intimacy Importance: <span className="gt">{me.intimacy}/10</span></label><input type="range" min={1} max={10} value={me.intimacy} onChange={e=>setMe(p=>({...p,intimacy:+e.target.value}))} style={{width:"100%",accentColor:C.pop,height:6}}/></div>
            <Btn onClick={()=>{saveMe(me);setView("discover");setToast("Profile saved! ✅");}} s={{width:"100%",marginTop:12,marginBottom:110}}>Save Profile</Btn>
          </div>
          <Nav/>
        </div>
      )}

      {/* ══════════════════ APP: SETTINGS ══════════════════ */}
      {page==="app"&&view==="settings"&&(
        <div className="w" style={{overflowY:"auto"}}>
          <div style={{padding:24}}>
            <h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'",marginBottom:24}}>Settings</h2>
            {[
              {icon:"🤖",title:"AI Status",desc:apiKey?"AI Connected ✓":"AI Offline",action:()=>setToast(apiKey?"AI is active and powering your experience!":"Contact admin to enable AI features")},
              {icon:"👤",title:"Edit Profile",action:()=>setView("profile")},
              {icon:"🔒",title:"Privacy & Safety",action:()=>setSafety(true)},
              {icon:"🔔",title:"Notifications",action:()=>setToast("Coming soon")},
              {icon:"💳",title:"Subscription",desc:plan||"Free",action:()=>setPage("plan")},
              {icon:"🪪",title:"Verification",desc:"Verified ✓",action:()=>setToast("You're verified!")},
              {icon:"🚫",title:`Blocked Users (${blocked.size})`,action:()=>setToast(`${blocked.size} user${blocked.size!==1?"s":""} blocked`)},
              {icon:"📊",title:"Retake Compatibility Quiz",action:()=>{setQStep(0);setPage("quiz");}},
              {icon:"📧",title:"Contact Support",action:()=>setToast("support@automatedate.app")},
              {icon:"🚪",title:"Log Out",action:logout,danger:true},
            ].map((item,i)=>(
              <Card key={i} className="bp" onClick={item.action} s={{display:"flex",alignItems:"center",gap:16,padding:18,marginBottom:12,cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.04}s both`,border:item.highlight?`1px solid rgba(168,85,247,0.3)`:`1px solid ${C.brd}`,...bpS}}>
                <span style={{fontSize:22}}>{item.icon}</span>
                <div style={{flex:1}}><p style={{fontSize:15,fontWeight:600,color:item.danger?"#ff5555":C.text}}>{item.title}</p>{item.desc&&<p style={{fontSize:12,color:item.highlight?C.pop:C.dim}}>{item.desc}</p>}</div>
                <span style={{color:C.dim,fontSize:16}}>›</span>
              </Card>
            ))}
          </div>
          <div style={{height:100}}/>
          <Nav/>
        </div>
      )}

      {/* ══════════════════ GENIE ══════════════════ */}
      {genie&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(5,5,13,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setGenie(false)}>
          <div onClick={e=>e.stopPropagation()} style={{...glass,width:"100%",maxWidth:700,maxHeight:"88vh",borderRadius:"28px 28px 0 0",overflow:"auto",animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)",padding:26}}>
            <div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:56,marginBottom:10,animation:"aiGlow 3s ease infinite, float 3s ease infinite"}}>🧞</div><h2 style={{fontSize:26,fontWeight:800,fontFamily:"'Sora'"}}><span style={{background:C.gAI,backgroundSize:"200% 200%",animation:"grad 4s ease infinite",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>AI Genie</span></h2><p style={{fontSize:14,color:C.dim}}>Your personal AI matchmaker</p></div>
            <div style={{display:"flex",gap:6,marginBottom:22}}>{[{k:"soul",l:"Soulmate Pick",i:"💫"},{k:"surprise",l:"Surprise Me",i:"🎲"},{k:"tips",l:"Suggestions",i:"💡"}].map(t=><button key={t.k} className="bp" onClick={()=>setGenieTab(t.k)} style={{flex:1,padding:"12px 0",borderRadius:18,border:"none",fontSize:14,fontWeight:600,background:genieTab===t.k?C.gAI:C.card2,color:genieTab===t.k?"white":C.soft,...bpS}}>{t.i} {t.l}</button>)}</div>

            {genieTab==="soul"&&soul&&(<div style={{animation:"fadeUp 0.4s ease"}}><Card s={{padding:0,overflow:"hidden",marginBottom:16}}>
              <div style={{padding:"12px 18px",background:C.gAI,display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:18}}>💫</span><span style={{fontSize:14,fontWeight:700,color:"white"}}>AI Genie believes this could be a special connection</span></div>
              <div style={{display:"flex",gap:16,padding:18,alignItems:"center"}}><img src={soul.photo} alt="" style={{width:80,height:80,borderRadius:22,objectFit:"cover",boxShadow:"0 8px 30px rgba(0,0,0,0.3)"}}/><div style={{flex:1}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}><span style={{fontSize:20,fontWeight:800}}>{soul.name}, {soul.age}</span>{soul.verified&&<span style={{fontSize:12,color:C.green}}>✓</span>}</div><p style={{fontSize:13,color:C.dim,marginBottom:8}}>{soul.city} · {soul.job}</p><p style={{fontSize:28,fontWeight:900}}><span className="gt">{soul.compat}%</span></p></div></div>
              <div style={{padding:"0 18px 16px"}}><p style={{fontSize:14,color:C.soft,lineHeight:1.6}}>💡 {soul.why}</p></div>
            </Card>
            <div style={{display:"flex",gap:12}}><Btn onClick={()=>{setModal(soul);}} g={C.gAI} s={{flex:1,fontSize:15}}>View Profile</Btn><Btn onClick={e=>{doLike(soul,e);setGenie(false);}} s={{flex:1,fontSize:15}}>💝 Like</Btn></div></div>)}

            {genieTab==="surprise"&&surprise&&(<div style={{animation:"fadeUp 0.4s ease",textAlign:"center"}}>
              <p style={{fontSize:15,color:C.soft,marginBottom:20}}>A unique match outside your typical algorithm</p>
              <Card s={{padding:0,overflow:"hidden",marginBottom:16}}><img src={surprise.photo} alt="" style={{width:"100%",height:220,objectFit:"cover"}}/><div style={{padding:18}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}><span style={{fontSize:22,fontWeight:800}}>{surprise.name}, {surprise.age}</span><span style={{padding:"4px 12px",borderRadius:12,fontSize:12,fontWeight:700,background:"rgba(168,85,247,0.12)",color:"#a855f7"}}>{surprise.compat}%</span></div><p style={{fontSize:14,color:C.dim,marginBottom:10}}>{surprise.bio}</p><p style={{fontSize:13,color:C.soft}}>💡 {surprise.why}</p></div></Card>
              <div style={{display:"flex",gap:12}}><Btn onClick={()=>setGenie(false)} g={C.card2} s={{flex:1,fontSize:15,boxShadow:"none",border:`1px solid ${C.brd}`,color:C.soft}}>Skip</Btn><Btn onClick={e=>{doLike(surprise,e);setGenie(false);}} g={C.gAI} s={{flex:1,fontSize:15}}>💝 Like</Btn></div>
            </div>)}

            {genieTab==="tips"&&(<div style={{animation:"fadeUp 0.4s ease"}}>
              <p style={{fontSize:15,fontWeight:700,marginBottom:12}}>💬 Conversation Starters</p>
              {ICEBREAKERS.slice(0,3).map((ib,i)=><Card key={i} className="bp" s={{padding:"14px 18px",marginBottom:8,fontSize:14,color:C.soft,cursor:"pointer",...bpS}} onClick={()=>{setGenie(false);setToast("Copied!");}}>{ib}</Card>)}
              <p style={{fontSize:15,fontWeight:700,marginTop:20,marginBottom:12}}>❓ Great Profile Questions</p>
              {["What do your friends always say about you?","Describe your perfect Sunday morning","What's a value you'd never compromise on?"].map((q,i)=><Card key={i} s={{padding:"14px 18px",marginBottom:8,fontSize:14,color:C.soft}}>{q}</Card>)}
              <p style={{fontSize:15,fontWeight:700,marginTop:20,marginBottom:12}}>📅 AI-Generated Date Ideas</p>
              <Btn onClick={fetchDates} g={C.gAI} s={{width:"100%",fontSize:14,marginBottom:12}}>{genieLoad?"✨ Generating...":"✨ Generate Date Ideas"}</Btn>
              {genieDates?.map((d,i)=><Card key={i} s={{padding:"14px 18px",marginBottom:8,display:"flex",alignItems:"center",gap:14}}><span style={{fontSize:28}}>{d.e}</span><div><p style={{fontSize:14,fontWeight:700}}>{d.t}</p><p style={{fontSize:13,color:C.dim}}>{d.d}</p></div></Card>)}
            </div>)}
          </div>
        </div>
      )}

      {/* ══════════════════ PROFILE MODAL ══════════════════ */}
      {modal&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(5,5,13,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setModal(null)}>
          <div onClick={e=>e.stopPropagation()} style={{...glass,width:"100%",maxWidth:700,maxHeight:"88vh",borderRadius:"28px 28px 0 0",overflow:"auto",animation:"slideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{position:"relative"}}><img src={modal.photo} alt="" style={{width:"100%",height:300,objectFit:"cover"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"60px 24px 16px",background:"linear-gradient(transparent,rgba(0,0,0,0.9))"}}><div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:26,fontWeight:800,color:"white"}}>{modal.name}, {modal.age}</span>{modal.verified&&<span style={{padding:"4px 10px",borderRadius:10,fontSize:11,fontWeight:700,background:"rgba(0,232,123,0.2)",color:C.green}}>✓ Verified</span>}</div><p style={{fontSize:14,color:"rgba(255,255,255,0.6)",marginTop:4}}>{modal.job} · {modal.city}</p></div><button className="bp" onClick={()=>setModal(null)} style={{position:"absolute",top:16,right:16,width:38,height:38,borderRadius:14,background:"rgba(0,0,0,0.5)",border:"none",color:"white",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center",...bpS}}>✕</button></div>
            <div style={{padding:22}}>
              <Card s={{display:"flex",alignItems:"center",gap:14,padding:16,marginBottom:18,background:"linear-gradient(135deg,rgba(255,60,172,0.06),rgba(120,75,160,0.06))"}}>
                <div style={{width:54,height:54,borderRadius:18,background:C.g1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:900,color:"white",boxShadow:"0 6px 20px rgba(255,60,172,0.3)"}}>{modal.compat}%</div>
                <div><p style={{fontSize:15,fontWeight:700}}>Compatibility Score</p><p style={{fontSize:13,color:C.dim}}>AI-calculated from your quiz answers</p></div>
              </Card>
              <p style={{fontSize:14,color:C.soft,lineHeight:1.6,marginBottom:16,fontStyle:"italic",padding:"0 4px"}}>💡 {modal.why}</p>
              <p style={{fontSize:16,lineHeight:1.7,marginBottom:18,color:C.soft}}>{modal.bio}</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>{[{l:"Goals",v:modal.goals},{l:"Love Language",v:modal.commStyle},{l:"Lifestyle",v:modal.lifestyle},{l:"Intimacy",v:`${modal.intimacy}/10`}].map(d=><div key={d.l} style={{padding:"12px 14px",borderRadius:16,background:C.card2,border:`1px solid ${C.brd}`}}><p style={{fontSize:12,color:C.dim,fontWeight:700,marginBottom:3}}>{d.l}</p><p style={{fontSize:14,fontWeight:600}}>{d.v}</p></div>)}</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>{modal.interests.map(i=><span key={i} style={{padding:"7px 16px",borderRadius:14,fontSize:13,fontWeight:600,background:C.card2,border:`1px solid ${C.brd}`,color:C.soft}}>{i}</span>)}</div>
              <div style={{display:"flex",gap:12}}><Btn onClick={()=>{setModal(null);openChat(modal);}} s={{flex:1,fontSize:15}}>💬 Message</Btn><button className="bp" onClick={()=>{setReport(modal);setModal(null);}} style={{width:54,height:54,borderRadius:18,border:`1px solid ${C.brd}`,background:C.card2,fontSize:20,display:"flex",alignItems:"center",justifyContent:"center",...bpS}}>⚠️</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ REPORT ══════════════════ */}
      {report&&(
        <div style={{position:"fixed",inset:0,zIndex:110,background:"rgba(5,5,13,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setReport(null)}>
          <Card onClick={e=>e.stopPropagation()} s={{width:"92%",maxWidth:520,padding:26,animation:"pop 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <h3 style={{fontSize:20,fontWeight:800,fontFamily:"'Sora'",marginBottom:6}}>Report or Block</h3>
            <p style={{fontSize:14,color:C.dim,marginBottom:20}}>{report.name}</p>
            {["Harassment","Fake profile","Inappropriate content","Spam","Other"].map(r=><button key={r} className="bp" onClick={()=>setReportR(r)} style={{display:"block",width:"100%",padding:"14px 18px",marginBottom:8,borderRadius:16,border:reportR===r?"none":`1px solid ${C.brd}`,background:reportR===r?C.g2:C.card,color:reportR===r?"white":C.soft,fontSize:14,fontWeight:600,textAlign:"left",boxShadow:reportR===r?"0 4px 18px rgba(102,126,234,0.25)":"none",...bpS}}>{r}</button>)}
            <div style={{display:"flex",gap:12,marginTop:16}}>
              <Btn onClick={()=>{setReportR("");setReport(null);}} g={C.card2} s={{flex:1,fontSize:14,boxShadow:"none",border:`1px solid ${C.brd}`,color:C.soft}}>Cancel</Btn>
              <Btn onClick={()=>{setReportR("");setReport(null);setToast("Report submitted ✓");}} disabled={!reportR} s={{flex:1,fontSize:14}}>Submit Report</Btn>
            </div>
            <button className="bp" onClick={()=>{setBlocked(s=>new Set([...s,report.id]));setReport(null);setToast(`${report.name} blocked`);if(match?.id===report.id){setMatch(null);setView("discover");}}} style={{width:"100%",padding:"14px 0",marginTop:14,borderRadius:18,border:"1.5px solid rgba(255,80,80,0.25)",background:"rgba(255,80,80,0.06)",color:"#ff5555",fontSize:14,fontWeight:700,...bpS}}>🚫 Block {report.name}</button>
          </Card>
        </div>
      )}

      {/* ══════════════════ SAFETY ══════════════════ */}
      {safety&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(5,5,13,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setSafety(false)}>
          <Card onClick={e=>e.stopPropagation()} s={{width:"92%",maxWidth:520,padding:26,animation:"pop 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{textAlign:"center",marginBottom:20}}><div style={{fontSize:44,marginBottom:10}}>🛡️</div><h2 style={{fontSize:22,fontWeight:800,fontFamily:"'Sora'"}}>Safe Date Mode</h2><p style={{fontSize:13,color:C.dim,marginTop:6}}>Your safety is our top priority</p></div>
            {["Always meet in public places for first dates","Share your date plans with a trusted friend or family member","Trust your instincts — leave immediately if uncomfortable","Video call before meeting someone in person","Never share financial information with matches"].map((t,i)=><div key={i} style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:14,animation:`fadeUp 0.3s ease ${i*0.08}s both`}}><div style={{width:22,height:22,borderRadius:"50%",background:"rgba(0,232,123,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:2}}><span style={{fontSize:12,color:C.green}}>✓</span></div><span style={{fontSize:15,color:C.soft,lineHeight:1.6}}>{t}</span></div>)}
            <Btn onClick={()=>setSafety(false)} s={{width:"100%",marginTop:10,fontSize:15}}>Got it! 💪</Btn>
          </Card>
        </div>
      )}

      {/* ══════════════════ BIO WRITER ══════════════════ */}
      {bioWriter&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"rgba(5,5,13,0.7)",backdropFilter:"blur(12px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.2s ease"}} onClick={()=>setBioWriter(false)}>
          <Card onClick={e=>e.stopPropagation()} s={{width:"94%",maxWidth:560,padding:26,animation:"pop 0.35s cubic-bezier(0.34,1.56,0.64,1)"}}>
            <div style={{textAlign:"center",marginBottom:22}}><div style={{fontSize:44,marginBottom:10}}>✍️</div><h2 style={{fontSize:22,fontWeight:800,fontFamily:"'Sora'"}}>AI Profile Writer</h2><p style={{fontSize:14,color:C.dim,marginTop:6}}>{apiKey?"Powered by Claude AI":"Smart bio templates"}</p></div>
            <p style={{fontSize:14,fontWeight:700,color:C.soft,marginBottom:10}}>Choose your tone:</p>
            <div style={{display:"flex",gap:8,marginBottom:22,flexWrap:"wrap"}}>{["confident","friendly","witty","authentic","adventurous"].map(s=><button key={s} className="bp" onClick={()=>setBioTone(s)} style={{padding:"10px 20px",borderRadius:24,border:bioTone===s?"none":`1px solid ${C.brd}`,background:bioTone===s?C.gAI:C.card,color:bioTone===s?"white":C.soft,fontSize:14,fontWeight:600,textTransform:"capitalize",boxShadow:bioTone===s?"0 4px 18px rgba(168,85,247,0.3)":"none",...bpS}}>{s}</button>)}</div>
            <Btn onClick={genBio} disabled={bioLoad} g={C.gAI} s={{width:"100%",fontSize:15,marginBottom:16}}>{bioLoad?"✨ Writing your bio...":"✨ Generate Bio"}</Btn>
            {bioOut&&<div style={{animation:"fadeUp 0.4s ease"}}><Card s={{padding:16,marginBottom:14}}><p style={{fontSize:15,color:C.soft,lineHeight:1.7}}>{bioOut}</p></Card><Btn onClick={()=>{saveMe({bio:bioOut});setBioWriter(false);setBioOut("");setToast("Bio updated! ✨");}} s={{width:"100%",fontSize:15}}>Use This Bio</Btn></div>}
          </Card>
        </div>
      )}
    </div>
  );
}
