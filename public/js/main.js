// public/js/main.js
let currentPage = 1;
const limit = 6;

async function loadNews(page = 1) {
    const grid = document.getElementById('news-grid');
    const paginationContainer = document.getElementById('pagination');
    if (!grid) return;

    try {
        const response = await fetch(`/api/news?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Lỗi kết nối danh sách');
        
        const result = await response.json();
        const newsList = result.data || [];
        
        if (newsList.length === 0) {
            grid.innerHTML = '<p class="text-center col-span-full py-10 text-slate-500">Chưa có bài viết nào.</p>';
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        // Render danh sách bài viết
        grid.innerHTML = newsList.map(item => `
            <div class="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                <img src="${item.image}" class="w-full h-48 object-cover" alt="${item.title}">
                <div class="p-5 flex flex-col flex-grow">
                    <span class="text-xs text-slate-400 mb-2 flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3"></i> ${item.date}
                    </span>
                    <h3 class="font-bold text-slate-900 text-lg mb-3 line-clamp-2">${item.title}</h3>
                    <p class="text-slate-600 text-sm mb-5 line-clamp-3">${item.summary || ''}</p>
                    <div class="mt-auto pt-3 border-t">
                        <a href="/detail.html?id=${item._id}" class="inline-flex items-center text-sm font-semibold text-teal-800 hover:text-teal-600 transition-colors">
                            Xem chi tiết <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        // Render các nút phân trang
        if (paginationContainer && result.totalPages > 1) {
            let paginationHtml = '';
            for (let i = 1; i <= result.totalPages; i++) {
                const isActive = i === result.currentPage;
                // Cập nhật màu nút Active sang bg-teal-800 để đồng bộ với giao diện mới
                paginationHtml += `
                    <button onclick="changePage(${i})" class="px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${isActive ? 'bg-teal-800 text-white border-teal-800' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}">
                        ${i}
                    </button>
                `;
            }
            paginationContainer.innerHTML = paginationHtml;
        } else if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        // Kích hoạt Icon Lucide cho các thẻ bài viết vừa được render động
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        currentPage = page;
    } catch (error) {
        console.error("Lỗi trang chủ:", error);
        grid.innerHTML = '<p class="text-center col-span-full py-10 text-red-500 font-semibold">Lỗi tải danh sách tin tức.</p>';
    }
}

// Hàm chuyển trang toàn cục
window.changePage = function(page) {
    loadNews(page);
    // Cuộn mượt xuống phân khu tin tức thay vì cuộn lên đầu banner
    const newsGrid = document.getElementById('news-grid');
    if (newsGrid) {
        newsGrid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

// Chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', () => {
    loadNews(1);
});