# Autodeskforgedesignautomation.Activity

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**commandLine** | **[String]** | Path to Engine executable with arguments. | 
**parameters** | [**{String: Parameter}**](Parameter.md) | Each parameter represents an input or output file. | [optional] 
**id** | **String** | Name of Activity, see the example section. | [optional] 
**engine** | **String** | The actual processing engine that runs the WorkItem job and processes the Activity. | 
**appbundles** | **[String]** | A module referenced by an Activity in order to perform specific functions. Typically this is a DLL or some other form of custom code. | [optional] 
**settings** | [**{String: ISetting}**](ISetting.md) | The url/string Settings for a given set of AppBundles. | [optional] 
**description** | **String** | Human readable description of the object. | [optional] 
**version** | **Number** |  | [optional] 


