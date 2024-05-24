import React from "react";
import { Link } from "react-router-dom";

const FriendsCard = ({ friends }) => {
  return (
    <div>
      <div className="w-full bg-primary shadow-sm rounded-lg px-6 py-5">
        <div className="flex items-center justify-between text-ascent-1 pb-2 border-b border-[#66666645]">
          <span> Friends</span>
          <span>{friends?.length}</span>
        </div>

        <div className="w-full flex flex-col gap-4 pt-4">
          {friends?.map((friend) => (
            <Link
              to={"/profile/" + friend?._id}
              key={friend?._id}
              className="w-full flex gap-4 items-center cursor-pointer"
            >
              <img
                src={
                  friend?.profileURL ??
                  "https://www.google.com/imgres?q=user%20image%20address&imgurl=https%3A%2F%2Fa0.anyrgb.com%2Fpngimg%2F1980%2F1942%2Fpessoa-brussel-address-icon-user-profile-windows-10-login-avatar-person-user-icons.png&imgrefurl=https%3A%2F%2Fwww.anyrgb.com%2Fen-clipart-ouvef&docid=ND3Ocjz3ZTSijM&tbnid=7I9vVlidmLxC-M&vet=12ahUKEwi869yW_KKGAxURVWwGHbvlDfwQM3oECH8QAA..i&w=512&h=512&hcb=2&ved=2ahUKEwi869yW_KKGAxURVWwGHbvlDfwQM3oECH8QAA"
                }
                alt={friend?.firstName}
                className="w-20 h-20 object-cover rounded-full"
              />
              <div className="flex-1">
                <p className="text-base font-medium text-ascent-1">
                  {friend?.firstName} {friend?.lastName}
                </p>
                <span className="text-sm text-ascent-2">
                  {friend?.profession ?? "No Profession"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsCard;
