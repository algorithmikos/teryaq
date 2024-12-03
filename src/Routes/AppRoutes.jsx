import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Login from "../pages/Login/Login";
import { useDispatch, useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { setLogin } from "../rtk/slices/auth-slice";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [cookies, setCookies] = useCookies("access_token");

  useEffect(() => {
    if (cookies.access_token) {
      dispatch(setLogin(true));
    } else {
      dispatch(setLogin(false));
    }
  }, []);

  return (
    <Routes>
      <Route path="/*" element={isLoggedIn ? <Sidebar /> : <Login />} />
      {/* <Route path="/*" element={<Sidebar />} /> */}
    </Routes>
  );
};

export default AppRoutes;
