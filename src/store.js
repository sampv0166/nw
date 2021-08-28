import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
  createUserReducer,
  userDeleteReducer,
  userDetailsReducer,
  userListReducer,
  userLoginReducer,
  userRegisterReducer,
} from './reducers/userReducers';
import {
  productCreateReducer,
  productDeleteReducer,
  productDetailsReducer,
  productListReducer,
  productUpdateReducer,
} from './reducers/productReducers';
import {
  categoryCreateReducer,
  categoryDeleteReducer,
  categoryDetailsReducer,
  categoryListReducer,
  categoryReducer,
} from './reducers/categoryReducer';
import {
  shopCreateReducer,
  shopDeleteReducer,
  shopDetailsReducer,
  shopReducer,
} from './reducers/shopReducer';
import {
  singleVariationCreateReducer,
  variationCreateReducer,
  variationDeleteReducer,
  variationImageDeleteReducer,
  variationUpdateReducer,
} from './reducers/variationReducer';
import {
  orderDetailsListReducer,
  orderListReducer,
} from './reducers/orderReducers';
import { createPermissionReducer } from './reducers/PermissionsReducer';

const reducer = combineReducers({
  productList: productListReducer,
  productDetails: productDetailsReducer,
  productDelete: productDeleteReducer,
  userLogin: userLoginReducer,

  shopList: shopReducer,
  shopListDetails: shopDetailsReducer,
  shopDelete: shopDeleteReducer,
  shopCreate: shopCreateReducer,

  productCreate: productCreateReducer,
  productUpdate: productUpdateReducer,

  variationCreate: variationCreateReducer,
  variationDelete: variationDeleteReducer,
  variationUpdate: variationUpdateReducer,
  variationImageDelete: variationImageDeleteReducer,
  singleVariationCreate: singleVariationCreateReducer,

  orderList: orderListReducer,
  orderDetailsList: orderDetailsListReducer,

  userRegister: userRegisterReducer,

  categoryCreate: categoryCreateReducer,
  categoryList: categoryListReducer,
  categoryDetails: categoryDetailsReducer,
  categoryDelete: categoryDeleteReducer,

  userCreate: createUserReducer,
  userList: userListReducer,
  userDetails: userDetailsReducer,
  userDelete: userDeleteReducer,

  permissionCreate: createPermissionReducer,
});

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
