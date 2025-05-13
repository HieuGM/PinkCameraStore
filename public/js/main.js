document.addEventListener('DOMContentLoaded', () => {
  const productsGrid = document.getElementById('productsGrid');
  const searchForm = document.querySelector('.search-form');
  const searchInput = document.getElementById('searchInput');
  
  // Cập nhật trạng thái đăng nhập
  updateLoginStatus();
  
  // Lấy danh sách sản phẩm từ localStorage
  function getProducts() {
    // Kiểm tra xem có sản phẩm trong localStorage không
    const products = JSON.parse(localStorage.getItem('products'));
    
    // Nếu có, sử dụng dữ liệu đó
    if (products && products.length > 0) {
      return products;
    }
    
    // Nếu không, sử dụng dữ liệu mẫu
    const defaultProducts = [
    {
      id: 1,
      name: 'Sony 1',
      price: 129.99,
      description: 'Beautiful',
      image: '/images/product-1.jpg',
      featured: true
    },
    {
      id: 2,
      name: 'Sony 2',
      price: 59.99,
      description: 'Đẹp',
      image: '/images/product-2.jpg',
      featured: true
    },
    {
      id: 3,
      name: 'Sony 3',
      price: 89.99,
      description: 'High-quality',
      image: '/images/product-3.jpg',
      featured: true
    },
    {
      id: 4,
      name: 'sony 4',
      price: 45.99,
      description: 'Low',
      image: 'https://www.bhphotovideo.com/images/images2500x2500/sony_dsc_w710_cyber_shot_w710_digital_camera_910811.jpg',
      featured: false
    },
    {
      id: 5,
      name: 'Sony 5',
      price: 199.99,
      description: 'Ex',
      image: 'https://tse1.mm.bing.net/th/id/OIP.aFtlGCgWAttEZAQhydHrBAHaGe?rs=1&pid=ImgDetMain',
      featured: false
    }
  ];
    
    // Lưu sản phẩm mẫu vào localStorage nếu chưa có
    localStorage.setItem('products', JSON.stringify(defaultProducts));
    
    return defaultProducts;
  }
  
  // Tải tất cả sản phẩm trên trang chính
  if (productsGrid) {
    const allProducts = getProducts();
    // Sắp xếp sản phẩm để hiển thị sản phẩm nổi bật trước
    const sortedProducts = sortProductsByFeatured(allProducts);
    displayProducts(sortedProducts);
  }
  
  // Chức năng tìm kiếm
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchTerm = searchInput.value.toLowerCase().trim();
      
      if (searchTerm) {
        const allProducts = getProducts();
        const filteredProducts = allProducts.filter(product => 
          product.name.toLowerCase().includes(searchTerm) || 
          product.description.toLowerCase().includes(searchTerm)
        );
        
        // Sắp xếp kết quả tìm kiếm để hiển thị sản phẩm nổi bật trước
        const sortedFilteredProducts = sortProductsByFeatured(filteredProducts);
        displayProducts(sortedFilteredProducts);
      } else {
        const sortedProducts = sortProductsByFeatured(getProducts());
        displayProducts(sortedProducts);
      }
    });
  }
  
  // Hàm sắp xếp sản phẩm để đưa sản phẩm nổi bật lên trên
  function sortProductsByFeatured(products) {
    return [...products].sort((a, b) => {
      // So sánh thuộc tính featured
      if (a.featured && !b.featured) return -1; // a nổi bật, b không -> a lên trước
      if (!a.featured && b.featured) return 1;  // b nổi bật, a không -> b lên trước
      return 0; // Giữ nguyên thứ tự
    });
  }
  
  // Hàm tạo thẻ sản phẩm
  function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.className = 'product-card';
    
    // Thêm lớp đặc biệt cho sản phẩm nổi bật
    if (product.featured) {
      productCard.classList.add('featured-product');
    }
    
    productCard.innerHTML = `
      <div class="product-img-container">
        <a href="product-detail.html?id=${product.id}" class="product-img-link">
          <img src="${product.image}" alt="${product.name}" class="product-img">
        </a>
        ${product.featured ? '<span class="featured-badge">Nổi bật</span>' : ''}
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.name}</h3>
        <p class="product-price">${product.price.toLocaleString()} VNĐ</p>
        <button class="btn add-to-cart-btn" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
      </div>
    `;
    return productCard;
  }
  
  // Hàm hiển thị sản phẩm
  function displayProducts(productsToDisplay) {
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (productsToDisplay.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Không tìm thấy sản phẩm nào.</p>';
      return;
    }
    
    productsToDisplay.forEach(product => {
      productsGrid.appendChild(createProductCard(product));
    });
  }
  
  function updateLoginStatus() {
    const loginLink = document.getElementById('loginLink');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (loginLink && isLoggedIn === 'true') {
      loginLink.textContent = 'Tài khoản của tôi';
      loginLink.href = isAdmin === 'true' ? '/admin-dashboard.html' : '/account.html';
      
      // Nếu phần tử tiếp theo là link đăng ký, ẩn nó đi
      const nextSibling = loginLink.parentElement.nextElementSibling;
      if (nextSibling && nextSibling.querySelector('a').href.includes('register')) {
        nextSibling.style.display = 'none';
      }
    }
  }
});

// Thêm vào giỏ hàng
function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const products = JSON.parse(localStorage.getItem('products')) || [];
  
  const existingProductIndex = cart.findIndex(item => item.id === productId);
  
  if (existingProductIndex >= 0) {
    // Nếu sản phẩm đã tồn tại trong giỏ hàng, tăng số lượng
    cart[existingProductIndex].quantity += 1;
  } else {
    // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới với số lượng 1
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Hiển thị thông báo thành công - CẤU TRÚC ĐÃ ĐƯỢC SỬA
  const notification = document.createElement('div');
  notification.className = 'add-to-cart-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <p>Đã thêm sản phẩm vào giỏ hàng!</p>
      <div class="notification-actions">
        <a href="/cart.html" class="btn notification-btn">Xem giỏ hàng</a>
      </div>
    </div>
  `;
  notification.style.position = 'fixed';
  notification.style.top = '20px';
  notification.style.right = '20px';
  notification.style.backgroundColor = 'var(--light-pink)';
  notification.style.padding = '15px';
  notification.style.borderRadius = '5px';
  notification.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  notification.style.zIndex = '1000';
  notification.style.minWidth = '250px';
  
  document.body.appendChild(notification);
  
  // Tự động ẩn thông báo sau 3 giây
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transition = 'opacity 0.5s';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}