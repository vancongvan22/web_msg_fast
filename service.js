// [
//   {
//     "id": 1,
//     "title": "Khai trương cơ sở mới - Giảm giá 30%",
//     "date": "2024-05-20",
//     "summary": "Chào đón cơ sở thứ 5 của WEB_MSG tại trung tâm thành phố...",
//     "content": "Nội dung chi tiết ở đây...",
//     "image": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500"
//   },
//   {
//     "id": 2,
//     "title": "5 Lợi ích của Massage đá nóng",
//     "date": "2024-05-18",
//     "summary": "Massage đá nóng không chỉ giúp thư giãn mà còn cải thiện tuần hoàn...",
//     "content": "Nội dung chi tiết ở đây...",
//     "image": "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=500"
//   }
// ]
const app = require('./api/index.js'); // Nhập app từ file index.js trong thư mục api
const port = 3000;

// Kiểm tra xem app có tồn tại không trước khi listen
if (app && typeof app.listen === 'function') {
    app.listen(port, () => {
        console.log(`Website đang chạy tại: http://localhost:${port}`);
    });
} else {
    console.error("Lỗi: 'app' không phải là một ứng dụng Express hợp lệ. Kiểm tra lại module.exports trong api/index.js");
}