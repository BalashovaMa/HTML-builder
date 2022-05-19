const fs = require("fs");
const path = require("path");
const folderPath = path.join(__dirname, "secret-folder");

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  else {
    files.forEach((file) => {
        if (file.isFile()){
            const filePath = path.join(folderPath, file.name);
      fs.stat(filePath, function (err, stats) {
        console.log(
          file.name.split(".")[0] +
            " - " +
            path.extname(file.name).split(".")[1] +
            " - " +
            stats.size/1000 +
            " kb"
        );
      });
        }
      
    });
  }
});
