import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import { sendVerificationEmail } from '../services/emailService.js';
import jwt from 'jsonwebtoken';

import { TOKEN_SECRET } from '../config.js';

export const register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10); // bcrypt.hash devuelve el el dato hasheado

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      validEmail: false,
    });

    const token = await createAccessToken({ email });
    await sendVerificationEmail(email, token);

    const userSaved = await newUser.save();

    res.status(201).json({
      message: 'Usuario registrado. Por favor, verifica tu correo electrónico.',
    });
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
    const decoded = jwt.verify(token, TOKEN_SECRET); // Usa la misma clave secreta utilizada para generar el token
    const userEmail = decoded.email;

    // buscar por email y actualizar el campo validEmail
    const user = await User.findOneAndUpdate(
      { email: userEmail }, // Criterio de búsqueda
      { validEmail: true }, // Campo a actualizar
      { new: true } // Opciones: `new: true` devuelve el documento actualizado
    );

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
    const userFound = await User.findOne({ email });
    const info = await User.findOne({ email }).select('validEmail');

    if (!userFound) {
      return res.status(400).json({ menssage: 'usuario no encontrado' });
    }

    if (!info.validEmail) {
      return res.status(400).json({ menssage: 'email no validado' });
    }

    const isMatch = await bcrypt.compare(password, userFound.password); //bcrypt.compare devuleve un booleano

    if (!isMatch)
      return res.status(400).json({ message: 'Credenciales invalidas' });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie('token', token, {
      httpOnly: true, // Si es necesario, para mayor seguridad
      // secure: true, // Requiere HTTPS
      sameSite: 'None', // Permite el uso de cookies entre sitios
      // maxAge: 24 * 60 * 60 * 1000, // Duración de la cookie (opcional)
    });

    res.json({
      // id: userFound._id,
      email: userFound.email,
      username: userFound.username,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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

export const logout = (req, res) => {
  res.cookie('token', '', { expires: new Date(0) });

  return res.sendStatus(200);
};
