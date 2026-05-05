// public/js/component-loader.js

/**
 * Hàm tự động tìm các thẻ có thuộc tính data-component và nạp file html tương ứng
 */
async function loadComponents() {
    const elements = document.querySelectorAll('[data-component]');
    
    // Tạo danh sách các tác vụ nạp component song song để tối ưu tốc độ
    const promises = Array.from(elements).map(async (el) => {
        const componentName = el.getAttribute('data-component');
        try {
            const response = await fetch(`/components/${componentName}.html`);
            if (!response.ok) throw new Error(`Không thể tải component: ${componentName}`);
            
            const htmlContent = await response.text();
            el.innerHTML = htmlContent;
        } catch (error) {
            console.error(`[Component Error]`, error);
            el.innerHTML = `<div class="text-red-500 p-2 text-xs">Lỗi nạp khối ${componentName}</div>`;
        }
    });

    // Chờ tất cả component nạp xong xuôi
    await Promise.all(promises);

    // Sau khi nạp xong HTML động, kích hoạt thư viện Icon Lucide trên toàn trang
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Đăng ký chạy loader ngay khi cấu trúc DOM cơ bản sẵn sàng
document.addEventListener('DOMContentLoaded', loadComponents);