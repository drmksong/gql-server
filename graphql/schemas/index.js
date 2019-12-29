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
    createdEvents: [Event!]
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type Booking {
    _id: ID!
    user: User!
    event: Event!
    createdAt: String! 
    updatedAt: String!
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
    bookings: [Booking!]!
    login(email: String!, pass: String!): AuthData!
}

type RootMutation {
    createEvent(eventInput: EventInput!): Event
    createUser(userInput: UserInput!): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Event!
}

schema {
    query:RootQuery
    mutation:RootMutation
}
`);

export default schemas;