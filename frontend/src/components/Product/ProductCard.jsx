import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartSlice";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    console.log("Adding to cart:", product);
    const updatedProduct = { ...product, qty: 1 };
    console.log("Before dispatching:", updatedProduct);
    dispatch(addToCart(updatedProduct));
    console.log("Product added to cart dispatched");
  };

  const handleBuyNow = () => {
    const selectedProduct = {
      product,
      qty: 1,
    };
    navigate("/order", { state: { selectedProducts: [selectedProduct] } });
  };

  return (
    <div className="card custom-card shadow">
      <img
        src={product.image_url}
        className="card-img-top custom-img"
        alt={product.name || "Produk"}
      />

      <div className="card-body">
        <h5 className="card-title">{product.name || "Produk"}</h5>
        <p className="card-text fw-semibold">
          Rp.{product.price?.toLocaleString("id-ID") || "0"}
        </p>
        <p className="card-text">
          {product.description || "Deskripsi tidak tersedia"}
        </p>
        <button
          onClick={handleBuyNow}
          type="button"
          className="btn btn-success w-100 mb-2 rounded-2"
        >
          Beli
        </button>
        <button
          onClick={handleAddToCart}
          type="button"
          className="btn btn-warning w-100 mb-2 rounded-2"
        >
          Keranjang
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
