const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const userSchema = mongoose.Schema({
    avatar_url: {
        type: String,
        default: 'link do zwyklego zdjecia'
    },
    first_name: {
        type: String,
        required: [true, "Proszę podać imię!"]
    },
    last_name: {
        type: String,
        required: [true, "Proszę podać nazwisko!"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Proszę podać email!"]
    },
    password: {
        type: String,
        required: [true, "Proszę podać swoję hasło!"]
    },
    isProfessional: {
        type: Boolean,
        default: false,
        required: [true, "Proszę uwzględnić swoją rolę!"]
    },
    role: {
        type: String,
        default: 'Member'
    },
    city: {
        type: String,
        required: [true, "Proszę podać miejscowość zamieszkania!"]
    },
    street: {
        type: String,
        required: [true, "Proszę podać adres z numerem domu/mieszkania!"]
    },
    voivodeship: {
        type: String,
        required: [true, "Proszę podać województwo!"]
    },
    phone_number: {
        type: String,
        //default: '997997997',
        required: [true, "Proszę podać swój numer telefonu!"]
    },
    date_birth: {
        type: Date,
        required: [true, "Proszę podać datę urodzenia!"]
    },
    profession: {
        type: String,
        default: 'none',
        //required: [true, "Proszę podać swoją profesję!"]
    },
    rates: {
        type: Number,
        default: 0
    },
    finished_work: [
        {
            title: {
                type: String,
                required: true
            },
            desc: {
                type: String,
                required: true
            },
            photos: [
                {
                    url: {
                        type: String
                    }
                }
            ]
        }
    ],
    reviews: [
        {
            id_commentator: {
                type: String,
            },
            opinion: {
                type: Number,
            },
            review: {
                type: String
            },
            imgs: [
                {
                    url: {
                        type: String
                    }
                }
            ]
        }
    ],
    created_date: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.pre("save", async function(next) {
    const user = this;
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        isProfessional: user.isProfessional,
        role: user.role
    }, config.JWT_PASS);
    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if(!user) {
        throw new Error({error: "Błędne dane do logowania!"});
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if(!isPasswordMatch) {
        throw new Error({error: "Błędne dane do logowania!"});
    }
    return user;
};

const User = mongoose.model("User", userSchema);
module.exports = User;