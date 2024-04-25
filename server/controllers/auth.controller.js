import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";

export const signup = async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(400).json({
          message: "User already exists with this email. Try signing in.",
        });
      }

      if (existingUser.username === username) {
        return res.status(400).json({
          message: "Username already taken. Try a different one.",
        });
      }
    }

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password should be of minimum 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    }).save();

    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      bio: newUser.bio,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "Wrong username or password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Wrong username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      bio: user.bio,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

export const signout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};
