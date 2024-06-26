import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    //   User.create({  }) // -> una manera para crear usuarios en mongoDB

    const passwordHash = await bcrypt.hash(password, 10); // bcrypt.hash devuelve el el dato hasheado

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });

    res.cookie('token', token);

    res.json({
      id: userSaved._id,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });

    if (!userFound) {
      return res.status(400).json({ menssage: 'usuario no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, userFound.password); //bcrypt.compare devuleve un booleano

    if (!isMatch)
      return res.status(400).json({ message: 'Credenciales invalidas' });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie('token', token);

    res.json({
      id: userFound._id,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });

  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound) return res.status(400).json({ message: 'User not found' });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  });
};
