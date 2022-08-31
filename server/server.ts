import dotenv from 'dotenv';
import mongoose from 'mongoose';
import http from 'http';
const cloudinary = require('cloudinary');

dotenv.config({ path: 'server/config/config.env' });

import app from './app';
import socket from './socket';

process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION!!! 💥');
  console.log(err.name, ': ', err.message);
  console.log(err.stack);
  console.log(`Shutting down the server due to an uncaught exception`);
  process.exit(1);
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);

socket(server);

server.listen(process.env.PORT, () =>
  console.log(
    `Listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
);

mongoose
  .connect(process.env.DB_ATLAS_URL || '')
  .then((con: any) =>
    console.log(`Connected to MongoDB Host: ${con.connection.host}...`)
  );

process.on('unhandledRejection', (err: any) => {
  console.log('UNCAUGHT REJECTION!!! 💥');
  console.log(err.name, ': ', err.message);
  console.log(err.stack);
  console.log('Shutting down server due to unhandled rejection');

  process.exit(1);
});
