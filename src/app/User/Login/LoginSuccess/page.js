'use client'
import { useEffect } from "react"
import Navbar from "@/components/Navbar"

export default function () {
    async function fetchGoogleUserInfo(access_token) {
        try {
            // 直接前端去向 google API 取回使用者資訊
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`)
            .then((res) => res.json())
            console.log('response', response)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        const table = {}
        window.location.href.split('&').forEach((pair) => {
            const [key, value] = pair.split('=')
            table[key] = value
        })

        // 使用回傳參數 access_token，去向 google API 取回使用者資訊
        fetchGoogleUserInfo(table.access_token)
    }, [])
    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <h1>登入成功</h1>
        </div>
    </>
}