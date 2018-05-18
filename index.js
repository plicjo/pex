const Immutable = require('immutable');
const { List, Map, Set } = require('immutable');

function transformErrors(errors) {
  return errors.mapEntries(([ key, value ]) => [ key, joinErrors(value)])
}

function joinErrors(list_or_map) {
  if (Map.isMap(list_or_map)) {
    return joinArray(flatten(list_or_map));
  } else {
    return joinArray(list_or_map)
  }
}

function joinArray(array) {
  return uniqueIfList(flatten(array)).join('. ') + '.';
}

function flatten(array) {
  return array.flatten();
}

function uniqueIfList(list_or_map) {
  if (Map.isMap(list_or_map)) {
    return list_or_map;
  } else {
    return Set(list_or_map);
  }
}

module.exports = transformErrors
