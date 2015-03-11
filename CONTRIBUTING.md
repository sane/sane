# Getting Involved

Open source projects like SANE are possible because of people like you who are
willing to get involved.  You can contribute to the success of SANE by reporting
bugs, suggesting features, learning how to use it and helping others, and/or
submitting code in pull requests. 

This document is a set of guidelines for making your contrubtions as useful
and helpful as possible.

# Questions

If you are having difficulties using SANE or have a question about usage
please ask a question in the Gitter chat: https://gitter.im/artificialio/sane

# Issues

Think you've found a bug or have a new feature to suggest? Let us know!

## Reporting a Bug

1. Update to the most recent master release if possible. Your bug may have 
   already been fixed.

2. Search for similar issues. It's possible somebody has encountered this bug
   already, in which case you can add a simple "+1" to indicate you're also 
   experiencing the issue.  Or you can add more detail if you think it will 
   help the discussion.

3. Copy the full error logs and stack trace into the issue description.

4. Include relavant details about your environment like operating system, 
   SANE version, node/iojs version, Docker usage, database usage, etc.

5. Provide a demo that specifically shows the problem. This demo should be fully
   operational with the exception of the bug you want to demonstrate. The more
   pared down, the better. Issues with demos are prioritized.  The best demos are
   Github repositories or a Heroku app + Github repository, but often a simple
   [gist](https://gist.github.com/) is enough to convey the issue.

6. Your issue will be verified. The provided demo will be tested for
   correctness. The SANE team will work with you until your issue can be
   verified.

7. Keep up to date with feedback from the SANE team on your ticket. Your
   ticket may be closed if it becomes stale, with the assumption that you are
   either no longer experiencing the issue or are no longer interested.

8. If possible, submit a Pull Request with a failing test. Better yet, take
   a stab at fixing the bug yourself if you can!

The more information you provide, the easier it is to reproduce and validate 
the bug and the faster a fix can start being worked on.

## Requesting a Feature

1. Search Issues for similar feature requests. It's possible somebody has
   already asked for this feature or provided a pull request that is still
   being discussed.

2. Provide a clear and detailed explanation of the feature you want and why it's
   important to add. If you are adding a feature targeting a minority of users, 
   an addon for our upcoming addon eco-system might be the perfect fit.

3. If the feature is complex, consider writing some initial documentation for
   it. If the feature is accepted it will need to be documented and
   this will also help reviewers to understand it better.  Submitting a 
   feature request with documentation will help shape the implemented API.

4. Attempt a Pull Request. If you are willing to help the project out, you can
   submit a Pull Request. We always have more work to do than time to do it. If
   you can write some code then that will speed the process along.

# Pull Requests

We love pull requests. Here's a quick guide:

1. Fork the repo.

2. Run the tests. Only pull requests with passing tests are accepted, and 
   it's great to know that you have a clean slate: `npm install && npm test`.

3. Add a test for your change. Only refactoring and documentation changes
   require no new tests. If you are adding functionality or fixing a bug,
   please add a test.  If you need help writing tests, speak up in the 
   [Gitter chat](https://gitter.im/artificialio/sane).

4. Make the test pass by fixing the bug or adding the feature.

5. Commit your changes. If your pull request fixes an issue, specify it in the
   commit message. Here's an example: `git commit - m "Close #52  Fix
   generators"`

6. Push to your fork and submit a pull request. In the pull-request title,
   please prefix it with one of our tags: BUGFIX, FEATURE, ENHANCEMENT or
   INTERNAL

   * FEATURE and ENHANCEMENT tags are for things that users are interested in.
     Avoid super technical talk. Craft a concise description of the change.
     - FEATURE tag is a standalone new addition, an example of this would be
       adding a new command
     - ENHANCEMENT tag is an improvement on an existing feature
   * BUGFIX tag is a link to a bug + a link to a patch.
   * INTERNAL tag is an internal log of changes.

   In the description, please provide us with some explanation of why you made
   the changes you made. For new features make sure to explain a standard use
   case to us.

   If a change requires a user to change their configuration or
   `package.json` also add a BREAKING tag within the brackets
   before any other tags (example [BREAKING BUGFIX]).

We try to be quick about responding to tickets but sometimes we get a bit
backlogged. If the response is slow, try to find someone on 
[Gitter chat](https://gitter.im/artificialio/sane) to give the ticket a review.

Some things that will increase the chance that your pull request is accepted:

* Use Node idioms and helpers.
* Include tests that fail without your code, and pass with it.
* Update the documentation, the surrounding one, examples elsewhere, guides,
  whatever is affected by your contribution.

#### Syntax

Try to follow the conventions you see used in the source already, this includes:

* Two space for indents, no tabs.
* No trailing whitespace. Blank lines should not have any space.
* Anonymous function declarations should have a space between the function
  keyword and the parameters: `function (a, b) {...`
* Named functions should have no space between the function name and
  the parameters: `function myFunc(a, b) {...`
* All commas should be followed by a space.
* Curly braces should be preceeded by a space.
* Cyclomatic functions like `if` should have a space before their opening 
  parenthesis: `if (true) {...`

#### Inline Documentation Guidelines

All inline documentation is being written using YUIDoc. 
Here's an example of a method block:

```
/**
* My method description.  Describe what it does.  Like other pieces 
* of your comment blocks, this can span multiple lines.
*
* @method methodName
* @param {String} foo Argument 1
* @param {Object} config A config object
* @param {String} config.name The name on the config object
* @param {Function} config.callback A callback function on the config object
* @param {Boolean} [extra=false] Do extra, optional work
* @return {Boolean} Returns true on success
*/
```

To learn more about YUIDoc, see: https://yui.github.io/yuidoc/

#### Code Words

* `thisPropertyName`
* `Global.Class.attribute`
* `thisFunction()`
* `Global.CONSTANT_NAME`
* `true`, `false`, `null`, `undefined` (when referring to programming values)

And in case we didn't emphasize it enough: **we love tests!**

NOTE: Partially copied from https://raw.githubusercontent.com/ember-cli/ember-cli/master/CONTRIBUTING.md
