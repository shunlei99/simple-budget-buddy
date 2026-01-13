// Import Express
// const express = require('express');
// server.js
import express from 'express';

const app = express();

// Define the port (use environment variable if available)
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello, Node.js Web App is running!');
});

// Example API route
app.get('/api/data', (req, res) => {
    res.json({ message: 'This is sample JSON data', time: new Date() });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('404 - Not Found');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
