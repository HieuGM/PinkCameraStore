document.addEventListener('DOMContentLoaded', () => {
  // Kiểm tra nếu người dùng là admin
  const isAdmin = localStorage.getItem('isAdmin');
  if (!isAdmin || isAdmin !== 'true') {
    window.location.href = '/login.html';
  }

  // Khai báo các phần tử DOM
  const sidebarLinks = document.querySelectorAll('.admin-sidebar a');
  const contentSections = document.querySelectorAll('.admin-content > div');
  const productsTableBody = document.getElementById('productsTableBody');
  const usersTableBody = document.getElementById('usersTableBody');
  const addProductBtn = document.getElementById('addProductBtn');
  const productModal = document.getElementById('productModal');
  const deleteModal = document.getElementById('deleteModal');
  const productForm = document.getElementById('productForm');
  const modalClose = document.querySelectorAll('.close');
  const logoutLink = document.getElementById('logoutLink');
  
  // Khai báo biến toàn cục
  let currentProductId = null;

  // ===== KHỞI TẠO DỮ LIỆU =====

  // Khởi tạo dữ liệu sản phẩm mặc định nếu chưa có
  if (!localStorage.getItem('products')) {
    const defaultProducts = [
      {
        id: 1,
        name: 'Váy hồng mùa hè',
        price: 3120000,
        description: 'Váy hồng mùa hè xinh xắn, hoàn hảo cho mọi dịp. Làm từ chất liệu cotton cao cấp.',
        image: 'https://via.placeholder.com/300x400?text=Vay+Hong',
        featured: true
      },
      {
        id: 2,
        name: 'Áo sơ mi trắng',
        price: 1440000,
        description: 'Áo sơ mi trắng thanh lịch với họa tiết thêu tinh tế. Thoải mái và phong cách.',
        image: 'https://via.placeholder.com/300x400?text=Ao+Trang',
        featured: true
      },
      {
        id: 3,
        name: 'Túi xách thời trang',
        price: 2160000,
        description: 'Túi xách da chất lượng cao với chi tiết mạ vàng. Rộng rãi và sang trọng.',
        image: 'https://via.placeholder.com/300x400?text=Tui+Xach',
        featured: true
      },
      {
        id: 4,
        name: 'Nón rộng vành',
        price: 1104000,
        description: 'Nón rộng vành cho mùa hè, hoàn hảo cho những ngày nắng tại bãi biển.',
        image: 'https://via.placeholder.com/300x400?text=Non+Rong+Vanh',
        featured: false
      },
      {
        id: 5,
        name: 'Vòng cổ ngọc trai',
        price: 4800000,
        description: 'Vòng cổ ngọc trai sang trọng với móc bạc. Phụ kiện vượt thời gian cho mọi trang phục.',
        image: 'https://via.placeholder.com/300x400?text=Vong+Co+Ngoc+Trai',
        featured: false
      }
    ];
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }

  // ===== HIỂN THỊ DỮ LIỆU =====

  // Hiển thị danh sách sản phẩm
  function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    productsTableBody.innerHTML = '';

    if (products.length === 0) {
      const row = document.createElement('tr');
      row.innerHTML = '<td colspan="6" style="text-align: center;">Không có sản phẩm nào</td>';
      productsTableBody.appendChild(row);
      return;
    }

    products.forEach(product => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${product.id}</td>
        <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
        <td>${product.name}</td>
        <td>${product.price.toLocaleString()} VNĐ</td>
        <td>${product.featured ? 'Có' : 'Không'}</td>
        <td>
          <button class="btn edit-btn" data-id="${product.id}" style="background-color: #4CAF50; margin-right: 5px;">Sửa</button>
          <button class="btn delete-btn" data-id="${product.id}" style="background-color: #f44336;">Xóa</button>
        </td>
      `;
      productsTableBody.appendChild(row);
    });

    // Thêm sự kiện cho các nút sửa và xóa
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => editProduct(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => showDeleteConfirmation(parseInt(btn.dataset.id)));
    });
  }

  // Hiển thị danh sách người dùng
  function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [
      { email: 'admin@example.com', password: 'admin123', name: 'Người quản trị', isAdmin: true },
      { email: 'user@example.com', password: 'user123', name: 'Người dùng thường', isAdmin: false }
    ];

    usersTableBody.innerHTML = '';

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.email}</td>
        <td>${user.name}</td>
        <td>${user.isAdmin ? 'Quản trị viên' : 'Người dùng'}</td>
        <td>
          <button class="btn" style="background-color: #4CAF50; margin-right: 5px;" disabled>Sửa</button>
          <button class="btn" style="background-color: #f44336;" disabled>Xóa</button>
        </td>
      `;
      usersTableBody.appendChild(row);
    });
  }

  // ===== QUẢN LÝ SẢN PHẨM =====

  // Mở modal thêm sản phẩm mới
  function openAddProductModal() {
    document.getElementById('modalTitle').textContent = 'Thêm sản phẩm mới';
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productDescription').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productFeatured').checked = false;
    
    productModal.style.display = 'block';
  }

  // Mở modal sửa sản phẩm
  function editProduct(productId) {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);
    
    if (product) {
      currentProductId = productId;
      document.getElementById('modalTitle').textContent = 'Sửa sản phẩm';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productPrice').value = product.price;
      document.getElementById('productDescription').value = product.description;
      document.getElementById('productImage').value = product.image;
      document.getElementById('productFeatured').checked = product.featured;
      
      productModal.style.display = 'block';
    }
  }

  // Hiển thị xác nhận xóa sản phẩm
  function showDeleteConfirmation(productId) {
    currentProductId = productId;
    deleteModal.style.display = 'block';
  }

  // Xóa sản phẩm
  function deleteProduct(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    loadProducts();
    deleteModal.style.display = 'none';
  }

  // Lưu sản phẩm (thêm mới hoặc cập nhật)
  function saveProduct(event) {
    event.preventDefault();
    
    const idInput = document.getElementById('productId');
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const description = document.getElementById('productDescription').value;
    const image = document.getElementById('productImage').value;
    const featured = document.getElementById('productFeatured').checked;
    
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    if (idInput.value) {
      // Cập nhật sản phẩm hiện có
      const index = products.findIndex(p => p.id === parseInt(idInput.value));
      if (index !== -1) {
        products[index] = {
          ...products[index],
          name,
          price,
          description,
          image,
          featured
        };
      }
    } else {
      // Thêm sản phẩm mới
      const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
      products.push({
        id: newId,
        name,
        price,
        description,
        image,
        featured
      });
    }
    
    localStorage.setItem('products', JSON.stringify(products));
    productModal.style.display = 'none';
    loadProducts();
  }

  // ===== SỰ KIỆN =====

  // Chuyển đổi giữa các tab trong sidebar
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Cập nhật trạng thái active
      sidebarLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      
      // Hiển thị nội dung tương ứng
      const section = this.dataset.section;
      contentSections.forEach(s => {
        s.classList.add('hidden');
      });
      
      document.getElementById(`${section}Section`).classList.remove('hidden');
      
      // Tải dữ liệu cho tab hiện tại
      if (section === 'products') {
        loadProducts();
      } else if (section === 'users') {
        loadUsers();
      }
    });
  });

  // Mở modal thêm sản phẩm khi nhấp vào nút
  addProductBtn.addEventListener('click', openAddProductModal);

  // Đóng modal khi nhấp vào nút đóng
  modalClose.forEach(close => {
    close.addEventListener('click', function() {
      productModal.style.display = 'none';
      deleteModal.style.display = 'none';
    });
  });

  // Đóng modal khi nhấp vào bên ngoài modal
  window.addEventListener('click', function(event) {
    if (event.target === productModal) {
      productModal.style.display = 'none';
    }
    if (event.target === deleteModal) {
      deleteModal.style.display = 'none';
    }
  });

  // Xử lý form thêm/sửa sản phẩm
  productForm.addEventListener('submit', saveProduct);

  // Xử lý nút hủy xóa
  document.getElementById('cancelDeleteBtn').addEventListener('click', function() {
    deleteModal.style.display = 'none';
  });

  // Xử lý nút xác nhận xóa
  document.getElementById('confirmDeleteBtn').addEventListener('click', function() {
    deleteProduct(currentProductId);
  });

  // Xử lý đăng xuất
  logoutLink.addEventListener('click', function(e) {
    e.preventDefault();
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
    window.location.href = '/login.html';
  });

  // Tải dữ liệu ban đầu
  loadProducts();
});