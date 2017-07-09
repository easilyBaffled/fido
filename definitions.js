/** ******************************************************************************************************************
 * @file All obejct definitionas.
 * @author julian <jjdanois@gmail.com>
 * @since 1.0.0
 * @date 19-Jun-2017
 *********************************************************************************************************************/
"use strict";

// @formatter:off

const str = `
/**
 * @typedef {Object} Challenge
 * @property {String} 	question
 * @property {String} 	answer
 */

/**
 * @typedef {Object} Note
 * @property {String} title
 * @property {String} body
 */

/**
 * @typedef {Object} Annotation
 * @property {String} type
 * @property {String} subType
 * @property {String} value
 */

/**
 * @typedef {Object} Attachment
 * @property {String} type
 * @property {String} name
 * @property {String} path
 */

/**
 * @typedef {String} CronString
 */

/**
 * @typedef {Object} Cron
 */

/**
 * @typedef {Object} Shared
 * @property {ObjectId}          _id
 * @property {Array<Note>}       notes
 * @property {Array<Annotation>} annotations
 * @property {Array<Attachment>} attachments
 */

/**
 * @typedef {Object} Duration
 * @property {Number} years
 * @property {Number} months
 * @property {Number} days
 * @property {Number} hours
 * @property {Number} minutes
 */

/**
 * @typedef {Object} DateTimeRange
 * @property {Date} 		start
 * @property {?Date} 		[end]		- If missing, event is instant
 * @property {?Duration} 	[duration]
 * @property {?String} 		[all]		- "day", "week", "month", "year"
 */

/**
 * @typedef {Object} ScheduleItem
 * @property {ObjectId} 		_id
 * @property {String} 			type
 * @property {?ObjectId} 		[generator]     - The event that created this or missing if enetered directly by the user somehow
 * @property {DateTimeRange}	[timeDate]      - If no generator then we should have this
 */

/**
 * A medication is anything the person can take. It can be either a prescription medication or
 * just some form of OTC medication or supplement.
 *
 * @typedef {Object} Medication
 * @property {ObjectId} [prescription]
 * @property {ObjectId} drug            
 * @property {Array<ScheduleItem>} taken
 * @property {Number} count             
 * @property {ObjectId} dosage          
 * @property {ObjectId} [event]         
 */

/**
 * @typedef {Object} Dosage
 * @property {String} name
 * @property {Array<Number>} values
 * @property {Array<String>} units
 * @property {String} format
 */

/**
 * @typedef {Object} Refill
 * @property {ObjectId} filledBy        - Who filled it
 * @property {Date} filledDate          - When was it filled
 * @property {ObjectId} [alternative]   - For generics and the like
 */

/**
 *
 * @typedef {Object} Prescription
 * @property {ObjectId} medication      - What is the prescription for
 * @property {ObjectId} [event]         - If no event then prescription is "as needed" otherwise when to take
 * @property {ObjectId} dosage          - What does it says about dosage
 * @property {ObjectId} issuedBy        - Who wrote the prescription
 * @property {Date} validDate           - What's the date on the prescription
 * @property {Array<Refill>} refills    - Every time it gets refilled, we add one of these
 * @property {Number} totalRefills      - How many refils on the prescription, to get remaining refills: "totalRefills - refills.length"
 */

/**
 * An actual real medication. This is a reference collection only. We will add more things to it in case of supplements
 * or other OTC drugs.
 *
 * @typedef {Object} Drug
 * @property {String} name
 */

/**
 * @typedef {Object} Event
 * @property {ObjectId} 		_id
 * @property {String} 			type            - "medication", "note", "user", "other"
 * @property {Cron}             [sequence]
 * @property {DateTimeRange} 	next            - Hard date generate from the sequence
 * @property {DBRef}            target          - What is it that happens
 */
 
 /**
 * @typedef {Object} User
 * @extends Shared
 * @property {String} 	        type
 * @property {String}	        firstName
 * @property {String}	        lastName
 * @property {String}	        fullName
 * @property {String}	        preferred
 * @property {Date} 	        dob
 * @property {String} 	        password
 * @property {?String}          [emailAuthDate]
 * @property {?String}          [deferAuthCode]
 * @property {Boolean}          [validated=false]
 * @property {Array<Challenge>} challenges
 * @property {Array<Medication>}  _medications      - Inactive medications for history purposes
 * @property {Array<Prescription>}  medications   - Current active medications
 * @property {Array<Event>}     events              - All events from medications and those added by the user
 */
`;


/**
 * @typedef {object} Parameters
 * @property {Request|request} [req]
 * @property {Response|response} [res]
 * @property {User} user
 * @property {*} [data]
 * @property {?Credentials} creds
 * @property {?function} respond
 * @property {?function} error
 * @property {?Array<string>} wildcard
 * @property {?function(string):?string} get
 * @property {?Object<string,string>} [params]
 * @property {?Object<string,string|boolean|Array<string|boolean>>} [query]
 * @property {?Object<string,string>} [headers]
 * @property {?Object<string,string>} [header]
 * @property {?QueryOptions} options
 * @property {function} [kill]
 */

/**
 * @typedef {object} QueryOptions
 * @property {?(String|Array<String>)} [materialize]
 * @property {Number} [recurse=1]
 * @property {object} [where]
 * @property {Number} [skip=0]
 * @property {Number} [limit=20]
 * @property {?(String|Array<String>)} project    - From project=field1,field2,-field3
 * @property {Object} [projections]
 * @property {?Object<string,number>} [sort]        - From sort=field1,-field2,field3
 * @property {Boolean} [upsert=false]
 * @property {Boolean} [lenient=false]
 * @property {Number} flags
 * @property {User} user
 * @property {Number} DEFER_PREP
 * @property {Number} UPSERT
 */

const { random, lorem } = require( 'faker' );

function getRandomIntInclusive( min, max ) {
    min = Math.ceil( min );
    max = Math.floor( max );
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
}


const typeDef = {
    String: lorem.words,
    Object: () => {},
    Number: () => getRandomIntInclusive( 1, 10 ),
    Date: () => new Date(),
    Boolean: () => !!getRandomIntInclusive( 0, 1 ),
    ObjectId: random.uuid,
    DBRef: () => 'DBRef'
};

function createType ( type, line ) {
    const isArray = type.includes( 'Array' );

    if ( isArray ) type = type.match( /<(.*)>/ )[ 1 ];

    const val = typeDef[ type ];
    if ( val ) return isArray ? [ val() ] : val();
    throw new Error( `
        Type: ${type}, 
        Got: ${typeDef[ type ]}
        Line: ${line}
    ` );
}

const defObj = str.split( '\n' ).reduce( ( def, line ) => {
    if ( line.includes( '* @typedef' ) ) {
        typeDef[ def.target ] = () => def[ def.target ]; // Save the last Object

        const target = line.match( /\s(\w+)$/ )[ 1 ];
        def.target = target;
        def[ target ] = {};
    }
    else if ( line.includes( '* @property' ) ) {
        const [ , type, name ] = line.match( /{??([a-zA-Z<>]*)}\s+\[?(\w+)\]?/ );
        def[ def.target ][ name ] = createType( type, line );
    }
    return def;
}, { target: '' } );


console.log( defObj );