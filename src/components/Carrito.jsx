import { useCarritoStore } from '../store/useCarritoStore'

    const formatearPrecio = (precio) =>
    new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        currencyDisplay: 'code',
        maximumFractionDigits: 0,
    }).format(precio)

    function Carrito() {
    const items = useCarritoStore((state) => state.items)
    const tasaCambio = useCarritoStore((state) => state.tasaCambio)
    const eliminarProducto = useCarritoStore((state) => state.eliminarProducto)
    const disminuirCantidad = useCarritoStore((state) => state.disminuirCantidad)
    const agregarProducto = useCarritoStore((state) => state.agregarProducto)
    const vaciarCarrito = useCarritoStore((state) => state.vaciarCarrito)

    const total = items.reduce(
        (suma, item) => suma + item.precio * item.cantidad,
        0
    )
    const formatearPrecioCOP = (precio) =>
        tasaCambio === null ? 'Cargando tasa...' : formatearPrecio(precio * tasaCambio)
    const totalUnidades = items.reduce(
        (cantidad, item) => cantidad + item.cantidad,
        0
    )

    if (items.length === 0) {
        return (
        <section className="panel panel-carrito" id="carrito">
            <div className="panel-encabezado">
            <div>
                <p className="sobretitulo">TU SELECCIÓN</p>
                <h2>Tu carrito</h2>
            </div>
            <span className="etiqueta">0 artículos</span>
            </div>
            <div className="vacio">
            <span className="vacio-icono" aria-hidden="true">＋</span>
            <p>Tu carrito está esperando algo especial.</p>
            <span>Agrega un producto para empezar.</span>
            </div>
        </section>
        )
    }

    return (
        <section className="panel panel-carrito" id="carrito">
        <div className="panel-encabezado">
            <div>
            <p className="sobretitulo">TU SELECCIÓN</p>
            <h2>Tu carrito</h2>
            </div>
            <span className="etiqueta">
            {totalUnidades} {totalUnidades === 1 ? 'artículo' : 'artículos'}
            </span>
        </div>

        <div className="carrito-items">
            {items.map((item) => (
            <article key={item.id} className="carrito-item">
                <div className="carrito-item-info">
                <p className="fila-nombre">{item.nombre}</p>
                <p className="fila-detalle">{formatearPrecioCOP(item.precio)} c/u</p>
                <strong className="subtotal-item">
                    Subtotal: {formatearPrecioCOP(item.precio * item.cantidad)}
                </strong>
                </div>
                <div className="carrito-item-acciones">
                <div className="cantidad-control" aria-label={`Cantidad de ${item.nombre}`}>
                    <button
                    className="cantidad-btn"
                    onClick={() => disminuirCantidad(item.id)}
                    aria-label={`Disminuir cantidad de ${item.nombre}`}
                    >
                    −
                    </button>
                    <span>{item.cantidad}</span>
                    <button
                    className="cantidad-btn"
                    onClick={() => agregarProducto(item)}
                    aria-label={`Aumentar cantidad de ${item.nombre}`}
                    >
                    +
                    </button>
                </div>
                <button
                    className="btn-quitar"
                    onClick={() => eliminarProducto(item.id)}
                    aria-label={`Quitar ${item.nombre} del carrito`}
                >
                    Quitar
                </button>
                </div>
            </article>
            ))}
        </div>

        <div className="resumen">
            <div className="total">
            <span>Total</span>
            <strong>{formatearPrecioCOP(total)}</strong>
            </div>
            <p>Envío e impuestos calculados al finalizar la compra.</p>
            <button className="btn btn-primario btn-bloque" onClick={vaciarCarrito}>
            Vaciar carrito
            </button>
        </div>
        </section>
    )
    }

export default Carrito