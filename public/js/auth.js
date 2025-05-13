document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Trong ứng dụng thực tế, bạn sẽ gọi API đến máy chủ của bạn
      // Đối với ví dụ này, chúng ta sẽ mô phỏng xác thực bằng localStorage
      
      // Ví dụ người dùng (trong ứng dụng thực, dữ liệu này sẽ đến từ cơ sở dữ liệu)
      const users = JSON.parse(localStorage.getItem('users')) || [
        { email: 'admin@example.com', password: 'admin123', name: 'Người quản trị', isAdmin: true },
        { email: 'user@example.com', password: 'user123', name: 'Người dùng thường', isAdmin: false }
      ];
      
      const user = users.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('currentUser', JSON.stringify({
          email: user.email,
          name: user.name,
          isAdmin: user.isAdmin
        }));
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('isAdmin', user.isAdmin);
        
        // Hiện thông báo thành công
        alert('Đăng nhập thành công!');
        
        // Chuyển hướng dựa trên vai trò người dùng hoặc trang trước đó
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || (user.isAdmin ? '/admin-dashboard.html' : '/');
        sessionStorage.removeItem('redirectAfterLogin'); // Xóa URL chuyển hướng
        window.location.href = redirectUrl;
      } else {
        alert('Email hoặc mật khẩu không đúng');
      }
    });
  }
  
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      
      if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp');
        return;
      }
      
      // Trong ứng dụng thực tế, bạn sẽ gọi API đến máy chủ của bạn
      // Đối với ví dụ này, chúng ta sẽ mô phỏng đăng ký bằng localStorage
      
      let users = JSON.parse(localStorage.getItem('users')) || [];
      
      // Kiểm tra xem người dùng đã tồn tại chưa
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        alert('Người dùng với email này đã tồn tại');
        return;
      }
      
      // Thêm người dùng mới
      users.push({
        name,
        email,
        password,
        isAdmin: false
      });
      
      localStorage.setItem('users', JSON.stringify(users));
      
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      window.location.href = '/login.html';
    });
  }
  
  // Kiểm tra nếu người dùng đã đăng nhập, chuyển hướng khỏi trang đăng nhập/đăng ký
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  if (isLoggedIn && (window.location.pathname === '/login.html' || window.location.pathname === '/register.html')) {
    window.location.href = '/';
  }
});