import { Billing, Payment, Shipping, ThankYou, CartEmpty } from './checkout';
import Breadcrumbs from './components/breadcrumbs';
import Cart from './components/cart-sidebar';
import Wishlist from './components/wishlist-sidebar';
import LoginModal from './components/login-modal';
import Home from './home';
import Notification from './components/notification';
import { BillingDetails, MyProfile, OrderHistory, ShippingDetails } from './my-account';
import { Product } from './product';
import { Category } from './category';
import CategoryAccordion from './components/category-accordion';

const page = {
  get checkout() {
    return {
      cart: new CartEmpty(),
      shipping: new Shipping(),
      billing: new Billing(),
      payment: new Payment(),
      thankyou: new ThankYou()
    };
  },

  get components() {
    return {
      cart: Cart,
      loginModal: LoginModal,
      breadcrumbs: Breadcrumbs,
      categoryAccordion: CategoryAccordion,
      wishlist: Wishlist,
      notification: Notification
    };
  },

  get home() {
    return Home;
  },

  get myAccount() {
    return {
      myProfile: new MyProfile(),
      shippingDetails: new ShippingDetails(),
      billingDetails: new BillingDetails(),
      orderHistory: new OrderHistory()
    };
  },

  category(category?: string, subcategory?: string) {
    return new Category(category, subcategory);
  },

  product(id?: string, slug?: string) {
    return new Product(id, slug);
  }

};

export default page;
