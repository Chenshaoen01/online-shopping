"use client"
import { createContext, useCallback, useContext, useState } from "react"

const LoadingContext = createContext(null)

export const LoadingProvider = ({ children }) => {
    const [loadingCount, setLoadingCount] = useState(0)

    const showLoading = useCallback(() => setLoadingCount(count => count + 1), [])
    const hideLoading = useCallback(() => setLoadingCount(count => Math.max(0, count - 1)), [])

    return <LoadingContext.Provider value={{ showLoading, hideLoading }}>
        {children}
        {
            loadingCount > 0 && <div className="loading-page">
                <div className="loader"></div>
            </div>
        }
    </LoadingContext.Provider>
}

export const useLoading = () => useContext(LoadingContext)
