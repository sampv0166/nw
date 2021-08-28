import axios from "axios";
import { BASE_URL } from "../constants/Globals";
import {
  ORDER_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
} from "../constants/orderConstants";

export const listOrders = (pageNumber) => async (dispatch) => {
  try {
    dispatch({ type: ORDER_LIST_REQUEST });
    const { data } = await axios.get(
      `${BASE_URL}api/v2/admin/orders?page=${pageNumber}`
    );

    dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });

  } catch (error) {
    dispatch({
      type: ORDER_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
