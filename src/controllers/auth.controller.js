import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import {
  generateVerificationToken,
  sendVerificationEmail,
} from '../services/emailService.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    //   User.create({  }) // -> una manera para crear usuarios en mongoDB

    const passwordHash = await bcrypt.hash(password, 10); // bcrypt.hash devuelve el el dato hasheado

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      validEmail: false,
    });

    const userSaved = await newUser.save();

    const verificationToken = generateVerificationToken(userSaved);

    await sendVerificationEmail(userSaved.email, verificationToken);
    res.status(201).json({
      message: 'Usuario registrado. Por favor, verifica tu correo electrónico.',
    });

    // const token = await createAccessToken({ id: userSaved._id });

    // res.cookie('token', token);

    // res.json({
    //   id: userSaved._id,
    //   email: userSaved.email,
    // });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const token = req.query.token;

  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta'); // Usa la misma clave secreta utilizada para generar el token
    const userId = decoded.id;

    // Buscar el usuario por su ID y marcarlo como verificado
    const user = await User.findByIdAndUpdate(userId, { validEmail: true });

    if (!user) {
      return res.status(400).json({ error: 'Invalid token or user not found' });
    }

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Invalid or expired token' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const info = await User.findOne({ email }).select('validEmail');

    console.log(typeof info.validEmail);

    if (!info.validEmail) {
      return res.status(400).json({ menssage: 'email no validado' });
    }
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
