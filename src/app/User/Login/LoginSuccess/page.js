'use client'
import { useEffect, useState } from "react"
import alertify from "alertifyjs"

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

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/googleLogin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ credential: idToken }),
        })
            .then(async res => {
                const result = await res.json().catch(() => ({}))

                if (!res.ok) {
                    backToLogin(result.message ? result.message : "google 登入失敗")
                    return
                }

                localStorage.setItem("csrfToken", result.csrfToken)
                window.location = `${window.location.origin}/`
            })
            .catch(() => {
                backToLogin("google 登入失敗")
            })
    }, [])

    return <>
        <div className="primary-color-background flex flex-col justify-center items-center">
            <img className="primary-color-background-img me-2" src="/logo1.png"></img>
            <p className="text-3xl font-bold mt-8">{resultText}</p>
        </div>
    </>
}
