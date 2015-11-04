## Classes
<dl>
<dt><a href="#ModelFactory">ModelFactory</a></dt>
<dd></dd>
<dt><a href="#Model">Model</a></dt>
<dd></dd>
</dl>
<a name="ModelFactory"></a>
## ModelFactory
**Kind**: global class  
**Nginject**:   

* [ModelFactory](#ModelFactory)
  * [new ModelFactory()](#new_ModelFactory_new)
  * [.__foreignData](#ModelFactory+__foreignData) : <code>object</code>
  * [.__annotation](#ModelFactory+__annotation) : <code>object</code>

<a name="new_ModelFactory_new"></a>
### new ModelFactory()
The factory to get the abstract model

<a name="ModelFactory+__foreignData"></a>
### modelFactory.__foreignData : <code>object</code>
The __foreignData variable holds the original object as it was injected.
This gets deleted after the model is fully initialized.

**Kind**: instance property of <code>[ModelFactory](#ModelFactory)</code>  
<a name="ModelFactory+__annotation"></a>
### modelFactory.__annotation : <code>object</code>
Holds the annotation of every property of a model.
This object gets deleted when the model is sent to the backend.

**Kind**: instance property of <code>[ModelFactory](#ModelFactory)</code>  
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
