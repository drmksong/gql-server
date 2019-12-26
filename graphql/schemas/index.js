import {buildSchema} from 'graphql';

const schemas = buildSchema(`
type Event {
    _id: ID!
    title: String!
    desc: String!
    price: Float!
    date: String!
    creator: User!
}    

type User {
    _id:ID!
    email: String!
    pass:String
    createdEvent: [Event!]
}

input EventInput {
    title: String!
    desc: String!
    price: Float!
    date: String!
}

input UserInput {
    email: String!
    pass: String!
}

type RootQuery {
    events: [Event!]!
}

type RootMutation {
    createEvent(eventInput: EventInput!): Event
    createUser(userInput: UserInput!): User
}

schema {
    query:RootQuery
    mutation:RootMutation
}
`);

export default schemas;