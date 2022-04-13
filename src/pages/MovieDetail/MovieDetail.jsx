import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// component
import { Comment } from "./components/Comment/Comment";
import { RightSideNews } from "components/RightSideNews/RightSideNews";
import { Showtime } from "./components/Showtime/Showtime";
import { ShowtimeMobile } from "./components/Showtime/ShowtimeMobile";
import { AddComment } from "components/AddComment/AddComment";
import { ModalTrailer } from "components/ModalTrailer/ModalTrailer";
import { LoadingAnimation } from "components/LoadingAnimation/LoadingAnimation";
// action
import {
  getDetailMovieAction,
  getCommentMovieAction,
  getCinemaDetailMovieAction,
} from "redux/actions/movieDetail.action";
import { openModalTrailerAction } from "redux/actions/modalTrailer.action";
import { useMediaQuery } from "hooks/useMediaQuery";
import "./movieDetail.scss";

export const MovieDetail = () => {
  window.scrollTo(0, 0);
  const { id } = useParams(); // lấy id từ thanh url
  const dispatch = useDispatch();
  const { data, loading, dataComment, loadingComment } = useSelector((state) => state.movieDetail);
  // kiểm tra xem người dùng đang ở điện thoại hay không để load giao diện cinema
  const isMobile = useMediaQuery("(max-width:767.98px)");

  // get data detail movie from API thông qua id
  useEffect(() => {
    dispatch(getDetailMovieAction(id));
    dispatch(getCommentMovieAction(id));
    dispatch(getCinemaDetailMovieAction(id));
  }, []);

  return (
    <>
      {!loading ? (
        <div className='movie-detail'>
          <div
            className='movie-detail-top'
            style={{
              backgroundImage: `url(
            ${data.hinhAnh}
          )`,
            }}
          ></div>
          <div className='container'>
            <div className='movie-detail-main'>
              <div className='movie-detail-left'>
                <div className='movie-detail-info'>
                  {/* Thumbnail phim */}
                  <div className='single-movie-thumb'>
                    <img
                      src={data.hinhAnh}
                      className='single-movie-image'
                      alt='single-movie-thumb'
                    />
                    <div className='single-movie-score'>{data.danhGia / 2}</div>
                    <div className='single-movie-overplay'>
                      <div className='single-movie-play'>
                        <ion-icon
                          onClick={() => {
                            dispatch(openModalTrailerAction(data.trailer));
                          }}
                          name='play-circle-outline'
                        ></ion-icon>
                      </div>
                    </div>
                  </div>
                  {/* Chi tiết phim */}
                  <div className='movie-detail-detail'>
                    <h3>Chi tiết phim</h3>
                    <p>
                      <span className='label'>Tên phim:</span>
                      <span className='movie-detail-title'>{data.tenPhim}</span>
                    </p>
                    <p>
                      <span className='label'>Ngày công chiếu:</span>
                      <span>{new Date(data.ngayKhoiChieu).toLocaleDateString("vi-VI")}</span>
                    </p>
                    <p>
                      <span className='label'>Điểm đánh giá:</span>
                      <span>{data.danhGia / 2} / 5</span>
                    </p>
                    <p>
                      <span className='label'>Đạo diễn:</span>
                      <span>Adam Wingard</span>
                    </p>
                    <p>
                      <span className='label'>Diễn viên:</span>
                      <span>Kyle Chandler, Rebecca Hall, Eiza González, Millie Bobby Brown</span>
                    </p>
                  </div>
                </div>
                {/* Tóm tắt phim */}
                <div className='movie-detail-desc'>
                  <h3>Tóm tắt phim</h3>
                  <p>{data.moTa}</p>
                </div>

                {isMobile ? <Showtime /> : <ShowtimeMobile />}

                {/* Đánh giá phim (comment) */}
                <div className='comment'>
                  <h3>Đánh giá</h3>
                  <div className='comment-list'>
                    {!loadingComment && <Comment dataComment={dataComment} />}
                  </div>
                </div>
                <AddComment />
              </div>
              {/* Phần tin tức bên phải */}
              <div className='movie-detail-right'>
                <RightSideNews />
              </div>
            </div>
          </div>
          <ModalTrailer />
        </div>
      ) : (
        <LoadingAnimation />
      )}
    </>
  );
};

// DỮ LIỆU MẪU TRẢ VỀ CỦA MOVIE DETAIL TỪ API
// {
//   "statusCode": 200,
//   "message": "Xử lý thành công!",
//   "content": {
//     "maPhim": 8189,
//     "tenPhim": "Lừa đểu gặp lừa đảo 3",
//     "biDanh": "lua-deu-gap-lua-dao-3",
//     "trailer": "https://www.youtube.com/embed/T36HGZagV5w",
//     "hinhAnh": "https://movienew.cybersoft.edu.vn/hinhanh/lua-deu-gap-lua-dao-3_gp13.jpg",
//     "moTa": "Lừa Đểu Gặp Lừa Đảo xoay quanh lần gặp gỡ oan gia giữa siêu lừa đảo Tower cùng cô nàng bị lừa tình Ina, cả 2 sẽ cùng hợp tác trong phi vụ lừa lại tên lừa đểu Petch - tên bạn trai bội bạc của Ina bằng những chiêu trò lừa đảo không hồi kết.",
//     "maNhom": "GP13",
//     "hot": false,
//     "dangChieu": true,
//     "sapChieu": false,
//     "ngayKhoiChieu": "2021-09-10T00:00:00",
//     "danhGia": 10
//   },
//   "dateTime": "2022-03-31T17:33:55.2292515+07:00",
//   "messageConstants": null
// }
