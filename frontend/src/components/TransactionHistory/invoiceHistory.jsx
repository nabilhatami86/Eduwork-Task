import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsCheckCircle, BsClock } from "react-icons/bs";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/order", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setOrders(res.data);
      })
      .catch((err) => {
        console.error("Error fetching order history:", err);
      });
  }, [token]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Order History</h2>
      {orders.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped  table-hover">
            <thead>
              <tr>
                <th>No</th>
                <th>Product Name</th>
                <th>Product Price</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.product.name}</td>
                  <td>Rp {order.product.price}</td>
                  <td>Rp {order.order.total}</td>
                  <td>
                    <span
                      className={`fw-bold ${
                        order.order.status === "success"
                          ? "text-success"
                          : "text-warning"
                      }`}
                    >
                      {order.order.status === "success" ? (
                        <BsCheckCircle
                          className="ms-2"
                          style={{ fontSize: "1.5em", fontWeight: "bold" }}
                        />
                      ) : (
                        <BsClock
                          className="ms-2"
                          style={{ fontSize: "1.5em", fontWeight: "bold" }}
                        />
                      )}
                      <span className="ms-2">{order.order.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No orders found.</p>
      )}
    </div>
  );
};

export default OrderHistory;
