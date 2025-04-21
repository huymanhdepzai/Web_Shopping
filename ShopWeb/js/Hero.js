document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-box");
    const form = document.querySelector(".input-search");
    const container = document.getElementById("search-results");
  
    if (!input || !form) return;
  
    let allProducts = [];
  
    form.addEventListener("submit", (e) => {
      e.preventDefault();
    });
  
    function debounce(func, delay) {
      let timeout;
      return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
      };
    }
  
    input.addEventListener("focus", async () => {
      if (allProducts.length === 0) {
        try {
          const res = await fetch(`http://localhost:3000/search`);
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
          allProducts = data.products || [];
          filterAndRender(input.value.trim());
        } catch (err) {
          console.error("Lỗi khi lấy danh sách sản phẩm:", err);
          renderSearchResults([]);
        }
      } else {
        filterAndRender(input.value.trim());
      }
    });
  
    const filterAndRender = debounce((keyword) => {
      let filteredProducts = allProducts;
  
      if (keyword) {
        filteredProducts = allProducts.filter(product =>
          product.name.toLowerCase().startsWith(keyword.toLowerCase())
        );
      }
  
      renderSearchResults(filteredProducts);
    }, 300);
  
    input.addEventListener("input", () => {
      const keyword = input.value.trim();
      filterAndRender(keyword);
    });
  
    document.addEventListener("click", (e) => {
      if (!form.contains(e.target)) {
        container.style.display = "none";
      }
    });
  });
  
  function renderSearchResults(products) {
    const container = document.getElementById("search-results");
    container.innerHTML = "";
  
    if (!products || products.length === 0) {
      container.style.display = "none";
      return;
    }
  
    products.forEach(product => {
      const item = document.createElement("div");
      item.className = "product-item";
      item.innerHTML =  `
      <div class = product-name>
        <strong>${product.name}</strong>
      </div>
      `;
      const tooltip = item.querySelector(".tooltip");
      item.addEventListener("mouseenter", () => {
            tooltip.classList.remove("hidden");
      });
      item.addEventListener("mouseleave", () => {
            tooltip.classList.add("hidden");
      });
      item.addEventListener("click", () => {
        document.getElementById("search-box").value = product.name;
        container.style.display = "none"; 
      });

      container.appendChild(item);
    });
  
    container.style.display = "block";
  }
  
  function addHeader() {
    document.write(`
      <div class="header group">
        <div class="logo">
          <a href="index.html">
            <img src="img/logo.jpg" alt="Trang chủ Smartphone Store" title="Trang chủ Smartphone Store">
          </a>
        </div>
  
        <div class="content">
          <div class="search-header">
            <form class="input-search" method="get" action="index.html">
              <div class="autocomplete">
                <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                <button type="submit">
                  <i class="fa fa-search"></i>
                  Tìm kiếm
                </button>
              </div>
              <div id="search-results" class=" "></div>
            </form>
            <div class="tags">
              <strong>Từ khóa: </strong>
            </div>
          </div>
  
          <div class="tools-member">
            <div class="member">
              <a onclick="checkTaiKhoan()">
                <i class="fa fa-user"></i>
                Tài khoản
              </a>
              <div class="menuMember hide">
                <a href="nguoidung.html">Trang người dùng</a>
                <a onclick="if(window.confirm('Xác nhận đăng xuất ?')) logOut();">Đăng xuất</a>
              </div>
            </div>
            <div class="cart">
              <a href="giohang.html">
                <i class="fa fa-shopping-cart"></i>
                <span>Giỏ hàng</span>
                <span class="cart-number"></span>
              </a>
            </div>
          </div>
        </div>
      </div>
    `);
  }
  
  function addFooter() {
    document.write(`
      <div id="alert">
        <span id="closebtn">⊗</span>
      </div>
      <div class="copy-right">
        <p><a href="index.html">Hust Store</a> - All rights reserved © 2025 - Designed by
          <span style="color: #eee; font-weight: bold">group 25th</span></p>
      </div>
    `);
  }