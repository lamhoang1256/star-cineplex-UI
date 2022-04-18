import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
// component
import { Banner } from "components/Banner/Banner";
import { ModalBill } from "./components/ModalBill/ModalBill";
import { SeatingPlan } from "./components/SeatingPlan/SeatingPlan";
import { LoadingAnimation } from "components/LoadingAnimation/LoadingAnimation";
// action
import { getTicketRoom, buyTicket, resetSelectingSeat } from "redux/actions/movieTicketRoom.action";

import "./movieTicketRoom.scss";
// đường dẫn ảnh banner
const urlBanner = `url("${process.env.REACT_APP_PUBLIC}/assets/images/background-booking.jpg"
)`;

export const MovieTicketRoom = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isModalBillVisible, setIsModalBillVisible] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  const { dataTicketRoom, listSelectingSeat, isLoadingTicketRoom } = useSelector(
    (state) => state.movieTicketRoom
  );

  //tính tổng tiền của các ghế
  const totalMoney = listSelectingSeat.reduce(function (prevValue, currentValue) {
    return prevValue + currentValue.giaVe;
  }, 0);

  const handleBuyTicket = async () => {
    const dataToBuyTicket = {
      maLichChieu: dataTicketRoom.thongTinPhim.maLichChieu.toString(),
      danhSachVe: listSelectingSeat,
    };
    // nếu chưa chọn 1 ghế nào cả -> hiện ra modal nhắc nhở
    if (dataToBuyTicket.danhSachVe.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Vui lòng chọn ghế",
        text: "Bạn chưa chọn ghế nào cả!",
        confirmButtonColor: "#d33",
      });
      return;
    }
    //không được chọn quá 10 ghế -> hiện modal nhắc nhở
    if (dataToBuyTicket.danhSachVe.length > 10) {
      Swal.fire({
        icon: "error",
        title: "Không chọn quá 10 ghế",
        text: "Bạn không được chọn quá 10 ghế!",
        confirmButtonColor: "#d33",
      });
      return;
    }
    if (!userInfo) {
      Swal.fire({
        icon: "error",
        title: "Mua vé thất bại",
        text: "Vui lòng đăng nhập để tiếp tục mua vé!",
        confirmButtonColor: "#d33",
      });
      return;
    }
    const { isBuyTicketSuccess } = await dispatch(buyTicket(dataToBuyTicket));
    //nếu mua vé thành công hiện modal bill
    if (isBuyTicketSuccess) {
      setIsModalBillVisible(!isModalBillVisible);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getTicketRoom(id));
    dispatch(resetSelectingSeat());
  }, [id]);

  return (
    <>
      {!isLoadingTicketRoom ? (
        <div className='movie-booking'>
          <Banner urlBanner={urlBanner} heading={"Trang đặt vé phim"} />
          <div className='container'>
            <div className='movie-booking-container'>
              <div className='movie-booking-left'>
                <div className='movie-booking-realtime'>
                  <p>Thời gian giữ ghế</p>
                  <p className='movie-booking-time'>05:00</p>
                </div>
                <div className='movie-booking-main'>
                  <div className='movie-booking-choice'>
                    <h3 className='movie-booking-title'>Chọn ghế</h3>
                    <div className='movie-booking-screen'>Màn hình</div>
                    <SeatingPlan
                      listSelectingSeat={listSelectingSeat}
                      danhSachGhe={dataTicketRoom.danhSachGhe}
                    />
                  </div>
                </div>
              </div>
              {/* Thông tin phim */}
              <div className='movie-booking-right'>
                <div className='movie-booking-info-movie'>
                  <h2>Thông tin phim</h2>
                  <div className='movie-booking-thumb'>
                    <img src={dataTicketRoom.thongTinPhim.hinhAnh} alt='movie-thumb' />
                  </div>
                  <div>
                    <div className='movie-booking-title'>
                      <span className='label'>Tên phim:</span>
                      {dataTicketRoom.thongTinPhim.tenPhim}
                    </div>
                    <div className='movie-booking-cinema'>
                      <span className='label'>Rạp: </span>
                      {dataTicketRoom.thongTinPhim.tenCumRap}
                    </div>
                    <div className='movie-booking-location'>
                      <span className='label'>Địa chỉ: </span>
                      {dataTicketRoom.thongTinPhim.diaChi}
                    </div>
                    <div className='movie-booking-openday'>
                      <span className='label'>Suất chiếu: </span>
                      {dataTicketRoom.thongTinPhim.gioChieu} {dataTicketRoom.thongTinPhim.ngayChieu}
                    </div>
                    <div className='movie-booking-seats'>
                      <span className='label'>Số ghế đã chọn:</span>
                      {listSelectingSeat.length !== 0
                        ? listSelectingSeat.map((c, index) => {
                            // check nếu chọn 1 ghế thì không xuất hiện dấu VD: 3,5 ; 3
                            const seat = index === 0 ? c.tenGhe : ", " + c.tenGhe;
                            return seat;
                          })
                        : "Chưa chọn ghế"}
                    </div>
                  </div>
                </div>
                <div className='movie-booking-info-user'>
                  <h2>Thông tin khách hàng</h2>
                  {userInfo ? (
                    <>
                      <div className='movie-booking-openday'>
                        <span className='label'>Họ tên: </span>
                        {userInfo.hoTen}
                      </div>
                      <div className='movie-booking-email'>
                        <span className='label'>Email: </span>
                        {userInfo.email}
                      </div>
                      <div className='movie-booking-phone'>
                        <span className='label'>Số điện thoại: </span>
                        {userInfo.soDT}
                      </div>
                    </>
                  ) : (
                    "Đăng nhập để xem thông tin của bạn"
                  )}
                </div>
                <div className='movie-booking-bill'>
                  <h2 className='movie-booking-price'>
                    Tổng tiền: {totalMoney.toLocaleString("en-US")} VNĐ
                  </h2>
                </div>
                <button className='btn btn--primary' onClick={handleBuyTicket}>
                  Đặt vé
                </button>
              </div>
            </div>
          </div>
          {/* mở modal bill khi đặt vé thành công  */}
          {isModalBillVisible && (
            <ModalBill
              id={id}
              totalMoney={totalMoney}
              isModalBillVisible={isModalBillVisible}
              setIsModalBillVisible={setIsModalBillVisible}
            />
          )}
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
};