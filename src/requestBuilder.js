import { submit_fetch } from './fetchUtil';
import urlBuilder from './urlBuilder';

export default Object.assign( urlBuilder, {
    method: 'GET',
    header: {},
    body: null,
    /**
     * Replace the header with a new object;
     * @param {object} newheader - header for the request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    set_header: function( newheader = {} ) {
        return this.setter( 'header', newheader );
    },
    /**
     * Add data to the request header. Does not overwrite the header.
     * If the first parameter is an object, that object will be spread into the header object, the second parameter will be ignored.
     * @param {string|object} key - key or object to be added to header
     * @param {*} value - value to be added to header
     * @return {ReqBuilder} - returns RequestBuilder
     */
    add_to_header: function( key, value ) {
        if ( typeof key === 'object' ) {
            this.header = Object.assign( this.header, key ) // { ...this.header, ...key };
            this.debug_log( 'header', key );
        }
        else {
            this.header[ key ] = value;
            this.debug_log( 'header.' + key, value );
        }

        return this._build_req();
    },
    /**
     * Replace the body with a new object;
     * @param {object} newBody - body for the request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    set_body: function( newBody = {} ) {
        return this.setter( 'body', newBody );
    },
    /**
     * Add data to the request body. Does not overwrite the body.
     * If the first parameter is an object, that object will be spread into the body object, the second parameter will be ignored.
     * @param {string|object} key - key or object to be added to body
     * @param {*} value - value to be added to body
     * @return {ReqBuilder} - returns RequestBuilder
     */
    add_to_body: function( key, value ) {
        if ( typeof key === 'object' ) {
            this.body = Object.assign( this.body, key ) // { ...this.body, ...key };
            this.debug_log( 'body', key );
        }
        else {
            this.body[ key ] = value;
            this.debug_log( 'body.' + key, value );
        }

        return this._build_req();
    },
    /**
     * Make a GET request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    get: function() {
        return this.verb( 'GET' );
    },
    /**
     * Make a PUT request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    put: function() {
        return this.verb( 'PUT' );
    },
    /**
     * Make a POST request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    post: function() {
        return this.verb( 'POST' );
    },
    /**
     * Make a DELETE request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    delete: function() {
        return this.verb( 'DELETE' );
    },
    /**
     * Set the method/verb for the request and make the request
     * @param {string} method - verb/method you want to use
     * @return {ReqBuilder} - returns RequestBuilder
     */
    verb: function( method ) {
        this.setter( 'method', method );
        return this.send();
    },
    /**
     * Get all parts of the request as an object
     * @return {{url: string, header: object, method: string, body: object}} - Request as an object
     */
    get_request_obj: function() {
        return {
            url: this.build_url(),
            header: this.header,
            method: this.method,
            body: this.body
        };
    },
    /**
     * Builds the request URL and submits the request
     * @param {boolean} testing - debug flag, defaults to false
     * @return {Promise.<string>} - result of fetch
     */
    send: function( testing = false ) { // Can I, should I clear data
        const { url, header, method, body } = this.get_request_obj();

        if ( this._debug || testing ) console.log( { url, header, method, body } );
        if ( testing ) {
            return Promise.resolve( { _id: 'testing' } );
        } else {
            return submit_fetch( url, header, method, body  );
        }
    }
} );
