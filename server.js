/* ==========================================================================
   BlogSphere - Day 5: Express.js Backend Server
   Tasks: Express Server with GET & POST Routes, Request Validation & Middleware
   ========================================================================== */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// --------------------------------------------------------------------------
// 1. MIDDLEWARE SETUP
// --------------------------------------------------------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Request Logger Middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

// Serve Static Frontend Files
app.use(express.static(path.join(__dirname, 'public')));

// --------------------------------------------------------------------------
// 2. IN-MEMORY DATABASE (BLOG POSTS DATASET)
// --------------------------------------------------------------------------
let blogs = [
    {
        id: 101,
        title: "Getting Started with Full Stack Web Development",
        author: "Bhavik Pathak",
        category: "Web Dev",
        imageUrl: "images/web_dev.png",
        excerpt: "Learn how modern frontend interfaces communicate seamlessly with backend REST APIs built using Node.js and Express.",
        content: "Full stack web development spans both client-side user interfaces and server-side backend logic. In this guide, HTML5, CSS3, and Vanilla JavaScript construct responsive user interfaces while Node.js and Express handle routing, middleware processing, and REST API data persistence.",
        date: "July 27, 2026",
        readTime: "5 min read",
        createdAt: new Date("2026-07-27T10:00:00Z").toISOString()
    },
    {
        id: 102,
        title: "Building Scalable RESTful APIs with Node.js & Express",
        author: "Bhavik Pathak",
        category: "Express",
        imageUrl: "images/express_backend.png",
        excerpt: "A step-by-step guide to structuring clean routes, middleware handlers, CORS configuration, and JSON endpoint logic.",
        content: "Express.js simplifies Node.js web server development by providing a fast, unopinionated routing framework. Today we explore modular router design, error handling middleware, JSON request body parsing, and status code standards for professional APIs.",
        date: "July 26, 2026",
        readTime: "4 min read",
        createdAt: new Date("2026-07-26T14:30:00Z").toISOString()
    },
    {
        id: 103,
        title: "Designing Responsive UI Components with Semantic HTML5",
        author: "Bhavik Pathak",
        category: "Frontend",
        imageUrl: "images/web_dev.png",
        excerpt: "Master semantic markup, navigation structures, and accessible form inputs to craft user-friendly web applications.",
        content: "Semantic HTML5 tags like header, main, nav, section, article, and footer improve document structure, SEO indexing, and screen reader accessibility. Pair them with modern CSS Flexbox and Grid layouts to create responsive components for any viewport.",
        date: "July 25, 2026",
        readTime: "6 min read",
        createdAt: new Date("2026-07-25T09:15:00Z").toISOString()
    }
];

// Initial seed copy for resetting
const initialSeedBlogs = [...blogs];

// --------------------------------------------------------------------------
// 3. FRONTEND PAGE ROUTES
// --------------------------------------------------------------------------
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/add-blog', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'add-blog.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

// --------------------------------------------------------------------------
// 4. DAY 5 EXPRESS GET ROUTES (API ENDPOINTS)
// --------------------------------------------------------------------------

// GET /api - API Health & Server Meta
app.get('/api', (req, res) => {
    res.status(200).json({
        success: true,
        message: "BlogSphere RESTful API is active and running",
        task: "Day 5 – Express.js GET and POST Routes",
        internship: "Full Stack Web Development Internship",
        project: "Simple Blog Management System",
        endpoints: {
            getAllBlogs: "GET /api/blogs",
            getBlogById: "GET /api/blogs/:id",
            createBlog: "POST /api/blogs",
            getCategories: "GET /api/categories",
            serverStatus: "GET /api/status"
        },
        timestamp: new Date().toISOString()
    });
});

// GET /api/status - Server Status & Uptime
app.get('/api/status', (req, res) => {
    res.status(200).json({
        success: true,
        status: "ONLINE",
        totalBlogs: blogs.length,
        uptime: `${Math.floor(process.uptime())} seconds`,
        nodeVersion: process.version,
        timestamp: new Date().toISOString()
    });
});

// GET /api/blogs - Get All Blog Posts (Supports ?category= and ?search= queries)
app.get('/api/blogs', (req, res) => {
    const { category, search } = req.query;
    let result = [...blogs];

    // Filter by Category if query parameter provided
    if (category && category !== 'All') {
        result = result.filter(b => b.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search keyword if query parameter provided
    if (search) {
        const query = search.toLowerCase();
        result = result.filter(b =>
            b.title.toLowerCase().includes(query) ||
            b.excerpt.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query)
        );
    }

    res.status(200).json({
        success: true,
        count: result.length,
        total: blogs.length,
        data: result
    });
});

// GET /api/blogs/:id - Get Single Blog Post by ID
app.get('/api/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id, 10);
    const blog = blogs.find(b => b.id === blogId);

    if (!blog) {
        return res.status(404).json({
            success: false,
            error: "Blog post not found",
            requestedId: blogId
        });
    }

    res.status(200).json({
        success: true,
        data: blog
    });
});

// GET /api/categories - Get Available Blog Categories
app.get('/api/categories', (req, res) => {
    const categories = ['All', ...new Set(blogs.map(b => b.category))];
    res.status(200).json({
        success: true,
        categories: categories
    });
});

// --------------------------------------------------------------------------
// 5. DAY 5 EXPRESS POST ROUTES (API ENDPOINTS)
// --------------------------------------------------------------------------

// POST /api/blogs - Create New Blog Post (with server-side validation)
app.post('/api/blogs', (req, res) => {
    const { title, author, category, imageUrl, excerpt, content } = req.body;

    // Server-Side Request Body Validation
    const errors = [];

    if (!title || title.trim().length < 5) {
        errors.push("Title is required and must be at least 5 characters long.");
    }
    if (!author || author.trim().length < 3) {
        errors.push("Author name is required and must be at least 3 characters long.");
    }
    if (!category || category.trim().length === 0) {
        errors.push("Category selection is required.");
    }
    if (!excerpt || excerpt.trim().length < 10) {
        errors.push("Short excerpt/summary is required and must be at least 10 characters long.");
    }
    if (!content || content.trim().length < 20) {
        errors.push("Full article content is required and must be at least 20 characters long.");
    }

    // Return 400 Bad Request if validation errors exist
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: "Validation failed. Please provide valid fields.",
            errors: errors
        });
    }

    // Calculate estimated reading time
    const wordCount = content.trim().split(/\s+/).length;
    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 180));

    // Construct New Blog Object
    const newBlog = {
        id: Date.now(),
        title: title.trim(),
        author: author.trim(),
        category: category.trim(),
        imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : "images/web_dev.png",
        excerpt: excerpt.trim(),
        content: content.trim(),
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        readTime: `${readTimeMinutes} min read`,
        createdAt: new Date().toISOString()
    };

    // Insert new blog to top of dataset
    blogs.unshift(newBlog);

    console.log(`[Express API] Created New Blog Post: "${newBlog.title}" (ID: ${newBlog.id})`);

    // Return 201 Created Status Response
    res.status(201).json({
        success: true,
        message: "Blog post published successfully!",
        data: newBlog
    });
});

// DELETE /api/blogs/:id - Delete a blog post by ID
app.delete('/api/blogs/:id', (req, res) => {
    const blogId = parseInt(req.params.id, 10);
    const initialCount = blogs.length;
    blogs = blogs.filter(b => b.id !== blogId);

    if (blogs.length === initialCount) {
        return res.status(404).json({
            success: false,
            error: "Blog post not found",
            requestedId: blogId
        });
    }

    console.log(`[Express API] Deleted Blog Post ID: ${blogId}`);

    res.status(200).json({
        success: true,
        message: "Blog post deleted successfully!",
        deletedId: blogId,
        remainingCount: blogs.length
    });
});

// POST /api/blogs/reset - Reset dataset to initial state
app.post('/api/blogs/reset', (req, res) => {
    blogs = [...initialSeedBlogs];
    res.status(200).json({
        success: true,
        message: "Blog database reset to default initial state.",
        count: blogs.length
    });
});

// --------------------------------------------------------------------------
// 6. 404 NOT FOUND HANDLER & ERROR MIDDLEWARE
// --------------------------------------------------------------------------
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: "Route not found",
        path: req.originalUrl
    });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(`[Server Error] ${err.stack}`);
    res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: err.message
    });
});

// --------------------------------------------------------------------------
// 7. START EXPRESS SERVER
// --------------------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Day 5 Express Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📌 API GET Endpoints:`);
    console.log(`   - GET  http://localhost:${PORT}/api/blogs`);
    console.log(`   - GET  http://localhost:${PORT}/api/blogs/:id`);
    console.log(`   - GET  http://localhost:${PORT}/api/categories`);
    console.log(`📌 API POST Endpoints:`);
    console.log(`   - POST http://localhost:${PORT}/api/blogs`);
    console.log(`====================================================`);
});
