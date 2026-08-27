'use client'
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { apiFetch } from "@/api/client"

export default function LoginSuccessPage() {
    const [resultText, setResultText] = useState("登入成功")
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const idToken = hashParams.get('id_token')

        if (!idToken) {
            setTimeout(() => {
                window.location = `${window.location.origin}/`
            }, 1500)
            return
        }

        apiFetch('/users/googleLogin', { method: 'POST', body: { credential: idToken } })
            .then(result => {
                localStorage.setItem("csrfToken", result.csrfToken)
                window.location = `${window.location.origin}/`
            })
            .catch(error => {
                setResultText("登入失敗")
                setErrorMessage(error.message ? error.message : "google 登入失敗")
            })
    }, [])

    return <>
        <div className="primary-color-background flex flex-col justify-center items-center">
            <Image className="primary-color-background-img me-2" src="/logo1.png" width={501} height={500} alt="毛孩物坊"></Image>
            <p className="text-3xl font-bold mt-8">{resultText}</p>
            {
                errorMessage !== "" && <>
                    <p className="mt-4">{errorMessage}</p>
                    <Link className="button-md button-dark mt-8" href="/User/Login">回到登入頁</Link>
                </>
            }
        </div>
    </>
}
