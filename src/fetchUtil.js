let fetch;


if ( typeof window === 'undefined' ) {
    fetch = require( 'node-fetch' );
    fetch.Promise = require( './promise' );
} else {
    if ( !window.fetch ) {
        require( 'whatwg-fetch' );
        window.fetch.Promise = require( './promise' );
    }
    fetch = window.fetch;
}

import configure_data_gen from './requestDataGenerator';

let
    generate_dummy_data = () => null,
    data_transformer = () => null,
    baseUrl = '',
    defaultHeaders = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

export function extend_fetch_headers( extensions ) {
    // defaultHeaders = {
    //     ...defaultHeaders,
    //     ...extensions
    // };
    defaultHeaders = Object.assign( {}, defaultHeaders, extensions )
}

export function add_dummy_data_config( config ) {
    generate_dummy_data = configure_data_gen( config );
}

export function add_transform_config( config ) {
    data_transformer = configure_data_gen( config );
}

export function set_base_url( url ) {
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
export function submit_fetch( url, headers = {}, method = 'GET', body = {} ) {
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
                return transformedData || res.data ? ( res.data.data ? res.data.data : res.data ) : res;
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
export function get_json( url, headers = {}, ...filters ) {
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

export function post( url, headers, body ) {
    return submit_fetch( url, headers, 'POST', body );
}

export function put( url, headers, body ) {
    return submit_fetch( url, headers, 'PUT', body );
}

export default function fetch_config( url, headers ) {
    return {
        PUT: ( body, id = '' ) => submit_fetch( `${url}/${id}`, headers, 'PUT', body ),
        POST: ( id, body ) => submit_fetch( `${url}/${id}`, headers, 'POST', JSON.stringify( body ) ),
        DELETE: ( id ) => submit_fetch( `${url}/${id}`, headers, 'DELETE' ),
        GET: ( filters ) => submit_fetch( url + ( filters ? format_filters( filters ) : '' ), headers )
    };
}
