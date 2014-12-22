# Sane Stack

A Javascript Fullstack and CLI that lets you rapidly create production-ready web apps using [Sails](http://sailsjs.org/) and [Ember](http://emberjs.com/), giving you [Docker](https://www.docker.com/) support, generators and more.

> [![npm version](https://badge.fury.io/js/sane-cli.svg)](https://npmjs.org/package/sane-cli) <br> [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/artificialio/sane?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

##Quickstart
* `npm install -g sails ember-cli sane-cli`
* `sane new project` creates a local project with [sails-disk](https://github.com/balderdashy/sails-disk). To install with [Docker](https://www.docker.com/) and production databases see [Options](#sane-stack-options).
* `sane generate resource user name:string age:number` to generate a new API on the backend and models on the frontend
* `sane up` to start the sails server on `localhost:1337` as well as the ember dev server on `localhost:4200`.
* To work on your frontend-app you work as you would normally do with ember-cli on `localhost:4200`.
* You are now good to go.

**Note: If you use Docker, make sure you have [fig](http://www.fig.sh/install.html) installed. On Mac or Windows also [boot2docker](http://boot2docker.io/) and for Linux see: [https://docs.docker.com/installation/ubuntulinux/](https://docs.docker.com/installation/ubuntulinux/)**


## Overview

* The cli creates a sane folder structure so you can develop server and client seperately, but they integrate smoothly.
* Sets up your SailsJS project either locally or with a [sails-container](https://github.com/artificialio/docker-sails) and a database of choice (sails-disk, mongoDB, MySQL or Postgres) using [Fig](https://github.com/artificialio/docker-sails) to provide an isolated development environment that can be used in production.
* Using the [ember-cli](https://github.com/stefanpenner/ember-cli) you have globally installed to set up an ember-frontend in a `client` sub-folder.

To find out more about Sails and Ember and how they work together, you can take a look at my talk
[http://vimeo.com/103711300](http://vimeo.com/103711300) and slides [http://talks.artificial.io/sailing-with-ember/
](http://talks.artificial.io/sailing-with-ember/)

## Options

### `sane`

> Shows the help as well as the version of the cli.

`sane new project [--docker] [-d mongo|postgres|mysql|disk] [--verbose] [--skip-npm] [--skip-bower]`

> Sets up a new server/client project depending on your flags or your `.sane-cli` in your home-folder. Defaults to local setup with [sails-disk](https://github.com/balderdashy/sails-disk) for quick prototyping.

`--docker` or `-D`

> Sets up your whole backend envrionment using [fig](http://www.fig.sh/) to provide powerful container management.

**Note:** Make sure you have [fig](http://www.fig.sh/install.html) installed, on Mac or Windows also [boot2docker](http://boot2docker.io/) and for Linux see: [https://docs.docker.com/installation/ubuntulinux/](https://docs.docker.com/installation/ubuntulinux/)

**Why Docker?** It fully automates the setup of server dependencies and you can now develop in your production environment that can be deployed to any server as-is.

`--database <option>` or `-d`, options: `mongo|postgres|mysql|disk`, default: `disk`

> Installs the right db-adapter. If used in combination with `--docker` automatically installs and sets up the chosen db and connection config.

`sane up [--docker] [--live-reload]`, alias: `sane serve`

> Boots up your sails server (default: localhost:1337) as well as your ember-cli server (default: localhost:4200) displaying a unified log.

`sane generate api|resource <name> [--pod] [attribute1:type1, attribute2:type2 ... ]`, alias: `sane g`

> Generates a 'name' resource/api on the backend as well as the frontend, optionally include attributes with the specified types. Supports sails and ember-data models types. One the backend accessible at: **localhost:1337/api/v1/names**

`--pod`

> Supports the `pod` structure for ember-cli

## .sane-cli
`.sane-cli`: A file located in your root folder which can be used to persist parameters. For example you can use it to have `--docker` set as default for each `sane` command you run.

The currecntly supportet options are:

* `docker`
* `database`
* `verbose`
* `disableAnalytics`

**Example:**  
```
  {
    "docker": true,
    "database": "disk",
    "verbose": false,
    "disableAnalytics": false
  }
```

##Deployment
**Note: This is still very much work in progress. We are planning to add an automated nginx container which will make it easy to instantly deploy the containerized app to your server.**

In the meantime find the old deployment readme (ignoring any of the possible Docker setup):

* Make sure you have `npm i -g pm2` installed on your server
* Simply clone your app on the server
* Then you can use `pm2 start app.js -- --prod` in `/server` to starts sails in production mode on port 80
* `ember build --environment=production --output-path=../server/assets/`.
   * That builds the app and copies it over to be included with Sails.
   * `pm2 restart app` so Node can pick up the latest changes

The Server is configured to serve the Ember App on all routes, apart from the `api/**` routes, so Ember itself can take full control of handling error routes, etc.

For more information on deployment and different strategies check out:

* The [Sails Documentation](http://sailsjs.org/#/documentation/concepts/Deployment) to read up about some fundamentals
* [PM2 Deploy](https://github.com/Unitech/pm2#deployment) gives you some nice command line tools to ease deployment
* [Ember-CLI Deploy](https://github.com/achambers/ember-cli-deploy) for deployment via Redis and Amazon S3
* [Hardening NodeJS](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/) for a proper Nginx setup

##Troubleshooting

###Installing sails npm packages
If you are using docker you currently have to run `fig run server npm install <package>` in your root folder to correctly install an npm package for your sails container.

###Linux Support
The sane-cli should mostly support linux as-is. If you use docker however, make sure that your `DOCKER_HOST` variable is set so there is an IP to connect to rather than a unix socket.

###Docker/Fig issues
If you generally have issues with your containers can try to remove all your docker containers via `docker rm 'docker ps --no-trunc -aq'` and then simply run `sane up --docker` (if it is not defaulted in your `.sane-cli`) to set up all the containers again.

###Problem:
After launching the ember server and backend via `sane up` and accessing the web application the ember server crashes with the error `Error: connect EHOSTUNREACH`.

###Solution:
Deleting and re-installing the global node modules and bower components may fix the problem:
```
cd client
rm -rf bower_components node_modules
npm i && bower i
```


###Problem:
Upon launching the server via `sane up` I get a `Fatal error: Unable to find local grunt.`

###Solution:
There are two possible solutions for this problem.

**1. Delete the docker-containers**
```
fig stop
fig rm --force -v
sane up
```

If that by itself does not do the trick, try to re-create the project.

**2. Start the Ember-server manually once**
```
cd client
ember serve
```

wait until its loaded, then close the server.
Go back to the project root and fire up sane.
```
cd ..
sane up
```


##Thanks
Thanks to [mphasize](https://github.com/mphasize) for creating [sails-generate-ember-blueprints](https://github.com/mphasize/sails-generate-ember-blueprints) which overwrites the default SailsJS JSON response to the one that Ember Data's `RESTAdapter` and `RESTSerializer` expects.

##Contribution
Everyone is more than welcome to contribute in any way: Report a bug, request a feature or submit a pull request. Just keep things sensible, so we can easily reproduce bugs, have a clear explanation of your feature request, etc.

##License
SANE Stack is [MIT Licensed](https://github.com/artificialio/sails-ember-starter-kit/blob/master/LICENSE.md).
