# 🔐 Production Secrets Management

Yeh document mein sensitive data (VAPID keys, passwords, API keys) ko safely manage karne ke tarike hain.

---

## ⚠️ Important Rules

1. **NEVER** commit `.env` files to GitHub
2. **NEVER** put secrets in code/comments
3. **NEVER** share VAPID private keys
4. **ALWAYS** use environment variables for secrets
5. **ALWAYS** rotate keys periodically

---

## 🔑 VAPID Keys Management

### What are VAPID Keys?

VAPID keys (Voluntary Application Server Identification) push notifications ke liye zaruri hain:
- **Public Key**: Frontend mein use hota hai (safe)
- **Private Key**: Backend mein use hota hai (sensitive!)

### Generate New VAPID Keys

```bash
cd backend
node -e "
const webpush = require('web-push');
const fs = require('fs');
const keys = webpush.generateVAPIDKeys();
fs.writeFileSync('vapid-keys.json', JSON.stringify(keys, null, 2));
console.log(JSON.stringify(keys, null, 2));
"
```

Output example:
```json
{
  "publicKey": "BCk3..." ,
  "privateKey": "aB2x..."
}
```

### Store VAPID Keys

**☑️ Where to store (SAFE):**
- Password manager (1Password, LastPass, Bitwarden)
- Secure notes application
- Railway/Vercel environment variables (encrypted)
- Company secrets vault

**❌ Where NOT to store:**
- GitHub (even in private repos)
- Email
- Plain text files
- Screenshots

---

## 🔒 Environment Variables Setup

### Option 1: Railway Dashboard (Recommended)

1. Railway app dashboard open karein
2. "Variables" tab click karein
3. "Add Variable" button
4. Key-value pairs enter karein:

```
VAPID_PUBLIC_KEY = BCk3C_qL8d...
VAPID_PRIVATE_KEY = aB2xGh7kJ...
CORS_ORIGIN = https://your-domain.vercel.app
NODE_ENV = production
```

5. "Deploy" button (auto-redeploy with new vars)

### Option 2: Vercel Dashboard

1. Project settings open karein
2. "Environment Variables" section
3. Add variables:

```
VITE_API_URL = https://your-railway-app.railway.app
```

4. Redeploy needed nahi - next build se automatically pick up hoga

### Option 3: Local Development

Create `backend/.env`:
```
PORT=5000
NODE_ENV=development
VAPID_PUBLIC_KEY=your_public_key
VAPID_PRIVATE_KEY=your_private_key
ADMIN_PASSWORD=local_password
```

**⚠️ .gitignore mein ensure karo `.env` hai!**

---

## 🔄 Rotating Secrets

### When to rotate?

- [ ] Quarterly (3 months)
- [ ] After team member leaves
- [ ] After security incident
- [ ] Database breach detected
- [ ] Suspected unauthorized access

### How to rotate VAPID Keys

**Step 1: Generate new keys**
```bash
node -e "
const webpush = require('web-push');
const keys = webpush.generateVAPIDKeys();
console.log('New Public:', keys.publicKey);
console.log('New Private:', keys.privateKey);
"
```

**Step 2: Update Railway**
- Railway Dashboard → Variables
- Update `VAPID_PUBLIC_KEY` with new value
- Update `VAPID_PRIVATE_KEY` with new value
- Save (auto-redeploy)

**Step 3: Update Frontend (if deployed)**
- Vercel mein check if public key hardcoded hai
- Update karo agar zaruri ho
- Redeploy karo

**Step 4: Notify users**
- Existing subscriptions will automatically update
- Or send push notification asking to resubscribe

**Step 5: Old keys delete karein**
- Password manager se old keys remove karo
- Safe backup maintain karo (encrypted)

---

## 🔐 Password Management

### Admin Password

```bash
# Strong password requirements:
# - Minimum 12 characters
# - Uppercase letters (A-Z)
# - Lowercase letters (a-z)
# - Numbers (0-9)
# - Special characters (!@#$%^&*)

# Example:
Panchayat@2024#Secure!

# Railroad: admin@panchayat.local
# Environment: ADMIN_PASSWORD
```

### Store Admin Password

1. Password manager mein store karein
2. Team lead ko share karein (securely)
3. Monthly change karein
4. Never email mein bhejein

---

## 📝 Secrets Checklist

| Secret | Where | Stored | Rotation |
|--------|-------|--------|----------|
| VAPID Public | Frontend + Railway | Environment Var | Quarterly |
| VAPID Private | Backend (Railway) | Environment Var | Quarterly |
| Admin Password | Railway | Environment Var | Monthly |
| CORS_ORIGIN | Railway | Environment Var | As needed |
| API_URL | Vercel | Environment Var | As needed |
| Database URL | Railway | Environment Var | As needed |

---

## 🆘 Emergency - Compromised Secrets

### If VAPID Private Key compromised:

1. ⏸️ Stop accepting notifications temporarily
2. 🔄 Generate new VAPID keys immediately
3. 📋 Update all deployment configs
4. 🚀 Redeploy immediately
5. 📣 Notify all users
6. 📊 Audit logs check karein

### If Admin Password compromised:

1. 🔒 Change password immediately
2. 📊 Check recent admin activities
3. 🔄 Update password in Railway
4. 📝 Note the incident (security log)
5. 🔐 Enable 2FA if available

### If GitHub token compromised:

1. 🔑 Regenerate GitHub token
2. 🚫 Revoke old token
3. 📋 Update Railway/Vercel GitHub connections
4. 🔄 Reconnect to GitHub
5. 📊 Check recent commits

---

## 🛡️ Best Practices

### Do's ✅
- [ ] Use strong, unique passwords
- [ ] Store secrets in password managers
- [ ] Rotate secrets quarterly
- [ ] Use environment variables
- [ ] Enable 2FA on all accounts
- [ ] Review access logs monthly
- [ ] Backup secrets securely
- [ ] Document rotation schedule

### Don'ts ❌
- [ ] Don't commit `.env` files
- [ ] Don't share secrets via email
- [ ] Don't hardcode secrets in code
- [ ] Don't use weak passwords
- [ ] Don't reuse secrets across projects
- [ ] Don't screenshot passwords
- [ ] Don't tell anyone passwords
- [ ] Don't leave secrets unencrypted

---

## 🔑 Quick Reference

### Access Secrets

```bash
# View Railway environment variables
railway variables

# View Vercel environment variables
vercel env list
```

### Update Secrets

```bash
# Railway
railway variables set KEY VALUE

# Vercel
vercel env set KEY VALUE
```

### Remove Old Secrets

```bash
# Railway
railway variables delete KEY

# Vercel
vercel env rm KEY
```

---

## 📞 Need Help?

- **Railway Security**: https://docs.railway.app/
- **Vercel Security**: https://vercel.com/docs/concepts/projects/environment-variables
- **VAPID Keys**: https://web.dev/push-notifications-web-push-protocol/

---

**Last Reviewed**: May 2026
**Next Review**: August 2026
