const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

exports.signup = async (req, res) => {
    try {
        const { name, userId, password, check_password } = req.body;
        const isExisUser = await prisma.Users.findFirst({ where: { userId } });

        if(isExisUser) {
            return res.status(409).json({
                message: '이미 존재하는 아이디 입니다.'
            })
        }
        if(!name && !userId && !password) {
            return res.status(410).json({
                message: '모든 정보를 입력해주세요!'
            })
        } else if(password === check_password && password < 6) {
            return res.status(409).json({
                message: '비밀번호가 6자 이상이여야 하고 재입력과 같아야 합니다.'
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const date = new Date().getDate();
        const hour = new Date().getHours();
        const minutes = new Date().getMinutes();

        const formateDate = year + '년' + month + '월' + date + '일' + hour + "시" + minutes + "분";
        
        await prisma.Users.create({
            data: {
                name,
                userId,
                password : hashedPassword,
                createAt : formateDate
            }
        })
        res.status(200).json({
            status: 200,
            message: '회원가입에 성공하였습니다.'
        })
    } catch (error) {
        res.send(error)
        console.log(error)
    }
};

exports.login = async (req, res) => {
    try {
        const { userId, password } = req.body;
        if(!userId) {
            res.status(410).json({
                message: '아이디를 입력해주세요.'
            })
        }
        if(!password) {
            res.status(409).json({
                message: '패스워드를 입력해주세요.'
            })
        }
        const id = await prisma.Users.findFirst({
            where : {
                userId : userId
            }
        })
        if(!id) {
            res.status(404).json({
                message: '사용자의 정보가 존재하지 않습니다.'
            })
        }
        const isPasswordMatched = await bcrypt.compare(password, id.password);
        if (!isPasswordMatched) {
            res.status(403).send('비밀번호가 일치하지 않습니다.');
            return;
        }
        const accessToken = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    } catch (error) {
        res.send(error)
        console.log(error)
    }
};