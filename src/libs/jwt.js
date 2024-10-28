import { TOKEN_SECRET } from '../config.js';
import jwt from 'jsonwebtoken';

export function createAccessToken(payload) {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,

      TOKEN_SECRET,
      {
        // expiresIn: '1d',
        expiresIn: '2m',
      },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
}
