import { useEffect, useState } from 'react'
import { useCarritoStore } from '../store/useCarritoStore'

const formatearPrecio = (precio) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    currencyDisplay: 'code',
    maximumFractionDigits: 0,
  }).format(precio)

function ListaProductos() {
  const agregarProducto = useCarritoStore((state) => state.agregarProducto)
  const establecerTasaCambio = useCarritoStore((state) => state.establecerTasaCambio)
  const tasaCambio = useCarritoStore((state) => state.tasaCambio)
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function cargarProductos() {
      try {
        const [respuesta, respuestaCambio] = await Promise.all([
          fetch('https://fakestoreapi.com/products', {
            signal: controller.signal,
          }),
          fetch('https://open.er-api.com/v6/latest/USD', {
            signal: controller.signal,
          }),
        ])

        if (!respuesta.ok) {
          throw new Error(`La API de productos respondió con el estado ${respuesta.status}.`)
        }

        if (!respuestaCambio.ok) {
          throw new Error(`No se pudo consultar la tasa de cambio (${respuestaCambio.status}).`)
        }

        const [datos, datosCambio] = await Promise.all([
          respuesta.json(),
          respuestaCambio.json(),
        ])

        if (!Array.isArray(datos)) {
          throw new Error('La respuesta de la API no tiene el formato esperado.')
        }

        const tasaCambio = datosCambio.result === 'success' ? datosCambio.rates?.COP : null

        if (!Number.isFinite(tasaCambio) || tasaCambio <= 0) {
          throw new Error('La respuesta de la tasa de cambio no tiene el formato esperado.')
        }

        establecerTasaCambio(tasaCambio)
        setProductos(
          datos.map((producto) => ({
            id: producto.id,
            nombre: producto.title,
            precio: producto.price,
            imagen: producto.image,
            categoria: producto.category,
          }))
        )
        setError('')
      } catch (errorConsulta) {
        if (errorConsulta.name !== 'AbortError') {
          setError(errorConsulta.message || 'No fue posible cargar los productos.')
          console.error('Error al cargar los productos:', errorConsulta)
        }
      } finally {
        if (!controller.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarProductos()

    return () => controller.abort()
  }, [intento, establecerTasaCambio])

  const reintentarCarga = () => {
    setCargando(true)
    setError('')
    setIntento((actual) => actual + 1)
  }

  return (
    <section className="panel">
      <div className="panel-encabezado">
        <div>
          <p className="sobretitulo">CATÁLOGO</p>
          <h2>Productos destacados</h2>
        </div>
        <span className="etiqueta">Precios en COP</span>
      </div>

      {cargando && <p className="estado">Cargando productos...</p>}

      {!cargando && error && (
        <div className="mensaje-error" role="alert">
          <p>No se pudo cargar el catálogo: {error}</p>
          <button className="btn btn-secundario" onClick={reintentarCarga}>
            Intentar de nuevo
          </button>
        </div>
      )}

      {!cargando && !error && productos.length === 0 && (
        <p className="estado">La tienda no tiene productos disponibles.</p>
      )}

      {!cargando && !error && productos.length > 0 && (
        <div className="productos-grid">
          {productos.map((producto) => (
            <article key={producto.id} className="producto">
              <div className="producto-imagen">
                <img src={producto.imagen} alt={producto.nombre} loading="lazy" />
              </div>
              <div className="producto-info">
                <p className="producto-categoria">{producto.categoria}</p>
                <h3>{producto.nombre}</h3>
                <div className="producto-pie">
                  <strong>{formatearPrecio(producto.precio * tasaCambio)}</strong>
                  <button
                    className="btn btn-primario"
                    onClick={() => agregarProducto(producto)}
                    aria-label={`Agregar ${producto.nombre} al carrito`}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default ListaProductos