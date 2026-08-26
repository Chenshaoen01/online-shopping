"use client"
import { createContext, useCallback, useContext, useState } from "react"
import { apiFetch } from "@/api/client"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState({})

    const refreshCart = useCallback(async () => {
        try {
            setCartData(await apiFetch('/cart/', { method: 'POST' }))
            return 200
        } catch (error) {
            setCartData({})
            return error.status
        }
    }, [])

    return <CartContext.Provider value={{ cartData, refreshCart }}>
        {children}
    </CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
