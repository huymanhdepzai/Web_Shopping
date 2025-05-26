// API endpoints
const API_URL = 'http://localhost:3000/api';

// Fetch all products
async function fetchAllProducts() {
    try {
        const response = await fetch(`${API_URL}/product/getProduct`);
        const data = await response.json();
        if (data.success) {
            return data.allProducts;
        }
        throw new Error(data.message);
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Fetch product details
async function fetchProductDetails(productId) {
    try {
        const response = await fetch(`${API_URL}/product/details/${encodeURIComponent(productId)}`);
        const data = await response.json();
        if (data.success) {
            return data.product;
        }
        throw new Error(data.message);
    } catch (error) {
        console.error('Error fetching product details:', error);
        return null;
    }
}


// Transform product data to match frontend format
function transformProductData(product) {
    console.log('Original product data:', product); // Debug log
    
    // Đảm bảo dữ liệu trả về có cùng cấu trúc với dữ liệu local
    const transformedProduct = {
        productId: product.productId || product._id || '', 
        name: product.productName || product.name || '',
        price: product.price ? product.price.toString() : '0',
        salePrice: product.salePrice || '',
        img: product.img && product.img.length > 0 ? product.img[0] : '',
        company: product.brandName || '',
        star: product.star || 0,
        rateCount: product.rateCount || 0,
        promo: {
            name: 'none',
            value: product.price ? product.price.toString() : '0'
        },
        detail: {
            screen: product.description?.specifications?.screen || '',
            os: product.description?.specifications?.operatingSystem || '',
            camara: product.description?.specifications?.rearCamera || '',
            camaraFront: product.description?.specifications?.frontCamera || '',
            cpu: product.description?.specifications?.cpu || '',
            ram: product.description?.specifications?.ram || '',
            rom: product.description?.specifications?.storage || '',
            microUSB: product.description?.specifications?.externalStorage || '',
            battery: product.description?.specifications?.battery || ''
        }
    };
    
    console.log('Transformed product:', transformedProduct); // Debug log
    return transformedProduct;
}

// Initialize products data
async function initializeProducts() {
    try {
        const products = await fetchAllProducts();
        if (!products || products.length === 0) {
            console.error('No products found');
            return [];
        }
        return products.map(transformProductData);
    } catch (error) {
        console.error('Error initializing products:', error);
        return [];
    }
}

// Authentication API functions
async function apiSignUp(userData) {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (data.success) {
            // Store token and user data
            localStorage.setItem('token', data.token);
        }
        return data;
    } catch (error) {
        console.error('Error during signup:', error);
        throw error;
    }
}

async function apiLogin(credentials) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials),
            credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success) {
            // Store token for future requests
            localStorage.setItem('token', data.token);
            
            // Store user data
            const user = {
                username: data.user.username,
                email: data.user.email,
                fullName: data.user.fullName,
                isAdmin: data.user.isAdmin
            };
            localStorage.setItem('CurrentUser', JSON.stringify(user));
            
            // Redirect if admin
            if (data.user.isAdmin) {
                window.location.assign('admin.html');
            }
        }
        return data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
}

async function apiLogout() {
    try {
        const token = localStorage.getItem('token');
        if (token) {
            const response = await fetch(`${API_URL}/logout`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (data.success) {
                localStorage.removeItem('token');
                window.location.reload();
            } else {
                throw new Error(data.message || 'Logout failed');
            }
        } else {
            window.location.reload();
        }
    } catch (error) {
        console.error('Error during logout:', error);
        localStorage.removeItem('token');
        window.location.reload();
    }
}

// Function to get current user data from API
async function getCurrentUser() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/currentUser`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data.success ? data.user : null;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}

// Cart API functions
async function getCartData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/cart/data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });
        const data = await response.json();
        return data.success ? data : null;
    } catch (error) {
        console.error('Error getting cart data:', error);
        return null;
    }
}

async function addToCart(productId, quantity) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return null;
        }

        if (!productId) {
            console.error('Product ID is missing');
            return null;
        }

        console.log('Sending request to add to cart:', { productId, quantity }); // Debug log

        const response = await fetch(`${API_URL}/cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
                productId: productId.toString(), // Ensure productId is a string
                quantity: parseInt(quantity) // Ensure quantity is a number
            }),
            credentials: 'include'
        });

        const data = await response.json();
        console.log('Add to cart response:', data); // Debug log
        return data.success ? data : null;
    } catch (error) {
        console.error('Error adding to cart:', error);
        return null;
    }
}

async function removeFromCart(productId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;

        const response = await fetch(`${API_URL}/cart/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId }),
            credentials: 'include'
        });
        const data = await response.json();
        return data.success ? data : null;
    } catch (error) {
        console.error('Error removing from cart:', error);
        return null;
    }
} 