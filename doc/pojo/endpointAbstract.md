<a name="EndpointAbstract"></a>

## EndpointAbstract
**Kind**: global class  
**Implements:** <code>EndpointInterface</code>  

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
