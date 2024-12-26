const mongoose = require('mongoose');
const app = require('./app');
require('dotenv').config();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down');
  process.exit(1);
});

const DB = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.v38num2.mongodb.net/preparation?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLER REJECTION! Shutting down');
  server.close(() => {
    process.exit(1);
  });
});
