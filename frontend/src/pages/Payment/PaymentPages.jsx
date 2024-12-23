import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./PaymentPages.css";

const PaymentPages = () => {
  const [payment, setPayment] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const { order_id } = useParams();

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/order/${order_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setPayment(response.data);
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayment();
  }, [order_id, token]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container-fluid bg-custom d-flex flex-column justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4 text-center"
        style={{
          width: "90%",
          maxWidth: "500px",
          borderRadius: "15px",
          backgroundColor: "#f9fdf9",
        }}
      >
        <h5 className="text-muted mb-3 text-start">Total Tagihan: </h5>
        <h3 className="fw-bold text-dark mb-4 text-start">
          RP. {payment.total_amount || "1.XXX.XXX"}{" "}
          {/* Adjust this to your actual payment data */}
        </h3>
        <h5 className="text-muted mb-3 text-start">Masukan Nominal:</h5>
        <input
          type="text"
          className="form-control mb-4 custom-input"
          placeholder="Masukan nominal pembayaran disini"
        />
        <div
          className="w-100 d-flex justify-content-between align-items-center bg-light px-3 py-2 mt-4 footer"
          style={{
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
            maxWidth: "500px",
          }}
        >
          <div className="text-muted small">
            No. Pesanan: {payment.order_id || "XBBV.32837.238383"}
          </div>{" "}
          {/* Use actual order ID */}
        </div>
        <button className="btn btn-success w-100 py-2 rounded-pill">
          Proses Pembayaran
        </button>
      </div>
    </div>
  );
};

export default PaymentPages;
