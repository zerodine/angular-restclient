## Classes
<dl>
<dt><a href="#EndpointConfig">EndpointConfig</a></dt>
<dd></dd>
<dt><a href="#Endpoint">Endpoint</a></dt>
<dd></dd>
<dt><a href="#Model">Model</a></dt>
<dd></dd>
</dl>
<a name="EndpointConfig"></a>
## EndpointConfig
**Kind**: global class  

* [EndpointConfig](#EndpointConfig)
  * [new EndpointConfig()](#new_EndpointConfig_new)
  * [.route(route)](#EndpointConfig+route) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.model(model)](#EndpointConfig+model) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.container(container)](#EndpointConfig+container) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.actions()](#EndpointConfig+actions) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>
  * [.baseRoute()](#EndpointConfig+baseRoute) ⇒ <code>[EndpointConfig](#EndpointConfig)</code>

<a name="new_EndpointConfig_new"></a>
### new EndpointConfig()
This class represents one configuration for an endpoint

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
<a name="Endpoint"></a>
## Endpoint
**Kind**: global class  
**Nginject**:   

* [Endpoint](#Endpoint)
  * [new Endpoint(endpoint, endpointConfig, baseRoute, headResponseHeaderPrefix, $resource, $log, $injector, $q)](#new_Endpoint_new)
  * [.get(params)](#Endpoint+get) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.head(params)](#Endpoint+head) ⇒ <code>Promise.&lt;(object\|Error)&gt;</code>
  * [.update(params, model)](#Endpoint+update) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.save(params, model)](#Endpoint+save) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
  * [.remove(params, model)](#Endpoint+remove) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>

<a name="new_Endpoint_new"></a>
### new Endpoint(endpoint, endpointConfig, baseRoute, headResponseHeaderPrefix, $resource, $log, $injector, $q)
Class representing an Endpoint with all the functionality for receiving, saving and updating data from the backend


| Param | Type | Description |
| --- | --- | --- |
| endpoint | <code>string</code> | The name of the endpoint |
| endpointConfig | <code>[EndpointConfig](#EndpointConfig)</code> | Config of the endpoint which was defined earlier |
| baseRoute | <code>string</code> | URL to the backend |
| headResponseHeaderPrefix | <code>string</code> | Prefix of head request header |
| $resource | <code>$resource</code> | The Angular $resource factory |
| $log | <code>$log</code> | The Angular $log factory |
| $injector | <code>$injector</code> | The Angular $injector factory |
| $q | <code>$q</code> | The Angular $q factory |

<a name="Endpoint+get"></a>
### endpoint.get(params) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Call an endpoint and map the response to one or more models given in the endpoint config
The server response must be an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |

<a name="Endpoint+head"></a>
### endpoint.head(params) ⇒ <code>Promise.&lt;(object\|Error)&gt;</code>
Call an endpoint with the HEAD method

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |

<a name="Endpoint+update"></a>
### endpoint.update(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Update an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |
| model | <code>Model/array</code> | The model to be updated |

<a name="Endpoint+save"></a>
### endpoint.save(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Save an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |
| model | <code>[Model](#Model)</code> | The model to be updated |

<a name="Endpoint+remove"></a>
### endpoint.remove(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Remove an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |
| model | <code>[Model](#Model)</code> | The model to be updated |

<a name="Model"></a>
## Model
**Kind**: global class  

* [Model](#Model)
  * [new Model()](#new_Model_new)
  * [.afterLoad()](#Model+afterLoad)
  * [.beforeSave()](#Model+beforeSave)
  * [.init(object)](#Model+init)
  * ~~[.callBeforeSave(models)](#Model+callBeforeSave)~~
  * [.isValid()](#Model+isValid)

<a name="new_Model_new"></a>
### new Model()
Abstract model class

<a name="Model+afterLoad"></a>
### model.afterLoad()
This method gets called after the response was transformed into te model.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#Model)</code>  
<a name="Model+beforeSave"></a>
### model.beforeSave()
This method gets called before a model gets sent to the backend.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#Model)</code>  
<a name="Model+init"></a>
### model.init(object)
Every model must call this method in it's constructor. It in charge of mapping the given object to the model.

**Kind**: instance method of <code>[Model](#Model)</code>  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | The given object. This can come ether from the backend or created manualy |

<a name="Model+callBeforeSave"></a>
### ~~model.callBeforeSave(models)~~
***Deprecated***

This method can be used to call the beforeSave method on a related model.

**Kind**: instance method of <code>[Model](#Model)</code>  

| Param | Type | Description |
| --- | --- | --- |
| models | <code>Model/array</code> | Can ether be a model or an array of models |

<a name="Model+isValid"></a>
### model.isValid()
Validate the properties of the model

**Kind**: instance method of <code>[Model](#Model)</code>  
