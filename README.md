# Day 1: Environment Setup & Express Hello World Server
## Full Stack Web Development Internship — Simple Blog Management System

### 📌 Overview
This repository contains the setup for **Day 1** of the Full Stack Web Development Internship. The goal for Day 1 is to establish the development environment, initialize the project repository, configure an Express.js web server, and verify that the Hello World REST endpoint operates correctly.

---

### 🚀 Tasks Completed
1. ✅ **Environment Tools**: Verified installation & configuration for VS Code, Node.js, Git, and Postman.
2. ✅ **Project Initialization**: Created project structure and initialized `package.json`.
3. ✅ **Express Setup**: Installed `express`, `cors`, and `dotenv`.
4. ✅ **Hello World Server**: Built `server.js` with Express GET endpoints responding with structured JSON data.
5. ✅ **Interactive Tester**: Added modern frontend UI in `public/index.html` to easily test endpoints in browser.
6. ✅ **Version Control**: Initialized Git repository with `.gitignore`.
7. ✅ **Postman Integration**: Added `blog-api.postman_collection.json` ready for Postman import and testing.

---

### 🛠️ How to Run the Project

1. **Navigate to project folder**:
   ```bash
   cd C:\Users\BHAVIKPATHAK\.gemini\antigravity\scratch\blog-management-system
   ```

2. **Install dependencies** *(if not already installed)*:
   ```bash
   npm install
   ```

3. **Start the Express server**:
   ```bash
   npm start
   # or with nodemon auto-reload:
   npm run dev
   ```

4. **Access in Browser / Postman**:
   - Web App UI & Tester: `http://localhost:5000`
   - Hello World API Endpoint: `http://localhost:5000/api`
   - Greeting API Endpoint: `http://localhost:5000/api/hello`
   - Server Health Check: `http://localhost:5000/api/status`

---

### 📮 Postman Verification Instructions
1. Open **Postman**.
2. Click **Import** -> Select `blog-api.postman_collection.json`.
3. Execute `GET http://localhost:5000/api`.
4. Confirm `200 OK` status and Hello World JSON payload.

---

### 📤 Google Form Submission Info
- **GitHub Profile**: [Bhavikpathak8](https://github.com/Bhavikpathak8)
- **GitHub Repository**: [internship_project](https://github.com/Bhavikpathak8/internship_project)
- **Push to GitHub**:
  ```bash
  cd C:\Users\BHAVIKPATHAK\Desktop\blog-management-system
  git push -u origin main
  ```
- **Task Outcome**: Express server runs successfully on port `5000`.
