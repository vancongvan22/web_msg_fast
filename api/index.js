const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

// API lấy danh sách tin tức
app.get('/api/news', (req, res) => {
    try {
        // process.cwd() giúp lấy đúng thư mục gốc dù chạy ở local hay Vercel
        const dataPath = path.join(process.cwd(), 'data.json');
        const jsonData = fs.readFileSync(dataPath, 'utf-8');
        res.json(JSON.parse(jsonData));
    } catch (error) {
        res.status(500).json({ error: "Không thể đọc file data.json", detail: error.message });
    }
});

// Phục vụ các file tĩnh trong thư mục public
app.use(express.static(path.join(process.cwd(), 'public')));

// Trả về file index.html cho mọi đường dẫn không phải API (hỗ trợ Single Page App)
app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

module.exports = app;