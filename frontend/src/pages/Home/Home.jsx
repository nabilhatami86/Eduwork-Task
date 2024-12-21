import Product from "../../components/Product/ProductList";
import Slider from "react-slick";
import "./Home.css";
import Promosi1 from "../../assets/Fashion_Sale_Banner_1.jpg";
import Promosi2 from "../../assets/promosi2.jpg";
import Promosi3 from "../../assets/promosi3.jpg";
import { FaStar, FaQuoteLeft, FaUserCircle } from "react-icons/fa";

const Home = ({ searchTerm }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div>
      {/* Gambar Promosi */}
      <Slider {...settings} className="promo-slider">
        <div>
          <img src={Promosi1} alt="Fashion Trends" className="img-fluid" />
        </div>
        <div>
          <img src={Promosi2} alt="Sale" className="img-fluid" />
        </div>
        <div>
          <img src={Promosi3} alt="New Arrivals" className="img-fluid" />
        </div>
      </Slider>
      <div className="product-container mt-5">
        {/* Produk Terbaru */}
        <h2 className="text-center mb-4">Produk Terbaru</h2>
        <div className="product-list">
          <Product searchTerm={searchTerm} />
        </div>
      </div>

      {/* Seksi Menarik Setelah Produk */}
      <div className="promotion-section text-center mt-5 py-5">
        <h3>Jangan Lewatkan Promo Spesial Kami!</h3>
        <p>
          Segera dapatkan berbagai penawaran menarik dan diskon hingga 50% hanya
          di toko kami.
        </p>
        <a href="/product" className="btn btn-warning">
          Lihat Promo
        </a>
      </div>

      {/* Testimonial */}
      <div className="testimonial-section text-center mt-5 py-5">
        <h3 className="mb-5">Apa Kata Pelanggan Kami?</h3>
        <div className="testimonial-slider">
          <Slider {...settings}>
            <div className="testimonial-item">
              <FaQuoteLeft className="quote-icon" />
              <p>
                "Produk yang sangat berkualitas! Pengiriman cepat dan harga
                terjangkau."
              </p>
              <div className="user-info mt-4">
                <FaUserCircle className="user-icon" />
                <h5>Andi</h5>
                <div className="rating">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <FaQuoteLeft className="quote-icon" />
              <p>"Pengalaman belanja yang menyenangkan, akan kembali lagi."</p>
              <div className="user-info mt-4">
                <FaUserCircle className="user-icon" />
                <h5>Siti</h5>
                <div className="rating">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
              </div>
            </div>
            <div className="testimonial-item">
              <FaQuoteLeft className="quote-icon" />
              <p>
                "Kualitas produk sangat bagus, sangat puas dengan layanan
                pelanggan."
              </p>
              <div className="user-info mt-4">
                <FaUserCircle className="user-icon" />
                <h5>Budi</h5>
                <div className="rating">
                  <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Home;
