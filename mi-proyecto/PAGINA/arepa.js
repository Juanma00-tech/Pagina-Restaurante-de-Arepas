// Catálogo de Productos
const infoArepas = {
    arepollo: { id: "arepollo", title: "Arepollo", price: 12000, img: "img/areta3.svg", desc: "Pollo desmechado premium, maíz dulce y queso fundido." },
    clasica: { id: "clasica", title: "Clásica", price: 12000, img: "img/areta2.svg", desc: "Mantequilla artesanal de finca y abundante queso campesino fresco." },
    despechada: { id: "despechada", title: "Despechada", price: 12000, img: "img/images.svg", desc: "Carne desmechada cocinada con hogao tradicional paisa y queso campesino." },
    gaseosa: { id: "gaseosa", title: "Gaseosa 400ml", price: 2500, img: "../img/gaseosa.svg", desc: "Bebida personal bien fría." },
    "queso-extra": { id: "queso-extra", title: "Queso Extra", price: 2000, img: "../img/queso.svg", desc: "Queso campesino fresco rallado." },
    tocineta: { id: "tocineta", title: "Tocineta Crocante", price: 3000, img: "../img/tocineta.svg", desc: "Tiras de tocineta ahumada dorada." },
    hogao: { id: "hogao", title: "Hogao Casero", price: 1000, img: "../img/hogao.svg", desc: "Salsa casera criolla tradicional." }
};

let cart = [];

function addToCart(id, qty = 1) {
    const item = infoArepas[id];
    if (!item) return;

    const existente = cart.find(i => i.id === id);
    if (existente) {
        existente.qty += qty;
    } else {
        cart.push({ id: item.id, name: item.title, price: item.price, qty: qty });
    }
    updateCartUI();
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((acc, i) => acc + i.qty, 0);
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = totalCount;

    const list = document.getElementById('cart-list');
    if (!list) return;

    let total = 0;
    list.innerHTML = "";

    if (cart.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#64748b; padding:15px 0;'>El carrito está vacío</p>";
    } else {
        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            list.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong><br>
                        <small style="color:#e65100;">$${item.price.toLocaleString('es-CO')} c/u</small>
                    </div>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <button class="cart-qty-btn" onclick="changeQty('${item.id}', -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="cart-qty-btn" onclick="changeQty('${item.id}', 1)">+</button>
                    </div>
                </div>`;
        });
    }

    const priceEl = document.getElementById('total-price');
    if (priceEl) priceEl.innerText = `$${total.toLocaleString('es-CO')}`;
}

function toggleModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.style.display = (m.style.display === 'block') ? 'none' : 'block';
}

function openDetails(id) {
    const p = infoArepas[id];
    if (!p) return;
    const detailsView = document.getElementById('details-view');
    if (detailsView) {
        detailsView.innerHTML = `
            <img src="${p.img}" alt="${p.title}" style="width:100%; height:180px; object-fit:cover; border-radius:12px; margin-bottom:12px;">
            <h2 style="color:#e65100; font-size:1.4rem;">${p.title}</h2>
            <p style="margin:10px 0; color:#475569; font-size:0.9rem;">${p.desc}</p>
            <p style="font-size:1.2rem; font-weight:bold; margin-bottom:14px;">Precio: <span style="color:#e65100;">$${p.price.toLocaleString('es-CO')}</span></p>
            <button class="btn-buy" style="width:100%; padding:12px;" onclick="addToCart('${p.id}', 1); closeModal('details-modal');">
                Añadir al Pedido
            </button>
        `;
    }
    toggleModal('details-modal');
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.style.display = 'none';
}

function toggleChat() {
    const win = document.getElementById('chat-window');
    if (win) win.style.display = (win.style.display === 'block') ? 'none' : 'block';
}

// Envío a WhatsApp con Validación de Cliente (Requerido para la BD)
function sendToWhatsApp() {
    if (cart.length === 0) return alert("Tu carrito está vacío. Agrega una arepa primero.");

    const nombre = document.getElementById('cliente-nombre')?.value.trim();
    const numero = document.getElementById('cliente-numero')?.value.trim();
    const direccion = document.getElementById('cliente-direccion')?.value.trim();

    if (!nombre || !numero || !direccion) {
        alert("Por favor completa tu Nombre, Número de teléfono y Dirección para entregar tu pedido.");
        return;
    }

    let total = 0;
    let msg = `👋 *¡Hola Areperos!* 🫓\nQuisiera hacer el siguiente pedido:\n\n`;
    cart.forEach(i => {
        const sub = i.price * i.qty;
        total += sub;
        msg += `• ${i.qty}x ${i.name} ($${sub.toLocaleString('es-CO')})\n`;
    });
    msg += `\n💰 *Total:* $${total.toLocaleString('es-CO')} COP\n`;
    msg += `\n📋 *Datos de Entrega:*\n`;
    msg += `👤 *Cliente:* ${nombre}\n`;
    msg += `📱 *Teléfono:* ${numero}\n`;
    msg += `📍 *Dirección:* ${direccion}\n\n`;
    msg += `¡Muchas gracias!`;

    window.open(`https://wa.me/573023364534?text=${encodeURIComponent(msg)}`, '_blank');
    fetch('http://localhost:3000/guardar-envio', {
  method: 'POST',
  headers: { 'Content-Type':'application/x-www-form-urlencoded'},
  body: `nombre=${nombre}&direccion=${direccion}&numero=${numero}`
  })
  .then(response => response.text())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

}
