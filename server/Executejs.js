const { exec } = require('child_process');

const Executejs = (filepath, input = '') => {
  return new Promise((resolve, reject) => {
    const execCommand = `node ${filepath}`;
    const childProcess = exec(execCommand, (error, stdout, stderr) => {
      if (error) {
        return reject({ error, stderr });
      }
      if (stderr) {
        return reject({ stderr });
      }
      resolve(stdout.trim());
    });

    if (input) {
      childProcess.stdin.write(input + '\n');
    }
    childProcess.stdin.end();
  });
};

module.exports = {
  Executejs,
};
