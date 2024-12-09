export const LoadingPage = () => {
    return <>
        <div id="loading-page" className="loading-page">
            <div class="loader"></div>
        </div>
    </>
}

export const LoadingPageShow = () => {
    document.getElementById('loading-page').style.display = "flex"
}

export const LoadingPageHide = () => {
    console.log(document.getElementById('loading-page'))
    document.getElementById('loading-page').style.display = "none"
}