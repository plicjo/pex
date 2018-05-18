const Immutable = require('immutable');
const { List, Map, Set } = require('immutable');

function transformErrors(errors) {
  return errors.mapEntries(([ key, value ]) => [ key, combineErrors(value)]);
}

function combineErrors(list_or_map) {
  return joinErrors(flatten(list_or_map));
}

function joinErrors(list_or_map) {
  return uniqueIfList(list_or_map).join('. ') + '.';
}

function flatten(list_or_map) {
  return list_or_map.flatten();
}

function uniqueIfList(list_or_map) {
  return List.isList(list_or_map) ? Set(list_or_map) : list_or_map;
}

module.exports = transformErrors;
