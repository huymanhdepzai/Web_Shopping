var nameProduct, maProduct, sanPhamHienTai; // Biến toàn cục chứa dữ liệu sản phẩm

window.onload = function () {
    khoiTao();

    // thêm tags (từ khóa) vào khung tìm kiếm
    var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
    for (var t of tags) addTags(t, "index.html?search=" + t, true);

    phanTich_URL_chiTietSanPham();

    // autocomplete cho khung tim kiem
    autocomplete(document.getElementById('search-box'), list_products);

    // Thêm gợi ý sản phẩm
    sanPhamHienTai && suggestion();
}

// Hàm lấy productId từ URL query string
function getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('productId');
}

async function phanTich_URL_chiTietSanPham() {
    maProduct = getProductIdFromURL();
    if (!maProduct) {
        return khongTimThaySanPham();
    }

    try {
        // Gọi API backend lấy chi tiết sản phẩm
        const response = await fetch(`http://localhost:3000/api/product/getProductDetails/${maProduct}`);
        const result = await response.json();

        if (!result.success || !result.product) {
            return khongTimThaySanPham();
        }

        sanPhamHienTai = result.product;
        nameProduct = sanPhamHienTai.productName;

        var divChiTiet = document.getElementsByClassName('chitietSanpham')[0];

        // Hiển thị div chi tiết
        divChiTiet.style.display = 'block';
        document.getElementById('productNotFound').style.display = 'none';

        // Đổi title
        document.title = nameProduct + ' - Thế giới điện thoại';

        // Cập nhật tên h1
        var h1 = divChiTiet.getElementsByTagName('h1')[0];
        h1.innerHTML = nameProduct;

        // Cập nhật sao (giả sử backend chưa có rate, bạn có thể thêm trường này)
        var rating = "";
        if (sanPhamHienTai.rateCount > 0) {
            for (var i = 1; i <= 5; i++) {
                if (i <= sanPhamHienTai.star) {
                    rating += `<i class="fa fa-star"></i>`;
                } else {
                    rating += `<i class="fa fa-star-o"></i>`;
                }
            }
            rating += `<span> ` + sanPhamHienTai.rateCount + ` đánh giá</span>`;
        }
        divChiTiet.getElementsByClassName('rating')[0].innerHTML = rating;

        // Cập nhật giá + label khuyến mãi (nếu có)
        var price = divChiTiet.getElementsByClassName('area_price')[0];
        price.innerHTML = `<strong style="color:red; font-size:1.5rem;">${sanPhamHienTai.salePrice} VND</strong>`;

        // Cập nhật chi tiết khuyến mãi (nếu có)
        document.getElementById('detailPromo').innerHTML = "Khuyến mãi hấp dẫn"; // bạn thay thế theo data thực tế

        // Cập nhật thông số kỹ thuật
        var info = divChiTiet.getElementsByClassName('info')[0];
        info.innerHTML = ''; // Xóa cũ
        if (sanPhamHienTai.description && sanPhamHienTai.description.specifications) {
            for (const [key, value] of Object.entries(sanPhamHienTai.description.specifications)) {
                if (value && value.trim() !== '') {
                    // Viết hoa chữ cái đầu key và thay thế dấu _ nếu có
                    const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                    info.innerHTML += `<li><p>${formattedKey}</p><div>${value}</div></li>`;
                }
            }
        }

        // Cập nhật hình ảnh lớn
        var hinh = divChiTiet.getElementsByClassName('picture')[0].getElementsByTagName('img')[0];
        hinh.src = sanPhamHienTai.img[0];
        document.getElementById('bigimg').src = sanPhamHienTai.img[0];

        // Xử lý ảnh nhỏ trong carousel nếu có nhiều ảnh
        const carouselDiv = document.querySelector('.div_smallimg.owl-carousel');
        if(carouselDiv) {
            carouselDiv.innerHTML = '';
            if(sanPhamHienTai.img.length > 1){
                sanPhamHienTai.img.forEach(src => {
                    const wrapperDiv = document.createElement('div');
                    wrapperDiv.className = 'item';

                    const a = document.createElement('a');
                    const imgElem = document.createElement('img');
                    imgElem.src = src;
                    imgElem.style.cursor = 'pointer';
                    imgElem.onclick = () => {
                        hinh.src = src;
                        document.getElementById('bigimg').src = src;
                    };
                    a.appendChild(imgElem);
                    wrapperDiv.appendChild(a);
                    carouselDiv.appendChild(wrapperDiv);
                });

                // Khởi tạo lại owl-carousel sau khi thêm ảnh nhỏ
                $(carouselDiv).owlCarousel({
                    items: 5,
                    center: true,
                    smartSpeed: 450,
                });
            }
        }

        // Nút thêm vào giỏ hàng demo alert
        window.themVaoGioHang = function() {
            alert(`Thêm sản phẩm ${sanPhamHienTai.productName} vào giỏ hàng!`);
        };

    } catch (error) {
        console.error(error);
        khongTimThaySanPham();
    }
}

function khongTimThaySanPham() {
    document.getElementById('productNotFound').style.display = 'block';
    document.getElementsByClassName('chitietSanpham')[0].style.display = 'none';
}
