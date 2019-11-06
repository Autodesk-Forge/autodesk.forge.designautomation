# Autodeskforgedesignautomation.WorkItem

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **String** | Id. | [optional] 
**activityId** | **String** | Reference to the Activity that this WorkItem will invoke.  Examples: &#x60;MyPlot+Prod&#x60; (an Activity created by the caller) or  &#x60;Autodesk.PlotToPdf&#x60; (an Activity created by someone else and shared with this caller). | 
**_arguments** | [**{String: IArgument}**](IArgument.md) | Arguments of the WorkItem. | [optional] 
**signatures** | [**WorkItemSignatures**](WorkItemSignatures.md) | Signatures for various WorkItem attributes. | [optional] 
**limitProcessingTimeSec** | **Number** | Max duration of processing in seconds per workitem (includes download and upload time). | [optional] 


