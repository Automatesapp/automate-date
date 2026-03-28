# Auto-Mate — AI-Powered Dating Platform
## automatedate.app

### 🚀 Deploy Tonight — Step by Step

---

## Step 1: Install Node.js (if not installed)
Download from https://nodejs.org (LTS version)

## Step 2: Create the project
```bash
# Create a folder and copy all these files into it
# Or clone from your GitHub repo

cd automate-date
npm install
```

## Step 3: Test locally
```bash
npm start
```
Opens at http://localhost:3000

## Step 4: Push to GitHub
```bash
git init
git add .
git commit -m "Auto-Mate v1.0"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/automate-date.git
git push -u origin main
```

## Step 5: Deploy to Vercel (recommended, free)
1. Go to https://vercel.com and sign in with GitHub
2. Click "Add New Project"
3. Import your automate-date repo
4. Click "Deploy" — it auto-detects React
5. Your site is live at something.vercel.app in ~60 seconds

## Step 6: Connect your domain
1. In Vercel dashboard → your project → Settings → Domains
2. Add: automatedate.app
3. In your domain registrar, update DNS:
   - A record → 76.76.21.21
   - CNAME www → cname.vercel-dns.com
4. SSL is automatic

---

## 🧠 AI Features (Claude API)

The app calls the Anthropic API for:
- **AI Chat Replies** — Matches respond using Claude Sonnet
- **AI Conversation Coach** — Personalized icebreakers
- **AI Profile Writer** — Bio generation in 5 tones
- **AI Genie Date Ideas** — Custom first date suggestions
- **Real Compatibility Scoring** — Algorithm runs locally

The AI features work automatically when deployed on claude.ai artifacts.
For your own domain, the API calls will need a proxy backend to add your API key.

### Setting up AI on your own domain:

Option A: **Vercel Edge Function** (easiest)
Create `api/ai.js` in your project:
```js
export default async function handler(req, res) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.json(data);
}
```
Then set ANTHROPIC_API_KEY in Vercel Environment Variables.

Option B: **Cloudflare Worker** (free, fast)
Same proxy pattern, deploy as a worker.

---

## 📱 Features Included

- ✅ Landing page
- ✅ Sign up / Login
- ✅ 6-section compatibility quiz
- ✅ Real compatibility scoring algorithm (0-100)
- ✅ ID verification flow
- ✅ Billing plans (Free/Premium/Elite)
- ✅ Match discovery with AI explanations
- ✅ Like / Pass / Save for Later
- ✅ Full chat system with AI replies
- ✅ Report & Block users
- ✅ AI Conversation Coach
- ✅ AI Profile Writer (5 tones)
- ✅ AI Genie (Soulmate Pick + Surprise Me + Suggestions)
- ✅ Date idea generator
- ✅ User profile editor
- ✅ Settings page
- ✅ Safe Date mode
- ✅ 3D particle canvas with wireframe shapes
- ✅ Particle burst effects on likes
- ✅ Toast notifications
- ✅ LocalStorage persistence
- ✅ Mobile-first responsive design

## 🔮 Next Steps (Post-Launch)

1. **Supabase Backend** — Real auth, database, real-time chat
2. **Stripe Integration** — Real payments
3. **Photo Upload** — Supabase Storage or Cloudinary
4. **Push Notifications** — Firebase Cloud Messaging
5. **Video Calls** — Daily.co or Twilio
