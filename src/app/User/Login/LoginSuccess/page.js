'use client'
import { useEffect } from "react"
export default function () {
    useEffect(() => {
        const hasAccessToken = window.location.href.includes('access_token')
        if(hasAccessToken) {
            const table = {}
            window.location.href.split('&').forEach((pair) => {
                const [key, value] = pair.split('=')
                table[key] = value
            })

            fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/googleLogin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ access_token: table.access_token }),
            })
            .then(res => res.json())
            .then(res => {
                localStorage.setItem("csrfToken", res.csrfToken)
                window.location = `${window.location.origin}/`
            })
        } else {
            setTimeout(() => {
                window.location = `${window.location.origin}/`
            }, 1500)
        }
    }, [])
    return <>
        <div className="primary-color-background flex flex-col justify-center items-center">
            <img className="primary-color-background-img me-2" src="/logo1.png"></img>
            <p className="text-3xl font-bold mt-8">登入成功</p>
        </div>
    </>
}