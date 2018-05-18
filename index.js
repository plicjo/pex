const { List, Set } = require('immutable');

function transformErrors(errors, preservedKeys=List()) {
  return errors.mapEntries(([ key, value ]) => {
    if(preservedKeys.includes(key)) {
      return [ key, preservedKeysParse(value) ];
    } else {
      return [ key, defaultParse(value) ]};
    }
  );
}

function defaultParse(list_or_map) {
  return joinErrors(uniqueIfList(flatten(list_or_map)));
}

function preservedKeysParse(map) {
  return map.map((innerMapOrList) => {
    if (List.isList(innerMapOrList)) {
      return defaultParse(innerMapOrList);
    } else {
      return preservedKeysParse(innerMapOrList);
    }
  })
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
