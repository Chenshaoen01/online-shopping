"use client";
import { useState, useEffect, useCallback, useRef } from "react"
import { useLoading } from '@/components/LoadingProvider';
import LogicticModal from "./LogicticModal";
import PaymentInfoPage from "@/components/PaymentInfoPage";
import MicroModal from "micromodal"
import alertify from "alertifyjs";
import { apiFetch } from "@/api/client";
import { backgroundImage } from "@/api/files";

export default () => {
    const [cartTotalPrice, setCartTotalPrice] = useState(0)
    const [cartData, setCartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [isOrderBuilt, setIsOrderBuilt] = useState(false)
    const [orderId, setOrderId] = useState("")
    const [loadError, setLoadError] = useState("")
    const { showLoading, hideLoading } = useLoading()
    useEffect(() => {
        MicroModal.init()
        updateCartData()
        getCvsTypeOptions()
    }, [])

    // 取得購物車資訊
    const updateCartData = useCallback(async () => {
        showLoading()
        setLoadError("")
        try {
            const result = await apiFetch('/cart/', { method: 'POST' })
            if (result.cart_items) {
                setCartTotalPrice(result.total_price)
                setCartData(result.cart_items)
            }
        } catch (error) {
            setLoadError("購物車資料載入失敗，請稍後再試")
        } finally {
            hideLoading()
            setIsLoading(false)
        }
    }, [showLoading, hideLoading])

    // 收件人資料
    const [receiverName, setReceiverName] = useState("")
    const [receiverPhone, setReceiverPhone] = useState("")

    // 取得物流方式選項
    const [cvsTypeOptions, setCvsTypeOptions] = useState([])
    const getCvsTypeOptions = useCallback(async () => {
        try {
            setCvsTypeOptions(await apiFetch('/logistic/getCvsTypeOptions'))
        } catch (error) {
            alertify.alert("", "無法取得超商種類選項，請重新整理頁面")
        }
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

        if (rquiredInvalidColumnList.length > 0 || phoneNumRegexInvalidString !== "") {
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
            showLoading()
            try {
                const result = await apiFetch('/order', {
                    method: 'POST',
                    body: {
                        storeId: selectedStore.StoreId,
                        storeName: selectedStore.StoreName,
                        csvType: orderCvsType,
                        receiverName: receiverName,
                        receiverPhone: receiverPhone
                    }
                })

                setIsOrderBuilt(true)
                setOrderId(result.orderId)
            } catch (error) {
                alertify.alert("", error.message ? error.message : "訂單建立失敗")
            } finally {
                hideLoading()
            }
        }
    }, [orderCvsType, selectedStore, receiverName, receiverPhone, showLoading, hideLoading])

    return <>
        {isOrderBuilt && <PaymentInfoPage isNewBuilt="true" orderId={orderId}></PaymentInfoPage>}
        <div className="main-content-area">
            <div className="custom-container">
                {isLoading && <p className="text-center mt-16 text-xl">資料載入中</p>}
                {(!isLoading && loadError !== "") && <p className="text-center mt-16 text-xl">{loadError}</p>}
                {
                    (!isLoading && loadError === "") && <>
                        {
                            (Array.isArray(cartData) && cartData.length > 0) ? <>
                                <div className="section-title my-8">訂單內容確認</div>
                                <>
                                    <div className="shopping-content-list">
                                        {
                                            Array.isArray(cartData) && cartData.map(cartItem => (
                                                <div className={`shopping-content-item ${!(cartItem.is_active === 1) && "not-active"}`}
                                                    key={cartItem.cart_item_id}>
                                                    <div className="shopping-content-item-image" style={backgroundImage(cartItem.product_img)}></div>
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