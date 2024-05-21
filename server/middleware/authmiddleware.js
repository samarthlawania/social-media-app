import JWT from "jsonwebtoken";

const userauth = async (req, res, next) => {
  const authheader = req?.headers?.authorization;
  if (!authheader || !authheader?.startsWith("Bearer")) {
    next("Authentication== failed");
  }

  const token = authheader.split(" ")[1];

  try {
    let usertoken = JWT.verify(token, process.env.JWT_SECRET);
    // console.log(usertoken);
    req.body.user = {
      userId: usertoken.userId,
    };

    next();
  } catch (error) {
    next("Authentication failed");
  }
};

export default userauth;
