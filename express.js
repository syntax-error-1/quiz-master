const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  cors: {
    origin: '*',  // Allow all origins
    methods: ['GET', 'POST']
  }
});

app.use(express.static('public'));

// Rest of your code...

http.listen(3000, () => console.log('listening on *:3000'));
