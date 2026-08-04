# BlogSphere — Simple Blog Management System
## Full Stack Web Development Internship Project (Days 1–14 Completed)

[![Live Website](https://img.shields.io/badge/Live_Site-GitHub_Pages-4f46e5?style=for-the-badge&logo=github)](https://bhavikpathak8.github.io/internship_project/)
[![GitHub Repository](https://img.shields.io/badge/Repository-GitHub-10b981?style=for-the-badge&logo=github)](https://github.com/Bhavikpathak8/internship_project)
[![Tech Stack](https://img.shields.io/badge/Stack-Node.js_|_Express_|_HTML5_|_CSS3_|_Vanilla_JS-7c3aed?style=for-the-badge)](https://github.com/Bhavikpathak8/internship_project)

---

## 📌 Project Overview
**BlogSphere** is a full-featured, responsive **Blog Management Web Application** engineered as part of the Full Stack Web Development Internship curriculum. It features a complete client-server architecture with an Express.js RESTful backend API and a dynamic HTML5/CSS3/Vanilla JavaScript frontend.

- 🌐 **Live Website**: [https://bhavikpathak8.github.io/internship_project/](https://bhavikpathak8.github.io/internship_project/)
- 📦 **GitHub Repository**: [https://github.com/Bhavikpathak8/internship_project](https://github.com/Bhavikpathak8/internship_project)
- 📮 **Postman API Collection**: Included in root directory as `blog-api.postman_collection.json`

---

## ✨ Key Features
- 📝 **Full CRUD Operations**: Create, Read, Update (Edit), and Delete blog posts seamlessly.
- ⚡ **Express REST API Backend**: Modular Express routes with JSON middleware and CORS support.
- 🔍 **Live Search**: Instant client-side search filtering by title, excerpt, or author.
- 🏷️ **Category Filtering**: Interactive category chips (Web Dev, Backend, Node.js, Express, Frontend).
- 📖 **Article Reader Modal**: Read full blog posts in a focused modal overlay with keyboard shortcuts.
- 🎨 **Modern Design & Animations**: Soft light theme, CSS keyframes, micro-interactions, and smooth scrolling.
- 📱 **Fully Responsive Layout**: Mobile-first media queries optimized for smartphones, tablets, and desktops.
- 🚀 **GitHub Pages Deployment**: Deployed and hosted live via GitHub Pages.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/status` | Backend server health check endpoint |
| `GET` | `/api/blogs` | Fetch all blogs (supports `?category=` and `?search=`) |
| `GET` | `/api/blogs/:id` | Fetch a single blog post by ID |
| `GET` | `/api/categories` | Retrieve available blog categories |
| `POST` | `/api/blogs` | Create a new blog post |
| `PUT` | `/api/blogs/:id` | Edit/Update an existing blog post |
| `DELETE` | `/api/blogs/:id` | Delete a blog post by ID |

---

## 🛠️ Technology Stack
- **Frontend**: HTML5, CSS3 (Vanilla CSS with Custom Design System), Vanilla JavaScript (ES6+ Fetch API)
- **Backend**: Node.js, Express.js, CORS, Dotenv
- **Deployment & Hosting**: GitHub Pages, Git, GitHub

---

## 🚀 Local Setup & Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Bhavikpathak8/internship_project.git
   cd internship_project
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Express Server**:
   ```bash
   npm start
   # or with nodemon auto-reload:
   npm run dev
   ```

4. **Access in Browser**:
   - Web App UI: `http://localhost:5000`
   - API Root: `http://localhost:5000/api/blogs`

---

## 🗓️ Internship Development Timeline (Days 1–14)

| Day | Task Milestone | Outcome |
| :--- | :--- | :--- |
| **Day 1** | Environment Setup & Express Server | Hello World Express server on port 5000 |
| **Day 2** | HTML Structure & Core Pages | Built `index.html`, `add-blog.html`, `about.html` |
| **Day 3** | CSS Styling & Theme Tokens | Implemented design system and CSS variables |
| **Day 4** | JavaScript DOM & Form Validation | Built form handlers and local state |
| **Day 5** | Express GET & POST API Endpoints | Implemented JSON payload routes |
| **Day 6** | Create Blog Post Feature | POST endpoint connected to add-blog form |
| **Day 7** | View Blogs & Reader Modal | Built blog grid, live search, and reader modal |
| **Day 8** | Edit Blog Feature | Implemented `PUT /api/blogs/:id` and form pre-fill |
| **Day 9** | Delete Blog Feature | Implemented `DELETE /api/blogs/:id` with toast alerts |
| **Day 10** | Full Frontend Fetch API Integration | Connected all pages with Express backend APIs |
| **Day 11** | Animations & Transitions | Added smooth scrolling and keyframe transitions |
| **Day 12** | Git Management & GitHub Pages | Pushed repository and deployed site live |
| **Day 13** | Responsiveness & Performance | Mobile media queries and image lazy loading |
| **Day 14** | Documentation & Final Submission | Master README, submission package, and Form |

---

## 📄 License & Student Information
- **Developer**: Bhavik Pathak
- **Repository**: [Bhavikpathak8/internship_project](https://github.com/Bhavikpathak8/internship_project)
- **Course**: Full Stack Web Development Internship
