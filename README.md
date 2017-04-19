[![Bower version](https://badge.fury.io/bo/angular-restclient.svg)](https://badge.fury.io/bo/angular-restclient)
[![npm version](https://badge.fury.io/js/angular-restclient.svg)](https://badge.fury.io/js/angular-restclient)
[![Build Status](https://travis-ci.org/zerodine/angular-restclient.svg?branch=master)](https://travis-ci.org/zerodine/angular-restclient)

# angular-restclient
Angular-restclient is a angular module to help you simplify any REST-based WebApp. It abstracts a RESTful (json) backend and gives you a extra layer. With that it's super easy to do any HTTP requests as GET, POST, PUT, DELETE and so on.

## Features
* Configure all endpoints individually
* Models gives you a whole new flexibility
* Mocks let you develop even when the backend is not fully ready yet
* Simple syntax
* Fully promise based architecture

## Getting started
### Requirements
* angular > 1.2.x
* angular-resource > 1.2.x

### Install
You can ether use bower, npm or git-clone to install angular-restclient. We recommend bower.

#### bower
```sh
$ bower install angular-restclient --save
```

#### npm
```sh
$ npm install angular-restclient --save
```

### HTML
Load angular-resource.js and angular-restclient.js into your HTML page:
```html
<script src="../bower_components/angular/angular[.min].js"></script>
<script src="../bower_components/angular-resource/angular-resource[.min].js"></script>
<script src="../bower_components/angular-restclient/dist/angular-restclient[.min].js"></script>
```

### Load Module
Make your application module depend on the restclient module:
```js
var app = angular.module('myApp', ['ngResource', 'restclient']);
```

### Sample Configuration
The configuration is super simple. This is a sample configuration. We define a baseRoute to the backend with two endpoints users and posts.
```js
app.config(function(apiProvider) {
    apiProvider.baseRoute('http://localhost/api');

    apiProvider.endpoint('users')
        .route('/users/:id/:controller')
        .model('User');
    apiProvider.endpoint('posts')
        .route('/posts/:id')
        .model('Post');
});
```

### Model example
Every endpoint must have a model defined. At first this seems like a lot of work but its worth it. This extra layer gives you a lot of flexibility. For example: When you have to manipulate the RESTful data you can do it once in the model and access it throughout your whole application. Here is a example of a user model:
```js
app.factory('User', function(Model) {
    function User(object) {
    
        this.id = {
            type: 'string',
            save: false
        };
        
        this.firstname = {
            type: 'string'
        };
        
        this.lastname = {
            type: 'string'
        };
        
        this.email = {
            type: 'email'
        };
        
        this.posts = {
            type: 'relation',
            relation: {
                type: 'many',
                model: 'Post'
            },
            save: false
        };
        
        // Map the given object
        this._init(object);
    }

    angular.extend(User.prototype, Model.prototype);

    return User;
});
```

### Make a call
Last we make a call to the backend.

#### Get all users
```js
app.controller('Ctrl', function(api) {
    api.users.get().then(function(users) {
        $scope.users = users;
    }, function(error) {
        // error handling
    });
});
```

#### Get specific user
```js
app.controller('Ctrl', function(api) {
    api.users.get({id: 1}).then(function(user) {
        $scope.users = user;
    }, function(error) {
        // error handling
    });
});
```

## API Documentation
### Providers
* [ApiProvider](doc/provider/api.md)

### Factories
* [Model](doc/factory/model.md)
* [Mock](doc/factory/mock.md)
* [Validator](doc/factory/validator.md)

### Classes
* [Endpoint](doc/pojo/endpoint.md)
* [EndpointConfig](doc/pojo/endpointConfig.md)
* [EndpointMock](doc/pojo/endpointMock.md)

### Abstract Classes
* [EndpointAbstract](doc/pojo/endpointAbstract.md)

### Interfaces
* [EndpointInterface](doc/pojo/endpointInterface.md)
