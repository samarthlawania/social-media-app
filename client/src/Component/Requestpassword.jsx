import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Compo/Loading";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Resetpassword = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,

    formState: { errors },
  } = useForm({
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/user/request-password-reset",
        data
      );
      console.log(response.data);
      if (response.data) {
        console.log("pta nhi");
        const { userId, token } = response.data;
        console.log("sc" + response.data.userId);
        const encodedUserId = encodeURIComponent(userId);
        const encodedToken = encodeURIComponent(token);
        navigate(`/reset-password/${encodedUserId}/${encodedToken}`);
      }
    } catch (error) {
      console.log("request mein hai password k email wala" + error);
    }
  };

  return (
    <div className="dark:bg-gradient-to-l from-gray-900 to-gray-600 flex justify-center items-center w-screen h-screen p-5">
      <div className="bg-primary w-full md:w-1/3 2xl:w-1/4 px-6 py-8 shadow-md rounded-lg">
        <p className="text-ascent-1 text-lg font-semibold">Email Address</p>

        <span className="text-sm text-ascent-2">
          Enter email address used during registration
        </span>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="py-4 flex flex-col gap-5"
        >
          <input
            className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
            id="email"
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email Address is required",
            })}
          />
          {errMsg?.message && (
            <span
              role="alert"
              className={`text-sm ${
                errMsg?.status === "failed"
                  ? "text-[#f64949fe]"
                  : "text-[#2ba150fe]"
              } mt-0.5`}
            >
              {errMsg?.message}
            </span>
          )}

          {isSubmitting ? (
            <Loading />
          ) : (
            <button
              className="bg-green-500 hover:bg-green-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-green-600"
              type="submit"
            >
              Request for password reset
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
