document.addEventListener('DOMContentLoaded', () => {
  const form      = document.getElementById('searchForm');
  const input     = document.getElementById('searchInput');
  const clearBtn  = document.getElementById('clearSearch');
  const cards     = document.querySelectorAll('.medication-card');
  const noResults = document.getElementById('noResults');

  // Function to filter cards based on input
  function filterCards() {
    const q = input.value.trim().toLowerCase();
    let anyVisible = false;

    cards.forEach(card => {
      const name = card.dataset.name.toLowerCase(); // uses data-name attribute
      const match = name.includes(q);               // check if search matches name
      card.style.display = match ? '' : 'none';     // show/hide card
      if (match) anyVisible = true;                 // track if any match found
    });

    // Show/hide "no results" message
    if (noResults) {
      noResults.style.display = anyVisible ? 'none' : '';
    }
  }

  // Filter live as user types
  input.addEventListener('input', filterCards);

  // Also allow search on form submit (optional redundancy)
  form.addEventListener('submit', e => {
    e.preventDefault();
    filterCards();
  });

  // Clear input and reset cards
  clearBtn.addEventListener('click', () => {
    input.value = '';
    cards.forEach(card => card.style.display = '');
    if (noResults) {
      noResults.style.display = 'none';
    }
  });

  let currentMed = null;
  const orderModal = document.getElementById('orderModal');
  const quantityInput = document.getElementById('quantity');
  
  document.querySelectorAll('.order-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const card = e.target.closest('.medication-card');
      currentMed = {
        name: card.dataset.name,
        price: parseFloat(card.dataset.price),
        quantity: 1
      };
      document.getElementById('medName').textContent = currentMed.name;
      quantityInput.value = 1;
      updateTotalPrice();
      orderModal.style.display = 'block';
    });
  });

  quantityInput.addEventListener('input', updateTotalPrice);
  
  function updateTotalPrice() {
    const quantity = parseInt(quantityInput.value) || 1;
    document.getElementById('totalPrice').textContent = 
      (currentMed.price * quantity).toFixed(2);
  }

  document.getElementById('confirmOrder').addEventListener('click', () => {
    const cartCount = document.getElementById('cartCount');
    cartCount.textContent = parseInt(cartCount.textContent) + 1;
    orderModal.style.display = 'none';
  });

  document.querySelector('.close').addEventListener('click', () => {
    orderModal.style.display = 'none';
  });

  window.addEventListener('click', (e) => {
    if (e.target === orderModal) {
      orderModal.style.display = 'none';
    }
  });

  // Handle increment and decrement button clicks
  document.querySelector('.decrement').addEventListener('click', () => {
  const input = document.querySelector('.inner-order-content');
  let currentValue = parseInt(input.value);
  input.value = Math.max(1, currentValue - 1);  // Prevent the value from going below 1
  });

  document.querySelector('.increment').addEventListener('click', () => {
  const input = document.querySelector('.inner-order-content');
  let currentValue = parseInt(input.value);
  input.value = currentValue + 1;  // Increment the value by 1
  });
});
