const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10;
const jwt = require('jsonwebtoken')

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

    // 패스워드가 변경되면
    if (user.isModified('password')) {

        // 해시화
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

/*
 * 비밀번호가 같은지 판단하는 메서드. 평문과 암호문 비교
 * req.body.password, (err, isMatch)
 * isMatch 부분에 trur, false가 리턴됨
 */

UserSchema.methods.comparePassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err)
        cb(isMatch)
    })
}

UserSchema.methods.generateToken = function(cb){

    var user = this;
    // jsonwebtoken을 이용하여 token 생성
    // user._id + secretToken = token)
    var token = jwt.sign(user._id.toHexString(), 'secretToken')  
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
}

UserSchema.statics.findByToken = function(token, cb){
    var user = this;

    jwt.verify(token, 'secretToken', function(err, decoded){
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })
}

UserSchema.methods.hello = function(cb){

    console.log('hello world!')
}

// 스키마를 모델로 감아서 반환
const User = mongoose.model('User', UserSchema)

module.exports = {
    User
}