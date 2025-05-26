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

// Transform product data to match frontend format
function transformProductData(product) {
    
    const transformedProduct = {
        productId: product.productId || product._id || '',
        productName: product.productName || product.name || '',
        price: product.price ? product.price.toString() : '0',
        salePrice: product.salePrice || '',
        img: product.img && product.img.length > 0 ? product.img[0] : '',
        company: product.brandName || '',
        star: product.star || 0,
        rateCount: product.rateCount || 0,
        category: product.category || '',
        stock: product.stock || 0,
        description: product.description || {},
        isActive: product.isActive || true,
        promo: {
            name: 'none',
            value: product.price ? product.price.toString() : '0'
        }
    };
    
    // Debug log
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
        if (!token) {
            console.error('No token found');
            return null;
        }

        console.log('Fetching cart data with token:', token); // Debug log

        const response = await fetch(`${API_URL}/cart/data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
        });

        console.log('Cart API response status:', response.status); // Debug log

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                throw new Error('Unauthorized');
            }
            throw new Error('Failed to get cart data');
        }

        const data = await response.json();
        console.log('Cart API response data:', data); // Debug log

        if (data.success) {
            // Cart items are already in the correct format from the backend
            return data;
        }
        throw new Error(data.message || 'Failed to get cart data');
    } catch (error) {
        console.error('Error getting cart data:', error);
        throw error;
    }
}

async function addToCart(productId, quantity) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return false;
        }

        console.log('Making API call to add to cart:', { productId, quantity }); // Debug log

        const response = await fetch(`${API_URL}/cart/addToCart`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity })
        });

        if (!response.ok) {
            if (response.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('token');
                throw new Error('Unauthorized');
            }
            throw new Error('Failed to add item to cart');
        }

        const data = await response.json();
        console.log('API response:', data); // Debug log

        if (data.success) {
            return true;
        }
        throw new Error(data.message || 'Failed to add item to cart');
    } catch (error) {
        console.error('Error adding item to cart:', error);
        return false;
    }
}

async function removeFromCart(productId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return false;
        }

        const response = await fetch(`${API_URL}/cart/delete`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId })
        });
        const data = await response.json();
        if (data.success) {
            return true;
        }
        throw new Error(data.message || 'Failed to remove item from cart');
    } catch (error) {
        console.error('Error removing item from cart:', error);
        return false;
    }
} 