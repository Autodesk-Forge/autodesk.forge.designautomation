/* Autodesk Inc. AutodeskForgeDesignAutomation */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var superagent = _interopDefault(require('superagent'));
var stringify = _interopDefault(require('qs'));
var retry = _interopDefault(require('async/retry'));
var each = _interopDefault(require('async/each'));
var circuitBreaker = require('@bennadel/circuit-breaker');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OAuth2Manager =
/*#__PURE__*/
function () {
  function OAuth2Manager(config) {
    _classCallCheck(this, OAuth2Manager);

    var that = this;
    that.authConfig = config;
    that.oauth2Token = {};
    that.preserveOAuth2Config();
  }

  _createClass(OAuth2Manager, [{
    key: "clearOff",
    value: function clearOff() {
      var that = this; //setTimeout(function() {

      delete that.fetchTokenPromise;
      delete that.refreshTokenPromise;
      if (that._oauth2RefreshTokenScheduled) clearTimeout(that._oauth2RefreshTokenScheduled); //}, 10);
    }
  }, {
    key: "refreshOAuth2Token",
    value: function refreshOAuth2Token() {
      var that = this;
      var oauth2Config = that.authConfig;
      if (that.refreshTokenPromise) return that.refreshTokenPromise;

      if (that._oauth2RefreshTokenScheduled) {
        clearTimeout(that._oauth2RefreshTokenScheduled);
        delete that._oauth2RefreshTokenScheduled;
      }

      if (!isNaN(that.oauth2Token.expires_in) && typeof oauth2Config.refreshToken === "function") {
        var endsIn = that.oauth2Token.expires_at !== undefined ? Math.max(0, Math.floor((new Date(that.oauth2Token.expires_at).getTime() - new Date().getTime()) / 1000)) : Math.max(0, that.oauth2Token.expires_in - 100);
        that._oauth2RefreshTokenScheduled = setTimeout(function () {
          that.refreshTokenPromise = oauth2Config.refreshToken(that.oauth2Token);
          that.refreshTokenPromise.then(function (data) {
            that.clearOff();
            that.storeOAuth2Token(data);
            that.refreshOAuth2Token();
          }, function () {
            that.clearOff();
            that.fetchToken();
          });
        }, 1000 * endsIn);
      }
    }
  }, {
    key: "fetchOAuth2Token",
    value: function fetchOAuth2Token() {
      var that = this;
      var oauth2Config = that.authConfig;
      if (that.fetchTokenPromise) return that.fetchTokenPromise;

      if (typeof oauth2Config.fetchToken === "function") {
        that.fetchTokenPromise = oauth2Config.fetchToken();
        return that.fetchTokenPromise.then(function (data) {
          that.clearOff();
          that.storeOAuth2Token(data);
          that.refreshOAuth2Token();
        }, function () {
          that.clearOff();
          that.fetchToken();
        });
      }
    }
  }, {
    key: "storeOAuth2Token",
    value: function storeOAuth2Token(data) {
      var that = this;
      that.oauth2Token = {
        accessToken: data.accessToken || data.access_token,
        refreshToken: data.refreshToken || data.refresh_token,
        expires_in: data.expiresIn || data.expires_in,
        expires_at: data.expiresAt || data.expires_at,
        token_type: data.tokenType || data.token_type
      };
    }
  }, {
    key: "preserveOAuth2Config",
    value: function preserveOAuth2Config() {
      var that = this;
      var oauth2Config = that.authConfig;

      if (oauth2Config.accessToken) {
        that.storeOAuth2Token(oauth2Config);
        that.refreshOAuth2Token();
      } else {
        that.fetchOAuth2Token();
      }
    }
  }, {
    key: "getOAuth2TokenInfo",
    value: function getOAuth2TokenInfo() {
      var that = this;
      return new Promise(function (resolve, reject) {
        var tokenFetcher = that.refreshTokenPromise || that.fetchTokenPromise;

        if (tokenFetcher) {
          tokenFetcher.then(function () {
            resolve(that.OAuth2Token);
          }, function () {
            reject("Error while fetching the accessToken");
          });
        } else if (that.oauth2Token.accessToken) {
          resolve(that.oauth2Token);
        } else {
          resolve();
        }
      });
    }
  }, {
    key: "OAuth2Token",
    get: function get() {
      return Object.assign({}, this.oauth2Token);
    }
  }, {
    key: "accessToken",
    set: function set(val) {
      if (val) {
        this.oauth2Token.accessToken = val;
      }
    }
  }, {
    key: "refreshToken",
    set: function set(fun) {
      var that = this;

      if (typeof fun === "function") {
        that.authConfig.refreshToken = fun;
        that.refreshOAuth2Token();
      } else {
        throw "refreshToken value must be a function";
      }
    }
  }, {
    key: "expires_in",
    set: function set(val) {
      if (!isNaN(val)) {
        this.oauth2Token.expires_in = val;
      }
    }
  }, {
    key: "expires_at",
    set: function set(val) {
      if (!isNaN(val)) {
        this.oauth2Token.expires_at = val;
      }
    }
  }, {
    key: "token_type",
    set: function set(val) {
      if (!isNaN(val)) {
        this.oauth2Token.token_type = val;
      }
    }
  }, {
    key: "fetchToken",
    set: function set(fun) {
      var that = this;

      if (typeof fun === "function") {
        that.authConfig.fetchToken = fun;
        that.fetchOAuth2Token();
      } else {
        throw "fetchToken value must be a function";
      }
    }
  }, {
    key: "type",
    get: function get() {
      return "oauth2";
    }
  }]);

  return OAuth2Manager;
}();

var apiKeyManager =
/*#__PURE__*/
function () {
  function apiKeyManager(config) {
    _classCallCheck(this, apiKeyManager);

    this.authConfig = config;
  }

  _createClass(apiKeyManager, [{
    key: "getAPIKeyInfo",
    value: function getAPIKeyInfo() {
      var that = this;
      return new Promise(function (resolve, reject) {
        var apiKey = that.authConfig;

        if (apiKey) {
          resolve(apiKey);
        } else {
          reject("No APIkey Found");
        }
      });
    }
  }, {
    key: "type",
    get: function get() {
      return "apiKey";
    }
  }]);

  return apiKeyManager;
}();

var basicAuthManager =
/*#__PURE__*/
function () {
  function basicAuthManager(config) {
    _classCallCheck(this, basicAuthManager);

    this.authConfig = config;
  }

  _createClass(basicAuthManager, [{
    key: "getBasicAuthInfo",
    value: function getBasicAuthInfo() {
      var that = this;
      return new Promise(function (resolve, reject) {
        var basicAuth = that.authConfig;

        if (basicAuth) {
          resolve(basicAuth);
        } else {
          reject("No Basic auth info Found");
        }
      });
    }
  }, {
    key: "type",
    get: function get() {
      return "basic";
    }
  }]);

  return basicAuthManager;
}();

var AuthManager =
/*#__PURE__*/
function () {
  function AuthManager(config) {
    _classCallCheck(this, AuthManager);

    var that = this;
    that._authentications = config;
    that.authentications = {};
    that.init();
  }

  _createClass(AuthManager, [{
    key: "init",
    value: function init() {
      var that = this;

      for (var authName in that._authentications) {
        var authConfig = that._authentications[authName];
        var manager = null;

        switch (authConfig.type) {
          case "oauth2":
            manager = new OAuth2Manager(authConfig);
            break;

          case "apiKey":
          case "basic":
            manager = Object.assign({}, authConfig);
            manager = Object.assign({}, authConfig);
            break;

          default:
            throw new Error('Unknown authentication type: ' + auth.type);
        }

        that.authentications[authName] = manager;
      }
    }
  }]);

  return AuthManager;
}();

var authentications = {
  '2-legged': {
    type: 'oauth2'
  },
  '3-legged': {
    type: 'oauth2'
  }
};
var authManager = new AuthManager(authentications);

// Taken from https://github.com/segmentio/superagent-retry. We needed custom retry behavior. So using retry checks directly.

/**
 * Connection reset detection
 */
function econnreset(err, res) {
  return err && err.code === 'ECONNRESET';
}
/**
 * Connection refused detection
 */


function econnrefused(err, res) {
  return err && err.code === 'ECONNREFUSED';
}
/**
 * Timeout detection
 */


function etimedout(err, res) {
  return err && err.code === 'ETIMEDOUT';
}
/**
 * Can't get address info
 */


function eaddrinfo(err, res) {
  return err && err.code === 'EADDRINFO';
}
/**
 * Socket timeout detection
 */


function esockettimedout(err, res) {
  return err && err.code === 'ESOCKETTIMEDOUT';
}
/**
 * Internal server error
 */


function internal(err, res) {
  return res && res.status === 500;
}
/**
 * Bad gateway error detection
 */


function gateway(err, res) {
  return res && [502, 503, 504].indexOf(res.status) !== -1;
}
/**
 * Superagent timeout errors // 408
 */


function timeout(err, res) {
  return err && /^timeout of \d+ms exceeded$/.test(err.message);
}

function possibleServerError(error, response) {
  var isServerSideIssue = !!(econnreset(error, response) || econnrefused(error, response) || etimedout(error, response) || eaddrinfo(error, response) || esockettimedout(error, response) || gateway(error, response) || timeout(error, response) || aborted(error, response) || internal(error, response));
  return isServerSideIssue;
}
/**
* Superagent Connection aborted
*/


function aborted(err, response) {
  return err && err.timeout && err.code == 'ECONNABORTED';
}
/**
* crossDomain error
*/


function crossdomain(err, response) {
  return err && err.crossDomain;
}

function possibleClientError(error, response) {
  return !!crossdomain(error, response);
}

var responseChecks = {
  econnreset: econnreset,
  econnrefused: econnrefused,
  etimedout: etimedout,
  eaddrinfo: eaddrinfo,
  esockettimedout: esockettimedout,
  gateway: gateway,
  timeout: timeout,
  internal: internal,
  crossdomain: crossdomain,
  aborted: aborted,
  possibleServerError: possibleServerError,
  possibleClientError: possibleClientError
};

/**
 * autodesk.forge.designautomation
 * Asynchronous Node.js library for the Autodesk Forge Design Automation v3 implementation.
 *
 * OpenAPI spec version: 3.0.3
 * Contact: forge.help@autodesk.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

/**
* default resiliency configuration
* retry.maxNumberOfRetries: maximum number of http request retries
* retry.backoffDelay: minimum backoffDelay between two consecutive http requests
* retry.backoffPolicy: backoffPolicy to calculate delay between two consecutive http requests. (e.g. fixedBackoff, exponentialBackoffWithJitter, exponentialBackoff)
* circuitBreaker.volumeThreshold: The number of requests that have to be completed (within the rolling metrics window) before failure percentages can be calculated.
* circuitBreaker.failureThreshold: The percent (in whole numbers) of failures that can occur in the rolling metrics window before the state of the Circuit Breaker switches to opened.
* circuitBreaker.activeThreshold: The number of concurrent requests that can hang (ie, not complete) before the state of the Circuit Breaker switches to opened.
* circuitBreaker.bucketCount: The number of buckets to be used to collect rolling stats in the rolling metrics window.
* circuitBreaker.bucketDuration: The duration (in milliseconds) of each bucket within the rolling metrics window.
* requestTimeout: The time (in milliseconds) that a pending request is allowed to hang (ie, not complete) before being timed-out in error.
*/
var defaultConfig = {
  "retry": {
    "maxNumberOfRetries": 3,
    "backoffDelay": 1000,
    "backoffPolicy": "fixedBackoff"
  },
  "circuitBreaker": {
    "volumeThreshold": 10,
    "failureThreshold": 10,
    "activeThreshold": 50,
    "bucketCount": 30,
    "bucketDuration": 1000
  },
  "requestTimeout": 5000
};

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); return Constructor; }
/**
* @module AutodeskForgeDesignAutomationClient
* @version 3.0.3
*/

/**
* Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
* application to use this class directly - the *Api and model classes provide the public API for the service. The
* contents of this file should be regarded as internal but are documented for completeness.
* @alias module:AutodeskForgeDesignAutomationClient
* @class
*/

var AutodeskForgeDesignAutomationClient =
/*#__PURE__*/
function () {
  function AutodeskForgeDesignAutomationClient(resiliencyConfig) {
    _classCallCheck$1(this, AutodeskForgeDesignAutomationClient);

    var that = this;
    this.config = that._validateConfig(resiliencyConfig);
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default https://developer.api.autodesk.com/da/us-east
     */

    this.basePath = 'https://developer.api.autodesk.com/da/us-east'.replace(/\/+$/, '');
    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */

    this.authentications = {
      '2-legged': {
        type: 'oauth2'
      },
      '3-legged': {
        type: 'oauth2'
      }
    };
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */

    this.defaultHeaders = {};
    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 
     */

    var requestTimeout = this.config.requestTimeout;
    this.timeout = requestTimeout;
    /**
     * The default number of retries.
     * @type {Number}
     * @default 
     */

    this.maxNumberOfRetries = this.config.retry.maxNumberOfRetries; // Checkout https://www.npmjs.com/package/@bennadel/circuit-breaker#configuration-usage for more information

    this.circuitBreakerConfig = {
      // The unique identifier of the underlying state instance, which is used for logging
      id: "Autodeskforgedesignautomation",
      // The time (in milliseconds) that a pending request is allowed to hang (ie, not complete) before being timed-out in error.
      requestTimeout: requestTimeout,
      // The number of requests that have to be completed (within the rolling metrics window) before failure percentages can be calculated.
      volumeThreshold: this.config.circuitBreaker.volumeThreshold,
      // The percent (in whole numbers) of failures that can occur in the rolling metrics window before the state of the Circuit Breaker switches to opened.
      failureThreshold: this.config.circuitBreaker.failureThreshold,
      // The number of concurrent requests that can hang (ie, not complete) before the state of the Circuit Breaker switches to opened.
      activeThreshold: this.config.circuitBreaker.activeThreshold,
      // The number of buckets to be used to collect rolling stats in the rolling metrics window.
      bucketCount: this.config.circuitBreaker.bucketCount,
      // The duration (in milliseconds) of each bucket within the rolling metrics window.
      bucketDuration: this.config.circuitBreaker.bucketDuration,
      // The monitor -- Function or instance -- for external logging (ex, StatsD logging).
      monitor: this.circuitBreakerMonitor.bind(this),
      // The function that determines if the given failure is an error; or, if it should be classified as a success (such as a 404 response).
      isFailure: this.circuitBreakerIsFailure,
      // The global fallback to be used for all executions in the Circuit Breaker (which can be overridden locally with each execution).
      fallback: undefined // {},

    };
    /**
     * If set to false an additional timestamp parameter is added to all API GET calls to
     * prevent browser caching
     * @type {Boolean}
     * @default true
     */

    this.cache = true;
    /**
     * If set to true, the client will save the cookies from each server
     * response, and return them in the next request.
     * @default false
     */

    this.enableCookies = false;
    /*
     * Used to save and return cookies in a node.js (non-browser) setting,
     * if this.enableCookies is set to true.
     */

    if (typeof window === 'undefined') {
      this.agent = new superagent.agent();
    }
    /*
     * Allow user to override superagent agent
     */


    this.requestAgent = null;
    /**
    * Auth manager
    */

    this.authManager = authManager;
    this.superagent = superagent;
  }
  /**
   * validates resiliency configuration and replaces missing configuration with default.
   * @param config resiliency configuration
   * @default {}
   */


  _createClass$1(AutodeskForgeDesignAutomationClient, [{
    key: "_validateConfig",
    value: function _validateConfig(config) {

      if (typeof config === 'undefined') {
        config = defaultConfig;
        return config;
      }

      if (typeof config.retry === 'undefined') {
        config.retry = defaultConfig.retry;
      } else {
        if (typeof config.retry.maxNumberOfRetries === 'undefined') {
          config.retry.maxNumberOfRetries = defaultConfig.retry.maxNumberOfRetries;
        }

        if (typeof config.retry.backoffDelay === 'undefined') {
          config.retry.backoffDelay = defaultConfig.retry.backoffDelay;
        }

        if (typeof config.retry.backoffPolicy === 'undefined') {
          config.retry.backoffPolicy = defaultConfig.retry.backoffPolicy;
        }
      }

      if (typeof config.circuitBreaker === 'undefined') {
        config.circuitBreaker = defaultConfig.circuitBreaker;
      } else {
        if (typeof config.circuitBreaker.volumeThreshold === 'undefined') {
          config.circuitBreaker.volumeThreshold = defaultConfig.circuitBreaker.volumeThreshold;
        }

        if (typeof config.circuitBreaker.failureThreshold === 'undefined') {
          config.circuitBreaker.failureThreshold = defaultConfig.circuitBreaker.failureThreshold;
        }

        if (typeof config.circuitBreaker.activeThreshold === 'undefined') {
          config.circuitBreaker.activeThreshold = defaultConfig.circuitBreaker.activeThreshold;
        }

        if (typeof config.circuitBreaker.bucketCount === 'undefined') {
          config.circuitBreaker.bucketCount = defaultConfig.circuitBreaker.bucketCount;
        }

        if (typeof config.circuitBreaker.bucketDuration === 'undefined') {
          config.circuitBreaker.bucketDuration = defaultConfig.circuitBreaker.bucketDuration;
        }
      }

      if (typeof config.requestTimeout === 'undefined') {
        config.requestTimeout = defaultConfig.requestTimeout;
      }

      return config;
    }
    /**
    * Monitor Callback for Circuit Breaker.
    * @param eventType The Event Type.
    * @param eventData The Event Data. // https://www.npmjs.com/package/@bennadel/circuit-breaker#logging-and-monitoring
    */

  }, {
    key: "circuitBreakerMonitor",
    value: function circuitBreakerMonitor(eventType, eventData) {
      if (typeof this.circuitBreakerMetricsListener === "function") {
        try {
          this.circuitBreakerMetricsListener(eventType, eventData);
        } catch (e) {
          console.log('Some error in Metrics listener');
        }
      }
    }
    /**
    * Failure Callback for Circuit Breaker. The function that determines if the given failure is an error; or, if it should be classified as a success (such as a 404 response).
    * @param eventType The Event Type.
    * @param eventData The Event Data. // https://www.npmjs.com/package/@bennadel/circuit-breaker#logging-and-monitoring
    */

  }, {
    key: "circuitBreakerIsFailure",
    value: function circuitBreakerIsFailure(error) {
      var serverIssue = responseChecks.possibleServerError(error.error, error.response);
      return serverIssue;
    }
    /**
    * Returns a string representation for an actual parameter.
    * @param param The actual parameter.
    * @returns {String} The string representation of <code>param</code>.
    */

  }, {
    key: "paramToString",
    value: function paramToString(param) {
      if (param == undefined || param == null) {
        return '';
      }

      if (param instanceof Date) {
        return param.toJSON();
      }

      return param.toString();
    }
    /**
    * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
    * NOTE: query parameters are not handled here.
    * @param {String} path The path to append to the base URL.
    * @param {Object} pathParams The parameter values to append.
    * @returns {String} The encoded path with parameter values substituted.
    */

  }, {
    key: "buildUrl",
    value: function buildUrl(path, pathParams) {
      var _this2 = this;

      if (!path.match(/^\//)) {
        path = '/' + path;
      }

      var url = this.basePath + path;
      url = url.replace(/\{([\w-]+)\}/g, function (fullMatch, key) {
        var value;

        if (pathParams.hasOwnProperty(key)) {
          value = _this2.paramToString(pathParams[key]);
        } else {
          value = fullMatch;
        }

        return encodeURIComponent(value);
      });
      return url;
    }
    /**
    * Checks whether the given content type represents JSON.<br>
    * JSON content type examples:<br>
    * <ul>
    * <li>application/json</li>
    * <li>application/json; charset=UTF8</li>
    * <li>APPLICATION/JSON</li>
    * </ul>
    * @param {String} contentType The MIME content type to check.
    * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
    */

  }, {
    key: "isJsonMime",
    value: function isJsonMime(contentType) {
      return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
    }
    /**
    * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
    * @param {Array.<String>} contentTypes
    * @returns {String} The chosen content type, preferring JSON.
    */

  }, {
    key: "jsonPreferredMime",
    value: function jsonPreferredMime(contentTypes) {
      for (var i = 0; i < contentTypes.length; i++) {
        if (this.isJsonMime(contentTypes[i])) {
          return contentTypes[i];
        }
      }

      return contentTypes[0];
    }
    /**
    * Checks whether the given parameter value represents file-like content.
    * @param param The parameter to check.
    * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
    */

  }, {
    key: "isFileParam",
    value: function isFileParam(param) {
      // fs.ReadStream in Node.js and Electron (but not in runtime like browserify)
      if (typeof require === 'function') {
        var fs;

        try {
          fs = require('fs');
        } catch (err) {}

        if (fs && fs.ReadStream && param instanceof fs.ReadStream) {
          return true;
        }
      } // Buffer in Node.js


      if (typeof Buffer === 'function' && param instanceof Buffer) {
        return true;
      } // Blob in browser


      if (typeof Blob === 'function' && param instanceof Blob) {
        return true;
      } // File in browser (it seems File object is also instance of Blob, but keep this for safe)


      if (typeof File === 'function' && param instanceof File) {
        return true;
      }

      return false;
    }
    /**
    * Normalizes parameter values:
    * <ul>
    * <li>remove nils</li>
    * <li>keep files and arrays</li>
    * <li>format to string with `paramToString` for other cases</li>
    * </ul>
    * @param {Object.<String, Object>} params The parameters as object properties.
    * @returns {Object.<String, Object>} normalized parameters.
    */

  }, {
    key: "normalizeParams",
    value: function normalizeParams(params) {
      var newParams = {};

      for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
          var value = params[key];

          if (this.isFileParam(value) || Array.isArray(value)) {
            newParams[key] = value;
          } else {
            newParams[key] = this.paramToString(value);
          }
        }
      }

      return newParams;
    }
    /**
    * Enumeration of collection format separator strategies.
    * @enum {String}
    * @readonly
    */

  }, {
    key: "buildCollectionParam",

    /**
    * Builds a string representation of an array-type actual parameter, according to the given collection format.
    * @param {Array} param An array parameter.
    * @param {module:AutodeskForgeDesignAutomationClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
    * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
    * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
    */
    value: function buildCollectionParam(param, collectionFormat) {
      if (param == null) {
        return null;
      }

      switch (collectionFormat) {
        case 'csv':
          return param.map(this.paramToString).join(',');

        case 'ssv':
          return param.map(this.paramToString).join(' ');

        case 'tsv':
          return param.map(this.paramToString).join('\t');

        case 'pipes':
          return param.map(this.paramToString).join('|');

        case 'multi':
          //return the array directly as SuperAgent will handle it as expected
          return param.map(this.paramToString);

        default:
          throw new Error('Unknown collection format: ' + collectionFormat);
      }
    }
    /**
    * Applies authentication headers to the request.
    * @param {Object} request The request object created by a <code>superagent()</code> call.
    * @param {Array.<String>} authNames An array of authentication method names.
    */

  }, {
    key: "applyAuthToRequest",
    value: function applyAuthToRequest(request, authNames) {
      var that = this;
      return new Promise(function (resolve, reject) {
        each(authNames, function (authName, cb) {
          var manager = that.authManager.authentications[authName];

          if (!manager) {
            cb('Unknown auth type');
          }

          switch (manager.type) {
            case 'basic':
              Promise.resolve(manager).then(function (auth) {
                if (auth && (auth.username || auth.password)) {
                  request.auth(auth.username || '', auth.password || '');
                }

                cb();
              }, cb);
              break;

            case 'apiKey':
              Promise.resolve(manager).then(function (auth) {
                if (auth && auth.apiKey) {
                  var data = {};

                  if (auth.apiKeyPrefix) {
                    data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
                  } else {
                    data[auth.name] = auth.apiKey;
                  }

                  if (auth['in'] === 'header') {
                    request.set(data);
                  } else {
                    request.query(data);
                  }
                }

                cb();
              }, cb);
              break;

            case 'oauth2':
              manager.getOAuth2TokenInfo().then(function (auth) {
                if (auth && auth.accessToken) {
                  request.set({
                    'Authorization': 'Bearer ' + auth.accessToken
                  });
                }

                cb();
              }, cb);
              break;
          }
        }, function (err) {
          if (!err) {
            resolve();
          } else {
            reject(err);
          }
        });
      });
    }
    /**
    * Deserializes an HTTP response body into a value of the specified type.
    * @param {Object} response A SuperAgent response object.
    * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
    * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
    * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
    * all properties on <code>data<code> will be converted to this type.
    * @returns A value of the specified type.
    */

  }, {
    key: "deserialize",
    value: function deserialize(response, returnType) {
      if (response == null || returnType == null || response.status == 204) {
        return null;
      } // Rely on SuperAgent for parsing response body.
      // See http://visionmedia.github.io/superagent/#parsing-response-bodies


      var data = response.body;

      if (data == null || _typeof(data) === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length) {
        // SuperAgent does not always produce a body; use the unparsed response as a fallback
        data = response.text;
      }

      return AutodeskForgeDesignAutomationClient.convertToType(data, returnType);
    }
    /**
    * Invokes the REST service using the supplied settings and parameters.
    * @param {String} path The base URL to invoke.
    * @param {String} httpMethod The HTTP method to use.
    * @param {Object.<String, String>} pathParams A map of path parameters and their values.
    * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
    * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
    * @param {Object.<String, Object>} formParams A map of form parameters and their values.
    * @param {Object} bodyParam The value to pass as the request body.
    * @param {Array.<String>} authNames An array of authentication type names.
    * @param {Array.<String>} contentTypes An array of request MIME types.
    * @param {Array.<String>} accepts An array of acceptable response MIME types.
    * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the constructor for a complex type.
    * @param {module:AutodeskForgeDesignAutomationClient~callApiCallback} callback The callback function.
    * @returns {Object} The SuperAgent request object.
    */

  }, {
    key: "_apiCaller",
    value: function _apiCaller(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType, callback, request) {
      var that = this;
      var url = that.buildUrl(path, pathParams);
      var request = superagent(httpMethod, url); // apply authentications

      that.applyAuthToRequest(request, authNames).then(function () {
        // set query parameters
        if (httpMethod.toUpperCase() === 'GET' && that.cache === false) {
          queryParams['_'] = new Date().getTime();
        }

        request.query(that.normalizeParams(queryParams)); // set header parameters

        request.set(that.defaultHeaders).set(that.normalizeParams(headerParams)); // set requestAgent if it is set by user

        if (that.requestAgent) {
          request.agent(that.requestAgent);
        } // set request timeout


        request.timeout(that.timeout);
        var contentType = that.jsonPreferredMime(contentTypes);

        if (contentType) {
          // Issue with superagent and multipart/form-data (https://github.com/visionmedia/superagent/issues/746)
          if (contentType != 'multipart/form-data') {
            request.type(contentType);
          }
        } else if (!request.header['Content-Type']) {
          request.type('application/json');
        }

        if (contentType === 'application/x-www-form-urlencoded') {
          request.send(stringify(that.normalizeParams(formParams)));
        } else if (contentType == 'multipart/form-data') {
          var _formParams = that.normalizeParams(formParams);

          for (var key in _formParams) {
            if (_formParams.hasOwnProperty(key)) {
              if (that.isFileParam(_formParams[key])) {
                // file field
                request.attach(key, _formParams[key]);
              } else {
                request.field(key, _formParams[key]);
              }
            }
          }
        } else if (bodyParam) {
          request.send(bodyParam);
        }

        var accept = that.jsonPreferredMime(accepts);

        if (accept) {
          request.accept(accept);
        }

        if (returnType === 'Blob') {
          request.responseType('blob');
        } else if (returnType === 'String') {
          request.responseType('string');
        } // Attach previously saved cookies, if enabled


        if (that.enableCookies) {
          if (typeof window === 'undefined') {
            that.agent.attachCookies(request);
          } else {
            request.withCredentials();
          }
        } // Filtering out client side errors to not to reach CircuitBreaker error count.


        request.retry(that.maxNumberOfRetries * 2, responseChecks.possibleClientError);

        var execute = function execute() {
          request.end(function (error, response) {
            if (callback) {
              var data = null;

              if (!error) {
                try {
                  data = that.deserialize(response, returnType);

                  if (that.enableCookies && typeof window === 'undefined') {
                    that.agent.saveCookies(response);
                  }
                } catch (err) {
                  error = err;
                }
              }

              callback(error, data, response, request);
            }
          });
        };

        if (typeof that.config.requestExtender === "function") {
          that.config.requestExtender(request, function () {
            execute();
          });
        } else {
          execute();
        }
      }, function (error) {
        callback(error, null, null, null);
      }); // return request;
    }
    /**
    * Invokes the REST service using the supplied settings and parameters.
    * @param {String} path The base URL to invoke.
    * @param {String} httpMethod The HTTP method to use.
    * @param {Object.<String, String>} pathParams A map of path parameters and their values.
    * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
    * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
    * @param {Object.<String, Object>} formParams A map of form parameters and their values.
    * @param {Object} bodyParam The value to pass as the request body.
    * @param {Array.<String>} authNames An array of authentication type names.
    * @param {Array.<String>} contentTypes An array of request MIME types.
    * @param {Array.<String>} accepts An array of acceptable response MIME types.
    * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the constructor for a complex type.
    // Injected Code --- Start
    * @param {Object} config Optional Configuration parameters. Configure resiliency and request.
    * @param {module:<#invokerPackage><&invokerPackage>/</invokerPackage><#apiPackage><&apiPackage>/</apiPackage><&classname>~<operationId>RequestExtender} config.requestExtender The callback function, accepting an argument: The SuperAgent request object. Customize request object before it is executed.
    * @param {Integer} config.maxNumberOfRetries This number restricts the maximum number of retry attempts in valid conditions. If `canRetry` callback returns false, this number does not cause any impact.
    // Injected Code --- End
    * @returns {Promise} A {@link https://www.promisejs.org/|Promise} object.
    */

  }, {
    key: "callApi",
    value: function callApi(path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType) {
      // add/update user agent
      if (typeof headerParams['User-Agent'] === 'undefined') {
        headerParams['User-Agent'] = 'autodeskforgedesignautomation-js-sdk' + '/3.0.3' + ' (Forge RSDK)';
      } else {
        var userAgent = headerParams['User-Agent'];
        userAgent = userAgent.concat(' autodeskforgedesignautomation-js-sdk').concat('/3.0.3').concat(' (Forge RSDK)');
        headerParams['User-Agent'] = userAgent;
      }

      var that = this;
      var base = that.config.retry.backoffDelay;
      var max_backoff = 10000;
      var requestStrategies = {
        exponentialBackoffWithJitter: function exponentialBackoffWithJitter(retryCount) {
          // Calculation taken from AWS-SDK (https://github.com/aws/aws-sdk-js)
          var delay = Math.min(max_backoff, Math.random() * 100 + (base + Math.pow(2, retryCount) * 100));
          return delay;
        },
        exponentialBackoff: function exponentialBackoff(retryCount) {
          var delay = Math.min(max_backoff, base + Math.pow(2, retryCount) * 100);
          return delay;
        },
        fixedBackoff: function fixedBackoff() {
          return base;
        }
      };
      var aliasConfig = {
        maxNumberOfRetries: that.config.retry.maxNumberOfRetries,
        requestExtender: function requestExtender(request, cb) {
          var requestExtender = that.config.requestExtender;

          if (typeof requestExtender === "function") {
            try {
              requestExtender(request, cb);
            } catch (e) {
              console.log(e);
              cb();
            }
          } else {
            cb();
          }
        },
        canRetry: function canRetry(data) {
          var canRetry = that.config.retry.backoffPolicy;

          var retryable = function retryable() {
            // const request = data.request;
            // request._maxRetries = 20;
            // Filtering only server side errors. Because these errors contribute to Circuit Breaker error count.
            var isServerSideIssue = responseChecks.possibleServerError(data.error, data.response);
            return isServerSideIssue; // return request._shouldRetry(data.error, data.response);
          };

          {
            return retryable();
          }
        },
        delayCalculator: function delayCalculator(retryCount) {
          var delay = undefined;
          var retryPolicy = that.config.retry.backoffPolicy;

          switch (retryPolicy) {
            case "exponentialBackoffWithJitter":
              delay = requestStrategies["exponentialBackoffWithJitter"](retryCount);
              break;

            case "exponentialBackoff":
              delay = requestStrategies["exponentialBackoff"](retryCount);
              break;

            case "fixedBackoff":
              delay = requestStrategies["fixedBackoff"]();
              break;

            default:
              delay = requestStrategies["fixedBackoff"]();
          }

          return delay;
        }
      };

      var _apiCaller = that._apiCaller.bind(that, path, httpMethod, pathParams, queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts, returnType);

      var executor = function executor(cb) {
        var _this = this;

        var call = function call() {
          return new Promise(function (resolve, reject) {
            var cb = function cb(error, data, response, request) {
              var resp = {
                error: error,
                data: data,
                response: response,
                request: request
              };

              if (error) {
                reject(resp);
              } else {
                resolve(resp);
              }
            };

            _apiCaller(cb);
          });
        };

        var _circuitBreaker = _this.circuitBreaker || apiClientInstance.circuitBreaker;

        _circuitBreaker.execute(call).then(function (result) {
          cb(null, result.error ? null : result);
        }, function (errObj) {
          cb(errObj);
        });
      };

      var successCB, failureCB;
      retry({
        times: aliasConfig.maxNumberOfRetries,
        interval: aliasConfig.delayCalculator,
        errorFilter: aliasConfig.canRetry
      }, executor.bind(that), function (errObj, result) {
        {
          if (errObj) {
            failureCB(errObj.error || errObj);
          } else {
            result = result || {};
            successCB({
              data: result.data,
              response: result.response
            });
          }
        }
      });
      return new Promise(function (resolve, reject) {
        successCB = resolve;
        failureCB = reject;
      });
    }
    /**
    * Parses an ISO-8601 string representation of a date value.
    * @param {String} str The date value as a string.
    * @returns {Date} The parsed date object.
    */

  }, {
    key: "CollectionFormatEnum",
    get: function get() {
      return {
        /**
        * Comma-separated values. Value: <code>csv</code>
        * @const
        */
        CSV: ',',

        /**
        * Space-separated values. Value: <code>ssv</code>
        * @const
        */
        SSV: ' ',

        /**
        * Tab-separated values. Value: <code>tsv</code>
        * @const
        */
        TSV: '\t',

        /**
        * Pipe(|)-separated values. Value: <code>pipes</code>
        * @const
        */
        PIPES: '|',

        /**
        * Native array. Value: <code>multi</code>
        * @const
        */
        MULTI: 'multi'
      };
    }
  }], [{
    key: "parseDate",
    value: function parseDate(str) {
      return new Date(str);
    }
    /**
    * Converts a value to the specified type.
    * @param {(String|Object)} data The data to convert, as a string or object.
    * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
    * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
    * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
    * all properties on <code>data<code> will be converted to this type.
    * @returns An instance of the specified type or null or undefined if data is null or undefined.
    */

  }, {
    key: "convertToType",
    value: function convertToType(data, type) {
      if (data === null || data === undefined) return data;

      switch (type) {
        case 'Boolean':
          return Boolean(data);

        case 'Integer':
          return parseInt(data, 10);

        case 'Number':
          return parseFloat(data);

        case 'String':
          return String(data);

        case 'Date':
          return AutodeskForgeDesignAutomationClient.parseDate(String(data));

        case 'Blob':
          return data;

        default:
          if (type === Object) {
            // generic object, return directly
            return data;
          } else if (typeof type === 'function') {
            // for model type like: User
            return type.constructFromObject(data);
          } else if (Array.isArray(type)) {
            // for array type like: ['String']
            var itemType = type[0];
            return data.map(function (item) {
              return AutodeskForgeDesignAutomationClient.convertToType(item, itemType);
            });
          } else if (_typeof(type) === 'object') {
            // for plain object type like: {'String': 'Integer'}
            var keyType, valueType;

            for (var k in type) {
              if (type.hasOwnProperty(k)) {
                keyType = k;
                valueType = type[k];
                break;
              }
            }

            var result = {};

            for (var k in data) {
              if (data.hasOwnProperty(k)) {
                var key = AutodeskForgeDesignAutomationClient.convertToType(k, keyType);
                var value = AutodeskForgeDesignAutomationClient.convertToType(data[k], valueType);
                result[key] = value;
              }
            }

            return result;
          } else {
            // for unknown type, return the data directly
            return data;
          }

      }
    }
    /**
    * Constructs a new map or array model from REST data.
    * @param data {Object|Array} The REST data.
    * @param obj {Object|Array} The target object or array.
    */

  }, {
    key: "constructFromObject",
    value: function constructFromObject(data, obj, itemType) {
      if (Array.isArray(data)) {
        for (var i = 0; i < data.length; i++) {
          if (data.hasOwnProperty(i)) obj[i] = AutodeskForgeDesignAutomationClient.convertToType(data[i], itemType);
        }
      } else {
        for (var k in data) {
          if (data.hasOwnProperty(k)) obj[k] = AutodeskForgeDesignAutomationClient.convertToType(data[k], itemType);
        }
      }
    }
  }]);

  return AutodeskForgeDesignAutomationClient;
}();
var apiClientInstance = new AutodeskForgeDesignAutomationClient();
AutodeskForgeDesignAutomationClient.instance = apiClientInstance; // It's here to avoid duplicate Circuit breaker additions.

apiClientInstance.circuitBreaker = circuitBreaker.CircuitBreakerFactory.create(AutodeskForgeDesignAutomationClient.instance.circuitBreakerConfig);

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); return Constructor; }
/**
 * The ISetting model module.
 * @module model/ISetting
 * @version 3.0.3
 */

var ISetting =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>ISetting</code>.
   * Marker interface for bound argument types, we may add methods here if we find something useful.
   * @alias module:model/ISetting
   * @class
   */
  function ISetting() {
    _classCallCheck$2(this, ISetting);
  }
  /**
   * Constructs a <code>ISetting</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ISetting} obj Optional instance to populate.
   * @return {module:model/ISetting} The populated <code>ISetting</code> instance.
   */


  _createClass$2(ISetting, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ISetting();
      }

      return obj;
    }
  }]);

  return ISetting;
}();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); return Constructor; }
/**
* Enum class Verb.
* @enum {}
* @readonly
*/

var Verb =
/*#__PURE__*/
function () {
  function Verb() {
    _classCallCheck$3(this, Verb);
  }

  _createClass$3(Verb, null, [{
    key: "constructFromObject",

    /**
    * Returns a <code>Verb</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/Verb} The enum <code>Verb</code> value.
    */
    value: function constructFromObject(object) {
      return object;
    }
  }, {
    key: "get",

    /**
     * value: "get"
     * @static
     */
    get: function get() {
      return "get";
    }
    /**
     * value: "head"
     * @static
     */

  }, {
    key: "head",
    get: function get() {
      return "head";
    }
    /**
     * value: "put"
     * @static
     */

  }, {
    key: "put",
    get: function get() {
      return "put";
    }
    /**
     * value: "post"
     * @static
     */

  }, {
    key: "post",
    get: function get() {
      return "post";
    }
    /**
     * value: "patch"
     * @static
     */

  }, {
    key: "patch",
    get: function get() {
      return "patch";
    }
    /**
     * value: "read"
     * @static
     */

  }, {
    key: "read",
    get: function get() {
      return "read";
    }
  }]);

  return Verb;
}();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); return Constructor; }
/**
 * The Parameter model module.
 * @module model/Parameter
 * @version 3.0.3
 */

var Parameter =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>Parameter</code>.
   * 
   * @alias module:model/Parameter
   * @class
   * @param verb {module:model/Verb} Request method (get, put, patch or post).
   */
  function Parameter(verb) {
    _classCallCheck$4(this, Parameter);

    this.verb = verb;
  }
  /**
   * Constructs a <code>Parameter</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Parameter} obj Optional instance to populate.
   * @return {module:model/Parameter} The populated <code>Parameter</code> instance.
   */


  _createClass$4(Parameter, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Parameter();
        if (data.hasOwnProperty('zip')) obj.zip = AutodeskForgeDesignAutomationClient.convertToType(data['zip'], 'Boolean');
        if (data.hasOwnProperty('ondemand')) obj.ondemand = AutodeskForgeDesignAutomationClient.convertToType(data['ondemand'], 'Boolean');
        if (data.hasOwnProperty('verb')) obj.verb = Verb.constructFromObject(data['verb']);
        if (data.hasOwnProperty('description')) obj.description = AutodeskForgeDesignAutomationClient.convertToType(data['description'], 'String');
        if (data.hasOwnProperty('required')) obj.required = AutodeskForgeDesignAutomationClient.convertToType(data['required'], 'Boolean');
        if (data.hasOwnProperty('localName')) obj.localName = AutodeskForgeDesignAutomationClient.convertToType(data['localName'], 'String');
      }

      return obj;
    }
  }]);

  return Parameter;
}();
Parameter.prototype.zip = false;
/**
 * The parameter will be accessed by the appbundle on demand and should not be used by the system. Default is false.
 * @member {Boolean} ondemand
 * @default false
 */

Parameter.prototype.ondemand = false;
/**
 * Request method (get, put, patch or post).
 * @member {module:model/Verb} verb
 */

Parameter.prototype.verb = undefined;
/**
 * The description of the parameter.
 * @member {String} description
 */

Parameter.prototype.description = undefined;
/**
 * Specifies whether the corresponding WorkItem Argument is required. Default is false.
 * @member {Boolean} required
 * @default false
 */

Parameter.prototype.required = false;
/**
 * The file or folder where the contents of an UrlArgument are placed. Note that this may be different than the `localName` for input arguments when [Content-Disposition](http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1) header is specifified by the server. For `zip` = `true` this is a folder name.
 * @member {String} localName
 */

Parameter.prototype.localName = undefined;

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); return Constructor; }
/**
 * The Activity model module.
 * @module model/Activity
 * @version 3.0.3
 */

var Activity =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>Activity</code>.
   * Defines an Activity, a type of work, a function: input/outputs, instructions. An Activity is an action that can be executed within an engine. For example, for AutoCAD engine this might be plotting a DWG to PDF or update the CAD standards in a drawing file.
   * @alias module:model/Activity
   * @class
   * @param commandLine {Array.<String>} Path to Engine executable with arguments.
   * @param engine {String} The actual processing engine that runs the WorkItem job and processes the Activity.
   */
  function Activity(commandLine, engine) {
    _classCallCheck$5(this, Activity);

    this.commandLine = commandLine;
    this.engine = engine;
  }
  /**
   * Constructs a <code>Activity</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Activity} obj Optional instance to populate.
   * @return {module:model/Activity} The populated <code>Activity</code> instance.
   */


  _createClass$5(Activity, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Activity();
        if (data.hasOwnProperty('commandLine')) obj.commandLine = AutodeskForgeDesignAutomationClient.convertToType(data['commandLine'], ['String']);
        if (data.hasOwnProperty('parameters')) obj.parameters = AutodeskForgeDesignAutomationClient.convertToType(data['parameters'], {
          'String': Parameter
        });
        if (data.hasOwnProperty('id')) obj.id = AutodeskForgeDesignAutomationClient.convertToType(data['id'], 'String');
        if (data.hasOwnProperty('engine')) obj.engine = AutodeskForgeDesignAutomationClient.convertToType(data['engine'], 'String');
        if (data.hasOwnProperty('appbundles')) obj.appbundles = AutodeskForgeDesignAutomationClient.convertToType(data['appbundles'], ['String']);
        if (data.hasOwnProperty('settings')) obj.settings = AutodeskForgeDesignAutomationClient.convertToType(data['settings'], {
          'String': Object
        });
        if (data.hasOwnProperty('description')) obj.description = AutodeskForgeDesignAutomationClient.convertToType(data['description'], 'String');
        if (data.hasOwnProperty('version')) obj.version = AutodeskForgeDesignAutomationClient.convertToType(data['version'], 'Number');
      }

      return obj;
    }
  }]);

  return Activity;
}();
Activity.prototype.commandLine = undefined;
/**
 * Each parameter represents an input or output file.
 * @member {Object.<String, module:model/Parameter>} parameters
 */

Activity.prototype.parameters = undefined;
/**
 * Name of Activity, see the example section.
 * @member {String} id
 */

Activity.prototype.id = undefined;
/**
 * The actual processing engine that runs the WorkItem job and processes the Activity.
 * @member {String} engine
 */

Activity.prototype.engine = undefined;
/**
 * A module referenced by an Activity in order to perform specific functions. Typically this is a DLL or some other form of custom code.
 * @member {Array.<String>} appbundles
 */

Activity.prototype.appbundles = undefined;
/**
 * The url/string Settings for a given set of AppBundles.
 * @member {Object.<String, module:model/ISetting>} settings
 */

Activity.prototype.settings = undefined;
/**
 * Human readable description of the object.
 * @member {String} description
 */

Activity.prototype.description = undefined;
/**
 * @member {Number} version
 */

Activity.prototype.version = undefined;

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); return Constructor; }
/**
 * The Alias model module.
 * @module model/Alias
 * @version 3.0.3
 */

var Alias =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>Alias</code>.
   * 
   * @alias module:model/Alias
   * @class
   */
  function Alias() {
    _classCallCheck$6(this, Alias);
  }
  /**
   * Constructs a <code>Alias</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Alias} obj Optional instance to populate.
   * @return {module:model/Alias} The populated <code>Alias</code> instance.
   */


  _createClass$6(Alias, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Alias();
        if (data.hasOwnProperty('version')) obj.version = AutodeskForgeDesignAutomationClient.convertToType(data['version'], 'Number');
        if (data.hasOwnProperty('receiver')) obj.receiver = AutodeskForgeDesignAutomationClient.convertToType(data['receiver'], 'String');
        if (data.hasOwnProperty('id')) obj.id = AutodeskForgeDesignAutomationClient.convertToType(data['id'], 'String');
      }

      return obj;
    }
  }]);

  return Alias;
}();
Alias.prototype.version = undefined;
/**
 * The user to share the alias with.
 * @member {String} receiver
 */

Alias.prototype.receiver = undefined;
/**
 * @member {String} id
 */

Alias.prototype.id = undefined;

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); return Constructor; }
/**
 * The AliasPatch model module.
 * @module model/AliasPatch
 * @version 3.0.3
 */

var AliasPatch =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>AliasPatch</code>.
   * @alias module:model/AliasPatch
   * @class
   */
  function AliasPatch() {
    _classCallCheck$7(this, AliasPatch);
  }
  /**
   * Constructs a <code>AliasPatch</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AliasPatch} obj Optional instance to populate.
   * @return {module:model/AliasPatch} The populated <code>AliasPatch</code> instance.
   */


  _createClass$7(AliasPatch, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AliasPatch();
        if (data.hasOwnProperty('receiver')) obj.receiver = AutodeskForgeDesignAutomationClient.convertToType(data['receiver'], 'String');
        if (data.hasOwnProperty('version')) obj.version = AutodeskForgeDesignAutomationClient.convertToType(data['version'], 'Number');
      }

      return obj;
    }
  }]);

  return AliasPatch;
}();
AliasPatch.prototype.receiver = undefined;
/**
 * The version that this alias refers to.
 * @member {Number} version
 */

AliasPatch.prototype.version = undefined;

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); return Constructor; }
/**
 * The UploadAppBundleParameters model module.
 * @module model/UploadAppBundleParameters
 * @version 3.0.3
 */

var UploadAppBundleParameters =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>UploadAppBundleParameters</code>.
   * 
   * @alias module:model/UploadAppBundleParameters
   * @class
   * @param endpointURL {String} The URL to upload the AppBundle package to.
   * @param formData {Object.<String, String>} FormData parameters to be used in the body of the AppBundle package upload request. Must be followed by a 'file' parameter indicating the package file location.
   */
  function UploadAppBundleParameters(endpointURL, formData) {
    _classCallCheck$8(this, UploadAppBundleParameters);

    this.endpointURL = endpointURL;
    this.formData = formData;
  }
  /**
   * Constructs a <code>UploadAppBundleParameters</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UploadAppBundleParameters} obj Optional instance to populate.
   * @return {module:model/UploadAppBundleParameters} The populated <code>UploadAppBundleParameters</code> instance.
   */


  _createClass$8(UploadAppBundleParameters, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UploadAppBundleParameters();
        if (data.hasOwnProperty('endpointURL')) obj.endpointURL = AutodeskForgeDesignAutomationClient.convertToType(data['endpointURL'], 'String');
        if (data.hasOwnProperty('formData')) obj.formData = AutodeskForgeDesignAutomationClient.convertToType(data['formData'], {
          'String': 'String'
        });
      }

      return obj;
    }
  }]);

  return UploadAppBundleParameters;
}();
UploadAppBundleParameters.prototype.endpointURL = undefined;
/**
 * FormData parameters to be used in the body of the AppBundle package upload request. Must be followed by a 'file' parameter indicating the package file location.
 * @member {Object.<String, String>} formData
 */

UploadAppBundleParameters.prototype.formData = undefined;

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$9(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$9(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$9(Constructor.prototype, protoProps); if (staticProps) _defineProperties$9(Constructor, staticProps); return Constructor; }
/**
 * The AppBundle model module.
 * @module model/AppBundle
 * @version 3.0.3
 */

var AppBundle =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>AppBundle</code>.
   * An AppBundle is a module that is used by an Activity in order to perform a particular action.
   * @alias module:model/AppBundle
   * @class
   * @param engine {String} The actual processing engine that runs the WorkItem job and processes the Activity.
   */
  function AppBundle(engine) {
    _classCallCheck$9(this, AppBundle);

    this.engine = engine;
  }
  /**
   * Constructs a <code>AppBundle</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AppBundle} obj Optional instance to populate.
   * @return {module:model/AppBundle} The populated <code>AppBundle</code> instance.
   */


  _createClass$9(AppBundle, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new AppBundle();
        if (data.hasOwnProperty('package')) obj["package"] = AutodeskForgeDesignAutomationClient.convertToType(data['package'], 'String');
        if (data.hasOwnProperty('uploadParameters')) obj.uploadParameters = UploadAppBundleParameters.constructFromObject(data['uploadParameters']);
        if (data.hasOwnProperty('id')) obj.id = AutodeskForgeDesignAutomationClient.convertToType(data['id'], 'String');
        if (data.hasOwnProperty('engine')) obj.engine = AutodeskForgeDesignAutomationClient.convertToType(data['engine'], 'String');
        if (data.hasOwnProperty('appbundles')) obj.appbundles = AutodeskForgeDesignAutomationClient.convertToType(data['appbundles'], ['String']);
        if (data.hasOwnProperty('settings')) obj.settings = AutodeskForgeDesignAutomationClient.convertToType(data['settings'], {
          'String': Object
        });
        if (data.hasOwnProperty('description')) obj.description = AutodeskForgeDesignAutomationClient.convertToType(data['description'], 'String');
        if (data.hasOwnProperty('version')) obj.version = AutodeskForgeDesignAutomationClient.convertToType(data['version'], 'Number');
      }

      return obj;
    }
  }]);

  return AppBundle;
}();
AppBundle.prototype["package"] = undefined;
/**
 * The parameters needed to POST an AppBundle.
 * @member {module:model/UploadAppBundleParameters} uploadParameters
 */

AppBundle.prototype.uploadParameters = undefined;
/**
 * Name of AppBundle, see the example section.
 * @member {String} id
 */

AppBundle.prototype.id = undefined;
/**
 * The actual processing engine that runs the WorkItem job and processes the Activity.
 * @member {String} engine
 */

AppBundle.prototype.engine = undefined;
/**
 * A module referenced by an Activity in order to perform specific functions. Typically this is a DLL or some other form of custom code.
 * @member {Array.<String>} appbundles
 */

AppBundle.prototype.appbundles = undefined;
/**
 * The url/string Settings for a given set of AppBundles.
 * @member {Object.<String, module:model/ISetting>} settings
 */

AppBundle.prototype.settings = undefined;
/**
 * Human readable description of the object.
 * @member {String} description
 */

AppBundle.prototype.description = undefined;
/**
 * @member {Number} version
 */

AppBundle.prototype.version = undefined;

function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$a(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$a(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$a(Constructor.prototype, protoProps); if (staticProps) _defineProperties$a(Constructor, staticProps); return Constructor; }
/**
 * The BackendLimits model module.
 * @module model/BackendLimits
 * @version 3.0.3
 */

var BackendLimits =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>BackendLimits</code>.
   * Helper class used in the following property.
   * @alias module:model/BackendLimits
   * @class
   */
  function BackendLimits() {
    _classCallCheck$a(this, BackendLimits);
  }
  /**
   * Constructs a <code>BackendLimits</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/BackendLimits} obj Optional instance to populate.
   * @return {module:model/BackendLimits} The populated <code>BackendLimits</code> instance.
   */


  _createClass$a(BackendLimits, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new BackendLimits();
        if (data.hasOwnProperty('limitDownloads')) obj.limitDownloads = AutodeskForgeDesignAutomationClient.convertToType(data['limitDownloads'], 'Number');
        if (data.hasOwnProperty('limitUploads')) obj.limitUploads = AutodeskForgeDesignAutomationClient.convertToType(data['limitUploads'], 'Number');
        if (data.hasOwnProperty('limitDownloadSizeMB')) obj.limitDownloadSizeMB = AutodeskForgeDesignAutomationClient.convertToType(data['limitDownloadSizeMB'], 'Number');
        if (data.hasOwnProperty('limitUploadSizeMB')) obj.limitUploadSizeMB = AutodeskForgeDesignAutomationClient.convertToType(data['limitUploadSizeMB'], 'Number');
        if (data.hasOwnProperty('limitProcessingTimeSec')) obj.limitProcessingTimeSec = AutodeskForgeDesignAutomationClient.convertToType(data['limitProcessingTimeSec'], 'Number');
        if (data.hasOwnProperty('limitTotalUncompressedAppsSizeInMB')) obj.limitTotalUncompressedAppsSizeInMB = AutodeskForgeDesignAutomationClient.convertToType(data['limitTotalUncompressedAppsSizeInMB'], 'Number');
      }

      return obj;
    }
  }]);

  return BackendLimits;
}();
BackendLimits.prototype.limitDownloads = undefined;
/**
 * Max number of uploads per workitem.
 * @member {Number} limitUploads
 */

BackendLimits.prototype.limitUploads = undefined;
/**
 * Max total size of all downloads in MB per workitem.
 * @member {Number} limitDownloadSizeMB
 */

BackendLimits.prototype.limitDownloadSizeMB = undefined;
/**
 * Max total size of all uploads in MB per workitem.
 * @member {Number} limitUploadSizeMB
 */

BackendLimits.prototype.limitUploadSizeMB = undefined;
/**
 * Max duration of processing in seconds per workitem (includes download and upload time).
 * @member {Number} limitProcessingTimeSec
 */

BackendLimits.prototype.limitProcessingTimeSec = undefined;
/**
 * Max permitted size of all Apps referenced by an activity. It is enforced when you post a workitem. Default is 500.
 * @member {Number} limitTotalUncompressedAppsSizeInMB
 */

BackendLimits.prototype.limitTotalUncompressedAppsSizeInMB = undefined;

function _classCallCheck$b(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$b(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$b(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$b(Constructor.prototype, protoProps); if (staticProps) _defineProperties$b(Constructor, staticProps); return Constructor; }
/**
* Enum class Engine.
* @enum {}
* @readonly
*/

var Engine =
/*#__PURE__*/
function () {
  function Engine() {
    _classCallCheck$b(this, Engine);
  }

  _createClass$b(Engine, null, [{
    key: "constructFromObject",

    /**
    * Returns a <code>Engine</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/Engine} The enum <code>Engine</code> value.
    */
    value: function constructFromObject(object) {
      return object;
    }
  }, {
    key: "api",

    /**
     * value: "api"
     * @static
     */
    get: function get() {
      return "api";
    }
    /**
     * value: "AutoCAD"
     * @static
     */

  }, {
    key: "AutoCAD",
    get: function get() {
      return "AutoCAD";
    }
    /**
     * value: "Revit"
     * @static
     */

  }, {
    key: "Revit",
    get: function get() {
      return "Revit";
    }
    /**
     * value: "Inventor"
     * @static
     */

  }, {
    key: "Inventor",
    get: function get() {
      return "Inventor";
    }
    /**
     * value: "3dsMax"
     * @static
     */

  }, {
    key: "3dsMax",
    get: function get() {
      return "3dsMax";
    }
    /**
     * value: "Test"
     * @static
     */

  }, {
    key: "Test",
    get: function get() {
      return "Test";
    }
  }]);

  return Engine;
}();

function _classCallCheck$c(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$c(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$c(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$c(Constructor.prototype, protoProps); if (staticProps) _defineProperties$c(Constructor, staticProps); return Constructor; }
/**
 * The FrontendLimits model module.
 * @module model/FrontendLimits
 * @version 3.0.3
 */

var FrontendLimits =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>FrontendLimits</code>.
   * Limits enforced by the frontend.
   * @alias module:model/FrontendLimits
   * @class
   */
  function FrontendLimits() {
    _classCallCheck$c(this, FrontendLimits);
  }
  /**
   * Constructs a <code>FrontendLimits</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/FrontendLimits} obj Optional instance to populate.
   * @return {module:model/FrontendLimits} The populated <code>FrontendLimits</code> instance.
   */


  _createClass$c(FrontendLimits, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new FrontendLimits();
        if (data.hasOwnProperty('limitPayloadSizeInKB')) obj.limitPayloadSizeInKB = AutodeskForgeDesignAutomationClient.convertToType(data['limitPayloadSizeInKB'], 'Number');
        if (data.hasOwnProperty('limitVersions')) obj.limitVersions = AutodeskForgeDesignAutomationClient.convertToType(data['limitVersions'], 'Number');
        if (data.hasOwnProperty('limitAliases')) obj.limitAliases = AutodeskForgeDesignAutomationClient.convertToType(data['limitAliases'], 'Number');
        if (data.hasOwnProperty('limitPublicAliases')) obj.limitPublicAliases = AutodeskForgeDesignAutomationClient.convertToType(data['limitPublicAliases'], 'Number');
        if (data.hasOwnProperty('limitAppUploadSizeInMB')) obj.limitAppUploadSizeInMB = AutodeskForgeDesignAutomationClient.convertToType(data['limitAppUploadSizeInMB'], 'Number');
        if (data.hasOwnProperty('limitMonthlyProcessingTimeInHours')) obj.limitMonthlyProcessingTimeInHours = AutodeskForgeDesignAutomationClient.convertToType(data['limitMonthlyProcessingTimeInHours'], 'Number');
      }

      return obj;
    }
  }]);

  return FrontendLimits;
}();
FrontendLimits.prototype.limitPayloadSizeInKB = undefined;
/**
 * Max permitted number of App/Activity versions a client can have at any one time. Default is 100.
 * @member {Number} limitVersions
 */

FrontendLimits.prototype.limitVersions = undefined;
/**
 * Max permitted number of aliases that a client can have at any one time. Default is 100.
 * @member {Number} limitAliases
 */

FrontendLimits.prototype.limitAliases = undefined;
/**
 * Max permitted number of public aliases that a client can have at any one time. Default is 0.
 * @member {Number} limitPublicAliases
 */

FrontendLimits.prototype.limitPublicAliases = undefined;
/**
 * Max permitted size of an App upload in megabytes.
 * @member {Number} limitAppUploadSizeInMB
 */

FrontendLimits.prototype.limitAppUploadSizeInMB = undefined;
/**
 * Max commulative engine usage by client in a given calendar month. This limit applies to all engines. For example, if the limit is set to 1 hour then 30 minutes of Revit usage and 30 minutes of Inventor usage will reach limit.
 * @member {Number} limitMonthlyProcessingTimeInHours
 */

FrontendLimits.prototype.limitMonthlyProcessingTimeInHours = undefined;

function _classCallCheck$d(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$d(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$d(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$d(Constructor.prototype, protoProps); if (staticProps) _defineProperties$d(Constructor, staticProps); return Constructor; }
/**
 * The IArgument model module.
 * @module model/IArgument
 * @version 3.0.3
 */

var IArgument =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>IArgument</code>.
   * This interface must be implemented by all workitem arguments.
   * @alias module:model/IArgument
   * @class
   */
  function IArgument() {
    _classCallCheck$d(this, IArgument);
  }
  /**
   * Constructs a <code>IArgument</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/IArgument} obj Optional instance to populate.
   * @return {module:model/IArgument} The populated <code>IArgument</code> instance.
   */


  _createClass$d(IArgument, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new IArgument();
      }

      return obj;
    }
  }]);

  return IArgument;
}();

function _classCallCheck$e(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$e(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$e(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$e(Constructor.prototype, protoProps); if (staticProps) _defineProperties$e(Constructor, staticProps); return Constructor; }
/**
 * The PublicKey model module.
 * @module model/PublicKey
 * @version 3.0.3
 */

var PublicKey =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>PublicKey</code>.
   * @alias module:model/PublicKey
   * @class
   * @param exponent {Blob} 
   * @param modulus {Blob} 
   */
  function PublicKey(exponent, modulus) {
    _classCallCheck$e(this, PublicKey);

    this.exponent = exponent;
    this.modulus = modulus;
  }
  /**
   * Constructs a <code>PublicKey</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PublicKey} obj Optional instance to populate.
   * @return {module:model/PublicKey} The populated <code>PublicKey</code> instance.
   */


  _createClass$e(PublicKey, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PublicKey();
        if (data.hasOwnProperty('Exponent')) obj.exponent = AutodeskForgeDesignAutomationClient.convertToType(data['Exponent'], 'Blob');
        if (data.hasOwnProperty('Modulus')) obj.modulus = AutodeskForgeDesignAutomationClient.convertToType(data['Modulus'], 'Blob');
      }

      return obj;
    }
  }]);

  return PublicKey;
}();
PublicKey.prototype.exponent = undefined;
/**
 * @member {Blob} modulus
 */

PublicKey.prototype.modulus = undefined;

function _classCallCheck$f(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$f(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$f(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$f(Constructor.prototype, protoProps); if (staticProps) _defineProperties$f(Constructor, staticProps); return Constructor; }
/**
 * The NicknameRecord model module.
 * @module model/NicknameRecord
 * @version 3.0.3
 */

var NicknameRecord =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>NicknameRecord</code>.
   * ( response only ).
   * @alias module:model/NicknameRecord
   * @class
   */
  function NicknameRecord() {
    _classCallCheck$f(this, NicknameRecord);
  }
  /**
   * Constructs a <code>NicknameRecord</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/NicknameRecord} obj Optional instance to populate.
   * @return {module:model/NicknameRecord} The populated <code>NicknameRecord</code> instance.
   */


  _createClass$f(NicknameRecord, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new NicknameRecord();
        if (data.hasOwnProperty('nickname')) obj.nickname = AutodeskForgeDesignAutomationClient.convertToType(data['nickname'], 'String');
        if (data.hasOwnProperty('publicKey')) obj.publicKey = PublicKey.constructFromObject(data['publicKey']);
      }

      return obj;
    }
  }]);

  return NicknameRecord;
}();
NicknameRecord.prototype.nickname = undefined;
/**
 * @member {module:model/PublicKey} publicKey
 */

NicknameRecord.prototype.publicKey = undefined;

function _classCallCheck$g(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$g(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$g(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$g(Constructor.prototype, protoProps); if (staticProps) _defineProperties$g(Constructor, staticProps); return Constructor; }
/**
 * The PageAlias model module.
 * @module model/PageAlias
 * @version 3.0.3
 */

var PageAlias =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>PageAlias</code>.
   * @alias module:model/PageAlias
   * @class
   */
  function PageAlias() {
    _classCallCheck$g(this, PageAlias);
  }
  /**
   * Constructs a <code>PageAlias</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PageAlias} obj Optional instance to populate.
   * @return {module:model/PageAlias} The populated <code>PageAlias</code> instance.
   */


  _createClass$g(PageAlias, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PageAlias();
        if (data.hasOwnProperty('paginationToken')) obj.paginationToken = AutodeskForgeDesignAutomationClient.convertToType(data['paginationToken'], 'String');
        if (data.hasOwnProperty('data')) obj.data = AutodeskForgeDesignAutomationClient.convertToType(data['data'], [Alias]);
      }

      return obj;
    }
  }]);

  return PageAlias;
}();
PageAlias.prototype.paginationToken = undefined;
/**
 * @member {Array.<module:model/Alias>} data
 */

PageAlias.prototype.data = undefined;

function _classCallCheck$h(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$h(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$h(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$h(Constructor.prototype, protoProps); if (staticProps) _defineProperties$h(Constructor, staticProps); return Constructor; }
/**
 * The PageInt32 model module.
 * @module model/PageInt32
 * @version 3.0.3
 */

var PageInt32 =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>PageInt32</code>.
   * @alias module:model/PageInt32
   * @class
   */
  function PageInt32() {
    _classCallCheck$h(this, PageInt32);
  }
  /**
   * Constructs a <code>PageInt32</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PageInt32} obj Optional instance to populate.
   * @return {module:model/PageInt32} The populated <code>PageInt32</code> instance.
   */


  _createClass$h(PageInt32, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PageInt32();
        if (data.hasOwnProperty('paginationToken')) obj.paginationToken = AutodeskForgeDesignAutomationClient.convertToType(data['paginationToken'], 'String');
        if (data.hasOwnProperty('data')) obj.data = AutodeskForgeDesignAutomationClient.convertToType(data['data'], ['Number']);
      }

      return obj;
    }
  }]);

  return PageInt32;
}();
PageInt32.prototype.paginationToken = undefined;
/**
 * @member {Array.<Number>} data
 */

PageInt32.prototype.data = undefined;

function _classCallCheck$i(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$i(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$i(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$i(Constructor.prototype, protoProps); if (staticProps) _defineProperties$i(Constructor, staticProps); return Constructor; }
/**
* Enum class ShareType.
* @enum {}
* @readonly
*/

var ShareType =
/*#__PURE__*/
function () {
  function ShareType() {
    _classCallCheck$i(this, ShareType);
  }

  _createClass$i(ShareType, null, [{
    key: "constructFromObject",

    /**
    * Returns a <code>ShareType</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/ShareType} The enum <code>ShareType</code> value.
    */
    value: function constructFromObject(object) {
      return object;
    }
  }, {
    key: "activity",

    /**
     * value: "activity"
     * @static
     */
    get: function get() {
      return "activity";
    }
    /**
     * value: "app"
     * @static
     */

  }, {
    key: "app",
    get: function get() {
      return "app";
    }
  }]);

  return ShareType;
}();

function _classCallCheck$j(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$j(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$j(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$j(Constructor.prototype, protoProps); if (staticProps) _defineProperties$j(Constructor, staticProps); return Constructor; }
/**
 * The Share model module.
 * @module model/Share
 * @version 3.0.3
 */

var Share =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>Share</code>.
   * ( response only ).
   * @alias module:model/Share
   * @class
   * @param id {String} The name alias id with the owner stripped ex: CoolApp+Prod.
   * @param receiver {String} The Receiver of the shared alias.
   * @param type {module:model/ShareType} The type of the share (\"Activity\", \"App\",).
   */
  function Share(id, receiver, type) {
    _classCallCheck$j(this, Share);

    this.id = id;
    this.receiver = receiver;
    this.type = type;
  }
  /**
   * Constructs a <code>Share</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Share} obj Optional instance to populate.
   * @return {module:model/Share} The populated <code>Share</code> instance.
   */


  _createClass$j(Share, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Share();
        if (data.hasOwnProperty('id')) obj.id = AutodeskForgeDesignAutomationClient.convertToType(data['id'], 'String');
        if (data.hasOwnProperty('receiver')) obj.receiver = AutodeskForgeDesignAutomationClient.convertToType(data['receiver'], 'String');
        if (data.hasOwnProperty('type')) obj.type = ShareType.constructFromObject(data['type']);
      }

      return obj;
    }
  }]);

  return Share;
}();
Share.prototype.id = undefined;
/**
 * The Receiver of the shared alias.
 * @member {String} receiver
 */

Share.prototype.receiver = undefined;
/**
 * The type of the share (\"Activity\", \"App\",).
 * @member {module:model/ShareType} type
 */

Share.prototype.type = undefined;

function _classCallCheck$k(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$k(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$k(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$k(Constructor.prototype, protoProps); if (staticProps) _defineProperties$k(Constructor, staticProps); return Constructor; }
/**
 * The PageShare model module.
 * @module model/PageShare
 * @version 3.0.3
 */

var PageShare =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>PageShare</code>.
   * @alias module:model/PageShare
   * @class
   */
  function PageShare() {
    _classCallCheck$k(this, PageShare);
  }
  /**
   * Constructs a <code>PageShare</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PageShare} obj Optional instance to populate.
   * @return {module:model/PageShare} The populated <code>PageShare</code> instance.
   */


  _createClass$k(PageShare, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PageShare();
        if (data.hasOwnProperty('paginationToken')) obj.paginationToken = AutodeskForgeDesignAutomationClient.convertToType(data['paginationToken'], 'String');
        if (data.hasOwnProperty('data')) obj.data = AutodeskForgeDesignAutomationClient.convertToType(data['data'], [Share]);
      }

      return obj;
    }
  }]);

  return PageShare;
}();
PageShare.prototype.paginationToken = undefined;
/**
 * @member {Array.<module:model/Share>} data
 */

PageShare.prototype.data = undefined;

function _classCallCheck$l(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$l(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$l(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$l(Constructor.prototype, protoProps); if (staticProps) _defineProperties$l(Constructor, staticProps); return Constructor; }
/**
 * The PageString model module.
 * @module model/PageString
 * @version 3.0.3
 */

var PageString =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>PageString</code>.
   * @alias module:model/PageString
   * @class
   */
  function PageString() {
    _classCallCheck$l(this, PageString);
  }
  /**
   * Constructs a <code>PageString</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/PageString} obj Optional instance to populate.
   * @return {module:model/PageString} The populated <code>PageString</code> instance.
   */


  _createClass$l(PageString, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new PageString();
        if (data.hasOwnProperty('paginationToken')) obj.paginationToken = AutodeskForgeDesignAutomationClient.convertToType(data['paginationToken'], 'String');
        if (data.hasOwnProperty('data')) obj.data = AutodeskForgeDesignAutomationClient.convertToType(data['data'], ['String']);
      }

      return obj;
    }
  }]);

  return PageString;
}();
PageString.prototype.paginationToken = undefined;
/**
 * @member {Array.<String>} data
 */

PageString.prototype.data = undefined;

function _classCallCheck$m(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$m(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$m(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$m(Constructor.prototype, protoProps); if (staticProps) _defineProperties$m(Constructor, staticProps); return Constructor; }
/**
 * The ServiceLimit model module.
 * @module model/ServiceLimit
 * @version 3.0.3
 */

var ServiceLimit =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>ServiceLimit</code>.
   * Represents the service limits for a user.
   * @alias module:model/ServiceLimit
   * @class
   */
  function ServiceLimit() {
    _classCallCheck$m(this, ServiceLimit);
  }
  /**
   * Constructs a <code>ServiceLimit</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ServiceLimit} obj Optional instance to populate.
   * @return {module:model/ServiceLimit} The populated <code>ServiceLimit</code> instance.
   */


  _createClass$m(ServiceLimit, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new ServiceLimit();
        if (data.hasOwnProperty('frontendLimits')) obj.frontendLimits = FrontendLimits.constructFromObject(data['frontendLimits']);
        if (data.hasOwnProperty('backendLimits')) obj.backendLimits = AutodeskForgeDesignAutomationClient.convertToType(data['backendLimits'], {
          'String': BackendLimits
        });
      }

      return obj;
    }
  }]);

  return ServiceLimit;
}();
ServiceLimit.prototype.frontendLimits = undefined;
/**
 * @member {Object.<String, module:model/BackendLimits>} backendLimits
 */

ServiceLimit.prototype.backendLimits = undefined;

function _classCallCheck$n(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$n(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$n(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$n(Constructor.prototype, protoProps); if (staticProps) _defineProperties$n(Constructor, staticProps); return Constructor; }
/**
 * The SignedUrl model module.
 * @module model/SignedUrl
 * @version 3.0.3
 */

var SignedUrl =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>SignedUrl</code>.
   * A digitally signed url.
   * @alias module:model/SignedUrl
   * @class
   * @param url {String} The Url value.
   * @param signature {String} The signature calculated for Url.
   */
  function SignedUrl(url, signature) {
    _classCallCheck$n(this, SignedUrl);

    this.url = url;
    this.signature = signature;
  }
  /**
   * Constructs a <code>SignedUrl</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/SignedUrl} obj Optional instance to populate.
   * @return {module:model/SignedUrl} The populated <code>SignedUrl</code> instance.
   */


  _createClass$n(SignedUrl, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new SignedUrl();
        if (data.hasOwnProperty('url')) obj.url = AutodeskForgeDesignAutomationClient.convertToType(data['url'], 'String');
        if (data.hasOwnProperty('signature')) obj.signature = AutodeskForgeDesignAutomationClient.convertToType(data['signature'], 'String');
      }

      return obj;
    }
  }]);

  return SignedUrl;
}();
SignedUrl.prototype.url = undefined;
/**
 * The signature calculated for Url.
 * @member {String} signature
 */

SignedUrl.prototype.signature = undefined;

function _classCallCheck$o(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$o(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$o(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$o(Constructor.prototype, protoProps); if (staticProps) _defineProperties$o(Constructor, staticProps); return Constructor; }
/**
 * The Statistics model module.
 * @module model/Statistics
 * @version 3.0.3
 */

var Statistics =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>Statistics</code>.
   * @alias module:model/Statistics
   * @class
   */
  function Statistics() {
    _classCallCheck$o(this, Statistics);
  }
  /**
   * Constructs a <code>Statistics</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Statistics} obj Optional instance to populate.
   * @return {module:model/Statistics} The populated <code>Statistics</code> instance.
   */


  _createClass$o(Statistics, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new Statistics();
        if (data.hasOwnProperty('timeQueued')) obj.timeQueued = AutodeskForgeDesignAutomationClient.convertToType(data['timeQueued'], 'Date');
        if (data.hasOwnProperty('timeDownloadStarted')) obj.timeDownloadStarted = AutodeskForgeDesignAutomationClient.convertToType(data['timeDownloadStarted'], 'Date');
        if (data.hasOwnProperty('timeInstructionsStarted')) obj.timeInstructionsStarted = AutodeskForgeDesignAutomationClient.convertToType(data['timeInstructionsStarted'], 'Date');
        if (data.hasOwnProperty('timeInstructionsEnded')) obj.timeInstructionsEnded = AutodeskForgeDesignAutomationClient.convertToType(data['timeInstructionsEnded'], 'Date');
        if (data.hasOwnProperty('timeUploadEnded')) obj.timeUploadEnded = AutodeskForgeDesignAutomationClient.convertToType(data['timeUploadEnded'], 'Date');
        if (data.hasOwnProperty('timeFinished')) obj.timeFinished = AutodeskForgeDesignAutomationClient.convertToType(data['timeFinished'], 'Date');
        if (data.hasOwnProperty('bytesDownloaded')) obj.bytesDownloaded = AutodeskForgeDesignAutomationClient.convertToType(data['bytesDownloaded'], 'Number');
        if (data.hasOwnProperty('bytesUploaded')) obj.bytesUploaded = AutodeskForgeDesignAutomationClient.convertToType(data['bytesUploaded'], 'Number');
      }

      return obj;
    }
  }]);

  return Statistics;
}();
Statistics.prototype.timeQueued = undefined;
/**
 * The time in UTC when the system started processing the workitem by transferring input data to the processing node.
 * @member {Date} timeDownloadStarted
 */

Statistics.prototype.timeDownloadStarted = undefined;
/**
 * The time in UTC when the system finished downloading input and started processing instructions from the Activity associated with this workitem.
 * @member {Date} timeInstructionsStarted
 */

Statistics.prototype.timeInstructionsStarted = undefined;
/**
 * The time in UTC when the system finished executing instructions and started uploading outputs.
 * @member {Date} timeInstructionsEnded
 */

Statistics.prototype.timeInstructionsEnded = undefined;
/**
 * The time in UTC when the system finished uploading outputs.
 * @member {Date} timeUploadEnded
 */

Statistics.prototype.timeUploadEnded = undefined;
/**
 * The time in UTC when the system finished the workitem and reported the status.
 * @member {Date} timeFinished
 */

Statistics.prototype.timeFinished = undefined;
/**
 * The file size of bytes the job downloads for input.
 * @member {Number} bytesDownloaded
 */

Statistics.prototype.bytesDownloaded = undefined;
/**
 * The file size of bytes the job uploads for output.
 * @member {Number} bytesUploaded
 */

Statistics.prototype.bytesUploaded = undefined;

function _classCallCheck$p(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$p(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$p(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$p(Constructor.prototype, protoProps); if (staticProps) _defineProperties$p(Constructor, staticProps); return Constructor; }
/**
* Enum class Status.
* @enum {}
* @readonly
*/

var Status =
/*#__PURE__*/
function () {
  function Status() {
    _classCallCheck$p(this, Status);
  }

  _createClass$p(Status, null, [{
    key: "constructFromObject",

    /**
    * Returns a <code>Status</code> enum value from a Javascript object name.
    * @param {Object} data The plain JavaScript object containing the name of the enum value.
    * @return {module:model/Status} The enum <code>Status</code> value.
    */
    value: function constructFromObject(object) {
      return object;
    }
  }, {
    key: "pending",

    /**
     * value: "pending"
     * @static
     */
    get: function get() {
      return "pending";
    }
    /**
     * value: "inprogress"
     * @static
     */

  }, {
    key: "inprogress",
    get: function get() {
      return "inprogress";
    }
    /**
     * value: "cancelled"
     * @static
     */

  }, {
    key: "cancelled",
    get: function get() {
      return "cancelled";
    }
    /**
     * value: "failedLimitDataSize"
     * @static
     */

  }, {
    key: "failedLimitDataSize",
    get: function get() {
      return "failedLimitDataSize";
    }
    /**
     * value: "failedLimitProcessingTime"
     * @static
     */

  }, {
    key: "failedLimitProcessingTime",
    get: function get() {
      return "failedLimitProcessingTime";
    }
    /**
     * value: "failedDownload"
     * @static
     */

  }, {
    key: "failedDownload",
    get: function get() {
      return "failedDownload";
    }
    /**
     * value: "failedInstructions"
     * @static
     */

  }, {
    key: "failedInstructions",
    get: function get() {
      return "failedInstructions";
    }
    /**
     * value: "failedUpload"
     * @static
     */

  }, {
    key: "failedUpload",
    get: function get() {
      return "failedUpload";
    }
    /**
     * value: "success"
     * @static
     */

  }, {
    key: "success",
    get: function get() {
      return "success";
    }
  }]);

  return Status;
}();

function _classCallCheck$q(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$q(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$q(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$q(Constructor.prototype, protoProps); if (staticProps) _defineProperties$q(Constructor, staticProps); return Constructor; }
/**
 * The WorkItemSignatures model module.
 * @module model/WorkItemSignatures
 * @version 3.0.3
 */

var WorkItemSignatures =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>WorkItemSignatures</code>.
   * Signatures for various attributes in WorkItem.
   * @alias module:model/WorkItemSignatures
   * @class
   */
  function WorkItemSignatures() {
    _classCallCheck$q(this, WorkItemSignatures);
  }
  /**
   * Constructs a <code>WorkItemSignatures</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemSignatures} obj Optional instance to populate.
   * @return {module:model/WorkItemSignatures} The populated <code>WorkItemSignatures</code> instance.
   */


  _createClass$q(WorkItemSignatures, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new WorkItemSignatures();
        if (data.hasOwnProperty('activityId')) obj.activityId = AutodeskForgeDesignAutomationClient.convertToType(data['activityId'], 'String');
        if (data.hasOwnProperty('baseUrls')) obj.baseUrls = AutodeskForgeDesignAutomationClient.convertToType(data['baseUrls'], [SignedUrl]);
      }

      return obj;
    }
  }]);

  return WorkItemSignatures;
}();
WorkItemSignatures.prototype.activityId = undefined;
/**
 * Digitally signed base urls that are allowed in the WorkItem. The client may supply these when using a 2-legged oauth token for submitting a WorkItem.
 * @member {Array.<module:model/SignedUrl>} baseUrls
 */

WorkItemSignatures.prototype.baseUrls = undefined;

function _classCallCheck$r(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$r(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$r(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$r(Constructor.prototype, protoProps); if (staticProps) _defineProperties$r(Constructor, staticProps); return Constructor; }
/**
 * The WorkItem model module.
 * @module model/WorkItem
 * @version 3.0.3
 */

var WorkItem =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>WorkItem</code>.
   * A WorkItem is a specification of the processing job for an Activity, and it is submitted to and executed by an Engine. Note that a WorkItem cannot be modified after it has been created. ( request only ).
   * @alias module:model/WorkItem
   * @class
   * @param activityId {String} Reference to the Activity that this WorkItem will invoke.  Examples: `MyPlot+Prod` (an Activity created by the caller) or  `Autodesk.PlotToPdf` (an Activity created by someone else and shared with this caller).
   */
  function WorkItem(activityId) {
    _classCallCheck$r(this, WorkItem);

    this.activityId = activityId;
  }
  /**
   * Constructs a <code>WorkItem</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItem} obj Optional instance to populate.
   * @return {module:model/WorkItem} The populated <code>WorkItem</code> instance.
   */


  _createClass$r(WorkItem, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new WorkItem();
        if (data.hasOwnProperty('id')) obj.id = AutodeskForgeDesignAutomationClient.convertToType(data['id'], 'String');
        if (data.hasOwnProperty('activityId')) obj.activityId = AutodeskForgeDesignAutomationClient.convertToType(data['activityId'], 'String');
        if (data.hasOwnProperty('arguments')) obj.arguments = AutodeskForgeDesignAutomationClient.convertToType(data['arguments'], {
          'String': Object
        });
        if (data.hasOwnProperty('signatures')) obj.signatures = WorkItemSignatures.constructFromObject(data['signatures']);
        if (data.hasOwnProperty('limitProcessingTimeSec')) obj.limitProcessingTimeSec = AutodeskForgeDesignAutomationClient.convertToType(data['limitProcessingTimeSec'], 'Number');
      }

      return obj;
    }
  }]);

  return WorkItem;
}();
WorkItem.prototype.id = undefined;
/**
 * Reference to the Activity that this WorkItem will invoke.  Examples: `MyPlot+Prod` (an Activity created by the caller) or  `Autodesk.PlotToPdf` (an Activity created by someone else and shared with this caller).
 * @member {String} activityId
 */

WorkItem.prototype.activityId = undefined;
/**
 * Arguments of the WorkItem.
 * @member {Object.<String, module:model/IArgument>} arguments
 */

WorkItem.prototype.arguments = undefined;
/**
 * Signatures for various WorkItem attributes.
 * @member {module:model/WorkItemSignatures} signatures
 */

WorkItem.prototype.signatures = undefined;
/**
 * Max duration of processing in seconds per workitem (includes download and upload time).
 * @member {Number} limitProcessingTimeSec
 */

WorkItem.prototype.limitProcessingTimeSec = undefined;

function _classCallCheck$s(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$s(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$s(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$s(Constructor.prototype, protoProps); if (staticProps) _defineProperties$s(Constructor, staticProps); return Constructor; }
/**
 * The WorkItemStatus model module.
 * @module model/WorkItemStatus
 * @version 3.0.3
 */

var WorkItemStatus =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>WorkItemStatus</code>.
   * 
   * @alias module:model/WorkItemStatus
   * @class
   * @param status {module:model/Status} The current status of the workitem.
   */
  function WorkItemStatus(status) {
    _classCallCheck$s(this, WorkItemStatus);

    this.status = status;
  }
  /**
   * Constructs a <code>WorkItemStatus</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/WorkItemStatus} obj Optional instance to populate.
   * @return {module:model/WorkItemStatus} The populated <code>WorkItemStatus</code> instance.
   */


  _createClass$s(WorkItemStatus, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new WorkItemStatus();
        if (data.hasOwnProperty('status')) obj.status = Status.constructFromObject(data['status']);
        if (data.hasOwnProperty('progress')) obj.progress = AutodeskForgeDesignAutomationClient.convertToType(data['progress'], 'String');
        if (data.hasOwnProperty('reportUrl')) obj.reportUrl = AutodeskForgeDesignAutomationClient.convertToType(data['reportUrl'], 'String');
        if (data.hasOwnProperty('stats')) obj.stats = Statistics.constructFromObject(data['stats']);
        if (data.hasOwnProperty('id')) obj.id = AutodeskForgeDesignAutomationClient.convertToType(data['id'], 'String');
      }

      return obj;
    }
  }]);

  return WorkItemStatus;
}();
WorkItemStatus.prototype.status = undefined;
/**
 * The current status of the workitem.
 * @member {String} progress
 */

WorkItemStatus.prototype.progress = undefined;
/**
 * The detailed report about the workitem, report url is valid for 24 hours from first receiving it.
 * @member {String} reportUrl
 */

WorkItemStatus.prototype.reportUrl = undefined;
/**
 * Basic statistics about workitem processing.
 * @member {module:model/Statistics} stats
 */

WorkItemStatus.prototype.stats = undefined;
/**
 * @member {String} id
 */

WorkItemStatus.prototype.id = undefined;

function _classCallCheck$t(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$t(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$t(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$t(Constructor.prototype, protoProps); if (staticProps) _defineProperties$t(Constructor, staticProps); return Constructor; }
/**
 * The StringArgument model module.
 * @module model/StringArgument
 * @version 3.0.3
 */

var StringArgument =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>StringArgument</code>.
   * @alias module:model/StringArgument
   * @class
   * @implements module:model/IArgument
   */
  function StringArgument() {
    _classCallCheck$t(this, StringArgument);

    IArgument.call(this);
  }
  /**
   * Constructs a <code>StringArgument</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StringArgument} obj Optional instance to populate.
   * @return {module:model/StringArgument} The populated <code>StringArgument</code> instance.
   */


  _createClass$t(StringArgument, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new StringArgument();
        IArgument.constructFromObject(data, obj);
        if (data.hasOwnProperty('value')) obj.value = AutodeskForgeDesignAutomationClient.convertToType(data['value'], 'String');
      }

      return obj;
    }
  }]);

  return StringArgument;
}();
StringArgument.prototype.value = undefined; // Implement IArgument interface:

function _classCallCheck$u(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$u(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$u(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$u(Constructor.prototype, protoProps); if (staticProps) _defineProperties$u(Constructor, staticProps); return Constructor; }
/**
 * The StringSetting model module.
 * @module model/StringSetting
 * @version 3.0.3
 */

var StringSetting =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>StringSetting</code>.
   * @alias module:model/StringSetting
   * @class
   * @implements module:model/ISetting
   */
  function StringSetting() {
    _classCallCheck$u(this, StringSetting);

    ISetting.call(this);
  }
  /**
   * Constructs a <code>StringSetting</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/StringSetting} obj Optional instance to populate.
   * @return {module:model/StringSetting} The populated <code>StringSetting</code> instance.
   */


  _createClass$u(StringSetting, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new StringSetting();
        ISetting.constructFromObject(data, obj);
        if (data.hasOwnProperty('value')) obj.value = AutodeskForgeDesignAutomationClient.convertToType(data['value'], 'String');
        if (data.hasOwnProperty('isEnvironmentVariable')) obj.isEnvironmentVariable = AutodeskForgeDesignAutomationClient.convertToType(data['isEnvironmentVariable'], 'Boolean');
      }

      return obj;
    }
  }]);

  return StringSetting;
}();
StringSetting.prototype.value = undefined;
/**
 * @member {Boolean} isEnvironmentVariable
 * @default false
 */

StringSetting.prototype.isEnvironmentVariable = false; // Implement ISetting interface:

function _classCallCheck$v(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$v(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$v(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$v(Constructor.prototype, protoProps); if (staticProps) _defineProperties$v(Constructor, staticProps); return Constructor; }
/**
 * The UrlSetting model module.
 * @module model/UrlSetting
 * @version 3.0.3
 */

var UrlSetting =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>UrlSetting</code>.
   * @alias module:model/UrlSetting
   * @class
   * @implements module:model/ISetting
   * @param url {String} Url.
   */
  function UrlSetting(url) {
    _classCallCheck$v(this, UrlSetting);

    ISetting.call(this);
    this.url = url;
  }
  /**
   * Constructs a <code>UrlSetting</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/UrlSetting} obj Optional instance to populate.
   * @return {module:model/UrlSetting} The populated <code>UrlSetting</code> instance.
   */


  _createClass$v(UrlSetting, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new UrlSetting();
        ISetting.constructFromObject(data, obj);
        if (data.hasOwnProperty('url')) obj.url = AutodeskForgeDesignAutomationClient.convertToType(data['url'], 'String');
        if (data.hasOwnProperty('headers')) obj.headers = AutodeskForgeDesignAutomationClient.convertToType(data['headers'], {
          'String': 'String'
        });
        if (data.hasOwnProperty('verb')) obj.verb = Verb.constructFromObject(data['verb']);
      }

      return obj;
    }
  }]);

  return UrlSetting;
}();
UrlSetting.prototype.url = undefined;
/**
 * Headers.
 * @member {Object.<String, String>} headers
 */

UrlSetting.prototype.headers = undefined;
/**
 * The HTTP verb to be used.
 * @member {module:model/Verb} verb
 */

UrlSetting.prototype.verb = undefined; // Implement ISetting interface:

function _classCallCheck$w(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$w(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$w(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$w(Constructor.prototype, protoProps); if (staticProps) _defineProperties$w(Constructor, staticProps); return Constructor; }
/**
 * The XrefTreeArgument model module.
 * @module model/XrefTreeArgument
 * @version 3.0.3
 */

var XrefTreeArgument =
/*#__PURE__*/
function () {
  /**
   * Constructs a new <code>XrefTreeArgument</code>.
   * @alias module:model/XrefTreeArgument
   * @class
   * @implements module:model/IArgument
   * @param url {String} Url.
   */
  function XrefTreeArgument(url) {
    _classCallCheck$w(this, XrefTreeArgument);

    IArgument.call(this);
    this.url = url;
  }
  /**
   * Constructs a <code>XrefTreeArgument</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/XrefTreeArgument} obj Optional instance to populate.
   * @return {module:model/XrefTreeArgument} The populated <code>XrefTreeArgument</code> instance.
   */


  _createClass$w(XrefTreeArgument, null, [{
    key: "constructFromObject",
    value: function constructFromObject(data, obj) {
      if (data) {
        obj = obj || new XrefTreeArgument();
        IArgument.constructFromObject(data, obj);
        if (data.hasOwnProperty('optional')) obj.optional = AutodeskForgeDesignAutomationClient.convertToType(data['optional'], 'Boolean');
        if (data.hasOwnProperty('localName')) obj.localName = AutodeskForgeDesignAutomationClient.convertToType(data['localName'], 'String');
        if (data.hasOwnProperty('pathInZip')) obj.pathInZip = AutodeskForgeDesignAutomationClient.convertToType(data['pathInZip'], 'String');
        if (data.hasOwnProperty('references')) obj.references = AutodeskForgeDesignAutomationClient.convertToType(data['references'], [XrefTreeArgument]);
        if (data.hasOwnProperty('url')) obj.url = AutodeskForgeDesignAutomationClient.convertToType(data['url'], 'String');
        if (data.hasOwnProperty('headers')) obj.headers = AutodeskForgeDesignAutomationClient.convertToType(data['headers'], {
          'String': 'String'
        });
        if (data.hasOwnProperty('verb')) obj.verb = Verb.constructFromObject(data['verb']);
      }

      return obj;
    }
  }]);

  return XrefTreeArgument;
}();
XrefTreeArgument.prototype.optional = false;
/**
 * The file or folder where the contents of an UrlArgument are placed. Note that this may be different than the `localName` for input arguments when [Content-Disposition] (http://www.w3.org/Protocols/rfc2616/rfc2616-sec19.html#sec19.5.1) header is specifified by the server. For `zip` = `true` this is a folder name. See Activity.instructions for more information.
 * @member {String} localName
 */

XrefTreeArgument.prototype.localName = undefined;
/**
 * Denotes the 'main file` in a zip. See Activity.instructions for more information. If the url does not point to a zip the this parameter is ignored. The parameter references a zip file. This is how this is interpreted in various scenarios: 1. verb==get implies that the byte stream should be unzipped to a folder designated by localName. 2. verb==put, patch, post the contents of the file or folder designated by localName will be zipped and sent. 3. Any other verb values result in an error.
 * @member {String} pathInZip
 */

XrefTreeArgument.prototype.pathInZip = undefined;
/**
 * @member {Array.<module:model/XrefTreeArgument>} references
 */

XrefTreeArgument.prototype.references = undefined;
/**
 * Url.
 * @member {String} url
 */

XrefTreeArgument.prototype.url = undefined;
/**
 * Headers.
 * @member {Object.<String, String>} headers
 */

XrefTreeArgument.prototype.headers = undefined;
/**
 * The HTTP verb to be used.
 * @member {module:model/Verb} verb
 */

XrefTreeArgument.prototype.verb = undefined; // Implement IArgument interface:

function _classCallCheck$x(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$x(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$x(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$x(Constructor.prototype, protoProps); if (staticProps) _defineProperties$x(Constructor, staticProps); return Constructor; }
/**
* AutodeskForgeDesignAutomation service.
* @module api/AutodeskForgeDesignAutomationApi
* @version 3.0.3
*/

var AutodeskForgeDesignAutomationApi =
/*#__PURE__*/
function () {
  /**
  * Constructs a new AutodeskForgeDesignAutomationApi. 
  * @alias module:api/AutodeskForgeDesignAutomationApi
  * @class
  * @param {module:AutodeskForgeDesignAutomationClient} [apiClient] Optional API client implementation to use,
  * default to {@link module:AutodeskForgeDesignAutomationClient#instance} if unspecified.
  */
  function AutodeskForgeDesignAutomationApi(apiClient) {
    _classCallCheck$x(this, AutodeskForgeDesignAutomationApi);

    this.apiClient = apiClient || AutodeskForgeDesignAutomationClient.instance;
  }
  /**
   * Creates a new Activity.
   * Creates a new Activity.              Limits (varies by Engine):              1. Number of Activities that can be created.
   * @param {module:model/Activity} item 
   * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Activity} and HTTP response
   */
  // Test: item,customHeader 


  _createClass$x(AutodeskForgeDesignAutomationApi, [{
    key: "createActivityWithHttpInfo",
    value: function createActivityWithHttpInfo(item, customHeader) {
      customHeader = customHeader || {};
      var postBody = item; // verify the required parameter 'item' is set

      if (item === undefined || item === null) {
        throw new Error("Missing the required parameter 'item' when calling createActivity");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Activity;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new Activity.
     * Creates a new Activity.              Limits (varies by Engine):              1. Number of Activities that can be created.
     * @param {module:model/Activity} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Activity}
     */

  }, {
    key: "createActivity",
    value: function createActivity(item, customHeader) {
      return this.createActivityWithHttpInfo(item, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new alias for this Activity.
     * Creates a new alias for this Activity.              Limit:              1. Number of aliases (LimitAliases).
     * @param {String} id Name of Activity (unqualified).
     * @param {module:model/Alias} alias { id : {anyname}, version : {version number}, receiver : [{id of other Forge app},...] }.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Alias} and HTTP response
     */
    // Test: id,alias,customHeader 

  }, {
    key: "createActivityAliasWithHttpInfo",
    value: function createActivityAliasWithHttpInfo(id, alias, customHeader) {
      customHeader = customHeader || {};
      var postBody = alias; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling createActivityAlias");
      } // verify the required parameter 'alias' is set


      if (alias === undefined || alias === null) {
        throw new Error("Missing the required parameter 'alias' when calling createActivityAlias");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Alias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/aliases', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new alias for this Activity.
     * Creates a new alias for this Activity.              Limit:              1. Number of aliases (LimitAliases).
     * @param {String} id Name of Activity (unqualified).
     * @param {module:model/Alias} alias { id : {anyname}, version : {version number}, receiver : [{id of other Forge app},...] }.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Alias}
     */

  }, {
    key: "createActivityAlias",
    value: function createActivityAlias(id, alias, customHeader) {
      return this.createActivityAliasWithHttpInfo(id, alias, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new version of the Activity.
     * Creates a new version of the Activity.              Limit:              1. Number of versions (LimitVersions).
     * @param {String} id Name of Activity (unqualified).
     * @param {module:model/Activity} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Activity} and HTTP response
     */
    // Test: id,item,customHeader 

  }, {
    key: "createActivityVersionWithHttpInfo",
    value: function createActivityVersionWithHttpInfo(id, item, customHeader) {
      customHeader = customHeader || {};
      var postBody = item; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling createActivityVersion");
      } // verify the required parameter 'item' is set


      if (item === undefined || item === null) {
        throw new Error("Missing the required parameter 'item' when calling createActivityVersion");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Activity;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/versions', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new version of the Activity.
     * Creates a new version of the Activity.              Limit:              1. Number of versions (LimitVersions).
     * @param {String} id Name of Activity (unqualified).
     * @param {module:model/Activity} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Activity}
     */

  }, {
    key: "createActivityVersion",
    value: function createActivityVersion(id, item, customHeader) {
      return this.createActivityVersionWithHttpInfo(id, item, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new AppBundle.
     * Creates a new AppBundle.              | Limits: (varies by Engine)              | 1. Number of AppBundle that can be created.              | 2. Size of AppBundle.              | This method creates new AppBundle returned in response value.              | POST upload is required to limit upload size.              |              | After this request, you need to upload the AppBundle zip.              | To upload the AppBundle package, create a multipart/form-data request using data received in reponse uploadParameters:              | - endpointURL is the URL to make the upload package request against,              | - formData are the parameters that need to be put into the upload package request body.              |   They must be followed by an extra &#39;file&#39; parameter indicating the location of the package file.              | An example:              |              | curl https://bucketname.s3.amazonaws.com/              | -F key &#x3D; apps/myApp/myfile.zip              | -F content-type &#x3D; application/octet-stream              | -F policy &#x3D; eyJleHBpcmF0aW9uIjoiMjAxOC0wNi0yMVQxMzo...(trimmed)              | -F x-amz-signature &#x3D; 800e52d73579387757e1c1cd88762...(trimmed)              | -F x-amz-credential &#x3D; AKIAIOSFODNN7EXAMPLE/20180621/us-west-2/s3/aws4_request/              | -F x-amz-algorithm &#x3D; AWS4-HMAC-SHA256              | -F x-amz-date &#x3D; 20180621T091656Z              | -F file&#x3D;@E:\\myfile.zip              | The &#39;file&#39; field must be at the end, all fields after &#39;file&#39; will be ignored.
     * @param {module:model/AppBundle} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AppBundle} and HTTP response
     */
    // Test: item,customHeader 

  }, {
    key: "createAppBundleWithHttpInfo",
    value: function createAppBundleWithHttpInfo(item, customHeader) {
      customHeader = customHeader || {};
      var postBody = item; // verify the required parameter 'item' is set

      if (item === undefined || item === null) {
        throw new Error("Missing the required parameter 'item' when calling createAppBundle");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = AppBundle;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new AppBundle.
     * Creates a new AppBundle.              | Limits: (varies by Engine)              | 1. Number of AppBundle that can be created.              | 2. Size of AppBundle.              | This method creates new AppBundle returned in response value.              | POST upload is required to limit upload size.              |              | After this request, you need to upload the AppBundle zip.              | To upload the AppBundle package, create a multipart/form-data request using data received in reponse uploadParameters:              | - endpointURL is the URL to make the upload package request against,              | - formData are the parameters that need to be put into the upload package request body.              |   They must be followed by an extra &#39;file&#39; parameter indicating the location of the package file.              | An example:              |              | curl https://bucketname.s3.amazonaws.com/              | -F key &#x3D; apps/myApp/myfile.zip              | -F content-type &#x3D; application/octet-stream              | -F policy &#x3D; eyJleHBpcmF0aW9uIjoiMjAxOC0wNi0yMVQxMzo...(trimmed)              | -F x-amz-signature &#x3D; 800e52d73579387757e1c1cd88762...(trimmed)              | -F x-amz-credential &#x3D; AKIAIOSFODNN7EXAMPLE/20180621/us-west-2/s3/aws4_request/              | -F x-amz-algorithm &#x3D; AWS4-HMAC-SHA256              | -F x-amz-date &#x3D; 20180621T091656Z              | -F file&#x3D;@E:\\myfile.zip              | The &#39;file&#39; field must be at the end, all fields after &#39;file&#39; will be ignored.
     * @param {module:model/AppBundle} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AppBundle}
     */

  }, {
    key: "createAppBundle",
    value: function createAppBundle(item, customHeader) {
      return this.createAppBundleWithHttpInfo(item, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new alias for this AppBundle.
     * Creates a new alias for this AppBundle. Limit: 1. Number of aliases (LimitAliases).
     * @param {String} id Name of AppBundle (unqualified).
     * @param {module:model/Alias} alias 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Alias} and HTTP response
     */
    // Test: id,alias,customHeader 

  }, {
    key: "createAppBundleAliasWithHttpInfo",
    value: function createAppBundleAliasWithHttpInfo(id, alias, customHeader) {
      customHeader = customHeader || {};
      var postBody = alias; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling createAppBundleAlias");
      } // verify the required parameter 'alias' is set


      if (alias === undefined || alias === null) {
        throw new Error("Missing the required parameter 'alias' when calling createAppBundleAlias");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Alias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/aliases', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new alias for this AppBundle.
     * Creates a new alias for this AppBundle. Limit: 1. Number of aliases (LimitAliases).
     * @param {String} id Name of AppBundle (unqualified).
     * @param {module:model/Alias} alias 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Alias}
     */

  }, {
    key: "createAppBundleAlias",
    value: function createAppBundleAlias(id, alias, customHeader) {
      return this.createAppBundleAliasWithHttpInfo(id, alias, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new version of the AppBundle.
     * Creates a new version of the AppBundle.              | Limit:              | 1. Number of versions (LimitVersions).              | 2. Size of AppBundle.              | This method creates new AppBundle returned in response value.              | POST upload is required to limit upload size. The endpoint url and all form fields are retrieved in AppBundle.UploadParameters.              |              | After this request, you need to upload the AppBundle zip.              | Use data received in the response to create multipart/form-data request. An example:              |              | curl https://bucketname.s3.amazonaws.com/              | -F key &#x3D; apps/myApp/myfile.zip              | -F content-type &#x3D; application/octet-stream              | -F policy &#x3D; eyJleHBpcmF0aW9uIjoiMjAxOC0wNi0yMVQxMzo...(trimmed)              | -F x-amz-signature &#x3D; 800e52d73579387757e1c1cd88762...(trimmed)              | -F x-amz-credential &#x3D; AKIAIOSFODNN7EXAMPLE/20180621/us-west-2/s3/aws4_request/              | -F x-amz-algorithm &#x3D; AWS4-HMAC-SHA256              | -F x-amz-date &#x3D; 20180621T091656Z              | -F file&#x3D;@E:\\myfile.zip              The &#39;file&#39; field must be at the end, all fields after &#39;file&#39; will be ignored.
     * @param {String} id Name of app (unqualified).
     * @param {module:model/AppBundle} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AppBundle} and HTTP response
     */
    // Test: id,item,customHeader 

  }, {
    key: "createAppBundleVersionWithHttpInfo",
    value: function createAppBundleVersionWithHttpInfo(id, item, customHeader) {
      customHeader = customHeader || {};
      var postBody = item; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling createAppBundleVersion");
      } // verify the required parameter 'item' is set


      if (item === undefined || item === null) {
        throw new Error("Missing the required parameter 'item' when calling createAppBundleVersion");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = AppBundle;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/versions', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new version of the AppBundle.
     * Creates a new version of the AppBundle.              | Limit:              | 1. Number of versions (LimitVersions).              | 2. Size of AppBundle.              | This method creates new AppBundle returned in response value.              | POST upload is required to limit upload size. The endpoint url and all form fields are retrieved in AppBundle.UploadParameters.              |              | After this request, you need to upload the AppBundle zip.              | Use data received in the response to create multipart/form-data request. An example:              |              | curl https://bucketname.s3.amazonaws.com/              | -F key &#x3D; apps/myApp/myfile.zip              | -F content-type &#x3D; application/octet-stream              | -F policy &#x3D; eyJleHBpcmF0aW9uIjoiMjAxOC0wNi0yMVQxMzo...(trimmed)              | -F x-amz-signature &#x3D; 800e52d73579387757e1c1cd88762...(trimmed)              | -F x-amz-credential &#x3D; AKIAIOSFODNN7EXAMPLE/20180621/us-west-2/s3/aws4_request/              | -F x-amz-algorithm &#x3D; AWS4-HMAC-SHA256              | -F x-amz-date &#x3D; 20180621T091656Z              | -F file&#x3D;@E:\\myfile.zip              The &#39;file&#39; field must be at the end, all fields after &#39;file&#39; will be ignored.
     * @param {String} id Name of app (unqualified).
     * @param {module:model/AppBundle} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AppBundle}
     */

  }, {
    key: "createAppBundleVersion",
    value: function createAppBundleVersion(id, item, customHeader) {
      return this.createAppBundleVersionWithHttpInfo(id, item, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates/updates the nickname for the current Forge app.
     * Creates/updates the nickname for the current Forge app.  The nickname is  used as a clearer alternative name when identifying AppBundles and Activities, as  compared to using the Forge app ID.  Once you have defined a nickname,  it MUST be used instead of the Forge app ID.                The new nickname cannot be in use by any other Forge app.                The Forge app cannot have any data when this endpoint is invoked.  Use the &#39;DELETE /forgeapps/me&#39;  endpoint (cautiously!!!) to remove all data from this Forge app.  &#39;DELETE /forgeapps/me&#39; is  also the only way to remove the nickname.                Note the nickname is supplied in the body, not as a query-parameter.
     * @param {String} id Must be \&quot;me\&quot; for the call to succeed.
     * @param {module:model/NicknameRecord} nicknameRecord new nickname (public key is for internal use only).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,nicknameRecord,customHeader 

  }, {
    key: "createNicknameWithHttpInfo",
    value: function createNicknameWithHttpInfo(id, nicknameRecord, customHeader) {
      customHeader = customHeader || {};
      var postBody = nicknameRecord; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling createNickname");
      } // verify the required parameter 'nicknameRecord' is set


      if (nicknameRecord === undefined || nicknameRecord === null) {
        throw new Error("Missing the required parameter 'nicknameRecord' when calling createNickname");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/forgeapps/{id}', 'PATCH', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates/updates the nickname for the current Forge app.
     * Creates/updates the nickname for the current Forge app.  The nickname is  used as a clearer alternative name when identifying AppBundles and Activities, as  compared to using the Forge app ID.  Once you have defined a nickname,  it MUST be used instead of the Forge app ID.                The new nickname cannot be in use by any other Forge app.                The Forge app cannot have any data when this endpoint is invoked.  Use the &#39;DELETE /forgeapps/me&#39;  endpoint (cautiously!!!) to remove all data from this Forge app.  &#39;DELETE /forgeapps/me&#39; is  also the only way to remove the nickname.                Note the nickname is supplied in the body, not as a query-parameter.
     * @param {String} id Must be \&quot;me\&quot; for the call to succeed.
     * @param {module:model/NicknameRecord} nicknameRecord new nickname (public key is for internal use only).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "createNickname",
    value: function createNickname(id, nicknameRecord, customHeader) {
      return this.createNicknameWithHttpInfo(id, nicknameRecord, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new WorkItem and queues it for processing.
     * Creates a new WorkItem and queues it for processing.  The new WorkItem is always placed on the queue; no further action is necessary.                Limits (Engine-specific):                1. Number of downloads (LimitDownloads)  2. Number of uploads (LimitUploads)  3. Total download size (LimitDownloadSize)  4. Total upload size (LimitUploadSize)  5. Processing time (LimitProcessingTime)  6. Total size of uncompressed bits for all referenced appbundles (LimitTotalUncompressedAppsSizePerActivity).
     * @param {module:model/WorkItem} workItem 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/WorkItemStatus} and HTTP response
     */
    // Test: workItem,customHeader 

  }, {
    key: "createWorkItemWithHttpInfo",
    value: function createWorkItemWithHttpInfo(workItem, customHeader) {
      customHeader = customHeader || {};
      var postBody = workItem; // verify the required parameter 'workItem' is set

      if (workItem === undefined || workItem === null) {
        throw new Error("Missing the required parameter 'workItem' when calling createWorkItem");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged', '3-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = WorkItemStatus;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/workitems', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new WorkItem and queues it for processing.
     * Creates a new WorkItem and queues it for processing.  The new WorkItem is always placed on the queue; no further action is necessary.                Limits (Engine-specific):                1. Number of downloads (LimitDownloads)  2. Number of uploads (LimitUploads)  3. Total download size (LimitDownloadSize)  4. Total upload size (LimitUploadSize)  5. Processing time (LimitProcessingTime)  6. Total size of uncompressed bits for all referenced appbundles (LimitTotalUncompressedAppsSizePerActivity).
     * @param {module:model/WorkItem} workItem 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/WorkItemStatus}
     */

  }, {
    key: "createWorkItem",
    value: function createWorkItem(workItem, customHeader) {
      return this.createWorkItemWithHttpInfo(workItem, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates new WorkItems and queues them for processing.
     * Creates one or more  WorkItems and queues them for processing.  The new WorkItems are always placed on the queue; no further action is necessary.                Limits (Engine-specific):                1. Number of downloads (LimitDownloads)  2. Number of uploads (LimitUploads)  3. Total download size (LimitDownloadSize)  4. Total upload size (LimitUploadSize)  5. Processing time (LimitProcessingTime)  6. Total size of uncompressed bits for all referenced appbundles (LimitTotalUncompressedAppsSizePerActivity).
     * @param {Array.<module:model/WorkItem>} workItems 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link Array.<module:model/WorkItemStatus>} and HTTP response
     */
    // Test: workItems,customHeader 

  }, {
    key: "createWorkItemsBatchWithHttpInfo",
    value: function createWorkItemsBatchWithHttpInfo(workItems, customHeader) {
      customHeader = customHeader || {};
      var postBody = workItems; // verify the required parameter 'workItems' is set

      if (workItems === undefined || workItems === null) {
        throw new Error("Missing the required parameter 'workItems' when calling createWorkItemsBatch");
      }

      var pathParams = {};
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged', '3-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [WorkItemStatus];

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/workitems/batch', 'POST', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates new WorkItems and queues them for processing.
     * Creates one or more  WorkItems and queues them for processing.  The new WorkItems are always placed on the queue; no further action is necessary.                Limits (Engine-specific):                1. Number of downloads (LimitDownloads)  2. Number of uploads (LimitUploads)  3. Total download size (LimitDownloadSize)  4. Total upload size (LimitUploadSize)  5. Processing time (LimitProcessingTime)  6. Total size of uncompressed bits for all referenced appbundles (LimitTotalUncompressedAppsSizePerActivity).
     * @param {Array.<module:model/WorkItem>} workItems 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link Array.<module:model/WorkItemStatus>}
     */

  }, {
    key: "createWorkItemsBatch",
    value: function createWorkItemsBatch(workItems, customHeader) {
      return this.createWorkItemsBatchWithHttpInfo(workItems, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes the specified Activity.
     * Deletes the specified Activity, including all versions and aliases.
     * @param {String} id Name of Activity (unqualified).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "deleteActivityWithHttpInfo",
    value: function deleteActivityWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteActivity");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes the specified Activity.
     * Deletes the specified Activity, including all versions and aliases.
     * @param {String} id Name of Activity (unqualified).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteActivity",
    value: function deleteActivity(id, customHeader) {
      return this.deleteActivityWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes the alias.
     * Deletes the alias.
     * @param {String} id Name of Activity (unqualified).
     * @param {String} aliasId Name of alias to delete.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,aliasId,customHeader 

  }, {
    key: "deleteActivityAliasWithHttpInfo",
    value: function deleteActivityAliasWithHttpInfo(id, aliasId, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteActivityAlias");
      } // verify the required parameter 'aliasId' is set


      if (aliasId === undefined || aliasId === null) {
        throw new Error("Missing the required parameter 'aliasId' when calling deleteActivityAlias");
      }

      var pathParams = {
        'id': id,
        'aliasId': aliasId
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/aliases/{aliasId}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes the alias.
     * Deletes the alias.
     * @param {String} id Name of Activity (unqualified).
     * @param {String} aliasId Name of alias to delete.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteActivityAlias",
    value: function deleteActivityAlias(id, aliasId, customHeader) {
      return this.deleteActivityAliasWithHttpInfo(id, aliasId, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes the specified version of the Activity.
     * Deletes the specified version of the Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Number} version Version to delete (integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,version,customHeader 

  }, {
    key: "deleteActivityVersionWithHttpInfo",
    value: function deleteActivityVersionWithHttpInfo(id, version, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteActivityVersion");
      } // verify the required parameter 'version' is set


      if (version === undefined || version === null) {
        throw new Error("Missing the required parameter 'version' when calling deleteActivityVersion");
      }

      var pathParams = {
        'id': id,
        'version': version
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/versions/{version}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes the specified version of the Activity.
     * Deletes the specified version of the Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Number} version Version to delete (integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteActivityVersion",
    value: function deleteActivityVersion(id, version, customHeader) {
      return this.deleteActivityVersionWithHttpInfo(id, version, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes the specified AppBundle.
     * Deletes the specified AppBundle, including all versions and aliases.
     * @param {String} id Name of AppBundle (unqualified).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "deleteAppBundleWithHttpInfo",
    value: function deleteAppBundleWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteAppBundle");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes the specified AppBundle.
     * Deletes the specified AppBundle, including all versions and aliases.
     * @param {String} id Name of AppBundle (unqualified).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteAppBundle",
    value: function deleteAppBundle(id, customHeader) {
      return this.deleteAppBundleWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes the alias.
     * Deletes the alias.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {String} aliasId Name of alias to delete.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,aliasId,customHeader 

  }, {
    key: "deleteAppBundleAliasWithHttpInfo",
    value: function deleteAppBundleAliasWithHttpInfo(id, aliasId, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteAppBundleAlias");
      } // verify the required parameter 'aliasId' is set


      if (aliasId === undefined || aliasId === null) {
        throw new Error("Missing the required parameter 'aliasId' when calling deleteAppBundleAlias");
      }

      var pathParams = {
        'id': id,
        'aliasId': aliasId
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/aliases/{aliasId}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes the alias.
     * Deletes the alias.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {String} aliasId Name of alias to delete.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteAppBundleAlias",
    value: function deleteAppBundleAlias(id, aliasId, customHeader) {
      return this.deleteAppBundleAliasWithHttpInfo(id, aliasId, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes the specified version of the AppBundle.
     * Deletes the specified version of the AppBundle.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {Number} version Version to delete (as integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,version,customHeader 

  }, {
    key: "deleteAppBundleVersionWithHttpInfo",
    value: function deleteAppBundleVersionWithHttpInfo(id, version, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteAppBundleVersion");
      } // verify the required parameter 'version' is set


      if (version === undefined || version === null) {
        throw new Error("Missing the required parameter 'version' when calling deleteAppBundleVersion");
      }

      var pathParams = {
        'id': id,
        'version': version
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/versions/{version}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes the specified version of the AppBundle.
     * Deletes the specified version of the AppBundle.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {Number} version Version to delete (as integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteAppBundleVersion",
    value: function deleteAppBundleVersion(id, version, customHeader) {
      return this.deleteAppBundleVersionWithHttpInfo(id, version, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Delete all data associated with this Forge app.
     * Delete all data associated with the given Forge app.                ALL Design Automation appbundles and activities are DELETED.                This may take up to 2 minutes. During this time the app will not be able to make successful requests.
     * @param {String} id Must be \&quot;me\&quot; for the call to succeed.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "deleteForgeAppWithHttpInfo",
    value: function deleteForgeAppWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteForgeApp");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/forgeapps/{id}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Delete all data associated with this Forge app.
     * Delete all data associated with the given Forge app.                ALL Design Automation appbundles and activities are DELETED.                This may take up to 2 minutes. During this time the app will not be able to make successful requests.
     * @param {String} id Must be \&quot;me\&quot; for the call to succeed.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteForgeApp",
    value: function deleteForgeApp(id, customHeader) {
      return this.deleteForgeAppWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Deletes user service limits.
     * @param {String} owner 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: owner,customHeader 

  }, {
    key: "deleteServiceLimitsWithHttpInfo",
    value: function deleteServiceLimitsWithHttpInfo(owner, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'owner' is set

      if (owner === undefined || owner === null) {
        throw new Error("Missing the required parameter 'owner' when calling deleteServiceLimits");
      }

      var pathParams = {
        'owner': owner
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/servicelimits/{owner}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Deletes user service limits.
     * @param {String} owner 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteServiceLimits",
    value: function deleteServiceLimits(owner, customHeader) {
      return this.deleteServiceLimitsWithHttpInfo(owner, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Cancels a specific WorkItem.
     * Cancels a specific WorkItem.  If the WorkItem is on the queue, it is removed from the queue and not processed.  If the WorkItem is already being processed, then it may or may not be interrupted and cancelled.  If the WorkItem has already finished processing, then it has no effect on the processing or results.
     * @param {String} id 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "deleteWorkitemWithHttpInfo",
    value: function deleteWorkitemWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling deleteWorkitem");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged', '3-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/workitems/{id}', 'DELETE', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Cancels a specific WorkItem.
     * Cancels a specific WorkItem.  If the WorkItem is on the queue, it is removed from the queue and not processed.  If the WorkItem is already being processed, then it may or may not be interrupted and cancelled.  If the WorkItem has already finished processing, then it has no effect on the processing or results.
     * @param {String} id 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}
     */

  }, {
    key: "deleteWorkitem",
    value: function deleteWorkitem(id, customHeader) {
      return this.deleteWorkitemWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all available Activities.
     * Lists all available Activities, including Activities shared with this Forge app.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageString} and HTTP response
     */
    // Test: opts,customHeader 

  }, {
    key: "getActivitiesWithHttpInfo",
    value: function getActivitiesWithHttpInfo(opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageString;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all available Activities.
     * Lists all available Activities, including Activities shared with this Forge app.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageString}
     */

  }, {
    key: "getActivities",
    value: function getActivities(opts, customHeader) {
      return this.getActivitiesWithHttpInfo(opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets the details of the specified Activity.
     * Gets the details of the specified Activity. Note that the {id} parameter must be a QualifiedId (owner.name+label).
     * @param {String} id Full qualified id of the Activity (owner.name+label).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Activity} and HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "getActivityWithHttpInfo",
    value: function getActivityWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getActivity");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Activity;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets the details of the specified Activity.
     * Gets the details of the specified Activity. Note that the {id} parameter must be a QualifiedId (owner.name+label).
     * @param {String} id Full qualified id of the Activity (owner.name+label).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Activity}
     */

  }, {
    key: "getActivity",
    value: function getActivity(id, customHeader) {
      return this.getActivityWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Get alias details.
     * Get alias details.
     * @param {String} id Name of Activity (unqualified).
     * @param {String} aliasId Name of alias.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Alias} and HTTP response
     */
    // Test: id,aliasId,customHeader 

  }, {
    key: "getActivityAliasWithHttpInfo",
    value: function getActivityAliasWithHttpInfo(id, aliasId, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getActivityAlias");
      } // verify the required parameter 'aliasId' is set


      if (aliasId === undefined || aliasId === null) {
        throw new Error("Missing the required parameter 'aliasId' when calling getActivityAlias");
      }

      var pathParams = {
        'id': id,
        'aliasId': aliasId
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Alias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/aliases/{aliasId}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Get alias details.
     * Get alias details.
     * @param {String} id Name of Activity (unqualified).
     * @param {String} aliasId Name of alias.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Alias}
     */

  }, {
    key: "getActivityAlias",
    value: function getActivityAlias(id, aliasId, customHeader) {
      return this.getActivityAliasWithHttpInfo(id, aliasId, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all aliases for the specified Activity.
     * Lists all aliases for the specified Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageAlias} and HTTP response
     */
    // Test: id,opts,customHeader 

  }, {
    key: "getActivityAliasesWithHttpInfo",
    value: function getActivityAliasesWithHttpInfo(id, opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getActivityAliases");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageAlias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/aliases', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all aliases for the specified Activity.
     * Lists all aliases for the specified Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageAlias}
     */

  }, {
    key: "getActivityAliases",
    value: function getActivityAliases(id, opts, customHeader) {
      return this.getActivityAliasesWithHttpInfo(id, opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets the details of the specified version of the Activity.
     * Gets the details of the specified version of the Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Number} version Version to retrieve (integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Activity} and HTTP response
     */
    // Test: id,version,customHeader 

  }, {
    key: "getActivityVersionWithHttpInfo",
    value: function getActivityVersionWithHttpInfo(id, version, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getActivityVersion");
      } // verify the required parameter 'version' is set


      if (version === undefined || version === null) {
        throw new Error("Missing the required parameter 'version' when calling getActivityVersion");
      }

      var pathParams = {
        'id': id,
        'version': version
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Activity;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/versions/{version}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets the details of the specified version of the Activity.
     * Gets the details of the specified version of the Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Number} version Version to retrieve (integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Activity}
     */

  }, {
    key: "getActivityVersion",
    value: function getActivityVersion(id, version, customHeader) {
      return this.getActivityVersionWithHttpInfo(id, version, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all versions of the specified Activity.
     * Lists all versions of the specified Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageInt32} and HTTP response
     */
    // Test: id,opts,customHeader 

  }, {
    key: "getActivityVersionsWithHttpInfo",
    value: function getActivityVersionsWithHttpInfo(id, opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getActivityVersions");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageInt32;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/versions', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all versions of the specified Activity.
     * Lists all versions of the specified Activity.
     * @param {String} id Name of Activity (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageInt32}
     */

  }, {
    key: "getActivityVersions",
    value: function getActivityVersions(id, opts, customHeader) {
      return this.getActivityVersionsWithHttpInfo(id, opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets the details of the specified AppBundle.
     * Gets the details of the specified AppBundle. Note that the {id} parameter must be a QualifiedId (owner.name+label).
     * @param {String} id Full qualified id of the AppBundle (owner.name+label).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AppBundle} and HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "getAppBundleWithHttpInfo",
    value: function getAppBundleWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getAppBundle");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = AppBundle;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets the details of the specified AppBundle.
     * Gets the details of the specified AppBundle. Note that the {id} parameter must be a QualifiedId (owner.name+label).
     * @param {String} id Full qualified id of the AppBundle (owner.name+label).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AppBundle}
     */

  }, {
    key: "getAppBundle",
    value: function getAppBundle(id, customHeader) {
      return this.getAppBundleWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Get alias details.
     * Get alias details.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {String} aliasId Name of alias.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Alias} and HTTP response
     */
    // Test: id,aliasId,customHeader 

  }, {
    key: "getAppBundleAliasWithHttpInfo",
    value: function getAppBundleAliasWithHttpInfo(id, aliasId, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getAppBundleAlias");
      } // verify the required parameter 'aliasId' is set


      if (aliasId === undefined || aliasId === null) {
        throw new Error("Missing the required parameter 'aliasId' when calling getAppBundleAlias");
      }

      var pathParams = {
        'id': id,
        'aliasId': aliasId
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Alias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/aliases/{aliasId}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Get alias details.
     * Get alias details.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {String} aliasId Name of alias.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Alias}
     */

  }, {
    key: "getAppBundleAlias",
    value: function getAppBundleAlias(id, aliasId, customHeader) {
      return this.getAppBundleAliasWithHttpInfo(id, aliasId, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all aliases for the specified AppBundle.
     * Lists all aliases for the specified AppBundle.
     * @param {String} id Name of activity (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageAlias} and HTTP response
     */
    // Test: id,opts,customHeader 

  }, {
    key: "getAppBundleAliasesWithHttpInfo",
    value: function getAppBundleAliasesWithHttpInfo(id, opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getAppBundleAliases");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageAlias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/aliases', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all aliases for the specified AppBundle.
     * Lists all aliases for the specified AppBundle.
     * @param {String} id Name of activity (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageAlias}
     */

  }, {
    key: "getAppBundleAliases",
    value: function getAppBundleAliases(id, opts, customHeader) {
      return this.getAppBundleAliasesWithHttpInfo(id, opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets the details of the specified version of the AppBundle.
     * Gets the details of the specified version of the AppBundle.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {Number} version Version to retrieve (as integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/AppBundle} and HTTP response
     */
    // Test: id,version,customHeader 

  }, {
    key: "getAppBundleVersionWithHttpInfo",
    value: function getAppBundleVersionWithHttpInfo(id, version, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getAppBundleVersion");
      } // verify the required parameter 'version' is set


      if (version === undefined || version === null) {
        throw new Error("Missing the required parameter 'version' when calling getAppBundleVersion");
      }

      var pathParams = {
        'id': id,
        'version': version
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = AppBundle;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/versions/{version}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets the details of the specified version of the AppBundle.
     * Gets the details of the specified version of the AppBundle.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {Number} version Version to retrieve (as integer).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/AppBundle}
     */

  }, {
    key: "getAppBundleVersion",
    value: function getAppBundleVersion(id, version, customHeader) {
      return this.getAppBundleVersionWithHttpInfo(id, version, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all versions of the specified AppBundle.
     * Lists all versions of the specified AppBundle.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageInt32} and HTTP response
     */
    // Test: id,opts,customHeader 

  }, {
    key: "getAppBundleVersionsWithHttpInfo",
    value: function getAppBundleVersionsWithHttpInfo(id, opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getAppBundleVersions");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageInt32;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/versions', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all versions of the specified AppBundle.
     * Lists all versions of the specified AppBundle.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageInt32}
     */

  }, {
    key: "getAppBundleVersions",
    value: function getAppBundleVersions(id, opts, customHeader) {
      return this.getAppBundleVersionsWithHttpInfo(id, opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all available AppBundles.
     * Lists all available AppBundles, including AppBundles shared with this Forge app.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageString} and HTTP response
     */
    // Test: opts,customHeader 

  }, {
    key: "getAppBundlesWithHttpInfo",
    value: function getAppBundlesWithHttpInfo(opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageString;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all available AppBundles.
     * Lists all available AppBundles, including AppBundles shared with this Forge app.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageString}
     */

  }, {
    key: "getAppBundles",
    value: function getAppBundles(opts, customHeader) {
      return this.getAppBundlesWithHttpInfo(opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets the details of the specified Engine.
     * Gets the details of the specified Engine. Note that the {id} parameter must be a QualifiedId (owner.name+label).
     * @param {String} id Full qualified id of the Engine (owner.name+label).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Engine} and HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "getEngineWithHttpInfo",
    value: function getEngineWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getEngine");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Engine;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/engines/{id}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets the details of the specified Engine.
     * Gets the details of the specified Engine. Note that the {id} parameter must be a QualifiedId (owner.name+label).
     * @param {String} id Full qualified id of the Engine (owner.name+label).
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Engine}
     */

  }, {
    key: "getEngine",
    value: function getEngine(id, customHeader) {
      return this.getEngineWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Lists all available Engines.
     * Lists all available Engines.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageString} and HTTP response
     */
    // Test: opts,customHeader 

  }, {
    key: "getEnginesWithHttpInfo",
    value: function getEnginesWithHttpInfo(opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageString;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/engines', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Lists all available Engines.
     * Lists all available Engines.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Access an additional &#39;page&#39; of data when necessary, based on the &#39;paginationToken&#39; returned from a previous invocation.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageString}
     */

  }, {
    key: "getEngines",
    value: function getEngines(opts, customHeader) {
      return this.getEnginesWithHttpInfo(opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Returns the user&#39;s (app) nickname.
     * Return the given Forge app&#39;s nickname.                If the app has no nickname, this route will return its id.
     * @param {String} id Must be \&quot;me\&quot; for the call to succeed.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link 'String'} and HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "getNicknameWithHttpInfo",
    value: function getNicknameWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getNickname");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/forgeapps/{id}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Returns the user&#39;s (app) nickname.
     * Return the given Forge app&#39;s nickname.                If the app has no nickname, this route will return its id.
     * @param {String} id Must be \&quot;me\&quot; for the call to succeed.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link 'String'}
     */

  }, {
    key: "getNickname",
    value: function getNickname(id, customHeader) {
      return this.getNicknameWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Get the service limit configuration.
     * Gets a user&#39;s service limit configuration.
     * @param {String} owner The user to fetch the service limit configuration for.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/ServiceLimit} and HTTP response
     */
    // Test: owner,customHeader 

  }, {
    key: "getServiceLimitWithHttpInfo",
    value: function getServiceLimitWithHttpInfo(owner, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'owner' is set

      if (owner === undefined || owner === null) {
        throw new Error("Missing the required parameter 'owner' when calling getServiceLimit");
      }

      var pathParams = {
        'owner': owner
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = ServiceLimit;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/servicelimits/{owner}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Get the service limit configuration.
     * Gets a user&#39;s service limit configuration.
     * @param {String} owner The user to fetch the service limit configuration for.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/ServiceLimit}
     */

  }, {
    key: "getServiceLimit",
    value: function getServiceLimit(owner, customHeader) {
      return this.getServiceLimitWithHttpInfo(owner, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets all Shares (AppBundles and Activities) shared by this Forge app.
     * Gets all Shares (AppBundles and Activities) shared by this Forge app (shared to other  Forge apps for them to use).                Sharing of AppBundles and Activities is controlled via the use of &#39;aliases&#39;.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Used to get subsequent &#39;pages&#39; of data.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/PageShare} and HTTP response
     */
    // Test: opts,customHeader 

  }, {
    key: "getSharesWithHttpInfo",
    value: function getSharesWithHttpInfo(opts, customHeader) {
      opts = opts || {};
      customHeader = customHeader || {};
      var postBody = null;
      var pathParams = {};
      var queryParams = {
        'page': opts['page']
      };
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = PageShare;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/shares', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets all Shares (AppBundles and Activities) shared by this Forge app.
     * Gets all Shares (AppBundles and Activities) shared by this Forge app (shared to other  Forge apps for them to use).                Sharing of AppBundles and Activities is controlled via the use of &#39;aliases&#39;.
     * @param {Object} opts Optional parameters
     * @param {String} opts.page Used to get subsequent &#39;pages&#39; of data.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/PageShare}
     */

  }, {
    key: "getShares",
    value: function getShares(opts, customHeader) {
      return this.getSharesWithHttpInfo(opts, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Gets the status of a specific WorkItem.
     * Gets the status of a specific WorkItem.  Typically used to &#39;poll&#39; for              the completion of a WorkItem, but see the use of the &#39;onComplete&#39; argument for              an alternative that does not require &#39;polling&#39;.  WorkItem status is retained              for a limited period of time after the WorkItem completes.              Limits:              1. Retention period (LimitWorkItemRetentionPeriod).
     * @param {String} id 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/WorkItemStatus} and HTTP response
     */
    // Test: id,customHeader 

  }, {
    key: "getWorkitemStatusWithHttpInfo",
    value: function getWorkitemStatusWithHttpInfo(id, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling getWorkitemStatus");
      }

      var pathParams = {
        'id': id
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged', '3-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = WorkItemStatus;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/workitems/{id}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Gets the status of a specific WorkItem.
     * Gets the status of a specific WorkItem.  Typically used to &#39;poll&#39; for              the completion of a WorkItem, but see the use of the &#39;onComplete&#39; argument for              an alternative that does not require &#39;polling&#39;.  WorkItem status is retained              for a limited period of time after the WorkItem completes.              Limits:              1. Retention period (LimitWorkItemRetentionPeriod).
     * @param {String} id 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/WorkItemStatus}
     */

  }, {
    key: "getWorkitemStatus",
    value: function getWorkitemStatus(id, customHeader) {
      return this.getWorkitemStatusWithHttpInfo(id, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * 
     * Gets the health status by Engine or for all Engines (Inventor, AutoCAD ...).
     * @param {String} engine 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link 'String'} and HTTP response
     */
    // Test: engine,customHeader 

  }, {
    key: "healthStatusWithHttpInfo",
    value: function healthStatusWithHttpInfo(engine, customHeader) {
      customHeader = customHeader || {};
      var postBody = null; // verify the required parameter 'engine' is set

      if (engine === undefined || engine === null) {
        throw new Error("Missing the required parameter 'engine' when calling healthStatus");
      }

      var pathParams = {
        'engine': engine
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = null;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/health/{engine}', 'GET', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * 
     * Gets the health status by Engine or for all Engines (Inventor, AutoCAD ...).
     * @param {String} engine 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link 'String'}
     */

  }, {
    key: "healthStatus",
    value: function healthStatus(engine, customHeader) {
      return this.healthStatusWithHttpInfo(engine, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Modify alias details.
     * Modify alias details.
     * @param {String} id Name of Activity (unqualified).
     * @param {String} aliasId Name of alias.
     * @param {module:model/AliasPatch} alias Alias details to be modified.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Alias} and HTTP response
     */
    // Test: id,aliasId,alias,customHeader 

  }, {
    key: "modifyActivityAliasWithHttpInfo",
    value: function modifyActivityAliasWithHttpInfo(id, aliasId, alias, customHeader) {
      customHeader = customHeader || {};
      var postBody = alias; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling modifyActivityAlias");
      } // verify the required parameter 'aliasId' is set


      if (aliasId === undefined || aliasId === null) {
        throw new Error("Missing the required parameter 'aliasId' when calling modifyActivityAlias");
      } // verify the required parameter 'alias' is set


      if (alias === undefined || alias === null) {
        throw new Error("Missing the required parameter 'alias' when calling modifyActivityAlias");
      }

      var pathParams = {
        'id': id,
        'aliasId': aliasId
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Alias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/activities/{id}/aliases/{aliasId}', 'PATCH', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Modify alias details.
     * Modify alias details.
     * @param {String} id Name of Activity (unqualified).
     * @param {String} aliasId Name of alias.
     * @param {module:model/AliasPatch} alias Alias details to be modified.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Alias}
     */

  }, {
    key: "modifyActivityAlias",
    value: function modifyActivityAlias(id, aliasId, alias, customHeader) {
      return this.modifyActivityAliasWithHttpInfo(id, aliasId, alias, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Modify alias details.
     * Modify alias details.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {String} aliasId Name of alias.
     * @param {module:model/AliasPatch} alias Alias details to be modified.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/Alias} and HTTP response
     */
    // Test: id,aliasId,alias,customHeader 

  }, {
    key: "modifyAppBundleAliasWithHttpInfo",
    value: function modifyAppBundleAliasWithHttpInfo(id, aliasId, alias, customHeader) {
      customHeader = customHeader || {};
      var postBody = alias; // verify the required parameter 'id' is set

      if (id === undefined || id === null) {
        throw new Error("Missing the required parameter 'id' when calling modifyAppBundleAlias");
      } // verify the required parameter 'aliasId' is set


      if (aliasId === undefined || aliasId === null) {
        throw new Error("Missing the required parameter 'aliasId' when calling modifyAppBundleAlias");
      } // verify the required parameter 'alias' is set


      if (alias === undefined || alias === null) {
        throw new Error("Missing the required parameter 'alias' when calling modifyAppBundleAlias");
      }

      var pathParams = {
        'id': id,
        'aliasId': aliasId
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = Alias;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/appbundles/{id}/aliases/{aliasId}', 'PATCH', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Modify alias details.
     * Modify alias details.
     * @param {String} id Name of AppBundle (unqualified).
     * @param {String} aliasId Name of alias.
     * @param {module:model/AliasPatch} alias Alias details to be modified.
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/Alias}
     */

  }, {
    key: "modifyAppBundleAlias",
    value: function modifyAppBundleAlias(id, aliasId, alias, customHeader) {
      return this.modifyAppBundleAliasWithHttpInfo(id, aliasId, alias, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
    /**
     * Creates a new service limits configuration or updates exiting.
     * Creates a new service limits configuration or updates exiting.
     * @param {String} owner The user to associate the configuration to.
     * @param {module:model/ServiceLimit} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with an object containing data of type {@link module:model/ServiceLimit} and HTTP response
     */
    // Test: owner,item,customHeader 

  }, {
    key: "modifyServiceLimitsWithHttpInfo",
    value: function modifyServiceLimitsWithHttpInfo(owner, item, customHeader) {
      customHeader = customHeader || {};
      var postBody = item; // verify the required parameter 'owner' is set

      if (owner === undefined || owner === null) {
        throw new Error("Missing the required parameter 'owner' when calling modifyServiceLimits");
      } // verify the required parameter 'item' is set


      if (item === undefined || item === null) {
        throw new Error("Missing the required parameter 'item' when calling modifyServiceLimits");
      }

      var pathParams = {
        'owner': owner
      };
      var queryParams = {};
      var headerParams = {};
      headerParams = Object.assign(headerParams, customHeader);
      var formParams = {};
      var authNames = ['2-legged'];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = ServiceLimit;

      if (returnType === null) {
        returnType = contentTypes[0];
      }

      return this.apiClient.callApi('/v3/servicelimits/{owner}', 'PUT', pathParams, queryParams, headerParams, formParams, postBody, authNames, contentTypes, accepts, returnType);
    }
    /**
     * Creates a new service limits configuration or updates exiting.
     * Creates a new service limits configuration or updates exiting.
     * @param {String} owner The user to associate the configuration to.
     * @param {module:model/ServiceLimit} item 
     * @return {Promise} a {@link https://www.promisejs.org/|Promise}, with data of type {@link module:model/ServiceLimit}
     */

  }, {
    key: "modifyServiceLimits",
    value: function modifyServiceLimits(owner, item, customHeader) {
      return this.modifyServiceLimitsWithHttpInfo(owner, item, customHeader).then(function (response_and_data) {
        return response_and_data.data;
      });
    }
  }]);

  return AutodeskForgeDesignAutomationApi;
}();

/**
 * autodesk.forge.designautomation
 * Asynchronous Node.js library for the Autodesk Forge Design Automation v3 implementation.
 *
 * OpenAPI spec version: 3.0.3
 * Contact: forge.help@autodesk.com
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 */

exports.AutodeskForgeDesignAutomationClient = AutodeskForgeDesignAutomationClient;
exports.Activity = Activity;
exports.Alias = Alias;
exports.AliasPatch = AliasPatch;
exports.AppBundle = AppBundle;
exports.BackendLimits = BackendLimits;
exports.Engine = Engine;
exports.FrontendLimits = FrontendLimits;
exports.IArgument = IArgument;
exports.ISetting = ISetting;
exports.NicknameRecord = NicknameRecord;
exports.PageAlias = PageAlias;
exports.PageInt32 = PageInt32;
exports.PageShare = PageShare;
exports.PageString = PageString;
exports.Parameter = Parameter;
exports.PublicKey = PublicKey;
exports.ServiceLimit = ServiceLimit;
exports.Share = Share;
exports.ShareType = ShareType;
exports.SignedUrl = SignedUrl;
exports.Statistics = Statistics;
exports.Status = Status;
exports.UploadAppBundleParameters = UploadAppBundleParameters;
exports.Verb = Verb;
exports.WorkItem = WorkItem;
exports.WorkItemSignatures = WorkItemSignatures;
exports.WorkItemStatus = WorkItemStatus;
exports.StringArgument = StringArgument;
exports.StringSetting = StringSetting;
exports.UrlSetting = UrlSetting;
exports.XrefTreeArgument = XrefTreeArgument;
exports.AutodeskForgeDesignAutomationApi = AutodeskForgeDesignAutomationApi;
//# sourceMappingURL=AutodeskForgeDesignAutomation.cjs.js.map
