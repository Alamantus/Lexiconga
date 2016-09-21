var express = require('express');
var app = express();

app.use(express.static('./public/'));

app.listen(3013, function () {
  setTerminalTitle('localhost:3013');
  console.log('Example app listening on port 3013!');
});

function setTerminalTitle(title)
{
  process.stdout.write(
    String.fromCharCode(27) + "]0;" + title + String.fromCharCode(7)
  );
}