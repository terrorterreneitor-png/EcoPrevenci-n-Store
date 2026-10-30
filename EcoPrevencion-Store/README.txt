================================================================================
                    ECOPREVENCIÓN STORE - GUÍA DEL PROYECTO
          Tienda Virtual de Artículos de Emergencia ante el Fenómeno de El Niño
================================================================================

¡Bienvenido a EcoPrevención Store!
Este proyecto fue desarrollado íntegramente con tecnologías web estándar:
HTML5 Semántico, CSS3 y JavaScript ES6+ Nativo, sin frameworks ni bibliotecas
externas. Está 100% optimizado para ser editado y mantenido con facilidad en
Visual Studio Code.

--------------------------------------------------------------------------------
1. ESTRUCTURA DE ARCHIVOS Y CARPETAS
--------------------------------------------------------------------------------

EcoPrevencion-Store/
│
├── index.html          -> Estructura semántica completa de la página web (Inicio,
│                          Nosotros, Catálogo, Ofertas, Carrito y Contacto).
│
├── css/
│   └── estilos.css     -> Hoja de estilos con variables CSS, paleta oficial
│                          (Azul #1976D2, Verde #43A047, Blanco #FFFFFF),
│                          diseño responsivo y adaptaciones para móviles/PC.
│
├── js/
│   └── script.js       -> Lógica nativa de la tienda: catálogo interactivo,
│                          carrito de compras con cálculo de subtotales y total,
│                          generador del mensaje oficial para WhatsApp, validación
│                          de formulario y preparación para Formspree.
│
├── img/                -> Carpeta donde residen todas las imágenes:
│   ├── logo.png        -> Logotipo del negocio en la parte superior izquierda.
│   ├── linterna.jpg    -> Fotografía de Linterna LED (S/ 25.00).
│   ├── botas.jpg       -> Fotografía de Botas impermeables (S/ 45.00).
│   ├── impermeable.jpg -> Fotografía de Impermeable para lluvias (S/ 30.00).
│   ├── mochila.jpg     -> Fotografía de Mochila de emergencia 72h (S/ 55.00).
│   ├── botella.jpg     -> Fotografía de Botella de agua (S/ 12.00).
│   ├── botiquin.jpg    -> Fotografía de Botiquín de primeros auxilios (S/ 35.00).
│   └── hero.jpg        -> Fotografía del banner principal de prevención.
│
└── README.txt          -> Este manual de instrucciones paso a paso.


--------------------------------------------------------------------------------
2. CÓMO ABRIR Y EJECUTAR EL PROYECTO EN VISUAL STUDIO CODE
--------------------------------------------------------------------------------

Tienes dos formas muy sencillas de abrir la tienda en tu computadora:

OPCIÓN A: Con la extensión Live Server (Recomendada)
1. Abre Visual Studio Code.
2. Ve al menú superior: Archivo > Abrir carpeta... (File > Open Folder...).
3. Selecciona la carpeta del proyecto "EcoPrevencion-Store".
4. Instala la extensión "Live Server" de Ritwick Dey desde la pestaña de
   extensiones de VS Code (icono de cuatro cuadrados en la barra lateral izquierda).
5. Abre el archivo `index.html`.
6. Haz clic derecho sobre el editor y selecciona "Open with Live Server", o haz
   clic en el botón "Go Live" en la esquina inferior derecha de VS Code.
7. Tu navegador predeterminado se abrirá automáticamente en http://127.0.0.1:5500
   con la tienda lista y funcionando.

OPCIÓN B: Apertura directa en cualquier navegador
1. Ve a la carpeta donde descomprimiste el proyecto en tu computadora.
2. Haz doble clic sobre el archivo `index.html`.
3. Se abrirá de inmediato en Chrome, Edge, Firefox, Safari o Brave. Todas las
   funciones (carrito, cálculos y generación de mensajes) funcionarán
   correctamente sin necesidad de instalar nada.


--------------------------------------------------------------------------------
3. CÓMO PERSONALIZAR TUS DATOS (WHATSAPP, CELULAR, EMAIL Y FORMSPREE)
--------------------------------------------------------------------------------

Todos los datos editables están centralizados al inicio del archivo `js/script.js`
para que no tengas que buscar entre cientos de líneas de código.

Paso a paso:
1. Abre el archivo `js/script.js` en Visual Studio Code.
2. En las primeras líneas (línea 15 aprox.) encontrarás el bloque:

   const CONFIG_TIENDA = {
     // 1. WHATSAPP: Reemplaza con tu número con código de país (sin el + ni espacios):
     // Para Perú el código es 51. Ejemplo: "51987654321"
     whatsappNumero: "[COLOCAR AQUÍ MI NÚMERO DE CELULAR CON CÓDIGO DE PAÍS]",

     // 2. CELULAR: Reemplaza con tu número para llamadas o contacto:
     telefonoContacto: "[COLOCAR MI NÚMERO DE CELULAR]",

     // 3. CORREO: Reemplaza con tu correo electrónico de atención:
     correoContacto: "[COLOCAR MI CORREO ELECTRÓNICO]",

     // 4. FORMSPREE: Reemplaza con el link de tu cuenta de Formspree:
     formspreeAction: "[COLOCAR AQUÍ MI LINK DE FORMSPREE]",

     // 5. Saludo inicial obligatorio:
     saludoWhatsApp: "¡Hola! Bienvenido a EcoPrevención Store. Gracias por tu compra. ¿En qué podemos ayudarte?",

     // 6. Ruta del logo:
     logoRuta: "img/logo.png"
   };

3. Guarda los cambios con Ctrl + S (o Cmd + S en Mac). ¡Listo!
   La tienda actualizará los teléfonos, correos y el destino de WhatsApp
   automáticamente en toda la página.


--------------------------------------------------------------------------------
4. CÓMO INTEGRAR FORMSPREE (GRATIS)
--------------------------------------------------------------------------------

Formspree te permite recibir los mensajes del formulario de contacto directamente
en tu correo electrónico sin programar ningún backend:

1. Ingresa a https://formspree.io y crea una cuenta gratuita.
2. Haz clic en "+ New Form" (Crear nuevo formulario).
3. asígnale el nombre "EcoPrevención Contacto" y asocia tu correo electrónico.
4. Formspree te dará un enlace que se ve así:
   https://formspree.io/f/mwpkqxyz
5. Copia ese enlace.
6. En `js/script.js`, en el bloque CONFIG_TIENDA, reemplaza:
   formspreeAction: "https://formspree.io/f/mwpkqxyz",
7. En `index.html` (línea 430 aprox.), también puedes actualizar el atributo action:
   <form id="contact-order-form" action="https://formspree.io/f/mwpkqxyz" method="POST">
8. ¡Listo! Cada vez que un cliente envíe el formulario, te llegará un correo con
   sus datos de inmediato.


--------------------------------------------------------------------------------
5. CÓMO REEMPLAZAR LAS IMÁGENES Y EL LOGOTIPO POR TUS PROPIAS FOTOGRAFÍAS
--------------------------------------------------------------------------------

El proyecto ya incluye fotografías reales de alta calidad y un logotipo corporativo
preparado. Si en el futuro deseas cambiarlos por tus propias fotos:

1. Toma tus fotografías o diseña tu logotipo.
2. Guárdalas en formato JPG (o PNG para el logo con fondo transparente).
3. Renombra tus archivos con los mismos nombres exactos:
   - logo.png
   - linterna.jpg
   - botas.jpg
   - impermeable.jpg
   - mochila.jpg
   - botella.jpg
   - botiquin.jpg
4. Copia tus fotos dentro de la carpeta `img/` reemplazando los archivos existentes.
5. ¡No necesitas modificar una sola línea de código! La página web cargará tus
   nuevas fotos automáticamente manteniendo las proporciones y el diseño intacto.

* Nota de seguridad: Si alguna imagen se borra o no carga, la página web cuenta
  con un sistema de protección visual inteligente ("fallback") que muestra un
  espacio ordenado sin romper el diseño ni desalinear las tarjetas.


--------------------------------------------------------------------------------
6. FUNCIONAMIENTO DEL PEDIDO POR WHATSAPP (REQUISITO 5)
--------------------------------------------------------------------------------

Al presionar el botón verde "Finalizar Compra por WhatsApp":
1. El sistema verifica que haya artículos en el carrito.
2. Genera automáticamente el mensaje con el formato oficial:
   - Saludo al negocio:
     "¡Hola! Bienvenido a EcoPrevención Store. Gracias por tu compra. ¿En qué podemos ayudarte?"
   - Nombre de cada producto solicitado.
   - Cantidad exacta.
   - Precio unitario en Soles (S/).
   - Subtotal calculado por producto.
   - Total general de la compra.
   - Datos del cliente y método de entrega (si completó el formulario).
3. Se abre WhatsApp (Web en PC o la app en celulares) con el mensaje redactado
   y listo para enviar con un solo toque.


--------------------------------------------------------------------------------
7. REQUISITOS TÉCNICOS CUMPLIDOS
--------------------------------------------------------------------------------

✔ HTML5 Semántico (<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>)
✔ CSS3 Puro con variables globales, Flexbox, CSS Grid y Media Queries
✔ JavaScript ES6+ Nativo (sin librerías, sin React, sin frameworks externos)
✔ Paleta Corporativa: Azul (#1976D2), Verde (#43A047) y Blanco (#FFFFFF)
✔ Carrito 100% funcional con actualización reactiva y persistencia en LocalStorage
✔ 6 Productos oficiales con descripciones, precios en Soles (S/) e imágenes
✔ Botón flotante y botones directos de compra por WhatsApp
✔ Formulario accesible y validado con soporte para Formspree
✔ 100% responsivo para teléfonos inteligentes, tabletas y computadoras de escritorio

================================================================================
Desarrollado con dedicación para EcoPrevención Store y el bienestar comunitario.
================================================================================
