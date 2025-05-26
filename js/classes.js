function User(username, pass, ho, ten, email, products, donhang) {
	this.ho = ho || '';
	this.ten = ten || '';
	this.email = email || '';

	this.username = username;
	this.pass = pass;
	this.products = products || [];
	this.donhang = donhang || [];
}

function equalUser(u1, u2) {
	return (u1.username == u2.username && u1.pass == u2.pass);
}

function Promo(name, value) { // khuyen mai
	this.name = name; // giamGia, traGop, giaReOnline
	this.value = value;

	this.toWeb = function () {
		if (!this.name) return "";
		var contentLabel = "";
		switch (this.name) {
			case "giamgia":
				contentLabel = `<i class="fa fa-bolt"></i> Giảm ` + this.value + `&#8363;`;
				break;

			case "tragop":
				contentLabel = `Trả góp ` + this.value + `%`;
				break;

			case "giareonline":
				contentLabel = `Giá rẻ online`;
				break;

			case "moiramat":
				contentLabel = "Mới ra mắt";
				break;
		}

		var label =
			`<label class=` + this.name + `>
			` + contentLabel + `
		</label>`;

		return label;
	}
}

function Product(productId, productName, img, price, salePrice, category, brandName, stock, description, isActive) {
	this.productId = productId;
	this.productName = productName;
	this.img = img;
	this.price = price;
	this.salePrice = salePrice;
	this.category = category;
	this.brandName = brandName;
	this.stock = stock;
	this.description = description;
	this.isActive = isActive;
}

function addToWeb(p, ele, returnString) {
	// Chuyển star sang dạng tag html
	var rating = "";
	if (p.rateCount > 0) {
		for (var i = 1; i <= 5; i++) {
			if (i <= p.star) {
				rating += `<i class="fa fa-star"></i>`
			} else {
				rating += `<i class="fa fa-star-o"></i>`
			}
		}
		rating += `<span>` + p.rateCount + ` đánh giá</span>`;
	}

	// Chuyển giá tiền sang dạng tag html
	var price = `<strong>` + p.price + `&#8363;</strong>`;
	if (p.salePrice) {
		price = `<strong>` + p.salePrice + `&#8363;</strong>
				<span>` + p.price + `&#8363;</span>`;
	}

	// Tạo link tới chi tiết sản phẩm
	var chitietSp = 'chitietsanpham.html?' + p.productName.split(' ').join('-');

	// Cho mọi thứ vào tag <li>... </li>
	var newLi =
	`<li class="sanPham">
		<a href="` + chitietSp + `">
			<img src=` + p.img + ` alt="">
			<h3>` + p.productName + `</h3>
			<div class="price">
				` + price + `
			</div>
			<div class="ratingresult">
				` + rating + `
			</div>
			<div class="tooltip">
				<button class="themvaogio" onclick="themVaoGioHang('`+p.productId+`', '`+p.productName+`'); return false;">
					<span class="tooltiptext" style="font-size: 15px;">Thêm vào giỏ</span>
					+
				</button>
			</div>
		</a>
	</li>`;

	if(returnString) return newLi;

	// Thêm tag <li> vừa tạo vào <ul> homeproduct (mặc định) , hoặc tag ele truyền vào
	var products = ele || document.getElementById('products');
	products.innerHTML += newLi;
}