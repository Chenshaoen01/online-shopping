"use client"
import { useEffect, useState } from "react"

export default () => {
    return <div className="footer">
        <div className="flex">
            <img className="footer-logo me-2" src="/logo1.png"></img>
            <span>毛孩物坊</span>
        </div>
        <div className="flex flex-col md:flex-row text-center">
            <span className="mx-4">本網站僅為個人作品，無商業用途</span>
            <span>Copyright © 2024 陳劭恩 .All rights reserved.</span>
        </div>
    </div>
}