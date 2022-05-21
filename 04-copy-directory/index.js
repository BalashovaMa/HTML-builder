const { rm, mkdir, readdir, copyFile } = require("fs");
const path = require("path");
const sourcePath = path.join(__dirname, "files");
const destinationPath = path.join(__dirname, "files-copy");

const copyDir = (sourcePath, destinationPath) => {
  rm(destinationPath, { recursive: true }, (err) => {
    mkdir(destinationPath, { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
    });
    readdir(sourcePath, { withFileTypes: true }, (err, files) => {
      if (err) {
        return console.error(err);
      }
      files.forEach((file) => {
        const fromCopy = path.join(sourcePath, file.name);
        const toCopy = path.join(destinationPath, file.name);
        if (file.isFile()) {
          copyFile(fromCopy, toCopy, (err) => {
            if (err) {
              return console.error(err);
            }
          });
        }
        if (file.isDirectory()) {
          copyDir(fromCopy, toCopy);
        }
      });
    });
  });
};

copyDir(sourcePath, destinationPath);
