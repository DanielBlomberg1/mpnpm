#!/usr/bin/env node
const Spawn = require("child_process").spawn;
const FS = require("fs");

const configPath = "./config.json";

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

const allowedPms = ["npm", "yarn", "pnpm"];

const npmPath = "./package-lock.json";
const yarnPath = "./yarn.lock";
const pnpmPath = "./pnpm-lock.yaml";

const lockFileMapping = {
  npm: { path: npmPath },
  yarn: { path: yarnPath },
  pnpm: { path: pnpmPath },
};

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
  if (!allowedCommands.includes(mainArg)) {
    return;
  }
  if (mainArg === "use") {
    // write to config.json the default package manager if arg[1] is valid
    // using fs
    if (args[0] === "npm" || args[0] === "yarn" || args[0] === "pnpm") {
      FS.writeFileSync(
        configPath,
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

  for (const [manager, {path}] of Object.entries(lockFileMapping)) {
    if (FS.existsSync(path)) {
      generateCommand(
        manager,
        commandsMatrix[manager],
        additionalArgsMatrix[manager]
      );
      return;
    }
  }

  // read from config.json the default package manager
  // if exists then use npm install or yarn install or pnpm install

  if (
    FS.existsSync(configPath, FS.constants.F_OK, (err) => {
      if (err) {
        console.log("Please close config.json file and try again");
      }
    })
  ) {
    const config = JSON.parse(FS.readFileSync(configPath));
    const defaultPm = config.defaultPackageManager;
    if (allowedPms.includes(defaultPm)) {
      console.log(
        "No lock file found, using default package manager " +
          defaultPm +
          ". \nIf you want to change it use nodepm use <package-manager>"
      );
      generateCommand(
        defaultPm,
        commandsMatrix[defaultPm],
        additionalArgsMatrix[defaultPm]
      );
    } else {
      console.log(
        "config file corrupted, please choose your default package manager again using 'nodepm use <package-manager>'"
      );
    }
  } else {
    console.log(
      `No lock file found, please choose your default package manager using "nodepm use <package-manager>"  or run <package-manager> install`
    );
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
