import Footer from "@/components/Footer";
import "./globals.css";
import "./alertify.min.css";
import "./micromodal.css";

export const metadata = {
  title: "毛孩物坊",
  description: "毛孩物坊",
  verification: {
    google: "x4YtdS4stjAmVmjIPiwBnI9EI07fimDdQE8wHTtAE-c"
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="main-body">
        {children}
        <Footer></Footer>
      </body>
    </html>
  );
}
