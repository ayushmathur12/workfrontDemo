(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Workfront = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * Copyright 2016 Workfront
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Prefix for constants.
     * @readonly
     * @type {String}
     */
    var INTERNAL_PREFIX = '$$';

    /**
     * Copyright 2015 Workfront
     *
     * Licensed under the Apache License, Version 2.0 (the "License")
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */
    /**
     * Configuration for the Api constructor
     * @typedef {Object} config
     * @property {String} url - Required. A url to Workfront server (for example: http://localhost:8080)
     * @property {String} [version=internal] - Which version of api to use. At the moment of writing can be 2.0, 3.0, ..., 8.0. Pass 'unsupported' to use Workfront latest API (maybe unstable)
     * @property {Boolean} [alwaysUseGet=false] - Will cause the api to make every request as a GET with params in the query string and add method=DESIRED_METHOD_TYPE in the query string. Some Workfront urls will have issues with PUT and DELETE calls if this value is false
     * @property {String} [apiKey] - It is used to pass apiKey with every api request headers
     * @property {Object} [headers] - An key-value object that sets custom headers (for example: {'user-agent': DESIRED_USER_AGENT_NAME})
     */
    /**
     * Creates new Api instance.
     * @param {Object} config   An object with the following keys:<br/>
     * @constructor
     */
    var Api = /** @class */ (function () {
        function Api(config) {
            var _a;
            this.serverAcceptsJSON = true;
            this._uriGenerationMode = false;
            this._httpOptions = {
                url: config.url,
                alwaysUseGet: config.alwaysUseGet,
                headers: config.headers || {},
            };
            if (config.apiKey) {
                this._httpOptions.headers.apiKey = config.apiKey;
            }
            // Append version to path if provided
            var path;
            var version = (_a = config.version, _a === void 0 ? 'internal' : _a);
            if (['internal', 'unsupported', 'asp'].indexOf(version) >= 0) {
                path = '/attask/api-' + version;
            }
            else {
                path = '/attask/api/v' + version;
                if (version === '2.0' || version === '3.0' || version === '4.0') {
                    this.serverAcceptsJSON = false;
                }
            }
            this._httpOptions.path = path;
        }
        /**
         * Used to obtain an API key
         * @memberOf Api
         * @param {String} username    A username in Workfront
         * @param {String} password    Password to use
         * @param {String} subdomain    Sub-domain to use
         * @return {Promise}    A promise which will resolved with API key if everything went ok and rejected otherwise
         */
        Api.prototype.getApiKey = function (username, password, subdomain) {
            var _this = this;
            var loginParams = {
                username: username,
                password: password,
            };
            if (subdomain !== undefined) {
                loginParams['subdomain'] = subdomain;
            }
            return new Promise(function (resolve, reject) {
                if (typeof _this._httpOptions.headers.apiKey !== 'undefined') {
                    resolve(_this._httpOptions.headers.apiKey);
                }
                else {
                    var req = _this.execute('USER', null, 'getApiKey', loginParams);
                    req.then(function (getApiKeyData) {
                        if (getApiKeyData.result === '') {
                            var req2 = _this.execute('USER', null, 'generateApiKey', loginParams);
                            req2.then(function (generateApiKeyData) {
                                _this._httpOptions.headers.apiKey = generateApiKeyData.result;
                                resolve(_this._httpOptions.headers.apiKey);
                            }, reject);
                        }
                        else {
                            _this._httpOptions.headers.apiKey = getApiKeyData.result;
                            resolve(_this._httpOptions.headers.apiKey);
                        }
                    }, reject);
                }
            });
        };
        /**
         * Copies an existing object with making changes on a copy.
         * Copying is supported only for some objects. The {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} page displays which objects support the Copy action.
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {String} objID    ID of object to copy
         * @param {Object} updates    Which fields to set on copied object. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @param {String[]} options    A list of options that are attached to the copy request (object specific)
         * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
         */
        Api.prototype.copy = function (objCode, objID, updates, fields, options) {
            var params = {
                copySourceID: objID,
            };
            if (updates) {
                params.updates = JSON.stringify(updates);
            }
            if (options) {
                params.options = JSON.stringify(options);
            }
            return this.request(objCode, params, fields, Api.Methods.POST);
        };
        /**
         * Used to retrieve number of objects matching given search criteria
         * @memberOf Api
         * @param {String} objCode
         * @param {[Object]} query    An object with search criteria
         * @return {Promise}
         */
        Api.prototype.count = function (objCode, query) {
            var req = this.request(objCode + '/count', query, null, Api.Methods.GET);
            if (this._uriGenerationMode) {
                return req;
            }
            return req.then(function (data) {
                return data.count;
            });
        };
        /**
         * Invalidates the current API key.
         * Call this to be able to retrieve a new one using getApiKey().
         * @memberOf Api
         * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
         */
        Api.prototype.clearApiKey = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var req = _this.execute('USER', null, 'clearApiKey');
                req.then(function (result) {
                    if (result) {
                        delete _this._httpOptions.headers.apiKey;
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
        };
        /**
         * Creates a new object.
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {Object} params    Values of fields to be set for the new object. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @param {String|String[]} [fields]    Which fields of newly created object to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @returns {Promise}    A promise which will resolved with the ID and any other specified fields of newly created object
         */
        Api.prototype.create = function (objCode, params, fields) {
            if (params.hasOwnProperty('updates')) {
                return this.request(objCode, params, fields, Api.Methods.POST);
            }
            return this.request(objCode, { updates: params }, fields, Api.Methods.POST);
        };
        /**
         * Edits an existing object
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {String} objID    ID of object to modify
         * @param {Object} updates    Which fields to set. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
         */
        Api.prototype.edit = function (objCode, objID, updates, fields) {
            if (updates.hasOwnProperty('updates')) {
                return this.request(objCode + '/' + objID, updates, fields, Api.Methods.PUT);
            }
            return this.request(objCode + '/' + objID, { updates: updates }, fields, Api.Methods.PUT);
        };
        /**
         * Edit multiple existing objects
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {Array} updates    Array of fields for each object to be edited. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
         */
        Api.prototype.editMultiple = function (objCode, updates, fields) {
            return this.request(objCode, { updates: updates }, fields, Api.Methods.PUT);
        };
        /**
         * Executes an action for the given object
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {String|null} objID    ID of object. Optional, pass null or undefined to omit
         * @param {String} action    An action to execute. A list of allowed actions are available within the {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
         * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
         * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
         */
        Api.prototype.execute = function (objCode, objID, action, actionArgs) {
            var endPoint = objCode;
            var params = { method: Api.Methods.PUT };
            if (objID) {
                endPoint += '/' + objID + '/' + action;
            }
            else {
                params.action = action;
            }
            if (actionArgs) {
                params = __assign(__assign({}, params), actionArgs);
            }
            return this.request(endPoint, params, null, Api.Methods.POST);
        };
        /**
         * Used for retrieve an object or multiple objects.
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {String|Array} objIDs    Either one or multiple object ids
         * @param {String|String[]} fields    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
         */
        Api.prototype.get = function (objCode, objIDs, fields) {
            if (typeof objIDs === 'string') {
                objIDs = [objIDs];
            }
            var endPoint = objCode, params = null;
            if (objIDs.length === 1) {
                if (objIDs[0].indexOf(INTERNAL_PREFIX) === 0) {
                    params = { id: objIDs[0] };
                }
                else {
                    endPoint += '/' + objIDs[0];
                }
            }
            else {
                params = { id: objIDs };
            }
            return this.request(endPoint, params, fields, Api.Methods.GET);
        };
        /**
         * Logs in into Workfront. Should be a first call to Workfront API.
         * Other calls should be made after this one will be completed.
         * @memberOf Api
         * @param {String} username    A username in Workfront
         * @param {String} password    Password to use
         * @param {String} subdomain    Sub-domain to use
         * @return {Promise}    A promise which will resolved with logged in user data if everything went ok and rejected otherwise
         */
        Api.prototype.login = function (username, password, subdomain) {
            var _this = this;
            var params = { username: username, password: password };
            if (subdomain !== undefined) {
                params['subdomain'] = subdomain;
            }
            var req = this.request('login', params, null, Api.Methods.POST);
            return req.then(function (data) {
                _this.setSessionID(data.sessionID);
                return data;
            });
        };
        /**
         * Logs out from Workfront
         * @memberOf Api
         * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
         */
        Api.prototype.logout = function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                var req = _this.request('logout', null, null, Api.Methods.GET);
                req.then(function (result) {
                    if (result && result.success) {
                        delete _this._httpOptions.headers['X-XSRF-TOKEN'];
                        delete _this._httpOptions.headers.sessionID;
                        resolve();
                    }
                    else {
                        reject();
                    }
                });
            });
        };
        /**
         * Retrieves API metadata for an object.
         * @memberOf Api
         * @param {String} [objCode]    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}. If omitted will return list of objects available in API.
         * @param {String|String[]} fields    Which fields to return.
         * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
         */
        Api.prototype.metadata = function (objCode, fields) {
            var path = '/metadata';
            if (objCode) {
                path = objCode + path;
            }
            return this.request(path, null, fields, Api.Methods.GET);
        };
        /**
         * Executes a named query for the given obj code
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {String} query    A query to execute. A list of allowed named queries are available within the {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
         * @param {Object} [queryArgs]    Optional. Arguments for the action. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
         * @param {String|String[]} fields    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @returns {Promise}    A promise which will resolved with received data if everything went ok and rejected with error info otherwise
         */
        Api.prototype.namedQuery = function (objCode, query, queryArgs, fields) {
            return this.request(objCode + '/' + query, queryArgs, fields, Api.Methods.GET);
        };
        /**
         * Deletes an object
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {String} objID    ID of object
         * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
         * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
         */
        Api.prototype.remove = function (objCode, objID, bForce) {
            var params = bForce ? { force: true } : null;
            var req = this.request(objCode + '/' + objID, params, null, Api.Methods.DELETE);
            if (this._uriGenerationMode) {
                return req;
            }
            else {
                return new Promise(function (resolve, reject) {
                    req.then(function (result) {
                        if (result && result.success) {
                            resolve();
                        }
                        else {
                            reject();
                        }
                    }, reject);
                });
            }
        };
        /**
         * Performs report request, where only the aggregate of some field is desired, with one or more groupings.
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {Object} query    An object with search criteria and aggregate functions
         * @param {Boolean} [useHttpPost=false] Whenever to use POST to send query params
         * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
         */
        Api.prototype.report = function (objCode, query, useHttpPost) {
            if (useHttpPost === void 0) { useHttpPost = false; }
            var reportQuery, method;
            if (useHttpPost) {
                reportQuery = __assign(__assign({}, query), { method: Api.Methods.GET });
                method = Api.Methods.POST;
            }
            else {
                reportQuery = query;
                method = Api.Methods.GET;
            }
            return this.request(objCode + '/report', reportQuery, null, method);
        };
        /**
         * Do the request using Fetch API.
         * @memberOf Api
         * @param {String} path     URI path where the request calls
         * @param {Object} params   An object with params
         * @param {Object} [fields] Fields to query for the request
         * @param {String} [method=GET] The method which the request will do (GET|POST|PUT|DELETE)
         * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
         */
        Api.prototype.request = function (path, params, fields, method) {
            var _a;
            if (fields === void 0) { fields = []; }
            if (method === void 0) { method = Api.Methods.GET; }
            var clonedParams = __assign({}, params);
            var options = this.getOptions(path, clonedParams, this._uriGenerationMode ? Api.Methods.GET : method);
            var stringifiedFields = this.getFields(fields);
            if (stringifiedFields) {
                clonedParams.fields = stringifiedFields;
            }
            var headers = this.getHeaders();
            var bodyParams = (_a = this.populateQueryStringAndBodyParams(clonedParams, options), _a.bodyParams), queryString = _a.queryString, contentType = _a.contentType;
            if (contentType) {
                headers.append('Content-Type', contentType);
            }
            if (this._uriGenerationMode) {
                var appendGetMethod = '';
                if (queryString.indexOf('method=') === -1) {
                    appendGetMethod = (queryString === '' ? '?' : '&') + 'method=' + Api.Methods.GET;
                }
                // @ts-ignore-line
                return path + queryString + appendGetMethod;
            }
            return makeFetchCall(options.url + options.path + queryString, {
                headers: headers,
                body: bodyParams,
                method: options.method,
            });
        };
        /**
         * Used for object retrieval by multiple search criteria.
         * @memberOf Api
         * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
         * @param {Object} [query]    An object with search criteria
         * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
         * @param {Boolean} [useHttpPost=false] Whenever to use POST to send query params
         * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
         */
        Api.prototype.search = function (objCode, query, fields, useHttpPost) {
            if (useHttpPost === void 0) { useHttpPost = false; }
            var searchQuery, method;
            if (useHttpPost) {
                searchQuery = __assign(__assign({}, query), { method: Api.Methods.GET });
                method = Api.Methods.POST;
            }
            else {
                searchQuery = query;
                method = Api.Methods.GET;
            }
            return this.request(objCode + '/search', searchQuery, fields, method);
        };
        Api.prototype.batch = function (uriCollector, isAtomic, isConcurrent) {
            var batchApi = batchApiFactory(this);
            var uris = uriCollector(batchApi);
            if (uris.length === 0) {
                return Promise.resolve(isAtomic ? undefined : []);
            }
            var req = this.request('/batch', {
                atomic: !!isAtomic,
                uri: uris,
                concurrent: !!isConcurrent,
            }, undefined, Api.Methods.POST);
            if (isAtomic) {
                return req.then(function (result) {
                    if (result && result.success) {
                        return undefined;
                    }
                    throw new Error();
                });
            }
            return req.then(function (results) {
                return results.map(function (resultItem) { return resultItem.data; });
            });
        };
        /**
         * Sets a current API key for future requests
         * @memberOf Api
         * @return {string} returns the given api key value
         */
        Api.prototype.setApiKey = function (apiKey) {
            return (this._httpOptions.headers.apiKey = apiKey);
        };
        /**
         * Sets a sessionID in the headers or removes sessionID if passed argument is undefined
         * @memberOf Api
         * @param {String|undefined} sessionID   sessionID to set
         */
        Api.prototype.setSessionID = function (sessionID) {
            if (sessionID) {
                this._httpOptions.headers.sessionID = sessionID;
            }
            else {
                delete this._httpOptions.headers.sessionID;
            }
        };
        /**
         * Sets a 'X-XSRF-TOKEN' in the headers or removes 'X-XSRF-TOKEN' if passed argument is undefined
         * @memberOf Api
         * @param {String|undefined} xsrfToken   X-XSRF-TOKEN to set
         */
        Api.prototype.setXSRFToken = function (xsrfToken) {
            if (xsrfToken) {
                this._httpOptions.headers['X-XSRF-TOKEN'] = xsrfToken;
            }
            else {
                delete this._httpOptions.headers['X-XSRF-TOKEN'];
            }
        };
        Api.prototype.uploadFileContent = function (fileContent, filename) {
            var data = new FormData();
            data.append('uploadedFile', fileContent, filename);
            return this.request('upload', data, null, Api.Methods.POST);
        };
        Api.prototype.getHeaders = function () {
            var headers = new Headers();
            headers.append('X-Requested-With', 'XMLHttpRequest');
            if (this._httpOptions.headers.sessionID) {
                headers.append('sessionID', this._httpOptions.headers.sessionID);
            }
            else if (this._httpOptions.headers['X-XSRF-TOKEN']) {
                headers.append('X-XSRF-TOKEN', this._httpOptions.headers['X-XSRF-TOKEN']);
            }
            else if (this._httpOptions.headers.apiKey) {
                headers.append('apiKey', this._httpOptions.headers.apiKey);
            }
            return headers;
        };
        Api.prototype.getFields = function (fields) {
            if (typeof fields === 'string') {
                return fields;
            }
            if (Array.isArray(fields)) {
                return fields.join(',');
            }
        };
        Api.prototype.getOptions = function (path, clonedParams, method) {
            var options = __assign({}, this._httpOptions);
            if (options.alwaysUseGet && path !== 'login') {
                clonedParams.method = method;
                options.method = Api.Methods.GET;
            }
            else {
                options.method = method;
            }
            if (path.indexOf('/') !== 0) {
                path = '/' + path;
            }
            options.path = this._httpOptions.path + path;
            return options;
        };
        Api.prototype.populateQueryStringAndBodyParams = function (clonedParams, options) {
            var bodyParams = null, queryString = '', contentType = null;
            if (typeof FormData !== 'undefined' && clonedParams instanceof FormData) {
                bodyParams = clonedParams;
            }
            else if (this.serverAcceptsJSON &&
                typeof clonedParams.updates === 'object' &&
                (options.method === Api.Methods.POST || options.method === Api.Methods.PUT)) {
                contentType = 'application/json';
                bodyParams = JSON.stringify(clonedParams.updates);
                delete clonedParams.updates;
                var qs = queryStringify(clonedParams);
                if (qs) {
                    queryString = '?' + qs;
                }
            }
            else {
                contentType = 'application/x-www-form-urlencoded';
                if (clonedParams.hasOwnProperty('updates') &&
                    typeof clonedParams.updates !== 'string') {
                    clonedParams.updates = JSON.stringify(clonedParams.updates);
                }
                bodyParams = queryStringify(clonedParams);
                if (options.method === Api.Methods.GET || options.method === Api.Methods.DELETE) {
                    if (bodyParams) {
                        queryString = '?' + bodyParams;
                    }
                    bodyParams = null;
                }
            }
            return {
                bodyParams: bodyParams,
                queryString: queryString,
                contentType: contentType,
            };
        };
        Api.Methods = {
            GET: 'GET',
            PUT: 'PUT',
            DELETE: 'DELETE',
            POST: 'POST',
        };
        return Api;
    }());
    var queryStringify = function (params) {
        return Object.keys(params)
            .reduce(function (a, k) {
            if (Array.isArray(params[k])) {
                params[k].forEach(function (param) {
                    a.push(k + '=' + encodeURIComponent(param));
                });
            }
            else {
                a.push(k + '=' + encodeURIComponent(params[k]));
            }
            return a;
        }, [])
            .join('&');
    };
    function batchApiFactory(api) {
        var apiClone = Object.create(api);
        apiClone._uriGenerationMode = true;
        return {
            copy: function (objCode, objID, updates, fields, options) {
                return apiClone.copy(objCode, objID, updates, fields, options);
            },
            count: function (objCode, query) {
                return apiClone.count(objCode, query);
            },
            create: function (objCode, params, fields) {
                return apiClone.create(objCode, params, fields);
            },
            edit: function (objCode, objID, updates, fields) {
                return apiClone.edit(objCode, objID, updates, fields);
            },
            editMultiple: function (objCode, updates, fields) {
                return apiClone.editMultiple(objCode, updates, fields);
            },
            execute: function (objCode, objID, action, actionArgs) {
                return apiClone.execute(objCode, objID, action, actionArgs);
            },
            get: function (objCode, objIDs, fields) {
                return apiClone.get(objCode, objIDs, fields);
            },
            metadata: function (objCode, fields) {
                return apiClone.metadata(objCode, fields);
            },
            namedQuery: function (objCode, query, queryArgs, fields) {
                return apiClone.namedQuery(objCode, query, queryArgs, fields);
            },
            remove: function (objCode, objID, bForce) {
                return apiClone.remove(objCode, objID, bForce);
            },
            report: function (objCode, query) {
                return apiClone.report(objCode, query);
            },
            request: function (path, params, fields, method) {
                if (method === void 0) { method = Api.Methods.GET; }
                return apiClone.request(path, params, fields, method);
            },
            search: function (objCode, query, fields) {
                return apiClone.search(objCode, query, fields, false);
            },
        };
    }
    function makeFetchCall(url, fetchOptions) {
        return fetch(url, __assign(__assign({}, fetchOptions), { credentials: 'same-origin' })).then(ResponseHandler.success, ResponseHandler.failure);
    }
    var ResponseHandler = {
        success: function (response) {
            if (response.ok) {
                return response.json().then(function (data) {
                    if (data.error) {
                        throw {
                            status: response.status,
                            message: data.error.message,
                        };
                    }
                    return data.data;
                });
            }
            else {
                return response.json().then(function (data) {
                    throw {
                        status: response.status,
                        message: data.error.message,
                    };
                }, function () {
                    throw {
                        status: response.status,
                        message: response.statusText,
                    };
                });
            }
        },
        failure: function (err) {
            throw {
                message: err.message || err.statusText,
            };
        },
    };

    exports.Api = Api;
    exports.ResponseHandler = ResponseHandler;
    exports.makeFetchCall = makeFetchCall;

}));
//# sourceMappingURL=workfront-api.umd.js.map
