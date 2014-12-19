#Index

**Classes**

* [class: EndpointConfig](#EndpointConfig)
  * [new EndpointConfig()](#new_EndpointConfig)
  * [endpointConfig.route(route)](#EndpointConfig#route)
  * [endpointConfig.model(model)](#EndpointConfig#model)
  * [endpointConfig.container(container)](#EndpointConfig#container)
* [class: Endpoint](#Endpoint)
  * [new Endpoint(endpoint, endpointConfig, baseRoute, $resource, $log, $injector)](#new_Endpoint)
  * [Endpoint.$inject](#Endpoint.$inject)
  * [endpoint.get(params)](#Endpoint#get)
  * [endpoint.update(params, model, success, error)](#Endpoint#update)
  * [endpoint.save(params, model, success, error)](#Endpoint#save)
* [class: Model](#Model)
  * [new Model()](#new_Model)
  * [model.afterLoad()](#Model#afterLoad)
  * [model.beforeSave()](#Model#beforeSave)
  * [model.init(object)](#Model#init)
  * [model.callBeforeSave(models)](#Model#callBeforeSave)
  * [model._clean()](#Model#_clean)
  * [model._mapArray(property, apiProperty, modelName)](#Model#_mapArray)
  * [model._mapProperty(property, apiProperty, modelName)](#Model#_mapProperty)
  * [model._referenceOnly(models)](#Model#_referenceOnly)
  * [model.isValid()](#Model#isValid)
 
<a name="EndpointConfig"></a>
#class: EndpointConfig
**Members**

* [class: EndpointConfig](#EndpointConfig)
  * [new EndpointConfig()](#new_EndpointConfig)
  * [endpointConfig.route(route)](#EndpointConfig#route)
  * [endpointConfig.model(model)](#EndpointConfig#model)
  * [endpointConfig.container(container)](#EndpointConfig#container)

<a name="new_EndpointConfig"></a>
##new EndpointConfig()
This class represents one configuration for an endpoint

<a name="EndpointConfig#route"></a>
##endpointConfig.route(route)
Set the route to this endpoint

**Params**

- route `string` - The endpoint route defined as string  

**Returns**: [EndpointConfig](#EndpointConfig) - Returns the endpoint config object  
<a name="EndpointConfig#model"></a>
##endpointConfig.model(model)
Set the model that is used to transform the response

**Params**

- model `string` - The model defined as string  

**Returns**: [EndpointConfig](#EndpointConfig) - Returns the endpoint config object  
<a name="EndpointConfig#container"></a>
##endpointConfig.container(container)
Set the container that wraps the response. Default is null.

**Params**

- container `string` - The container defined as string  

**Returns**: [EndpointConfig](#EndpointConfig) - Returns the endpoint config object  
<a name="Endpoint"></a>
#class: Endpoint
**Members**

* [class: Endpoint](#Endpoint)
  * [new Endpoint(endpoint, endpointConfig, baseRoute, $resource, $log, $injector)](#new_Endpoint)
  * [Endpoint.$inject](#Endpoint.$inject)
  * [endpoint.get(params)](#Endpoint#get)
  * [endpoint.update(params, model, success, error)](#Endpoint#update)
  * [endpoint.save(params, model, success, error)](#Endpoint#save)

<a name="new_Endpoint"></a>
##new Endpoint(endpoint, endpointConfig, baseRoute, $resource, $log, $injector)
Class representing an Endpoint with all the functionality for receiving, saving and updating data from the backend

**Params**

- endpoint `string` - The name of the endpoint  
- endpointConfig <code>[EndpointConfig](#EndpointConfig)</code> - Config of the endpoint which was defined earlier  
- baseRoute `string` - URL to the backend  
- $resource `$resource` - The Angular $resource factory  
- $log `$log` - The Angular $log factory  
- $injector `$injector` - The Angular $injector factory  

<a name="Endpoint.$inject"></a>
##Endpoint.$inject
Let the angularjs injector inject all needed arguments

<a name="Endpoint#get"></a>
##endpoint.get(params)
Call an endpoint and map the response to one or more models given in the endpoint config

**Params**

- params `object` - The parameters that ether map in the route or get appended as GET parameters  

**Returns**: [Model](#Model) - Returns one or an array of mapped models  
<a name="Endpoint#update"></a>
##endpoint.update(params, model, success, error)
Update an object

**Params**

- params `object` - The parameters that ether map in the route or get appended as GET parameters  
- model <code>[Model](#Model)</code> - The model to be updated  
- success `function` - Callback if the update was an success  
- error `function` - Callback if the update did not work  

<a name="Endpoint#save"></a>
##endpoint.save(params, model, success, error)
Save an object

**Params**

- params `object` - The parameters that ether map in the route or get appended as GET parameters  
- model <code>[Model](#Model)</code> - The model to be updated  
- success `function` - Callback if the update was an success  
- error `function` - Callback if the update did not work  

<a name="Model"></a>
#class: Model
**Members**

* [class: Model](#Model)
  * [new Model()](#new_Model)
  * [model.afterLoad()](#Model#afterLoad)
  * [model.beforeSave()](#Model#beforeSave)
  * [model.init(object)](#Model#init)
  * [model.callBeforeSave(models)](#Model#callBeforeSave)
  * [model._clean()](#Model#_clean)
  * [model._mapArray(property, apiProperty, modelName)](#Model#_mapArray)
  * [model._mapProperty(property, apiProperty, modelName)](#Model#_mapProperty)
  * [model._referenceOnly(models)](#Model#_referenceOnly)
  * [model.isValid()](#Model#isValid)

<a name="new_Model"></a>
##new Model()
Abstract model class

<a name="Model#afterLoad"></a>
##model.afterLoad()
This method gets called after the response was transformed into te model.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

<a name="Model#beforeSave"></a>
##model.beforeSave()
This method gets called before a model gets sent to the backend.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

<a name="Model#init"></a>
##model.init(object)
Every model must call this method in it's constructor. It in charge of mapping the given object to the model.

**Params**

- object `object` - The given object. This can come ether from the backend or created manualy  

<a name="Model#callBeforeSave"></a>
##model.callBeforeSave(models)
This method can be used to call the beforeSave method on a related model.

**Params**

- models `Model/array` - Can ether be a model or an array of models  

<a name="Model#_clean"></a>
##model._clean()
This method gets called bei the api before a model is sent to the backend.

**Access**: private  
<a name="Model#_mapArray"></a>
##model._mapArray(property, apiProperty, modelName)
Maps an array of models to an property

**Params**

- property `string` - The property which should be mapped  
- apiProperty `string` - Foreign property as it comes from the api  
- modelName `string` - Name of the model which is used for the matching  

**Access**: private  
<a name="Model#_mapProperty"></a>
##model._mapProperty(property, apiProperty, modelName)
Maps an array of models to an property

**Params**

- property `string` - The property which should be mapped  
- apiProperty `string` - Foreign property as it comes from the api  
- modelName `string` - Name of the model which is used for the matching  

**Access**: private  
<a name="Model#_referenceOnly"></a>
##model._referenceOnly(models)
Maps an array of models to an property

**Params**

- models `Model/array`  

**Access**: private  
<a name="Model#isValid"></a>
##model.isValid()
Validate the properties of the model

