import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const verifyToken = async (req, res, next) => {
  //read token from request
  let token = req.cookies.token; 
  // console.log("token :", token);
  if (token===undefined) {
    return res.status(400).json({ message: "Unauthorized req. PLz login" });
  }
  //verify & validate
  let decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  //forward req to nxt middleware / route
  next();
};