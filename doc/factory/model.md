<a name="ModelFactory"></a>
## ModelFactory
**Kind**: global class  
**Nginject**:   

* [ModelFactory](#ModelFactory)
  * [~Model](#ModelFactory..Model)
    * [new Model()](#new_ModelFactory..Model_new)
    * [._foreignData](#ModelFactory..Model+_foreignData) : <code>object</code>
    * [.reference](#ModelFactory..Model+reference) : <code>string</code>
    * [.clean()](#ModelFactory..Model+clean)
    * [._afterLoad()](#ModelFactory..Model+_afterLoad)
    * [._beforeSave()](#ModelFactory..Model+_beforeSave)
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
  * [._foreignData](#ModelFactory..Model+_foreignData) : <code>object</code>
  * [.reference](#ModelFactory..Model+reference) : <code>string</code>
  * [.clean()](#ModelFactory..Model+clean)
  * [._afterLoad()](#ModelFactory..Model+_afterLoad)
  * [._beforeSave()](#ModelFactory..Model+_beforeSave)
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

      UserModel.prototype._afterLoad = function() {
          this.fullname = this._foreignData['firstname'] + ' ' + this._foreignData['lastname'];
      };

      UserModel.prototype._beforeSave = function() {
          this.firstname = this.firstname + '_';
      };

      return UserModel;
 })
```
<a name="ModelFactory..Model+_foreignData"></a>
#### model._foreignData : <code>object</code>
Holds the original object as it was injected.
This gets deleted after the model is fully initialized.

**Kind**: instance property of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  
**Example**  
```js
ConcreteModel.prototype._afterLoad = function() {
     this.full_name = this._foreignData['first_name'] + ' ' + this._foreignData['last_name'];
};
```
<a name="ModelFactory..Model+reference"></a>
#### model.reference : <code>string</code>
The reference is used to get the identifier of a model

**Kind**: instance property of <code>[Model](#ModelFactory..Model)</code>  
**Example**  
```js
ConcreteModel.prototype.reference = 'identifier';
```
<a name="ModelFactory..Model+clean"></a>
#### model.clean()
This method gets called by the endpoint before the model is sent to the backend.
It removes all decorator methods and attributes from a model so its clean to be sent.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
<a name="ModelFactory..Model+_afterLoad"></a>
#### model._afterLoad()
This method gets called after the response was transformed into te model.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  
**Example**  
```js
ConcreteModel.prototype._afterLoad = function() {
     this.activation_token = this.activation_token.toUpperCase();
};
```
<a name="ModelFactory..Model+_beforeSave"></a>
#### model._beforeSave()
This method gets called before a model gets sent to the backend.
It's helpful when you want to remap attributes or make some changed.
To use it, just override it in the concrete model.

**Kind**: instance method of <code>[Model](#ModelFactory..Model)</code>  
**Access:** protected  
**Example**  
```js
ConcreteModel.prototype._beforeSave = function() {
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
