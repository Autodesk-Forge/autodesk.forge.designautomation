# autodesk.forge.designautomation

[![Design-Automation](https://img.shields.io/badge/Design%20Automation-v3-green.svg)](http://developer.autodesk.com/)
![SDK](https://img.shields.io/badge/SDK-3.0.3-lightgree.svg)
[![Node.js](https://img.shields.io/badge/Node.js-6.3.1-blue.svg)](https://nodejs.org/)
 
## Overview

AutodeskForgeDesignAutomation - 
Asynchronous Node.js library for the Autodesk Forge Design Automation v3 implementation.

- Package version: 3.0.3
- API version: v3
- API documentation: 
For more information, please visit [https://forge.autodesk.com/en/docs/design-automation/v3/developers_guide/overview/](https://forge.autodesk.com/en/docs/design-automation/v3/developers_guide/overview/)

### Requirements

* Node.js 6.3.1 or later
* A registered app on the [Forge Developer Portal](http://forge.autodesk.com/).

### Contributions

Contributions are welcome! Please open a Pull Request.

## Support

Please ask questions on [StackOverflow](https://stackoverflow.com/questions/ask?tags=autodesk-designautomation,csharp) with tag `autodesk-designautomation` tag. If it turns out that you may have found a bug, please open an issue

#### Tutorials

Please visit [Learn Forge](https://learnforge.autodesk.io/#/tutorials/modifymodels) tutorial.

## Installation

### For [Node.js](https://nodejs.org/)

#### npm

npm package is published on [npm](https://www.npmjs.org/).
Install this package using following command

```shell
npm install autodesk.forge.designautomation --save
```

### Webpack Configuration

Using Webpack you may encounter the following error: "Module not found: Error:
Cannot resolve module", most certainly you should disable AMD loader. Add/merge
the following section to your webpack config:

```javascript
module: {
  rules: [
    {
      parser: {
        amd: false
      }
    }
  ]
}
```

## Configuring ``ApiClient``
User can use default settings or change following properties of ``ApiClient``.
1. **CircuitBreaker :**
  Configure the threshold failure count and failure interval of circuit breaker.

   Default :
    * Failure Count : 10
    * Failure interval : 10000 ms
    ```javascript
        let AutodeskForgeDesignAutomation = require('autodesk.forge.designautomation');
        let config = {
          "circuitBreaker": {
              "threshold": 11,
              "interval": 1200
          }
        };
        let apiClient = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationClient(config);
        let api = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationApi(apiClient)
    ```

2. **Retry :** 
  Autodesk resiliency library provides 3 types of retry policies.

      * WAIT : Retry after fixed delay interval.
      * EXPONENTIAL : Retry after exponential delay interval.
      * JITTER : Retry after exponential delay with jitter interval.

      User can specify number of retry count and retry policy.
      ```javascript
        let AutodeskForgeDesignAutomation = require('autodesk.forge.designautomation');
        let config = {
            "retry" : {
                "maxNumberOfRetries" :  7,
                "backoffDelay" : 4000,
                "backoffPolicy" : "exponentialBackoffWithJitter"
            }
        };
        let apiClient = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationClient(config);
        let api = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationApi(apiClient)
      ```
3. **Timeout :**
   Set request timeout.
    ```javascript
    	  let AutodeskForgeDesignAutomation = require('autodesk.forge.designautomation');
    	
        let config = {
            "requestTimeout" : 13000
        };
        let apiClient = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationClient(config);
        let api = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationApi(apiClient)
    ```
    
## Getting Started

Please follow the [installation](#installation) instruction and execute the following code:

1. **Default api client**
```javascript
let AutodeskForgeDesignAutomation = require('autodesk.forge.designautomation');

let defaultClient = AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationClient.instance;

// Configure OAuth2 access token for authorization: 2-legged
let oauth = defaultClient.authManager.authentications['2-legged'];
oauth.accessToken = "YOUR ACCESS TOKEN";

// And/Or you can pass fetchToken and refreshToken to manage the token
oauth.fetchToken = function() { return Promise.resolve({accessToken: "token", expiresIn: 300000}) }
oauth.refreshToken = function() { return Promise.resolve({accessToken: "token", expiresIn: 300000}) }

let api = new AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi()

let item = new Autodeskforgedesignautomation.Activity(); // {Activity} 

api.createActivity(item).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});


```

2. **``ApiClient`` configuration**
```javascript
let AutodeskForgeDesignAutomation = require('autodesk.forge.designautomation');

let config = {
		        "retry" : {
		            "maxNumberOfRetries" :  7,
		            "backoffDelay" : 4000,
		            "backoffPolicy" : "exponentialBackoffWithJitter"
		        },
		        "circuitBreaker": {
		            "threshold": 11,
		            "interval": 1200
		        },
		        "requestTimeout" : 13000
		    };
    
let client = new AutodeskForgeDesignAutomation.AutodeskForgeDesignAutomationClient(config); 


// Configure OAuth2 access token for authorization: 2-legged
let oauth = client.authManager.authentications['2-legged'];
oauth.accessToken = "YOUR ACCESS TOKEN";

// And/Or you can pass fetchToken and refreshToken to manage the token
oauth.fetchToken = function() { return Promise.resolve({accessToken: "token", expiresIn: 300000}) }
oauth.refreshToken = function() { return Promise.resolve({accessToken: "token", expiresIn: 300000}) }


let api = new AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi(client)

let item = new Autodeskforgedesignautomation.Activity(); // {Activity} 

api.createActivity(item).then(function(data) {
  console.log('API called successfully. Returned data: ' + data);
}, function(error) {
  console.error(error);
});


```

## Documentation for API Endpoints

All URIs are relative to *https://developer.api.autodesk.com/da/us-east*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createActivity**](docs/AutodeskForgeDesignautomationApi.md#createActivity) | **POST** /v3/activities | Creates a new Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createActivityAlias**](docs/AutodeskForgeDesignautomationApi.md#createActivityAlias) | **POST** /v3/activities/{id}/aliases | Creates a new alias for this Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createActivityVersion**](docs/AutodeskForgeDesignautomationApi.md#createActivityVersion) | **POST** /v3/activities/{id}/versions | Creates a new version of the Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createAppBundle**](docs/AutodeskForgeDesignautomationApi.md#createAppBundle) | **POST** /v3/appbundles | Creates a new AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createAppBundleAlias**](docs/AutodeskForgeDesignautomationApi.md#createAppBundleAlias) | **POST** /v3/appbundles/{id}/aliases | Creates a new alias for this AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createAppBundleVersion**](docs/AutodeskForgeDesignautomationApi.md#createAppBundleVersion) | **POST** /v3/appbundles/{id}/versions | Creates a new version of the AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createNickname**](docs/AutodeskForgeDesignautomationApi.md#createNickname) | **PATCH** /v3/forgeapps/{id} | Creates/updates the nickname for the current Forge app.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createWorkItem**](docs/AutodeskForgeDesignautomationApi.md#createWorkItem) | **POST** /v3/workitems | Creates a new WorkItem and queues it for processing.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**createWorkItemsBatch**](docs/AutodeskForgeDesignautomationApi.md#createWorkItemsBatch) | **POST** /v3/workitems/batch | Creates new WorkItems and queues them for processing.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteActivity**](docs/AutodeskForgeDesignautomationApi.md#deleteActivity) | **DELETE** /v3/activities/{id} | Deletes the specified Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteActivityAlias**](docs/AutodeskForgeDesignautomationApi.md#deleteActivityAlias) | **DELETE** /v3/activities/{id}/aliases/{aliasId} | Deletes the alias.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteActivityVersion**](docs/AutodeskForgeDesignautomationApi.md#deleteActivityVersion) | **DELETE** /v3/activities/{id}/versions/{version} | Deletes the specified version of the Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteAppBundle**](docs/AutodeskForgeDesignautomationApi.md#deleteAppBundle) | **DELETE** /v3/appbundles/{id} | Deletes the specified AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteAppBundleAlias**](docs/AutodeskForgeDesignautomationApi.md#deleteAppBundleAlias) | **DELETE** /v3/appbundles/{id}/aliases/{aliasId} | Deletes the alias.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteAppBundleVersion**](docs/AutodeskForgeDesignautomationApi.md#deleteAppBundleVersion) | **DELETE** /v3/appbundles/{id}/versions/{version} | Deletes the specified version of the AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteForgeApp**](docs/AutodeskForgeDesignautomationApi.md#deleteForgeApp) | **DELETE** /v3/forgeapps/{id} | Delete all data associated with this Forge app.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteServiceLimits**](docs/AutodeskForgeDesignautomationApi.md#deleteServiceLimits) | **DELETE** /v3/servicelimits/{owner} | Deletes user service limits.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**deleteWorkitem**](docs/AutodeskForgeDesignautomationApi.md#deleteWorkitem) | **DELETE** /v3/workitems/{id} | Cancels a specific WorkItem.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getActivities**](docs/AutodeskForgeDesignautomationApi.md#getActivities) | **GET** /v3/activities | Lists all available Activities.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getActivity**](docs/AutodeskForgeDesignautomationApi.md#getActivity) | **GET** /v3/activities/{id} | Gets the details of the specified Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getActivityAlias**](docs/AutodeskForgeDesignautomationApi.md#getActivityAlias) | **GET** /v3/activities/{id}/aliases/{aliasId} | Get alias details.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getActivityAliases**](docs/AutodeskForgeDesignautomationApi.md#getActivityAliases) | **GET** /v3/activities/{id}/aliases | Lists all aliases for the specified Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getActivityVersion**](docs/AutodeskForgeDesignautomationApi.md#getActivityVersion) | **GET** /v3/activities/{id}/versions/{version} | Gets the details of the specified version of the Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getActivityVersions**](docs/AutodeskForgeDesignautomationApi.md#getActivityVersions) | **GET** /v3/activities/{id}/versions | Lists all versions of the specified Activity.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getAppBundle**](docs/AutodeskForgeDesignautomationApi.md#getAppBundle) | **GET** /v3/appbundles/{id} | Gets the details of the specified AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getAppBundleAlias**](docs/AutodeskForgeDesignautomationApi.md#getAppBundleAlias) | **GET** /v3/appbundles/{id}/aliases/{aliasId} | Get alias details.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getAppBundleAliases**](docs/AutodeskForgeDesignautomationApi.md#getAppBundleAliases) | **GET** /v3/appbundles/{id}/aliases | Lists all aliases for the specified AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getAppBundleVersion**](docs/AutodeskForgeDesignautomationApi.md#getAppBundleVersion) | **GET** /v3/appbundles/{id}/versions/{version} | Gets the details of the specified version of the AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getAppBundleVersions**](docs/AutodeskForgeDesignautomationApi.md#getAppBundleVersions) | **GET** /v3/appbundles/{id}/versions | Lists all versions of the specified AppBundle.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getAppBundles**](docs/AutodeskForgeDesignautomationApi.md#getAppBundles) | **GET** /v3/appbundles | Lists all available AppBundles.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getEngine**](docs/AutodeskForgeDesignautomationApi.md#getEngine) | **GET** /v3/engines/{id} | Gets the details of the specified Engine.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getEngines**](docs/AutodeskForgeDesignautomationApi.md#getEngines) | **GET** /v3/engines | Lists all available Engines.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getNickname**](docs/AutodeskForgeDesignautomationApi.md#getNickname) | **GET** /v3/forgeapps/{id} | Returns the user&#39;s (app) nickname.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getServiceLimit**](docs/AutodeskForgeDesignautomationApi.md#getServiceLimit) | **GET** /v3/servicelimits/{owner} | Get the service limit configuration.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getShares**](docs/AutodeskForgeDesignautomationApi.md#getShares) | **GET** /v3/shares | Gets all Shares (AppBundles and Activities) shared by this Forge app.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**getWorkitemStatus**](docs/AutodeskForgeDesignautomationApi.md#getWorkitemStatus) | **GET** /v3/workitems/{id} | Gets the status of a specific WorkItem.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**healthStatus**](docs/AutodeskForgeDesignautomationApi.md#healthStatus) | **GET** /v3/health/{engine} | 
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**modifyActivityAlias**](docs/AutodeskForgeDesignautomationApi.md#modifyActivityAlias) | **PATCH** /v3/activities/{id}/aliases/{aliasId} | Modify alias details.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**modifyAppBundleAlias**](docs/AutodeskForgeDesignautomationApi.md#modifyAppBundleAlias) | **PATCH** /v3/appbundles/{id}/aliases/{aliasId} | Modify alias details.
*AutodeskForgeDesignAutomation.AutodeskForgeDesignautomationApi* | [**modifyServiceLimits**](docs/AutodeskForgeDesignautomationApi.md#modifyServiceLimits) | **PUT** /v3/servicelimits/{owner} | Creates a new service limits configuration or updates exiting.


## Documentation for Models

 - [AutodeskForgeDesignAutomation.Activity](docs/Activity.md)
 - [AutodeskForgeDesignAutomation.Alias](docs/Alias.md)
 - [AutodeskForgeDesignAutomation.AliasPatch](docs/AliasPatch.md)
 - [AutodeskForgeDesignAutomation.AppBundle](docs/AppBundle.md)
 - [AutodeskForgeDesignAutomation.BackendLimits](docs/BackendLimits.md)
 - [AutodeskForgeDesignAutomation.Engine](docs/Engine.md)
 - [AutodeskForgeDesignAutomation.FrontendLimits](docs/FrontendLimits.md)
 - [AutodeskForgeDesignAutomation.IArgument](docs/IArgument.md)
 - [AutodeskForgeDesignAutomation.ISetting](docs/ISetting.md)
 - [AutodeskForgeDesignAutomation.NicknameRecord](docs/NicknameRecord.md)
 - [AutodeskForgeDesignAutomation.PageAlias](docs/PageAlias.md)
 - [AutodeskForgeDesignAutomation.PageInt32](docs/PageInt32.md)
 - [AutodeskForgeDesignAutomation.PageShare](docs/PageShare.md)
 - [AutodeskForgeDesignAutomation.PageString](docs/PageString.md)
 - [AutodeskForgeDesignAutomation.Parameter](docs/Parameter.md)
 - [AutodeskForgeDesignAutomation.PublicKey](docs/PublicKey.md)
 - [AutodeskForgeDesignAutomation.ServiceLimit](docs/ServiceLimit.md)
 - [AutodeskForgeDesignAutomation.Share](docs/Share.md)
 - [AutodeskForgeDesignAutomation.ShareType](docs/ShareType.md)
 - [AutodeskForgeDesignAutomation.SignedUrl](docs/SignedUrl.md)
 - [AutodeskForgeDesignAutomation.Statistics](docs/Statistics.md)
 - [AutodeskForgeDesignAutomation.Status](docs/Status.md)
 - [AutodeskForgeDesignAutomation.UploadAppBundleParameters](docs/UploadAppBundleParameters.md)
 - [AutodeskForgeDesignAutomation.Verb](docs/Verb.md)
 - [AutodeskForgeDesignAutomation.WorkItem](docs/WorkItem.md)
 - [AutodeskForgeDesignAutomation.WorkItemSignatures](docs/WorkItemSignatures.md)
 - [AutodeskForgeDesignAutomation.WorkItemStatus](docs/WorkItemStatus.md)
 - [AutodeskForgeDesignAutomation.StringArgument](docs/StringArgument.md)
 - [AutodeskForgeDesignAutomation.StringSetting](docs/StringSetting.md)
 - [AutodeskForgeDesignAutomation.UrlSetting](docs/UrlSetting.md)
 - [AutodeskForgeDesignAutomation.XrefTreeArgument](docs/XrefTreeArgument.md)


## Documentation for Authorization


### 2-legged

- **Type**: OAuth
- **Flow**: application
- **Authorization URL**: 
- **Scopes**: 
  - code:all: Author or execute your codes

### 3-legged

- **Type**: OAuth
- **Flow**: accessCode
- **Authorization URL**: https://developer.api.autodesk.com/authentication/v1/authorize
- **Scopes**: 
  - code:all: Author or execute your codes


## License

This sample is licensed under the terms of the **Apache License 2.0**. Please see the [LICENSE](LICENSE) file for full details.
