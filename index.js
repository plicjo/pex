const Immutable = require('immutable');
const { List, Map, Set } = require('immutable');

function transformErrors(errors) {
  return errors.mapEntries(([ key, value ]) => [ key, joinErrors(value)]);
}

function joinErrors(list_or_map) {
  return joinArray(flatten(list_or_map));
}

function joinArray(array) {
  return uniqueIfList(array).join('. ') + '.';
}

function flatten(array) {
  return array.flatten();
}

function uniqueIfList(list_or_map) {
  return Map.isMap(list_or_map) ? list_or_map : Set(list_or_map);
}

module.exports = transformErrors;
