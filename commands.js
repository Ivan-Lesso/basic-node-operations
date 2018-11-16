const fs = require("fs");

//write out data
function done(output) {
    process.stdout.write(output);
    process.stdout.write('\nprompt > ');
}

//where we will store our commands
function evaluateCmd(userInput) {
 //parses the user input to understand which command was typed
  const userInputArray = userInput.split(" ");
  const command = userInputArray[0];

  switch (command) {
    case "echo":
       //we will add the functionality of echo next within the object commandLibrary
        commandLibrary.echo(userInputArray.slice(1).join(" "));
        break;
    case "cat":
        commandLibrary.cat(userInputArray.slice(1));
        break;
    case "sort":
        commandLibrary.sort(userInputArray.slice(1));
        break;
    case "wc":
        commandLibrary.wc(userInputArray.slice(1));
        break;
    case "uniq":
        commandLibrary.sort(userInputArray.slice(1), 1);
        break;
    case "head":
        commandLibrary.head(userInputArray.slice(1), 1);
        break;
    case "tail":
        commandLibrary.tail(userInputArray.slice(1), 1);
        break;
    default:
        done("Command not found");
        break;
    }
}

//where we will store the logic of our commands
const commandLibrary = {
  "echo": function(userInput) {
      done(userInput);
  },
  "cat": function(fullPath) {
       const fileName = fullPath[0];
       fs.readFile(fileName, (err, data) => {
           if (err) throw err;
           done(data);
       });
   },
   "head": function(fullPath) {
        const fileName = fullPath[0];
        let lineArray = [];
        fs.readFile(fileName, (err, data) => {
            if (err) throw err;
            lineArray = data.toString().split("\n");
            lineArray.length = 10;
            done(lineArray.join("\n"));
        });
    },
    "tail": function(fullPath) {
         const fileName = fullPath[0];
         let lineArray = [];
         fs.readFile(fileName, (err, data) => {
             if (err) throw err;
             lineArray = data.toString().split("\n");
             lineArray = lineArray.slice(lineArray.length-11, 10);
             done(lineArray.join("\n"));
         });
   },
   "sort": function(fullPath, unique=0) {
      const fileName = fullPath[0];
      let input = fs.createReadStream(fileName);
      let remaining = '';
      let lineArray = [];

      input.on('data', function(data) {
        remaining += data;
        let index = remaining.indexOf('\n');
        while (index > -1) {
          let line = remaining.substring(0, index);
          remaining = remaining.substring(index + 1);
          lineArray.push(line);
          index = remaining.indexOf('\n');
        }
      });
      input.on('end', function() {
        lineArray.sort();
        if(unique) lineArray = Array.from(new Set(lineArray));
        done(lineArray.toString());
      });
    },
    "wc": function(fullPath) {
       const fileName = fullPath[0];
       let i;
       let newLine = 0;
       let wordCount = 0;
       let input = fs.createReadStream(fileName);
       const stats = fs.statSync(fileName)
       const fileSizeInBytes = stats.size


       input.on('data', function(data) {
           //wordCount = data.split(' ').length;
           wordCount = data.toString().split(/\b\S+\b/g).length - 1;
           for (i=0; i < data.length; ++i)
             if (data[i] == 10) newLine++;
           done("Lines: " + newLine + "\nWord Count: " + wordCount + "\nBytes: " + fileSizeInBytes);
         });
     },
};

module.exports.commandLibrary = commandLibrary;
module.exports.evaluateCmd = evaluateCmd;
