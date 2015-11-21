[![Bower version](https://badge.fury.io/bo/angular-restclient.svg)](https://badge.fury.io/bo/angular-restclient)
[![npm version](https://badge.fury.io/js/angular-restclient.svg)](https://badge.fury.io/js/angular-restclient)
[![Build Status](https://travis-ci.org/zerodine/angular-restclient.svg?branch=master)](https://travis-ci.org/zerodine/angular-restclient)

#angular-restclient
Angular-restclient is a angular module to help you simplify any REST-based WebApp. It abstracts a RESTful (json) backend and gives you a extra layer. With that it's super easy to do any HTTP requests as GET, POST, PUT, DELETE and so on.

##Features
* Configure all endpoints individually
* Models gives you a whole new flexibility
* Mocks let you develop even when the backend is not fully ready yet
* Simple syntax
* Fully promise based architecture

##Getting started
###Requirements
* angular > 1.2.x
* angular-resource > 1.2.x

###Install
You can ether use bower, npm or git-clone to install angular-restclient. We recommend bower.

####bower
```sh
$ bower install angular-restclient --save
```

####npm
```sh
$ npm install angular-restclient --save
```

###HTML
Load angular-resource.js and angular-restclient.js into your HTML page:
```html
<script src="../bower_components/angular/angular[.min].js"></script>
<script src="../bower_components/angular-resource/angular-resource[.min].js"></script>
<script src="../bower_components/angular-restclient/dist/angular-restclient[.min].js"></script>
```

###Load Module
Make your application module depend on the restclient module:
```js
var app = angular.module('myApp', ['ngResource', 'restclient']);
```

###Sample Configuration
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

###Model example
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

###Make a call
Last we make a call to the backend.

####Get all users
```js
app.controller('Ctrl', function(api) {
    api.users.get().then(function(users) {
        $scope.users = users;
    }, function(error) {
        // error handling
    });
});
```

####Get specific user
```js
app.controller('Ctrl', function(api) {
    api.users.get({id: 1}).then(function(user) {
        $scope.users = user;
    }, function(error) {
        // error handling
    });
});
```

##API Documentation
###Providers
* [ApiProvider](#ApiProvider)

###Factories
* [Model](#ModelFactory..Model)
* [Mock](#MockFactory..Mock)
* [Validator](#ValidatorFactory..Validator)

###Classes
* [Endpoint](#Endpoint)
* [EndpointConfig](#EndpointConfig)
* [EndpointMock](#EndpointMock)

###Abstract Classes
* [EndpointAbstract](#EndpointAbstract)

###Interfaces
* [EndpointInterface](#EndpointInterface)

<a name="ApiProvider"></a>
## ApiProvider
**Kind**: global class  

* [ApiProvider](#ApiProvider)
  * [new ApiProvider()](#new_ApiProvider_new)
  * [._endpoints](#ApiProvider+_endpoints) : <code>object</code>
  * [.baseRoute](#ApiProvider+baseRoute) : <code>string</code>
  * [.headResponseHeaderPrefix](#ApiProvider+headResponseHeaderPrefix) : <code>string</code>
  * [.baseRoute(baseRoute)](#ApiProvider+baseRoute)
  * [.headResponseHeaderPrefix(headResponseHeaderPrefix)](#ApiProvider+headResponseHeaderPrefix)
  * [.endpoint(endpoint)](#ApiProvider+endpoint) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.$get($injector)](#ApiProvider+$get)

<a name="new_ApiProvider_new"></a>
### new ApiProvider()
AngularJD provider to provide the api

<a name="ApiProvider+_endpoints"></a>
### apiProvider._endpoints : <code>object</code>
All the endpoints

**Kind**: instance property of <code>[ApiProvider](#ApiProvider)</code>  
**Access:** protected  
<a name="ApiProvider+baseRoute"></a>
### apiProvider.baseRoute : <code>string</code>
The base route to the backend api

**Kind**: instance property of <code>[ApiProvider](#ApiProvider)</code>  
<a name="ApiProvider+headResponseHeaderPrefix"></a>
### apiProvider.headResponseHeaderPrefix : <code>string</code>
Prefix of a header in a HEAD response

**Kind**: instance property of <code>[ApiProvider](#ApiProvider)</code>  
<a name="ApiProvider+baseRoute"></a>
### apiProvider.baseRoute(baseRoute)
Set the base route

**Kind**: instance method of <code>[ApiProvider](#ApiProvider)</code>  

| Param | Type |
| --- | --- |
| baseRoute | <code>string</code> | 

<a name="ApiProvider+headResponseHeaderPrefix"></a>
### apiProvider.headResponseHeaderPrefix(headResponseHeaderPrefix)
Set the head response header prefix

**Kind**: instance method of <code>[ApiProvider](#ApiProvider)</code>  

| Param | Type |
| --- | --- |
| headResponseHeaderPrefix | <code>string</code> | 

<a name="ApiProvider+endpoint"></a>
### apiProvider.endpoint(endpoint) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Add an endpoint to the endpoint array

**Kind**: instance method of <code>[ApiProvider](#ApiProvider)</code>  

| Param | Type |
| --- | --- |
| endpoint | <code>string</code> | 

<a name="ApiProvider+$get"></a>
### apiProvider.$get($injector)
The factory method

**Kind**: instance method of <code>[ApiProvider](#ApiProvider)</code>  
**Nginject**:   

| Param | Type |
| --- | --- |
| $injector | <code>$injector</code> | 


<a name="ModelFactory..Model"></a>
## ModelFactory~Model
**Kind**: inner class of <code>[ModelFactory](#ModelFactory)</code>  

* [~Model](#ModelFactory..Model)
  * [new Model()](#new_ModelFactory..Model_new)
  * [._foreignData](#ModelFactory..Model+_foreignData) : <code>object</code>
  * [.reference](#ModelFactory..Model+reference) : <code>string</code>
  * [.clean()](#ModelFactory..Model+clean)
  * [._afterLoad()](#ModelFactory..Model+_afterLoad)
  * [._beforeSave()](#ModelFactory..Model+_beforeSave)
  * [._init(object)](#ModelFactory..Model+_init)
  * [._mapArray(property, apiProperty, modelName)](#ModelFactory..Model+_mapArray)
  * [._mapProperty(property, apiProperty, modelName)](#ModelFactory..Model+_mapProperty)
  * [._referenceOnly(models)](#ModelFactory..Model+_referenceOnly)
  * [.isValid()](#ModelFactory..Model+isValid)

<a name="new_ModelFactory..Model_new"></a>
### new Model()
Abstract model class

**Example**  
```js
angular.module('UserModel', [])
 .factory('UserModel', function(Model) {

     angular.extend(UserModel.prototype, Model.prototype);

      function UserModel(object) {

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

          this.fullname = {
              type: 'string',
              save: false
          };

          // Map the given object
          this._init(object);
      }

      UserModel.prototype._afterLoad = function() {
          this.fullname = this._foreignData['firstname'] + ' ' + this._foreignData['lastname'];
      };

      UserModel.prototype._beforeSave = function() {
          this.firstname = this.firstname + '_';
      };

      return UserModel;
 })
```
<a name="ModelFactory..Model+_foreignData"></a>
### model._foreignData : <code>object</code>
Holds the original object as it was injected.
This gets deleted after the model is fully initialized.

**Kind**: instance property of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  
**Example**  
```js
ConcreteModel.prototype._afterLoad = function() {
     this.full_name = this._foreignData['first_name'] + ' ' + this._foreignData['last_name'];
};
```
<a name="ModelFactory..Model+reference"></a>
### model.reference : <code>string</code>
The reference is used to get the identifier of a model

**Kind**: instance property of <code>[Model](#ModelFactory..Model)</code>  
**Example**  
```js
ConcreteModel.prototype.reference = 'identifier';
```
<a name="ModelFactory..Model+clean"></a>
### model.clean()
This method gets called by the endpoint before the model is sent to the backend.
It removes all decorator methods and attributes from a model so its clean to be sent.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
<a name="ModelFactory..Model+_afterLoad"></a>
### model._afterLoad()
This method gets called after the response was transformed into te model.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  
**Example**  
```js
ConcreteModel.prototype._afterLoad = function() {
     this.activation_token = this.activation_token.toUpperCase();
};
```
<a name="ModelFactory..Model+_beforeSave"></a>
### model._beforeSave()
This method gets called before a model gets sent to the backend.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  
**Example**  
```js
ConcreteModel.prototype._beforeSave = function() {
     this.activation_token = this.activation_token.toLowerCase();
};
```
<a name="ModelFactory..Model+_init"></a>
### model._init(object)
Every model must call this method in it's constructor. It in charge of mapping the given object to the model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | The given object. This can come ether from the backend or created manually. |

<a name="ModelFactory..Model+_mapArray"></a>
### model._mapArray(property, apiProperty, modelName)
Maps an array of models to a property.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | The property which should be mapped |
| apiProperty | <code>array</code> | Foreign property as it comes from the backend |
| modelName | <code>string</code> | Name of the model which is used for the mapping |

<a name="ModelFactory..Model+_mapProperty"></a>
### model._mapProperty(property, apiProperty, modelName)
Maps a model to an property.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | The property which should be mapped |
| apiProperty | <code>string</code> | Foreign property as it comes from the api |
| modelName | <code>string</code> | Name of the model which is used for the matching |

<a name="ModelFactory..Model+_referenceOnly"></a>
### model._referenceOnly(models)
Returns only the reference of a related model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type |
| --- | --- |
| models | <code>Model/array.&lt;Model&gt;</code> | 

<a name="ModelFactory..Model+isValid"></a>
### model.isValid()
Validates the properties of the model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  

<a name="MockFactory..Mock"></a>
## MockFactory~Mock
**Kind**: inner class of <code>[MockFactory](#MockFactory)</code>  

* [~Mock](#MockFactory..Mock)
  * [new Mock()](#new_MockFactory..Mock_new)
  * *[.routes(routes)](#MockFactory..Mock+routes)*
  * *[.request(method, params, body)](#MockFactory..Mock+request) ⇒ <code>\*</code>*

<a name="new_MockFactory..Mock_new"></a>
### new Mock()
Abstract mock object in order to mock backend data.

**Example**  
```js
angular.module('UsersMock', [])
 .factory('UsersMock', function(Mock) {
      angular.extend(UsersMock.prototype, Mock.prototype);

      function TestUsersMock() {
          // Define routes for this mock with a reference to a method
          this.routes({
              '[GET]/': this.get
          })
      }

      UsersMock.prototype.get = function() {
          return {
              users: [
                  {
                      id: 1,
                      firstname: 'Jack',
                      lastname: 'Bauer'
                  },
                  {
                      id: 2,
                      firstname: 'Sandra',
                      lastname: 'Bullock'
                  }
              ]
          }
      };

      return UsersMock;
 }
)
```
<a name="MockFactory..Mock+routes"></a>
### *mock.routes(routes)*
Creates a object representing all the defined routes for a specific mock. Implemented in the constructor of the concrete mock.

**Kind**: instance abstract method of <code>[Mock](#MockFactory..Mock)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| routes | <code>object</code> | All route definition for this mock |

**Example**  
```js
function TestUsersMock() {
     this.routes({
         '[GET]/': this.get,
         '[GET]/:id': this.getUser,
         '[POST]/': this.postUser,
         '[POST]/:id/:controller': this.postUserCompany,
         '[PUT]/:id': this.putUser
     })
}
```
<a name="MockFactory..Mock+request"></a>
### *mock.request(method, params, body) ⇒ <code>\*</code>*
Will be called from the endpoint to actually request the mock.

**Kind**: instance abstract method of <code>[Mock](#MockFactory..Mock)</code>  
**Returns**: <code>\*</code> - Defined in the concret mock  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method as found in the HTTP/1.1 description |
| params | <code>object</code> | All parameters as defined in the route object. Parameters not defined in the route configuration will be requested as query parameters. |
| body | <code>string</code> | The HTTP body as described in HTTP/1.1 |


<a name="ValidatorFactory..Validator"></a>
## ValidatorFactory~Validator
**Kind**: inner class of <code>[ValidatorFactory](#ValidatorFactory)</code>  

* [~Validator](#ValidatorFactory..Validator)
  * [new Validator()](#new_ValidatorFactory..Validator_new)
  * [.string(string)](#ValidatorFactory..Validator+string) ⇒ <code>boolean</code>
  * [.int(int)](#ValidatorFactory..Validator+int) ⇒ <code>boolean</code>
  * [.email(email)](#ValidatorFactory..Validator+email) ⇒ <code>boolean</code>
  * [.relation(relation)](#ValidatorFactory..Validator+relation) ⇒ <code>boolean</code>
  * [.boolean(boolean)](#ValidatorFactory..Validator+boolean) ⇒ <code>boolean</code>
  * [.date(date)](#ValidatorFactory..Validator+date) ⇒ <code>boolean</code>
  * [.float(float)](#ValidatorFactory..Validator+float) ⇒ <code>boolean</code>

<a name="new_ValidatorFactory..Validator_new"></a>
### new Validator()
Helper class to validate a model

<a name="ValidatorFactory..Validator+string"></a>
### validator.string(string) ⇒ <code>boolean</code>
Checks if the given parameter is a string

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| string | 

<a name="ValidatorFactory..Validator+int"></a>
### validator.int(int) ⇒ <code>boolean</code>
Checks if the given parameter is a string

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| int | 

<a name="ValidatorFactory..Validator+email"></a>
### validator.email(email) ⇒ <code>boolean</code>
Checks if the given parameter is a email

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| email | 

<a name="ValidatorFactory..Validator+relation"></a>
### validator.relation(relation) ⇒ <code>boolean</code>
Checks if the given parameter is a relation

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| relation | 

<a name="ValidatorFactory..Validator+boolean"></a>
### validator.boolean(boolean) ⇒ <code>boolean</code>
Checks if the given parameter is a boolean

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| boolean | 

<a name="ValidatorFactory..Validator+date"></a>
### validator.date(date) ⇒ <code>boolean</code>
Checks if the given parameter is a date

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| date | 

<a name="ValidatorFactory..Validator+float"></a>
### validator.float(float) ⇒ <code>boolean</code>
Checks if the given parameter is a float

**Kind**: instance method of <code>[Validator](#ValidatorFactory..Validator)</code>  

| Param |
| --- |
| float | 


<a name="Endpoint"></a>
## Endpoint
**Kind**: global class  

* [Endpoint](#Endpoint)
  * [new Endpoint(endpointConfig, $injector)](#new_Endpoint_new)
  * [._endpointConfig](#Endpoint+_endpointConfig) : <code>[EndpointConfig](#EndpointConfig)</code>
  * [._resource](#Endpoint+_resource) : <code>$resource</code>
  * [._log](#Endpoint+_log) : <code>$log</code>
  * [._injector](#Endpoint+_injector) : <code>$injector</code>
  * [._q](#Endpoint+_q) : <code>$q</code>
  * [.get(params)](#Endpoint+get) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.head(params)](#Endpoint+head) ⇒ <code>Promise.&lt;(object\|Error)&gt;</code>
  * [.put(params, model)](#Endpoint+put) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.post(params, model)](#Endpoint+post) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.delete(params, model)](#Endpoint+delete) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>

<a name="new_Endpoint_new"></a>
### new Endpoint(endpointConfig, $injector)
Class representing an Endpoint with all the functionality for receiving, saving and updating data from the backend


| Param | Type | Description |
| --- | --- | --- |
| endpointConfig | <code>[EndpointConfig](#EndpointConfig)</code> | Config of the endpoint which was defined earlier |
| $injector | <code>$injector</code> | The Angular $injector factory |

<a name="Endpoint+_endpointConfig"></a>
### endpoint._endpointConfig : <code>[EndpointConfig](#EndpointConfig)</code>
The EndpointConfig object defined for this endpoint

**Kind**: instance property of <code>[Endpoint](#Endpoint)</code>  
**Access:** protected  
<a name="Endpoint+_resource"></a>
### endpoint._resource : <code>$resource</code>
An instance if the $resource factory from the angularjs library

**Kind**: instance property of <code>[Endpoint](#Endpoint)</code>  
**Access:** protected  
<a name="Endpoint+_log"></a>
### endpoint._log : <code>$log</code>
An instance if the $log factory from the angularjs library

**Kind**: instance property of <code>[Endpoint](#Endpoint)</code>  
**Access:** protected  
<a name="Endpoint+_injector"></a>
### endpoint._injector : <code>$injector</code>
An instance if the $injector factory from the angularjs library

**Kind**: instance property of <code>[Endpoint](#Endpoint)</code>  
**Access:** protected  
<a name="Endpoint+_q"></a>
### endpoint._q : <code>$q</code>
An instance if the $q factory from the angularjs library

**Kind**: instance property of <code>[Endpoint](#Endpoint)</code>  
**Access:** protected  
<a name="Endpoint+get"></a>
### endpoint.get(params) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Call an endpoint and map the response to one or more models given in the endpoint config.
The server response must be an object.

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |

<a name="Endpoint+head"></a>
### endpoint.head(params) ⇒ <code>Promise.&lt;(object\|Error)&gt;</code>
Call an endpoint with the HEAD method.

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |

<a name="Endpoint+put"></a>
### endpoint.put(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Update an object.

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters. |
| model | <code>Model/array</code> | The model to be updated. |

<a name="Endpoint+post"></a>
### endpoint.post(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Save an object.

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters. |
| model | <code>Model</code> | The model to be updated. |

<a name="Endpoint+delete"></a>
### endpoint.delete(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Remove an object.

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters. |
| model | <code>Model</code> | The model to be updated. |


<a name="EndpointConfig"></a>
## EndpointConfig
**Kind**: global class  

* [EndpointConfig](#EndpointConfig)
  * [new EndpointConfig()](#new_EndpointConfig_new)
  * [.name](#EndpointConfig+name) : <code>string</code>
  * [.headResponseHeaderPrefix](#EndpointConfig+headResponseHeaderPrefix) : <code>string</code>
  * [.route(route)](#EndpointConfig+route) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.model(model)](#EndpointConfig+model) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.container(container)](#EndpointConfig+container) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.actions()](#EndpointConfig+actions) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.baseRoute()](#EndpointConfig+baseRoute) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.mock()](#EndpointConfig+mock) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>

<a name="new_EndpointConfig_new"></a>
### new EndpointConfig()
This class represents one configuration for an endpoint.

<a name="EndpointConfig+name"></a>
### endpointConfig.name : <code>string</code>
Name of the endpoint

**Kind**: instance property of <code>[EndpointConfig](#EndpointConfig)</code>  
<a name="EndpointConfig+headResponseHeaderPrefix"></a>
### endpointConfig.headResponseHeaderPrefix : <code>string</code>
Prefix of any custom headers

**Kind**: instance property of <code>[EndpointConfig](#EndpointConfig)</code>  
<a name="EndpointConfig+route"></a>
### endpointConfig.route(route) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Set the route to this endpoint

**Kind**: instance method of <code>[EndpointConfig](#EndpointConfig)</code>  
**Returns**: <code>[EndpointConfig](#EndpointConfig)</code> - Returns the endpoint config object  

| Param | Type | Description |
| --- | --- | --- |
| route | <code>string</code> | The endpoint route defined as string |

<a name="EndpointConfig+model"></a>
### endpointConfig.model(model) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Set the model that is used to transform the response

**Kind**: instance method of <code>[EndpointConfig](#EndpointConfig)</code>  
**Returns**: <code>[EndpointConfig](#EndpointConfig)</code> - Returns the endpoint config object  

| Param | Type | Description |
| --- | --- | --- |
| model | <code>string</code> | The model defined as string |

<a name="EndpointConfig+container"></a>
### endpointConfig.container(container) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Set the container that wraps the response. Default is null.

**Kind**: instance method of <code>[EndpointConfig](#EndpointConfig)</code>  
**Returns**: <code>[EndpointConfig](#EndpointConfig)</code> - Returns the endpoint config object  

| Param | Type | Description |
| --- | --- | --- |
| container | <code>string</code> | The container defined as string |

<a name="EndpointConfig+actions"></a>
### endpointConfig.actions() ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Define if the response from the api is going to be an array

**Kind**: instance method of <code>[EndpointConfig](#EndpointConfig)</code>  
**Returns**: <code>[EndpointConfig](#EndpointConfig)</code> - Returns the endpoint config object  
<a name="EndpointConfig+baseRoute"></a>
### endpointConfig.baseRoute() ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Overwrites the baseRoute from the global configuration

**Kind**: instance method of <code>[EndpointConfig](#EndpointConfig)</code>  
**Returns**: <code>[EndpointConfig](#EndpointConfig)</code> - Returns the endpoint config object  
<a name="EndpointConfig+mock"></a>
### endpointConfig.mock() ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
Overwrites the mock from the global configuration

**Kind**: instance method of <code>[EndpointConfig](#EndpointConfig)</code>  
**Returns**: <code>[EndpointConfig](#EndpointConfig)</code> - Returns the endpoint config object  

<a name="EndpointMock"></a>
## EndpointMock
**Kind**: global class  

* [EndpointMock](#EndpointMock)
  * [new EndpointMock(endpointConfig, $injector)](#new_EndpointMock_new)
  * [._extractParams(params)](#EndpointMock+_extractParams) ⇒ <code>Array</code>
  * [.get(params)](#EndpointMock+get) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.post()](#EndpointMock+post) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.put(params, model)](#EndpointMock+put) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>

<a name="new_EndpointMock_new"></a>
### new EndpointMock(endpointConfig, $injector)
EndpointMock provides all methods which Endpoint provides but sends the request to mocks


| Param | Description |
| --- | --- |
| endpointConfig | EndpointConfig of the Endpoint |
| $injector | The angular $injector provider |

<a name="EndpointMock+_extractParams"></a>
### endpointMock._extractParams(params) ⇒ <code>Array</code>
Order all params according the endpoints route

**Kind**: instance method of <code>[EndpointMock](#EndpointMock)</code>  
**Returns**: <code>Array</code> - Ordered according route  
**Access:** protected  

| Param | Description |
| --- | --- |
| params | Params as unordered object |

<a name="EndpointMock+get"></a>
### endpointMock.get(params) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Receive the mocks content

**Kind**: instance method of <code>[EndpointMock](#EndpointMock)</code>  
**Returns**: <code>Promise.&lt;(Model\|Error)&gt;</code> - Promise with models  

| Param | Description |
| --- | --- |
| params | Request parameter |

<a name="EndpointMock+post"></a>
### endpointMock.post() ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Save an model to a mock endpoint

**Kind**: instance method of <code>[EndpointMock](#EndpointMock)</code>  
**Returns**: <code>Promise.&lt;(Model\|Error)&gt;</code> - with model  
<a name="EndpointMock+put"></a>
### endpointMock.put(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Update an existing model

**Kind**: instance method of <code>[EndpointMock](#EndpointMock)</code>  
**Returns**: <code>Promise.&lt;(Model\|Error)&gt;</code> - Updated model  

| Param | Description |
| --- | --- |
| params | Request parameters |
| model | Model to update |


<a name="EndpointAbstract"></a>
## EndpointAbstract
**Kind**: global class  
**Implements:** <code>[EndpointInterface](#EndpointInterface)</code>  

* [EndpointAbstract](#EndpointAbstract)
  * [new EndpointAbstract()](#new_EndpointAbstract_new)
  * *[._mapResult(data)](#EndpointAbstract+_mapResult) ⇒ <code>Model</code> &#124; <code>Array</code>*
  * *[._getPagination(data)](#EndpointAbstract+_getPagination) ⇒ <code>object</code>*
  * *[.update()](#EndpointAbstract+update)*
  * *[.save()](#EndpointAbstract+save)*
  * *[.remove()](#EndpointAbstract+remove)*

<a name="new_EndpointAbstract_new"></a>
### new EndpointAbstract()
Abstract Endpoint class with all helper methods

<a name="EndpointAbstract+_mapResult"></a>
### *endpointAbstract._mapResult(data) ⇒ <code>Model</code> &#124; <code>Array</code>*
Maps an object or array to the endpoint model

**Kind**: instance abstract method of <code>[EndpointAbstract](#EndpointAbstract)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Object or array of raw data |

<a name="EndpointAbstract+_getPagination"></a>
### *endpointAbstract._getPagination(data) ⇒ <code>object</code>*
Extract the pagination data from the result

**Kind**: instance abstract method of <code>[EndpointAbstract](#EndpointAbstract)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>object</code> | Object or array of raw data |

<a name="EndpointAbstract+update"></a>
### *endpointAbstract.update()*
**Kind**: instance abstract method of <code>[EndpointAbstract](#EndpointAbstract)</code>  
<a name="EndpointAbstract+save"></a>
### *endpointAbstract.save()*
**Kind**: instance abstract method of <code>[EndpointAbstract](#EndpointAbstract)</code>  
<a name="EndpointAbstract+remove"></a>
### *endpointAbstract.remove()*
**Kind**: instance abstract method of <code>[EndpointAbstract](#EndpointAbstract)</code>  

<a name="EndpointInterface"></a>
## EndpointInterface
**Kind**: global class  

* [EndpointInterface](#EndpointInterface)
  * [new EndpointInterface()](#new_EndpointInterface_new)
  * [.get()](#EndpointInterface+get)
  * [.post()](#EndpointInterface+post)
  * [.delete()](#EndpointInterface+delete)
  * [.put()](#EndpointInterface+put)
  * [.head()](#EndpointInterface+head)

<a name="new_EndpointInterface_new"></a>
### new EndpointInterface()
Used to make sure that all HTTP/1.1 methods are implemented

<a name="EndpointInterface+get"></a>
### endpointInterface.get()
HTTP/1.1 GET method

**Kind**: instance method of <code>[EndpointInterface](#EndpointInterface)</code>  
<a name="EndpointInterface+post"></a>
### endpointInterface.post()
HTTP/1.1 POST method

**Kind**: instance method of <code>[EndpointInterface](#EndpointInterface)</code>  
<a name="EndpointInterface+delete"></a>
### endpointInterface.delete()
HTTP/1.1 DELETE method

**Kind**: instance method of <code>[EndpointInterface](#EndpointInterface)</code>  
<a name="EndpointInterface+put"></a>
### endpointInterface.put()
HTTP/1.1 PUT method

**Kind**: instance method of <code>[EndpointInterface](#EndpointInterface)</code>  
<a name="EndpointInterface+head"></a>
### endpointInterface.head()
HTTP/1.1 HEAD method

**Kind**: instance method of <code>[EndpointInterface](#EndpointInterface)</code>  
