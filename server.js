const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// Root Endpoint - Hello World Response
app.get('/api', (req, res) => {
    res.json({
        message: "Hello World! Express server is up and running.",
        task: "Day 1 – Environment Setup & Express Initialization",
        internship: "Full Stack Web Development Internship",
        project: "Simple Blog Management System",
        status: "Success",
        timestamp: new Date().toISOString()
    });
});

// Additional API Endpoints for testing
app.get('/api/hello', (req, res) => {
    res.json({
        success: true,
        greeting: "Hello World!",
        description: "Welcome to the Simple Blog Management System API.",
        environment: "Node.js & Express",
        day: 1
    });
});

app.get('/api/status', (req, res) => {
    res.json({
        status: "ONLINE",
        uptime: process.uptime(),
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        timestamp: new Date().toISOString()
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Day 1 Express Server Running!`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📌 API Endpoint: http://localhost:${PORT}/api`);
    console.log(`====================================================`);
});
