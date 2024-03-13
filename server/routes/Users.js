import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (user) {
      return res.json({ message: 'User Aleready Exist!' });
    }
    //Hash password here
    const hashedPassword = await bcrypt.hash(password, 10);
    const NewUser = new UserModel({ username, password: hashedPassword });
    await NewUser.save();

    res.json({ message: 'User Successfully Registered' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.json({ message: "User Doesn't Exist!" });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.json({ message: 'Incorrect Password' });
  }
  const token = jwt.sign({ id: user._id }, process.env.SECRET);
  res.status(200).json({ message: 'LoggedIn', token, userId: user._id });
});
export { router as userRouter };

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, process.env.SECRET, (err) => {
      if (err) return res.sendStatus(403);
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
