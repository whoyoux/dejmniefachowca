const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/config");
// Routers
const userRouter = require("./routes/userRoute");
const reportRouter = require("./routes/reportRoute");

mongoose
  .connect(config.DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => console.log(err));
//DO ZASTAPIENIA. NA RAZIE DZIALA, POZNIEJ MOZE NIE! PLIK: UserController resendVerifyCode
mongoose.set("useFindAndModify", false);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
const PORT = process.env.PORT || 3000;

app.use("/api/user", userRouter);
app.use("/api/report", reportRouter);

app.listen(PORT, console.log(`App is listening on port: ${PORT}`));
