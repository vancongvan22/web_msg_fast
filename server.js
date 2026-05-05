// server.js
const express = require('express');
const path = require('path');
const apiRouter = require('./api/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Nhúng các tuyến đường API Backend
app.use(apiRouter);

// 2. Chỉ định thư mục chứa giao diện Frontend tĩnh
app.use(express.static(path.join(__dirname, 'public')));

// Phòng vệ: Điều hướng các link gõ sai về trang chủ index.html
app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next();
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 Server vận hành tại: http://localhost:${PORT}`);
    console.log(`====================================================`);
});