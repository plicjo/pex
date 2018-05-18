const Immutable = require('immutable');
const { List, Map, Set } = require('immutable');

function transformErrors(errors) {
  return errors.mapEntries(([ key, value ]) => [ key, (value.join('. ') + '.')])
}

module.exports = transformErrors
