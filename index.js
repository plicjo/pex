const Immutable = require('immutable');
const { List, Map, Set } = require('immutable');

function transformErrors(errors) {
  return errors.mapEntries(([ key, value ]) => [ key, joinErrors(value)])
}

function joinErrors(list_or_map) {
  if (Map.isMap(list_or_map)) {
    return joinArray(list_or_map.flatten());
  } else {
    return joinArray(list_or_map)
  }
}

function joinArray(array) {
  return array.join('. ') + '.';
}

module.exports = transformErrors
