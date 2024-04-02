document.addEventListener('DOMContentLoaded', () => {
    // Retrieve customer details from local storage
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Retrieve product details from local storage
    const productData = JSON.parse(localStorage.getItem('cart'));

    // Display customer details
    const customerDetailsElement = document.getElementById('customerDetails');
    customerDetailsElement.innerHTML += `
        <strong>Name:</strong> ${userData.name}<br>
        <strong>Phone:</strong> ${userData.phone}<br>
        <strong>Email:</strong> ${userData.email}<br>
        <strong>Delivery Address:</strong> ${userData.address}<br>
    `;

    const productDetailsElement = document.getElementById('productDetails');
    productDetailsElement.innerHTML += `
        ${productData[0].title}<br>
        <img src="${productData[0].image}" alt="${productData[0].title}" style="max-width: 200px;"><br>
    
    `;

    localStorage.removeItem('cart');
});
