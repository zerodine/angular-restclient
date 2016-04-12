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
