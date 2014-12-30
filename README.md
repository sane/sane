# SANE Stack
[![Build Status](https://travis-ci.org/artificialio/sane.svg?branch=master)](https://travis-ci.org/artificialio/sane) [![npm version](https://badge.fury.io/js/sane-cli.svg)](https://npmjs.org/package/sane-cli) [![Dependency Status](https://img.shields.io/david/artificialio/sane.svg?style=flat)](https://david-dm.org/artificialio/sane) [![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/artificialio/sane?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) 

**NOTE: This project, while exciting, is still an early prototype. While being mostly stable it is still being iterated with feature changes and improvements fairly regularly.**

Sane - A Javascript fullstack and cli that uses two of the best frameworks, [Sails](http://sailsjs.org/) and [Ember](http://emberjs.com/), so you can rapidly create production-ready web applications. It takes away all the hassle setting up the full backend and frontend environment, embracing convention-over-configuration all the way, so you can focus just on shipping your app. Additionally this cli also supports Docker, using [fig](http://www.fig.sh/), to automatically install dependencies such as your database and will make deployment easier.

Quickstart:
* `npm install -g sails ember-cli sane-cli`
* `sane new project` creates a local project with [sails-disk](https://github.com/balderdashy/sails-disk). To install with [Docker](https://www.docker.com/) and production databases see [Options](http://sanestack.com/#sane-stack-options).
* `sane generate resource user name:string age:number` to generate a new API on the backend and models on the frontend
* `sane up` to start the sails server on `localhost:1337` as well as the ember dev server on `localhost:4200`.
* To work on your frontend-app you work as you would normally do with ember-cli on `localhost:4200`.
* You are now good to go.

**Note: If you use Docker, make sure you have [fig](http://www.fig.sh/install.html) installed. On Mac or Windows also [boot2docker](http://boot2docker.io/) and for Linux see: [https://docs.docker.com/installation/ubuntulinux/](https://docs.docker.com/installation/ubuntulinux/)**

##Documentation

The full documentation is available at: http://sanestack.com/

##Development

sane-cli is developed with ES6/7 functionality, using [traceur](https://github.com/google/traceur-compiler) to provide a cleaner code as well as a nice experience for us the developers.
To get started:
* `git clone https://github.com/artificialio/sane.git`
* `cd sane && npm install` to install the dependencies
* `npm link` to make sure you can test the master version globally
* If you add a new feature an according test would be appreciated
* `npm test` to run the test-suite

##Thanks
Thanks to [mphasize](https://github.com/mphasize) for creating [sails-generate-ember-blueprints](https://github.com/mphasize/sails-generate-ember-blueprints) which overwrites the default SailsJS JSON response to the one that Ember Data's `RESTAdapter` and `RESTSerializer` expects.
Thanks to [sails](https://github.com/balderdashy/sails) for that great backend framework
Thanks to [ember-cli](https://github.com/stefanpenner/ember-cli) contributors for all the great effort that has gone into this product and from which I have taken a lot of inspiration and code, especially in regards to testing.

##License
SANE Stack is [MIT Licensed](https://github.com/artificialio/sails-ember-starter-kit/blob/master/LICENSE.md).

## Built by
Built with love by [Artificial Labs](http://artificial.io/) and contributors <3
