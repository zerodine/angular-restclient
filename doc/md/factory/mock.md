<a name="MockFactory"></a>
## MockFactory()
**Kind**: global function  
**Nginject**:   

* [MockFactory()](#MockFactory)
  * [~Mock](#MockFactory..Mock)
    * [new Mock()](#new_MockFactory..Mock_new)
    * *[.routes(routes)](#MockFactory..Mock+routes)*
    * *[.request(method, params, body)](#MockFactory..Mock+request) ⇒ <code>\*</code>*

<a name="MockFactory..Mock"></a>
### MockFactory~Mock
**Kind**: inner class of <code>[MockFactory](#MockFactory)</code>  

* [~Mock](#MockFactory..Mock)
  * [new Mock()](#new_MockFactory..Mock_new)
  * *[.routes(routes)](#MockFactory..Mock+routes)*
  * *[.request(method, params, body)](#MockFactory..Mock+request) ⇒ <code>\*</code>*

<a name="new_MockFactory..Mock_new"></a>
#### new Mock()
Abstract mock object in order to mock backend data.

<a name="MockFactory..Mock+routes"></a>
#### *mock.routes(routes)*
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
#### *mock.request(method, params, body) ⇒ <code>\*</code>*
Will be called from the endpoint to actually request the mock.

**Kind**: instance abstract method of <code>[Mock](#MockFactory..Mock)</code>  
**Returns**: <code>\*</code> - Defined in the concret mock  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | The HTTP method as found in the HTTP/1.1 description |
| params | <code>object</code> | All parameters as defined in the route object. Parameters not defined in the route configuration will be requested as query parameters. |
| body | <code>string</code> | The HTTP body as described in HTTP/1.1 |

