import Promise from 'bluebird';

Promise.config( {
    warnings: true,
    longStackTraces: true
} );

export default Promise;
