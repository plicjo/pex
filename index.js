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

function defaultParse(listOrMap) {
  return joinErrors(uniqueIfList(flatten(listOrMap)));
}

function preservedKeysParse(map) {
  return map.map((innerMapOrList) => {
    if (isList(innerMapOrList)) {
      return defaultParse(innerMapOrList);
    } else {
      return preservedKeysParse(innerMapOrList);
    }
  })
}

function flatten(listOrMap) {
  return listOrMap.flatten();
}

function joinErrors(listOrMap) {
  return listOrMap.join('. ') + '.';
}

function isList(listOrMap) {
  return List.isList(listOrMap);
}

function uniqueIfList(listOrMap) {
  return isList(listOrMap) ? Set(listOrMap) : listOrMap;
}

module.exports = transformErrors;
