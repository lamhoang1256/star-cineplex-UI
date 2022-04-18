import { moviesApi } from "apis/moviesApi";
import {
  SELECT_SEAT,
  RESET_SELETING_SEAT,
  GET_TICKET_ROOM_REQUEST,
  GET_TICKET_ROOM_SUCCESS,
  GET_TICKET_ROOM_FAIL,
  BUY_TICKET_REQUEST,
  BUY_TICKET_SUCCESS,
  BUY_TICKET_FAIL,
} from "../constants/movieTicketRoom.constant";

// chọn ghế
export const selectSeat = (infoChair) => async (dispatch, getState) => {
  const { listSelectingSeat } = getState().movieTicketRoom;
  //kiểm tra xem ghế đang chọn có được chọn trước không VD: chọn ghế số 4 nếu nhấn chọn ghế số 4 một lần nữa sẽ bỏ chọn ghế số 4
  const selectChair = infoChair;
  let newListGheDangChon = [...listSelectingSeat];
  const index = listSelectingSeat.findIndex((c) => c.maGhe === selectChair.maGhe); // trả về -1 nếu ko tồn tại trong mảng
  if (index === -1) {
    // ghế chưa được chọn
    newListGheDangChon = [...newListGheDangChon, infoChair];
  } else {
    newListGheDangChon.splice(index, 1);
  }
  newListGheDangChon.sort((firstItem, secondItem) => firstItem.maGhe - secondItem.maGhe);

  dispatch({ type: SELECT_SEAT, payload: newListGheDangChon });
};

// xóa toàn bộ ghế đang chọn khi thanh toán thành công hoặc chuyển trang
export const resetSelectingSeat = () => async (dispatch) => {
  dispatch({ type: RESET_SELETING_SEAT });
};

// lấy thông tin phòng vé (thông tin phim + danh sách ghế)
export const getTicketRoom = (ticketRoom) => async (dispatch) => {
  try {
    dispatch({ type: GET_TICKET_ROOM_REQUEST });
    const { data } = await moviesApi.getTicketRoom(ticketRoom);
    dispatch({ type: GET_TICKET_ROOM_SUCCESS, payload: data.content });
  } catch (errors) {
    dispatch({ type: GET_TICKET_ROOM_FAIL, payload: errors });
  }
};

// xử lí mua vé
export const buyTicket = (requestBuyTicket) => async (dispatch) => {
  try {
    dispatch({ type: BUY_TICKET_REQUEST });
    const response = await moviesApi.buyTicket(requestBuyTicket);
    dispatch({ type: BUY_TICKET_SUCCESS });
    return { isBuyTicketSuccess: true };
  } catch (errors) {
    dispatch({ type: BUY_TICKET_FAIL, payload: errors });
  }
};