import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const headerNav = [
  { display: "Lịch chiếu", path: "showtime" },
  { display: "Tin tức", path: "article" },
  { display: "Cụm rạp", path: "/" },
  { display: "Ứng dụng", path: "/" },
];

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // handle when click link on header navbar
  const onClickLink = async (id) => {
    if (location.pathname === "/") {
      scroller.scrollTo(id, {
        duration: 800,
        smooth: "easeInOutQuart",
      });
    } else {
      await navigate("/");
      setTimeout(() => {
        scroller.scrollTo(id, {
          duration: 800,
          smooth: "easeInOutQuart",
        });
      }, 600);
    }
  };

  const [isShowMenu, setIsShowMenu] = useState(false);
  const handleToggleMenu = () => {
    setIsShowMenu(!isShowMenu);
  };

  // change background Navbar from Transparent to White when scroll > 10
  const [isWhiteNav, setIsWhiteNav] = useState(false);
  const listenScrollEvent = () => {
    window.scrollY > 10 ? setIsWhiteNav(true) : setIsWhiteNav(false);
  };
  useEffect(() => {
    window.addEventListener("scroll", listenScrollEvent);
    return () => {
      window.removeEventListener("scroll", listenScrollEvent);
    };
  }, []);

  return (
    <header className={`header ${isWhiteNav ? "header--white" : ""}`}>
      <div className="header-container">
        <div className="container">
          <div className="header-top">
            <Link to="/" className="header-logo">
              <img
                src={`${process.env.REACT_APP_PUBLIC}/assets/images/chore/logo-star-cineplex.png`}
                alt="header-logo"
              />
            </Link>
            <div className={`header-action ${isShowMenu ? "is-show" : ""}`}>
              <ul className="navbar">
                {headerNav.map((item, index) => (
                  <li className="navbar-item" key={index}>
                    <span className="navbar-link" onClick={() => onClickLink(item.path)}>
                      {item.display}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="header-auth">
                <Link to="/auth/register">
                  <button className="header-register btn btn-secondary">Đăng ký</button>
                </Link>
                <Link to="/auth/login">
                  <button className="header-login btn btn--primary">Đăng nhập</button>
                </Link>
              </div>

              <div className="header-close" onClick={handleToggleMenu}>
                <ion-icon name="close-outline"></ion-icon>
              </div>
            </div>
            {/* navbar mobile open menu */}
            <div className="header-open" onClick={handleToggleMenu}>
              <ion-icon name="list-outline"></ion-icon>
            </div>
          </div>
        </div>
      </div>
      {/* overplay when open menu in table + mobile */}
      {isShowMenu && <div className="header-overplay" onClick={handleToggleMenu}></div>}
    </header>
  );
};

export default Header;
