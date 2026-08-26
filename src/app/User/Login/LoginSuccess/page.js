'use client'
import { useEffect, useState } from "react"
import alertify from "alertifyjs"
import { apiFetch } from "@/api/client"

export default function () {
    const [resultText, setResultText] = useState("登入成功")

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const idToken = hashParams.get('id_token')

        if (!idToken) {
            setTimeout(() => {
                window.location = `${window.location.origin}/`
            }, 1500)
            return
        }

        const backToLogin = (message) => {
            setResultText("登入失敗")
            alertify.alert("", message, () => {
                window.location = `${window.location.origin}/User/Login`
            })
        }

        apiFetch('/users/googleLogin', { method: 'POST', body: { credential: idToken } })
            .then(result => {
                localStorage.setItem("csrfToken", result.csrfToken)
                window.location = `${window.location.origin}/`
            })
            .catch(error => {
                backToLogin(error.message ? error.message : "google 登入失敗")
            })
    }, [])

    return <>
        <div className="primary-color-background flex flex-col justify-center items-center">
            <img className="primary-color-background-img me-2" src="/logo1.png"></img>
            <p className="text-3xl font-bold mt-8">{resultText}</p>
        </div>
    </>
}
