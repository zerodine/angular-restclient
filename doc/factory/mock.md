<a name="MockFactory"></a>

## MockFactory
**Kind**: global class  
**Nginject**:   

* [MockFactory](#MockFactory)
    * [~Mock](#MockFactory..Mock)
        * [new Mock()](#new_MockFactory..Mock_new)
        * *[._routes(routes)](#MockFactory..Mock+_routes)*
        * *[.request(method, params, body)](#MockFactory..Mock+request) ⇒ <code>\*</code>*

<a name="MockFactory..Mock"></a>

### MockFactory~Mock
**Kind**: inner class of <code>[MockFactory](#MockFactory)</code>  

* [~Mock](#MockFactory..Mock)
    * [new Mock()](#new_MockFactory..Mock_new)
    * *[._routes(routes)](#MockFactory..Mock+_routes)*
    * *[.request(method, params, body)](#MockFactory..Mock+request) ⇒ <code>\*</code>*

<a name="new_MockFactory..Mock_new"></a>

#### new Mock()
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
<a name="MockFactory..Mock+_routes"></a>

#### *mock._routes(routes)*
Creates a object representing all the defined routes for a specific mock. Implemented in the constructor of the concrete mock.

**Kind**: instance abstract method of <code>[Mock](#MockFactory..Mock)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| routes | <code>object</code> | All route definition for this mock |

**Example**  
```js
function TestUsersMock() {
     this._routes({
         '[GET]/': this.get,
         '[GET]/:id': this.getUser,
         '[POST]/': this.postUser,
         '[POST]/:id/:controller': this.postUserCompany,
         '[PUT]/:id': this.putUser
     })
}
```
<a name="MockFactory..Mock+request"></a>

#### *mock.request(method, params, body) ⇒ <code>\*</code>*
Will be called from the endpoint to actually request the mock.

**Kind**: instance abstract method of <code>[Mock](#MockFactory..Mock)</code>  
**Returns**: <code>\*</code> - Defined in the concret mock  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method as found in the HTTP/1.1 description |
| params | <code>Array</code> | All parameters as defined in the route object. Parameters not defined in the route configuration will be requested as query parameters. |
| body | <code>string</code> | The HTTP body as described in HTTP/1.1 |

