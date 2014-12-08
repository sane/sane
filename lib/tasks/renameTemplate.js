/*
 * Prepares templates starting with _ to be copied over
 */

module.exports = function renameTemplate(name){
  if(name.startsWith('_')){
    //Remove the _ (first chracter) and everything between the two dots, including one dot
    var firstChar = name.indexOf('_');
    var firstDot = name.indexOf('.');
    var secondDot = name.indexOf('.', firstDot + 1);
    return name.slice(0, firstChar) + name.slice(firstChar + 1, firstDot) + name.slice(secondDot);
  } else {
    return name;
  }
};