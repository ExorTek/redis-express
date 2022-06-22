'use strict';
require( 'dotenv' ).config( {
    path : '.env'
} );
const express = require( 'express' );
const app = express();
const redis = require( 'redis' );
const { PORT,REDIS_PASSWORD } = process.env;

app.use( express.json() );

const client = redis.createClient( {
    password : REDIS_PASSWORD
} );
( async () => {
    await client.connect();
    client.on( 'error',( err ) => {
        console.log( err );
    } );
} )();

app.post( '/',async ( req,res ) => {
    // save the data in redis
    const { data,name } = req.body;
    const response = await client.set( name,JSON.stringify(data),( error,reply ) => {
        if( error ) return error;
        return reply;
    } );
    res.json( {
        success : true,
        data : response
    } )
} );
app.get( '/',async ( req,res ) => {
    // get the data from redis
    const { name } = req.query;
    const response = await client.get( name,( err,data ) => {
        if( err ) {
            return err;
        }
        return data;
    } );
    res.json( {
        success : true,
        data : JSON.parse( response ),
    } )
} );

app.listen( PORT,() => {
    console.log( `Server is running http://localhost:${PORT} ` );
} );