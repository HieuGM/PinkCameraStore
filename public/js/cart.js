document.addEventListener('DOMContentLoaded', () => {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalContainer = document.getElementById('cartTotal');
  const cartEmptyMessage = document.getElementById('cartEmpty');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  // Lấy giỏ hàng từ localStorage
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Hiển thị giỏ hàng
  function displayCart() {
    if (cart.length === 0) {
      cartEmptyMessage.style.display = 'block';
      cartItemsContainer.style.display = 'none';
      cartTotalContainer.style.display = 'none';
      checkoutBtn.style.display = 'none';
      return;
    }
    
    cartEmptyMessage.style.display = 'none';
    cartItemsContainer.style.display = 'block';
    cartTotalContainer.style.display = 'block';
    checkoutBtn.style.display = 'inline-block';
    
    // Xóa các mục trước đó
    cartItemsContainer.innerHTML = '';
    
    // Thêm từng sản phẩm
    cart.forEach(item => {
      const cartItemElement = document.createElement('div');
      cartItemElement.className = 'cart-item';
      cartItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h3>${item.name}</h3>
          <p>Giá: ${item.price.toLocaleString()} VNĐ</p>
          <div style="display: flex; align-items: center;">
            <button class="btn" style="padding: 5px 10px;" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
            <span style="margin: 0 10px;">Số lượng: ${item.quantity}</span>
            <button class="btn" style="padding: 5px 10px;" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
          </div>
        </div>
        <div>
          <p>${(item.price * item.quantity).toLocaleString()} VNĐ</p>
          <button class="btn" style="background-color: #f44336;" onclick="removeFromCart(${item.id})">Xóa</button>
        </div>
      `;
      
      cartItemsContainer.appendChild(cartItemElement);
    });
    
    // Tính và hiển thị tổng tiền
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalContainer.innerHTML = `
      <h3>Tổng cộng: ${total.toLocaleString()} VNĐ</h3>
    `;
  }
  
  // Hiển thị giỏ hàng khi tải trang
  displayCart();
  
  // Trình xử lý sự kiện
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      
      if (!isLoggedIn) {
        // Lưu URL hiện tại để sau khi đăng nhập quay lại
        sessionStorage.setItem('redirectAfterLogin', '/cart.html');
        
        alert('Vui lòng đăng nhập để thanh toán');
        window.location.href = '/login.html';
      } else {
        alert('Cảm ơn bạn đã mua hàng! Đơn hàng của bạn đã được đặt.');
        localStorage.setItem('cart', JSON.stringify([]));
        displayCart();
      }
    });
  }
  
  // Tạo các hàm toàn cục
  window.updateQuantity = function(productId, newQuantity) {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const productIndex = cart.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
      cart[productIndex].quantity = newQuantity;
      localStorage.setItem('cart', JSON.stringify(cart));
      displayCart();
    }
  };
  
  window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
  };
});