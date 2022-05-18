const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createWriteStream(filePath);
const { stdin, stdout, exit } = process;
stdout.write('Введите текст для записи в файл.\n');
stdout.write('Для выхода введите exit или нажмите Ctrl+C.\n');
stdin.on('data', data => {
    if (data.toString().trim() === 'exit') {
        exit();
    }
    stream.write(data.toString());
});
process.on('exit', () => stdout.write('Запись в файл завершена'));
process.on('SIGINT', exit);
