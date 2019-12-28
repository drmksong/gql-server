import bookingResolver from './booking';
import eventsResolver from './events';
import userResolver from './user';

const graphQlResolvers = {...userResolver, ...eventsResolver, ...bookingResolver};
export default graphQlResolvers;