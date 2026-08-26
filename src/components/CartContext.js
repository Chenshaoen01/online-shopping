"use client"
import { createContext, useCallback, useContext, useState } from "react"

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
    const [cartData, setCartData] = useState({})

    const refreshCart = useCallback(async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (!res.ok) {
                setCartData({})
                return res.status
            }

            setCartData(await res.json())
            return res.status
        } catch (error) {
            return 0
        }
    }, [])

    return <CartContext.Provider value={{ cartData, refreshCart }}>
        {children}
    </CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
