import "./index.css";
import { Outlet, Route, Routes, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Profile,
  Login,
  Register,
  Resetpassword,
  Verifyemail,
  Requestpassword,
  ConfirmResetpassword,
} from "./Component";

function Layout() {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();

  console.log(user);

  return user?.token ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" state={{ from: location }} replace />
  );
}

function App() {
  const theme = useSelector((state) => state.theme.theme);
  console.log("hn bhai phli phli baar" + JSON.stringify(theme));

  return (
    <div data-theme={theme} className=" w-full min-h-[100vh] ">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/user/verify/:userId/:token" element={<Verifyemail />} />
        <Route path="/request-password-reset" element={<Requestpassword />} />
        <Route
          path="/reset-password/:userId/:token"
          element={<ConfirmResetpassword />}
        />
        <Route
          path="/change-password/:userId/:token"
          element={<Resetpassword />}
        />
      </Routes>
    </div>
  );
}

export default App;
