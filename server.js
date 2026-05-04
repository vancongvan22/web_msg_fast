const app = require('./api/index'); // Lấy cấu hình từ file api/index.js
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`--- WEB_MSG ĐANG CHẠY ---`);
    console.log(`Link xem web: http://localhost:${PORT}`);
    console.log(`Bấm Ctrl + C để dừng server`);
});