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

