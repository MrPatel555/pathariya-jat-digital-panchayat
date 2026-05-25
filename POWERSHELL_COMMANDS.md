# 🖥️ PowerShell Commands - Copy & Paste Ready

यहाँ exact commands हैं जो आप PowerShell में copy-paste कर सकते हो। **एक-एक करके चलाओ।**

---

## 📋 Order of Commands

```
Step 1: Git Configuration
Step 2: Initialize Repository
Step 3: Add Files
Step 4: Commit
Step 5: Push to GitHub
```

---

## ✅ Step 1: Git Configuration

यह commands सिर्फ पहली बार run करने हैं:

```powershell
git config --global user.name "Your Full Name"
```

**Replace करो**: `Your Full Name` को अपना नाम से (example: "Sachi Sharma")

```powershell
git config --global user.email "your-email@gmail.com"
```

**Replace करो**: `your-email@gmail.com` को अपने GitHub email से

**Check कर लो:**
```powershell
git config --global user.name
git config --global user.email
```

दोनों सही show होने चाहिए।

---

## ✅ Step 2: Navigate to Project & Initialize Git

```powershell
cd "C:\Users\sachi\OneDrive\Desktop\website"
```

**Check करो:**
```powershell
pwd
```
(Path show होगा)

**अब Git repository initialize करो:**
```powershell
git init
```

**Output:** `Initialized empty Git repository in C:\Users\sachi\OneDrive\Desktop\website\.git`

---

## ✅ Step 3: Add Remote Repository

```powershell
git remote add origin https://github.com/YOUR_USERNAME/pathariya-panchayat-website.git
```

**IMPORTANT**: `YOUR_USERNAME` को अपने GitHub username से replace करो!

**Example:**
```powershell
git remote add origin https://github.com/sachi-sharma/pathariya-panchayat-website.git
```

**Verify करो:**
```powershell
git remote -v
```

दोनों origin URLs show होनी चाहिए।

---

## ✅ Step 4: Add All Files

```powershell
git add .
```

**Check करो कि कितनी files added हैं:**
```powershell
git status
```

Output में "Changes to be committed:" लिखा होगा और सब files green दिखेंगी।

---

## ✅ Step 5: Commit Files

```powershell
git commit -m "Initial commit - deployment ready"
```

**Output example:**
```
[main (root-commit) abc1234] Initial commit - deployment ready
 45 files changed, 1500 insertions(+)
 create mode 100644 package.json
 ...etc
```

---

## ✅ Step 6: Push to GitHub

```powershell
git push -u origin main
```

**First time दे सकता है:**
```
fatal: 'main' does not exist on remote
```

**अगर ऐसा हो तो:**

```powershell
git branch -M main
```

फिर फिर से push करो:
```powershell
git push -u origin main
```

**Success output:**
```
Enumerating objects: 45, done.
Counting objects: 100% (45/45), done.
...
To https://github.com/your-username/pathariya-panchayat-website.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## 🔄 Future Commits (अगली बार code update करते हो)

अगली बार जब code update करो:

```powershell
# 1. Changes add करो
git add .

# 2. Commit करो
git commit -m "Update message - describe what changed"

# 3. Push करो
git push
```

**That's it!** Railway और Vercel automatically redeploy कर देंगे।

---

## 📝 VAPID Keys - Extract करने के लिए

Backend folder में जाओ:

```powershell
cd backend
```

File देखो:
```powershell
cat vapid-keys.json
```

**Output कुछ ऐसा होगा:**
```json
{
  "publicKey": "BCk3xY...longstringhere...==",
  "privateKey": "aB2xGh...longstringhere...=="
}
```

**Copy करो** - Railway में paste करने के लिए।

फिर वापस main folder में आ जाओ:
```powershell
cd ..
```

---

## 🚀 Quick Copy-Paste Complete Flow

सब commands एक साथ (पर एक-एक करके चलाते समय wait करो):

```powershell
# 1. Configuration
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"

# 2. Go to project
cd "C:\Users\sachi\OneDrive\Desktop\website"

# 3. Initialize
git init

# 4. Add remote (REPLACE YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pathariya-panchayat-website.git

# 5. Add all files
git add .

# 6. Commit
git commit -m "Initial commit - deployment ready"

# 7. Push to GitHub
git push -u origin main
```

---

## ✅ Verification Commands

Code push होने के बाद verify करने के लिए:

```powershell
# Check current branch
git branch

# Check remote
git remote -v

# Check status
git status

# See commit history
git log --oneline
```

---

## 🆘 If Something Goes Wrong

### Error: "fatal: 'main' does not exist on remote"

```powershell
git branch -M main
git push -u origin main
```

---

### Error: "fatal: remote origin already exists"

```powershell
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/pathariya-panchayat-website.git
```

---

### Error: "permission denied" या authentication issues

```powershell
# Clear git credentials
git credential reject
git config --global user.name "Your Name"
git config --global user.email "your-email@gmail.com"

# Try again
git push -u origin main
```

---

### Check Git Configuration

```powershell
git config --list
```

---

## 📱 Useful Commands to Remember

```powershell
# See what changed
git status

# See changes in detail
git diff

# See commit history
git log

# Go back to last commit (if you messed up)
git reset --hard HEAD

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout main

# Delete branch
git branch -d branch-name
```

---

## 🔐 Security Notes

**NEVER** करो:
```powershell
❌ git add .env
❌ git commit .env
❌ git push secrets
```

यह files पहले से `.gitignore` में हैं, तो सुरक्षित हो।

---

## 📋 Checklist

- [ ] Git configured locally
- [ ] GitHub account created
- [ ] GitHub repo created
- [ ] Remote origin added
- [ ] All files added to git
- [ ] Commit done
- [ ] Pushed to GitHub
- [ ] Railway deployed
- [ ] Vercel deployed
- [ ] URLs connected

---

## 🎯 Next Steps After Push

1. **GitHub**: https://github.com/YOUR_USERNAME/pathariya-panchayat-website
   - Check if files are there ✓

2. **Railway**: https://railway.app
   - Check if deployment is "Success" ✓
   - Check if variables are set ✓
   - Copy Railway URL ✓

3. **Vercel**: https://vercel.com
   - Check if deployment is "Production" ✓
   - Copy Vercel URL ✓

4. **Connect**: 
   - Railway CORS_ORIGIN = Vercel URL
   - Redeploy Railway ✓

5. **Test**:
   - Open Vercel URL in browser ✓
   - Check console for errors ✓
   - Check Network tab for API calls ✓

---

**Ready?** Copy-paste commands एक-एक करके और follow करो! 🚀
