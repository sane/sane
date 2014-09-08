import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  coalesceFindRequests: true,
  namespace: 'api/v1',
  //this is dependent on production/development environment 
  //It is configured in config/environment.js
  host: ClientENV.hostUrl
});