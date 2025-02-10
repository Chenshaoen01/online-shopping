import Footer from "@/components/Footer";
import "./globals.css";
import "./alertify.min.css";
import "./micromodal.css";
import Head from "next/head";

export const metadata = {
  title: "毛孩物坊",
  description: "毛孩物坊"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
          <meta name="google-site-verification" content="x4YtdS4stjAmVmjIPiwBnI9EI07fimDdQE8wHTtAE-c" />
      </Head>
      <body className="main-body">
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
