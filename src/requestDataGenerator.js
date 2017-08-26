import pathToRegexp from 'path-to-regexp';

/**
 * Creates a function that uses a js object configuration to match against given URLs
 * @param {object} configuration - an object with a key -> value pairing of express-like parameterized routes -> dummy data generator
 * @return {function(*)} - function to be used for matching URLs with the proper dummy data
 */
export default function requestDataGenerator( configuration ) {
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
                const regex = pathToRegexp( key );
                const query  = queryMatch.match( regex );
                if ( queryMatch.match( regex ) ) {
                    return configuration[ key ]( ...query, metadata );
                }
            } else {
                const [ verb, path ] = key;
                const regex = pathToRegexp( path );
                const query  = queryMatch.match( regex );
                if ( queryMatch.match( regex ) && method === verb ) {
                    return configuration[ key ]( ...query, metadata );
                }
            }


        }
        return false;
    };
}
