# nodejsBackendBoilerplate
Node.js backend with user creation, authentication, and authorization setup.


MongoDB must be installed on machine.

After cloning, 
1) change into direcotry
2) run npm i in command line(installs all dependencies)
3) in config folder, update all three files with correct database uri and env values
4) set env secret key as described in config file
5) update user model in models/user.js as necessary. Be sure to update validation as well.
6) run mongod in command line (starts mongodb server)
7) in new terminal tab, run npm test

Everything should be up and running at that point.
