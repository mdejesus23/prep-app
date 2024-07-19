const mongoose = require('mongoose');
const app = require('./app');

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const DB = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.v38num2.mongodb.net/preparation?retryWrites=true&w=majority&appName=Cluster0`;

mongoose
  .connect(DB)
  .then((con) => {
    console.log('DB connection successful!');
  })
  .catch((err) => console.log('Error conection', err));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
