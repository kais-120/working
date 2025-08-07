require("dotenv").config();
require("colors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const server = require('./server');
const AuthenticateAPI = require("./middleware/AuthenticateAPI");
const sequelize = require("./config/db");
require("./models/index")
const { Server } = require("socket.io")
const http = require("http")
require("./cron/newsExpire");


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// database
sequelize.sync({alter:true});

sequelize.authenticate()
  .then(() => console.log("MySQL Connected"))
  .catch(err => console.error("DB Error:", err));

  // cors Middlewares
app.use(express.json());
app.use(cors());

// real time
const serverSide = http.createServer(app)
const io = new Server(serverSide,{
  cors:{
    origin:"https://working-frontend-cyan.vercel.app",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling']
});
app.set("io",io)
io.on('connection', (socket) => {
  console.log('🟢 a user connected: ' + socket.id.green.bold);

  socket.on('disconnect', () => {
    console.log('🔴 user disconnected: ' + socket.id.red.bold);
  });
  socket.on("join-room",(userId)=>{
    socket.join(userId.toString());
  })
});

// === Declaration  routes ===
app.use("/api/v1",AuthenticateAPI,server)

// === Lancement du serveur ===
serverSide.listen(PORT ,() => {
  console.log(`Serveur démarré sur le port ${PORT}`.green.bold);
});
module.exports = app;