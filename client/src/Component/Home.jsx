import React from "react";
import Topbar from "../Compo/Topbar";
import { useSelector } from "react-redux";
import ProfileCard from "../Compo/ProfileCard";
import FriendsCard from "../Compo/FriendsCard";
import { useForm } from "react-hook-form";
import { BsFiletypeGif, BsPersonFillAdd } from "react-icons/bs";
import { BiImages, BiSolidVideo } from "react-icons/bi";
import { useState } from "react";
import Loading from "../Compo/Loading";
function Home() {
  const { user, edit } = useSelector((state) => state.user);
  const requests = user?.friendrequests;
  console.log("kya ahi bhai" + requests);

  const [friendRequest, setFriendRequest] = useState(requests);
  //const [suggestedFriends, setSuggestedFriends] = useState(suggest);
  const [file, setFile] = useState(null);
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log("hmare pyaare user hain" + JSON.stringify(user));
  const [errMsg, setErrMsg] = React.useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePostSubmit = async (data) => {};

  return (
    <>
      <Topbar />
      <div className="w-full flex gap-2 lg:gap-4 pt-5 pb-10 h-full">
        {/* LEFT */}
        <div className="hidden w-1/3 lg:w-1/4 h-full md:flex flex-col gap-6 overflow-y-auto">
          <ProfileCard user={user} />
          <FriendsCard friends={user?.friends} />
        </div>
        <div className="flex-1 h-full px-4 flex flex-col gap-6 overflow-y-auto rounded-lg">
          <form
            onSubmit={handleSubmit(handlePostSubmit)}
            className="bg-primary px-4 rounded-lg"
          >
            <div className="w-full flex items-center gap-2 py-4 border-b border-[#66666645]">
              <img
                src={
                  user?.profileUrl ??
                  "https://www.google.com/imgres?q=user%20image%20address&imgurl=https%3A%2F%2Fa0.anyrgb.com%2Fpngimg%2F1980%2F1942%2Fpessoa-brussel-address-icon-user-profile-windows-10-login-avatar-person-user-icons.png&imgrefurl=https%3A%2F%2Fwww.anyrgb.com%2Fen-clipart-ouvef&docid=ND3Ocjz3ZTSijM&tbnid=7I9vVlidmLxC-M&vet=12ahUKEwi869yW_KKGAxURVWwGHbvlDfwQM3oECH8QAA..i&w=512&h=512&hcb=2&ved=2ahUKEwi869yW_KKGAxURVWwGHbvlDfwQM3oECH8QAA"
                }
                alt="User Image"
                className="w-14 h-14 rounded-full object-cover"
              />
              <input
                className="w-full rounded-full py-5"
                placeholder="What's on your mind...."
                name="description"
                register={register("description", {
                  required: "Write something about post",
                })}
                error={errors.description ? errors.description.message : ""}
              />
            </div>
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

            <div className="flex items-center justify-between py-4">
              <label
                htmlFor="imgUpload"
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="imgUpload"
                  data-max-size="5120"
                  accept=".jpg, .png, .jpeg"
                />
                <BiImages />
                <span>Image</span>
              </label>

              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                htmlFor="videoUpload"
              >
                <input
                  type="file"
                  data-max-size="5120"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="videoUpload"
                  accept=".mp4, .wav"
                />
                <BiSolidVideo />
                <span>Video</span>
              </label>

              <label
                className="flex items-center gap-1 text-base text-ascent-2 hover:text-ascent-1 cursor-pointer"
                htmlFor="vgifUpload"
              >
                <input
                  type="file"
                  data-max-size="5120"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="vgifUpload"
                  accept=".gif"
                />
                <BsFiletypeGif />
                <span>Gif</span>
              </label>

              <div>
                {posting ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    title="Post"
                    className="bg-[#0444a4] text-white py-1 px-6 rounded-full font-semibold text-sm"
                  />
                )}
              </div>
            </div>
          </form>

          {/* {loading ? (
            <Loading />
          ) : posts?.length > 0 ? (
            posts?.map((post) => (
              <PostCard
                key={post?._id}
                post={post}
                user={user}
                deletePost={() => {}}
                likePost={() => {}}
              />
            ))
          ) : (
            <div className="flex w-full h-full items-center justify-center">
              <p className="text-lg text-ascent-2">No Post Available</p>
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}

export default Home;
