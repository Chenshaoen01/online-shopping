import Navbar from "@/components/Navbar";

export default async () => {
    const aboutContent = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/param/about`, {cache: "no-cache"})
    .then(res => res.json())
    .catch(err => console.log(err))
    return <>
        <Navbar></Navbar>
        <div className="main-content-area">
            <div className="custom-container">
                <div className="section-title my-8">關於我們</div>
                <div className="about-us-content">{aboutContent?.param_content}</div>
            </div>
        </div>
    </>
}