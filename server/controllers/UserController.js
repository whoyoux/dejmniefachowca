const User = require("../schema/userSchema");
const ConfirmToken = require("../schema/confirmTokenSchema");
const config = require("../config/config");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

exports.registerNewUser = async (req, res) => {
  try {
    let users_with_same_email = await User.find({ email: req.body.email });
    if (users_with_same_email.length >= 1) {
      return res.status(409).json({
        message: "Jest już konto z tym adresem email!",
      });
    }
    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      isProfessional: req.body.isProfessional,
      profession: req.body.profession,
      phone_number: req.body.phone_number,
      city: req.body.city,
      street: req.body.street,
      voivodeship: req.body.voivodeship,
      date_birth: req.body.date_birth,
    });
    let data = await user.save();
    const token = await user.generateAuthToken();

    const confirmAccountToken = new ConfirmToken({
      _userId: data._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await confirmAccountToken.save();
    const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
    const mailOptions = {
      from: config.EMAIL_AUTH.auth.user,
      to: user.email,
      subject: "dejmniefachowca.pl - Weryfikacja konta",
      text: `siema, masz tu link: \nhttp://localhost:8080/confirm/${confirmAccountToken.token}`,
    };
    let info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);

    res.status(201).json({ data, token });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findByCredentials(email, password);
    if (!user) {
      return res
        .status(401)
        .json({ error: "Nie udało się zalogować! Sprawdź dane do logowania!" });
    }
    const token = await user.generateAuthToken();
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(400).json({ err: err });
  }
};

exports.getUserDetails = async (req, res) => {
  console.log(req.userData);
  await res.json(req.userData);
};

exports.getSpecificUser = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.params.id });
    const userToSend = {
      _id: user._id,
      avatar_url: user.avatar_url,
      city: user.city,
      created_date: user.created_date,
      date_birth: user.date_birth,
      email: user.email,
      finished_work: user.finished_work,
      first_name: user.first_name,
      isProfessional: user.isProfessional,
      isVerified: user.isVerified,
      last_name: user.last_name,
      phone_number: user.phone_number,
      profession: user.profession,
      rates: user.rates,
      reviews: user.reviews,
      role: user.role,
      street: user.street,
      voivodeship: user.voivodeship,
    };
    res.status(200).json(userToSend);
  } catch (err) {
    res.status(200).json({ message: "Użytkownik nie został znaleziony!" });
  }
};

exports.confirmAccount = async (req, res, next) => {
  try {
    const token = await ConfirmToken.findOne({ token: req.body.confirmToken });
    try {
      const user = await User.findOne({
        _id: token._userId,
        email: req.body.email,
      });
      if (user.isVerified) {
        return res
          .status(400)
          .json({ message: "Użytkownik został juz potwierdzony!" });
      }
      user.isVerified = true;
      try {
        await user.save();
        await ConfirmToken.deleteOne({ _userId: token._userId });
        const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
        const mailOptions = {
          from: config.EMAIL_AUTH.auth.user,
          to: user.email,
          subject:
            "dejmniefachowca.pl - Weryfikacja konta przebiegła pomyślnie!",
          text: `Życzymy miłego korzystania z naszego serwisu!`,
        };
        let info = await transporter.sendMail(mailOptions);
        res
          .status(200)
          .json({
            message: `Udało się zweryfikować użytkownika: ${user.email}`,
          });
      } catch (errVerify) {
        res
          .status(500)
          .json({
            message: `Nie można było zweryfikować użytkownika! Błąd: ${errVerify.message}`,
          });
      }
    } catch (errFindUser) {
      res
        .status(500)
        .json({
          error: `Użytkownik nie został znalezniony z _id: ${token._userId} albo email: ${req.body.email}! Błąd: ${errFindUser.message}`,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Token potwierdzający nie został znalezniony!" });
  }
};

exports.resendVerifyToken = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "Użytkownik został juz potwierdzony!" });
    }
    const token = new ConfirmToken({
      _userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    try {
      const savedToken = await token.save();
      const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
      const mailOptions = {
        from: config.EMAIL_AUTH.auth.user,
        to: user.email,
        subject: "dejmniefachowca.pl - Weryfikacja konta",
        text: `siema, masz tu link: \nhttp://localhost:8080/confirm/${savedToken.token}`,
      };
      await transporter.sendMail(mailOptions);
      res
        .status(200)
        .json({
          message: `Udało się wysłać ponownie token potwiedzający konto: ${req.body.email}`,
        });
    } catch (errSaved) {
      res
        .status(500)
        .json({
          error: `Nie udało się stworzyć ponownie tokenu potwierdzającego konto ${user.email}! Błąd: ${errSaved.message}`,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({
        error: `Użytkownik nie został znaleziony! Błąd: ${err.message}`,
      });
  }
};

exports.uploadPhoto = async (req, res) => {
  if (req.file) {
    try {
      //let user = await User.findOne({_id: req.userData._id});
      //user.avatar_url = req.body.avatar_url;
      //let info = await user.save();

      let user = await User.findOneAndUpdate(
        { _id: req.userData._id },
        {
          avatar_url: req.body.avatar_url,
        }
      );
      //res.json({message: `File uploaded at: ${req.file.fieldname}`});
      res.json({ message: `File uploaded at: ${req.body.avatar_url}` });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  } else {
    res.status(400).json({ error: "Plik nie został znaleziony!" });
  }
};
