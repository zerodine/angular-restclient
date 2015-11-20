<a name="ApiProvider"></a>
## ApiProvider
**Kind**: global class  

* [ApiProvider](#ApiProvider)
  * [new ApiProvider()](#new_ApiProvider_new)
  * [.endpoints](#ApiProvider+endpoints) : <code>object</code>
  * [.baseRoute](#ApiProvider+baseRoute) : <code>string</code>
  * [.headResponseHeaderPrefix](#ApiProvider+headResponseHeaderPrefix) : <code>string</code>
  * [.baseRoute(baseRoute)](#ApiProvider+baseRoute)
  * [.headResponseHeaderPrefix(headResponseHeaderPrefix)](#ApiProvider+headResponseHeaderPrefix)
  * [.endpoint(endpoint)](#ApiProvider+endpoint)
  * [.$get($injector)](#ApiProvider+$get)

<a name="new_ApiProvider_new"></a>
### new ApiProvider()
AngularJD provider to provide the api

<a name="ApiProvider+endpoints"></a>
### apiProvider.endpoints : <code>object</code>
All the endpoints

**Kind**: instance property of <code>[ApiProvider](#ApiProvider)</code>  
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
### apiProvider.endpoint(endpoint)
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

