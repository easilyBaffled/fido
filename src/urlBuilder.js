import { truncate, replacer, insert } from './utils';

export const __urlBuilder = {
    _baseUrl: null,
    _url: null,
    _strict: false,
    _debugLevel: 0,
    params: [],
    queries: [],
    _logLevels: [
        null,
        null,
        ( name, value ) => console.log( name, JSON.stringify( value, replacer ) )
    ],
    toString: function () {
        return 'toString'
    },
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
            if ( type === 'params' ) insert( obj.params, value );
            else if ( type === 'queries' ) insert( obj.queries, value );
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
export default urlBuilder;