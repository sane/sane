---
layout: post
title: New Release & Meeting Minutes
author: Markus Padourek
twitter: mpadourek
---

Turns out it is not that easy to coordinate people from different sides of the ocean who also happen to have have busy jobs. But it is great to see how the open source world connects people and as planned we had our second meeting on 13/01/2015. Also after a few weeks of break finally a new version of the sane-cli got released.

<!-- more -->

### Addons

One of the hot topics right now. Ember has it, Sails people wanted it for quite some time and will, very soon with 0.11, have an ecosystem for addons in place using [generators and hooks](http://sailsjs.org/#/documentation/concepts/extending-sails). Another interesting development on the Node side is [node machine](http://node-machine.org/), which is an open standard for Javascript functions, written by the team behind SailsJS. It is a standard that utilises npm and allows for functions to be self-documenting as well as making their success and error behaviour clear to developers. What does this have to do with Addons you might ask? Apart from the fact that it is written by the Sails team there is also a [Sails Machine Hook](https://github.com/node-machine/sails-hook-machines) which automatically makes machines (or machinepacks as they are called) available to Sails. Furthermore we have been thinking to use this standard for the Sane Stack addon system.

As a first step I have extracted the resource generator to test the possible addon API. You can find the project here: [github.com/Globegitter/sane-generate-resource](https://github.com/Globegitter/sane-generate-resource). Using node machine has one benefits: It provides us with a structure for addons and you immediately get to understand the behaviour of an addon better. On the flipside it is quite verbose and might lead to a few other limitations in real-world scenarios.

To get a better idea on the benefits and limitations, the next steps are to write an authentication addon. We will then use that as a first example to implement addons in the Sane core itself. Another step missing is a testing strategy for addons themselves, so stay tuned to here more about the progress over the next few weeks.

### Tests

Even though some people are not big fans of [QUnit](http://qunitjs.com/) Ember with ember-cli has tests covered pretty well now. The bigger testing strategies to improve are Sails which only comes with [basic testing guidance](http://sailsjs.org/#/documentation/concepts/Testing) as well as end-to-end testing.

We have already started talking about that in the last meeting and one of the example projects on github was [github.com/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example](https://github.com/bredikhin/sailsjs-mocha-testing-barrels-fixtures-example). We are now officially recommending this project's strategy and going to integrate it into Sane Stack (or possibly Sails itself). It uses [Mocha](http://mochajs.org/) as the testing framework with [Barrels](https://github.com/bredikhin/barrels/) providing testing fixtures for your database. Give it a try. [Martin](https://twitter.com/cyberseer) pointed out another very interesting library, [nock](https://github.com/pgte/nock), which is an HTTP mocking library for NodeJS. I am not going to go into much detail, but the most interesting feature is the possibility to record HTTP calls and their response. So you could for example use nock to test your own API, record the JSON response and forward it to Barrels to test your backend. You should be hearing more about this as well over the coming weeks and months.

End-to-end testing has just briefly been touched upon, but is another topic we are interested to investigate and smoothen out in the future. For current approaches look at [Protractor](https://github.com/angular/protractor) in the AngularJS world, as well as this short but helpful stackoverflow on EmberJS [stackoverflow.com/questions/27950579/end-to-end-testing-emberjs-using-selenium-webdriverjs](http://stackoverflow.com/questions/27950579/end-to-end-testing-emberjs-using-selenium-webdriverjs).

### Release 0.0.21

As you may have noticed you are now able to update sane-cli from [0.0.17](https://github.com/artificialio/sane/releases/tag/0.0.17) straight to [0.0.21](https://github.com/artificialio/sane/releases/tag/0.0.21), which is due to some sloppy fixing and commiting on my side, so make sure to use the latest version. Positively though, thanks to [Alberto Souza](https://github.com/albertosouza), we fixed a crucial bug for some Linux distibutions and Windows support smoothened out a lot as well. `sane up` still needs to be fixed for Windows, so please run `sails lift`/`fig up` and `ember serve --proxy http://127.0.0.1:1337` manually in the meantime. For more changes see the [Changelog](https://github.com/artificialio/sane/blob/master/CHANGELOG.md).
