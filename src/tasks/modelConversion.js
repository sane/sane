'use strict';

/*
 * Converts ember model attributes to sails model attributes and vice versa
 * Sails supports: string, text, integer, float, date, datetime, boolean, binary, array, json
 * Ember Data supports: string, number, boolean, and date
 */

module.exports = {
  toEmber: function (attributes){
    //create a deep copy so the original element does not get overwritten
    var attributesCopy = attributes.slice(0);
    for (var i in attributesCopy) {
      var attrArray = attributesCopy[i].split(':');

      //if the given attribute does not have a colon, ignore
      if (attrArray.length > 1) {
        //get the last element of the array
        var attrType = attrArray.pop();
        switch (attrType) {
          case 'text':
            attrArray.push('string');
            break;
          case 'integer':
            attrArray.push('number');
            break;
          case 'float':
            attrArray.push('number');
            break;
          case 'datetime':
            attrArray.push('date');
            break;
          case 'binary':
            attrArray.push('boolean');
            break;
          case 'array':
            //no proper equivalent on the ember side
            break;
          case 'json':
            //no proper equivalent on the ember side
            break;
          default:
            //add popped element back
            attrArray.push(attrType);
            break;
        }

        attributesCopy[i] = attrArray.join(':');
      }
    }
    return attributesCopy;
  },
  toSails: function (attributes){
    //create a deep copy so the original element does not get overwritten
    var attributesCopy = attributes.slice(0);
    for (var i in attributesCopy) {
      var attrArray = attributesCopy[i].split(':');
      //if the given attribute does not have a colon, ignore
      if (attrArray.length > 1) {
        var attrType = attrArray.pop();

        if (attrType === 'number') {
          attrArray.push('float');
        } else {
          //add popped element back
          attrArray.push(attrType);
        }

        attributesCopy[i] = attrArray.join(':');
      }
    }

    return attributesCopy;
  }
};
