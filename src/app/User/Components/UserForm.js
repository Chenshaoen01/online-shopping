"use client";
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import alertify from 'alertifyjs';
import { useLoading } from '@/components/LoadingProvider';
import { apiFetch } from '@/api/client';

export default function UserForm({ pageType }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [tel, setTel] = useState("");
    const [password, setPassword] = useState("");
    const [isRemember, setIsRemember] = useState(false);
    const { showLoading, hideLoading } = useLoading();

    useEffect(() => {
        const isRemember = localStorage.getItem("isPetShoppingRemember")
        const userEmail = localStorage.getItem("petShoppingUserEmail")

        if (isRemember === "true" && pageType === "Login") {
            setIsRemember(true)
            setEmail(userEmail)
        }
    }, [pageType])

    // 表單驗證
    const validateRequiredColumns = useCallback(() => {
        const validateColumn = pageType === "Register" ? [
            { columnState: name, columnChName: "使用者名稱" },
            { columnState: email, columnChName: "電子信箱" },
            { columnState: tel, columnChName: "手機號碼" },
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
    }, [pageType, name, email, tel, password])

    const emailRegexValidate = useCallback(() => {
        const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return email !== "" && email !== null && email !== undefined && !emailregex.test(email) ? "電子信箱格式不符" : ""
    }, [email])

    const phoneNumRegexValidate = useCallback(() => {
        const phoneRegex = /^09\d{8}$/;
        return tel !== "" && tel !== null && tel !== undefined && !phoneRegex.test(tel) 
            ? "手機號碼格式不符" : "";
    }, [tel]);

    const passwordLengthValidate = useCallback(() => {
        return password !== "" && password !== null && password !== undefined && password.length < 8
            ? "密碼至少 8 碼" : "";
    }, [password]);

    // 註冊
    const handleRegister = useCallback(async () => {
        const requiredInvalidColumnList = validateRequiredColumns();
        const emailRegexInvalidString = emailRegexValidate()
        const phoneNumRegexInvalidString = phoneNumRegexValidate()
        const passwordLengthInvalidString = passwordLengthValidate()

        if (requiredInvalidColumnList.length > 0 || emailRegexInvalidString !== "" || phoneNumRegexInvalidString !== "" || passwordLengthInvalidString !== "") {
            const inValidStringList = []
            if (requiredInvalidColumnList.length > 0) {
                inValidStringList.push(`${requiredInvalidColumnList.join("、")}為必填項目`)
            }
            if (emailRegexInvalidString !== "") {
                inValidStringList.push(emailRegexInvalidString)
            }
            if (phoneNumRegexInvalidString !== "") {
                inValidStringList.push(phoneNumRegexInvalidString)
            }
            if (passwordLengthInvalidString !== "") {
                inValidStringList.push(passwordLengthInvalidString)
            }
            const inValidString = inValidStringList.join("<br>");
            alertify.alert("", inValidString);
        } else {
            try {
                showLoading()
                await apiFetch('/users/register', {
                    method: 'POST',
                    body: { user_name: name, user_email: email, user_tel: tel, user_password: password }
                });

                alertify.alert("", "註冊成功").set('closable', true);
                setTimeout(() => {
                    router.push("/User/Login");
                }, 2000)
            } catch (error) {
                alertify.alert("", error.message ? error.message : "註冊失敗");
            } finally {
                hideLoading()
            }
        }
    }, [name, email, tel, password, showLoading, hideLoading, router, validateRequiredColumns, emailRegexValidate, phoneNumRegexValidate, passwordLengthValidate])

    // 登入後儲存/移除 LocalStorage 的使用者登入資料
    const handleLocalStorageData = useCallback(() => {
        if (isRemember) {
            localStorage.setItem("isPetShoppingRemember", true)
            localStorage.setItem("petShoppingUserEmail", email)
        } else {
            localStorage.setItem("isPetShoppingRemember", false)
            localStorage.setItem("petShoppingUserEmail", "")
        }
    }, [isRemember, email])

    // 登入
    const handleLogin = useCallback(async () => {
        const inValidColumnList = validateRequiredColumns();
        if (inValidColumnList.length > 0) {
            const inValidString = inValidColumnList.join("、");
            alertify.alert("", `${inValidString}為必填項目`);
        } else {
            try {
                showLoading()
                const successData = await apiFetch('/users/login', {
                    method: 'POST',
                    body: { user_email: email, user_password: password }
                })

                localStorage.setItem("csrfToken", successData.csrfToken)
                handleLocalStorageData()
                setTimeout(() => {
                    router.push("/User/Login/LoginSuccess");
                }, 2000)
            } catch (error) {
                alertify.alert("", error.message ? error.message : "登入失敗");
            } finally {
                hideLoading()
            }
        }
    }, [email, password, showLoading, hideLoading, router, validateRequiredColumns, handleLocalStorageData])

    // google 登入
    const googleLogIn = useCallback(() => {
        var oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
        var form = document.createElement('form');
        form.setAttribute('method', 'GET');
        form.setAttribute('action', oauth2Endpoint);

        var params = {
            'client_id': '1071950848439-q4vqij748t7qlrvu4uaeunr4pis5mm48.apps.googleusercontent.com',
            'redirect_uri': `${window.location.origin}/User/Login/LoginSuccess`,
            'response_type': 'id_token',
            'scope': 'openid email profile',
            'nonce': crypto.randomUUID(),
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
    }, [])

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
                                <Image className="userpage-logo me-2 mb-4" src="/logo1.png" width={501} height={500} alt=""></Image>
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
                                        <span className="me-4 mb-2">手機號碼</span>
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
