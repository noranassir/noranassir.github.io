const orderForm = document.querySelector('#order-form');
const inputName = document.querySelector('#inputName');
const inputPhone = document.querySelector('#inputPhone');
const inputEmail = document.querySelector('#inputEmail');
const inputAddress = document.querySelector('#inputAddress');
 
inputName.addEventListener('input', () => {
    validateInputs();
});
 
inputPhone.addEventListener('input', () => {
    validateInputs();
});
 
inputEmail.addEventListener('input', () => {
    validateInputs();
});
 
inputAddress.addEventListener('input', () => {
    validateInputs();
});
 
orderForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('Form submitted');
 
    if (validateInputs()) {
        const userData = {
            name: inputName.value.trim(),
            phone: inputPhone.value.trim(),
            email: inputEmail.value.trim(),
            address: inputAddress.value.trim()
        };
 
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.href = '../confirmation.html';
    }
});
 
const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
 
    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
}
 
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
 
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
const validateInputs = () => {
    const nameValue = inputName.value.trim();
    const phoneValue = inputPhone.value.trim();
    const emailValue = inputEmail.value.trim();
    const addressValue = inputAddress.value.trim();
  

    let isValid = true; 

    if (nameValue.length < 2 || nameValue.length > 50) {
        setError(inputName, 'The name must be between 2 to 50 characters long');
        isValid = false;
    } else {
        setSuccess(inputName);
    }

    const phoneRegex = /^[\d()-]+$/;

    if (phoneValue.length > 50) {
        setError(inputPhone, 'Phone number cannot be more than 50 characters long');
        isValid = false;
    } else if (!phoneRegex.test(phoneValue)) {
        setError(inputPhone, 'Invalid phone number');
        isValid = false;
    } else {
        setSuccess(inputPhone);
    }

    if (emailValue.length > 50 ) {
        setError(inputEmail, 'Email cannot be more than 50 characters long');
        isValid = false;
    } else if (!emailValue.includes('@')) {
        setError(inputEmail, 'Invalid email address');
        isValid = false;
    } else {
        setSuccess(inputEmail);
    }

    const addressParts = addressValue.split(',');
    const streetAddress = addressParts[0].trim();
    const postalCode = addressParts[1].trim();
    const city = addressParts[2].trim();

    if (streetAddress.length < 2 || streetAddress.length > 50) {
        setError(inputAddress, 'Street address must be between 2 to 50 characters long');
        isValid = false;
    } else if (postalCode.length !== 5 || isNaN(postalCode)) {
        setError(inputAddress, 'Postal code must be exactly 5 digits');
        isValid = false;
    } else if (city.length < 2 || city.length > 50) {
        setError(inputAddress, 'City must be between 2 to 50 characters long');
        isValid = false;
    } else {
        setSuccess(inputAddress);
    }


    return isValid;

};