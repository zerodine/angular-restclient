#angular-restclient
An angularJS rest client with ORM

##Install
```sh
$ bower install angular-restclient --save
```

##Load Module
```js
var app = angular.module('app', ['restclient']);
```

##Configuration
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

##Model example
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
        this.init(object);
    }

    angular.extend(User.prototype, Model.prototype);

    return User;
});
```

##Make a call
```js
app.controller('Ctrl', function(api) {
    api.users.get().then(function(data) {
        $scope.users = data;
    });
});
```

##More information
Read the [API Documentation](doc/md/angular-restclient.md)
