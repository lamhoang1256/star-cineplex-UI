import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { DatePicker, Modal, Table } from "antd";
import { sweetAlert } from "utilities/sweetAlert";
import { moviesApi } from "apis/moviesApi";
import { createKeyForObj } from "utilities/createKeyForObject";
import "./cinemaGroup.scss";

const CinemaGroup = () => {
  const { cinemaSystem, cinemaName } = useParams(); // cgv/cgv-hoang-van-thu
  const [isLoading, setIsLoading] = useState(true);

  const [movieList, setMovieList] = useState([]);
  const [cinemaGroup, setCinemaGroup] = useState([]);
  const [idCinema, setIdCinema] = useState("");
  const [cinemaInfo, setCinemaInfo] = useState({});

  // dropdown select film
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [selectedFilm, setSelectedFilm] = useState({ tenPhim: "" });

  const [filmOpenday, setFilmOpenday] = useState("");
  const [filmOpendayTime, setFilmOpendayTime] = useState("");
  const [priceTicket, setPriceTicket] = useState("");

  const onShowModal = (idCinema) => {
    setIdCinema(idCinema);
    setIsModalVisible(true);
  };
  const onCancelModal = () => {
    setIsModalVisible(false);
  };

  const handleGetFilm = (filmSelected) => {
    setSelectedFilm(filmSelected);
  };

  const onChangeDatePicker = (date) => {
    if (!date) {
      setFilmOpenday("");
      return;
    }
    setFilmOpenday(moment(date).format("DD/MM/YYYY"));
  };
  const onChangeTimePicker = (time) => {
    if (!time) {
      setFilmOpendayTime("");
      return;
    }
    setFilmOpendayTime(moment(time).format("hh:mm:ss"));
  };

  const handleAddShowtime = () => {
    if (!selectedFilm.maPhim || !filmOpenday || !filmOpendayTime || !priceTicket) {
      sweetAlert("error", "Thêm lịch chiếu thất bại!", "Vui lòng nhập đủ trường dữ liệu");
      return;
    }
    const requestAddShowtime = {
      maPhim: selectedFilm.maPhim,
      ngayChieuGioChieu: `${filmOpenday} ${filmOpendayTime}`,
      maRap: cinemaName,
      giaVe: priceTicket,
    };
    (async () => {
      try {
        const response = await moviesApi.createShowtime(requestAddShowtime);
        if (response) {
          sweetAlert(
            "success",
            "Thêm lịch chiếu thành công!",
            "Bạn đã thêm mới lịch chiếu thành công"
          );
        }
      } catch (error) {
        sweetAlert("error", "Thêm lịch chiếu thất bại!", error?.response?.data?.content);
      }
    })();
  };

  const columns = [
    {
      title: "Mã rạp",
      dataIndex: "maRap",
      key: "maRap",
    },
    {
      title: "Tên rạp",
      dataIndex: "tenRap",
      key: "tenRap",
    },
    {
      title: "Action",
      dataIndex: "maRap",
      key: "action",
      render: (maRap) => <button onClick={() => onShowModal(maRap)}>Thêm lịch chiếu</button>,
    },
  ];

  useEffect(() => {
    const fetchCinemaGroup = async () => {
      setIsLoading(true);
      try {
        // Eg: get all cinema cgv -> cgv-vincom-thu-duc, cgv-vivocity, ...
        const { data } = await moviesApi.getCinemaGroupApi(cinemaSystem);
        const cinemaList = createKeyForObj(data.content);
        // get cinema has name same cinemaName in url
        const cinema = cinemaList.filter((cinema) => cinema.maCumRap == cinemaName);
        const { danhSachRap, ...infoCinema } = cinema[0];
        setCinemaInfo(infoCinema);
        const cinemaHasKey = createKeyForObj(danhSachRap);
        setCinemaGroup(cinemaHasKey);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };
    fetchCinemaGroup();
  }, []);

  useEffect(() => {
    const fetchMovieList = async () => {
      try {
        const { data } = await moviesApi.getMovieListApi("01");
        setMovieList(data.content);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMovieList();
  }, []);

  useEffect(() => {
    setSelectedFilm({ tenPhim: "" });
  }, [movieList]);

  return (
    <>
      {isLoading && "Loading"}
      {!isLoading && (
        <>
          <h2>{cinemaInfo?.tenCumRap}</h2>
          <p>{cinemaInfo?.diaChi}</p>
          <Table columns={columns} dataSource={cinemaGroup} />
          <Modal
            title='Basic Modal'
            visible={isModalVisible}
            onCancel={onCancelModal}
            footer={null}
          >
            <h3>Chọn phim:</h3>
            <div className='filter-menu'>
              <div
                className='filter-select'
                onClick={(e) => {
                  setVisibility(!visibility);
                  e.currentTarget.children[0].children[1].innerHTML = visibility
                    ? "arrow_drop_down"
                    : "arrow_drop_up";
                }}
              >
                <div className='filter-selected-option'>
                  <span title={selectedFilm.tenPhim === "" ? "Chọn Phim" : selectedFilm.tenPhim}>
                    {selectedFilm.tenPhim === "" ? "Chọn Phim" : selectedFilm.tenPhim}
                  </span>
                  <ion-icon name='caret-down-outline'></ion-icon>
                </div>

                {visibility && (
                  <div className='filter-options'>
                    {movieList.length > 0 ? (
                      <ul>
                        {movieList.map((cinema, id) => (
                          <li
                            key={id}
                            className={selectedFilm === cinema ? "active-option" : null}
                            onClick={() => handleGetFilm(cinema)}
                          >
                            <img src={cinema.hinhAnh} className='cinema-group-thumb' alt='' />
                            <p>{cinema.tenPhim}</p>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <ul>
                        <li>Vui lòng chọn phim</li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className='cinema-group-list'>
              <CinemaGroupField label='Chọn ngày'>
                <DatePicker onChange={onChangeDatePicker} format='DD/MM/YYYY' />
              </CinemaGroupField>

              <CinemaGroupField label='Chọn giờ khởi chiếu'>
                <DatePicker picker='time' onChange={onChangeTimePicker} />
              </CinemaGroupField>

              <CinemaGroupField label='Giá vé'>
                <input
                  type='number'
                  placeholder='Nhập giá vé'
                  className='cinema-group-price'
                  onChange={(e) => setPriceTicket(e.target.value)}
                />
              </CinemaGroupField>

              <CinemaGroupField label='Mã rạp'>
                <p>{idCinema}</p>
              </CinemaGroupField>
            </div>
            <button className='btn btn--primary' onClick={handleAddShowtime}>
              Thêm lịch chiếu
            </button>
          </Modal>
        </>
      )}
    </>
  );
};
export default CinemaGroup;

const CinemaGroupField = ({ label, children }) => (
  <div className='cinema-group-field'>
    <h3>{label}:</h3>
    {children}
  </div>
);