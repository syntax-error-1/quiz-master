const io = require('socket.io')(3001, {
    cors: {
      origin: '*', // Allow all origins
      methods: ['GET', 'POST'], // Allow GET and POST methods
    },
  });
  
  const questions = [
    { question: 'What is the capital of France?', answer: 'Paris' },
    { question: 'What is 2+2?', answer: '4' }
  ];
  
  let currentQuestion = 0;
  let scores = {};
  let players = [];
  let gameInterval = null; // Initialize gameInterval to null
  
  function askQuestion() {
    if (currentQuestion < questions.length) {
      io.emit('question', questions[currentQuestion].question);
      currentQuestion++;
    } else {
      endGame();
    }
  }
  
  function endGame() {
    let winner;
    if (scores[players[0]] === scores[players[1]]) {
      winner = "It's a tie!";
    } else {
      winner = players.reduce((a, b) => (scores[a] > scores[b] ? a : b));
      winner = 'The winner is ' + winner;
    }
    io.emit('end', 'Game Over! ' + winner);
    // Reset game state
    players = [];
    scores = {};
    currentQuestion = 0;
    clearInterval(gameInterval); // Stop asking questions
    gameInterval = null; // Set gameInterval to null
  }
  
  io.on('connection', (socket) => {
    socket.on('username', (username) => {
      scores[username] = 0;
      players.push(username);
      // Start the game when two players have connected
      if (players.length === 2) {
        console.log('Game Started');
        askQuestion(); // Show the first question immediately
        if (!gameInterval) {
          gameInterval = setInterval(askQuestion, 10000); // Show subsequent questions every 10 seconds
        }
      }
    });
  
    socket.on('answer', (data) => {
      if (questions[currentQuestion - 1].answer.toLowerCase() === data.answer.toLowerCase()) {
        scores[data.username]++;
      }
    });
  });
  