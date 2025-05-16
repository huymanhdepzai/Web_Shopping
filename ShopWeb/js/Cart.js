function animateCartNumber() {
  // Hiệu ứng cho icon giỏ hàng
  var cn = document.getElementsByClassName("cart-number")[0];
  cn.style.transform = "scale(2)";
  cn.style.backgroundColor = "rgba(255, 0, 0, 0.8)";
  cn.style.color = "white";
  setTimeout(function () {
    cn.style.transform = "scale(1)";
    cn.style.backgroundColor = "transparent";
    cn.style.color = "red";
  }, 1200);
}

function themVaoGioHang(masp, tensp) {
  var user = getCurrentUser();
  if (!user) {
    alert("Bạn cần đăng nhập để mua hàng !");
    showTaiKhoan(true);
    return;
  }
  if (user.off) {
    alert("Tài khoản của bạn hiện đang bị khóa nên không thể mua hàng!");
    addAlertBox(
      "Tài khoản của bạn đã bị khóa bởi Admin.",
      "#aa0000",
      "#fff",
      10000,
    );
    return;
  }
  var t = new Date();
  var daCoSanPham = false;

  for (var i = 0; i < user.products.length; i++) {
    // check trùng sản phẩm
    if (user.products[i].ma == masp) {
      user.products[i].soluong++;
      daCoSanPham = true;
      break;
    }
  }

  if (!daCoSanPham) {
    // nếu không trùng thì mới thêm sản phẩm vào user.products
    user.products.push({
      ma: masp,
      soluong: 1,
      date: t,
    });
  }

  animateCartNumber();
  addAlertBox("Đã thêm " + tensp + " vào giỏ.", "#17c671", "#fff", 3500);

  setCurrentUser(user); // cập nhật giỏ hàng cho user hiện tại
  updateListUser(user); // cập nhật list user
  capNhat_ThongTin_CurrentUser(); // cập nhật giỏ hàng
}
