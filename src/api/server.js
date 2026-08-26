import { cookies } from "next/headers"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export const serverFetch = (path, options = {}) => fetch(`${API_URL}${path}`, options)

export const serverFetchWithCookie = (path, options = {}) => fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
        ...options.headers,
        'Cookie': cookies().toString()
    }
})

export const checkLogin = async () => {
    const res = await serverFetchWithCookie('/users/checkLogin')
    return res.status === 200
}
