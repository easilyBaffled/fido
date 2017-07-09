import urlBuilder from '../src/urlBuilder';
import { testGroup, entriesTest, getRandomIntInclusive } from './testUtil';

urlBuilder.baseUrl = 'TEST';

test( 'urlBuilder is a thing', () => {
    expect( !!urlBuilder ).toBe( true );
} );

testGroup('debug', {
    'Builder starts at level 0': () => expect( urlBuilder._debugLevel ).toBe( 0 ),

    'Default value for debug() is 1': () => {
        const debuggedBuilderDefault = urlBuilder.debug();
        expect( debuggedBuilderDefault._debugLevel ).toBe( 1 );
    },

    'Explicitly set debug level': () => {
        const debuggedBuilderLevel2 = urlBuilder.debug(  2, 'group' );
        expect( debuggedBuilderLevel2._debugLevel ).toBe( 2 );
    }
} );

testGroup( '_update', {
    'will return a new instance of the Builder when used the first time': () => {
        const builder1 = urlBuilder._update();
        const builder2 = builder1._update();

        expect( urlBuilder !== builder1 ).toBe( true );
        expect( builder1 === builder2 ).toBe( true )
        expect( builder1.__isProxy ).toBe( true );
        expect( builder2.__isProxy ).toBe( true );
        expect( builder2 !== urlBuilder ).toBe( true );

    },

    'will update or add a given value on the Builder, if not _strict': () => {
        const newValue = urlBuilder._update( 'newValue', 'newValue' );
        expect( newValue.newValue ).toBe( 'newValue' );

        expect( newValue._debugLevel ).toBe( 0 );
        newValue._update( '_debugLevel', 2 );
        expect( newValue._debugLevel ).toBe( 2 );
    },

    'will not handle non-params or non-queries if _strict is true': () => {
        urlBuilder._strict = true;

        const newValue = urlBuilder._update( 'newValue', 'newValue' );
        expect( urlBuilder !== newValue ).toBe( true );
        expect( newValue.newValue ).toBe( undefined );

        expect( newValue._debugLevel ).toBe( 0 );
        newValue._update( '_debugLevel', 2 );
        expect( newValue._debugLevel ).toBe( 0 );

        urlBuilder._strict = false;
    },

    'will add params and queries to proper arrays in Builder': () => {
        const updatedBuilder = urlBuilder._update( 'params', 'newValue' );

        expect( urlBuilder.params.length ).toBe( 0 );
        expect( updatedBuilder.params.length ).toBe( 1 );
        expect( updatedBuilder.params.includes( 'newValue' ) ).toBe( true );

        updatedBuilder._update( 'queries', 'newValue' );
        expect( urlBuilder.params.length ).toBe( 0 );
        expect( updatedBuilder.queries.length ).toBe( 1 );
        expect( updatedBuilder.queries.includes( 'newValue' ) ).toBe( true );
    }
} );

testGroup( 'addParam', {
    'takes any single value, including null and adds it to the Builder ': () => {
        const paramedBuilder = urlBuilder.addParam( 1, 2, 3 );
        expect( paramedBuilder.params ).toEqual( [ 1 ] );

        paramedBuilder.addParam( [ 1, 2, 3 ] );
        expect( paramedBuilder.params ).toEqual( [ 1, [ 1, 2, 3 ] ] );

        paramedBuilder.addParam( null );
        expect( paramedBuilder.params ).toEqual( [ 1, [ 1, 2, 3 ], null ] );
    },
    'uses _update to add the value to the Builder': () => {
        const mockedBuilder = urlBuilder._update();
        mockedBuilder._update = jest.fn();
        mockedBuilder.addParam( [ 1, 2, 3 ] );
        expect( mockedBuilder._update ).toHaveBeenCalled();
    }
} )

testGroup( 'addQuery', {
    'can take a key value pair and add it to the Builder\'s queries array as `key=value` ': () => {
        const queriedBuilder = urlBuilder.addQuery( 'testKey', 'testValue' );
        expect( queriedBuilder.queries ).toEqual( [ 'testKey=testValue' ] );


        queriedBuilder.addQuery( 2, null, 'ignoredExtraValue' );
        expect( queriedBuilder.queries ).toEqual( [ 'testKey=testValue', '2=null' ] );

        queriedBuilder.addQuery( null, 2, 'ignoredExtraValue' );
        expect( queriedBuilder.queries ).toEqual( [ 'testKey=testValue', '2=null', 'null=2' ] );
    },
    'If key is an object value is ignored and the object is converted into a series of key_i=value_i': () => {
        const queriedBuilder = urlBuilder.addQuery( { 'testKey': 'testValue', 'array': [ 1, 2, 3 ] } );
        expect( queriedBuilder.queries ).toEqual( [ 'testKey=testValue&array=1,2,3' ] );

        const queriedBuilder2 = urlBuilder.addQuery( { 'testKey': 'testValue', 'array': [ 1, 2, 3 ] }, 'ignored' );
        expect( queriedBuilder2.queries ).toEqual( [ 'testKey=testValue&array=1,2,3' ] );

    }
} )

testGroup( 'copy', {
    'creates a new copy of the Builder': () => {
        const firstBuilder = urlBuilder.addQuery( 'testKey', 'testValue' );
        firstBuilder.addParam( 'testParam' );
        const copyBuilder = firstBuilder.copy();

        expect( copyBuilder ).not.toBe( firstBuilder );
        expect( copyBuilder.params ).toEqual( firstBuilder.params );
    }
} )


testGroup( 'buildUrl', {
    'takes the parts of the Builder and builds a valid url': () => {
        const url = urlBuilder
            .addQuery( 'testKey', 'testValue' )
            .addParam( 'testParam' )
            .buildUrl();

        expect( url ).toEqual( 'TEST/testParam?testKey=testValue' )
    },
    'will construct the url starting with the Builder\'s baseUrl': () => {
        const builder = urlBuilder._update();
        const url = builder.buildUrl();
        expect( url ).toEqual( builder.baseUrl )
    },
    'will join all query entries with an &': () => {
        const url = urlBuilder
            .addQuery( 'testKey', 'testValue' )
            .addQuery( 'testKey2', 'testValue2' )
            .buildUrl();

        expect( url.includes( '&' ) ).toBe( true );
    },
    'will join all paramter entries with a /': () => {
        const url = urlBuilder
            .addParam( 'testParam' )
            .addParam( 'testParam2' )
            .buildUrl();

        expect( url.includes( '/' ) ).toBe( true );
    }
} );

testGroup( 'proxyGet', {
    'by default, if you call a function that does not exist on the Builder it will be treated like `addQuery`': () => {
        const queryBuilder = urlBuilder.mat( 'key', 'value' ).where( 'key2', 'value2' )

        queryBuilder.test( 'key3', 'key3' );
        expect( queryBuilder.queries ).toEqual( ["mat=key,value", "where=key2,value2", "test=key3,key3"] )
    },
    'will ignore these extra functions if _strict is set to true ': () => {
        urlBuilder._strict = true;
        let queryBuilder;
        try {
            queryBuilder = urlBuilder.mat( 'key', 'value' );
        } catch ( e ) {
            expect( queryBuilder ).toBeUndefined();
            expect( e ).toBeInstanceOf( Error );
        }
    }
} );

/*
testGroup( 'load', {
    'Add values of one builder to another': () => {
        const queryBuilder = urlBuilder.addQuery( 'key', 'value' );
        const paramBuilder = urlBuilder.addParam( 'param' );

        expect( paramBuilder.queries.length ).toBe( 0 );
        paramBuilder.load( true, queryBuilder );
        expect( paramBuilder.queries ).toEqual( [ 'key=value' ] );
    },
    'will merge, not overwrite the values': () => {
        const queryBuilder = urlBuilder.addQuery( 'key', 'value' );
        const paramBuilder = urlBuilder.addQuery( 'param' ).addQuery( 'key2', 'value2' );

        expect( paramBuilder.queries ).toEqual( [ 'key2=value2' ] );
        paramBuilder.load( true, queryBuilder );
        expect( paramBuilder.queries ).toEqual( [ 'key2=value2', 'key=value' ] );
        expect( paramBuilder.params ).toEqual( [ 'param' ] );
    }
} );
*/

// EASY TO DELETE