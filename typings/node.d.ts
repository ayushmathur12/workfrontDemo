/// <reference types="node" />
import 'isomorphic-fetch';
import { Readable } from 'stream';
import { Api as BaseApi, makeFetchCall, ResponseHandler } from './Api';
/**
 * Starting from version 2.0 API allows users to upload files.
 * The server will return the JSON data which includes 'handle' of uploaded file.
 * Returned 'handle' can be passed to create() method to create a new document.
 * This method is not available for browser execution environments and it is available only for Node.
 * @author Hovhannes Babayan <bhovhannes at gmail dot com>
 * @author Sassoun Derderian <citizen dot sas at gmail dot com>
 * @memberOf Api
 * @param {fs.ReadStream} stream    A readable stream with file contents
 * @param {String} filename Override the filename
 */
declare class NodeApi extends BaseApi {
    constructor(options: any);
    uploadFromStream(stream: Readable, filename: string): Promise<any>;
}
export { ResponseHandler, NodeApi, NodeApi as Api, makeFetchCall };
declare const _default: {
    NodeApi: typeof NodeApi;
    ResponseHandler: {
        success: import("./Api").TSuccessHandler<any>;
        failure: import("./Api").TFailureHandler;
    };
    Api: typeof NodeApi;
};
export default _default;
