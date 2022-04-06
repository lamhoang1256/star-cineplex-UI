import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout/AdminLayout";
import { AuthLayout } from "./layouts/AuthLayout/AuthLayout";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { HomePage } from "./pages/HomePage/HomePage";
import { MovieDetail } from "./pages/MovieDetail/MovieDetail";
import { UserInfo } from "./pages/UserInfo/UserInfo";
import { NewsDetail } from "./pages/NewsDetail/NewsDetail";
import { MovieBooking } from "./pages/MovieBooking/MovieBooking";
import { Login } from "./pages/Login/Login";
import { Register } from "pages/Register/Register";
import { NotFound } from "./pages/NotFound/NotFound";
// style css
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "antd/dist/antd.css";
import "./assets/scss/app.scss";

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Layout */}
        <Route path='/' element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path='/detail/:id' element={<MovieDetail />} />
          <Route path='/user' element={<UserInfo />} />
          <Route path='/news/:id' element={<NewsDetail />} />
          <Route path='/booking/' element={<MovieBooking />} />
        </Route>
        {/* Admin Layout */}
        <Route path='/admin' element={<AdminLayout />}></Route>
        {/* Auth Layout */}
        <Route path='/auth' element={<AuthLayout />}>
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
        </Route>
        {/* Not Found 404 */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
