const io = require('socket.io-client');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let username;
let socket;

rl.question('What is your username? ', (answer) => {
  username = answer;
  socket = io.connect('http://localhost:3001');
  socket.emit('username', username);

  socket.on('question', (question) => {
    rl.question(question + ' ', (answer) => {
      socket.emit('answer', { username: username, answer: answer });
    });
  });

  socket.on('end', (message) => {
    console.log(message);
    rl.close();
    process.exit(0);
  });
});
