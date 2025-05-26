var currentuser; // user hiện tại, biến toàn cục
window.onload = function () {
    khoiTao();
    checkAuthAndLoadCart();

	// autocomplete cho khung tim kiem
	autocomplete(document.getElementById('search-box'), list_products);

	// thêm tags (từ khóa) vào khung tìm kiếm
	var tags = ["Samsung", "iPhone", "Huawei", "Oppo", "Mobi"];
	for (var t of tags) addTags(t, "index.html?search=" + t)
}

async function checkAuthAndLoadCart() {
    const token = localStorage.getItem('token');
    if (!token) {
        showNotLoggedInMessage();
        return;
    }
    try {
        await loadCartData();
    } catch (error) {
        console.error('Error loading cart:', error);
        showNotLoggedInMessage();
    }
}

function showNotLoggedInMessage() {
    var table = document.getElementsByClassName('listSanPham')[0];
    var s = `
        <tbody>
            <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thời gian</th>
                <th>Xóa</th>
            </tr>
            <tr>
                <td colspan="7"> 
                    <h1 style="color:red; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
                        Bạn chưa đăng nhập !!
                    </h1> 
                </td>
            </tr>
        </tbody>
    `;
    table.innerHTML = s;
}

async function loadCartData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showNotLoggedInMessage();
            return;
        }

        const cartData = await getCartData();
        console.log('Raw cart data from API:', cartData); // Debug log

        if (cartData && cartData.success && cartData.cart) {
            // Transform cart items to match frontend format
            const transformedCart = cartData.cart.map(item => {
                console.log('Transforming item:', item); // Debug log
                return {
                    productId: item.productId || item._id || '',
                    productName: item.productName || item.name || '',
                    price: parseFloat(item.price) || 0,
                    quantity: parseInt(item.quantity) || 0,
                    img: item.img || '',
                    addedAt: item.addedAt || new Date().toISOString()
                };
            });
            console.log('Transformed cart data:', transformedCart); // Debug log
            addProductToTable(transformedCart);
        } else {
            console.log('No cart data or invalid format:', cartData); // Debug log
            showNotLoggedInMessage();
        }
    } catch (error) {
        console.error('Error loading cart data:', error);
        if (error.message === 'Unauthorized') {
            localStorage.removeItem('token');
            showNotLoggedInMessage();
        } else {
            addAlertBox('Không thể tải dữ liệu giỏ hàng', '#aa0000', '#fff', 3500);
        }
    }
}

function addProductToTable(cartItems) {
    console.log('Starting addProductToTable with items:', cartItems); // Debug log
    var table = document.getElementsByClassName('listSanPham')[0];
    if (!table) {
        console.error('Table element not found!');
        return;
    }

    // Validate cartItems
    if (!Array.isArray(cartItems)) {
        console.error('cartItems is not an array:', cartItems);
        cartItems = [];
    }

    var s = `
        <tbody>
            <tr>
                <th>STT</th>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th>Thời gian</th>
                <th>Xóa</th>
            </tr>`;

    if (!cartItems || cartItems.length === 0) {
        console.log('Cart is empty, showing empty message');
        s += `
            <tr>
                <td colspan="7"> 
                    <h1 style="color:green; background-color:white; font-weight:bold; text-align:center; padding: 15px 0;">
                        Giỏ hàng trống !!
                    </h1> 
                </td>
            </tr>
        `;
        table.innerHTML = s;
        return;
    }

    var totalPrice = 0;
    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        console.log('Processing item:', item); // Debug log

        // Validate item
        if (!item) {
            console.error('Invalid item at index', i);
            continue;
        }

        // Extract and validate item properties
        var productId = item.productId || '';
        var productName = item.productName || '';
        var price = parseFloat(item.price) || 0;
        var quantity = parseInt(item.quantity) || 0;
        var img = item.img || '';
        var addedAt = item.addedAt || new Date().toISOString();

        console.log('Processed item properties:', { // Debug log
            productId,
            productName,
            price,
            quantity,
            img,
            addedAt
        });

        // Skip invalid items
        if (!productId || !productName) {
            console.error('Item missing required fields:', item);
            continue;
        }

        var thanhtien = price * quantity;
        var thoigian = new Date(addedAt).toLocaleString();

        s += `
            <tr>
                <td>${i + 1}</td>
                <td class="noPadding imgHide">
                    <a target="_blank" href="chitietsanpham.html?${encodeURIComponent(productName)}" title="Xem chi tiết">
                        ${productName}
                        <img src="${img}" onerror="this.src='img/default-product.jpg'">
                    </a>
                </td>
                <td class="alignRight">${numToString(price)} ₫</td>
                <td class="soluong">
                    <button onclick="giamSoLuong('${productId}')"><i class="fa fa-minus"></i></button>
                    <input size="1" onchange="capNhatSoLuongFromInput(this, '${productId}')" value="${quantity}">
                    <button onclick="tangSoLuong('${productId}')"><i class="fa fa-plus"></i></button>
                </td>
                <td class="alignRight">${numToString(thanhtien)} ₫</td>
                <td style="text-align: center">${thoigian}</td>
                <td class="noPadding"> <i class="fa fa-trash" onclick="xoaSanPhamTrongGioHang('${productId}')"></i> </td>
            </tr>
        `;
        totalPrice += thanhtien;
    }

    s += `
            <tr style="font-weight:bold; text-align:center">
                <td colspan="4">TỔNG TIỀN: </td>
                <td class="alignRight">${numToString(totalPrice)} ₫</td>
                <td class="thanhtoan" onclick="thanhToan()"> Thanh Toán </td>
                <td class="xoaHet" onclick="xoaHet()"> Xóa hết </td>
            </tr>
        </tbody>
    `;

    console.log('Generated HTML:', s); // Debug log
    table.innerHTML = s;
}

async function xoaSanPhamTrongGioHang(productId) {
	if (window.confirm('Xác nhận hủy mua')) {
		const success = await removeFromCart(productId);
		if (success) {
			loadCartData();
			animateCartNumber();
		} else {
			addAlertBox('Không thể xóa sản phẩm khỏi giỏ hàng', '#aa0000', '#fff', 3500);
		}
	}
}

async function thanhToan() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            addAlertBox('Vui lòng đăng nhập để thanh toán', '#aa0000', '#fff', 3500);
            return;
        }

        const cartData = await getCartData();
        if (!cartData || !cartData.success || !cartData.cart || cartData.cart.length === 0) {
            addAlertBox('Không có sản phẩm nào trong giỏ hàng', '#aa0000', '#fff', 3500);
            return;
        }

        document.getElementById('paymentModal').style.display = 'flex';
    } catch (error) {
        console.error('Error during checkout:', error);
        addAlertBox('Có lỗi xảy ra khi thanh toán', '#aa0000', '#fff', 3500);
    }
}

async function selectPickup() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            addAlertBox('Vui lòng đăng nhập để thanh toán', '#aa0000', '#fff', 3500);
            return;
        }

        const cartData = await getCartData();
        if (!cartData || !cartData.success || !cartData.cart || cartData.cart.length === 0) {
            addAlertBox('Không có sản phẩm nào trong giỏ hàng', '#aa0000', '#fff', 3500);
            return;
        }

        if (window.confirm('Xác nhận thanh toán và nhận hàng tại cửa hàng?')) {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentMethod: 'Tiền mặt',
                    shippingAddress: {
                        fullName: 'Nhận tại cửa hàng',
                        address: 'Nhận tại cửa hàng',
                        city: 'Nhận tại cửa hàng',
                        phone: 'Nhận tại cửa hàng'
                    }
                })
            });

            const data = await response.json();
            if (data.success) {
                addAlertBox('Đặt hàng thành công!', '#17c671', '#fff', 4000);
                closePaymentModal();
                loadCartData(); // Refresh cart
            } else {
                addAlertBox(data.message || 'Có lỗi xảy ra khi đặt hàng', '#aa0000', '#fff', 3500);
            }
        }
    } catch (error) {
        console.error('Error during checkout:', error);
        addAlertBox('Có lỗi xảy ra khi thanh toán', '#aa0000', '#fff', 3500);
    }
}

async function submitDelivery() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            addAlertBox('Vui lòng đăng nhập để thanh toán', '#aa0000', '#fff', 3500);
            return;
        }

        const address = document.getElementById('deliveryAddress').value.trim();
        if (!address) {
            alert('Vui lòng nhập địa chỉ giao hàng');
            return;
        }

        const cartData = await getCartData();
        if (!cartData || !cartData.success || !cartData.cart || cartData.cart.length === 0) {
            addAlertBox('Không có sản phẩm nào trong giỏ hàng', '#aa0000', '#fff', 3500);
            return;
        }

        if (window.confirm('Xác nhận thanh toán và giao hàng đến địa chỉ đã nhập?')) {
            const response = await fetch('/api/orders/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    paymentMethod: 'Tiền mặt',
                    shippingAddress: {
                        fullName: 'Giao hàng tận nơi',
                        address: address,
                        city: 'Giao hàng tận nơi',
                        phone: 'Giao hàng tận nơi'
                    }
                })
            });

            const data = await response.json();
            if (data.success) {
                addAlertBox('Đặt hàng thành công!', '#17c671', '#fff', 4000);
                closePaymentModal();
                loadCartData(); // Refresh cart
            } else {
                addAlertBox(data.message || 'Có lỗi xảy ra khi đặt hàng', '#aa0000', '#fff', 3500);
            }
        }
    } catch (error) {
        console.error('Error during delivery checkout:', error);
        addAlertBox('Có lỗi xảy ra khi thanh toán', '#aa0000', '#fff', 3500);
    }
}

async function xoaHet() {
	const cartData = await getCartData();
	if (cartData && cartData.cart.length) {
		if (window.confirm('Bạn có chắc chắn muốn xóa hết sản phẩm trong giỏ !!')) {
			// TODO: Implement clear cart functionality
			addAlertBox('Chức năng xóa giỏ hàng đang được phát triển', '#17c671', '#fff', 4000);
		}
	}
}

async function capNhatSoLuongFromInput(inp, productId) {
	var soLuongMoi = Number(inp.value);
	if (!soLuongMoi || soLuongMoi <= 0) soLuongMoi = 1;

	const success = await addToCart(productId, soLuongMoi);
	if (success) {
		loadCartData();
		animateCartNumber();
	} else {
		addAlertBox('Không thể cập nhật số lượng', '#aa0000', '#fff', 3500);
	}
}

async function tangSoLuong(productId) {
	const success = await addToCart(productId, 1);
	if (success) {
		loadCartData();
		animateCartNumber();
	} else {
		addAlertBox('Không thể tăng số lượng', '#aa0000', '#fff', 3500);
	}
}

async function giamSoLuong(productId) {
	const cartData = await getCartData();
	if (cartData) {
		const item = cartData.cart.find(i => i.productId === productId);
		if (item && item.quantity > 1) {
			const success = await addToCart(productId, -1);
			if (success) {
				loadCartData();
				animateCartNumber();
			} else {
				addAlertBox('Không thể giảm số lượng', '#aa0000', '#fff', 3500);
			}
		}
	}
}

function capNhatMoiThu() { // Mọi thứ
	animateCartNumber();

	// cập nhật danh sách sản phẩm trong localstorage
	setCurrentUser(currentuser);
	updateListUser(currentuser);

	// cập nhật danh sách sản phẩm ở table
	addProductToTable(currentuser);

	// Cập nhật trên header
	capNhat_ThongTin_CurrentUser();
}
