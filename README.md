# FIDO - fetch-util


A Fetch module without a real acronym.

[![npm version](https://badge.fury.io/js/fetch-util.svg)](https://badge.fury.io/js/fetch-util) [![CircleCI](https://circleci.com/gh/easilyBaffled/fido.svg?&style=shield&circle-token=24e038d3e68c4dd11262582f0ae4755add609783)](https://circleci.com/gh/easilyBaffled/fido) [![Coverage Status](https://coveralls.io/repos/github/easilyBaffled/fido/badge.svg?branch=master)](https://coveralls.io/github/easilyBaffled/fido?branch=master) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![codebeat badge](https://codebeat.co/badges/42ef9152-bd6c-4c9d-855c-1bc17aeb70bb)](https://codebeat.co/projects/github-com-easilybaffled-fido-master) [![Greenkeeper badge](https://badges.greenkeeper.io/easilyBaffled/fido.svg)](https://greenkeeper.io/)

FIDO( fetch-util )​ ​is​ ​a​ ​collection​ ​of​ ​small​ ​utilities​ ​that​ ​I​ ​found​ ​I​ ​kept​ ​writing​ ​over​ ​and​ ​over​ ​again​ ​when​ ​I​ ​used​ ​fetch​ ​in​ ​a
project. The purpose of this is to reduce the amount of noise surrounding my requests so that I can get the data and get back to work. 


How​ ​to​ ​use
--------------

# submit_fetch( url, headers = {}, method = 'GET', body = {} )

### Description
A basic wrapper for the native Fetch API. Handles the status check and parsing the JSON response in just one call. 
Outside of the actual Fetch work, it can make calls to generate dummy data and transform incoming data if you have configured it to, those will come next.


## Arguments

	url ( String ) - The direct URL of the resource you want to fetch

	headers ( Object ) - Any headers you want to add to your request default: {}

	method ( String ) - The request method default: 'GET'

	body ( Object ) - Any body that you want to add to your request default: {}

## Returns

	( Promise ) - A Promise that resolves with the response JSON

#### Example

	import { submit_fetch } from "fetch-utl";
	
	submit_fetch( "https://jsonplaceholder.typicode.com/posts/1" )
	
	   .then( function( res ) {
	
	       console.log( res );
	
	   } );

# add_transform_config( config )

### Description
Sets the config to use when transforming incoming data. If this is not set then nothing happens. 
The configuration is an object where the keys are express like url strings used to match against the request url, and the value is a function that will transfomr the data. 
The keys are transformed from their coherent `:paramVar/:optionalParamVar??query=:queryVar` into a proper regex form by [path-to-regexp](https://github.com/pillarjs/path-to-regexp). Refer to the docs their about proper syntax.
The transformer functions is expected to take the following parameters, the url, followed by any variables you declaired in the key ( `:variable`, `:optionalVariable?` ), and ending with the data itself.


## Arguments

	config ( Object ) - config to be used by the request's transformer. 

#### Example

	import { submit_fetch, _add_transform_config_ } from "fetch-utl";
	
	const transformConfig = {
	
	   "posts\\:number": function( url, number, data ) {
	
	       return data.reduce( function( str, entry ) {
	
	           return str + JSON.parse( entry );
	
	       }, "" );
	
	   }
	
	};
	
	add_transform_config( transformConfig );
	
	submit_fetch( "https://jsonplaceholder.typicode.com/posts/1" )
	
	   .then( function( res ) {
	
	   console.log( res );
	
	} );

# add_dummy_data_config( config )

### Description
It's the same thing as `add_transform_config`. It calls the same function. The only difference is that this data generator is called before the fetch request is made, and returns data instead of transforming it. I like using Faker in my data generator. The API suscinct, and that's all I need.

## Arguments

	config ( Object ) - keys are regex, parsed through [path-to-regexp](https://github.com/pillarjs/path-to-regexp), for the urls you want to intercept, values are the functions that will alter the data. These functions always take as parameters the url followed by any matches and finally by the data. 

#### Example
	import { submit_fetch, add_dummy_data_config } from "fetch-utl";
	
	const generatorConfig = {
	
	   "posts\\:number": function( url, number ) {
	
	       return {
	
	           data: `some generated data for ${number}.`,
	
	           random: Math.random()
	
	       };
	
	   },
	
	   ":notPost": function( url, notPost ) {
	
	       return {
	
	           params: notPost
	
	       };
	
	   }
	
	};
	
	add_dummy_data_config( generatorConfig );
	
	submit_fetch( "https://jsonplaceholder.typicode.com/posts/5" )
	
	   .then( function( res ) {
	
	       console.log( res );
	
	   } );
	
	submit_fetch( "https://jsonplaceholder.typicode.com/anything" )
	
	   .then( function( res ) {
	
	       console.log( res );
	
	   } );

# urlBuilder

### Description
The urlBuilder is an overly fancy plain old javascript object created to reduce the amount of actual code I will have to write to the point where it will let you call functions that were never written. 
Just about every function in the builder returns an updated version of the builder allowing you to chain().ad().infinitum(). This doesn't mean you are trapped within the chain like you would be with a Promise. 
Everytime you call one of the updater functions off of `urlBuilder` proper it creates a new copy of the builder. After that you are dealing with an isolated builder, creating its own url. The only call that doesn't produce a copy builder is `config` which updates the original builder. Use this when you want to set the host, or add an authcode to the header for all the calls.  
Since the urlBuilder is a plane old object you can extend your own version of it, with your own functions. The requestBuilder is just `Object.assign( urlBuilder, { ... } )`. Except, that's not entierly true. The builder is wrapped in a Proxy. The Set trap is used for debugging when you want it, the Get trap is a little more complex dispite its brevity. You can call functions that were never written. The Get trap will catch anything that doesn't actually exist and treat it as an `addQuery` function.

#### Example
	import { submit_fetch, urlBuilder } from 'fetch-util';
	
	urlBuilder.config( 'baseUrl', 'https://jsonplaceholder.typicode.com' );
	
	const logResult = res => console.log( res );
	
	const basicUrl = urlBuilder.addParam( 'posts' ).addParam(  1  );
	
	submit_fetch(  basicUrl  ).then( logResult );
	
	const urlWithQuery = urlBuilder.addParam( 'comments' ).addQuery( 'postId',  1  );
	
	submit_fetch(  urlWithQuery  ).then( logResult );
	
	// postId was never written but because of the Proxy it will be treated as .addQuery( 'postId',  1  );
const withPhantomQuery = urlBuilder.addParam( 'comments' ).postId(  1  );
	
	submit_fetch(  withPhantomQuery  ).then( logResult  );

# ReqBuilder

### Description
The ReqBuilder is an extension of the urlBuilder so it follows all of the same rules, and has all of the same functions plus a few to actually submit the call. When you want to submit a call you can call any of the REST verbs, `send()`, or just call `then`. I've secretly written my own `then` which just calls `get()` and the real `then`.  

#### Example
	import { ReqBuilder as RB } from 'fetch-util'
	
	RB.config( 'baseUrl', 'https://jsonplaceholder.typicode.com');
	
	const logResult = res => console.log( res );
	
	RB.addParam( 'posts' ).addParam(  1  ).get().then( logResult );
	
	RB.addParam( 'comments' ).postId(  1  ).then( logResult );


