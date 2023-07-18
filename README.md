# mypmp

AKA My package manager package

## Why
No more yarn install or npm remove.
Mypmp simplifies working in the javascript enviroment, for those who tend to use different package manager at work and at home
And for checking up on those older projects where you used different manager.

## How
"npm install mypmp -g"

To use please specify your preferred package-manager using "mypmp use" command.
Mypmp will use this incase there is no lockfile present in the project yet, 
otherwise nodepm will recognise the pm used and use the correct commands. 

## Commands:
"mypmp use \<package-manager>"

"mypmp install" (optional tags -D and -G)

"mypmp uninstall"

"mypmp init"

"mypmp run"

"mypmp cache" Equivelant to npm cache-clean

## Tags
-D installs the dependecy as a devDependency

-G installs the package globally

## Supports
npm, yarn, pnpm



