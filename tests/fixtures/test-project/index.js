const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send('Not found');
      return;
    }
    res.send(data);
  });
});

module.exports = { app };
