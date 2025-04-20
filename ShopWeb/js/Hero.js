
document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("search-box");
    if (!input) return;
  
    let timeout = null;
  
    input.addEventListener("input", () => {
      const keyword = input.value.trim();
  
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (!keyword) {
          renderSearchResults([]); // hoặc ẩn khung kết quả
          return;
        }
  
        try {
          const res = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(keyword)}`);
          const data = await res.json();
  
          renderSearchResults(data.products);
        } catch (err) {
          console.error("Lỗi khi tìm kiếm:", err);
        }
      }, 300); // đợi 300ms sau khi ngưng gõ mới gửi request
    });
  });
  
  
  function renderSearchResults(products) {
    const container = document.getElementById("search-results");
    container.innerHTML = "";
  
    if (!products.length) {
      container.innerHTML = "<p>Không tìm thấy sản phẩm nào.</p>";
      return;
    }
  
    products.forEach(product => {
      const item = document.createElement("div");
      item.className = "product-item";
      item.innerHTML = `
        <strong>${product.name}</strong> - ${product.price.toLocaleString()}₫
      `;
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
        </div> <!-- End Logo -->

        <div class="content">
            <div class="search-header" style="position: relative; left: 162px; top: 1px;">
                <form class="input-search" method="get" action="index.html">
                    <div class="autocomplete">
                        <input id="search-box" name="search" autocomplete="off" type="text" placeholder="Nhập từ khóa tìm kiếm...">
                        <button type="submit">
                            <i class="fa fa-search"></i>
                            Tìm kiếm
                        </button>
                    </div>
                    <div id="search-results"></div>
                </form> <!-- End Form search -->
                <div class="tags">
                    <strong>Từ khóa: </strong>
                </div>
            </div> <!-- End Search header -->

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

                </div> <!-- End Member -->

                <div class="cart">
                    <a href="giohang.html">
                        <i class="fa fa-shopping-cart"></i>
                        <span>Giỏ hàng</span>
                        <span class="cart-number"></span>
                    </a>
                </div> <!-- End Cart -->

                <!--<div class="check-order">
                    <a>
                        <i class="fa fa-truck"></i>
                        <span>Đơn hàng</span>
                    </a>
                </div> -->
            </div><!-- End Tools Member -->
        </div> <!-- End Content -->
    </div> <!-- End Header -->`)
}


function addFooter() {
    document.write(`
    <!-- ============== Alert Box ============= -->
    <div id="alert">
        <span id="closebtn">&otimes;</span>
    </div>

    <!-- ============== Footer ============= -->
    <div class="copy-right">
        <p><a href="index.html">Hust Store</a> - All rights reserved © 2025 - Designed by
            <span style="color: #eee; font-weight: bold">group 25th</span></p>
    </div>`);
}

