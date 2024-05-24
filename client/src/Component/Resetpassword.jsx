import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Loading from "../Compo/Loading";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const Resetpassword = () => {
  const [errMsg, setErrMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { userId, token } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    mode: "onChange",
  });

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setErrMsg("");

    const encodedUserId = encodeURIComponent(userId);
    const encodedToken = encodeURIComponent(token);
    console.log(data);

    try {
      const response = await axios.post(
        `http://localhost:8000/user/change-password/${encodedUserId}/${encodedToken}`,
        data,
        userId
      );
      console.log("data", response.data);

      if (response.data) {
        navigate(`/auth/login`);
      } else {
        setErrMsg("Reset password link is invalid or expired.");
      }
    } catch (error) {
      console.error("Error fetching reset password:", error);
      setErrMsg("Failed to reset password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dark:bg-gradient-to-l from-gray-900 to-gray-600 flex justify-center items-center w-screen h-screen p-5">
      <div className="bg-white shadow-md dark:shadow-gray-600 rounded px-8 pt-6 pb-8 mb-4 flex flex-col w-full md:w-1/3 dark:bg-gray-800">
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-900 dark:text-gray-200">
          Change Password
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2"
              htmlFor="newpassword"
            >
              New Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="***********"
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                {...register("password", { required: "Password is required" })}
              />
              <div
                className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.28 5 12 5c4.72 0 8.268 2.943 9.542 7-.07.207-.07.431 0 .639C20.268 16.057 16.72 19 12 19c-4.72 0-8.268-2.943-9.542-7-.07-.208-.07-.432 0-.639z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.5c4.64 0 8.58 3.01 9.96 7.18.07.21.07.43 0 .64C20.58 16.49 16.64 19.5 12 19.5c-4.64 0-8.58-3.01-9.96-7.18-.07-.21-.07-.43 0-.64C3.42 7.51 7.36 4.5 12 4.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-400 text-sm font-bold mb-2"
              htmlFor="confirmpassword"
            >
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="confirmpassword"
                placeholder="***********"
                className="shadow appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                {...register("confirmpassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
              />
              <div
                className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-3"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.28 5 12 5c4.72 0 8.268 2.943 9.542 7-.07.207-.07.431 0 .639C20.268 16.057 16.72 19 12 19c-4.72 0-8.268-2.943-9.542-7-.07-.208-.07-.432 0-.639z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 4.5c4.64 0 8.58 3.01 9.96 7.18.07.21.07.43 0 .64C20.58 16.49 16.64 19.5 12 19.5c-4.64 0-8.58-3.01-9.96-7.18-.07-.21-.07-.43 0-.64C3.42 7.51 7.36 4.5 12 4.5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </div>
            </div>
            {errors.confirmpassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmpassword.message}
              </p>
            )}
          </div>

          <button
            className="bg-green-500 hover:bg-green-700 text-white w-full font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-green-600"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loading /> : "Change Password"}
          </button>

          {errMsg && (
            <p className="text-red-500 text-xs mt-1 text-center">{errMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Resetpassword;
