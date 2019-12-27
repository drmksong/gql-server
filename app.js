import express from 'express';
import bodyParser from 'body-parser';
import graphqlHttp from 'express-graphql';
import mongoose from 'mongoose';

import schemas from './graphql/schemas/index';
import resolver from './graphql/resolver/index';

const app = express();

//const events = [];

app.use(bodyParser.json());

/*
app.get('/', (req,res,next) => {
    res.send('Hello World!!!')
});
*/

app.use('/graphql',graphqlHttp({
    schema: schemas,
    rootValue: resolver,
    graphiql: true
}));

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-5fhnv.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
    )
    .then(() => {
        app.listen(4000);
    })
    .catch(err => {
        console.log(err);
        throw (err);
    }); 
//app.listen(4000);