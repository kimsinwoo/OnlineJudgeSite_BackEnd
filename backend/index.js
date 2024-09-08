const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
require('dotenv').config()

app.use(express.json())

app.use('/auth', authRoutes)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`)
})