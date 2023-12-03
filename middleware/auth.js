const { User } = require('../models/User');

let auth = (req, res, next) =>{

    // 인증 처리

    // 1. 클라이언트 쿠키에서 토큰을 가져온다
    let token = req.cookie.x_auth;
    
    // 2. 토큰을 복호화 한 후 유저를 찾는다.
    User.findByToken(token, (err, user)=>{
        if(err) throw err
        if(!user) return res.json({isAuth: false, error: trur})

        req.token = token;
        req.user = user;
        next();
    })

    // 3. 유저가 있으면 인증

    // 4. 유저가 없으면 인증 No

}

module.exports = {auth};