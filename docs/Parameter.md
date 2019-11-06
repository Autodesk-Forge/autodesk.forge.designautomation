# Autodeskforgedesignautomation.Parameter

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**zip** | **Boolean** | The parameter references a zip file. This is how this is interpreted in various scenarios: 1. verb&#x3D;&#x3D;get implies that the byte stream should be unzipped to a folder designated by localName. 2. verb&#x3D;&#x3D;put, patch, post the contents of the file or folder designated by localName will be zipped and sent. 3. Any other verb values result in an error. Default is false. | [optional] [default to false]
**ondemand** | **Boolean** | The parameter will be accessed by the appbundle on demand and should not be used by the system. Default is false. | [optional] [default to false]
**verb** | [**Verb**](Verb.md) | Request method (get, put, patch or post). | 
**description** | **String** | The description of the parameter. | [optional] 
**required** | **Boolean** | Specifies whether the corresponding WorkItem Argument is required. Default is false. | [optional] [default to false]
**localName** | **String** | The file or folder where the contents of an UrlArgument are placed. Note that this may be different than the &#x60;localName&#x60; for input arguments when [Content-Disposition](http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1) header is specifified by the server. For &#x60;zip&#x60; &#x3D; &#x60;true&#x60; this is a folder name. | [optional] 


