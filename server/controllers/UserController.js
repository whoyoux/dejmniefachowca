const User = require('../Schema/UserSchema');
const ConfirmToken = require('../Schema/ConfirmTokenSchema');
const config = require('../config/config');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

        const confirmAccountToken = new ConfirmToken({
            _userId: data._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        await confirmAccountToken.save();
        const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
        const mailOptions = {
            from: config.EMAIL_AUTH.auth.user,
            to: user.email,
            subject: 'dejmniefachowca.pl - Weryfikacja konta',
            text: `siema, masz tu link: \nhttp://localhost:8080/confirm/${confirmAccountToken.token}`
        };
        let info = await transporter.sendMail(mailOptions);
        console.log(`Message sent: ${info.messageId}`);

        res.status(201).json({data,token});
    } catch(err) {
        res.status(400).json({ err: err.message });
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

exports.confirmAccount = async (req, res, next) => {
    try {
        const token = await ConfirmToken.findOne({token: req.body.confirmToken});
        try {
            const user = await User.findOne({_id: token._userId, email: req.body.email});
            if(user.isVerified) {
                return res.status(400).json({message: 'Użytkownik został juz potwierdzony!'});
            }
            user.isVerified = true;
            try {
                await user.save();
                await ConfirmToken.deleteOne({_userId: token._userId});
                const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
                const mailOptions = {
                    from: config.EMAIL_AUTH.auth.user,
                    to: user.email,
                    subject: 'dejmniefachowca.pl - Weryfikacja konta przebiegła pomyślnie!',
                    text: `Życzymy miłego korzystania z naszego serwisu!`
                };
                let info = await transporter.sendMail(mailOptions);
                res.status(200).json({message: `Udało się zweryfikować użytkownika: ${user.email}`})
            } catch(errVerify) {
                res.status(500).json({message: `Nie można było zweryfikować użytkownika! Błąd: ${errVerify.message}`})
            }
            
        } catch(errFindUser) {
            res.status(500).json({error: `Użytkownik nie został znalezniony z _id: ${token._userId} albo email: ${req.body.email}! Błąd: ${errFindUser.message}`});
        }
        

    } catch(err) {
        res.status(500).json({error: 'Token potwierdzający nie został znalezniony!'});
    }
    
};

exports.resendVerifyToken = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user.isVerified) {
            return res.status(400).json({message: 'Użytkownik został juz potwierdzony!'});
        }
        const token = new ConfirmToken({
            _userId: user._id,
            token: crypto.randomBytes(16).toString('hex')
        });

        try {
            const savedToken = await token.save();
            const transporter = nodemailer.createTransport(config.EMAIL_AUTH);
                const mailOptions = {
                from: config.EMAIL_AUTH.auth.user,
                to: user.email,
                subject: 'dejmniefachowca.pl - Weryfikacja konta',
                text: `siema, masz tu link: \nhttp://localhost:8080/confirm/${savedToken.token}`
            };
            let info = await transporter.sendMail(mailOptions);
            res.status(200).json({message: `Udało się wysłać ponownie token potwiedzający konto: ${req.body.email}`})
        } catch(errSaved) {
            res.status(500).json({error: `Nie udało się stworzyć ponownie tokenu potwierdzającego konto ${user.email}! Błąd: ${errSaved.message}`})
        }
    } catch(err) {
        res.status(500).json({error: `Użytkownik nie został znaleziony! Błąd: ${err.message}`})
    }
    
};