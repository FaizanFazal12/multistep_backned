const express = require('express');
const mongoose = require('mongoose');
const formsRouter = require('./routes/forms.js');
const { MONGO_URI, PORT } = require('./config/index.js');
const errorHandler = require('./middleware/errorHandler.js');
const app = express();
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path')



app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: true })); 
app.use('/', formsRouter);


mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  console.log('Connected to Mongodb')
})
.catch((err) =>{
console.log('Error Connected to mongodb' + err)
});

app.use(errorHandler);

app.listen(PORT, () => console.log('Server running on port ' + PORT));