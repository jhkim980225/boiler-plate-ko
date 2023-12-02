const express = require('express')
const app = express()
const port = 5000
const bodyPaser = require('body-parser');
const { User } = require('./models/User');
const config = require('./config/key')
const st = require('./config/dev')

app.use(bodyPaser.urlencoded({extended: true}));
app.use(bodyPaser.json());

const mongoose = require('mongoose')
mongoose
    .connect(config.mongoURI)
    .then(()=> console.log('MongoDB Connected !!'))
    .catch(err => console.log(err))

app.get('/', (req, res) => {
  res.send('Hello Woaxzcdzxfgsdrld!')
})

    // 회원 가입 시 필요한 정보를 클라이언트에서 가져오면
    // 그 데이터를 db에 저장
    /*
        "name": "kim",
        "email": "z@navr.com..."
    */
app.post('/register',async (req,res) =>{
    const user = new User(req.body)
    const result = await user.save().then(()=>{
        res.status(200).json({
            success: true
        })
    }).catch((err)=>{
        console.log(err)
        res.json({success: false})
    })
})

app.post('/login',(req, res)=>{

    // 전달받은 email이 DB에 있는지 확인
    User.findOne({email: req.body.email}, (err, user)=>{
        // 이메일을 찾을 수 없다면 
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "전송한 이메일에 해당하는 유저가 없습니다."
            })
        }

        // 이메일이 찾아졌으면, 패스워드 검증

        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch)
                return res.json({loginSuccess: false, message: "비번 틀림"})

            user.generateToken((err, user) => {
                
            })
        })


    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})