const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },

    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number
    }
})

// save 하기 전에 
UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err)

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

UserSchema.methods.comparePassword = function(plainPassword, cb){

    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
            cb(null, isMatch)
    })
}

// 스키마를 모델로 감아서 반환
const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}