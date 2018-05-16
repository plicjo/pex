const Immutable = require('immutable');
const assert = require('assert');
const { List, Map, Set } = require('immutable');

function flattenArray(arr) {
  return arr.reduce((memo, val, key) => [
    ...memo,
    ...val
  ]);
}

function getUniques(arr) {
  return new Set(arr);
}

function appendPeriods(data) {
  if (typeof data === 'string') {
    data = data.concat('.');
    return data;
  }
  return data.map(d => `${d}.`);
}

function getNonEmptyObs(arr) {
  return arr.filter(v => v.size > 0);
}

function preserveValues(data) {
  if (List.isList(data)) {
    return data.map(v => transformErrors(v));
  }
  return transformErrors(data);
}

function reduceObj(data) {
  if (Map.isMap(data)) {
    return data.reduce((memo, val, key) => {
      if (List.isList(val)) {
        memo = memo.concat(...val);
        return memo;
      }
      return reduceObj(val);
    }, []);
  }
  return data;
}


function transformErrors(error, ...preservedKeys) {
  return Map(error).reduce((memo, val, key) => {
    if (typeof val === 'string') {
      return {
        ...memo,
        [key]: val,
      };
    }
    if (List.isList(val) && val.every(v => typeof v === 'string')) {
      return {
        ...memo,
        [key]: appendPeriods([...val]).join(' '),
      };
    }
    if (preservedKeys.includes(key)) {
      return {
        ...memo,
        [key]: preserveValues(val),
      };
    }
    if (!preservedKeys.includes(key) && (Map.isMap(val) || List.isList(val))) {
      if (List.isList(val)) {
        return {
          ...memo,
          [key]: appendPeriods(getUniques(flattenArray(getNonEmptyObs(val).map(obj => reduceObj(obj))))).join(' '),
        };
      }
      if (Map.isMap(val)) {
        if (key === 'tag') {
          return {
            ...memo,
            [key]: appendPeriods(reduceObj(val)).join(''),
          };
        }
        return {
          ...memo,
          [key]: preserveValues(val),
        };
      }
    }
    return memo;
  }, {});
}

const errors = Immutable.fromJS({
  name: ['This field is required'],
  age: ['This field is required', 'Only numeric characters are allowed'],
  urls: [{}, {}, {
    site: {
      code: ['This site code is invalid'],
      id: ['Unsupported id'],
    }
  }],
  url: {
    site: {
      code: ['This site code is invalid'],
      id: ['Unsupported id'],
    }
  },
  tags: [{}, {
    non_field_errors: ['Only alphanumeric characters are allowed'],
    another_error: ['Only alphanumeric characters are allowed'],
    third_error: ['Third error']
  }, {}, {
    non_field_errors: [
      'Minumum length of 10 characters is required',
      'Only alphanumeric characters are allowed',
    ],
  }],
  tag: {
    nested: {
      non_field_errors: ['Only alphanumeric characters are allowed'],
    },
  },
});

const result = Map(transformErrors(errors, 'url', 'urls'));

it('should tranform errors', () => {
  assert.deepEqual(result.toJS(), {
    name: 'This field is required.',
    age: 'This field is required. Only numeric characters are allowed.',
    urls: [{}, {}, {
      site: {
        code: 'This site code is invalid.',
        id: 'Unsupported id.',
      },
    }],
    url: {
      site: {
        code: 'This site code is invalid.',
        id: 'Unsupported id.',
      },
    },
    tags: 'Only alphanumeric characters are allowed. Third error. ' +
      'Minumum length of 10 characters is required.',
    tag: 'Only alphanumeric characters are allowed.',
  });
});
