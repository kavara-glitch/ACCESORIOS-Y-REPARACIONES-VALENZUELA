# Accesorios y reparaciones Valenzuela

Página web comercial de **Accesorios y reparaciones Valenzuela** (El Salvador). Responsable: Raúl Ramos. Teléfono y WhatsApp: 7818-9762 (+503). Moneda: USD.

Los pedidos y las consultas de reparación **se preparan en la web y los envía manualmente el cliente por WhatsApp**. La web no procesa pagos ni confirma pedidos. No usa base de datos ni servidor: todo es HTML, CSS y JavaScript.

## 1. Problema que resuelve
Los clientes no encuentran fácilmente accesorios organizados por categoría y precio, ni una forma clara de consultar reparaciones.

## 2. Objetivos
Mostrar un catálogo ordenado, permitir armar pedidos para enviarlos por WhatsApp y consultar reparaciones con un formulario validado.

## 3. Público objetivo
Personas de El Salvador que buscan accesorios o reparaciones para sus dispositivos.

## 4. Funcionalidades
- Menú móvil, búsqueda (nombre o modelo), filtros por categoría y precio, orden por precio o nombre, detalles, favoritos y carrito con total estimado.
- «Hacer pedido por WhatsApp» con mensaje generado y codificado; no abre WhatsApp con el carrito vacío.
- Servicios de reparación (pendientes de confirmación) y formulario de consulta con validación y resumen previo.
- «Encuentra tu accesorio», «Tu celular, tu estilo» y «Ofertas y destacados».
- Panel del administrador: contraseña propia (se puede cambiar), productos con imagen, precio, categoría y modelo, y **Administrar categorías** (agregar, editar nombre y eliminar solo si no tienen productos).

## 5. Tecnologías
HTML5, CSS3 (Grid y Flexbox), JavaScript puro, localStorage y enlaces `wa.me`.

## 6. Estructura
```
ACCESORIOS-VALENZUELA/
├── index.html
├── admin.html
├── css/styles.css
├── js/catalogo.js   (catálogo publicado: categorías y productos)
├── js/data.js       (negocio, servicios, validación)
├── js/app.js        (tienda, carrito, WhatsApp)
├── js/admin.js      (panel del administrador)
├── assets/images/
├── assets/icons/
└── README.md
```

## 7. Cómo funciona el catálogo
- La tienda muestra lo que contiene `js/catalogo.js`. Al inicio está vacío.
- El administrador trabaja en `admin.html`: sus cambios se guardan en su navegador y persisten al recargar. En la tienda, ese navegador ve una barra de «vista previa» mientras haya cambios sin publicar.
- Para que los clientes vean los cambios: en el panel pulsa **Descargar catálogo para publicar**, y sube el archivo `catalogo.js` a la carpeta `js` del repositorio en GitHub (reemplaza el anterior).

## 8. Primer uso del panel
1. Abre `admin.html`. La primera vez te pide crear una contraseña (mínimo 8 caracteres).
2. Revisa o ajusta las categorías en «Administrar categorías».
3. Agrega productos. Las imágenes se reducen y se guardan dentro del catálogo.
4. Publica con el botón de descarga.

La contraseña se puede cambiar en el mismo panel. Si se olvida, el enlace «Olvidé mi contraseña» permite crear otra sin borrar productos ni categorías.

## 9. Categorías
Las 9 categorías iniciales son fijas hasta que el administrador las edite. Al renombrar una categoría sus productos se conservan. Una categoría con productos no se puede eliminar. Las categorías «Fundas» y «Protectores» tienen campos propios (colores, estilo y modelos compatibles).

## 10. Probar y publicar
- Local: abre `index.html` en el navegador.
- GitHub Pages: sube el contenido de la carpeta a un repositorio y activa *Settings → Pages* (rama principal, carpeta raíz). Las rutas son relativas.

## 11. Seguridad: qué protege y qué no
- Sin servidor no existe una protección real del panel. La contraseña (guardada con hash y sal) solo evita que otras personas usen tu panel desde tu navegador.
- Lo que ven los clientes lo decide únicamente el archivo `catalogo.js` del repositorio: nadie puede cambiarlo desde la web. Protege tu cuenta de GitHub con una contraseña fuerte y verificación en dos pasos.
- Los textos se escapan al mostrarse y los datos del catálogo se validan al cargarlos.

## 12. Pruebas realizadas
En un entorno simulado (jsdom), sin errores de JavaScript: catálogo vacío, categorías (agregar, duplicadas, editar, eliminar con y sin productos), producto en categoría nueva, persistencia al recargar, contraseña (crear, entrar, cambiar, olvidé), exportación de `catalogo.js`, vista previa frente a catálogo publicado, carrito, mensajes de WhatsApp y protección contra HTML inyectado.

**Falta comprobar tú:** que WhatsApp abra con el 7818-9762 y esa cuenta esté activa, el aspecto en teléfonos reales, y la descarga del archivo en tu navegador.

## 13. Limitaciones
- Los cambios del panel no se publican solos: hay que subir `catalogo.js`.
- El administrador trabaja desde un navegador; en otro dispositivo debe volver a crear su contraseña y no verá los cambios sin publicar.
- El espacio del navegador es limitado (unos 5 MB): usa imágenes pequeñas.
- Los servicios de reparación se editan en `js/data.js`.
- El carrito y los favoritos se guardan en el navegador de cada cliente.
- Sin pagos, envíos ni confirmación automática de pedidos. No se muestran dirección ni horarios porque no están confirmados.
