/**
 * Truncates a string longer than 10 characters to the first 8 characters followed by ..
 * @param {string} str - long string
 * * @param {boolean} ingnoreSpaces -
 * @return {string} - truncated string
 */
export function truncate( str, ingnoreSpaces = true ) {
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

/**
 *
 * @param length
 * @param fill
 */
export function genericArray( length, fill = '' ) {
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
export function push( arr, item ) {
    arr.push( item );
    return arr;
}

export const PH = '__placeholder';

/**
 *
 * @param arr
 * @param item
 * @param index
 * @return {*}
 */
export function insert( arr, item, index ) {
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

