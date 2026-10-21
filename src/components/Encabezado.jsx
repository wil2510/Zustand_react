// Importamos el hook del store para leer el carrito
import { useCarritoStore } from '../store/useCarritoStore'

function Encabezado() {
  const items = useCarritoStore((state) => state.items)
  const totalUnidades = items.reduce((suma, item) => suma + item.cantidad, 0)
  const etiquetaCantidad =
    totalUnidades === 1 ? '1 artículo' : `${totalUnidades} artículos`

  return (
    <header className="encabezado">
      <a className="marca" href="/" aria-label="Urban Express, inicio">
        <span className="marca-icono" aria-hidden="true">U</span>
        <span>URBAN EXPRESS</span>
      </a>
      <span className="encabezado-mensaje">Lo esencial, bien elegido.</span>
      <a className="carrito-link" href="#carrito" aria-label={`Carrito, ${etiquetaCantidad}`}>
        <span aria-hidden="true">Bolsa</span>
        <span className="insignia">{totalUnidades}</span>
      </a>
    </header>
  )
}

export default Encabezado