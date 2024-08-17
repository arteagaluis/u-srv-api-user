// services/emailService.js
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export const generateVerificationToken = (user) => {
  const payload = { id: user._id }; // Incluye el ID del usuario en el payload
  const secret = 'tu_clave_secreta'; // Esta clave debería estar en una variable de entorno
  const options = { expiresIn: '1h' }; // El token expirará en 1 hora

  return jwt.sign(payload, secret, options);
};

// Configuración del transporter para enviar correos
const transporter = nodemailer.createTransport({
  service: 'Outlook', // Puedes cambiar a otro servicio como Outlook
  auth: {
    user: 'luigi_arteaga@hotmail.com',
    pass: 'Transistor3906!', // Asegúrate de utilizar una contraseña de aplicación o configuraciones adecuadas para mayor seguridad
  },
});

// Función para enviar el correo de validación
export const sendVerificationEmail = async (to, token) => {
  const mailOptions = {
    from: 'luigi_arteaga@hotmail.com',
    to: to,
    subject: 'Verifica tu dirección de correo electrónico',
    html: `
      <h1>Verificación de correo electrónico</h1>
      <p>Gracias por registrarte. Por favor, verifica tu dirección de correo electrónico haciendo clic en el enlace a continuación:</p>
      <a href="http://localhost:4000/verify-email/${token}">Verificar Correo Electrónico</a>
      <p>Si no solicitaste esta verificación, por favor ignora este correo.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Correo de verificación enviado a ${to}`);
  } catch (error) {
    console.error('Error enviando el correo:', error);
    throw new Error('No se pudo enviar el correo de verificación.');
  }
};
