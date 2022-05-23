const { mkdir, copyFile, readFile, readdir, writeFile, createWriteStream, rm, createReadStream } = require('fs');
const path = require('path');
const pathTemplateHtml = path.join(__dirname, 'template.html');
const pathProjectDist = path.join(__dirname, 'project-dist');
const pathIndexHtml = path.join(pathProjectDist, 'index.html');
const pathComponents = path.join(__dirname, 'components');
const sourcePath = path.join(__dirname, 'styles');
const destinationPath = path.join(__dirname, 'project-dist', 'style.css');
let dataStyleCss = [];
const sourcePathAssets = path.join(__dirname, "assets");
const destinationPathAssets = path.join(pathProjectDist, "assets");

mkdir(pathProjectDist, { recursive: true }, (err) => {
    if (err) {
        return console.error(err);
    }
});

//Replacing template tags with the contents of component files
readFile(pathTemplateHtml, 'utf-8', (err, data) => {
    if (err) {
        return console.error(err);
    }
    let templateHtmlContent = data;
    const tags = data.match(/{{\w+}}/gm);
    for (let tag of tags) {
      const filePath = path.join(pathComponents, `${tag.slice(2, -2)}.html`);
      readFile(filePath, 'utf-8', (err, content) => {
        if (err) {
            return console.error(err);
        }
        templateHtmlContent = templateHtmlContent.replace(tag, content);
          rm(pathIndexHtml, { recursive: true, force: true }, (err) => {
          if (err) {
            return console.error(err);
          }
          const indexHtml = createWriteStream(pathIndexHtml);
          indexHtml.write(templateHtmlContent);
        });
      });
    }
  });

  //creating css file
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
        readStream.on("data", (chunk) => dataStyleCss.push(chunk));
        readStream.on("end", () => {
          bundle.write(dataStyleCss.join("\n"));
        });
          readStream.on("error", (err) => {
          if (err) {
            return console.error(err);
          }
        });
      }
    });
  });

  //moving the 'assets' folder
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
  
  copyDir(sourcePathAssets, destinationPathAssets);