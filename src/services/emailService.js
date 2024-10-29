// services/emailService.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Función para enviar el correo de validación
export const sendVerificationEmail = async (to, token) => {
  const emailUri =
    process.env.NODE_ENV === 'production'
      ? process.env.BASE_PATH_PROD
      : process.env.BASE_PATH_LOCAL;
  // Configuración del transporter para enviar correos
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Puedes cambiar a otro servicio como Outlook
    auth: {
      user: 'arteagaluis123@gmail.com',
      pass: 'exld ukor igzf apeh', // Asegúrate de utilizar una contraseña de aplicación o configuraciones adecuadas para mayor seguridad
    },
  });

  const mailOptions = {
    from: 'arteagaluis123@gmail.com',
    to: to,
    subject: 'Verifica tu dirección de correo electrónico',
    html: `
      <h1>Verificación de correo electrónico</h1>
      <p>Gracias por registrarte. Por favor, verifica tu dirección de correo electrónico haciendo clic en el enlace a continuación:</p>
      <a href="${emailUri}/verify-email/${token}">Verificar Correo Electrónico</a>
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
