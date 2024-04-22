import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authorize = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Not Authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;

    next();
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export default authorize;
