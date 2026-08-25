console.log('✅ orders.js loaded');


document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('ordersContainer');
  const template  = document.getElementById('orderTemplate');

  try {
    // 1) Fetch the user's orders
    const res = await fetch('../api/get-order.php');
    const orders = await res.json();

    if (orders.length === 0) {
      container.textContent = 'You have no orders yet.';
      return;
    }

    // 2) For each order, clone the template and fill in data
    orders.forEach(order => {
      const clone = template.content.cloneNode(true);
      clone.querySelector('.order-id').textContent   = order.order_id;
      clone.querySelector('.order-date').textContent = new Date(order.created_at)
        .toLocaleString();

      // Status
      const statusEl = clone.querySelector('.status');
      statusEl.textContent = order.status;
      statusEl.classList.add(order.status);

      // Total
      clone.querySelector('.total').textContent = `Total: R${parseFloat(order.total).toFixed(2)}`;

      // Items
      const itemsList = clone.querySelector('.items-list');
      order.items.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${item.product_name} ×${item.quantity}</span>
          <span>R${parseFloat(item.price).toFixed(2)}</span>
        `;
        itemsList.appendChild(li);
      });

      container.appendChild(clone);
    });

  } catch (err) {
    console.error('Failed loading orders:', err);
    container.textContent = 'Error loading orders. Please try again later.';
  }
});
