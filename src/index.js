import app from './app.js';
import { connectDB } from './db.js';

//corriendo el servidor express

app.listen(4000);

console.log('server on port', 4000);

//ejecutando BD

connectDB();
