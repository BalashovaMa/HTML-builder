const { readdir, createWriteStream, createReadStream, write } = require("fs");
const path = require("path");
const sourcePath = path.join(__dirname, "styles");
const destinationPath = path.join(__dirname, "project-dist", "bundle.css");
let data = [];

const bundle = createWriteStream(destinationPath, (err) => {
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
    const extname = path.extname(file.name).split(".")[1];
    if (file.isFile() && extname === "css") {
      const readStream = createReadStream(fromCopy);
      readStream.on("data", (chunk) => data.push(chunk));
      readStream.on("end", () => {
        bundle.write(data.join("\n"));
      });
      readStream.on("error", (err) => {
        if (err) {
          return console.error(err);
        }
      });
    }
  });
});
