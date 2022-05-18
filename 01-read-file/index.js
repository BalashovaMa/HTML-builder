const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const stream = new fs.ReadStream(filePath);
stream.on('readable', function () {
    let data = stream.read();
    if (data !== null) console.log(data.toString());
});
