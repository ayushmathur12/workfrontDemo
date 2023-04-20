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
export interface IHttpOptions {
    path?: string;
    method?: string;
    url: string;
    alwaysUseGet?: boolean;
    headers: {
        sessionID?: string;
        'X-XSRF-TOKEN'?: string;
        apiKey?: string;
    };
}
export interface IApiConfig {
    url: string;
    version?: string;
    alwaysUseGet?: boolean;
    apiKey?: string;
    headers?: {
        [key: string]: string;
    };
}
export type TFields = string | string[];
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
export declare class Api {
    static Methods: {
        GET: string;
        PUT: string;
        DELETE: string;
        POST: string;
    };
    _httpOptions: IHttpOptions;
    serverAcceptsJSON: boolean;
    _uriGenerationMode: boolean;
    constructor(config: IApiConfig);
    /**
     * Used to obtain an API key
     * @memberOf Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @param {String} subdomain    Sub-domain to use
     * @return {Promise}    A promise which will resolved with API key if everything went ok and rejected otherwise
     */
    getApiKey(username: string, password: string, subdomain?: string): Promise<string>;
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
    copy(objCode: string, objID: string, updates: object, fields?: TFields, options?: string[]): Promise<any>;
    /**
     * Used to retrieve number of objects matching given search criteria
     * @memberOf Api
     * @param {String} objCode
     * @param {[Object]} query    An object with search criteria
     * @return {Promise}
     */
    count(objCode: string, query?: object): Promise<number>;
    /**
     * Invalidates the current API key.
     * Call this to be able to retrieve a new one using getApiKey().
     * @memberOf Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    clearApiKey(): Promise<void>;
    /**
     * Creates a new object.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} params    Values of fields to be set for the new object. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields of newly created object to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with the ID and any other specified fields of newly created object
     */
    create(objCode: string, params: any, fields?: TFields): Promise<any>;
    /**
     * Edits an existing object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object to modify
     * @param {Object} updates    Which fields to set. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    edit(objCode: string, objID: string, updates: any, fields?: TFields): Promise<any>;
    /**
     * Edit multiple existing objects
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Array} updates    Array of fields for each object to be edited. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    editMultiple(objCode: string, updates: any[], fields?: TFields): Promise<any>;
    /**
     * Executes an action for the given object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|null} objID    ID of object. Optional, pass null or undefined to omit
     * @param {String} action    An action to execute. A list of allowed actions are available within the {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [actionArgs]    Optional. Arguments for the action. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    execute(objCode: string, objID: string | null, action: string, actionArgs?: object): Promise<any>;
    /**
     * Used for retrieve an object or multiple objects.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String|Array} objIDs    Either one or multiple object ids
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    get(objCode: string, objIDs: string | string[], fields?: TFields): Promise<any>;
    /**
     * Logs in into Workfront. Should be a first call to Workfront API.
     * Other calls should be made after this one will be completed.
     * @memberOf Api
     * @param {String} username    A username in Workfront
     * @param {String} password    Password to use
     * @param {String} subdomain    Sub-domain to use
     * @return {Promise}    A promise which will resolved with logged in user data if everything went ok and rejected otherwise
     */
    login(username: string, password: string, subdomain?: string): Promise<any>;
    /**
     * Logs out from Workfront
     * @memberOf Api
     * @return {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    logout(): Promise<void>;
    /**
     * Retrieves API metadata for an object.
     * @memberOf Api
     * @param {String} [objCode]    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}. If omitted will return list of objects available in API.
     * @param {String|String[]} fields    Which fields to return.
     * @return {Promise}    A promise which will resolved with object metadata if everything went ok and rejected otherwise
     */
    metadata(objCode?: string, fields?: TFields): Promise<any>;
    /**
     * Executes a named query for the given obj code
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} query    A query to execute. A list of allowed named queries are available within the {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} under "actions" for each object.
     * @param {Object} [queryArgs]    Optional. Arguments for the action. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of valid arguments
     * @param {String|String[]} fields    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @returns {Promise}    A promise which will resolved with received data if everything went ok and rejected with error info otherwise
     */
    namedQuery(objCode: string, query: string, queryArgs?: object, fields?: TFields): Promise<any>;
    /**
     * Deletes an object
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {String} objID    ID of object
     * @param {Boolean} [bForce]    Pass true to cause the server to remove the specified data and its dependants
     * @returns {Promise}    A promise which will resolved if everything went ok and rejected otherwise
     */
    remove(objCode: string, objID: string, bForce?: boolean): Promise<void>;
    /**
     * Performs report request, where only the aggregate of some field is desired, with one or more groupings.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} query    An object with search criteria and aggregate functions
     * @param {Boolean} [useHttpPost=false] Whenever to use POST to send query params
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    report(objCode: string, query: object, useHttpPost?: boolean): Promise<any>;
    /**
     * Do the request using Fetch API.
     * @memberOf Api
     * @param {String} path     URI path where the request calls
     * @param {Object} params   An object with params
     * @param {Object} [fields] Fields to query for the request
     * @param {String} [method=GET] The method which the request will do (GET|POST|PUT|DELETE)
     * @return {Promise}    A promise which will resolved with results if everything went ok and rejected otherwise
     */
    request(path: string, params: any, fields?: TFields, method?: string): Promise<any>;
    /**
     * Used for object retrieval by multiple search criteria.
     * @memberOf Api
     * @param {String} objCode    One of object codes from {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer}
     * @param {Object} [query]    An object with search criteria
     * @param {String|String[]} [fields]    Which fields to return. See {@link https://developers.workfront.com/api-docs/api-explorer/|Workfront API Explorer} for the list of available fields for the given objCode.
     * @param {Boolean} [useHttpPost=false] Whenever to use POST to send query params
     * @return {Promise}    A promise which will resolved with search results if everything went ok and rejected otherwise
     */
    search(objCode: string, query?: object, fields?: TFields, useHttpPost?: boolean): Promise<any>;
    /**
     * Performs batch call to the API.
     * @memberOf Api
     *
     * @param {(batchApi: IBatchApi) => string[]} uriCollector   A function which will be invoked with api instance.
     *     This instance is special, as all methods there return a url string instead of making a backend call.
     *     `uriCollector` should return an array of uris to be executed in batch.
     *     So, for example, one may return `[batchApi.metadata(), batchApi.count(...)]` from `uriCollector`.
     *     That will mean `call metadata() method` and then `call count() method`.
     *
     * @param {boolean} isAtomic    Pass true if you want all operations to happen in the same transaction.
     *     There is a limitation, however. Atomic batch operations can only return success or error.
     *
     * @param {boolean} isConcurrent  Requests to the DB are made asynchronously.
     *
     * @returns {Promise<any[] | void>}
     */
    batch(uriCollector: (batchApi: IBatchApi) => string[], isAtomic?: false, isConcurrent?: boolean): Promise<any[]>;
    batch(uriCollector: (batchApi: IBatchApi) => string[], isAtomic?: true, isConcurrent?: boolean): Promise<void>;
    /**
     * Sets a current API key for future requests
     * @memberOf Api
     * @return {string} returns the given api key value
     */
    setApiKey(apiKey: any): any;
    /**
     * Sets a sessionID in the headers or removes sessionID if passed argument is undefined
     * @memberOf Api
     * @param {String|undefined} sessionID   sessionID to set
     */
    setSessionID(sessionID: any): void;
    /**
     * Sets a 'X-XSRF-TOKEN' in the headers or removes 'X-XSRF-TOKEN' if passed argument is undefined
     * @memberOf Api
     * @param {String|undefined} xsrfToken   X-XSRF-TOKEN to set
     */
    setXSRFToken(xsrfToken?: string): void;
    uploadFileContent(fileContent: any, filename: string): Promise<any>;
    protected getHeaders(): Headers;
    private getFields;
    private getOptions;
    private populateQueryStringAndBodyParams;
}
export interface IBatchApi {
    copy: (objCode: string, objID: string, updates: object, fields?: TFields, options?: string[]) => string;
    count: (objCode: string, query?: object) => string;
    create: (objCode: string, params: any, fields?: TFields) => string;
    edit: (objCode: string, objID: string, updates: any, fields?: TFields) => string;
    editMultiple: (objCode: string, updates: any[], fields?: TFields) => string;
    execute: (objCode: string, objID: string | null, action: string, actionArgs?: object) => string;
    get: (objCode: string, objIDs: string | string[], fields?: TFields) => string;
    metadata: (objCode?: string, fields?: TFields) => string;
    namedQuery: (objCode: string, query: string, queryArgs?: object, fields?: TFields) => string;
    remove: (objCode: string, objID: string, bForce?: boolean) => string;
    report: (objCode: string, query: object) => string;
    request: (path: string, params: any, fields?: TFields, method?: string) => string;
    search: (objCode: string, query?: object, fields?: TFields) => string;
}
export type TSuccessHandler<T = any> = (response: any) => Promise<T>;
export type TFailureHandler = (err: any) => never;
export declare function makeFetchCall(url: string, fetchOptions: RequestInit): Promise<any>;
export declare const ResponseHandler: {
    success: TSuccessHandler<any>;
    failure: TFailureHandler;
};
