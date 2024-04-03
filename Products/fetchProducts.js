async function fetchProductData() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

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

            const productsSection = document.querySelector('.products .row');
            productsSection.appendChild(card);

            const productImageElement = card.querySelector('.card-img-top');
            productImageElement.addEventListener('click', function() {
             //   showProductDetails(productId);
            });

           
            const addToCartButton = card.querySelector('.addToCartButton');
            addToCartButton.addEventListener('click', function() {
                addToCart(product);
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
        description: product.description
    };
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push(cartItem);
    localStorage.setItem('cart', JSON.stringify(cartItems));

    console.log('Product added to cart:', cartItem);

    window.location.href = '../order.html';
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
};
