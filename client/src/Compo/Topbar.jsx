import React from "react";
import { TbSocial } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { BsMoon, BsSunFill } from "react-icons/bs";
import { IoMdNotificationsOutline } from "react-icons/io";
import { setTheme } from "../redux/theme";
import { userlogout } from "../redux/userslice";

function Topbar() {
  const {theme} = useSelector((state) => state.theme);
  const state = useSelector((state) => state.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    dispatch({ type: "SEARCH", payload: data });
  };

  const handleTheme = () => {
    console.log("theme" + JSON.stringify(theme));
    const themeValue = theme.theme === "light" ? "dark" : "light";
    console.log("theme" + JSON.stringify(theme) + "asli theme" + theme.theme);
    dispatch(setTheme(themeValue));
  };

  const handleSearch = (data) => {};

  return (
    <>
      <div className="dark:bg-gradient-to-l from-gray-900 to-gray-600 topbar w-full flex items-center justify-between py-3 md:py-6 px-4 bg-primary rounded-x2">
        <Link to="/" className="flex gap-2 items-center">
          <div className="p-1 md:p-2 bg-[#da474f] rounded text-white">
            <TbSocial />
          </div>
          <span className="text-xl md:text-2xl text-[#da474f] font-semibold">
            ConnectSphere
          </span>
        </Link>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="search..."
            {...register("search")}
            className="w-[12rem] lg:w-[12rem] py-1 px-2"
          />
          <button
            type="submit"
            className="bg-[#da474f] text-white px-4 py-1 mx-3 mt-2 rounded border"
          >
            Search
          </button>
        </form>

        <div className="flex gap-4 items-center text-ascent-1 text-md md:text-xl">
          <button onClick={() => handleTheme()}>
            {theme ? <BsMoon /> : <BsSunFill />}
          </button>
          <div className="hidden lg:flex">
            <IoMdNotificationsOutline />
          </div>

          <div>
            <button
              onClick={() => dispatch(userlogout())}
              title="Log Out"
              className="bg-[#da474f] text-white text-sm text-ascent-1 px-4 md:px-6 py-0.5 md:py-2 border border-[#666] rounded-full"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Topbar;
