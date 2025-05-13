// File này sẽ kiểm tra trạng thái đăng nhập và cập nhật giao diện người dùng
document.addEventListener('DOMContentLoaded', function() {
  // Kiểm tra trạng thái đăng nhập từ localStorage
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  // Lấy các phần tử DOM cần cập nhật
  const loginLink = document.getElementById('loginLink');
  const registerLink = document.getElementById('registerLink');
  
  if (isLoggedIn && loginLink) {
    // Cập nhật liên kết đăng nhập thành liên kết tài khoản
    loginLink.textContent = currentUser && currentUser.name ? 
      `Xin chào, ${currentUser.name}` : 'Tài khoản của tôi';
    loginLink.href = isAdmin ? '/admin-dashboard.html' : '/account.html';
    
    // Thêm nút đăng xuất
    const logoutItem = document.createElement('li');
    const logoutLink = document.createElement('a');
    logoutLink.href = '#';
    logoutLink.textContent = 'Đăng xuất';
    logoutLink.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('currentUser');
      window.location.href = '/';
    });
    logoutItem.appendChild(logoutLink);
    
    // Thêm nút đăng xuất vào menu
    if (loginLink.parentElement && loginLink.parentElement.parentElement) {
      loginLink.parentElement.parentElement.appendChild(logoutItem);
    }
    
    // Ẩn liên kết đăng ký
    if (registerLink) {
      registerLink.parentElement.style.display = 'none';
    }
  }
  
  console.log('Auth check complete. Login status:', isLoggedIn);
});