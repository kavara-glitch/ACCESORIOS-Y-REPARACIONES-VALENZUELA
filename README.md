# Accesorios y reparaciones Valenzuela

Página web comercial para el negocio **Accesorios y reparaciones Valenzuela** (El Salvador). Responsable: Raúl Ramos. Teléfono y WhatsApp: 7818-9762 (+503). Moneda: USD.

Los pedidos y las consultas de reparación **se preparan en la web y los envía manualmente el cliente por WhatsApp**. La web no procesa pagos, no confirma pedidos y no tiene base de datos compartida.

## 1. Problema que resuelve
Los clientes no encuentran fácilmente accesorios organizados por categoría y precio, ni una forma clara de consultar reparaciones.

## 2. Objetivos
- Mostrar un catálogo ordenado con búsqueda, filtros y favoritos.
- Permitir armar un pedido en un carrito y enviarlo por WhatsApp.
- Permitir consultar reparaciones con un formulario validado.

## 3. Público objetivo
Personas de El Salvador que usan teléfonos y otros dispositivos y buscan accesorios o reparaciones.

## 4. Funcionalidades
- Menú móvil, búsqueda, 9 categorías, filtros por categoría y precio, orden por precio o nombre.
- Variantes, detalles, favoritos con sección propia, y carrito con cantidades, subtotales y total estimado (guardado en localStorage).
- «Hacer pedido por WhatsApp»: mensaje generado con los productos del carrito y codificado con `encodeURIComponent()`. No abre WhatsApp si el carrito está vacío.
- Servicios de reparación (pendientes de confirmación) con consulta por WhatsApp y formulario con validación y resumen previo.
- «Encuentra tu accesorio», «Tu celular, tu estilo» y paquetes de demostración.
- Inicio de sesión del administrador (`admin.html`) con cuenta incluida y cambio de contraseña.
- Panel del dueño: agregar, editar, ocultar y eliminar productos con imagen (se sube desde el dispositivo), precio, categoría, modelo o referencia (cables, cargadores, baterías, etc.), modelos compatibles (fundas y protectores), conexión y disponibilidad.

## 5. Tecnologías
HTML5, CSS3 (Grid y Flexbox), JavaScript puro, localStorage y enlaces `wa.me`.

## 6. Estructura
```
ACCESORIOS-VALENZUELA/
├── index.html
├── admin.html
├── css/styles.css
├── js/data.js      (negocio, categorías, productos, servicios)
├── js/app.js       (tienda, carrito, WhatsApp)
├── js/admin.js     (panel del dueño)
├── assets/images/  (fotos de productos)
├── assets/icons/
└── README.md
```

## 7. Cómo ejecutarlo
Abre `index.html` en un navegador. No necesita instalación.

## 8. Publicar en GitHub Pages
1. Sube el contenido de la carpeta a un repositorio.
2. En *Settings → Pages*, elige la rama principal y la carpeta raíz.
3. Abre la dirección que GitHub indique y prueba los enlaces de WhatsApp.
Todas las rutas son relativas.

## 9. Configurar WhatsApp y datos del negocio
En `js/data.js`, el objeto `BUSINESS` guarda el nombre, el responsable y el número internacional (`50378189762`). Los enlaces tienen la forma `https://wa.me/50378189762?text=...`. En `index.html`, el enlace de llamada es `tel:+50378189762`.

## 10. Agregar productos reales
- Con el panel `admin.html`, o editando `DEFAULTS` en `js/data.js`.
- Inicia sesión en `admin.html` (usuario `admin`; la contraseña inicial está en `js/admin.js`) y sube la foto desde el formulario. La imagen se reduce y se guarda en el navegador.
- Para fotos fijas en el sitio, copia los archivos a `assets/images/` y usa su ruta en el campo `img` de `js/data.js`.
- Los productos creados en el panel dejan de mostrar la etiqueta «Demostración».

## 11. Pruebas realizadas
Probadas en un entorno simulado (jsdom), sin errores de JavaScript: catálogo, categorías, favoritos, carrito (cantidades, totales, persistencia), mensaje de pedido, carrito vacío sin pedido, validación y mensaje de reparación, mensaje por servicio, y panel del dueño con sus cambios reflejados en la tienda.

**Pendiente de comprobar manualmente:** que WhatsApp abra con el número 7818-9762 y que esa cuenta esté activa; el aspecto en teléfonos reales (Android e iPhone) y tabletas; las imágenes reales; el enlace de llamada.

## 12. Limitaciones
- Datos, precios, imágenes y compatibilidades son de demostración hasta que el dueño registre los reales.
- Los servicios de reparación están pendientes de confirmación; no hay precios ni tiempos.
- El panel y los favoritos usan localStorage: los cambios solo existen en ese navegador y no se sincronizan.
- El inicio de sesión es solo un acceso básico: usuario y clave están en `js/admin.js` y la contraseña cambiada se guarda en el navegador. **No es seguridad real** y no protege información.
- Las imágenes subidas se guardan en el navegador (espacio limitado, unos 5 MB en total).
- GitHub Pages es estático: no hay base de datos ni administración compartida.
- No hay pagos, envíos ni confirmación automática de pedidos.
- Los servicios de reparación no se editan desde el panel (se cambian en `js/data.js`).

## 13. Mejoras futuras
Base de datos con ingreso real para el dueño, fotos reales, administración de servicios y promociones, registro de existencias y datos confirmados de horarios y ubicación.
