document.addEventListener('DOMContentLoaded', () => {
  const productDetail = document.getElementById('productDetail');
  
  // Lấy ID sản phẩm từ URL
  const params = new URLSearchParams(window.location.search);
  const productId = parseInt(params.get('id'));
  
  if (!productId) {
    productDetail.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 50px 0;">
        <h2>Lỗi</h2>
        <p>Không tìm thấy ID sản phẩm. Vui lòng quay lại trang sản phẩm.</p>
        <a href="/" class="btn">Xem sản phẩm</a>
      </div>
    `;
    return;
  }
  
  // Lấy dữ liệu sản phẩm từ localStorage
  const products = JSON.parse(localStorage.getItem('products')) || [];
  
  // Tìm sản phẩm theo ID
  const product = products.find(p => p.id === productId);
  
  if (product) {
    // Cập nhật tiêu đề trang
    document.title = `${product.name} | Pink Camera Store`;
    
    // Hiển thị chi tiết sản phẩm
    productDetail.innerHTML = `
      <div class="product-breadcrumb">
        <a href="/">Trang chủ</a> &gt; 
        <a href="/#products">Sản phẩm</a> &gt; 
        <span>${product.name}</span>
      </div>
      
      <div class="product-detail-container">
        <div class="product-detail-img-container">
          <img src="${product.image}" alt="${product.name}" class="product-detail-img">
        </div>
        
        <div class="product-detail-info">
          <h1 class="product-detail-title">${product.name}</h1>
          <p class="product-detail-price">${product.price.toLocaleString()} VNĐ</p>
          <div class="product-detail-divider"></div>
          <div class="product-description">
            ${product.description}
          </div>
          
          <div class="product-actions">
            <div class="quantity-selector">
              <button class="quantity-btn" onclick="decrementQuantity()">-</button>
              <input type="number" id="quantity" value="1" min="1" class="quantity-input">
              <button class="quantity-btn" onclick="incrementQuantity()">+</button>
            </div>
            
            <button class="btn add-to-cart-btn" onclick="addToCartFromDetail(${product.id})">
              Thêm vào giỏ hàng
            </button>
          </div>
          
          <div class="product-meta">
            <p><strong>Mã sản phẩm:</strong> SP-${product.id}</p>
            <p><strong>Danh mục:</strong> Thời trang</p>
          </div>
        </div>
      </div>
    `;
  } else {
    productDetail.innerHTML = `
      <div class="error-message" style="text-align: center; padding: 50px 0;">
        <h2>Không tìm thấy sản phẩm</h2>
        <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <a href="/" class="btn">Xem sản phẩm khác</a>
      </div>
    `;
  }
  
  // Thêm các hàm toàn cục cho việc tăng giảm số lượng và thêm vào giỏ hàng
  window.decrementQuantity = function() {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
    }
  };
  
  window.incrementQuantity = function() {
    const quantityInput = document.getElementById('quantity');
    quantityInput.value = parseInt(quantityInput.value) + 1;
  };
  
  window.addToCartFromDetail = function(productId) {
    const quantity = parseInt(document.getElementById('quantity').value);
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Lấy sản phẩm từ localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const productToAdd = products.find(p => p.id === productId);
    
    if (!productToAdd) return;
    
    const existingProductIndex = cart.findIndex(item => item.id === productId);
    
    if (existingProductIndex >= 0) {
      // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
      cart[existingProductIndex].quantity += quantity;
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới với số lượng chỉ định
      cart.push({
        id: productToAdd.id,
        name: productToAdd.name,
        price: productToAdd.price,
        image: productToAdd.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Hiển thị thông báo thành công
    const notification = document.createElement('div');
    notification.className = 'add-to-cart-notification';
    notification.innerHTML = `
      <div class="notification-content">
        <p>Đã thêm ${quantity} sản phẩm vào giỏ hàng!</p>
        <a href="/cart.html" class="btn">Xem giỏ hàng</a>
      </div>
    `;
    // notification.style.position = 'fixed';
    // notification.style.top = '20px';
    // notification.style.right = '20px';
    // notification.style.backgroundColor = 'var(--light-pink)';
    // notification.style.padding = '15px';
    // notification.style.borderRadius = '5px';
    // notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    // notification.style.zIndex = '1000';
    
    document.body.appendChild(notification);
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transition = 'opacity 0.5s';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  };
});