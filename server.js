const express = require('express');
const multer = require('multer'); // For handling file uploads
const fs = require('fs'); // File system for managing files
const path = require('path'); // Path module for file handling
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const port = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// ===== FILE STORAGE SYSTEM =====

// Set up storage
const upload = multer({ dest: 'uploads/' }); // Files are saved in the "uploads" folder

// API to upload files
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    console.log(`📂 File uploaded: ${req.file.originalname}`);

    res.json({ filename: req.file.originalname, filepath: `/uploads/${req.file.filename}` });
});

// API to list all files
app.get('/files', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) return res.status(500).json({ error: "Unable to fetch files." });
        res.json({ files });
    });
});

// API to delete a file
app.delete('/delete/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).json({ error: "Failed to delete file." });
        console.log(`🗑️ Deleted file: ${filename}`);
        res.json({ success: true });
    });
});

// Start the server
http.listen(port, () => {
    console.log(`🚀 Server is running at http://localhost:${port}`);
});
