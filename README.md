# Vagrant Box for SailsJS

##Features
Get up and running with SailsJS blazingly fast, so you only have to worry about what you're good at - developing. This box comes with:
* Ubuntu 14.04
* Nodejs v.0.10.x, Redis stable release, MongoDB 2.6.*, MySQL
* Auto-reload of your server whenever you change a file using forever.
* Port-forwarding and all the other useful things you are used to from your Vagrant setup

##Setup for `cow-zoetis`
* Clone the project
* After running `vagrant up` and sshing into it run `cd ~/server/`
* Run `npm install` (shouldn't make a difference if you run it from the VM or from local)
* Then just start the server either with `sails lift` or `forever -w start app.js` if you want to watch changes

##Deploy `cow-zoetis`
* Switch into the client folder and run `ember build --environment=production`
* Copy the files from the now created dist foder into the `/server/assets/`
* Copy the content from the `index.html` into the `/server/views/index.ejs` so the app can be served properly on all routes with the history API
* Commit and push the changes
* SSH into the server 178.62.40.149
* Run the following commands
* `cd ~/apps/cow-zoetis/`
* `git pull`
* `cd server`
* `forever stopall`
* `forever start app.js --environment=production`
* If there are any problems you can either check the log files that forever automatically writes to (you can see the path via `forever list`) or you could also run `sails lift --environment=production` to immediately see any errors
* The downtime should be less than a minute. Theoretically `forever start -w app.js --environment=production` would minimise the downtime, but don't quite trust that yet in a production environment.

##Setup a new Box
* Clone the repository `git clone https://github.com/Globegitter/vagrant-sailsjs.git`.
* Run `vagrant up` and enjoy a cup of tea until everything gets downoaded and installed.
* SSH in with `vagrant ssh`.
* `cd ~/server/` and `rm .gitignore`.
* Then run `sails new .` or `sails new . --linker`, if you are planning to use https://github.com/cashbit/sails-crudface.
* Add a `.foreverignore` with `**/.tmp/**` and `**/views/**` in this folder, so forever only auto-reloads the Server when needed.
* Run `forever -w start app.js`, this ensures that the server runs all the time and updates on any code change.
* Run `sails generate api user` or whatever - Happy coding!
* Shut down with `vagrant halt`.
* Run node inspector via `node-debug app.js --save-live-edit=true`

##SailsJS MySQL Configuration
* To get setup with mysql install `npm install sails-mysql --save`
* Open `config/connections.js` you can use the following configuration: 
```js
  someMysqlServer: {
    adapter: 'sails-mysql',
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'database'
  }
```
* Then open `config/models.js` update `connection` to `connection: 'someMysqlServer'`
* You are all set, create your models and let SailsJS do the grunt-work for you.

##Access from your local machine

* redis.cli h 192.168.33.10 -p 6379
* mongo 192.168.33.10
* MySQL `mysql -h 127.0.0.1 -P 7778 -u root`
* SailsJS Server `localhost:1337`

##Requirements:
* Get the latest VirtualBox - Free virtualization software [Download Virtualbox](https://www.virtualbox.org/wiki/Downloads)
* Get the latest Vagrant (1.5+)- Tool for working with virtualbox images [Download Vagrant](https://www.vagrantup.com)

##Roadmap
* Planning on automating a few of the steps in the future.
* There may be some differences if the generators are run on the local machine or on the vm  - forever doesn't seem to reload for generators run on local. Will investigate at some point.

---
List of all puppet manifests that will install: [Nodejs - v0.10.\*, Redis - last stable release, MongoDB - 2.6.\*, MySQL, SailsJS 0.10.x, forever, node-inspector, wget, git, vim, htop, g++, fish]
