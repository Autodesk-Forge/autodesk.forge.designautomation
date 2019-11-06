# Autodeskforgedesignautomation.XrefTreeArgument

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**optional** | **Boolean** | Argument optionality. Failure to download optional input arguments is OK. Failure to find or upload optional output arguments is OK. Defaults to false. | [optional] [default to false]
**localName** | **String** | The file or folder where the contents of an UrlArgument are placed. Note that this may be different than the &#x60;localName&#x60; for input arguments when [Content-Disposition] (http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1) header is specifified by the server. For &#x60;zip&#x60; &#x3D; &#x60;true&#x60; this is a folder name. See Activity.instructions for more information. | [optional] 
**pathInZip** | **String** | Denotes the &#39;main file&#x60; in a zip. See Activity.instructions for more information. If the url does not point to a zip the this parameter is ignored. The parameter references a zip file. This is how this is interpreted in various scenarios: 1. verb&#x3D;&#x3D;get implies that the byte stream should be unzipped to a folder designated by localName. 2. verb&#x3D;&#x3D;put, patch, post the contents of the file or folder designated by localName will be zipped and sent. 3. Any other verb values result in an error. | [optional] 
**references** | [**[XrefTreeArgument]**](XrefTreeArgument.md) |  | [optional] 
**url** | **String** | Url. | 
**headers** | **{String: String}** | Headers. | [optional] 
**verb** | [**Verb**](Verb.md) | The HTTP verb to be used. | [optional] 


