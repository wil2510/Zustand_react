    import { create } from 'zustand'
    import { persist } from 'zustand/middleware'

    export const useCarritoStore = create(
    persist(
        (set) => ({
        items: [],
        tasaCambio: null,
        establecerTasaCambio: (tasaCambio) => set({ tasaCambio }),
        agregarProducto: (producto) =>
            set((state) => {
            const existe = state.items.some((item) => item.id === producto.id)

            return {
                items: existe
                ? state.items.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                    )
                : [...state.items, { ...producto, cantidad: 1 }],
            }
            }),
        disminuirCantidad: (id) =>
            set((state) => ({
            items: state.items
                .map((item) =>
                item.id === id ? { ...item, cantidad: item.cantidad - 1 } : item
                )
                .filter((item) => item.cantidad > 0),
            })),
        eliminarProducto: (id) =>
            set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            })),
        vaciarCarrito: () => set({ items: [] }),
        }),
        {
        name: 'tienda-carrito',
        partialize: (state) => ({ items: state.items }),
        }
    )
)// final del store de carrito