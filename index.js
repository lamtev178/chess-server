const PORT = process.env.PORT || 3030;

const io = require("socket.io")(PORT,{
  cors: {
    origin: "https://la-chess.herokuapp.com"
    //origin: "http://localhost:3000"
  }
});
let board
let users = []
io.on('connection', (socket) => {
  socket.on("disconnect", () =>{
    users = users.filter(u => u.id !== socket.id)
    console.log("disconnect", users)
  })
  users.push({id : socket.id, color:"dark"})
  if(users.length > 1){
    users[1].color = users[0].color === "white" ? "dark" : "white"
  }
  socket.on("board", (arg) => {
    board = arg;
    socket.broadcast.emit("board", board)
  }); 
  socket.on("endOfGame", (game) => socket.broadcast.emit("game", game)); 
  if( board !== undefined ) socket.emit("firstFetch", board);
  socket.emit("get color", users.filter(u => u.id === socket.id)[0].color);
  console.log('a user connected',socket.id, users);
});