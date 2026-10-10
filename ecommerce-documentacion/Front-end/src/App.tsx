import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import { LocaleProvider } from "./context/LocaleContext";
import Layout from "./layouts/Layout";
import Home from "./pages/Home/Home";
import Women from "./pages/Women/Women";
import Men from "./pages/Men/Men";
import Product from "./pages/Product/Product";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import Checkout from "./pages/Checkout/Checkout";
import SuccessPage from "./pages/Success/SuccessPay";
import Sales from "./pages/SALES/Sales";
import Collection from "./pages/COLLECTION/Collection";
import Events from "./pages/EVENTS/Events";
import About from "./pages/ABOUT/About";
import Book from "./pages/Libro_Recla/Book";
import Profile from "./pages/Profile/Profile";
import OrderHistory from "./pages/Profile/OrderHistory";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <LocaleProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="collection" element={<Collection />} />
                  <Route path="women" element={<Women />} />
                  <Route path="men" element={<Men />} />
                  <Route path="sales" element={<Sales />} />
                  <Route path="events" element={<Events />} />
                  <Route path="about" element={<About />} />
                  <Route path="catalog/:type/:slug" element={<Collection />} />
                  <Route path="product/:id" element={<Product />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route
                    path="checkout"
                    element={
                      <ProtectedRoute>
                        <Checkout />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="success"
                    element={
                      <ProtectedRoute>
                        <SuccessPage onFinalize={() => {}} />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="orders"
                    element={
                      <ProtectedRoute>
                        <OrderHistory />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="libro-de-reclamaciones" element={<Book />} />

                  <Route
                    path="*"
                    element={
                      <div className="flex flex-col items-center justify-center min-h-[60vh] mt-[120px]">
                        <h2 className="text-4xl font-bold mb-4 tracking-tighter uppercase">
                          404
                        </h2>
                        <p className="text-gray-400 uppercase tracking-widest text-[10px] font-bold">
                          Página no encontrada
                        </p>
                      </div>
                    }
                  />
                </Route>
              </Routes>
            </Router>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </LocaleProvider>
  );
}

export default App;