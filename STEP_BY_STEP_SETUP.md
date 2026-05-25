# 🔧 Complete Setup Guide - Step by Step

Aapke website ko Railway + Vercel par live karne ka **complete process** यहाँ है!

---

## 📋 Table of Contents
1. [GitHub Account Setup](#1-github-account-setup)
2. [Railway Account Setup](#2-railway-account-setup)
3. [Vercel Account Setup](#3-vercel-account-setup)
4. [Local Git Configuration](#4-local-git-configuration)
5. [Push Code to GitHub](#5-push-code-to-github)
6. [Deploy to Railway](#6-deploy-to-railway)
7. [Deploy to Vercel](#7-deploy-to-vercel)
8. [Connect Them Together](#8-connect-them-together)

---

## 1️⃣ GitHub Account Setup

### Step 1.1: GitHub Account Banao

**Link**: https://github.com/signup

1. https://github.com/signup खोलो
2. Email address दो
3. "Create account" button दाबो
4. Password set करो (strong password!)
5. Username choose करो (याद रखो - बाद में use होगा)
6. Email verify करो (email में confirmation link आएगी)

**✅ Screenshot steps:**
```
1. github.com खोलो
2. Top-right में "Sign up" button दिखेगा
3. Click करो
4. Email, password, username fill करो
5. Email verify करो
```

**Username example**: `pathariya-panchayat` या `your-name-123`

---

### Step 1.2: GitHub में New Repository बनाओ

Signup के बाद:

1. **GitHub Dashboard** पर आओ (https://github.com)
2. **Top-left में "+" icon** क्लिक करो
3. **"New repository"** select करो

**Form भरो:**
```
Repository name: pathariya-panchayat-website
(या कोई भी नाम जो आपको पसंद हो)

Description: Pathariya Jat Panchayat Website
(Optional - छोड़ सकते हो)

Public: ✓ (चेक करो - सबको दिखेगा)
Private: ✗ (uncheck करो)

Initialize with README: ✗ (uncheck करो)
```

4. **"Create repository"** button दाबो

**⚠️ Important**: डो NOT "Initialize with README" select करो!

---

### Step 1.3: GitHub से Clone URL Copy करो

Repository बनने के बाद:
1. "<> Code" button (green) दिखेगा
2. उस पर click करो
3. **"HTTPS"** tab select करो (पहले से selected होगा)
4. **URL copy करो** (icon दबा कर)

**URL कुछ इस तरह होगा:**
```
https://github.com/YOUR_USERNAME/pathariya-panchayat-website.git
```

**📝 इस URL को एक जगह note करो - बाद में use होगा!**

---

## 2️⃣ Railway Account Setup

### Step 2.1: Railway Account Banao

**Link**: https://railway.app

1. https://railway.app खोलो
2. **"Start free"** या **"Login"** button दिखेगा
3. **"GitHub"** से sign up करो (recommended)
4. **GitHub authorization approve करो**
5. Railway account create हो जाएगा

**✅ Screenshot steps:**
```
1. railway.app खोलो
2. "Get Started" या "Sign Up" button दाबो
3. "Continue with GitHub" select करो
4. GitHub login करो
5. Railway को access देने के लिए "Authorize" करो
```

---

### Step 2.2: Railway में New Project बनाओ

Railway dashboard पर आने के बाद:

1. **"New Project"** button दिखेगा
2. Click करो
3. **"Deploy from GitHub repo"** option select करो
4. अपना GitHub repository authorize करो (पहली बार)
5. अपना repository select करो: `pathariya-panchayat-website`
6. **"Deploy"** button दाबो

Railway automatically deploy करने लगेगा।

**⏳ Wait करो** - 3-5 minutes लगेगा deploy होने में।

---

### Step 2.3: Railway में Environment Variables Add करो

Deploy हो जाने के बाद:

1. **Railway Dashboard** में अपना project खोलो
2. **"Variables"** tab पर जाओ (left sidebar में)
3. **"New Variable"** या **"+ Add"** button दाबो

**यह 7 variables add करो** (एक-एक करके):

```
1. KEY: PORT
   VALUE: 5000

2. KEY: NODE_ENV
   VALUE: production

3. KEY: VAPID_PUBLIC_KEY
   VALUE: (backend/vapid-keys.json से copy करो)

4. KEY: VAPID_PRIVATE_KEY
   VALUE: (backend/vapid-keys.json से copy करो)

5. KEY: VAPID_SUBJECT
   VALUE: mailto:admin@panchayat.local

6. KEY: ADMIN_PASSWORD
   VALUE: YourSecurePassword@2024

7. KEY: CORS_ORIGIN
   VALUE: https://your-vercel-url.vercel.app
   (Vercel deploy के बाद update करेंगे)
```

**Important**: VAPID keys को कहाँ से copy करें:
```bash
cd backend
cat vapid-keys.json
```

यह command run करके दोनों keys copy करो।

---

### Step 2.4: Railway Deployment URL Copy करो

Variables add करने के बाद:

1. **Railway Dashboard** पर जाओ
2. **"Settings"** या project name के पास look करो
3. **Deployment URL** दिखेगा - कुछ ऐसा:
```
https://your-app-abc123.railway.app
```

**📝 इस URL को note करो - Vercel में use होगा!**

---

## 3️⃣ Vercel Account Setup

### Step 3.1: Vercel Account Banao

**Link**: https://vercel.com

1. https://vercel.com खोलो
2. **"Sign Up"** button दिखेगा (top-right)
3. **"Continue with GitHub"** select करो
4. GitHub से authorize करो
5. **Vercel account बन जाएगा**

---

### Step 3.2: Vercel में GitHub Repository Import करो

Vercel dashboard पर:

1. **"Add New..."** button
2. **"Project"** select करो
3. **"Import Git Repository"** select करो
4. **अपना GitHub repository search करो**:
   - `pathariya-panchayat-website` search करो
   - Select करो

---

### Step 3.3: Vercel Configuration करो

Repository select करने के बाद form आएगा:

```
Project Name: pathariya-panchayat-website
(या कोई भी नाम)

Framework: Vite ✓ (auto-detect होगा)
Build Command: npm run build ✓
Output Directory: dist ✓
Install Command: npm install ✓
```

सब कुछ correct होगा! सिर्फ Environment Variables add करो:

**"Environment Variables"** section में:

```
Name: VITE_API_URL
Value: https://your-railway-url.railway.app

(Railway URL वहाँ paste करो जो Step 2.4 में copy किया था)
```

---

### Step 3.4: Vercel Deploy करो

सब settings के बाद:

1. **"Deploy"** button दाबो
2. **Wait करो** - build हो रहा है (2-3 minutes)
3. ✅ **"Congratulations! Your project has been successfully deployed"** message आएगा
4. **Deployment URL copy करो** - कुछ ऐसा:
```
https://your-domain.vercel.app
```

---

## 4️⃣ Local Git Configuration

अब अपने computer पर code को GitHub से connect करना है।

### Step 4.1: Git Configuration करो

PowerShell खोलो और यह commands run करो:

```bash
git config --global user.name "Your Name"
```
(अपना नाम लिखो - example: "Sachi Sharma")

```bash
git config --global user.email "your-email@example.com"
```
(वही email use करो जो GitHub पर registered है)

**✅ Check करो:**
```bash
git config --global user.name
git config --global user.email
```

यह दोनों सही दिखेंगे तो ठीक है।

---

### Step 4.2: Project Directory में जाओ

```bash
cd "C:\Users\sachi\OneDrive\Desktop\website"
```

---

### Step 4.3: Git Repository Initialize करो

```bash
git init
```

यह command एक `.git` folder बनाएगा (hidden folder)।

---

### Step 4.4: Remote Repository Link करो

Step 1.3 में जो GitHub URL copy किया था, उसे यहाँ use करो:

```bash
git remote add origin https://github.com/YOUR_USERNAME/pathariya-panchayat-website.git
```

**Important**: `YOUR_USERNAME` को अपने GitHub username से replace करो!

Example:
```bash
git remote add origin https://github.com/sachi-sharma/pathariya-panchayat-website.git
```

---

## 5️⃣ Push Code to GitHub

### Step 5.1: Add All Files

```bash
git add .
```

यह सब files को "staging" area में लाएगा।

---

### Step 5.2: Commit करो

```bash
git commit -m "Initial commit - deployment ready"
```

यह एक snapshot save करेगा।

---

### Step 5.3: Push to GitHub

```bash
git push -u origin main
```

**⚠️ Agar error आए तो:**
```
fatal: 'main' does not exist on remote
```

तो यह command चलाओ:
```bash
git branch -M main
git push -u origin main
```

---

### Step 5.4: Verify कर लो

GitHub website पर अपना repository खोलो:
```
https://github.com/YOUR_USERNAME/pathariya-panchayat-website
```

**✅ सब files दिखेंगी वहाँ!**

---

## 6️⃣ Deploy to Railway

यह सब तैयार है (Step 2 में किया था), बस verify करो:

### Railway Deployment Status Check करो

1. Railway.app खोलो
2. अपना project खोलो
3. **Deployments** tab में latest deployment check करो
4. **Status**: `✓ Success` होना चाहिए

**If Failed:**
- Click करो failed deployment पर
- **Logs** check करो
- Error message दिखेगी

---

## 7️⃣ Deploy to Vercel

यह भी complete है (Step 3 में किया था):

### Vercel Deployment Status Check करो

1. Vercel dashboard खोलो
2. अपना project खोलो
3. Latest deployment status check करो
4. **Status**: `✓ Production` होना चाहिए
5. **Domain**: आपका Vercel URL है

---

## 8️⃣ Connect Them Together

यह सबसे important step है!

### Step 8.1: Railway में Vercel URL Update करो

अब जब दोनों live हैं:

1. **Railway Dashboard** खोलो
2. अपना project खोलो
3. **Variables** tab पर जाओ
4. **CORS_ORIGIN** variable खोजो
5. Value को update करो:

```
पुरानी value: https://your-domain.vercel.app

नई value: https://YOUR_ACTUAL_VERCEL_URL.vercel.app
```

(Vercel URL जो Step 3.4 में copy किया था)

6. **Save** करो

Railway automatically redeploy करेगा।

---

### Step 8.2: Test करो

अब सब कुछ connected है! Test करो:

**Browser में Vercel URL खोलो:**
```
https://your-domain.vercel.app
```

**Browser Console में (F12 दबाओ):**
```javascript
console.log(import.meta.env.VITE_API_URL)
// Should show Railway URL
```

**Network Tab में (F12 → Network):**
- कोई भी page action करो
- Network requests दिखेंगी
- API calls Railway URL पर जा रही हैं?
- Status 200 होनी चाहिए

---

## ✅ Final Verification Checklist

- [ ] GitHub account बना लिया?
- [ ] Railway account बना लिया?
- [ ] Vercel account बना लिया?
- [ ] Code GitHub पर push हो गया?
- [ ] Railway deployment success?
- [ ] Vercel deployment success?
- [ ] Railway URL में Vercel URL CORS_ORIGIN में set है?
- [ ] Browser में Vercel URL open हो रहा है?
- [ ] No console errors?
- [ ] API calls Railway URL पर जा रही हैं?

**✅ सब ✓ हैं तो आप LIVE हो!** 🚀

---

## 🔗 Quick Links

| Platform | Link | Username |
|----------|------|----------|
| GitHub | https://github.com | __________ |
| Railway | https://railway.app | __________ |
| Vercel | https://vercel.com | __________ |

(अपने usernames यहाँ fill करो - याद रखने के लिए)

---

## 🆘 Common Issues

### Issue: "git push" करते समय authentication error

**Solution:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

फिर से try करो।

---

### Issue: Railway deployment failed

**Solution:**
1. Railway Dashboard → Logs check करो
2. Error message पढ़ो
3. TROUBLESHOOTING_DEPLOYMENT.md देख लो

---

### Issue: CORS error browser में

**Solution:**
Railway → Variables → CORS_ORIGIN exactly match करना चाहिए Vercel URL से।

---

## 📞 Need Help?

Read करो:
- **DEPLOYMENT_GUIDE.md** - Detailed guide
- **TROUBLESHOOTING_DEPLOYMENT.md** - Issues & solutions
- **ENV_VARIABLES_REFERENCE.md** - Environment variables help

---

**Status**: ✅ Complete Setup Guide Ready

अब आप completely ready हो deployment के लिए!
