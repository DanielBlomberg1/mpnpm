#!/usr/bin/env node
const Spawn = require("child_process").spawn;
const FS = require("fs");

const detached = false;
const allowedCommands = [
  "install",
  "uninstall",
  "i",
  "init",
  "run",
  "cache",
  "use",
];

const npmPath = "./package-lock.json";
const yarnPath = "./yarn.lock";
const pnpmPath = "./pnpm-lock.yaml";

const commandsMatrix = {
  npm: {
    i: "install",
    install: "install",
    uninstall: "uninstall",
    init: "init",
    run: "run",
    cache: "cache clean",
  },
  yarn: {
    i: "add",
    install: "add",
    uninstall: "remove",
    init: "init",
    run: "run",
    cache: "cache clean",
  },
  pnpm: {
    i: "add",
    install: "install",
    uninstall: "remove",
    init: "init",
    run: "run",
    cache: "cache clean",
  },
};

const additionalArgsMatrix = {
  npm: {
    "-D": "--save-dev",
    "-G": "--global",
  },
  yarn: {
    "-D": "--dev",
    "-G": "global",
  },
  pnpm: {
    "-D": "--save-dev",
    "-G": "--global",
  },
};

////////////////////////////////
/// ACTUAL LOOP               //
/// Extract Command Line Args //
////////////////////////////////

const args = process.argv ? process.argv.splice(2) : [];
const mainArg = args[0].trim();
args.shift();

lookForLockFile();

function lookForLockFile() {
  if (allowedCommands.includes(mainArg)) {
    if (mainArg === "use") {
      // write to config.json the default package manager if arg[1] is valid
      // using fs
      if (args[0] === "npm" || args[0] === "yarn" || args[0] === "pnpm") {
        FS.writeFileSync(
          "./config.json",
          JSON.stringify({ defaultPackageManager: args[0] })
        );
        console.log(`Setting ${args[0]} as default package manager`);
      } else {
        console.log(
          `Invalid package manager, please choose between npm, yarn or pnpm`
        );
      }
      return;
    }
    //check for .lock file
    // if exists then use npm install or yarn install or pnpm install
    if (
      FS.existsSync(npmPath, FS.constants.F_OK, (err) => {
        if (err) {
          console.log("No package-lock.json found");
        }
      })
    ) {
      generateCommand("npm", commandsMatrix.npm, additionalArgsMatrix.npm);
    } else if (
      FS.existsSync(yarnPath, FS.constants.F_OK, (err) => {
        if (err) {
          console.log("No yarn.lock found");
        }
      })
    ) {
      generateCommand("yarn", commandsMatrix.yarn, additionalArgsMatrix.yarn);
    } else if (
      FS.existsSync(pnpmPath, FS.constants.F_OK, (err) => {
        if (err) {
          console.log("No pnpm-lock.yaml found");
        }
      })
    ) {
      generateCommand("pnpm", commandsMatrix.pnpm, additionalArgsMatrix.pnpm);
    } else {
      // read from config.json the default package manager
      // if exists then use npm install or yarn install or pnpm install

      if (
        FS.existsSync("./config.json", FS.constants.F_OK, (err) => {
          if (err) {
            console.log("Please close config.json file and try again");
          }
        })
      ) {
        const config = JSON.parse(FS.readFileSync("./config.json"));
        console.log(
          "No lock file found, using default package manager " +
            config.defaultPackageManager +
            ". \nIf you want to change it use nodepm use <package-manager>"
        );
        if (config.defaultPackageManager === "npm") {
          console.log(
            "default package manager is npm, using the appropriate command"
          );
          generateCommand("npm", commandsMatrix.npm, additionalArgsMatrix.npm);
        } else if (config.defaultPackageManager === "yarn") {
          console.log(
            "default package manager is yarn, using the appropriate command"
          );
          generateCommand(
            "yarn",
            commandsMatrix.yarn,
            additionalArgsMatrix.yarn
          );
        } else if (config.defaultPackageManager === "pnpm") {
          console.log(
            "default package manager is pnpm, using the appropriate command"
          );
          generateCommand(
            "pnpm",
            commandsMatrix.pnpm,
            additionalArgsMatrix.pnpm
          );
        }
      } else {
        console.log(
          `No lock file found, please choose your default package manager using "nodepm use <package-manager>"  or run <package-manager> install`
        );
      }
    }
  }
}

function generateCommand(packageManager, commands, additional) {
  const command = commands[mainArg];

  const index = checkIfAdditionalArgsExists();
  let additionalArgs = "";

  if (index !== -1) {
    additionalArgs = additional[args[index].toUpperCase()];
    args.splice(index, 1);
  }

  Exec(packageManager, command, additionalArgs);
}

function checkIfAdditionalArgsExists() {
  for (let i = 0; i < args.length; i++) {
    if (args[i].toUpperCase() === "-D" || args[i].toUpperCase() === "-G") {
      return i;
    }
  }
  return -1;
}

function Exec(pm, cmd, additionalArgs) {
  additionalArgs = additionalArgs ? additionalArgs : "";

  if (cmd === "add" && pm === "yarn" && args.length === 0) {
    console.log("$ yarn");
    callSpawn("yarn");
  } else {
    console.log("$ " + pm + " " + additionalArgs + " " + cmd + " " + args);
    callSpawn(pm + " " + additionalArgs + " " + cmd + " " + args);
  }
}

function callSpawn(str) {
  Spawn(str, [], {
    shell: true,
    stdio: "inherit",
    detached: detached,
  });
}
