import { submit_fetch } from './fetchUtil';

/**
 * Truncates a string longer than 10 characters to the first 8 characters followed by ..
 * @param {string} str - long string
 * @return {string} - truncated string
 */
export function truncate( str ) {
    if ( !str ) return '';
    return str.length > 10 ? str.substring( 0, 8 ) + '...' : str;
}

/**
 * Runs truncate function on every parameter in a url or entry in an array
 * @param {string} key - either empty when used in JSON.stringify or the string to be transforemd
 * @param {*} value - either the string to be transformed when used in JSON.stringify or nothing
 * @return {*} - if a string was passed in then the transformed string otherwise the value is returned
 *
 const x = "group/owners/590649f6c5b4c355d5b93eb5/members/8d05e918-b9d4-4886-a0da-167d54e6a79c/ef1382b5-486d-48a1-af76-52472d0dba0e/fb6c4ef3-d934-42e5-be78-5432f584835b/bb7ca9a8-a07d-4a2f-91a5-2c992c32e728/32bbb788-459a-4232-81ce-a9bb2f98add8"
 replacer( x ) => "group/owners/590649f6c5b4c355d5b93eb5/members/8d05e918-b9d4-4886-a0da-167d54e6a79c/ef1382b5-486d-48a1-af76-52472d0dba0e/fb6c4ef3-d934-42e5-be78-5432f584835b/bb7ca9a8-a07d-4a2f-91a5-2c992c32e728/32bbb788-459a-4232-81ce-a9bb2f98add8"

 let y = "8d05e918-b9d4-4886-a0da-167d54e6a79c/ef1382b5-486d-48a1-af76-52472d0dba0e/fb6c4ef3-d934-42e5-be78-5432f584835b/bb7ca9a8-a07d-4a2f-91a5-2c992c32e728/32bbb788-459a-4232-81ce-a9bb2f98add8"
 let z = [ { key: y }, { key: y } ];
 JSON.stringify( z, replacer ); => "[{"key":"8d05e918../ef1382b5../fb6c4ef3../bb7ca9a8../32bbb788.."},{"key":"8d05e918../ef1382b5../fb6c4ef3../bb7ca9a8../32bbb788.."}]"
 */
export function replacer( key, value = null ) {
    if ( key && !value ) value = key;
    if ( typeof value === 'number' ) {
        value = value.toString();
    }
    if ( typeof value === 'string' && value.length > 15 ) {
        return value.replace( /([^/]*)([,/])?/g, ( $0, $1, $2 ) => {
            $1 = $1 ? truncate( $1 ) : '';
            $2 = $2 || '';
            return $1 + $2;
        } );
    }
    return value;
}

export const urlBuilder = {
    _url: null,
    _strict: false,
    _baseUrl: '',
    params: [], // Would a TypedArray be valuable?
    queries: [],
    _debug: false,
    _debugLevel: '',
    debug_log: function( name, value ) {
        if ( this._debug )  {
            if ( !this._debugLevel || this._debugLevel === 'all' ) {
                console.log( name, JSON.stringify( value, replacer ) );
            }
        }
    },
    /**
     * A catch all setter for the urlBuilder that can handle the debug logging for all other calls
     * @param {string} name - key name for entry on this object
     * @param {string} value - value for entry on this object
     * @param {string|object} debugValue - a special value to be used in debugging
     * @return {ReqBuilder} - This ReqBuilder object
     */
    setter: function( name, value, debugValue = null ) {
        this[ name ] = value;

        this.debug_log( name, debugValue || value );
        return this._build_req();
    },
    /**
     * Optionally set boolean flag. Defaults to true when you call it.
     * But allows you to specify incase you want to `debug( process.env.NODE_ENV === 'production' )`
     * @param {boolean|object} dbg - debug flag, defaults to true
     * @return {ReqBuilder} - This ReqBuilder object
     */
    debug: function( dbg = true ) {
        if ( typeof dbg === 'object' ) {
            if ( !dbg.name || !dbg.level ) console.warn( 'Debug object is missing name or level. Default values `Debug` and `all` will be used' );
            this._debug = dbg.name || 'Debug';
            this._debugLevel = dbg.level || 'all';
            console.log( this._debug.toUpperCase() ); // console.group <-- how do we know when to call console.groupEnd
            return this._build_req( '_debug', dbg.name )._build_req( '_debugLevel', dbg.level );
        } else {
            this._debug = dbg;
            return this._build_req( '_debug', dbg );
        }
    },
    /**
     * Adds the given value to a specified array.
     * Handles creating a new object if necessary
     * @param {string} type - what array to add the values to
     * @param {*} value - Value to be added to arrays
     * @return {ReqBuilder} - This ReqBuilder object
     * @private
     */
    _build_req: function( type = '', value = null ) {
        let obj = this;
        if ( !obj.url ) {
            obj = Object.create( this );
            if ( obj.baseUrl === '' ) console.warn( 'No BaseUrl' );
            obj.url = obj.baseUrl;
            obj.params = [];
            obj.queries = [];
        }

        if ( type ) {
            if ( !value ) console.warn( type + ' is empty. Did you mean for that? The value is still being added. If you want it to not be added in the future, set _strict to true' );
            if ( type === 'params' ) obj.setter( type, obj.params.concat( value ), value );
            else if ( type === 'queries' ) obj.setter( type, [ ...obj.queries, value ], value );
            else obj[ type ] = value;
        }

        return obj;
    },
    /**
     * Add a paramter to the request.
     * This does not add it to the URL right away.
     * Instead it adds it an array that will be used in the building later.
     * @param {string} value - paramter
     * @return {ReqBuilder} - This ReqBuilder object
     */
    add_params: function( value ) {
        return this._build_req( 'params', value );
    },
    /**
     * Add a query to the request.
     * This does not add it to the URL right away.
     * Instead it adds it an array that will be used in the building later.
     * @param {string|object} key - left side name, can be an object that will be turned into `k=v` queries
     * @param {string} value - right side values
     * @return {ReqBuilder} - This ReqBuilder object
     */
    add_query: function( key, value ) {
        const query = ( key && typeof key === 'object' ) ? Object.keys( key ).map( ( k ) => `${key}=${key[k]}` ).join( '&' ) : `${key}=${value}`;
        return this._build_req( 'queries', query );
    },
    /**
     * Add add a skip to the request
     * @param {number|string} amount - amount of items to skip
     * @return {ReqBuilder} - This ReqBuilder object
     */
    skip: function( amount = 15 ) {
        return this.add_query( 'skip', amount );
    },
    /**
     * Add add a limit to the request
     * @param {number|string} amount - amount of items to return
     * @return {ReqBuilder} - This ReqBuilder object
     */
    limit: function( amount = 15 ) {
        return this.add_query( 'limit', amount );
    },
    /**
     * Makes a new independent copy of the current ReqBuilder
     * @return {ReqBuilder} - This ReqBuilder object
     */
    copy: function() {
        return Object.create( this );
    },
    /**
     * Construct the URL from the params and queries
     * @return {string} - the URL
     */
    build_url: function() {
        const
            paramString = this.params.length > 0 ? '/' + this.params.join( '/' ) : '',
            queryString = this.queries.length > 0 ? '?' + this.queries.join( '&' ) : '';

        return this.baseUrl + paramString + queryString;
    },
    /**
     * Get the current URL
     * The url does not get constructed unless told to accessing this.url will not get you anything
     * @return {string} - the constructed URL
     */
    get_url: function() {
        return this.build_url();
    },
    /**
     * Set the Request URL, does not overwrite the params or queries
     * @param {string} url - new request url
     * @return {ReqBuilder} - returns RequestBuilder
     */
    set_url: function( url ) {
        this.url = url;
        return this;
    },
    /**
     * Loads all properties of the given object into this Builder.
     * This will overwrite any existing property values with the new values
     * @param {boolean|object} extendProp - Either the first object in the props list
     * or a boolean flag to extend the current Builders properties instead of overwriting them
     * @param {array} props - A list of saved object properties to load into this Builder
     * @return {ReqBuilder} - returns RequestBuilder
     */
    load: function( extendProp, ...props ) {
        let extend = false;
        if ( typeof extendProp === 'object' ) props.unshift( extendProp );
        else extend = extendProp;

        props.forEach( propSet => { // TEST IF IT"S NOT AN OBJECT
            if ( typeof propSet !== 'object' || Array.isArray( propSet ) ) throw new Error( 'Load only takes Objects' );

            Object.keys( propSet ).forEach( key => {
                const newValue = propSet[ key ];
                if ( newValue !== '' && newValue !== {} && newValue.length > 0 ) {
                    if ( this[ key ] && extend ) {
                        const propType = typeof this[ key ];
                        if ( propType === 'string' || Array.isArray( propType ) ) {
                            this[ key ] = this[ key ].concat( newValue );
                        } else {
                            this[ key ] = Object.assign( this[ key ], newValue );
                        }
                    } else {
                        this[ key ] = newValue;
                    }
                }
            } );

        } );

        return this._build_req();
    }
};

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
