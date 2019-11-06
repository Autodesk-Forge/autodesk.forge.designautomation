# Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi

All URIs are relative to *https://developer.api.autodesk.com/da/us-east*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createActivity**](AutodeskForgeDesignautomationApi.md#createActivity) | **POST** /v3/activities | Creates a new Activity.
[**createActivityAlias**](AutodeskForgeDesignautomationApi.md#createActivityAlias) | **POST** /v3/activities/{id}/aliases | Creates a new alias for this Activity.
[**createActivityVersion**](AutodeskForgeDesignautomationApi.md#createActivityVersion) | **POST** /v3/activities/{id}/versions | Creates a new version of the Activity.
[**createAppBundle**](AutodeskForgeDesignautomationApi.md#createAppBundle) | **POST** /v3/appbundles | Creates a new AppBundle.
[**createAppBundleAlias**](AutodeskForgeDesignautomationApi.md#createAppBundleAlias) | **POST** /v3/appbundles/{id}/aliases | Creates a new alias for this AppBundle.
[**createAppBundleVersion**](AutodeskForgeDesignautomationApi.md#createAppBundleVersion) | **POST** /v3/appbundles/{id}/versions | Creates a new version of the AppBundle.
[**createNickname**](AutodeskForgeDesignautomationApi.md#createNickname) | **PATCH** /v3/forgeapps/{id} | Creates/updates the nickname for the current Forge app.
[**createWorkItem**](AutodeskForgeDesignautomationApi.md#createWorkItem) | **POST** /v3/workitems | Creates a new WorkItem and queues it for processing.
[**createWorkItemsBatch**](AutodeskForgeDesignautomationApi.md#createWorkItemsBatch) | **POST** /v3/workitems/batch | Creates new WorkItems and queues them for processing.
[**deleteActivity**](AutodeskForgeDesignautomationApi.md#deleteActivity) | **DELETE** /v3/activities/{id} | Deletes the specified Activity.
[**deleteActivityAlias**](AutodeskForgeDesignautomationApi.md#deleteActivityAlias) | **DELETE** /v3/activities/{id}/aliases/{aliasId} | Deletes the alias.
[**deleteActivityVersion**](AutodeskForgeDesignautomationApi.md#deleteActivityVersion) | **DELETE** /v3/activities/{id}/versions/{version} | Deletes the specified version of the Activity.
[**deleteAppBundle**](AutodeskForgeDesignautomationApi.md#deleteAppBundle) | **DELETE** /v3/appbundles/{id} | Deletes the specified AppBundle.
[**deleteAppBundleAlias**](AutodeskForgeDesignautomationApi.md#deleteAppBundleAlias) | **DELETE** /v3/appbundles/{id}/aliases/{aliasId} | Deletes the alias.
[**deleteAppBundleVersion**](AutodeskForgeDesignautomationApi.md#deleteAppBundleVersion) | **DELETE** /v3/appbundles/{id}/versions/{version} | Deletes the specified version of the AppBundle.
[**deleteForgeApp**](AutodeskForgeDesignautomationApi.md#deleteForgeApp) | **DELETE** /v3/forgeapps/{id} | Delete all data associated with this Forge app.
[**deleteServiceLimits**](AutodeskForgeDesignautomationApi.md#deleteServiceLimits) | **DELETE** /v3/servicelimits/{owner} | Deletes user service limits.
[**deleteWorkitem**](AutodeskForgeDesignautomationApi.md#deleteWorkitem) | **DELETE** /v3/workitems/{id} | Cancels a specific WorkItem.
[**geActivityVersion**](AutodeskForgeDesignautomationApi.md#geActivityVersion) | **GET** /v3/activities/{id}/versions/{version} | Gets the details of the specified version of the Activity.
[**getActivities**](AutodeskForgeDesignautomationApi.md#getActivities) | **GET** /v3/activities | Lists all available Activities.
[**getActivity**](AutodeskForgeDesignautomationApi.md#getActivity) | **GET** /v3/activities/{id} | Gets the details of the specified Activity.
[**getActivityAlias**](AutodeskForgeDesignautomationApi.md#getActivityAlias) | **GET** /v3/activities/{id}/aliases/{aliasId} | Get alias details.
[**getActivityAliases**](AutodeskForgeDesignautomationApi.md#getActivityAliases) | **GET** /v3/activities/{id}/aliases | Lists all aliases for the specified Activity.
[**getActivityVersions**](AutodeskForgeDesignautomationApi.md#getActivityVersions) | **GET** /v3/activities/{id}/versions | Lists all versions of the specified Activity.
[**getAppBundle**](AutodeskForgeDesignautomationApi.md#getAppBundle) | **GET** /v3/appbundles/{id} | Gets the details of the specified AppBundle.
[**getAppBundleAlias**](AutodeskForgeDesignautomationApi.md#getAppBundleAlias) | **GET** /v3/appbundles/{id}/aliases/{aliasId} | Get alias details.
[**getAppBundleAliases**](AutodeskForgeDesignautomationApi.md#getAppBundleAliases) | **GET** /v3/appbundles/{id}/aliases | Lists all aliases for the specified AppBundle.
[**getAppBundleVersion**](AutodeskForgeDesignautomationApi.md#getAppBundleVersion) | **GET** /v3/appbundles/{id}/versions/{version} | Gets the details of the specified version of the AppBundle.
[**getAppBundleVersions**](AutodeskForgeDesignautomationApi.md#getAppBundleVersions) | **GET** /v3/appbundles/{id}/versions | Lists all versions of the specified AppBundle.
[**getAppBundles**](AutodeskForgeDesignautomationApi.md#getAppBundles) | **GET** /v3/appbundles | Lists all available AppBundles.
[**getEngine**](AutodeskForgeDesignautomationApi.md#getEngine) | **GET** /v3/engines/{id} | Gets the details of the specified Engine.
[**getEngines**](AutodeskForgeDesignautomationApi.md#getEngines) | **GET** /v3/engines | Lists all available Engines.
[**getNickname**](AutodeskForgeDesignautomationApi.md#getNickname) | **GET** /v3/forgeapps/{id} | Returns the user&#39;s (app) nickname.
[**getServiceLimit**](AutodeskForgeDesignautomationApi.md#getServiceLimit) | **GET** /v3/servicelimits/{owner} | Get the service limit configuration.
[**getShares**](AutodeskForgeDesignautomationApi.md#getShares) | **GET** /v3/shares | Gets all Shares (AppBundles and Activities) shared by this Forge app.
[**getWorkitemStatus**](AutodeskForgeDesignautomationApi.md#getWorkitemStatus) | **GET** /v3/workitems/{id} | Gets the status of a specific WorkItem.
[**healthStatus**](AutodeskForgeDesignautomationApi.md#healthStatus) | **GET** /v3/health/{engine} | 
[**modifyActivityAlias**](AutodeskForgeDesignautomationApi.md#modifyActivityAlias) | **PATCH** /v3/activities/{id}/aliases/{aliasId} | Modify alias details.
[**modifyAppBundleAlias**](AutodeskForgeDesignautomationApi.md#modifyAppBundleAlias) | **PATCH** /v3/appbundles/{id}/aliases/{aliasId} | Modify alias details.
[**modifyServiceLimits**](AutodeskForgeDesignautomationApi.md#modifyServiceLimits) | **PUT** /v3/servicelimits/{owner} | Creates a new service limits configuration or updates exiting.


<a name="createActivity"></a>
# **createActivity**
> Activity createActivity(item)

Creates a new Activity.

Creates a new Activity.              Limits (varies by Engine):              1. Number of Activities that can be created.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let item = new Autodeskforgedesignautomation.Activity(); // Activity | 

apiInstance.createActivity(item).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **item** | [**Activity**](Activity.md)|  | 

### Return type

[**Activity**](Activity.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createActivityAlias"></a>
# **createActivityAlias**
> Alias createActivityAlias(id, alias)

Creates a new alias for this Activity.

Creates a new alias for this Activity.              Limit:              1. Number of aliases (LimitAliases).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let alias = new Autodeskforgedesignautomation.Alias(); // Alias | { id : {anyname}, version : {version number}, receiver : [{id of other Forge app},...] }.

apiInstance.createActivityAlias(id, alias).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **alias** | [**Alias**](Alias.md)| { id : {anyname}, version : {version number}, receiver : [{id of other Forge app},...] }. | 

### Return type

[**Alias**](Alias.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createActivityVersion"></a>
# **createActivityVersion**
> Activity createActivityVersion(id, item)

Creates a new version of the Activity.

Creates a new version of the Activity.              Limit:              1. Number of versions (LimitVersions).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let item = new Autodeskforgedesignautomation.Activity(); // Activity | 

apiInstance.createActivityVersion(id, item).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **item** | [**Activity**](Activity.md)|  | 

### Return type

[**Activity**](Activity.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createAppBundle"></a>
# **createAppBundle**
> AppBundle createAppBundle(item)

Creates a new AppBundle.

Creates a new AppBundle.              | Limits: (varies by Engine)              | 1. Number of AppBundle that can be created.              | 2. Size of AppBundle.              | This method creates new AppBundle returned in response value.              | POST upload is required to limit upload size.              |              | After this request, you need to upload the AppBundle zip.              | To upload the AppBundle package, create a multipart/form-data request using data received in reponse uploadParameters:              | - endpointURL is the URL to make the upload package request against,              | - formData are the parameters that need to be put into the upload package request body.              |   They must be followed by an extra &#39;file&#39; parameter indicating the location of the package file.              | An example:              |              | curl https://bucketname.s3.amazonaws.com/              | -F key &#x3D; apps/myApp/myfile.zip              | -F content-type &#x3D; application/octet-stream              | -F policy &#x3D; eyJleHBpcmF0aW9uIjoiMjAxOC0wNi0yMVQxMzo...(trimmed)              | -F x-amz-signature &#x3D; 800e52d73579387757e1c1cd88762...(trimmed)              | -F x-amz-credential &#x3D; AKIAIOSFODNN7EXAMPLE/20180621/us-west-2/s3/aws4_request/              | -F x-amz-algorithm &#x3D; AWS4-HMAC-SHA256              | -F x-amz-date &#x3D; 20180621T091656Z              | -F file&#x3D;@E:\\myfile.zip              | The &#39;file&#39; field must be at the end, all fields after &#39;file&#39; will be ignored.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let item = new Autodeskforgedesignautomation.AppBundle(); // AppBundle | 

apiInstance.createAppBundle(item).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **item** | [**AppBundle**](AppBundle.md)|  | 

### Return type

[**AppBundle**](AppBundle.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createAppBundleAlias"></a>
# **createAppBundleAlias**
> Alias createAppBundleAlias(id, alias)

Creates a new alias for this AppBundle.

Creates a new alias for this AppBundle. Limit: 1. Number of aliases (LimitAliases).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let alias = new Autodeskforgedesignautomation.Alias(); // Alias | 

apiInstance.createAppBundleAlias(id, alias).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **alias** | [**Alias**](Alias.md)|  | 

### Return type

[**Alias**](Alias.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createAppBundleVersion"></a>
# **createAppBundleVersion**
> AppBundle createAppBundleVersion(id, item)

Creates a new version of the AppBundle.

Creates a new version of the AppBundle.              | Limit:              | 1. Number of versions (LimitVersions).              | 2. Size of AppBundle.              | This method creates new AppBundle returned in response value.              | POST upload is required to limit upload size. The endpoint url and all form fields are retrieved in AppBundle.UploadParameters.              |              | After this request, you need to upload the AppBundle zip.              | Use data received in the response to create multipart/form-data request. An example:              |              | curl https://bucketname.s3.amazonaws.com/              | -F key &#x3D; apps/myApp/myfile.zip              | -F content-type &#x3D; application/octet-stream              | -F policy &#x3D; eyJleHBpcmF0aW9uIjoiMjAxOC0wNi0yMVQxMzo...(trimmed)              | -F x-amz-signature &#x3D; 800e52d73579387757e1c1cd88762...(trimmed)              | -F x-amz-credential &#x3D; AKIAIOSFODNN7EXAMPLE/20180621/us-west-2/s3/aws4_request/              | -F x-amz-algorithm &#x3D; AWS4-HMAC-SHA256              | -F x-amz-date &#x3D; 20180621T091656Z              | -F file&#x3D;@E:\\myfile.zip              The &#39;file&#39; field must be at the end, all fields after &#39;file&#39; will be ignored.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of app (unqualified).

let item = new Autodeskforgedesignautomation.AppBundle(); // AppBundle | 

apiInstance.createAppBundleVersion(id, item).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of app (unqualified). | 
 **item** | [**AppBundle**](AppBundle.md)|  | 

### Return type

[**AppBundle**](AppBundle.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createNickname"></a>
# **createNickname**
> createNickname(id, nicknameRecord)

Creates/updates the nickname for the current Forge app.

Creates/updates the nickname for the current Forge app.  The nickname is  used as a clearer alternative name when identifying AppBundles and Activities, as  compared to using the Forge app ID.  Once you have defined a nickname,  it MUST be used instead of the Forge app ID.                The new nickname cannot be in use by any other Forge app.                The Forge app cannot have any data when this endpoint is invoked.  Use the &#39;DELETE /forgeapps/me&#39;  endpoint (cautiously!!!) to remove all data from this Forge app.  &#39;DELETE /forgeapps/me&#39; is  also the only way to remove the nickname.                Note the nickname is supplied in the body, not as a query-parameter.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Must be \"me\" for the call to succeed.

let nicknameRecord = new Autodeskforgedesignautomation.NicknameRecord(); // NicknameRecord | new nickname (public key is for internal use only).

apiInstance.createNickname(id, nicknameRecord).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Must be \&quot;me\&quot; for the call to succeed. | 
 **nicknameRecord** | [**NicknameRecord**](NicknameRecord.md)| new nickname (public key is for internal use only). | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createWorkItem"></a>
# **createWorkItem**
> WorkItemStatus createWorkItem(workItem)

Creates a new WorkItem and queues it for processing.

Creates a new WorkItem and queues it for processing.  The new WorkItem is always placed on the queue; no further action is necessary.                Limits (Engine-specific):                1. Number of downloads (LimitDownloads)  2. Number of uploads (LimitUploads)  3. Total download size (LimitDownloadSize)  4. Total upload size (LimitUploadSize)  5. Processing time (LimitProcessingTime)  6. Total size of uncompressed bits for all referenced appbundles (LimitTotalUncompressedAppsSizePerActivity).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

// Configure OAuth2 access token for authorization: 3-legged
let 3-legged = defaultClient.authManager.authentications['3-legged'];
3-legged.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let workItem = new Autodeskforgedesignautomation.WorkItem(); // WorkItem | 

apiInstance.createWorkItem(workItem).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItem** | [**WorkItem**](WorkItem.md)|  | 

### Return type

[**WorkItemStatus**](WorkItemStatus.md)

### Authorization

[2-legged](../README.md#2-legged), [3-legged](../README.md#3-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="createWorkItemsBatch"></a>
# **createWorkItemsBatch**
> [WorkItemStatus] createWorkItemsBatch(workItems)

Creates new WorkItems and queues them for processing.

Creates one or more  WorkItems and queues them for processing.  The new WorkItems are always placed on the queue; no further action is necessary.                Limits (Engine-specific):                1. Number of downloads (LimitDownloads)  2. Number of uploads (LimitUploads)  3. Total download size (LimitDownloadSize)  4. Total upload size (LimitUploadSize)  5. Processing time (LimitProcessingTime)  6. Total size of uncompressed bits for all referenced appbundles (LimitTotalUncompressedAppsSizePerActivity).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

// Configure OAuth2 access token for authorization: 3-legged
let 3-legged = defaultClient.authManager.authentications['3-legged'];
3-legged.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let workItems = [new Autodeskforgedesignautomation.WorkItem()]; // [WorkItem] | 

apiInstance.createWorkItemsBatch(workItems).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **workItems** | [**[WorkItem]**](WorkItem.md)|  | 

### Return type

[**[WorkItemStatus]**](WorkItemStatus.md)

### Authorization

[2-legged](../README.md#2-legged), [3-legged](../README.md#3-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteActivity"></a>
# **deleteActivity**
> deleteActivity(id)

Deletes the specified Activity.

Deletes the specified Activity, including all versions and aliases.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

apiInstance.deleteActivity(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteActivityAlias"></a>
# **deleteActivityAlias**
> deleteActivityAlias(id, aliasId)

Deletes the alias.

Deletes the alias.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let aliasId = "aliasId_example"; // String | Name of alias to delete.

apiInstance.deleteActivityAlias(id, aliasId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **aliasId** | **String**| Name of alias to delete. | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteActivityVersion"></a>
# **deleteActivityVersion**
> deleteActivityVersion(id, version)

Deletes the specified version of the Activity.

Deletes the specified version of the Activity.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let version = 56; // Number | Version to delete (integer).

apiInstance.deleteActivityVersion(id, version).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **version** | **Number**| Version to delete (integer). | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteAppBundle"></a>
# **deleteAppBundle**
> deleteAppBundle(id)

Deletes the specified AppBundle.

Deletes the specified AppBundle, including all versions and aliases.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

apiInstance.deleteAppBundle(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteAppBundleAlias"></a>
# **deleteAppBundleAlias**
> deleteAppBundleAlias(id, aliasId)

Deletes the alias.

Deletes the alias.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let aliasId = "aliasId_example"; // String | Name of alias to delete.

apiInstance.deleteAppBundleAlias(id, aliasId).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **aliasId** | **String**| Name of alias to delete. | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteAppBundleVersion"></a>
# **deleteAppBundleVersion**
> deleteAppBundleVersion(id, version)

Deletes the specified version of the AppBundle.

Deletes the specified version of the AppBundle.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let version = 56; // Number | Version to delete (as integer).

apiInstance.deleteAppBundleVersion(id, version).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **version** | **Number**| Version to delete (as integer). | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteForgeApp"></a>
# **deleteForgeApp**
> deleteForgeApp(id)

Delete all data associated with this Forge app.

Delete all data associated with the given Forge app.                ALL Design Automation appbundles and activities are DELETED.                This may take up to 2 minutes. During this time the app will not be able to make successful requests.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Must be \"me\" for the call to succeed.

apiInstance.deleteForgeApp(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Must be \&quot;me\&quot; for the call to succeed. | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteServiceLimits"></a>
# **deleteServiceLimits**
> deleteServiceLimits(owner)

Deletes user service limits.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let owner = "owner_example"; // String | 

apiInstance.deleteServiceLimits(owner).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **owner** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="deleteWorkitem"></a>
# **deleteWorkitem**
> deleteWorkitem(id)

Cancels a specific WorkItem.

Cancels a specific WorkItem.  If the WorkItem is on the queue, it is removed from the queue and not processed.  If the WorkItem is already being processed, then it may or may not be interrupted and cancelled.  If the WorkItem has already finished processing, then it has no effect on the processing or results.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

// Configure OAuth2 access token for authorization: 3-legged
let 3-legged = defaultClient.authManager.authentications['3-legged'];
3-legged.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | 

apiInstance.deleteWorkitem(id).then(() => {
  console.log('API called successfully.');
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

null (empty response body)

### Authorization

[2-legged](../README.md#2-legged), [3-legged](../README.md#3-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="geActivityVersion"></a>
# **geActivityVersion**
> Activity geActivityVersion(id, version)

Gets the details of the specified version of the Activity.

Gets the details of the specified version of the Activity.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let version = 56; // Number | Version to retrieve (integer).

apiInstance.geActivityVersion(id, version).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **version** | **Number**| Version to retrieve (integer). | 

### Return type

[**Activity**](Activity.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getActivities"></a>
# **getActivities**
> Page5bString5d getActivities(opts)

Lists all available Activities.

Lists all available Activities, including Activities shared with this Forge app.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getActivities(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bString5d**](Page5bString5d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getActivity"></a>
# **getActivity**
> Activity getActivity(id)

Gets the details of the specified Activity.

Gets the details of the specified Activity. Note that the {id} parameter must be a QualifiedId (owner.name+label).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Full qualified id of the Activity (owner.name+label).

apiInstance.getActivity(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Full qualified id of the Activity (owner.name+label). | 

### Return type

[**Activity**](Activity.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getActivityAlias"></a>
# **getActivityAlias**
> Alias getActivityAlias(id, aliasId)

Get alias details.

Get alias details.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let aliasId = "aliasId_example"; // String | Name of alias.

apiInstance.getActivityAlias(id, aliasId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **aliasId** | **String**| Name of alias. | 

### Return type

[**Alias**](Alias.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getActivityAliases"></a>
# **getActivityAliases**
> Page5bAlias5d getActivityAliases(id, opts)

Lists all aliases for the specified Activity.

Lists all aliases for the specified Activity.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getActivityAliases(id, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bAlias5d**](Page5bAlias5d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getActivityVersions"></a>
# **getActivityVersions**
> Page5bInt325d getActivityVersions(id, opts)

Lists all versions of the specified Activity.

Lists all versions of the specified Activity.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getActivityVersions(id, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bInt325d**](Page5bInt325d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAppBundle"></a>
# **getAppBundle**
> AppBundle getAppBundle(id)

Gets the details of the specified AppBundle.

Gets the details of the specified AppBundle. Note that the {id} parameter must be a QualifiedId (owner.name+label).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Full qualified id of the AppBundle (owner.name+label).

apiInstance.getAppBundle(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Full qualified id of the AppBundle (owner.name+label). | 

### Return type

[**AppBundle**](AppBundle.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAppBundleAlias"></a>
# **getAppBundleAlias**
> Alias getAppBundleAlias(id, aliasId)

Get alias details.

Get alias details.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let aliasId = "aliasId_example"; // String | Name of alias.

apiInstance.getAppBundleAlias(id, aliasId).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **aliasId** | **String**| Name of alias. | 

### Return type

[**Alias**](Alias.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAppBundleAliases"></a>
# **getAppBundleAliases**
> Page5bAlias5d getAppBundleAliases(id, opts)

Lists all aliases for the specified AppBundle.

Lists all aliases for the specified AppBundle.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of activity (unqualified).

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getAppBundleAliases(id, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of activity (unqualified). | 
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bAlias5d**](Page5bAlias5d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAppBundleVersion"></a>
# **getAppBundleVersion**
> AppBundle getAppBundleVersion(id, version)

Gets the details of the specified version of the AppBundle.

Gets the details of the specified version of the AppBundle.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let version = 56; // Number | Version to retrieve (as integer).

apiInstance.getAppBundleVersion(id, version).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **version** | **Number**| Version to retrieve (as integer). | 

### Return type

[**AppBundle**](AppBundle.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAppBundleVersions"></a>
# **getAppBundleVersions**
> Page5bInt325d getAppBundleVersions(id, opts)

Lists all versions of the specified AppBundle.

Lists all versions of the specified AppBundle.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getAppBundleVersions(id, opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bInt325d**](Page5bInt325d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getAppBundles"></a>
# **getAppBundles**
> Page5bString5d getAppBundles(opts)

Lists all available AppBundles.

Lists all available AppBundles, including AppBundles shared with this Forge app.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getAppBundles(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bString5d**](Page5bString5d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getEngine"></a>
# **getEngine**
> Engine getEngine(id)

Gets the details of the specified Engine.

Gets the details of the specified Engine. Note that the {id} parameter must be a QualifiedId (owner.name+label).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Full qualified id of the Engine (owner.name+label).

apiInstance.getEngine(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Full qualified id of the Engine (owner.name+label). | 

### Return type

[**Engine**](Engine.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getEngines"></a>
# **getEngines**
> Page5bString5d getEngines(opts)

Lists all available Engines.

Lists all available Engines.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let opts = { 
  'page': "page_example" // String | Access an additional 'page' of data when necessary, based on the 'paginationToken' returned from a previous invocation.
};
apiInstance.getEngines(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **String**| Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation. | [optional] 

### Return type

[**Page5bString5d**](Page5bString5d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getNickname"></a>
# **getNickname**
> &#39;String&#39; getNickname(id)

Returns the user&#39;s (app) nickname.

Return the given Forge app&#39;s nickname.                If the app has no nickname, this route will return its id.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Must be \"me\" for the call to succeed.

apiInstance.getNickname(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Must be \&quot;me\&quot; for the call to succeed. | 

### Return type

**&#39;String&#39;**

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getServiceLimit"></a>
# **getServiceLimit**
> ServiceLimit getServiceLimit(owner)

Get the service limit configuration.

Gets a user&#39;s service limit configuration.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let owner = "owner_example"; // String | The user to fetch the service limit configuration for.

apiInstance.getServiceLimit(owner).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **owner** | **String**| The user to fetch the service limit configuration for. | 

### Return type

[**ServiceLimit**](ServiceLimit.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getShares"></a>
# **getShares**
> Page5bShare5d getShares(opts)

Gets all Shares (AppBundles and Activities) shared by this Forge app.

Gets all Shares (AppBundles and Activities) shared by this Forge app (shared to other  Forge apps for them to use).                Sharing of AppBundles and Activities is controlled via the use of &#39;aliases&#39;.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let opts = { 
  'page': "page_example" // String | Used to get subsequent 'pages' of data.
};
apiInstance.getShares(opts).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **page** | **String**| Used to get subsequent &#39;pages&#39; of data. | [optional] 

### Return type

[**Page5bShare5d**](Page5bShare5d.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="getWorkitemStatus"></a>
# **getWorkitemStatus**
> WorkItemStatus getWorkitemStatus(id)

Gets the status of a specific WorkItem.

Gets the status of a specific WorkItem.  Typically used to &#39;poll&#39; for              the completion of a WorkItem, but see the use of the &#39;onComplete&#39; argument for              an alternative that does not require &#39;polling&#39;.  WorkItem status is retained              for a limited period of time after the WorkItem completes.              Limits:              1. Retention period (LimitWorkItemRetentionPeriod).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

// Configure OAuth2 access token for authorization: 3-legged
let 3-legged = defaultClient.authManager.authentications['3-legged'];
3-legged.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | 

apiInstance.getWorkitemStatus(id).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**|  | 

### Return type

[**WorkItemStatus**](WorkItemStatus.md)

### Authorization

[2-legged](../README.md#2-legged), [3-legged](../README.md#3-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="healthStatus"></a>
# **healthStatus**
> &#39;String&#39; healthStatus(engine)



Gets the health status by Engine or for all Engines (Inventor, AutoCAD ...).

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let engine = "engine_example"; // String | 

apiInstance.healthStatus(engine).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **engine** | **String**|  | 

### Return type

**&#39;String&#39;**

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="modifyActivityAlias"></a>
# **modifyActivityAlias**
> Alias modifyActivityAlias(id, aliasId, alias)

Modify alias details.

Modify alias details.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of Activity (unqualified).

let aliasId = "aliasId_example"; // String | Name of alias.

let alias = new Autodeskforgedesignautomation.AliasPatch(); // AliasPatch | Alias details to be modified.

apiInstance.modifyActivityAlias(id, aliasId, alias).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of Activity (unqualified). | 
 **aliasId** | **String**| Name of alias. | 
 **alias** | [**AliasPatch**](AliasPatch.md)| Alias details to be modified. | 

### Return type

[**Alias**](Alias.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="modifyAppBundleAlias"></a>
# **modifyAppBundleAlias**
> Alias modifyAppBundleAlias(id, aliasId, alias)

Modify alias details.

Modify alias details.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let id = "id_example"; // String | Name of AppBundle (unqualified).

let aliasId = "aliasId_example"; // String | Name of alias.

let alias = new Autodeskforgedesignautomation.AliasPatch(); // AliasPatch | Alias details to be modified.

apiInstance.modifyAppBundleAlias(id, aliasId, alias).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **id** | **String**| Name of AppBundle (unqualified). | 
 **aliasId** | **String**| Name of alias. | 
 **alias** | [**AliasPatch**](AliasPatch.md)| Alias details to be modified. | 

### Return type

[**Alias**](Alias.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

<a name="modifyServiceLimits"></a>
# **modifyServiceLimits**
> ServiceLimit modifyServiceLimits(owner, item)

Creates a new service limits configuration or updates exiting.

Creates a new service limits configuration or updates exiting.

### Example
```javascript es6
import Autodeskforgedesignautomation from 'autodeskforgedesignautomation';
let defaultClient = Autodeskforgedesignautomation.ApiClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = 'YOUR ACCESS TOKEN';

let apiInstance = new Autodeskforgedesignautomation.AutodeskForgeDesignautomationApi();

let owner = "owner_example"; // String | The user to associate the configuration to.

let item = new Autodeskforgedesignautomation.ServiceLimit(); // ServiceLimit | 

apiInstance.modifyServiceLimits(owner, item).then((data) => {
  console.log('API called successfully. Returned data: ' + data);
}, (error) => {
  console.error(error);
});

```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **owner** | **String**| The user to associate the configuration to. | 
 **item** | [**ServiceLimit**](ServiceLimit.md)|  | 

### Return type

[**ServiceLimit**](ServiceLimit.md)

### Authorization

[2-legged](../README.md#2-legged)

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

