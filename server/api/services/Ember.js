/**
 * Ember service
 *
 * @module Ember
 */

var _ = require( 'lodash' ),
  pluralize = require( 'pluralize' );

module.exports = {
  linkAssociations: function ( model, records ) {
    if ( !Array.isArray( records ) ) records = [ records ];
    var modelPlural = pluralize( model.identity );

    return _.map( records, function ( record ) {
      var links = {};
      _.each( model.associations, function ( assoc ) {
        if ( assoc.type == "collection" ) {
          links[ assoc.alias ] = sails.config.blueprints.prefix + "/" + modelPlural + "/" + record.id + "/" + assoc.alias;
        }
      } );
      if ( _.size( links ) > 0 ) {
        record.links = links;
      }
      return record;
    } );
  }

};
