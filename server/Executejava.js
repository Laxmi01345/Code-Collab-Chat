const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const outputpath = path.join(__dirname, "outputs");

try {
    if (!fs.existsSync(outputpath)) {
        fs.mkdirSync(outputpath, { recursive: true });
        console.log("Output directory created!");
    }
} catch (err) {
    console.error("Error creating output directory:", err);
}

const getPublicClassName = (code) => {
    const match = code.match(/public\s+class\s+(\w+)/);
    if (match) {
        console.log("Public class found:", match[1]);
    } else {
        console.log("No public class found in the code.");
    }
    return match ? match[1] : null;
};

const Executejava = (code, input = "") => {
    console.log("Received code:", code);
    const className = getPublicClassName(code);
    if (!className) {
        console.error("No public class found in the provided code.");
        return Promise.reject({ error: "No public class found in the provided code." });
    }

    const tempFilePath = path.join(outputpath, `${className}.java`);

    return new Promise((resolve, reject) => {
        console.log(`Writing code to ${tempFilePath}`);
        fs.writeFile(tempFilePath, code, (writeErr) => {
            if (writeErr) {
                console.error("Error writing file:", writeErr);
                return reject({ error: writeErr });
            }

            const compileCommand = `javac ${tempFilePath} -d ${outputpath}`;
            console.log(`Compiling Java code with command: ${compileCommand}`);
            exec(compileCommand, (compileError, compileStdout, compileStderr) => {
                if (compileError) {
                    console.error("Compilation error:", compileError);
                    return reject({ error: compileError, stderr: compileStderr });
                }

                const runCommand = `java -cp ${outputpath} ${className}`;
                console.log(`Running Java program with command: ${runCommand}`);
                const childProcess = exec(runCommand, (runError, runStdout, runStderr) => {
                    if (runError) {
                        console.error("Execution error:", runError);
                        return reject({ error: runError, stderr: runStderr });
                    }
                    if (runStderr) {
                        console.error("Runtime stderr:", runStderr);
                        return reject({ stderr: runStderr });
                    }
                    resolve(runStdout.trim());
                });

                if (input) {
                    childProcess.stdin.write(input);
                }
                childProcess.stdin.end();
            });
        });
    });
};

module.exports = {
    Executejava
};
