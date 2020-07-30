const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config');

// Routers
const UserRouter = require('./routes/UserRoute');

mongoose.connect(config.DB_STRING,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('MongoDB connected!'))
    .catch(err => console.log(err));
//DO ZASTAPIENIA. NA RAZIE DZIALA, POZNIEJ MOZE NIE! PLIK: UserController resendVerifyCode
mongoose.set('useFindAndModify', false);

app.use(cors());
app.use(express.json({urlencoded:false}));
const PORT = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send({elo: 'elo'});
});

app.use('/api/user', UserRouter);

app.listen(PORT, console.log(`App is listening on port: ${PORT}`));