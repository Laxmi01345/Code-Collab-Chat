const { exec } = require("child_process");

const Executepy = (filepath, input = '') => {
    return new Promise((resolve, reject) => {
        const runCommand = `python ${filepath}`;
        const childProcess = exec(runCommand, (error, stdout, stderr) => {
            if (error) {
                return reject({ error, stderr });
            }
            if (stderr) {
                return reject({ stderr });
            }
            resolve(stdout.trim());
        });

        if (input) {
            childProcess.stdin.write(input);
        }
        childProcess.stdin.end();
    });
};

module.exports = {
    Executepy
};
