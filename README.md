# SANE Stack

**NOTE: This project, while exciting, is still a very early prototype. I may be unstable and still has a lot of features to come, but the basics should be mostly functional. Every tester here is welcome.**

To get started:
* Make sure you have [Docker](https://docs.docker.com/installation/ubuntulinux/#ubuntu-trusty-1404-lts-64-bit) (Linux) or [Boot2docker >=1.3.0](https://github.com/boot2docker/osx-installer/releases) (Mac OS X/Windows), [Fig >=1.0.0](http://www.fig.sh/install.html) and [ember-cli](http://www.ember-cli.com/) installed
* `npm install -g sane-cli`
* * If you are on the Mac, make sure boot2docker is running and your DOCKER environemnt variables are set correctly
* `sane new project` or specifiy mongo, postgres, mysql: `sane new project -d postgres`
* `fig run server sails generate api user` to run sails commands in the container
* `fig up` to start the sails container/server on `http://192.168.59.103:1337` (can be depending on your Docker setup)

In a new terminal tab/window:
* `cd client && ember server --proxy http://192.168.59.103:1337` to start the ember server

##Overview
SANE - A [Sails](http://sailsjs.org/) and [Ember](http://emberjs.com/) CLI that will help you get started with rapid Web App prototyping and development. It includes, what are in our opinion the best tools for backend and frontend development. They will save you an immense amount of time, make development smoother and deliver the best results that work optimally across multiple devices.

So what exactly does this cli do?

* It creates a sane folder structure so you can develop server and client seperately, but they integrate smoothly
* Sets up a [SailsJS Container](https://github.com/artificialio/docker-sails), with a database of choice (sails-disk, mongoDB, MySQL or Postgres) using [Fig](https://github.com/artificialio/docker-sails) to provide an isolated development environment that can be used in production
* Using the latest [ember-cli](https://github.com/stefanpenner/ember-cli) version you have installed to set up an ember-frontend in a `client` sub-folder. If you want to quickly get started with frontend-styling, check out our [Foundation-SASS plugin](https://github.com/artificialio/ember-cli-foundation-sass)

To find out more about Sails and Ember and how they work together, you can take a look at my talk
[http://vimeo.com/103711300](http://vimeo.com/103711300) and slides [http://talks.artificial.io/sailing-with-ember/
](http://talks.artificial.io/sailing-with-ember/)


##Deployment
**Note: This is still very much work in progress. We are planning to add an automated nginx container which will make it easy to instantly deploy the containerized app without any changes to the environment.**

In the meantime find the old deployment readme:
* `pm2 start app.js -- --prod` in `/server` starts sails in production mode on port 80
* `ember build --environment=production --output-path=../server/assets/`.
   * That builds the app and copies it over to be included with Sails.
   * `pm2 restart app` so Node can pick up the latest changes

The Server is configured to serve the Ember App on all routes, apart from the `api/**` routes, so Ember itself can take full control of handling error routes, etc.

For more information on deployment and different strategies check out:
* The [Sails Documentation](http://sailsjs.org/#/documentation/concepts/Deployment) to read up about some fundamentals
* [PM2 Deploy](https://github.com/Unitech/pm2#deployment) gives you some nice command line tools to ease deployment
* [Ember-CLI Deploy](https://github.com/achambers/ember-cli-deploy) for deployment via Redis and Amazon S3
* [Hardening NodeJS](http://blog.argteam.com/coding/hardening-node-js-for-production-part-2-using-nginx-to-avoid-node-js-load/) for a proper Nginx setup


##Thanks
Thanks to [mphasize](https://github.com/mphasize) for creating [sails-generate-ember-blueprints](https://github.com/mphasize/sails-generate-ember-blueprints) which overwrites the default SailsJS JSON response to the one that Ember Data's `RESTAdapter` and `RESTSerializer` expects.

##Contribution
Everyone is more than welcome to contribute in any way: Report a bug, request a feature or submit a pull request. Just keep things sensible, so we can easily reproduce bugs, have a clear explanation of your feature request, etc.

##License
SANE Stack is [MIT Licensed](https://github.com/artificialio/sails-ember-starter-kit/blob/master/LICENSE.md).
