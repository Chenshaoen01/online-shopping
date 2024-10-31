"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Login({ pageType }) {
    const router = useRouter()
    const [error, setError] = useState(null);
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleRegister = async () => {
        console.log('註冊')
    }

    const handleLogin = async () => {
        const user_email = emailRef.current.value;
        const user_password = passwordRef.current.value;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_email, user_password }),
                credentials: 'include' // 讓 Cookie 隨請求發送
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || '登入失敗');
                return;
            }

            const data = await response.json();
            document.cookie = `csrfToken=${data.csrfToken}; path=/`; // 存儲 CSRF token
            setError(null); // 清除錯誤訊息
            console.log('登入成功');
            router.push("/")
        } catch (error) {
            console.log(error)
            setError('發生錯誤，請稍後再試');
        }
    };

    function googleLogIn() {
        // Google's OAuth 2.0 endpoint for requesting an access token
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

        // Create <form> element to submit parameters to OAuth 2.0 endpoint.
        var form = document.createElement('form');
        form.setAttribute('method', 'GET'); // Send as a GET request.
        form.setAttribute('action', oauth2Endpoint);

        // Parameters to pass to OAuth 2.0 endpoint.
        var params = {
            'client_id': '1071950848439-q4vqij748t7qlrvu4uaeunr4pis5mm48.apps.googleusercontent.com',
            'redirect_uri': 'http://localhost:3010/User/Login/LoginSuccess',
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/userinfo.email',
            'include_granted_scopes': 'true',
            'state': 'pass-through value'
        };

        // Add form parameters as hidden input values.
        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        // Add form to page and submit it to open the OAuth 2.0 endpoint.
        document.body.appendChild(form);
        form.submit();
    }

    return (
        <>
            <div className="userpage-main-content-area">
                <div className="grid grid-cols-12">
                    <div className="col-span-7 hidden md:flex">
                        <div className="userpage-form-background-area"></div>
                    </div>
                    <div className="col-span-12 md:col-span-5">
                        <div className="userpage-form-area-container">
                            <div className="userpage-form-area">
                                <img className="userpage-logo me-2 mb-4" src="/logo1.png"></img>
                                <div className="userpage-form-title-area mb-4">
                                    <p className="text-center font-bold text-3xl mb-2">毛孩物坊</p>
                                    <p className="text-center font-bold text-xl">
                                        {pageType === "Login" ? "會員登入" : "會員註冊"}
                                    </p>
                                </div>
                                <label className="w-full flex flex-col mb-2">
                                    <span className="me-4 mb-2">帳號</span>
                                    <input ref={emailRef} type="text" className="userpage-form-input" />
                                </label>
                                <label className="w-full flex flex-col mb-4">
                                    <span className="me-4 mb-2">密碼</span>
                                    <input ref={passwordRef} type="password" className="userpage-form-input" />
                                </label>
                                {error && <p className="text-red-500 mt-4">{error}</p>}
                                {pageType === "Login" ? <>
                                    <button type="button" onClick={handleLogin} className="userpage-form-button mb-2">登入</button>
                                    <button type="button" onClick={googleLogIn} className="userpage-form-button">google 登入</button></> : ""}
                                {pageType === "Register" ?
                                    <button type="button" onClick={handleRegister} className="userpage-form-button mb-2">註冊</button> : ""}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}