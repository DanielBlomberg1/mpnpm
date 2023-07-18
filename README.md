# mpnpm

## Why 
No more yarn install or npm remove.
Mpnpm simplifies working in the javascript enviroment, for those who tend to use different package manager at work and at home
And for checking up on those older projects where you used different manager.

## How
"npm install mpnpm -g"

To use please specify your preferred package-manager using "mpnpm use" command.
Mpnpm will use this incase there is no lockfile present in the project yet, 
otherwise nodepm will recognise the pm used and use the correct commands. 

## Commands:
"mpnpm use \<package-manager>"

"mpnpm install" (optional tags -D and -G)

"mpnpm uninstall"

"mpnpm init"

"mpnpm run"

"mpnpm cache" Equivelant to npm cache-clean

## Tags
-D installs the dependecy as a devDependency

-G installs the package globally

## Supports
npm, yarn, pnpm



