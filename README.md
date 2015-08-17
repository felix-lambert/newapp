InTouch
===========

InTouch is build with the help of node.JS, Express, AngularJS, Socket.IO and MongoDB.
It includes a server built in node.js and a html client built with AngularJS.

## Libraries used
### Backend
<ul>
  <li>node.js</li>
  <li>socket.io</li>
  <li>Express</li>
  <li>underscore</li>
</ul>

### Frontend
<ul>
  <li>AngularJS</li>
  <li>Angular-Bootsrap (angular-ui)</li>
  <li>Font Awesome</li>
</ul>

## Installation

The installation of certain tools can be a bit annoying, but these then
become inseparable friends to all developer. We will not explain how
to install each and every one of these tools, especially because their
sites do much better than what we could do ourselves:

### Requirements

-   [node.JS](http://nodejs.org)
-   [MongoDB](http://www.mongodb.org/)


### Install 

### Live demo

For a live demo go to:

  http://intouchdev.herokuapp.com

##Signing up, and deploying to Heroku

###Documentation

From heroku.com, click Documentation, then click the Getting Started button, then click Node.js from the list of options on the left...which will take you here: https://devcenter.heroku.com/articles/nodejs 

Install Heroku toolbelt from here: https://toolbelt.heroku.com/

Sign up via the website (no credit card required).

Login using the command line tool:

    heroku login

Create your heroku app:

    heroku create

Git deploy your app:

    git push heroku master

Assign a dyno to your app:

    heroku ps:scale web=1

Open the app (same as opening it in the browser):

    heroku open

And your app should be up on Heroku.


### Install InTouch

If you have these 2 tools installed, go to terminal and type:
    npm install

Go to terminal and run `grunt`.

Point your browser to `http://127.0.0.1:8000` 

InTouch uses [PassportJS](http://passportjs.org) for authentication with Google, LinkedIn and Facebook.

Enjoy!
