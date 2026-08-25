// ================== CART MODULE ==================
console.log('✅ cart.js loaded');

// each entry: { id, name, price, quantity }
const cart = [];


// Utilities
function updateCartCount() {
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);
  document.getElementById('cartCount').textContent = count;
}
function updateCartTotal() {
  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0).toFixed(2);
  document.getElementById('cartTotal').textContent = total;
}
function renderCartItems() {
  const list = document.getElementById('cartItemsList');
  list.innerHTML = '';
  cart.forEach((item, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name} ×${item.quantity}</span>
      <button class="remove-item">Remove</button>
    `;
    li.querySelector('.remove-item').addEventListener('click', () => {
      cart.splice(idx,1);
      updateCartCount(); updateCartTotal(); renderCartItems();
    });
    list.appendChild(li);
  });
  updateCartTotal();
}

// Enhanced addToCart
// AFTER: fourth param id
function addToCart(name, price, quantity, id = null) {
  // Try to match by id if passed, otherwise by name
  const existing = id
    ? cart.find(i => i.id === id)
    : cart.find(i => i.name === name);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id, name, price, quantity });
  }
  updateCartCount();
  renderCartItems();
}



// Toggle cart panel
function toggleCart(show) {
  document.getElementById('cartModal').classList.toggle('hidden', !show);
  document.getElementById('cartContainer').classList.toggle('hidden', show);
  if (show) renderCartItems();
}

// Wire up events
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cartButton')
    .addEventListener('click', () => toggleCart(true));
  document.getElementById('closeCart')
    .addEventListener('click', () => toggleCart(false));
    document.getElementById('placeOrder')
    .addEventListener('click', async () => {
      if (cart.length === 0) return alert('Cart is empty!');
  
      try {
        // Use a relative path so you don’t have to worry about URL-encoding spaces
        const res = await fetch('../api/place-order.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart })
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Unknown');
  
        alert(`Order #${data.order_id} placed!`);
        cart.length = 0;
        updateCartCount();
        renderCartItems();
        updateCartTotal();
        toggleCart(false);
      }
       catch (err) {
        console.error('Order error', err);
        alert('Failed to place order: ' + err.message);
      }
    });
  

    document.querySelectorAll('.medication-card .order-button').forEach(btn => {
      btn.addEventListener('click', e => {
        const card  = e.target.closest('.medication-card');
        const id    = card.dataset.productId;       // your existing attribute
        const name  = card.dataset.name;
        const price = parseFloat(card.dataset.price);
    
        // Pass id as the 4th argument
        addToCart(name, price, 1, id);
        toggleCart(true);
      });
    });
    

});
