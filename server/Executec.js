const { exec } = require("child_process");
const fs = require('fs');
const path = require('path');
const outputpath = path.join(__dirname, "outputs");

try {
    if (!fs.existsSync(outputpath)) {
        fs.mkdirSync(outputpath, { recursive: true });
        console.log("Output directory created!");
    }
} catch (err) {
    console.error("Error creating output directory:", err);
}

const Executec = (filepath, input = '') => {
    const jobId = path.basename(filepath).split(".")[0];
    const outpath = path.join(outputpath, `${jobId}.exe`);

    return new Promise((resolve, reject) => {
        const compileCommand = `gcc ${filepath} -o ${outpath}`;
        exec(compileCommand, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                return reject({ error: compileError, stderr: compileStderr });
            }

            const runCommand = `${outpath}`;
            const childProcess = exec(runCommand, (runError, runStdout, runStderr) => {
                if (runError) {
                    return reject({ error: runError, stderr: runStderr });
                }
                if (runStderr) {
                    return reject({ stderr: runStderr });
                }
                resolve(runStdout.trim());
            });

            childProcess.on('ready', () => {
                if (input) {
                    childProcess.stdin.write(input);
                }
                childProcess.stdin.end();
            });
        });
    });
};

module.exports = {
    Executec
};
