# Autodeskforgedesignautomation.Statistics

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**timeQueued** | **Date** | The time in UTC when the workitem was queued. | [optional] 
**timeDownloadStarted** | **Date** | The time in UTC when the system started processing the workitem by transferring input data to the processing node. | [optional] 
**timeInstructionsStarted** | **Date** | The time in UTC when the system finished downloading input and started processing instructions from the Activity associated with this workitem. | [optional] 
**timeInstructionsEnded** | **Date** | The time in UTC when the system finished executing instructions and started uploading outputs. | [optional] 
**timeUploadEnded** | **Date** | The time in UTC when the system finished uploading outputs. | [optional] 
**timeFinished** | **Date** | The time in UTC when the system finished the workitem and reported the status. | [optional] 
**bytesDownloaded** | **Number** | The file size of bytes the job downloads for input. | [optional] 
**bytesUploaded** | **Number** | The file size of bytes the job uploads for output. | [optional] 


