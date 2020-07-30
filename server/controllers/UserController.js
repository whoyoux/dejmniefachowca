const User = require('../Schema/UserSchema');
const config = require('../config/config');
const nodemailer = require('nodemailer');


exports.registerNewUser = async (req,res) => {
    try{
        let users_with_same_email = await User.find({email: req.body.email});
        if(users_with_same_email.length >= 1) {
            return res.status(409).json({
                message: "Jest już konto z tym adresem email!"
            });
        }
        const user = new User({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            isProfessional: req.body.isProfessional,
            city: req.body.city,
            street: req.body.street,
            voivodeship: req.body.voivodeship,
            date_birth: req.body.date_birth,
        });
        let data = await user.save();
        const token = await user.generateAuthToken();

        res.status(201).json({data,token});
    } catch(err) {
        res.status(400).json({ err: err });
    }
};

exports.loginUser = async (req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findByCredentials(email,password);
        if(!user) {
            return res.status(401).json({error: "Nie udało się zalogować! Sprawdź dane do logowania!"});
        }
        const token = await user.generateAuthToken();
        res.status(201).json({user, token});
    } catch(err) {
        res.status(400).json({err:err});
    }
};

exports.getUserDetails = async (req,res) => {
    await res.json(req.userData);
};

exports.getSpecificUser = async (req,res) => {
    try {
        let user = await User.findOne({_id: req.params.id});
        res.status(200).json(user);
    } catch(err) {
        res.status(200).json({message: 'Użytkownik nie został znaleziony!'});
    }
    
}

exports.verifyAccount = async (req,res) => {
    try {
        let user = await User.findById(req.body.id);
        if(user.isVerified === true) {
            res.status(400).json({error: `Konto ${user.email} zostało już wcześniej potwierdzone!`});
        }
        else if(parseInt(req.body.verify_code) === parseInt(user.verify_code)) {
            await User.updateOne({_id: req.body.id}, { $set: {isVerified: true}});

            const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
            const mailOptions = {
                from: config.EMAIL_AUTH.auth.user,
                to: user.email,
                subject: 'dejmniefachowca.pl - Konto zostało potwierdzone!',
                text: `Dziękujemy ${user.first_name} za stworzenie konta w naszym serwisie! Życzymy udanych wyborów! (do zmiany na 100%)`
            };
            await transporter.sendMail(mailOptions);

            res.status(200).json({message: `Konto ${user.email} zostało właśnie potwierdzone kodem: ${user.verify_code}`});
        } else {
            res.status(400).json({error: `Konto ${user.email} nie udało się potwiedzić! Błędny kod weryfikujący!`});
        }
    } catch(err) {
        console.log(err);
        res.send(400).json(err);
    }
};

exports.resendVerifyEmail = async (req,res) => {
    try {
        let new_verify_code = Math.floor(100000 + Math.random() * 900000)
        let user = await User.findByIdAndUpdate(req.body.id, {verify_code: new_verify_code});
        const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
        const mailOptions = {
            from: config.EMAIL_AUTH.auth.user,
            to: user.email,
            subject: 'dejmniefachowca.pl - Weryfikacja konta',
            text: `siema, masz tu kodzik: ${new_verify_code}`
        };
        await transporter.sendMail(mailOptions);
        res.status(200).json({message: 'Wiadomość została wysłana!'});
    } catch(err) {
        console.log(`Nie udalo sie wyslac ponownie emaila weryfikujacego do ${req.body.id}! Blad: ${err}`);
        res.status(400).json({error: err});
    }
}