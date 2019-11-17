# Autodeskforgedesignautomation.FrontendLimits

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**limitPayloadSizeInKB** | **Number** | Max permitted size for App/Activity/Workitem json payload in kilobytes. Default is 16KB. | [optional] 
**limitVersions** | **Number** | Max permitted number of App/Activity versions a client can have at any one time. Default is 100. | [optional] 
**limitAliases** | **Number** | Max permitted number of aliases that a client can have at any one time. Default is 100. | [optional] 
**limitPublicAliases** | **Number** | Max permitted number of public aliases that a client can have at any one time. Default is 0. | [optional] 
**limitAppUploadSizeInMB** | **Number** | Max permitted size of an App upload in megabytes. | [optional] 
**limitMonthlyProcessingTimeInHours** | **Number** | Max commulative engine usage by client in a given calendar month. This limit applies to all engines. For example, if the limit is set to 1 hour then 30 minutes of Revit usage and 30 minutes of Inventor usage will reach limit. | [optional] 


