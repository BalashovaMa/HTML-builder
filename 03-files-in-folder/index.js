const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');
const folderPath = path.join(__dirname, 'secret-folder');
fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach( file => {
            const filePath = path.join(folderPath, file.name);
            const data = fsPromises.stat(filePath);
            console.log((file.name).split('.')[0] + ' - ' + path.extname(file.name).slice(1)
                + ' - ' + data.size);

        })
    }
})
