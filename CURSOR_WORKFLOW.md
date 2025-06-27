# 🚀 Cursor AI Workflow Guide

## 📋 **Primary Cursor Prompt (Copy & Paste)**

```
Act as my project co-pilot. My main project folder is called `chattyai-calendar-bot` and is open in Cursor.

I want you to ONLY edit files in this folder (not in Notepad or other places).

Whenever I say 'update the code' or 'add this to my project,' you should:
* Make changes directly in the code files inside the Cursor editor
* Tell me exactly what file(s) you updated (and show a summary of changes)
* Remind me to save, commit, and push to GitHub after making edits
* If it's about credentials or tokens, remind me to update them in Render's Environment, not as a file

If you see duplicate or out-of-sync files, tell me how to clean them up.

If I need to run any command (like git, npm, or node), give me the **exact command** to type in my terminal in this folder.

If I ever say 'show me my current files,' list what's in my project.

When you edit, show me the new/changed lines with comments if needed.

You are now my project assistant—keep everything organized, in one place, and guide me step by step.

Confirm you understand and ask what code or file I want to change next.
```

---

## 🔧 **Short Version (Quick Commands)**

```
Only edit files in my Cursor project folder (`chattyai-calendar-bot`), never in Notepad.
Guide me step by step for every change and remind me to commit/push after edits.
Show all changed lines when you update code.
```

---

## 📁 **Current Project Structure**

```
chattyai-calendar-bot/
├── google-calendar-api.js    # Main API server
├── vapi-plugin.js           # Vapi integration
├── package.json             # Dependencies
├── .gitignore              # Git exclusions
├── README.md               # Main documentation
├── RENDER_SETUP_GUIDE.md   # Render deployment guide
├── QUICK_REFERENCE.md      # Quick setup reference
└── CURSOR_WORKFLOW.md      # This file
```

---

## 🎯 **Common Cursor Commands**

### **Show Current Files**
```
"show me my current files"
```

### **Update Code**
```
"update the code to add [feature]"
"add this to my project: [code snippet]"
```

### **Check Status**
```
"what's the current status of my project?"
"show me what files have been modified"
```

### **Deploy Changes**
```
"help me commit and push these changes"
"deploy to Render"
```

---

## 🔄 **Development Workflow**

### **1. Make Changes**
- Use Cursor AI to edit files
- AI shows you exactly what changed
- Save files in Cursor

### **2. Test Locally**
```bash
npm start
# Test at http://localhost:3000/get-availability
```

### **3. Commit & Push**
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

### **4. Deploy to Render**
- Changes auto-deploy from GitHub
- Check Render dashboard for status
- Test live URL

---

## 🚨 **Important Reminders**

### **Never Edit These Files:**
- ❌ `credentials.json` (use Render env vars)
- ❌ `token.json` (use Render env vars)
- ❌ Any file outside the project folder

### **Always Update These:**
- ✅ `google-calendar-api.js` (main API)
- ✅ `vapi-plugin.js` (Vapi integration)
- ✅ `package.json` (dependencies)
- ✅ Documentation files

### **Environment Variables (Render Only):**
- `GOOGLE_CREDENTIALS` = contents of credentials.json
- `GOOGLE_TOKEN` = contents of token.json
- `PORT` = 10000 (Render default)

---

## 🎯 **Pro Tips**

### **1. Use Cursor's AI for:**
- Code reviews and improvements
- Bug fixes and debugging
- Adding new features
- Documentation updates
- Testing suggestions

### **2. Keep Organized:**
- One feature per commit
- Clear commit messages
- Update documentation with changes
- Test before pushing

### **3. Deployment Checklist:**
- ✅ Code works locally
- ✅ All files committed
- ✅ Pushed to GitHub
- ✅ Render deployment successful
- ✅ Live API tested

---

## 📞 **Troubleshooting**

### **Cursor Not Editing Right Files:**
- Make sure you're in the correct folder
- Use the full prompt above
- Check file paths are correct

### **Changes Not Saving:**
- Save files manually (Ctrl+S)
- Check Cursor's file explorer
- Verify you're editing the right project

### **Git Issues:**
- Check current branch: `git branch`
- Check status: `git status`
- Check remote: `git remote -v`

---

## 🎉 **Success Indicators**

✅ Cursor edits files in your project folder  
✅ Changes are saved and committed  
✅ Code deploys successfully to Render  
✅ API endpoints work as expected  
✅ Documentation stays up-to-date  

---

## 📚 **Next Steps**

1. **Copy the primary prompt** into Cursor
2. **Test with a small change** (add a comment)
3. **Follow the workflow** for all future edits
4. **Keep this guide handy** for reference

**You're now using AI like a pro developer! 🚀** 