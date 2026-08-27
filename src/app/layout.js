import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import { LoadingProvider } from "@/components/LoadingProvider";
import "./globals.css";
import "./alertify.min.css";
import "./micromodal.css";

export const metadata = {
  title: {
    default: "毛孩物坊",
    template: "%s | 毛孩物坊"
  },
  description: "毛孩物坊是一個寵物用品購物網站，提供飼料、玩具與各式毛孩好物。",
  verification: {
    google: "x4YtdS4stjAmVmjIPiwBnI9EI07fimDdQE8wHTtAE-c"
  },
  openGraph: {
    title: "毛孩物坊",
    description: "毛孩物坊是一個寵物用品購物網站，提供飼料、玩具與各式毛孩好物。",
    type: "website",
    locale: "zh_TW"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-Hant-TW">
      <body className="main-body">
        <LoadingProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </LoadingProvider>
        <Footer></Footer>
      </body>
    </html>
  );
}
