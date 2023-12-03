const express = require('express')
const app = express()
const port = 5000
const bodyPaser = require('body-parser');
const {
    User
} = require('./models/User');
const config = require('./config/key')
const st = require('./config/dev')
const cookieParser = require('cookie-parser')
const { auth } = require('./middleware/auth')

app.use(bodyPaser.urlencoded({
    extended: true
}));
app.use(bodyPaser.json());
app.use(cookieParser());
// const mongoose = require('mongoose')
// mongoose
//     .connect(config.mongoURI)
//     .then(()=> console.log('MongoDB Connected !!'))
//     .catch(err => console.log(err))

const mongoose = require('mongoose')
mongoose.connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('Hello Woaxzcdzxfgsdrld!')
    const user = new User
    user.hello()
})

app.post('/api/users/register', async (req, res) => {
    const user = new User(req.body)
    // 저장 성공, 실패 시 동작
    const result = await user.save().then(() => {
        console.log(req.body.email + '회원님의 가입이 완료되었습니다.')
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        console.log(err)
        res.json({
            success: false
        })
    })
})

app.post('/api/users/login', (req, res) => {
    
    // 전달받은 email이 DB에 있는지 확인
    User.findOne({
        email: req.body.email
    }, (err, user) => {
        // 이메일을 찾을 수 없다면 
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: "전송한 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 이메일이 찾아졌으면, 패스워드 검증
        user.comparePassword(req.body.password, isMatch => {
            if (!isMatch)
                return res.json({
                    loginSuccess: false,
                    message: "비번 틀림"
                })

            // 비밀번호가 맞을 시 토큰 생성
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);

                // 토큰 저장 : 쿠키 | 로컬 스토리지
                console.log(req.body.email + '회원님이 로그인 하였습니다.')
                res.cookie("x_auth", user.token)
                    .status(200).json({
                        loginSuccess: true,
                        userId: user._id
                    })
            })
        })


    })
})


// role 1 : 관리부 role 2 : 영업부 ..
// role 0 : 일반유저 role 1 : 관리자

app.get('/api/users/auth', auth , (req,res) =>{
    
    // auth 미들웨어가 trur 일 시 결과 반환
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.body.email,
        name: req.body.name,
        lastname: req.body.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth, (req, res) => {

    console.log('req.user._id 출력 ' + req.user._id)
    User.findOneAndUpdate({_id: req.user._id}, { token: ""}, (err, user) =>{
        if(err) return res.json({success: false, err});

        console.log(req.user._id + '회원님이 로그아웃 했습니다.')
        return res.status(200).send({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})