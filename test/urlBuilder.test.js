import urlBuilder from '../src/urlBuilder';
import { random } from 'faker';

function getRandomIntInclusive( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}

const option1 = 'manifests';
const option2 = 'members';

const userIds = Array.from( { length: getRandomIntInclusive( 1, 5 ) }, () => random.uuid() );
const groupId = random.uuid();

urlBuilder.baseUrl = 'TEST';
/*
test( 'urlBuilder is a thing', () => {
    // const classMat = urlBuilder.mat( option1, option2 );

    // console.log( urlBuilder.debug( 2, 'group' ).groupId( groupId ).load( classMat ).buildUrl() );
    // console.log( urlBuilder.owners( userIds ).where( { model: 'Groups', Aaron: 'satisfied' } ).skip().limit().mat( option1, option2 ).build_url() );
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
        expect( builder1 === builder2 ).toBe( true );
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
*/
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

/**
 * An adapter for Jest's `test` function so it can easily slot in with Object.entries
 * @param {string} description - description text for this test
 * @param {function} func - a function to evaluate a given situation
 */
function entriesTest( [ description, func ] ) {
    test( description, func );
}

/**
 * A short cut for Jest's describe and test just to save some repetitive characters
 * @param {string} topic - description text for this group of tests
 * @param {object} tests - configured Jest tests where each entry's key:value is description string:test code
 */
function testGroup( topic, tests ) {
    describe( topic, () => {
        Object.entries( tests ).forEach( entriesTest );
    } )
}

// EASY TO DELETE