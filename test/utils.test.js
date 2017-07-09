import { insert, PH, push, genericArray, replacer, truncate } from '../src/utils';
import { testGroup, entriesTest, getRandomIntInclusive } from './testUtil';

testGroup( 'insert',{
    'will add value to array at a given index': () => {
        const arr = [];
        const res = insert( arr, 1, 0 );
        expect( res[ 0 ] ).toEqual( 1 );
    },
    'returns a new updated array': () => {
        const arr = [];
        const res = insert( arr, 1, 0 );
        expect( arr.length ).toBe( 0 );
        expect( res.length ).toBe( 1 );
        expect( res ).not.toBe( arr )
    },
    'will add the value to any index. Will add empty spaces if necessary': () => {
        const arr = [];
        [ 1, 2, 3, 4 ].forEach( val => {
            expect( arr.length < val * 2 ).toBeTruthy();
            const res = insert( arr, val, val * 2 );
            expect( res[ val * 2 ] ).toEqual( val );
            expect( res.length === 1 + val * 2 ).toBeTruthy();
            expect( res[ val * 2 - 1 ] ).toEqual( PH )
        } )
    },
} );

testGroup( 'push', {
    'adds value to the end of a given array': () => {
        expect( push( [], 1 ) ).toEqual( [ 1 ] )
    },
    'returns a modified array': () => {
        const arr = [];
        const res = push( arr, 1 );
        expect( arr ).toEqual( [ 1 ] );
        expect( res ).toBe( arr );
    }
} );

testGroup( 'genericArray', {
    'creates an array of given length filled with the given value': () => {
        expect( genericArray( 5, 'val' ) ).toEqual( [ 'val', 'val', 'val', 'val', 'val' ] );
    },
    'value defaults to an empty string': () => {
        expect( genericArray( 5 ) ).toEqual( [ '', '', '', '', '' ] );
    },
    'value can be an array the will be used as the mapping function': () => {
        expect( genericArray( 5 , () => 1 ) ).toEqual( [ 1, 1, 1, 1, 1,  ] );
    }
} );