# NEXORA ACCESS

**Pequeños accesorios. Grandes conexiones.**

## 1. Nombre y descripción
Prototipo funcional de una boutique en línea de accesorios electrónicos pequeños (cables, fundas, cargadores, baterías, protectores, adaptadores y soportes), pensada como un negocio que podría abrir en El Salvador. Productos, precios y compatibilidades son datos de demostración.

## 2. Problema identificado
Es difícil encontrar accesorios organizados por tipo, precio y compatibilidad.

## 3. Justificación
Comprar un accesorio incorrecto genera gastos y devoluciones. Una tienda que ordene el catálogo y avise cuando la compatibilidad no está confirmada ahorra tiempo y dinero.

## 4. Objetivos
- General: crear un prototipo de tienda de accesorios fácil de usar.
- Específicos: filtrar por categoría, precio y compatibilidad; ofrecer carrito persistente; validar el contacto; funcionar en celular, tableta y computadora.

## 5. Público objetivo
Jóvenes y adultos que usan teléfonos celulares a diario y buscan accesorios accesibles.

## 6. Solución propuesta
Un catálogo con buscador, filtros, la herramienta «Encuentra tu accesorio», la sección «Tu celular, tu estilo», ofertas en paquete y atención al cliente.

## 7. Tecnologías utilizadas
HTML5 semántico, CSS3 (Grid y Flexbox), JavaScript puro y localStorage. Sin dependencias.

## 8. Funcionalidades implementadas
- Menú móvil, búsqueda por nombre, filtros por categoría y precio, orden por precio.
- Variantes por producto, detalles, favoritos y carrito (cantidades, subtotales, total, resumen) guardados en localStorage.
- «Encuentra tu accesorio»: filtra con reglas y datos registrados (no usa inteligencia artificial) y avisa si la compatibilidad no está confirmada.
- «Tu celular, tu estilo»: fundas por color, estilo, modelo y precio, con vista previa.
- Panel del dueño (`admin.html`, contraseña de demostración `nexora2026`): agregar, editar, ocultar y eliminar productos.
- Paquetes de oferta, preguntas frecuentes y formulario con validación.

## 9. Estructura de archivos
```
NEXORA-ACCESS/
├── index.html
├── admin.html
├── css/styles.css
├── js/data.js
├── js/app.js
├── js/admin.js
├── assets/images/
├── assets/icons/
└── README.md
```

## 10. Instrucciones para ejecutar
Abre `index.html` en un navegador moderno. No requiere servidor ni instalación.

## 11. Pruebas realizadas
Se probó con un entorno simulado (jsdom): renderizado del catálogo, categorías, agregar productos y paquetes, cambio de cantidades, totales, resumen, filtros, vista previa de fundas y validación del formulario, sin errores de JavaScript. Pendiente: revisión manual en navegador real y en celular.

## 12. Limitaciones y mejoras futuras
- Las imágenes son ilustraciones SVG; coloca fotografías reales en `assets/images/` y úsalas en lugar de `art()` en `js/app.js`.
- Datos de compatibilidad, precios y existencias de demostración.
- El panel guarda los cambios solo en el navegador donde se usa y su contraseña no es segura; un negocio real necesita servidor y base de datos.
- No procesa pagos ni envía pedidos.
- Futuro: base de datos, inventario real, pasarela de pago y cuentas de usuario.

---

## Propuesta de presentación (7 diapositivas)
1. **Portada:** NEXORA ACCESS y su eslogan.
2. **Problema y oportunidad:** accesorios difíciles de comparar por tipo, precio y compatibilidad.
3. **Objetivos y público objetivo.**
4. **Diseño e identidad visual:** azul noche, cian eléctrico y catálogo claro.
5. **Funcionalidades principales:** filtros, «Encuentra tu accesorio», estilo de fundas y carrito.
6. **Demostración en vivo:** buscar un cable USB-C de hasta $6, agregarlo y ver el resumen.
7. **Conclusiones y evolución hacia un negocio real.**
