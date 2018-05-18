const { List, Set } = require('immutable');

function transformErrors(errors, preservedStructures=List()) {
  return errors.mapEntries(([ errorName, errorsList ]) => {
    return [errorName, parse(errorsList, preservedStructures, errorName)];
  });
}

function parse(errorsList, preservedStructures, key) {
  if(preservedStructures.includes(key)) {
    return preserveStructureParse(errorsList);
  } else {
    return flattenedParse(errorsList);
  }
}

function flattenedParse(listOrMap) {
  return joinErrors(uniqueIfList(flatten(listOrMap)));
}

function preserveStructureParse(map) {
  return map.map((innerMapOrList) => {
    if (isList(innerMapOrList)) {
      return flattenedParse(innerMapOrList);
    } else {
      return preserveStructureParse(innerMapOrList);
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
