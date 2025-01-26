"use client";
import { useState, useEffect, useCallback, useRef } from "react"
import { LoadingPageShow, LoadingPageHide } from '@/components/LoadingPage';
import LogicticModal from "./LogicticModal";
import PaymentInfoPage from "@/components/PaymentInfoPage";
import MicroModal from "micromodal"
import alertify from "alertifyjs";

export default () => {
    const [cartTotalPrice, setCartTotalPrice] = useState(0)
    const [cartData, setCartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isOrderBuilt, setIsOrderBuilt] = useState(false)
    const [orderId, setOrderId] = useState("")
    useEffect(() => {
        if (typeof window !== undefined) {
            MicroModal.init()
            updateCartData()
            getCvsTypeOptions()
        }
    }, [])

    // 取得購物車資訊
    const updateCartData = useCallback(() => {
        LoadingPageShow()
        if (typeof window !== undefined) {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': localStorage.getItem("csrfToken")
                }
            })
                .then(res => res.json())
                .then(res => {
                    LoadingPageHide()
                    setIsLoading(false)
                    if (res.cart_items) {
                        setCartTotalPrice(res.total_price)
                        setCartData(res.cart_items)
                    }
                })
        }
    }, [])

    // 收件人資料
    const [receiverName, setReceiverName] = useState("")
    const [receiverPhone, setReceiverPhone] = useState("")

    // 取得物流方式選項
    const [cvsTypeOptions, setCvsTypeOptions] = useState([])
    const getCvsTypeOptions = useCallback(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/logistic/getCvsTypeOptions`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-Token': localStorage.getItem("csrfToken")
            }
        })
            .then(res => res.json())
            .then(res => {
                setCvsTypeOptions(res)
            })
    }, [])

    const [orderCvsType, setOrderCvsType] = useState("")
    const [selectedStore, setSelectedStore] = useState({
        StoreId: "",
        StoreName: "未選擇門市"
    })

    // 超商種類改變
    const handleCvsTypeOnChange = useCallback((targetCvsType) => {
        setOrderCvsType(targetCvsType)
        setSelectedStore({
            ...selectedStore,
            StoreId: "",
            StoreName: "未選擇門市"
        })
    }, [selectedStore])

    // 開啟選擇門市視窗、取得門市資料
    const logisticModalRef = useRef()
    const openLogisticModalAndGetData = useCallback(() => {
        logisticModalRef.current.resetModal()
        MicroModal.show("logistic-modal");
    }, [orderCvsType])

    //表單驗證
    const RequiredColvalidate = useCallback(() => {
        const validateColumn = [
            { columnState: selectedStore.StoreId, columnChName: "出貨門市" },
            { columnState: receiverName, columnChName: "收件人姓名" },
            { columnState: receiverPhone, columnChName: "收件人電話" },
        ]

        const inValidColumnList = validateColumn.reduce((accumulator, currentColumn) => {
            const currentValue = currentColumn.columnState
            if (currentValue === "" || currentValue === null || currentValue === undefined) {
                accumulator.push(currentColumn.columnChName)
            }
            return accumulator
        }, [])

        return inValidColumnList
    }, [selectedStore, receiverName, receiverPhone])

    const phoneNumRegexValidate = useCallback(() => {
        const phoneRegex = /^09\d{8}$/;
        return receiverPhone !== "" && receiverPhone !== null && receiverPhone !== undefined && !phoneRegex.test(receiverPhone) 
            ? "手機號碼格式不符" : "";
    }, [receiverPhone]);

    // 送出訂單
    const beforeCreateOrderValidation = useCallback(async () => {
        const rquiredInvalidColumnList = RequiredColvalidate();
        const phoneNumRegexInvalidString = phoneNumRegexValidate()

        if (rquiredInvalidColumnList.length > 0) {
            const inValidStringList = []

            if (rquiredInvalidColumnList.length > 0) {
                inValidStringList.push(`${rquiredInvalidColumnList.join("、")}為必填項目`)
            }
            if (phoneNumRegexInvalidString !== "") {
                inValidStringList.push(phoneNumRegexInvalidString)
            }

            const inValidString = inValidStringList.join("<br>");
            alertify.alert("", inValidString);
        } else {
            LoadingPageShow()
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/order`, {
                method: 'POST',
                credentials: 'include',
                body: JSON.stringify({
                    storeId: selectedStore.StoreId,
                    storeName: selectedStore.StoreName,
                    csvType: orderCvsType,
                    receiverName: receiverName,
                    receiverPhone: receiverPhone
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': localStorage.getItem("csrfToken")
                }
            })
                .then(res => res.json())
                .then(res => {
                    setIsOrderBuilt(true)
                    setOrderId(res.orderId)
                    LoadingPageHide()
                })
        }
    }, [orderCvsType, selectedStore, receiverName, receiverPhone])

    return <>
        {isOrderBuilt && <PaymentInfoPage isNewBuilt="true" orderId={orderId}></PaymentInfoPage>}
        <div className="main-content-area">
            <div className="custom-container">
                {
                    isLoading ? <p className="text-center mt-16 text-xl">資料載入中</p> : <>
                        {
                            (Array.isArray(cartData) && cartData.length > 0) ? <>
                                <div className="section-title my-8">訂單內容確認</div>
                                <>
                                    <div className="shopping-content-list">
                                        {
                                            Array.isArray(cartData) && cartData.map(cartItem => (
                                                <div className={`shopping-content-item ${!(cartItem.is_active === 1) && "not-active"}`}
                                                    key={cartItem.cart_item_id}>
                                                    <div className="shopping-content-item-image" style={{ backgroundImage: (cartItem.product_img === "" || cartItem.product_img === null || cartItem.product_img === undefined) ? `url('/no-image.png')` : `url('${process.env.NEXT_PUBLIC_FILE_URL}/${cartItem.product_img}')` }}></div>
                                                    <div className="w-full flex items-top justify-start">
                                                        <div className="shopping-content-item-info">
                                                            <p className="font-bold text-xl mb-1">{cartItem.product_name}</p>
                                                            <p><span className="title-md">規格</span>{cartItem.model_name}</p>
                                                            <p><span className="title-md">數量</span>{cartItem.quantity}</p>
                                                            <p><span className="title-md">單價</span>NT$ {cartItem.model_price}</p>
                                                            <p><span className="title-md">小計</span>NT$ {cartItem.item_price}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                        <div className="flex justify-end pt-2">
                                            <span className="me-2 font-bold text-xl">總計</span>
                                            <span className="me-2 font-bold text-xl">NT$ {cartTotalPrice}</span>
                                        </div>
                                    </div>
                                </>
                                <div className="section-title my-8">出貨資料</div>
                                <div className="flex flex-col w-full md:w-3/4">
                                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                                        <span className="title-md mb-4 md:my-0">超商種類</span>
                                        <select className="w-full primary-input" value={orderCvsType}
                                            onChange={(e) => { handleCvsTypeOnChange(e.target.value) }}>
                                            <option value="" disabled>請選擇出貨超商種類</option>
                                            {
                                                Array.isArray(cvsTypeOptions) && cvsTypeOptions.map(cvsTypeOption => (
                                                    <option value={cvsTypeOption.CvsTypeCode} key={cvsTypeOption.CvsTypeCode}>
                                                        {cvsTypeOption.CvsTypeName}
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                                        {
                                            (orderCvsType !== undefined && orderCvsType !== null && orderCvsType !== "") && (
                                                <>
                                                    <span className="title-md mb-4 md:my-0">出貨門市</span>
                                                    <div className="w-full flex">
                                                        <div className="w-full primary-input mr-4">{selectedStore.StoreName}</div>
                                                        <button type="button" className="whitespace-nowrap button-md button-dark"
                                                            onClick={() => { openLogisticModalAndGetData() }}>選擇門市</button>
                                                    </div>
                                                </>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="section-title my-8">收件人資料</div>
                                <div className="flex flex-col w-full md:w-3/4">
                                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                                        <span className="title-md mb-4 md:my-0">收件人姓名</span>
                                        <input type="text" className="w-full primary-input"
                                               value={receiverName} onChange={(e) => { setReceiverName(e.target.value) }}></input>
                                    </div>
                                    <div className="flex flex-col md:flex-row md:items-center mb-8">
                                        <span className="title-md mb-4 md:my-0">收件人電話</span>
                                        <input type="text" className="w-full primary-input"
                                               value={receiverPhone} onChange={(e) => { setReceiverPhone(e.target.value) }}></input>
                                    </div>
                                </div>
                                <div className="w-full flex justify-center items-center my-8">
                                    <button type="button" className="button-md button-dark" onClick={() => {
                                        beforeCreateOrderValidation()
                                    }}>送出訂單</button>
                                </div>
                            </> : <p className="text-center mt-16 text-xl">購物車目前尚無內容</p>
                        }
                    </>
                }
            </div>

            <LogicticModal ref={logisticModalRef}
                orderCvsType={orderCvsType}
                selectedStore={selectedStore}
                setSelectedStore={setSelectedStore}
                MicroModal={MicroModal}></LogicticModal>
        </div>
    </>
}