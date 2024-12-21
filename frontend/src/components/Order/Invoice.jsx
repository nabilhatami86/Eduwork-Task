import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { FaFileInvoiceDollar, FaTruck } from "react-icons/fa";
import "./css/Invoice.css";

const Invoice = () => {
  const { order_id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/invoices/${order_id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response.data);
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [order_id, token]);

  const generateInvoiceNumber = () => {
    if (!invoice.invoice || !invoice.invoice._id) return null; // Cek apakah invoice sudah ada dan memiliki ID
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 10000);

    // Menggunakan invoice._id untuk ID invoice
    return `INV/${year}/${month}/${randomNumber}/${invoice.invoice._id}`;
  };

  const invoiceNumber = generateInvoiceNumber();
  console.log(invoiceNumber);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h3>Loading invoice...</h3>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="text-center mt-5">
        <h4 className="text-danger">Data invoice tidak ditemukan.</h4>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="shadow-lg border-0">
        <Card.Header className="bg-light text-center py-4">
          <h4 className="mb-0">
            <FaFileInvoiceDollar /> Invoice
          </h4>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Pembeli:</h5>
              <p>
                {invoice.invoice.user.full_name ||
                  "Nama pembeli tidak tersedia"}
              </p>
            </Col>
            <Col md={6}>
              <h5>Status Pembayaran:</h5>
              <p>{invoice.invoice.order.status}</p>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={6}>
              <h5>Nomor Invoice:</h5>
              <p>{invoiceNumber}</p>
            </Col>
            <Col md={6}>
              <h5>Tanggal:</h5>
              <p>{currentDate}</p>
            </Col>
          </Row>

          <Row className="mt-3">
            <Col md={12}>
              <h5>Alamat Pengiriman:</h5>
              <p>
                {invoice.invoice.order.delivery_address
                  ? ` ${invoice.invoice.order.delivery_address.detail},
                  ${invoice.invoice.order.delivery_address.kelurahan},
                  ${invoice.invoice.order.delivery_address.kecamatan}, 
                  ${invoice.invoice.order.delivery_address.kabupaten}, 
                  ${invoice.invoice.order.delivery_address.provinsi}`
                  : "Alamat pengiriman tidak tersedia"}
              </p>
            </Col>
          </Row>

          <Table striped bordered hover className="mt-4">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Jumlah Barang</th>
                <th>Harga Barang</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {invoice.orderItems.map((item) => {
                const subtotal = item.price * item.qty;
                return (
                  <tr key={item._id}>
                    <td>{item.product.name || "Nama produk tidak tersedia"}</td>
                    <td>{item.qty}</td>
                    <td>Rp {item.product.price.toLocaleString()}</td>
                    <td>Rp {subtotal.toLocaleString()}</td>
                  </tr>
                );
              })}

              <tr>
                <td colSpan="3" className="text-start">
                  <strong>Total Harga:</strong>
                </td>
                <td>
                  <strong>Rp{invoice.invoice.orderItems} </strong>
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="text-start">
                  <strong>Ongkir:</strong>
                </td>
                <td>
                  <strong>Rp{invoice.invoice.order.delivery_fee}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="text-start">
                  <strong>Total:</strong>
                </td>
                <td>
                  <strong>Rp {invoice.invoice.order.total}</strong>
                </td>
              </tr>
            </tbody>
          </Table>

          <Row className="mt-3">
            <Col className="text-center">
              <Button variant="secondary" onClick={() => window.print()}>
                <FaTruck /> Cetak Invoice
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Invoice;
