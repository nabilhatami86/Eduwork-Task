import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCartItems,
  incrementQty,
  decrementQty,
  deleteCart,
} from "../../redux/cartSlice";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import "./css/cart.css";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (token) {
      console.log("Dispatching getCartItems action...");
      dispatch(getCartItems());
    } else {
      console.error("Token is not available");
    }
  }, [token, dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteCart(id)).then(() => {
      dispatch(getCartItems());
    });
  };

  const handleIncrement = async (product_id, currentQty) => {
    const newQty = currentQty;
    try {
      await dispatch(incrementQty({ product_id, qty: newQty })).unwrap();
      dispatch(getCartItems());
    } catch (error) {
      console.error("Error incrementing quantity:", error);
    }
  };

  const handleDecrement = (product_id, currentQty) => {
    const item = items.find((i) => i.product._id === product_id);
    const cart_id = item ? item._id : undefined;

    if (currentQty > 1) {
      dispatch(decrementQty({ product_id, qty: currentQty }))
        .then(() => {
          dispatch(getCartItems());
        })
        .catch((error) => {
          console.error(`Error decrementing product ID: ${product_id}`, error);
        });
    } else if (currentQty === 1) {
      if (cart_id) {
        handleDelete(cart_id);
      }
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = prevSelectedItems.includes(id)
        ? prevSelectedItems.filter((itemId) => itemId !== id)
        : [...prevSelectedItems, id];
      console.log(updatedSelectedItems);
      return updatedSelectedItems;
    });
  };

  const isCheckoutEnabled = selectedItems.length > 0;

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      if (selectedItems.includes(item.product._id)) {
        total += item.price * item.qty;
      }
      return total;
    }, 0);
  };

  const handleProceedToOrder = () => {
    const selectedProducts = items.filter((item) =>
      selectedItems.includes(item.product._id)
    );
    console.log("Navigating with selectedProducts:", selectedProducts);
    navigate("/order", { state: { selectedProducts } });
  };

  if (!items || items.length === 0) {
    return <p>Keranjang kosong</p>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <h1 className="fs-4 mt-3 mb-4">Keranjang</h1>
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Check</th>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <CartItem
                  key={item.product._id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onDelete={handleDelete}
                  onSelect={handleSelectItem}
                  isSelected={selectedItems.includes(item.product._id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-md-4 mt-4">
          <CartSummary
            items={items}
            calculateSubtotal={calculateSubtotal}
            handleProceedToOrder={handleProceedToOrder}
            isCheckoutEnabled={isCheckoutEnabled}
            selectedItems={selectedItems}
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
