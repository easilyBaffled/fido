(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("node-fetch"), require("bluebird"), require("whatwg-fetch"), require("path-to-regexp"));
	else if(typeof define === 'function' && define.amd)
		define(["node-fetch", "bluebird", "whatwg-fetch", "path-to-regexp"], factory);
	else if(typeof exports === 'object')
		exports["fetchUtil"] = factory(require("node-fetch"), require("bluebird"), require("whatwg-fetch"), require("path-to-regexp"));
	else
		root["fetchUtil"] = factory(root["node-fetch"], root["bluebird"], root["whatwg-fetch"], root["path-to-regexp"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_7__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["c"] = extend_fetch_headers;
/* harmony export (immutable) */ __webpack_exports__["a"] = add_dummy_data_config;
/* harmony export (immutable) */ __webpack_exports__["b"] = add_transform_config;
/* harmony export (immutable) */ __webpack_exports__["d"] = set_base_url;
/* harmony export (immutable) */ __webpack_exports__["e"] = submit_fetch;
/* unused harmony export get_json */
/* unused harmony export post */
/* unused harmony export put */
/* unused harmony export default */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__requestDataGenerator__ = __webpack_require__(6);
let fetch;


if ( typeof window === 'undefined' ) {
    fetch = __webpack_require__( 3 );
    fetch.Promise = __webpack_require__( 1 );
} else {
    if ( !window.fetch ) {
        __webpack_require__( 5 );
        window.fetch.Promise = __webpack_require__( 1 );
    }
    fetch = window.fetch;
}



let
    generate_dummy_data = () => null,
    data_transformer = () => null,
    baseUrl = '',
    defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

function extend_fetch_headers( extensions ) {
    // defaultHeaders = {
    //     ...defaultHeaders,
    //     ...extensions
    // };
    defaultHeaders = Object.assign( {}, defaultHeaders, extensions )
}

function add_dummy_data_config( config ) {
    generate_dummy_data = __WEBPACK_IMPORTED_MODULE_0__requestDataGenerator__["a" /* default */]( config );
}

function add_transform_config( config ) {
    data_transformer = __WEBPACK_IMPORTED_MODULE_0__requestDataGenerator__["a" /* default */]( config );
}

function set_base_url( url ) {
    baseUrl = url;
}

// Fetch is the new Promise based, native Web API for making requests. https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
// Response - https://developer.mozilla.org/en-US/docs/Web/API/Response
/**
 * Create a fetch request
 * @param {string} url - This defines the resource that you wish to fetch
 * @param {object} headers - fetch headers
 * @param {string} method - Request verb
 * @param {object} body - an optional object for PUT and POST requests
 * @return {Promise} - A Promise that resolves to a Response object.
 */
function submit_fetch( url, headers = {}, method = 'GET', body = {} ) {
    url = baseUrl + url;
    let combinedHeaders = Object.assign( defaultHeaders, headers );

    const config = {
            headers: combinedHeaders,
            cache: method === 'GET' ? "default" : "no-cache", // This needs to be evaluated
            method
        };
    if ( method !== 'GET' ) config.body = typeof body === "string" ? body : JSON.stringify( body );

    const dummyData = generate_dummy_data( url, method, config );

    if ( dummyData ) {
        const
            transformedData = data_transformer( url, method, dummyData ),
            resData = transformedData || dummyData;

        return Promise.resolve( resData );
    }

    return fetch( url, config )
            .then( check_status )
            .then( parse_resp_JSON )
            .then( res => {
                const transformedData = data_transformer( url, method, res );
                return transformedData ? transformedData : res;
            } );
}

/**
 * Check the status of the request before trying to use the response
 * @param {Response} response - The Response interface of the Fetch API represents the response to a request. This is not the actual response yet. https://developer.mozilla.org/en-US/docs/Web/API/Response
 * @return {*} This will either send the response to the next step in the chain, or throw an object with error data
 */
function check_status( response ) {
    if ( response.status >= 200 && response.status < 300 ) {
        return response;
    }
    if ( response.status === 401 ) {
        sessionStorage.removeItem( 'auth' );
        sessionStorage.removeItem( 'user' );
    }

    return response.json().then( val => {
        throw val;
    } );
}

/**
 * Parse the Response object into usable JSON. Takes a Response stream and reads it to completion. It returns a promise that resolves with a JSON object.
 * @param {Response} response - The Response interface of the Fetch API represents the response to a request.
 * @return {object} - A promise that resolves with an object literal containing the JSON data.
 */
function parse_resp_JSON( response ) {
    return response.json();
}

/**
 * Create and execute the first few steps of Fetch, let's the user specify how to handle the results
 * @param {string} url - This defines the resource that you wish to fetch
 * @param {object} headers - fetch headers
 * @param {Array} filters - Array of objects that will be convereted to a URL query string
 * @return {Promise<U>} - A promise that resolves with an object literal containing the JSON data.
 */
function get_json( url, headers = {}, ...filters ) {
    if ( typeof filters === "string" ) {
        if ( filters.length === 0 ) {
            return submit_fetch( url, headers );
        } else {
            return submit_fetch( url + format_filters( filters ), headers );
        }
    } else {
        return submit_fetch( url + format_filters( filters ), headers );
    }
}

function post( url, headers, body ) {
    return submit_fetch( url, headers, 'POST', body );
}

function put( url, headers, body ) {
    return submit_fetch( url, headers, 'PUT', body );
}

function fetch_config( url, headers ) {
    return {
        PUT: ( body, id = '' ) => submit_fetch( `${url}/${id}`, headers, 'PUT', body ),
        POST: ( id, body ) => submit_fetch( `${url}/${id}`, headers, 'POST', JSON.stringify( body ) ),
        DELETE: ( id ) => submit_fetch( `${url}/${id}`, headers, 'DELETE' ),
        GET: ( filters ) => submit_fetch( url + ( filters ? format_filters( filters ) : '' ), headers )
    };
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bluebird__);


__WEBPACK_IMPORTED_MODULE_0_bluebird___default.a.config( {
    warnings: true,
    longStackTraces: true
} );

/* harmony default export */ __webpack_exports__["default"] = (__WEBPACK_IMPORTED_MODULE_0_bluebird___default.a);


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fetchUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__requestBuilder__ = __webpack_require__(8);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "submit_fetch", function() { return __WEBPACK_IMPORTED_MODULE_0__fetchUtil__["e"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "add_dummy_data_config", function() { return __WEBPACK_IMPORTED_MODULE_0__fetchUtil__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "add_transform_config", function() { return __WEBPACK_IMPORTED_MODULE_0__fetchUtil__["b"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "set_base_url", function() { return __WEBPACK_IMPORTED_MODULE_0__fetchUtil__["d"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "extend_fetch_headers", function() { return __WEBPACK_IMPORTED_MODULE_0__fetchUtil__["c"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ReqBuilder", function() { return __WEBPACK_IMPORTED_MODULE_1__requestBuilder__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "urlBuilder", function() { return __WEBPACK_IMPORTED_MODULE_1__requestBuilder__["urlBuilder"]; });





/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = configure_data_gen;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path_to_regexp__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_path_to_regexp___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_path_to_regexp__);


/**
 * Creates a function that uses a js object configuration to match against given URLs
 * @param {object} configuration - an object with a key -> value pairing of express-like parameterized routes -> dummy data generator
 * @return {function(*)} - function to be used for matching URLs with the proper dummy data
 */
function configure_data_gen( configuration ) {
    /**
     * Match the given URL against express-like parameterized routesand returns dummy data to replicate data that may come from the API
     * @param {string} url - url used to request data from the API
     * @param {string} method - The CRUD verb associated with the request
     * @param {object} metadata - user incldued things like authCode
     * @return {*|boolean} - An object replicating data from the API or false indicating that the URL wasn't a match
     */
    return ( url, method, metadata ) => {
        const match = url.match( /https?:\/\/[^/]*\/(.*)/ );
        const queryMatch = match ? match[ 1 ] : '';

        for ( const key in configuration ) {
            if ( typeof key === 'string' ) {
                const regex = __WEBPACK_IMPORTED_MODULE_0_path_to_regexp___default.a( key );
                const query  = queryMatch.match( regex );
                if ( queryMatch.match( regex ) ) {
                    return configuration[ key ]( ...query, metadata );
                }
            } else {
                const [ verb, path ] = key;
                const regex = __WEBPACK_IMPORTED_MODULE_0_path_to_regexp___default.a( path );
                const query  = queryMatch.match( regex );
                if ( queryMatch.match( regex ) && method === verb ) {
                    return configuration[ key ]( ...query, metadata );
                }
            }


        }
        return false;
    };
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_7__;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fetchUtil__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__urlBuilder__ = __webpack_require__(9);



/* harmony default export */ __webpack_exports__["a"] = (Object.assign( __WEBPACK_IMPORTED_MODULE_1__urlBuilder__["a" /* default */], {
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

        if ( this._debug ) console.log( { url, header, method, body } );
        if ( this._testing ) {
            return Promise.resolve( { _id: 'testing' } );
        } else {
            return __WEBPACK_IMPORTED_MODULE_0__fetchUtil__["e" /* submit_fetch */]( url, header, method, body  );
        }
    }
} ));


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__utils__ = __webpack_require__(10);


const __urlBuilder = {
    _baseUrl: null,
    _url: null,
    _strict: false,
    _debugLevel: 0,
    params: [],
    queries: [],
    _logLevels: [
        null,
        null,
        ( name, value ) => console.log( name, JSON.stringify( value, __WEBPACK_IMPORTED_MODULE_0__utils__["b" /* replacer */] ) )
    ],
    debug: function( level = 1, name = null ) {
        if ( name ) console.log( 'Debug: ' + name );

        return this._update( '_debugLevel', level );
    },
    _update: function( type = '', value = null ) {
        let obj = this;

        if ( !obj._url ) {
            obj = new Proxy( Object.assign( {}, this ), { set: proxySet, get: proxyGet } );
            if ( obj.baseUrl === '' ) console.warn( 'No BaseUrl' );
            obj._url = obj.baseUrl;
            obj.params = [];
            obj.queries = [];
        }

        if ( type ) {
            if ( !value ) console.warn( type + ' is empty. Did you mean for that? The value is still being added. If you want it to not be added in the future, set _strict to true' );
            if ( type === 'params' ) __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* insert */]( obj.params, value );
            else if ( type === 'queries' ) __WEBPACK_IMPORTED_MODULE_0__utils__["a" /* insert */]( obj.queries, value );
            else if ( !this._strict ) obj[ type ] = value;
        }

        return obj;
    },
    addParam: function( value ) {
        return this._update( 'params', value )
    },
    addQuery: function( key, value ) {
        const query = ( key && typeof key === 'object' ) ?
                            Object.keys( key ).map( k => `${k}=${key[ k ]}` ).join( '&' ) // If key is an object value is ignored
                            : `${key}=${value}`;
        return this._update( 'queries', query );
    },
    copy: function() {
        return new Proxy( Object.assign( {}, this ), { set: proxySet, get: proxyGet } )
    },
    buildUrl: function() {
        const
            paramString = this.params.length > 0 ? '/' + this.params.join( '/' ) : '',
            queryString = this.queries.length > 0 ? '?' + this.queries.join( '&' ) : '';

        return this.baseUrl + paramString + queryString;
    },
    /*load: function( extendProp, ...props ) {
        const extend = typeof props[ 0 ] === 'boolean' ? props.splice( 0, 1 ) : false;

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

        return this._update();
    }*/
};
/* unused harmony export __urlBuilder */


function proxySet( target, property, value ) {
    target[ property ] = value;
    if ( property === 'params' || property === 'queries' ) {
        const log = target._logLevels[ target._debugLevel ];
        if ( log ) log( property, value )
    }
    return true;
}

function proxyGet ( target, name, proxy ) {
    if (name === "__isProxy") return true;

    const value = target[ name ];
    if ( value !== undefined || target._strict ) return value;

    return function( ...options ) {
        console.warn( `${name} is not a function on this Builder, but it will be treated as 'addQuery( ${name}, ${options} )'. If you do not want this safety net and short cut, set 'strict' to 'true' on this Builder, or import __urlBuilder.` );
        return proxy.addQuery( name, options );
    };
}
const urlBuilder = new Proxy( __urlBuilder, { set: proxySet, get: proxyGet } );
/* harmony default export */ __webpack_exports__["a"] = (urlBuilder);

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export truncate */
/* harmony export (immutable) */ __webpack_exports__["b"] = replacer;
/* unused harmony export genericArray */
/* unused harmony export push */
/* harmony export (immutable) */ __webpack_exports__["a"] = insert;
/**
 * Truncates a string longer than 10 characters to the first 8 characters followed by ..
 * @param {string} str - long string
 * * @param {boolean} ingnoreSpaces -
 * @return {string} - truncated string
 */
function truncate( str, ingnoreSpaces = true ) {
    if ( !str ) return '';
    if ( ingnoreSpaces ) return str.length > 10 ? str.substring( 0, 8 ) + '...' : str;
    return str.split( ' ' ).map( str => str.length > 10 ? str.substring( 0, 8 ) + '...' : str ).join();
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
function replacer( key, value = null ) {
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

/**
 *
 * @param length
 * @param fill
 */
function genericArray( length, fill = '' ) {
    let filFunc = fill;
    if ( typeof filFunc !== 'function' ) filFunc = () => fill;

    return Array.from( { length }, filFunc );
}

/**
 *
 * @param arr
 * @param item
 * @return {*}
 */
function push( arr, item ) {
    arr.push( item );
    return arr;
}

const PH = '__placeholder';
/* unused harmony export PH */


/**
 *
 * @param arr
 * @param item
 * @param index
 * @return {*}
 */
function insert( arr, item, index ) {
    arr = arr.concat( [] );
    if ( !index && index !== 0 ) return push( arr, item );

    const sizeDifference = index - arr.length;

    if ( sizeDifference > 0 ) {
        const spacerArray = genericArray( sizeDifference, PH );
        const spacedArr = arr.concat( spacerArray );
        const valuedArr = push( spacedArr, item );
        return valuedArr;
    }

    arr.splice( index, +( arr[ index ] === PH ), item ); // urary plus converts a boolean to a 1 or 0. In this case if the thing at the index is a placeholder then replace it.

    return arr;
}



/***/ })
/******/ ]);
});