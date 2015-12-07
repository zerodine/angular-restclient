<a name="ModelFactory"></a>
## ModelFactory
**Kind**: global class  
**Nginject**:   

* [ModelFactory](#ModelFactory)
  * [~Model](#ModelFactory..Model)
    * [new Model()](#new_ModelFactory..Model_new)
    * [.reference](#ModelFactory..Model+reference) : <code>string</code>
    * [.METHOD_SAVE](#ModelFactory..Model+METHOD_SAVE) : <code>string</code>
    * [.METHOD_UPDATE](#ModelFactory..Model+METHOD_UPDATE) : <code>string</code>
    * [.clean(method, parent)](#ModelFactory..Model+clean)
    * [._afterLoad(foreignData)](#ModelFactory..Model+_afterLoad)
    * [._beforeSave(method, parent)](#ModelFactory..Model+_beforeSave)
    * [._init(object)](#ModelFactory..Model+_init)
    * [._mapArray(property, apiProperty, modelName)](#ModelFactory..Model+_mapArray)
    * [._mapProperty(property, apiProperty, modelName)](#ModelFactory..Model+_mapProperty)
    * [._referenceOnly(models)](#ModelFactory..Model+_referenceOnly)
    * [.isValid()](#ModelFactory..Model+isValid)

<a name="ModelFactory..Model"></a>
### ModelFactory~Model
**Kind**: inner class of <code>[ModelFactory](#ModelFactory)</code>  

* [~Model](#ModelFactory..Model)
  * [new Model()](#new_ModelFactory..Model_new)
  * [.reference](#ModelFactory..Model+reference) : <code>string</code>
  * [.METHOD_SAVE](#ModelFactory..Model+METHOD_SAVE) : <code>string</code>
  * [.METHOD_UPDATE](#ModelFactory..Model+METHOD_UPDATE) : <code>string</code>
  * [.clean(method, parent)](#ModelFactory..Model+clean)
  * [._afterLoad(foreignData)](#ModelFactory..Model+_afterLoad)
  * [._beforeSave(method, parent)](#ModelFactory..Model+_beforeSave)
  * [._init(object)](#ModelFactory..Model+_init)
  * [._mapArray(property, apiProperty, modelName)](#ModelFactory..Model+_mapArray)
  * [._mapProperty(property, apiProperty, modelName)](#ModelFactory..Model+_mapProperty)
  * [._referenceOnly(models)](#ModelFactory..Model+_referenceOnly)
  * [.isValid()](#ModelFactory..Model+isValid)

<a name="new_ModelFactory..Model_new"></a>
#### new Model()
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

      UserModel.prototype._afterLoad = function(foreignData) {
          this.fullname = foreignData['firstname'] + ' ' + foreignData['lastname'];
      };

      UserModel.prototype._beforeSave = function() {
          this.firstname = this.firstname + '_';
      };

      return UserModel;
 })
```
<a name="ModelFactory..Model+reference"></a>
#### model.reference : <code>string</code>
The reference is used to get the identifier of a model

**Kind**: instance property of <code>[Model](#ModelFactory..Model)</code>  
**Example**  
```js
ConcreteModel.prototype.reference = 'identifier';
```
<a name="ModelFactory..Model+METHOD_SAVE"></a>
#### model.METHOD_SAVE : <code>string</code>
Constant to define the performed method on a model

**Kind**: instance constant of <code>[Model](#ModelFactory..Model)</code>  
<a name="ModelFactory..Model+METHOD_UPDATE"></a>
#### model.METHOD_UPDATE : <code>string</code>
Constant to define the performed method on a model

**Kind**: instance constant of <code>[Model](#ModelFactory..Model)</code>  
<a name="ModelFactory..Model+clean"></a>
#### model.clean(method, parent)
This method gets called by the endpoint before the model is sent to the backend.
It removes all decorator methods and attributes from a model so its clean to be sent.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Provides the method that is performed on this model |
| parent | <code>boolean</code> | Defines if the clean was called by a parent model |

<a name="ModelFactory..Model+_afterLoad"></a>
#### model._afterLoad(foreignData)
This method gets called after the response was transformed into te model.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| foreignData | <code>object</code> | Provides the foreign data in order to perform custom mapping after the model was loaded |

**Example**  
```js
ConcreteModel.prototype._afterLoad = function(foreignData) {
     this.activation_token = this.activation_token.toUpperCase();
};
```
<a name="ModelFactory..Model+_beforeSave"></a>
#### model._beforeSave(method, parent)
This method gets called before a model gets sent to the backend.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>string</code> | Provides the method that is performed on this model |
| parent | <code>boolean</code> | Defines if the clean was called by a parent model |

**Example**  
```js
ConcreteModel.prototype._beforeSave = function(method, parent) {
     this.activation_token = this.activation_token.toLowerCase();
};
```
<a name="ModelFactory..Model+_init"></a>
#### model._init(object)
Every model must call this method in it's constructor. It in charge of mapping the given object to the model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| object | <code>object</code> | The given object. This can come ether from the backend or created manually. |

<a name="ModelFactory..Model+_mapArray"></a>
#### model._mapArray(property, apiProperty, modelName)
Maps an array of models to a property.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | The property which should be mapped |
| apiProperty | <code>array</code> | Foreign property as it comes from the backend |
| modelName | <code>string</code> | Name of the model which is used for the mapping |

<a name="ModelFactory..Model+_mapProperty"></a>
#### model._mapProperty(property, apiProperty, modelName)
Maps a model to an property.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type | Description |
| --- | --- | --- |
| property | <code>string</code> | The property which should be mapped |
| apiProperty | <code>string</code> | Foreign property as it comes from the api |
| modelName | <code>string</code> | Name of the model which is used for the matching |

<a name="ModelFactory..Model+_referenceOnly"></a>
#### model._referenceOnly(models)
Returns only the reference of a related model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  

| Param | Type |
| --- | --- |
| models | <code>Model/array.&lt;Model&gt;</code> | 

<a name="ModelFactory..Model+isValid"></a>
#### model.isValid()
Validates the properties of the model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
