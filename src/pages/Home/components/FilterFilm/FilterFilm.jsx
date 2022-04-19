import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMediaQuery } from "hooks/useMediaQuery";
//components
import { FilterMovie } from "./components/FilterMovie";
import { FilterCinema } from "./components/FilterCinema";
import { FilterOpenday } from "./components/FilterOpenday";
import { FilterShowtime } from "./components/FilterShowtime";
import "./filterFilm.scss";

export const FilterFilm = () => {
  const { idTicketRoom } = useSelector((state) => state.movieFilter);
  const isFilterVisible = useMediaQuery("(min-width:1200px)");

  return (
    <div className='filter-booking'>
      {isFilterVisible && (
        <div className='container'>
          <div className='filter-container'>
            {/* Chọn phim -> chọn rạp -> chọn ngày xem -> chọn suất chiếu */}
            <div className='filter-boxed'>
              <span className='filter-label'>Chọn phim</span>
              <FilterMovie />
            </div>
            <div className='filter-boxed'>
              <span className='filter-label'>Chọn rạp chiếu</span>
              <FilterCinema />
            </div>
            <div className='filter-boxed'>
              <span className='filter-label'>Chọn ngày xem</span>
              <FilterOpenday />
            </div>
            <div className='filter-boxed'>
              <span className='filter-label'>Chọn suất chiếu</span>
              <FilterShowtime />
            </div>
            <div className='filter-boxed'>
              {idTicketRoom ? (
                <Link to={`/booking/${idTicketRoom}`}>
                  <button className='btn btn--primary'>Đặt vé</button>
                </Link>
              ) : (
                <button className='btn'>Đặt vé</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};