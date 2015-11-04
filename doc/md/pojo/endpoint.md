## Classes
<dl>
<dt><a href="#Endpoint">Endpoint</a></dt>
<dd></dd>
</dl>
## Members
<dl>
<dt><a href="#endpointConfig">endpointConfig</a> : <code>EndpointConfig</code></dt>
<dd><p>The EndpointConfig object defined for this endpoint</p>
</dd>
<dt><a href="#resource">resource</a> : <code>$resource</code></dt>
<dd><p>An instance if the $resource factory from the angularjs library</p>
</dd>
<dt><a href="#log">log</a> : <code>$log</code></dt>
<dd><p>An instance if the $log factory from the angularjs library</p>
</dd>
<dt><a href="#injector">injector</a> : <code>$injector</code></dt>
<dd><p>An instance if the $injector factory from the angularjs library</p>
</dd>
<dt><a href="#q">q</a> : <code>$q</code></dt>
<dd><p>An instance if the $q factory from the angularjs library</p>
</dd>
</dl>
<a name="Endpoint"></a>
## Endpoint
**Kind**: global class  

* [Endpoint](#Endpoint)
  * [new Endpoint(endpointConfig, $injector)](#new_Endpoint_new)
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
| endpointConfig | <code>EndpointConfig</code> | Config of the endpoint which was defined earlier |
| $injector | <code>$injector</code> | The Angular $injector factory |

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

<a name="Endpoint+put"></a>
### endpoint.put(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Update an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |
| model | <code>Model/array</code> | The model to be updated |

<a name="Endpoint+post"></a>
### endpoint.post(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Save an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |
| model | <code>Model</code> | The model to be updated |

<a name="Endpoint+delete"></a>
### endpoint.delete(params, model) ⇒ <code>Promise.&lt;(Model\|Error)&gt;</code>
Remove an object

**Kind**: instance method of <code>[Endpoint](#Endpoint)</code>  

| Param | Type | Description |
| --- | --- | --- |
| params | <code>object</code> | The parameters that ether map in the route or get appended as GET parameters |
| model | <code>Model</code> | The model to be updated |

<a name="endpointConfig"></a>
## endpointConfig : <code>EndpointConfig</code>
The EndpointConfig object defined for this endpoint

**Kind**: global variable  
<a name="resource"></a>
## resource : <code>$resource</code>
An instance if the $resource factory from the angularjs library

**Kind**: global variable  
<a name="log"></a>
## log : <code>$log</code>
An instance if the $log factory from the angularjs library

**Kind**: global variable  
<a name="injector"></a>
## injector : <code>$injector</code>
An instance if the $injector factory from the angularjs library

**Kind**: global variable  
<a name="q"></a>
## q : <code>$q</code>
An instance if the $q factory from the angularjs library

**Kind**: global variable  
