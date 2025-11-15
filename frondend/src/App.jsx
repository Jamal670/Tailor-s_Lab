import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/customer/Home";
import SuitCategoryPage from "./pages/customer/SuitCategoryPage";
import ShirtCategory from "./pages/customer/ShirtCategory";
import TrouserCategory from "./pages/customer/TrouserCategoy";
import ContactUs from "./pages/customer/ContactUs";
import About from "./pages/customer/About";
import Product from "./pages/customer/Product";
import Checkout from "./pages/customer/checkout";
import CheckoutInfo from "./pages/customer/CheckoutInfo";
import OrderComp from "./pages/customer/OrderComp";
import Login from "./pages/admin/Login";
import NotFound from "./pages/customer/404";
import ShirtView from "./pages/admin/ShirtView";
import AddProduct from "./pages/admin/AddProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suits" element={<SuitCategoryPage />} />
        <Route path="/shirts" element={<ShirtCategory />} />
        <Route path="/trousers" element={<TrouserCategory />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<About />} />
        <Route path="/product" element={<Product />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/cart/checkout-info" element={<CheckoutInfo />} />
        <Route path="/order-complete" element={<OrderComp />} />
        <Route path="/admin-login" element={<Login />} />
        <Route path="/admin/shirt-view" element={<ShirtView />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;