import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  let token;

  // 1. check token từ cookie
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. check token từ header Authorization
  if (!token && req.headers.authorization) {
    // Bearer <token>console.log("Token headers.authorization:", token);
    token = req.headers.authorization.split(" ")[1];

    console.log("Token headers.authorization:", token);
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided, access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};
