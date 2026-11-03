import  express from 'express'
import Authrouter from './routes/auth.routes.js'
import   Videoroutes from './routes/video.routes.js'




const port=process.env.PORT  ||3001
const app=express()
app.use(express.json())


app.use('/api/auth',Authrouter)
app.use('/api/videos',Videoroutes)



app.use((err, _req, res, _next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Ma'lumotlar noto'g'ri" });
  }
  console.error(err);
  res.status(500).json({ message: "Serverda xatolik" });
});



app.listen(port, () => {
  console.log(`Server: http://localhost:${port}`);
});