# mpnpm

## Why 
No more yarn install or npm remove.
Nodepm simplifies working in the javascript enviroment, for those who tend to use different package manager at work and at home
And for checking up on those older projects where you used different manager.

## How
"npm install nodepm -g"

To use please specify your preferred package-manager using "nodepm use" command.
Nodepm will use this incase there is no lockfile present in the project yet, 
otherwise nodepm will recognise the pm used and use the correct commands. 

## Commands:
"nodepm use \<package-manager>"

"nodepm install" (optional tags -D and -G)

"nodepm uninstall"

"nodepm init"

"nodepm run"

"nodepm cache" Equivelant to npm cache-clean

## Tags
-D installs the dependecy as a devDependency

-G installs the package globally

## Supports
npm, yarn, pnpm



