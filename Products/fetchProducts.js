function updateCartItemCount() {
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        const cartItemsSpan = cartIcon.querySelector('span');
        if (cartItemsSpan) {
            const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
            let itemCount = 0;

            // Iterate over cart items and sum their quantities
            cartItems.forEach(item => {
                itemCount += item.quantity;
            });

            cartItemsSpan.textContent = itemCount; // Update the cart span text with the total item count
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const cartIcon = document.getElementById('cart-icon');
    const cartTab = document.querySelector('.cartTab');
    const closeButton = cartTab.querySelector('.close');
    const checkOutButton = cartTab.querySelector('.checkOut');

    // Add event listener to the cart icon
    cartIcon.addEventListener('click', toggleCartTab);

    // Add event listener to the close button inside the cart tab
    closeButton.addEventListener('click', toggleCartTab);

    // Function to toggle the cart tab
    function toggleCartTab() {
      if (cartTab.style.visibility === 'hidden' || cartTab.style.visibility === '') {
        cartTab.style.visibility = 'visible';
        closeButton.style.visibility = 'visible';
        checkOutButton.style.visibility = 'visible';
      } else {
        cartTab.style.visibility = 'hidden';
        closeButton.style.visibility = 'hidden';
        checkOutButton.style.visibility = 'hidden';
      }
    }

    // Add event listener to the add to cart buttons
    const addToCartButtons = document.querySelectorAll('.addToCartButton');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            const productId = event.target.dataset.productId;
            const productTitle = event.target.dataset.productTitle;
            const productImage = event.target.dataset.productImage;
            const productDescription = event.target.dataset.productDescription;

            const product = {
                id: productId,
                title: productTitle,
                image: productImage,
                description: productDescription,
                quantity: 1
            };

            addToCart(product);
            updateCartItemCount(); // Update cart item count after adding to cart
        });
    });
});

async function fetchProductData() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const productsSection = document.querySelector('.products .row');
        if (!productsSection) {
            throw new Error('Products section not found');
        }

        data.forEach(product => {
            const productId = product.id;
            const productImage = product.image;
            const productTitle = product.title;
            const productDescription = product.description;

            const card = document.createElement('div');
            card.classList.add('col-md-4', 'mb-5', 'd-flex', 'align-items-stretch');
            card.innerHTML = `
                <div class="card">
                    <img class="clickable card-img-top img-fluid p-3" style="height:200px; object-fit: contain;" src="${productImage}" alt="${productTitle}" onclick="showProductDetails(${productId}, true)">
                    <div class="card-body d-flex flex-column">
                        <h4 class="card-title clickable" onclick="showProductDetails(${productId}, true)">${productTitle}</h4>
                        <p class="card-text text-truncate">${productDescription}</p>
                        <div class="mt-auto">
                            <a href="#" class="btn btn-primary addToCartButton">Add to Cart</a>
                        </div>
                    </div>
                </div>
            `;

            productsSection.appendChild(card);

            const addToCartButton = card.querySelector('.addToCartButton');
            addToCartButton.addEventListener('click', function() {
                addToCart(product);
                updateCartItemCount(); // Update cart item count after adding to cart
            });
        });

    } catch (error) {
        console.log('Error fetching product data:', error);
    }
}
function showProductDetails(productId, isSameDirectory) {    // if its true, its same directory
    const baseUrl = isSameDirectory ? '' : 'Products/';
    window.location.href = `${baseUrl}productsFocus.html?id=${productId}`;
}

 

async function fetchRandomProducts() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const randomProducts = getRandomElements(data, 3); // get 3 random products 
      displayRandomProducts(randomProducts);
    } catch (error) {
      console.log('Error fetching product data:', error);
    }
  }
  
  function getRandomElements(array, numElements) {
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, numElements);
  }


fetchProductData();

function addToCart(product) {
    // Save product information to local storage
    const cartItem = {
        id: product.id,
        title: product.title,
        image: product.image,
        description: product.description,
        quantity: 1  // Set initial quantity to 1
    };

    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product already exists in the cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);

    if (existingItemIndex !== -1) {
        // If the product already exists, update its quantity
        cartItems[existingItemIndex].quantity += 1;
    } else {
        // If the product doesn't exist, add it to the cart
        cartItems.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    console.log('Product added to cart:', cartItem);
    displayCartItems(cartItems);
}

// Function to display the cart items in the shopping cart tab
function displayCartItems(cartItems) {
    const listCart = document.querySelector('.listCart');
    listCart.innerHTML = ''; // Clear the existing cart items

    cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cartItem');

        // Product image
        const productImage = document.createElement('img');
        productImage.src = item.image;
        productImage.alt = item.title;

        // Product name
        const productName = document.createElement('p');
        productName.textContent = item.title;

        // Product quantity input
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 1;
        quantityInput.value = item.quantity;
        quantityInput.addEventListener('change', () => updateCartItemQuantity(item, quantityInput.value));

        // Remove item button
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => removeCartItem(item));

        // Append elements to cart item div
        cartItemDiv.appendChild(productImage);
        cartItemDiv.appendChild(productName);
        cartItemDiv.appendChild(quantityInput);
        cartItemDiv.appendChild(removeButton); // Add the remove button

        // Append cart item div to listCart container
        listCart.appendChild(cartItemDiv);
    });
}

function removeCartItem(item) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems = cartItems.filter(cartItem => cartItem.id !== item.id);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    displayCartItems(cartItems); 
    updateCartItemCount();

  
}


function displayRandomProducts(products) {

    const container = document.getElementById('randomProductsContainer');
    container.innerHTML = ''; // clear existing content
    
    products.forEach(product => {
        const productId = product.id;
            const productImage = product.image;
            const productTitle = product.title;
            const productDescription = product.description;

      // Create HTML elements for each product
      const productCard = document.createElement('div');
      productCard.classList.add('col-md-4', 'mb-5', 'd-flex', 'align-items-stretch');
      productCard.innerHTML = `
      <div class="card">
      <img class="clickable card-img-top img-fluid p-3" style="height:200px; object-fit: contain;" src="${productImage}" alt="${productTitle}" onclick="showProductDetails(${productId}, false)">
      <div class="card-body d-flex flex-column">
          <h4 class="card-title clickable" onclick="showProductDetails(${productId}, false)">${productTitle}</h4>
          <p class="card-text text-truncate">${productDescription}</p>
      </div>
  </div>
      `;
      
      // Append the product card to the container
      container.appendChild(productCard);
    });
}

window.onload = function() {
    fetchRandomProducts();
    
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    fetch(`https://fakestoreapi.com/products/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(product => {
            document.getElementById('productTitle').textContent = product.title;
            document.getElementById('productImage').src = product.image;
            document.getElementById('productDescription').textContent = product.description;
            
            const addToCartButton = document.querySelector('.addToCartButton');
            addToCartButton.addEventListener('click', function() {
                addToCart(product);
            });
        })
        .catch(error => {
            console.log('Error fetching product data:', error);
        });

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    displayCartItems(cartItems); // Display cart items on page load
};

