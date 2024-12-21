"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import alertify from 'alertifyjs';
import { LoadingPage, LoadingPageShow, LoadingPageHide } from '@/components/LoadingPage';

export default function Login({ pageType }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");
    const [isRemember, setIsRemember] = useState(false);

    useEffect(() => {
        const isRemember = localStorage.getItem("isPetShoppingRemember")
        const userEmail = localStorage.getItem("petShoppingUserEmail")

        if (isRemember === "true" && pageType === "Login") {
            setIsRemember(true)
            setEmail(userEmail)
        }
    }, [])

    // 表單驗證
    const RequiredColvalidate = () => {
        const validateColumn = pageType === "Register" ? [
            { columnState: name, columnChName: "使用者名稱" },
            { columnState: email, columnChName: "電子信箱" },
            { columnState: tel, columnChName: "連絡電話" },
            { columnState: password, columnChName: "密碼" }
        ] : [
            { columnState: email, columnChName: "電子信箱" },
            { columnState: password, columnChName: "密碼" }
        ]

        const inValidColumnList = validateColumn.reduce((accumulator, currentColumn) => {
            const currentValue = currentColumn.columnState
            if (currentValue === "" || currentValue === null || currentValue === undefined) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator
        }, [])

        return inValidColumnList
    }

    const emailRegexValidate = () => {
        const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email !== "" && email !== null && email !== undefined && !emailregex.test(email) ? "電子信箱格式不符" : ""
    }

    // 註冊
    const handleRegister = async () => {
        const rquiredInvalidColumnList = RequiredColvalidate();
        const emailRegexInvalidString = emailRegexValidate()
        if (rquiredInvalidColumnList.length > 0 || emailRegexInvalidString !== "") {
            const inValidStringList = []
            if (rquiredInvalidColumnList.length > 0) {
                inValidStringList.push(`${rquiredInvalidColumnList.join("、")}為必填項目`)
            }
            if (emailRegexInvalidString !== "") {
                inValidStringList.push(emailRegexInvalidString)
            }
            const inValidString = inValidStringList.join("，");
            alertify.alert("", inValidString);
        } else {
            try {
                LoadingPageShow()
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_name: name, user_email: email, user_tel: tel, user_password: password }),
                    credentials: 'include', // 讓 Cookie 隨請求發送
                });
                LoadingPageHide()

                if (!response.ok) {
                    const errorData = await response.json();
                    alertify.alert("", errorData.message);
                    return;
                }

                alertify.alert("", "註冊成功").set('closable', true);
                setTimeout(() => {
                    router.push("/User/Login");
                }, 2000)
            } catch (error) {
                LoadingPageHide()
            }
        }
    };

    // 登入
    const handleLogin = async () => {
        const inValidColumnList = RequiredColvalidate();
        if (inValidColumnList.length > 0) {
            const inValidString = inValidColumnList.join("、");
            alertify.alert("", `${inValidString}為必填項目`);
        } else {
            try {
                LoadingPageShow()
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_email: email, user_password: password }),
                    credentials: 'include', // 讓 Cookie 隨請求發送
                });
                LoadingPageHide()

                if (!response.ok) {
                    const errorData = await response.json();
                    alertify.alert("", errorData.message);
                    return;
                }

                handleLocalStorageData()
                setTimeout(() => {
                    router.push("/User/Login/LoginSuccess");
                }, 2000)
            } catch (error) {
                LoadingPageHide()
                console.error(error);
            }
        }
    };

    // 登入後儲存/移除 LocalStorage 的使用者登入資料
    function handleLocalStorageData() {
        if (isRemember) {
            localStorage.setItem("isPetShoppingRemember", true)
            localStorage.setItem("petShoppingUserEmail", email)
        } else {
            localStorage.setItem("isPetShoppingRemember", false)
            localStorage.setItem("petShoppingUserEmail", "")
        }
    }

    // google 登入
    function googleLogIn() {
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        var form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        var params = {
            'client_id': '1071950848439-q4vqij748t7qlrvu4uaeunr4pis5mm48.apps.googleusercontent.com',
            'redirect_uri': `${window.location.origin}/User/Login/LoginSuccess`,
            'response_type': 'token',
            'scope': 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
            'include_granted_scopes': 'true',
            'state': 'pass-through value',
        };

        for (var p in params) {
            var input = document.createElement('input');
            input.setAttribute('type', 'hidden');
            input.setAttribute('name', p);
            input.setAttribute('value', params[p]);
            form.appendChild(input);
        }

        document.body.appendChild(form);
        form.submit();
    }

    return (
        <>
            <LoadingPage></LoadingPage>
            <div className="userpage-main-content-area">
                <div className="grid grid-cols-12">
                    <div className="col-span-7 hidden md:flex">
                        <div className="userpage-form-background-area"></div>
                    </div>
                    <div className="col-span-12 md:col-span-5">
                        <div className="userpage-form-area-container">
                            <div className="userpage-form-area">
                                <img className="userpage-logo me-2 mb-4" src="/logo1.png" alt="Logo"></img>
                                <div className="userpage-form-title-area mb-4">
                                    <p className="text-center font-bold text-3xl mb-2">毛孩物坊</p>
                                    <p className="text-center font-bold text-xl">
                                        {pageType === "Login" ? "會員登入" : "會員註冊"}
                                    </p>
                                </div>
                                {pageType === "Register" && (
                                    <label className="w-full flex flex-col mb-2">
                                        <span className="me-4 mb-2">使用者名稱</span>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="userpage-form-input"
                                        />
                                    </label>
                                )}
                                <label className="w-full flex flex-col mb-2">
                                    <span className="me-4 mb-2">電子信箱</span>
                                    <input
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="userpage-form-input"
                                    />
                                </label>
                                {pageType === "Register" && (
                                    <label className="w-full flex flex-col mb-2">
                                        <span className="me-4 mb-2">連絡電話</span>
                                        <input
                                            type="text"
                                            value={tel}
                                            onChange={(e) => setTel(e.target.value)}
                                            className="userpage-form-input"
                                        />
                                    </label>
                                )}
                                <label className="w-full flex flex-col mb-4">
                                    <span className="me-4 mb-2">密碼</span>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="userpage-form-input"
                                    />
                                </label>
                                {
                                    pageType === "Login" && <>
                                        <label className="w-full flex mb-4">
                                            <input type="checkbox" checked={isRemember} onChange={(e) => setIsRemember(e.target.checked)} className="me-2"
                                            />
                                            <span>記住電子信箱</span>
                                        </label>
                                    </>
                                }
                                {pageType === "Login" && (
                                    <>
                                        <button type="button" onClick={handleLogin} className="userpage-form-button mb-2">
                                            登入
                                        </button>
                                        <button type="button" onClick={googleLogIn} className="userpage-form-button">
                                            google 登入
                                        </button>
                                    </>
                                )}
                                {pageType === "Register" && (
                                    <button type="button" onClick={handleRegister} className="userpage-form-button mb-2">
                                        註冊
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
