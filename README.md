# Sails-Ember Starter Kit

##Overview
Sails-Ember Starter Kit will help you started with rapid Web App prototyping and development. It includes, what are in our opinion the best tools for backend and frontend development. They will save you an immense amount of time, make development smoother and deliver the best results that work optimally across multiple devices.

So what exactly does this kit include?

* A sensible folder structure so you can develop Server and client seperately, but they integrate smoothly
* A [SailsJS Vagrant Box](https://github.com/Globegitter/vagrant-sailsjs) coming with [PM2](https://github.com/Unitech/PM2), MongoDB, MySQL and Redis all set-up to work properly.
* Using [ember-cli](https://github.com/stefanpenner/ember-cli) in the `client` folder, already set-up, using the latest 0.0.41 dev version (See https://github.com/stefanpenner/ember-cli#working-with-master). In addition we are already including sass and foundation to get started more quickly with frontend styling.

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
Deploying your Ember app is as simple as running this command: `ember build --environment=production && cp -rf dist/* ../server/assets/ && cp -f dist/index.html ../server/views/index.ejs`.  
  That builds the app and copies it over to be included with Sails. For the Server to pick up the changes you have to run `pm2 restart app -x` which completely restarts the server. It is configured to serve the Ember App on all routes, apart from the `api/**` routes, so Ember itself can take full control of handling error routes, etc.  
You can run the server in production with `pm2 start app.js -x -- --prod`, which serves the app on port 80.  
**Note:** If you are using Node v0.11.x you can run `pm2 start app.js -- --prod` (without the `-x`) and then you just need `pm2 reload app` to 'restart' the server with 0s downtime.

For more information on deploying your sails app check out [http://sailsjs.org/#/documentation/concepts/Deployment](http://sailsjs.org/#/documentation/concepts/Deployment), as well as the config file in `server/config/env/production.js`.  

If you are interested in some other deployment strategies you can look at this tutorial:
[http://blog.abuiles.com/blog/2014/07/08/lightning-fast-deployments-with-rails/](http://blog.abuiles.com/blog/2014/07/08/lightning-fast-deployments-with-rails/)
based on this talk:
[https://www.youtube.com/watch?v=QZVYP3cPcWQ](https://www.youtube.com/watch?v=QZVYP3cPcWQ)
This strategy can be taken over, pretty much the same way to your Sails Project.

##Thanks
Thanks to [mphasize](https://github.com/mphasize) for creating [sails-ember-blueprints](https://github.com/mphasize/sails-ember-blueprints) which overwrites the default SailsJS JSON response to the one that Ember Data's `RESTAdapter` and `RESTSerializer` expects.

##Contribution
Everyone is more than welcome to contribute in any way: Report a bug, request a feature or submit a pull request. Just keep things sensible, so we can easily reproduce bugs, have a clear explanation of your feature request, etc.

##License
Sails-Ember Starter Kit is [MIT Licensed](https://github.com/artificialio/sails-ember-starter-kit/blob/master/LICENSE.md).
