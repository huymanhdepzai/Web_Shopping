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
    // Đảm bảo dữ liệu trả về có cùng cấu trúc với dữ liệu local
    return {
        masp: product.productId || '',
        name: product.productName || '',
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