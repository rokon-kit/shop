import { lazy } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AccountLayout } from './components/account/AccountLayout'
import { Layout } from './components/layout/Layout'
import { AppProviders } from './context/AppProviders'
import Home from './pages/Home'

/* Route-level code splitting: everything except the homepage loads on demand. */
const named = <T extends Record<string, React.ComponentType>>(loader: () => Promise<T>, key: keyof T) =>
  lazy(() => loader().then((m) => ({ default: m[key] })))

const Shop = lazy(() => import('./pages/Shop'))
const NewArrivalsPage = named(() => import('./pages/Shop'), 'NewArrivalsPage')
const BestSellersPage = named(() => import('./pages/Shop'), 'BestSellersPage')
const SalePage = named(() => import('./pages/Shop'), 'SalePage')
const ProductPage = lazy(() => import('./pages/ProductPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const OrderConfirmation = lazy(() => import('./pages/OrderConfirmation'))
const SearchPage = lazy(() => import('./pages/SearchPage'))
const WishlistPage = lazy(() => import('./pages/WishlistPage'))
const LoginPage = named(() => import('./pages/AuthPages'), 'LoginPage')
const RegisterPage = named(() => import('./pages/AuthPages'), 'RegisterPage')
const ForgotPasswordPage = named(() => import('./pages/AuthPages'), 'ForgotPasswordPage')
const AccountOverview = named(() => import('./pages/account/AccountPages'), 'AccountOverview')
const AccountOrders = named(() => import('./pages/account/AccountPages'), 'AccountOrders')
const AccountWishlist = named(() => import('./pages/account/AccountPages'), 'AccountWishlist')
const AccountAddresses = named(() => import('./pages/account/AccountPages'), 'AccountAddresses')
const AccountProfile = named(() => import('./pages/account/AccountPages'), 'AccountProfile')
const About = lazy(() => import('./pages/info/About'))
const Contact = lazy(() => import('./pages/info/Contact'))
const SizeGuidePage = named(() => import('./pages/info/HelpPages'), 'SizeGuidePage')
const FAQPage = named(() => import('./pages/info/HelpPages'), 'FAQPage')
const DeliveryReturnsPage = named(() => import('./pages/info/HelpPages'), 'DeliveryReturnsPage')
const TrackOrderPage = named(() => import('./pages/info/HelpPages'), 'TrackOrderPage')
const StoresPage = named(() => import('./pages/info/EditorialPages'), 'StoresPage')
const JournalPage = named(() => import('./pages/info/EditorialPages'), 'JournalPage')
const CareersPage = named(() => import('./pages/info/EditorialPages'), 'CareersPage')
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="shop/:category" element={<Shop />} />
            <Route path="new-arrivals" element={<NewArrivalsPage />} />
            <Route path="best-sellers" element={<BestSellersPage />} />
            <Route path="sale" element={<SalePage />} />
            <Route path="product/:slug" element={<ProductPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="order-confirmation" element={<OrderConfirmation />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="account" element={<AccountLayout />}>
              <Route index element={<AccountOverview />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="profile" element={<AccountProfile />} />
            </Route>
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="size-guide" element={<SizeGuidePage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="delivery-returns" element={<DeliveryReturnsPage />} />
            <Route path="track-order" element={<TrackOrderPage />} />
            <Route path="stores" element={<StoresPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="careers" element={<CareersPage />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AppProviders>
    </BrowserRouter>
  )
}
