// public/js/component-loader.js

/**
 * Hàm tự động tìm các thẻ có thuộc tính data-component và nạp file html tương ứng
 */
async function loadComponents() {
    const elements = document.querySelectorAll('[data-component]');
    
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

    // Kích hoạt thư viện Icon Lucide trên toàn trang sau khi giao diện sẵn sàng
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

/**
 * Khai báo hàm xử lý đóng mở menu điện thoại ở phạm vi toàn cục (window)
 * Giúp giải quyết triệt để lỗi "toggleMobileMenu is not defined"
 */
window.toggleMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    
    if (!menu || !icon) return;

    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        if (typeof lucide !== 'undefined') {
            icon.setAttribute('data-lucide', 'x'); // Chuyển đổi thành icon dấu X đóng menu
            lucide.createIcons();
        }
    } else {
        menu.classList.add('hidden');
        if (typeof lucide !== 'undefined') {
            icon.setAttribute('data-lucide', 'menu'); // Trả lại icon 3 gạch mở menu
            lucide.createIcons();
        }
    }
};

// Đăng ký kích hoạt tiến trình tải cấu phần
document.addEventListener('DOMContentLoaded', loadComponents);