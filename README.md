# SANE Stack

##Overview
SANE - A [Sails](http://sailsjs.org/) and [Ember](http://emberjs.com/) Starter Kit that will help you get started with rapid Web App prototyping and development. It includes, what are in our opinion the best tools for backend and frontend development. They will save you an immense amount of time, make development smoother and deliver the best results that work optimally across multiple devices.

So what exactly does this kit include?

* A sane folder structure so you can develop server and client seperately, but they integrate smoothly
* A [SailsJS Vagrant Box](https://github.com/Globegitter/vagrant-sailsjs) coming with [PM2](https://github.com/Unitech/PM2), MongoDB, MySQL and Redis all set-up to work properly - though you could as easily run it without Vagrant if that's not your thing.
* Using [ember-cli](https://github.com/stefanpenner/ember-cli) in the `client` folder, already set-up, using the latest 0.0.42 version. In addition we are already including sass and foundation to get started quickly with frontend styling.

To find out more about Sails and Ember and how they work together, you can take a look at my talk
[http://vimeo.com/103711300](http://vimeo.com/103711300) and slides [http://talks.artificial.io/sailing-with-ember/
](http://talks.artificial.io/sailing-with-ember/)

##Quickstart
* Clone this project
* To get the server up: Run `vagrant up`, once it's all done `vagrant ssh`, cd into `~/server` and run `npm install`
* Run `sails lift` to get the server started on `localhost:1337`
* In the `client` folder run `npm install && bower install`
* Run `ember serve` to get the dev server with auto-reload running on `localhost:4200`
* So in dev-mode simply think of your ember app as you would of any other client, for example an Android app.


##Deployment
* `pm2 start app.js -x -- --prod` in `/server` starts sails in production mode on port 80
* `ember build --environment=production && cp -rf dist/* ../server/assets/ && cp -f dist/index.html ../server/views/index.ejs`.  
   * That builds the app and copies it over to be included with Sails.
   * `pm2 restart app -x` so Node can pick up the latest changes

**Note:** If you are using Node v0.11.x you can run `pm2 start app.js -- --prod` (without the `-x`) and then you just need `pm2 reload app` to reload the server with 0s downtime.

The Server is configured to serve the Ember App on all routes, apart from the `api/**` routes, so Ember itself can take full control of handling error routes, etc.  

For more information on deployment and different strategies check out:  
* The [Sails Documentation](http://sailsjs.org/#/documentation/concepts/Deployment) to read up about some fundamentals
* [PM2 Deploy](https://github.com/Unitech/pm2#deployment) gives you some nice command line tools to ease deployment
* [grunt-autobots](https://github.com/achambers/grunt-autobots) for deployment via Redis and Amazon S3


##Thanks
Thanks to [mphasize](https://github.com/mphasize) for creating [sails-ember-blueprints](https://github.com/mphasize/sails-ember-blueprints) which overwrites the default SailsJS JSON response to the one that Ember Data's `RESTAdapter` and `RESTSerializer` expects.

##Contribution
Everyone is more than welcome to contribute in any way: Report a bug, request a feature or submit a pull request. Just keep things sensible, so we can easily reproduce bugs, have a clear explanation of your feature request, etc.

##License
Sails-Ember Starter Kit is [MIT Licensed](https://github.com/artificialio/sails-ember-starter-kit/blob/master/LICENSE.md).
