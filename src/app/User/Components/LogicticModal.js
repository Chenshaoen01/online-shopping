"use client";
import { useCallback, useState, forwardRef, useImperativeHandle, useEffect, useRef } from "react"
import { useLoading } from '@/components/LoadingProvider';
import alertify from "alertifyjs";
import { apiFetch } from "@/api/client";

export default forwardRef(function LogicticModal({ orderCvsType, setSelectedStore, MicroModal }, ref) {
    const [logisticDataList, setLogisticDataList] = useState([])
    const [modalDisplayStoreList, setModalDisplayStoreList] = useState([])
    const [modalDisplayStoreListPage, setModalDisplayStoreListPage] = useState(1)
    const [modalDisplayStoreListPageSize] = useState(50)
    
    const [countyOptionList, setCountyOptionList] = useState([])
    const [districtOptionList, setDistrictOptionList] = useState([])
    const [diplayDistrictOptionList, setDistrictDiplyOptionList] = useState([])
    const [filterMode, setFilterMode] = useState("StoreName")
    const { showLoading, hideLoading } = useLoading()

    // 視窗被開啟時重置門市資料/篩選資料
    useImperativeHandle(ref, () => {
        return {
            resetModal() {
                // 重置表單資料
                setLogisticDataList([])
                resetDisplayData()
                // 預設依照門市名稱篩選
                setFilterMode("StoreName")
                // 清空門市名稱篩選條件
                setFilterStoreName("")
                // 清空縣市/鄉鎮市區篩選條件、選項
                setCountyOptionList([])
                setDistrictOptionList([])
                setDistrictDiplyOptionList([])
                setFilterCountyName("")
                setFilterDistrictName("")

                // 取得門市資料
                getLogisticData()
            }
        }
    });

    // 整理門市縣市、鄉鎮市區資料
    const addCountyAndDistrict = useCallback((storeList) => {
        const countySet = new Set();
        const districtMap = new Map();

        const updatedStoreList = storeList.map(store => {
            const addressPattern = /^(?<countyName>[^市縣]+[市縣])(?<districtName>[^鄉鎮市區]+[鄉鎮市區])/;
            const match = store.StoreAddr.match(addressPattern);
            const { countyName, districtName } = match ? match.groups : { countyName: "未知", districtName: "未知" };

            countySet.add(countyName);

            // 同一個區名可能出現在不同縣市，因此以縣市加區名作為 key
            const districtKey = `${countyName}${districtName}`;
            if (!districtMap.has(districtKey)) {
                districtMap.set(districtKey, { countyName, districtName });
            }

            return { ...store, countyName, districtName };
        });

        const countyNameList = Array.from(countySet);
        const districtNameList = Array.from(districtMap.values()).map(({ countyName, districtName }) => ({
            parentCountyName: countyName,
            districtName
        }));

        return {
            updatedStoreList,
            countyNameList,
            districtNameList
        };
    }, [])

    // 取得門市資料
    const getLogisticData = async () => {
        showLoading()
        try {
            const result = await apiFetch('/logistic/getCheckMacValue', {
                method: 'POST',
                body: { CvsType: orderCvsType }
            })

            if (result.RtnCode !== 1 || !Array.isArray(result.StoreList) || result.StoreList.length === 0) {
                throw new Error()
            }

            // 取得標註各門市的縣市/鄉鎮市區的資料
            const storeListWithCountyAndDistrictName = addCountyAndDistrict(result.StoreList[0].StoreInfo)
            setLogisticDataList(storeListWithCountyAndDistrictName.updatedStoreList)
            setModalDisplayStoreList(storeListWithCountyAndDistrictName.updatedStoreList)
            // 寫入鄉鎮市區選項
            setCountyOptionList(storeListWithCountyAndDistrictName.countyNameList)
            setDistrictOptionList(storeListWithCountyAndDistrictName.districtNameList)
        } catch (error) {
            setModalDisplayStoreList([])
            MicroModal.close("logistic-modal")
            alertify.alert("", "無法取得門市資料")
        } finally {
            hideLoading()
        }
    }

    // 監聽門市清單列表，滾動到底部，顯示接下來 50 筆
    const storeListScroll = useCallback((e) => {
        const {scrollHeight, scrollTop, clientHeight} = e.target
        if(scrollHeight - (clientHeight + scrollTop) <= 15) {
            setModalDisplayStoreListPage(modalDisplayStoreListPage + 1)
        }
    }, [modalDisplayStoreListPage])

    // 重置監聽門市清單列表
    const storeCardList = useRef()
    const resetDisplayData = useCallback(() => {
        setModalDisplayStoreListPage(1)
        if(storeCardList.current) {
            storeCardList.current.scrollTo(0, 0)
        }
    }, [])

    // 篩選標準更換時，重置門市清單內容
    useEffect(() => {
        resetDisplayData()
        setModalDisplayStoreList(logisticDataList)
    }, [filterMode, logisticDataList, resetDisplayData])


    // 依門市名稱篩選
    const [filterStoreName, setFilterStoreName] = useState("")
    const filterWithStoreName = () => {
        resetDisplayData()
        setModalDisplayStoreList(logisticDataList.filter(store => store.StoreName.includes(filterStoreName)))
    }

    // 依地址篩選
    const [filterCountyName, setFilterCountyName] = useState("")
    const [filterDistrictName, setFilterDistrictName] = useState("")

    const fiterCountyOnChange = (newCountyValue) => {
        setFilterCountyName(newCountyValue)
        setFilterDistrictName("")

        resetDisplayData()
        setDistrictDiplyOptionList(districtOptionList.filter(districtOption => districtOption.parentCountyName === newCountyValue))
    }
    const filterWithAddress = () => {
        resetDisplayData()
        setModalDisplayStoreList(logisticDataList.filter(store => store.StoreAddr.startsWith(`${filterCountyName}${filterDistrictName}`)))
    }

    // 點擊門市卡片：選擇該門市、關閉視窗
    const storeCardClick = useCallback((targetLogisticData) => {
        MicroModal.close("logistic-modal")
        setSelectedStore({
            StoreId: targetLogisticData.StoreId,
            StoreName: targetLogisticData.StoreName
        })
    }, [MicroModal, setSelectedStore])

    return <>
        <div className="modal micromodal-slide logistic-modal" id="logistic-modal" aria-hidden="true">
            <div className="modal__overlay" data-micromodal-close>
                <div className="modal__container" role="dialog" aria-modal="true" aria-labelledby="logistic-modal-title">
                    <header className="modal__header">
                        <h2 className="modal__title" id="logistic-modal-title">
                            物流門市設定
                        </h2>
                        <button className="modal__close" aria-label="Close modal" data-micromodal-close></button>
                    </header>
                    <main className="modal__content" id="logistic-modal-content">
                        <div className="w-full h-full flex flex-col relative ">
                            <div className="w-full flex flex-col sticky">
                                <div className="button-group mb-6">
                                    <button className={`button-group-item ${filterMode === "StoreName" && "active"}`} type="button"
                                        onClick={() => { setFilterMode("StoreName") }}>依門市名稱篩選</button>
                                    <button className={`button-group-item ${filterMode === "StoreAddr" && "active"}`} type="button"
                                        onClick={() => { setFilterMode("StoreAddr") }}>依地址篩選</button>
                                </div>
                                {
                                    filterMode === "StoreName" && <>
                                        <div className="flex flex-col justify-start mb-8">
                                            <div className="w-full flex items-center">
                                                <span className="title-md my-0">門市名稱</span>
                                                <input className="w-full primary-input mr-4" value={filterStoreName}
                                                    onChange={(e) => { setFilterStoreName(e.target.value) }} />
                                            </div>
                                            <button type="button" className="whitespace-nowrap button-md button-dark"
                                                onClick={() => { filterWithStoreName() }}>篩選</button>
                                        </div>
                                    </>
                                }
                                {
                                    filterMode === "StoreAddr" && <>
                                        <div className="flex flex-col justify-start mb-8">
                                            <div className="w-full flex mb-4 items-center">
                                                <span className="title-md my-0">縣市</span>
                                                <select className="w-full primary-input" value={filterCountyName}
                                                    onChange={(e) => { fiterCountyOnChange(e.target.value) }}>
                                                    <option value="" disabled>請選擇縣市</option>
                                                    {
                                                        Array.isArray(countyOptionList) && countyOptionList.map(county => (
                                                            <option value={county} key={county}>{county}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="w-full flex">
                                                <span className="title-md my-0">鄉鎮市區</span>
                                                <select className="w-full primary-input" value={filterDistrictName}
                                                    onChange={(e) => { setFilterDistrictName(e.target.value) }}>
                                                    <option value="" disabled>請選擇鄉鎮市區</option>
                                                    {
                                                        Array.isArray(diplayDistrictOptionList)
                                                        && diplayDistrictOptionList.map(district => (
                                                            <option value={district.districtName} key={`${district.parentCountyName}${district.districtName}`}>
                                                                {district.districtName}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <button type="button" className="whitespace-nowrap button-md button-dark"
                                                onClick={() => { filterWithAddress() }}>篩選</button>
                                        </div>
                                    </>
                                }
                            </div>
                            <div ref={storeCardList} className="store-card-list" onScroll={(e) => {storeListScroll(e)}}>
                                {
                                    (Array.isArray(modalDisplayStoreList) && modalDisplayStoreList.length > 0) ? (
                                        modalDisplayStoreList.map((storeData, storeDataIndex) => (
                                            (storeDataIndex +1 <= (modalDisplayStoreListPage * modalDisplayStoreListPageSize)) &&
                                            <div className="store-card" key={storeData.StoreId}
                                                onClick={() => {
                                                    storeCardClick(storeData)
                                                }}>
                                                <div className="flex">
                                                    <span className="whitespace-nowrap">門市編號：</span>
                                                    <span>{storeData.StoreId}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="whitespace-nowrap">門市名稱：</span>
                                                    <span>{storeData.StoreName}</span>
                                                </div>
                                                <div className="flex">
                                                    <span className="whitespace-nowrap">門市地址：</span>
                                                    <span>{storeData.StoreAddr}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="mx-auto">查無相符的門市資料</div>
                                    )
                                }
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    </>
})