import { submit_fetch } from './fetchUtil';
import urlBuilder from './urlBuilder';

export default Object.assign( urlBuilder, {
    method: 'GET',
    header: {},
    body: null,
    _testing: false,
    /**
     * Replace the header with a new object;
     * @param {object} newheader - header for the request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    setHeader: function( newheader = {} ) {
        if ( typeof newheader !== 'object' || newheader.length ) throw new Error( `Header ${newheader} is not an object` )
        return this._update( 'header', newheader );
    },
    /**
     * Add data to the request header. Does not overwrite the header.
     * If the first parameter is an object, that object will be spread into the header object, the second parameter will be ignored.
     * @param {string|object} key - key or object to be added to header
     * @param {*} value - value to be added to header
     * @return {ReqBuilder} - returns RequestBuilder
     */
    updateHeader: function( key, value ) {
        const header = typeof key === 'object' ?
            Object.assign( this.header, key )
            : Object.assign( this.header, { [ key ]: value } );

        return this._update( 'header', header );
    },
    /**
     * Replace the body with a new object;
     * @param {object} newBody - body for the request
     * @return {ReqBuilder} - returns RequestBuilder
     */
    setBody: function( newBody = {} ) {
        return this._update( 'body', newBody );
    },
    /**
     * Add data to the request body. Does not overwrite the body.
     * If the first parameter is an object, that object will be spread into the body object, the second parameter will be ignored.
     * @param {string|object} key - key or object to be added to body
     * @param {*} value - value to be added to body
     * @return {ReqBuilder} - returns RequestBuilder
     */
    updateBody: function( key, value ) {
        const existingBody = this.body || {}
        const body = typeof key === 'object' ?
            Object.assign( existingBody, key )
            : Object.assign( existingBody, { [ key ]: value } );

        return this._update( 'body', body );
    },
    /**
     * Set the method/verb for the request and make the request
     * @param {string} method - verb/method you want to use
     * @return {ReqBuilder} - returns RequestBuilder
     */
    verb: function( method ) {
        this._update( 'method', method );
        return this.send();
    },
    /**
     * Make a GET request
     * @return {ReqBuilder} - returns RequestBuilder
     */    get: function() {
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
     * Get all parts of the request as an object
     * @return {{url: string, header: object, method: string, body: object}} - Request as an object
     */
    getRequestObj: function() {
        return {
            url: this.buildUrl(),
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
        const { url, header, method, body } = this.getRequestObj();

        if ( this._debugLevel ) console.log( { url, header, method, body } );
        if ( this._testing ) {
            return Promise.resolve( { _id: 'testing' } );
        } else {
            return submit_fetch( url, header, method, body  );
        }
    },

    then: function ( ...args ) {
        let verb = 'get';

        if ( args.length > 1 && typeof args[ 1 ] === 'string' ) {
            verb = args.shift();
        }
        
        return this[ verb ]().then( ...args )
    }
} );
