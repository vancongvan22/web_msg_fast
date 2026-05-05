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

        grid.innerHTML = newsList.map(item => `
            <div class="bg-white rounded-2xl shadow-sm border overflow-hidden hover:shadow-md transition-all flex flex-col h-full">
                <img src="${item.image}" class="w-full h-48 object-cover" alt="${item.title}">
                <div class="p-5 flex flex-col flex-grow">
                    <span class="text-xs text-slate-400 mb-2 flex items-center gap-1">
                        <i data-lucide="clock" class="w-3 h-3"></i> ${item.date}
                    </span>
                    <h3 class="font-bold text-slate-900 text-lg mb-3 line-clamp-2">${item.title}</h3>
                    <p class="text-slate-600 text-sm mb-5 line-clamp-3">${item.summary || ''}</p>
                    <div class="mt-auto">
                        <a href="/detail.html?id=${item.id}" class="inline-flex items-center text-sm font-semibold text-teal-700 hover:text-teal-600 transition-colors">
                            Xem chi tiết <i data-lucide="chevron-right" class="w-4 h-4 ml-1"></i>
                        </a>
                    </div>
                </div>
            </div>
        `).join('');

        if (paginationContainer && result.totalPages > 1) {
            let paginationHtml = '';
            for (let i = 1; i <= result.totalPages; i++) {
                const isActive = i === result.currentPage;
                paginationHtml += `
                    <button onclick="changePage(${i})" class="px-4 py-2 text-sm font-semibold rounded-lg border transition-all ${isActive ? 'bg-teal-700 text-white border-teal-700' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}">
                        ${i}
                    </button>
                `;
            }
            paginationContainer.innerHTML = paginationHtml;
        } else if (paginationContainer) {
            paginationContainer.innerHTML = '';
        }

        if (typeof lucide !== 'undefined') lucide.createIcons();
        currentPage = page;
    } catch (error) {
        console.error("Lỗi trang chủ:", error);
        grid.innerHTML = '<p class="text-center col-span-full py-10 text-red-500 font-semibold">Lỗi tải danh sách tin tức.</p>';
    }
}

window.changePage = function(page) {
    loadNews(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', () => loadNews(1));