import Link from "next/link.js";
export default ({product}) => {
    return <>
        <div className="flex justify-center">
            <Link className="product-card" href={`/Product/Detail/${product.product_id}`}>
                <div className="product-img mb-4" style={{ backgroundImage: product.product_img ? `url('${process.env.NEXT_PUBLIC_API_URL}/images/product/${product.product_img}')` : "" }}></div>
                <div className="product-title">{product.product_name}</div>
                <div className="product-price">{product.product_price}</div>
            </Link>
        </div>
    </>
}