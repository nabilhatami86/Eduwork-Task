import { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import axios from "axios";
import "./css/Order.css";
import { useLocation, useNavigate } from "react-router-dom";

const Order = () => {
  const [dataCourier, setDataCourier] = useState([]);
  const [dataAddress, setDataAddress] = useState([]);
  const [dataCart, setDataCart] = useState([]);
  const [selectedCourier, setSelectedCourier] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedProducts } = location.state || { selectedProducts: [] };
  const token = localStorage.getItem("token");

  console.log("Selected Products in Order:", selectedProducts);

  // Ambil data kurir
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courier")
      .then((response) => {
        setDataCourier(response.data);
      })
      .catch((error) => {
        console.error("Courier data error:", error);
      });
  }, []);

  // Ambil data alamat pengiriman
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/deliveryaddresses", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDataAddress(response.data);
      })
      .catch((error) => {
        console.error("Address data error:", error);
      });
  }, [token]);

  useEffect(() => {
    if (!selectedProducts || !selectedProducts.length) {
      alert("Data produk tidak ditemukan.");
      return navigate("/cart");
    }
    console.log("Selected Products:", selectedProducts);
  }, [selectedProducts]);

  // Ambil data cart/keranjang belanja
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/carts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setDataCart(response.data.cart);
      })
      .catch((error) => {
        console.error("Cart data error:", error);
      });
  }, [token]);

  const handleSubmit = async () => {
    if (!selectedAddress || !selectedCourier) {
      alert("Pilih alamat dan kurir terlebih dahulu.");
      return;
    }

    const orderData = {
      delivery_address: selectedAddress._id,
      delivery_fee: selectedCourier.delivery_fee,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/order",
        orderData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        const order = response.data;
        setModalMessage("Order berhasil! Terima kasih atas pembelian Anda.");
        setShowModal(true);
        setTimeout(() => navigate(`/invoice/${order._id}`), 2000);
      }
    } catch (error) {
      console.error("Order error:", error);
      setModalMessage("Terjadi kesalahan saat memproses pesanan.");
      setShowModal(true);
    }
  };

  const calculateTotalHarga = () => {
    const totalHarga = selectedProducts.reduce(
      (total, item) => total + item.product.price * item.qty,
      0
    );
    return totalHarga;
  };

  const calculateOngkir = () => {
    if (selectedCourier) {
      return selectedCourier.delivery_fee;
    }
    return 0;
  };

  const calculateTotalBelanja = () => {
    const totalHarga = calculateTotalHarga();
    const ongkir = calculateOngkir();
    const totalBelanja = totalHarga + ongkir;

    return totalBelanja;
  };

  const handleAddressSelect = (addressId) => {
    const selected = dataAddress.find((address) => address._id === addressId);
    setSelectedAddress(selected);
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">PENGIRIMAN</h3>

      {/* Bagian Pengiriman */}
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-header bg-primary">
              <h5 className="mb-0 text-dark">Alamat Pengiriman</h5>
            </div>
            <div className="card-body">
              {/* Dropdown untuk memilih alamat */}
              <Dropdown>
                <Dropdown.Toggle variant="info" id="dropdown-basic">
                  {selectedAddress ? selectedAddress.name : "Pilih Alamat"}
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  {dataAddress.length > 0 ? (
                    dataAddress.map((address) => (
                      <Dropdown.Item
                        key={address._id}
                        onClick={() => handleAddressSelect(address._id)}
                      >
                        {address.name}, {address.provinsi}, {address.kabupaten},
                        {address.kecamatan}, {address.kelurahan},{" "}
                        {address.detail}
                      </Dropdown.Item>
                    ))
                  ) : (
                    <Dropdown.Item disabled>Loading...</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>

              {/* Menampilkan alamat yang dipilih */}
              {selectedAddress && (
                <div className="mt-3 p-4 border rounded-3 bg-light shadow-sm">
                  <p className="fw-bold fs-5">{selectedAddress.name}</p>
                  <p className="mb-1">
                    <span className="text-muted">Provinsi:</span>{" "}
                    {selectedAddress.provinsi},{" "}
                    <span className="text-muted">Kabupaten:</span>{" "}
                    {selectedAddress.kabupaten},{" "}
                    <span className="text-muted">Kecamatan:</span>{" "}
                    {selectedAddress.kecamatan},{" "}
                    <span className="text-muted">Kelurahan:</span>{" "}
                    {selectedAddress.kelurahan}
                  </p>
                  <p className="text-muted">{selectedAddress.detail}</p>
                </div>
              )}
            </div>
          </div>

          {/* Bagian Produk */}
          {selectedProducts.length > 0 ? (
            <div className="card mb-3">
              <div className="card-body">
                <div className="d-flex flex-wrap">
                  {selectedProducts.map(
                    (item) =>
                      item?.product && (
                        <div
                          key={item.product._id}
                          className="d-flex align-items-center mb-3 w-100"
                        >
                          <img
                            src={item.product.image_url || "/placeholder.png"}
                            alt={item.product.name || "Produk"}
                            className="img-thumbnail rounded"
                            style={{ width: "100px", height: "100px" }}
                          />
                          <div className="ms-3">
                            <h6 className="mb-1">{item.product.name}</h6>
                          </div>
                          <div className="ms-auto text-end">
                            <p>
                              {item.qty} x Rp
                              {item.product.price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                  )}
                </div>

                {/* Pilih Kurir (Dropdown hanya muncul sekali) */}
                <div className="mt-3 text-end ">
                  <Dropdown>
                    <Dropdown.Toggle variant="info" id="dropdown-kurir">
                      {selectedCourier
                        ? `${selectedCourier.name} - Rp${selectedCourier.delivery_fee}`
                        : "Pilih Kurir"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {dataCourier.length > 0 ? (
                        dataCourier.map((courier) => (
                          <Dropdown.Item
                            key={courier.id}
                            onClick={() => setSelectedCourier(courier)} // Pilih kurir
                          >
                            {courier.name} - Rp{courier.delivery_fee}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>Loading...</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          ) : (
            <p>Keranjang kosong.</p>
          )}
        </div>

        {/* Ringkasan Belanja */}
        <div className="col-md-4">
          <div className="card shadow-sm">
            <div className="card-header bg-success text-dark">
              <h5 className="mb-0">Ringkasan Belanja</h5>
            </div>
            <div className="card-body">
              {/* Total Harga Produk */}
              <p className="d-flex justify-content-between">
                <span>Total Harga ({selectedProducts.length} Barang)</span>
                <span>Rp{calculateTotalHarga().toLocaleString()}</span>
              </p>

              {/* Ongkir */}
              <p className="d-flex justify-content-between">
                <span>Ongkir</span>
                <span>Rp{calculateOngkir().toLocaleString()}</span>
              </p>

              {/* Total Belanja */}
              <p className="d-flex justify-content-between">
                <span>Total Belanja</span>
                <span>Rp{calculateTotalBelanja().toLocaleString()}</span>
              </p>

              <button className="btn btn-success w-100" onClick={handleSubmit}>
                Beli
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{modalMessage}</h3>
            <button className="btn-close" onClick={() => setShowModal(false)}>
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
