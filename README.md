1.¿Por qué Encabezado se actualiza cuando agregas un producto, si no recibe ninguna prop?
Porque Encabezado se suscribe directamente al store con useCarritoStore((state) => state.items). Cuando la acción agregarProducto actualiza items, Zustand notifica a los componentes suscritos y React vuelve a renderizar el encabezado. No necesita recibir el carrito por props.

2.¿Qué tendrías que hacer para lograr lo mismo usando solo useState en App?
Mantener items en un useState de App, crear allí las funciones para agregar, disminuir y eliminar productos y pasar el estado y las funciones como props a Encabezado, ListaProductos y Carrito. Así se propagan los datos por el árbol; si hay muchos componentes intermedios, aumenta el prop drilling.

3.¿Para qué sirve el selector (state) => state.items al usar el hook?
Selecciona del store únicamente items, que es el dato que necesita el componente. De esta forma la suscripción queda enfocada en esa parte del estado: el componente se actualiza cuando cambia la referencia de items, no por cambios en otras propiedades que no utiliza.

4.¿Por qué en el store se crean arreglos nuevos con map y filter en lugar de modificar items directamente?
React y Zustand detectan cambios de forma fiable cuando cambia la referencia del estado. map, filter y el operador spread generan nuevos arreglos y objetos sin mutar los anteriores; modificar el arreglo existente puede impedir que se detecten cambios y además dificulta razonar sobre el estado.

5.¿Zustand es parte de React? Explica la diferencia entre una librería propia de React y una del ecosistema.
No. React proporciona sus propias APIs, como useState y useContext. Zustand es una librería independiente del ecosistema de React: se instala aparte y se integra con React para compartir estado, pero no forma parte del paquete oficial de React.