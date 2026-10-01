import { getCart, getSubtotal, removeItem, setQuantity } from "./cart.js";
import { CURRENCY } from "./config.js";
import { initNavbar } from "./navbar.js";
import { announce, escapeHtml, formatPrice, on, qs } from "./utilities.js";

function render() {
  const root = qs("[data-cart]");
  const cart = getCart();

  if (!cart.items.length) {
    root.innerHTML = `
      <div class="empty">
        <h1>Your cart is empty</h1>
        <p>Browse featured products and add items to save them on this device.</p>
        <p><a class="btn" href="index.html">Continue shopping</a></p>
      </div>`;
    return;
  }

  root.innerHTML = `
    <h1>Shopping cart</h1>
    <table class="cart-table">
      <caption class="sr-only">Items in your cart</caption>
      <thead>
        <tr>
          <th scope="col">Product</th>
          <th scope="col">Price</th>
          <th scope="col">Quantity</th>
          <th scope="col">Total</th>
          <th scope="col"><span class="sr-only">Remove</span></th>
        </tr>
      </thead>
      <tbody>
        ${cart.items
          .map(
            (item) => `
          <tr data-id="${escapeHtml(item.id)}">
            <td>
              <div class="cart-item">
                <img src="${escapeHtml(item.image)}" alt="">
                <a href="product.html?id=${encodeURIComponent(item.id)}">${escapeHtml(item.title)}</a>
              </div>
            </td>
            <td>${escapeHtml(formatPrice(item.price, CURRENCY))}</td>
            <td>
              <div class="qty">
                <button type="button" data-dec aria-label="Decrease quantity of ${escapeHtml(item.title)}">−</button>
                <input type="number" min="1" value="${item.quantity}" aria-label="Quantity for ${escapeHtml(item.title)}">
                <button type="button" data-inc aria-label="Increase quantity of ${escapeHtml(item.title)}">+</button>
              </div>
            </td>
            <td>${escapeHtml(formatPrice(item.price * item.quantity, CURRENCY))}</td>
            <td>
              <button class="btn btn--ghost" type="button" data-remove>Remove</button>
            </td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
    <div class="cart-summary">
      <p>Subtotal</p>
      <p><strong>${escapeHtml(formatPrice(getSubtotal(), CURRENCY))}</strong></p>
    </div>
  `;

  root.querySelectorAll("tr[data-id]").forEach((row) => {
    const id = row.dataset.id;
    const input = row.querySelector("input");
    on(row.querySelector("[data-dec]"), "click", () => {
      setQuantity(id, Number(input.value) - 1);
      announce("Cart updated");
      render();
    });
    on(row.querySelector("[data-inc]"), "click", () => {
      setQuantity(id, Number(input.value) + 1);
      announce("Cart updated");
      render();
    });
    on(input, "change", () => {
      setQuantity(id, Number(input.value));
      announce("Cart updated");
      render();
    });
    on(row.querySelector("[data-remove]"), "click", () => {
      removeItem(id);
      announce("Item removed from cart");
      render();
    });
  });
}

initNavbar();
render();
