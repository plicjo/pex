const Immutable = require('immutable');
const { List, Set } = require('immutable');

function transformErrors(errors, preserveKeys=[]) {
  return errors.mapEntries(([ key, value ]) => [ key, parseErrors(value)]);
}

function parseErrors(list_or_map) {
  return joinErrors(uniqueIfList(flatten(list_or_map)));
}

function flatten(list_or_map) {
  return list_or_map.flatten();
}

function joinErrors(list_or_map) {
  return list_or_map.join('. ') + '.';
}

function uniqueIfList(list_or_map) {
  return List.isList(list_or_map) ? Set(list_or_map) : list_or_map;
}

module.exports = transformErrors;
