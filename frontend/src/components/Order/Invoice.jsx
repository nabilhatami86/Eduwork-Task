import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { FaFileInvoiceDollar, FaTruck } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
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
    if (!invoice || !invoice._id) return null;
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const randomNumber = Math.floor(Math.random() * 10000);

    return `INV/${year}/${month}/${randomNumber}/${invoice._id}`;
  };

  const invoiceNumber = generateInvoiceNumber();

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
              <p>{invoice.user.full_name || "Nama pembeli tidak tersedia"}</p>
            </Col>
            <Col md={6}>
              <h5>Status Pembayaran:</h5>
              <p>{invoice.payment_status}</p>
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
                {invoice.delivery_address
                  ? ` ${invoice.delivery_address.provinsi}, ${invoice.delivery_address.kabupaten}, ${invoice.delivery_address.kecamatan}, ${invoice.delivery_address.kelurahan}, ${invoice.delivery_address.detail}`
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
              {invoice.order && invoice.order.order_items ? (
                invoice.order.order_items.map((item, index) => {
                  const itemSubtotal = item.qty * item.product?.price;
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.qty}</td>
                      <td>Rp {item.price?.toLocaleString()}</td>
                      <td>Rp {itemSubtotal.toLocaleString() || 0}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Tidak ada produk yang ditemukan dalam order ini.
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="3" className="text-start">
                  <strong>Total Harga:</strong>
                </td>
                <td>
                  <strong>Rp {invoice.sub_total?.toLocaleString() || 0}</strong>
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="text-start">
                  <strong>Ongkir:</strong>
                </td>
                <td>
                  <strong>
                    Rp {invoice.delivery_fee?.toLocaleString() || 0}
                  </strong>
                </td>
              </tr>
              <tr>
                <td colSpan="3" className="text-start">
                  <strong>Total Tagihan:</strong>
                </td>
                <td>
                  <strong>Rp {invoice.total?.toLocaleString() || 0}</strong>
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
