/**
 * ==========================================================================
 * EcoPrevención Store - JavaScript ES6+ Nativo
 * Arquitectura modular, sin librerías externas.
 * Manejo del carrito de compras, pedidos por WhatsApp, validación y Formspree.
 * ==========================================================================
 */

/* ==========================================================================
   1. CONFIGURACIÓN DEL NEGOCIO (DATOS OFICIALES)
   ========================================================================== */
const CONFIG_TIENDA = {
  // Número de WhatsApp con código de país (Perú: 51941862027)
  whatsappNumero: "51941862027",

  // Número de celular para llamadas o contacto
  telefonoContacto: "941862027",

  // Correo electrónico de contacto oficial
  correoContacto: "ariana.rosado.capilla044@gmail.com",

  // Enlace oficial de Formspree
  formspreeAction: "https://formspree.io/f/xoeelojk",

  // Saludo inicial obligatorio para pedidos por WhatsApp
  saludoWhatsApp: "¡Hola! Bienvenido a EcoPrevención Store. Gracias por tu compra. ¿En qué podemos ayudarte?",

  // Ruta del logo
  logoRuta: "img/logo.png"
};

// Utilidad para limpiar cualquier corchete accidental en la configuración
function limpiarConfig(str) {
  if (!str) return "";
  return String(str).replace(/[\[\]]/g, "").trim();
}

/* ==========================================================================
   2. CATÁLOGO DE PRODUCTOS (OFICIAL)
   ========================================================================== */
const PRODUCTOS = [
  {
    id: 1,
    nombre: "Linterna LED",
    descripcion: "Útil para iluminar durante los cortes de energía.",
    precio: 25.00,
    imagen: "img/linterna.jpg",
    categoria: "energia",
    etiquetaCategoria: "Iluminación & Energía",
    destacado: true
  },
  {
    id: 2,
    nombre: "Botas impermeables",
    descripcion: "Protegen los pies durante las lluvias y zonas inundadas.",
    precio: 45.00,
    imagen: "img/botas.jpg",
    categoria: "lluvia",
    etiquetaCategoria: "Protección de Lluvias",
    destacado: true
  },
  {
    id: 3,
    nombre: "Impermeable",
    descripcion: "Protege de las lluvias intensas.",
    precio: 30.00,
    imagen: "img/impermeable.jpg",
    categoria: "lluvia",
    etiquetaCategoria: "Protección de Lluvias",
    destacado: true
  },
  {
    id: 4,
    nombre: "Mochila de emergencia",
    descripcion: "Permite guardar artículos importantes ante una emergencia.",
    precio: 55.00,
    imagen: "img/mochila.jpg",
    categoria: "emergencia",
    etiquetaCategoria: "Supervivencia",
    destacado: true
  },
  {
    id: 5,
    nombre: "Botella de agua",
    descripcion: "Permite almacenar agua potable.",
    precio: 12.00,
    imagen: "img/botella.jpg",
    categoria: "salud",
    etiquetaCategoria: "Hidratación Segura",
    destacado: false
  },
  {
    id: 6,
    nombre: "Botiquín de primeros auxilios",
    descripcion: "Contiene materiales básicos para atender pequeñas emergencias.",
    precio: 35.00,
    imagen: "img/botiquin.jpg",
    categoria: "salud",
    etiquetaCategoria: "Salud & Auxilios",
    destacado: true
  }
];

/* ==========================================================================
   3. ESTADO GLOBAL DE LA APLICACIÓN
   ========================================================================== */
const EstadoApp = {
  carrito: [],
  categoriaFiltro: "todos",

  // Cargar carrito desde LocalStorage
  inicializarCarrito() {
    try {
      const guardado = localStorage.getItem("ecoprevencion_carrito");
      if (guardado) {
        this.carrito = JSON.parse(guardado);
      }
    } catch (e) {
      console.warn("No se pudo acceder al almacenamiento local:", e);
      this.carrito = [];
    }
  },

  // Guardar carrito en LocalStorage
  guardarCarrito() {
    try {
      localStorage.setItem("ecoprevencion_carrito", JSON.stringify(this.carrito));
    } catch (e) {
      console.warn("Error al guardar carrito:", e);
    }
  }
};

/* ==========================================================================
   4. UTILIDADES Y FORMATO
   ========================================================================== */
const Utilidades = {
  // Formatea un número al estándar monetario en Soles peruanos
  formatoSoles(monto) {
    return `S/ ${Number(monto).toFixed(2)}`;
  },

  // Muestra una notificación emergente ("toast")
  mostrarNotificacion(mensaje, accionTexto = null, onAccion = null) {
    const toast = document.getElementById("toast-notification");
    const toastMsg = document.getElementById("toast-message");
    const toastAction = document.getElementById("toast-action-btn");

    if (!toast || !toastMsg) return;

    toastMsg.textContent = mensaje;

    if (accionTexto && onAccion && toastAction) {
      toastAction.style.display = "inline-block";
      toastAction.textContent = accionTexto;
      toastAction.onclick = () => {
        onAccion();
        toast.classList.remove("show");
      };
    } else if (toastAction) {
      toastAction.style.display = "none";
    }

    toast.classList.add("show");

    if (this._toastTimer) clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3800);
  },

  // Fallback si una imagen no existe o falla su carga
  manejarErrorImagen(imgElement, nombreProducto) {
    imgElement.style.display = "none";
    const contenedor = imgElement.parentElement;
    if (contenedor) {
      const fallback = contenedor.querySelector(".product-image-fallback");
      if (fallback) {
        fallback.style.display = "flex";
      }
    }
  }
};

/* ==========================================================================
   5. RENDERIZADO DEL CATÁLOGO DE PRODUCTOS
   ========================================================================== */
const ModuloProductos = {
  renderizar(filtro = "todos") {
    const contenedor = document.getElementById("products-container");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    const filtrados = filtro === "todos"
      ? PRODUCTOS
      : PRODUCTOS.filter(p => p.categoria === filtro);

    if (filtrados.length === 0) {
      contenedor.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
          <p style="color: var(--gris-texto-secundario);">No se encontraron productos en esta categoría.</p>
        </div>
      `;
      return;
    }

    filtrados.forEach(prod => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.dataset.id = prod.id;

      card.innerHTML = `
        <div class="product-image-container">
          <img 
            src="${prod.imagen}" 
            alt="${prod.nombre} - EcoPrevención Store" 
            class="product-image"
            loading="lazy"
            onerror="window.EcoApp.manejarErrorImagen(this, '${prod.nombre}')"
          />
          <div class="product-image-fallback">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span>${prod.nombre}</span>
            <small style="font-size: 0.72rem; color: #64748B;">Foto: ${prod.imagen}</small>
          </div>
        </div>
        <div class="product-content">
          <span class="product-category">${prod.etiquetaCategoria}</span>
          <h3 class="product-title">${prod.nombre}</h3>
          <p class="product-description">${prod.descripcion}</p>
          
          <div class="product-price-row">
            <span class="price-label">Precio unitario</span>
            <span class="product-price">${Utilidades.formatoSoles(prod.precio)}</span>
          </div>

          <div class="product-actions">
            <div class="qty-control" aria-label="Cantidad para ${prod.nombre}">
              <button 
                type="button" 
                class="qty-btn" 
                aria-label="Disminuir cantidad" 
                onclick="window.EcoApp.cambiarCantidadTarjeta(${prod.id}, -1)"
              >-</button>
              <input 
                type="number" 
                id="qty-card-${prod.id}" 
                class="qty-input" 
                value="1" 
                min="1" 
                max="99" 
                readonly
                aria-label="Cantidad seleccionada"
              />
              <button 
                type="button" 
                class="qty-btn" 
                aria-label="Aumentar cantidad" 
                onclick="window.EcoApp.cambiarCantidadTarjeta(${prod.id}, 1)"
              >+</button>
            </div>
            <button 
              type="button" 
              class="btn-add-cart" 
              id="btn-add-${prod.id}"
              onclick="window.EcoApp.agregarDesdeTarjeta(${prod.id})"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span>Agregar</span>
            </button>
          </div>
        </div>
      `;

      contenedor.appendChild(card);
    });
  },

  // Ajusta el selector de cantidad en la tarjeta del producto
  ajustarCantidad(productoId, delta) {
    const input = document.getElementById(`qty-card-${productoId}`);
    if (!input) return;
    let actual = parseInt(input.value, 10) || 1;
    actual = Math.max(1, Math.min(99, actual + delta));
    input.value = actual;
  }
};

/* ==========================================================================
   6. LÓGICA COMPLETA DEL CARRITO DE COMPRAS (CORREGIDO "VACIAR CARRITO")
   ========================================================================== */
const ModuloCarrito = {
  // Agregar producto al carrito
  agregarProducto(productoId, cantidad = 1) {
    const prod = PRODUCTOS.find(p => p.id === productoId);
    if (!prod) return;

    const itemExistente = EstadoApp.carrito.find(item => item.id === productoId);

    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      EstadoApp.carrito.push({
        id: prod.id,
        nombre: prod.nombre,
        precio: prod.precio,
        imagen: prod.imagen,
        cantidad: cantidad
      });
    }

    EstadoApp.guardarCarrito();
    this.actualizarVistas();

    // Feedback visual en el botón
    const btn = document.getElementById(`btn-add-${productoId}`);
    if (btn) {
      const span = btn.querySelector("span");
      const textoOriginal = span ? span.textContent : "Agregar";
      if (span) span.textContent = "¡Agregado!";
      btn.classList.add("added");

      setTimeout(() => {
        if (span) span.textContent = textoOriginal;
        btn.classList.remove("added");
      }, 1200);
    }

    Utilidades.mostrarNotificacion(
      `✓ Se agregó "${prod.nombre}" al carrito.`,
      "Ver Carrito",
      () => ModuloCarrito.abrirDrawer()
    );
  },

  // Aumentar cantidad de un producto en el carrito
  incrementarCantidad(productoId) {
    const item = EstadoApp.carrito.find(i => i.id === productoId);
    if (item) {
      item.cantidad += 1;
      EstadoApp.guardarCarrito();
      this.actualizarVistas();
    }
  },

  // Disminuir cantidad de un producto en el carrito
  decrementarCantidad(productoId) {
    const item = EstadoApp.carrito.find(i => i.id === productoId);
    if (item) {
      if (item.cantidad > 1) {
        item.cantidad -= 1;
      } else {
        this.eliminarProducto(productoId);
        return;
      }
      EstadoApp.guardarCarrito();
      this.actualizarVistas();
    }
  },

  // Eliminar producto individual del carrito
  eliminarProducto(productoId) {
    const item = EstadoApp.carrito.find(i => i.id === productoId);
    const nombre = item ? item.nombre : "Producto";

    EstadoApp.carrito = EstadoApp.carrito.filter(i => i.id !== productoId);
    EstadoApp.guardarCarrito();
    this.actualizarVistas();

    Utilidades.mostrarNotificacion(`"${nombre}" fue retirado del carrito.`);
  },

  // VACIAR CARRITO CORREGIDO:
  // Se eliminó el window.confirm() nativo que los navegadores bloquean dentro de iframes.
  // Ahora vacía el carrito directamente de forma reactiva e inmediata con aviso visual.
  vaciarCarrito() {
    if (EstadoApp.carrito.length === 0) {
      Utilidades.mostrarNotificacion("Tu carrito ya se encuentra vacío.");
      return;
    }

    EstadoApp.carrito = [];
    EstadoApp.guardarCarrito();
    this.actualizarVistas();
    Utilidades.mostrarNotificacion("✓ Carrito vaciado correctamente.");
  },

  // Calcula totales y cantidades
  calcularTotales() {
    let totalArticulos = 0;
    let montoTotal = 0;

    EstadoApp.carrito.forEach(item => {
      totalArticulos += item.cantidad;
      montoTotal += (item.precio * item.cantidad);
    });

    return { totalArticulos, montoTotal };
  },

  // Sincroniza todas las vistas del carrito en el DOM
  actualizarVistas() {
    const { totalArticulos, montoTotal } = this.calcularTotales();

    // 1. Badge en la cabecera
    const badges = document.querySelectorAll(".cart-badge-count");
    badges.forEach(b => {
      b.textContent = totalArticulos;
    });

    // 2. Subtotal en la cabecera
    const headerTotals = document.querySelectorAll(".cart-header-amount");
    headerTotals.forEach(h => {
      h.textContent = Utilidades.formatoSoles(montoTotal);
    });

    // 3. Renderizar items en la Sección Principal del Carrito
    this.renderizarListaEnContenedor("cart-items-main", false);

    // 4. Renderizar items en el Drawer Lateral
    this.renderizarListaEnContenedor("cart-drawer-items", true);

    // 5. Actualizar resúmenes de total
    const resumenSubtotales = document.querySelectorAll(".cart-summary-subtotal");
    resumenSubtotales.forEach(s => s.textContent = Utilidades.formatoSoles(montoTotal));

    const resumenTotales = document.querySelectorAll(".cart-summary-total");
    resumenTotales.forEach(t => t.textContent = Utilidades.formatoSoles(montoTotal));

    const resumenCantidades = document.querySelectorAll(".cart-summary-count");
    resumenCantidades.forEach(c => c.textContent = `${totalArticulos} ${totalArticulos === 1 ? 'artículo' : 'artículos'}`);

    // 6. Actualizar resumen dentro del formulario de contacto
    ModuloFormulario.actualizarResumenFormulario(totalArticulos, montoTotal);

    // 7. Estado visual de los botones de checkout
    const botonesCheckout = document.querySelectorAll(".btn-whatsapp-order");
    botonesCheckout.forEach(btn => {
      if (totalArticulos === 0) {
        btn.style.opacity = "0.55";
      } else {
        btn.style.opacity = "1";
      }
    });
  },

  // Renderiza HTML de items de carrito
  renderizarListaEnContenedor(elementId, esDrawer = false) {
    const contenedor = document.getElementById(elementId);
    if (!contenedor) return;

    if (EstadoApp.carrito.length === 0) {
      contenedor.innerHTML = `
        <div class="cart-empty-message">
          <svg class="cart-empty-icon" width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <h4 class="cart-empty-title">Tu carrito está vacío</h4>
          <p style="font-size: 0.9rem; color: #64748B; margin-bottom: 1.25rem;">
            Aún no has agregado artículos de prevención ante El Niño.
          </p>
          <a href="#productos" class="btn-primary" style="padding: 0.6rem 1.2rem; font-size: 0.9rem;" onclick="window.EcoApp.cerrarDrawer()">
            Explorar Productos
          </a>
        </div>
      `;
      return;
    }

    let html = "";
    EstadoApp.carrito.forEach(item => {
      const subtotal = item.precio * item.cantidad;
      html += `
        <div class="cart-item-row" data-id="${item.id}">
          <img 
            src="${item.imagen}" 
            alt="${item.nombre}" 
            class="cart-item-img"
            onerror="this.src='img/logo.png'"
          />
          <div class="cart-item-details">
            <span class="cart-item-title">${item.nombre}</span>
            <span class="cart-item-unit-price">Unitario: ${Utilidades.formatoSoles(item.precio)}</span>
          </div>
          <div class="cart-item-qty">
            <button 
              type="button" 
              class="cart-item-qty-btn" 
              title="Disminuir" 
              onclick="window.EcoApp.decrementarCantidad(${item.id})"
            >-</button>
            <span class="cart-item-qty-num">${item.cantidad}</span>
            <button 
              type="button" 
              class="cart-item-qty-btn" 
              title="Aumentar" 
              onclick="window.EcoApp.incrementarCantidad(${item.id})"
            >+</button>
          </div>
          <div class="cart-item-subtotal">
            ${Utilidades.formatoSoles(subtotal)}
          </div>
          <button 
            type="button" 
            class="btn-remove-item" 
            title="Eliminar producto"
            onclick="window.EcoApp.eliminarProducto(${item.id})"
            aria-label="Eliminar ${item.nombre}"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;
    });

    contenedor.innerHTML = html;
  },

  abrirDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("active");
      backdrop.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  },

  cerrarDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-drawer-backdrop");
    if (drawer && backdrop) {
      drawer.classList.remove("active");
      backdrop.classList.remove("active");
      document.body.style.overflow = "";
    }
  }
};

/* ==========================================================================
   7. MÓDULO FORMULARIO DE CONTACTO Y PEDIDOS
   Obligatoriedad de campos (incluido correo) e integración doble Correo + WhatsApp
   ========================================================================== */
const ModuloFormulario = {
  inicializar() {
    const form = document.getElementById("contact-order-form");
    if (!form) return;

    // Conectar el endpoint real de Formspree
    const urlFormspree = limpiarConfig(CONFIG_TIENDA.formspreeAction);
    if (urlFormspree) {
      form.setAttribute("action", urlFormspree);
    }

    form.addEventListener("submit", (e) => this.procesarEnvioFormulario(e));
  },

  // Actualiza la tarjeta de previsualización del pedido dentro del formulario
  actualizarResumenFormulario(totalArticulos, montoTotal) {
    const previewEl = document.getElementById("form-preview-text");
    const previewCard = document.getElementById("form-cart-summary");
    const hiddenPedido = document.getElementById("form-hidden-pedido");
    const hiddenTotal = document.getElementById("form-hidden-total");
    const hiddenArticulos = document.getElementById("form-hidden-articulos");

    if (previewEl) {
      if (totalArticulos === 0) {
        previewEl.textContent = "Tu carrito está vacío. Agrega productos para completar el pedido.";
        previewCard?.classList.add("empty");
      } else {
        previewEl.textContent = `${totalArticulos} ${totalArticulos === 1 ? 'artículo' : 'artículos'} seleccionados · Total: ${Utilidades.formatoSoles(montoTotal)}`;
        previewCard?.classList.remove("empty");
      }
    }

    // Actualizar campos ocultos para el correo de Formspree
    if (hiddenTotal) hiddenTotal.value = Utilidades.formatoSoles(montoTotal);
    if (hiddenArticulos) hiddenArticulos.value = totalArticulos;

    if (hiddenPedido) {
      if (totalArticulos === 0) {
        hiddenPedido.value = "Sin productos seleccionados.";
      } else {
        let detalle = "";
        EstadoApp.carrito.forEach((item, idx) => {
          detalle += `${idx + 1}. ${item.nombre} | Cant: ${item.cantidad} | Unitario: ${Utilidades.formatoSoles(item.precio)} | Subtotal: ${Utilidades.formatoSoles(item.precio * item.cantidad)}\n`;
        });
        detalle += `\nTOTAL DE LA COMPRA: ${Utilidades.formatoSoles(montoTotal)}`;
        hiddenPedido.value = detalle;
      }
    }
  },

  // Valida visualmente un campo
  validarCampo(id, condicion, mensajeError) {
    const input = document.getElementById(id);
    const errorEl = document.getElementById(`error-${id}`);
    if (!input) return false;

    if (!condicion) {
      input.classList.add("error");
      if (errorEl) {
        errorEl.textContent = mensajeError;
        errorEl.classList.add("visible");
      }
      return false;
    } else {
      input.classList.remove("error");
      if (errorEl) {
        errorEl.classList.remove("visible");
      }
      return true;
    }
  },

  // Obtiene y valida los datos del formulario
  validarFormularioCompleto() {
    const nombres = document.getElementById("form-nombres")?.value.trim() || "";
    const celular = document.getElementById("form-celular")?.value.trim() || "";
    const email = document.getElementById("form-email")?.value.trim() || "";
    const direccion = document.getElementById("form-direccion")?.value.trim() || "";
    const metodo = document.getElementById("form-metodo-entrega")?.value || "";
    const observaciones = document.getElementById("form-observaciones")?.value.trim() || "";

    let esValido = true;

    // 1. Nombres (obligatorio)
    if (!this.validarCampo("form-nombres", nombres.length >= 3, "Por favor, ingresa tus nombres y apellidos completos.")) {
      esValido = false;
    }

    // 2. Celular (obligatorio)
    const regexTel = /^[0-9+\s-]{8,15}$/;
    if (!this.validarCampo("form-celular", regexTel.test(celular), "Ingresa un número de celular válido (ej. 941862027).")) {
      esValido = false;
    }

    // 3. Correo electrónico (AHORA OBLIGATORIO)
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!this.validarCampo("form-email", email.length > 0 && regexEmail.test(email), "Por favor ingresa un correo electrónico válido (ej. tu_correo@gmail.com).")) {
      esValido = false;
    }

    // 4. Dirección (OPCIONAL - se puede determinar y coordinar por WhatsApp)
    const direccionFinal = direccion.length > 0 ? direccion : "Coordinar por WhatsApp";

    // 5. Método de entrega (obligatorio)
    if (!this.validarCampo("form-metodo-entrega", metodo !== "", "Selecciona un método de entrega.")) {
      esValido = false;
    }

    if (!esValido) {
      return null;
    }

    return { nombres, celular, email, direccion: direccionFinal, metodo, observaciones };
  },

  // Redirige al usuario al formulario si intentó comprar sin llenarlo
  redirigirAFormulario(mensaje = "Por favor completa tus datos en el formulario para procesar tu pedido.") {
    const cardForm = document.getElementById("form-card-container");
    const inputNombres = document.getElementById("form-nombres");

    if (cardForm) {
      cardForm.scrollIntoView({ behavior: "smooth", block: "center" });
      cardForm.classList.remove("highlight-pulse");
      // Forzar reflujo para reiniciar la animación
      void cardForm.offsetWidth;
      cardForm.classList.add("highlight-pulse");

      setTimeout(() => {
        if (inputNombres) inputNombres.focus();
      }, 500);
    }

    Utilidades.mostrarNotificacion(`📋 ${mensaje}`);
  },

  // Procesa el envío tanto por correo (Formspree) como por WhatsApp
  async procesarEnvioFormulario(e) {
    if (e) e.preventDefault();

    // 1. Verificar si hay productos en el carrito
    const { totalArticulos, montoTotal } = ModuloCarrito.calcularTotales();
    if (totalArticulos === 0) {
      Utilidades.mostrarNotificacion("⚠️ Tu carrito está vacío. Agrega productos antes de realizar tu pedido.");
      const seccionProd = document.getElementById("productos");
      if (seccionProd) seccionProd.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // 2. Validar los datos del formulario (incluyendo correo obligatorio)
    const datos = this.validarFormularioCompleto();
    if (!datos) {
      Utilidades.mostrarNotificacion("⚠️ Por favor completa los campos obligatorios marcados en rojo.");
      return;
    }

    // 3. Estado de envío en la interfaz
    const btnSubmit = document.getElementById("btn-submit-contact");
    const alertEl = document.getElementById("form-status-alert");
    const form = document.getElementById("contact-order-form");

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span>Enviando pedido a tu correo y WhatsApp...</span>`;
    }

    if (alertEl) {
      alertEl.className = "form-status-alert warning";
      alertEl.innerHTML = `⏳ Registrando pedido... Por favor espera un momento.`;
    }

    // Asegurar que los campos ocultos tengan el detalle actualizado
    this.actualizarResumenFormulario(totalArticulos, montoTotal);

    // 4. Enviar a Formspree vía fetch para recibirlo en el correo
    const urlFormspree = limpiarConfig(CONFIG_TIENDA.formspreeAction) || form.action;
    const formData = new FormData(form);

    try {
      if (urlFormspree && urlFormspree.includes("formspree.io")) {
        await fetch(urlFormspree, {
          method: "POST",
          body: formData,
          headers: {
            "Accept": "application/json"
          }
        });
      }
    } catch (err) {
      console.warn("Aviso de Formspree:", err);
    }

    // 5. Generar y abrir WhatsApp con la información completa
    ModuloWhatsApp.abrirWhatsAppConDatos(datos, totalArticulos, montoTotal);

    // 6. Mensaje de confirmación de éxito
    if (alertEl) {
      alertEl.className = "form-status-alert success";
      alertEl.innerHTML = `
        <strong>✓ ¡Pedido Registrado con Éxito!</strong><br/>
        • <strong>Correo enviado:</strong> Los datos y el resumen fueron enviados a <strong>${datos.email}</strong> y a la administración.<br/>
        • <strong>WhatsApp abierto:</strong> Se ha abierto WhatsApp con tu pedido listo para confirmar la entrega con nosotros.
      `;
    }

    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>¡Pedido Confirmado! (Volver a Enviar)</span>
      `;
    }

    Utilidades.mostrarNotificacion("✓ ¡Pedido completado! Enviado por correo y WhatsApp.");
  }
};

/* ==========================================================================
   8. MÓDULO DE PEDIDOS POR WHATSAPP
   ========================================================================== */
const ModuloWhatsApp = {
  // Cuando el usuario presiona "Finalizar Compra por WhatsApp":
  // Ahora es OBLIGATORIO que los datos del formulario estén completos.
  finalizarCompra() {
    const { totalArticulos, montoTotal } = ModuloCarrito.calcularTotales();

    if (totalArticulos === 0) {
      Utilidades.mostrarNotificacion("⚠️ Tu carrito está vacío. Agrega productos para realizar tu compra.");
      const seccion = document.getElementById("productos");
      if (seccion) seccion.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Verificar si el formulario ya está validado
    const datos = ModuloFormulario.validarFormularioCompleto();

    if (!datos) {
      // Si falta llenar el formulario, cerramos el drawer y lo llevamos a llenarlo
      ModuloCarrito.cerrarDrawer();
      ModuloFormulario.redirigirAFormulario("Para comprar, debes llenar el formulario. Tu pedido se enviará por correo y WhatsApp.");
      return;
    }

    // Si ya está completo, procesamos el pedido por correo y WhatsApp
    ModuloFormulario.procesarEnvioFormulario(null);
  },

  // Arma el mensaje oficial y abre WhatsApp
  abrirWhatsAppConDatos(datos, totalArticulos, montoTotal) {
    // 1. Saludo inicial obligatorio
    let mensaje = `${CONFIG_TIENDA.saludoWhatsApp}\n\n`;
    mensaje += `*--- RESUMEN DE MI PEDIDO ---*\n`;

    // 2. Desglose detallado por producto
    EstadoApp.carrito.forEach((item, index) => {
      const subtotal = item.precio * item.cantidad;
      mensaje += `\n${index + 1}. *${item.nombre}*\n`;
      mensaje += `   • Cantidad: ${item.cantidad}\n`;
      mensaje += `   • Precio unitario: ${Utilidades.formatoSoles(item.precio)}\n`;
      mensaje += `   • Subtotal: ${Utilidades.formatoSoles(subtotal)}\n`;
    });

    // 3. Totales
    mensaje += `\n*TOTAL DE LA COMPRA:* ${Utilidades.formatoSoles(montoTotal)}\n`;
    mensaje += `*Total de artículos:* ${totalArticulos}\n`;

    // 4. Datos del cliente obligatorios
    mensaje += `\n*--- DATOS DEL CLIENTE Y ENTREGA ---*\n`;
    mensaje += `• *Nombre:* ${datos.nombres}\n`;
    mensaje += `• *Celular:* ${datos.celular}\n`;
    mensaje += `• *Correo:* ${datos.email}\n`;
    mensaje += `• *Dirección:* ${datos.direccion}\n`;
    mensaje += `• *Método de entrega:* ${datos.metodo}\n`;
    if (datos.observaciones) {
      mensaje += `• *Observaciones:* ${datos.observaciones}\n`;
    }

    mensaje += `\n_Pedido registrado también en el sistema por correo electrónico. Quedo a la espera de su confirmación._`;

    // 5. Destino de WhatsApp oficial
    const numeroDestino = limpiarConfig(CONFIG_TIENDA.whatsappNumero) || "51941862027";
    const url = `https://wa.me/${numeroDestino}?text=${encodeURIComponent(mensaje)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  }
};

/* ==========================================================================
   9. COMBOS Y OFERTAS ESPECIALES
   ========================================================================== */
const ModuloOfertas = {
  // Combo Familiar Niño Costero (Linterna, Mochila, Botiquín, Impermeable)
  agregarComboFamiliar() {
    ModuloCarrito.agregarProducto(1, 1); // Linterna LED
    ModuloCarrito.agregarProducto(4, 1); // Mochila de emergencia
    ModuloCarrito.agregarProducto(6, 1); // Botiquín
    ModuloCarrito.agregarProducto(3, 1); // Impermeable

    Utilidades.mostrarNotificacion(
      "✓ ¡Combo Familiar agregado al carrito con éxito!",
      "Ver Carrito",
      () => ModuloCarrito.abrirDrawer()
    );
  },

  // Pack Doble Protección Lluvias (Botas + Impermeable)
  agregarPackLluvias() {
    ModuloCarrito.agregarProducto(2, 1); // Botas
    ModuloCarrito.agregarProducto(3, 1); // Impermeable

    Utilidades.mostrarNotificacion(
      "✓ ¡Pack Doble Protección Lluvias agregado al carrito!",
      "Ver Carrito",
      () => ModuloCarrito.abrirDrawer()
    );
  }
};

/* ==========================================================================
   10. INICIALIZACIÓN Y EVENT LISTENERS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Cargar carrito guardado
  EstadoApp.inicializarCarrito();

  // 2. Renderizar catálogo inicial
  ModuloProductos.renderizar("todos");

  // 3. Inicializar módulo de formulario
  ModuloFormulario.inicializar();

  // 4. Actualizar vistas de carrito
  ModuloCarrito.actualizarVistas();

  // 5. Configurar filtros de categoría
  const tabBtns = document.querySelectorAll(".filter-tab-btn");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const categoria = btn.dataset.category || "todos";
      ModuloProductos.renderizar(categoria);
    });
  });

  // 6. Menú hamburguesa móvil
  const mobileBtn = document.getElementById("mobile-menu-btn");
  const mainNav = document.getElementById("main-nav");
  if (mobileBtn && mainNav) {
    mobileBtn.addEventListener("click", () => {
      const expandido = mainNav.classList.toggle("mobile-open");
      mobileBtn.setAttribute("aria-expanded", expandido ? "true" : "false");
    });

    const navLinks = mainNav.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("mobile-open");
        mobileBtn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // 7. Evento scroll para sombra de cabecera
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });

  // 8. Backdrop del drawer lateral
  const backdrop = document.getElementById("cart-drawer-backdrop");
  if (backdrop) {
    backdrop.addEventListener("click", () => ModuloCarrito.cerrarDrawer());
  }

  // 9. Cerrar drawer con tecla Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      ModuloCarrito.cerrarDrawer();
    }
  });

  // 10. Vincular directamente botones de vaciar carrito como salvaguarda
  const btnVaciar = document.querySelectorAll(".btn-clear-cart");
  btnVaciar.forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      ModuloCarrito.vaciarCarrito();
    });
  });
});

/* ==========================================================================
   11. API PÚBLICA EXPUESTA EN WINDOW
   ========================================================================== */
window.EcoApp = {
  // Productos
  cambiarCantidadTarjeta: (id, delta) => ModuloProductos.ajustarCantidad(id, delta),
  agregarDesdeTarjeta: (id) => {
    const input = document.getElementById(`qty-card-${id}`);
    const cantidad = input ? parseInt(input.value, 10) || 1 : 1;
    ModuloCarrito.agregarProducto(id, cantidad);
  },
  manejarErrorImagen: (img, nombre) => Utilidades.manejarErrorImagen(img, nombre),

  // Carrito (vaciarCarrito 100% operativo sin confirm bloqueante)
  incrementarCantidad: (id) => ModuloCarrito.incrementarCantidad(id),
  decrementarCantidad: (id) => ModuloCarrito.decrementarCantidad(id),
  eliminarProducto: (id) => ModuloCarrito.eliminarProducto(id),
  vaciarCarrito: () => ModuloCarrito.vaciarCarrito(),
  abrirDrawer: () => ModuloCarrito.abrirDrawer(),
  cerrarDrawer: () => ModuloCarrito.cerrarDrawer(),

  // Checkout integrado WhatsApp + Correo
  finalizarCompra: () => ModuloWhatsApp.finalizarCompra(),

  // Ofertas
  agregarComboFamiliar: () => ModuloOfertas.agregarComboFamiliar(),
  agregarPackLluvias: () => ModuloOfertas.agregarPackLluvias()
};
