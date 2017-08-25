import { submit_fetch, add_dummy_data_config, add_transform_config, set_base_url, extend_fetch_headers } from './fetchUtil';
import ReqBuilder, { urlBuilder } from './requestBuilder';

if (!Object.entries)
    Object.entries = function( obj ){
        var ownProps = Object.keys( obj ),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };

export {
    submit_fetch,
    add_dummy_data_config,
    add_transform_config,
    set_base_url, extend_fetch_headers,
    ReqBuilder,
    urlBuilder
};