import requestBuilder from '../src/requestBuilder';
import { testGroup, entriesTest, getRandomIntInclusive } from './testUtil';

requestBuilder.baseUrl = 'TEST';
requestBuilder._testing = true;

test( 'urlBuilder is a thing', () => {
    expect( !!requestBuilder ).toBe( true );
    expect( requestBuilder.__isProxy ).toBeTruthy();
} );

testGroup( 'setHeader', {
    'will set the given value as the header for the Builder': () => {
        const rB = requestBuilder.setHeader( { key: 'CORS IS A PAIN THE ASS' } );
        expect( rB.header ).toEqual( { key: 'CORS IS A PAIN THE ASS' } );
        expect( rB.__isProxy ).toBeTruthy();
    },
    'each call will replace the current header': () => {
        let rB = requestBuilder.setHeader( { key: 'CORS IS A PAIN THE ASS' } );
        expect( rB.header ).toEqual( { key: 'CORS IS A PAIN THE ASS' } );
        rB = rB.setHeader( { key: 'value' } );
        expect( rB.header ).toEqual( { key: 'value' } );
        expect( rB.__isProxy ).toBeTruthy();
    },
    'expects the given header to be an object': () => {
        try {
            requestBuilder.setHeader( 'CORS IS A PAIN THE ASS' );
        } catch ( e ) {
            expect( e ).toBeInstanceOf( Error );
        }
    }
} );

testGroup( 'updateHeader', {
    'will update instead of overwrite the header': () => {
        let rB = requestBuilder
            .setHeader( { key: 'CORS IS A PAIN THE ASS' } )
            .updateHeader( 'key2', 'value' );
        expect( rB.header ).toEqual( { key: 'CORS IS A PAIN THE ASS', key2: 'value' } );
        expect( rB.__isProxy ).toBeTruthy();
    },
    'the first value can be an object and the second will be ignored': () => {
        let rB = requestBuilder
            .setHeader( { key: 'CORS IS A PAIN THE ASS' } )
            .updateHeader( { 'key2': 'value' }, 'ignoredValue' );
        expect( rB.header ).toEqual( { key: 'CORS IS A PAIN THE ASS', key2: 'value' } );
    },
    'can be used in place of setHeader': () => {
        let rB = requestBuilder
            .updateHeader( 'key2', 'value' );
        expect( rB.header ).toEqual( { key2: 'value' } );
    }
} );

testGroup( 'setBody', {
    'will set the given value as the body for the Builder': () => {
        const rB = requestBuilder.setBody( { key: 'CORS IS A PAIN THE ASS' } );
        expect( rB.body ).toEqual( { key: 'CORS IS A PAIN THE ASS' } );
        expect( rB.__isProxy ).toBeTruthy();
    },
    'each call will replace the current body': () => {
        let rB = requestBuilder.setBody( { key: 'CORS IS A PAIN THE ASS' } );
        expect( rB.body ).toEqual( { key: 'CORS IS A PAIN THE ASS' } );
        rB = rB.setBody( { key: 'value' } );
        expect( rB.body ).toEqual( { key: 'value' } );
        expect( rB.__isProxy ).toBeTruthy();
    },
    'expects the given body to be an object': () => {
        try {
            requestBuilder.setBody( 'CORS IS A PAIN THE ASS' );
        } catch ( e ) {
            expect( e ).toBeInstanceOf( Error );
        }
    }
} );

testGroup( 'updateBody', {
    'will update instead of overwrite the body': () => {
        let rB = requestBuilder
            .setBody( { key: 'CORS IS A PAIN THE ASS' } )
            .updateBody( 'key2', 'value' );
        expect( rB.body ).toEqual( { key: 'CORS IS A PAIN THE ASS', key2: 'value' } );
        expect( rB.__isProxy ).toBeTruthy();
    },
    'the first value can be an object and the second will be ignored': () => {
        let rB = requestBuilder
            .setBody( { key: 'CORS IS A PAIN THE ASS' } )
            .updateBody( { 'key2': 'value' }, 'ignoredValue' );
        expect( rB.body ).toEqual( { key: 'CORS IS A PAIN THE ASS', key2: 'value' } );
    },
    'can be used in place of setBody': () => {
        let rB = requestBuilder
            .updateBody( 'key2', 'value' );
        expect( rB.body ).toEqual( { key2: 'value' } );
    }
} );

testGroup( 'get, put, post, delete',
    [ 'get', 'put', 'post', 'delete' ].reduce( ( acc, verb ) => {
        acc[ `${verb} will call this.verb with the verb as the parameter` ] = () => {
            let mockedBuilder = requestBuilder._update();
            mockedBuilder.verb = jest.fn();

            mockedBuilder[ verb ]();
            expect( mockedBuilder.verb ).toBeCalledWith( verb.toUpperCase() );
        };
        return acc;
    }, {} )
);

testGroup( 'verb', {
    'sets Builder\'s method with the paramter': () => {
        let mockedBuilder = requestBuilder._update();
        mockedBuilder._update = jest.fn();

        mockedBuilder.verb( 'GET' );
        expect( mockedBuilder._update ).toBeCalledWith( 'method', 'GET' );
    },
    'calls send after setting the verb': () => {
        let mockedBuilder = requestBuilder._update();
        mockedBuilder.send = jest.fn();

        mockedBuilder.verb( 'GET' );
        expect( mockedBuilder.send ).toHaveBeenCalled();
    },
    'returns a Promise not the Builder': () => {
        const p = requestBuilder.verb( 'GET' );
        console.log( p );
        expect( p ).toBeInstanceOf( Promise );
    }
} );

testGroup( 'getRequestObj', {
    'constructs and returns the request object': () => {
        const reqObj = requestBuilder
            .addParam( 'test' )
            .updateHeader( 'key2', 'value' )
            .setBody( { key: 'value' } )
            ._update( 'method', 'GET' )
            .getRequestObj();
        expect( reqObj ).toEqual( {
            url: 'TEST/test',
            header: { key2: 'value' },
            method: 'GET',
            body: { key: 'value' }
        } );
    }
} );

testGroup( 'send', {
    'constructs and sends the request': () => {
        const reqPromise = requestBuilder
            .addParam( 'test' )
            .updateHeader( 'key2', 'value' )
            .setBody( { key: 'value' } )
            .send( 'method', 'GET' );

        expect( reqPromise ).toBeInstanceOf( Promise );


    },
    'calls getRequestObj': () => {
        let mockedBuilder = requestBuilder._update();
        mockedBuilder.getRequestObj = jest.fn();
        mockedBuilder.getRequestObj.mockReturnValueOnce( { url: '', header: '', method: '', body: '' } );
        mockedBuilder.send();
        expect( mockedBuilder.getRequestObj ).toHaveBeenCalled();
    }
} );

// testGroup('debug', {
//     'Builder starts at level 0': () => expect( urlBuilder._debugLevel ).toBe( 0 ),
//
//     'Default value for debug() is 1': () => {
//         const debuggedBuilderDefault = urlBuilder.debug();
//         expect( debuggedBuilderDefault._debugLevel ).toBe( 1 );
//     },
//
//     'Explicitly set debug level': () => {
//         const debuggedBuilderLevel2 = urlBuilder.debug(  2, 'group' );
//         expect( debuggedBuilderLevel2._debugLevel ).toBe( 2 );
//     }
// } );


// EASY TO DELETE