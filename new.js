const Immutable = require('immutable');
const assert = require('assert');
const { List, Map, merge } = require('immutable');
const util = require('util');

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

function transformErrors(error, ...preservedKeys) {
  return Map(error).reduce((memo, val, key) => {
    if (preservedKeys.includes(key)) {
      return {
        ...memo,
        [key]: preserveStructure(val),
      };
    }
    else {
      return {
        ...memo,
        [key]: collectValues(val),
      };
    }
  }, {});
}


function preserveStructure(val) {
  if(val !== undefined && List.isList(val) && val.every(v => typeof v === 'string')) {
    return val.join('. ');
  }
  if(List.isList(val)) {
    return val.map(v => preserveStructure(v))
  }
  if(Map.isMap(val)) {
    return transformErrors(val)
  }
  return val;
}



function collectValues(val) {
  return 'fuck';
}

let res = transformErrors(errors, 'url', 'urls')

console.log(JSON.stringify(res, null, 2))
//
//   assert.deepEqual(result.toJS(), {
//     name: 'This field is required.',
//     age: 'This field is required. Only numeric characters are allowed.',
//     urls: [{}, {}, {
//       site: {
//         code: 'This site code is invalid.',
//         id: 'Unsupported id.',
//       },
//     }],
//     url: {
//       site: {
//         code: 'This site code is invalid.',
//         id: 'Unsupported id.',
//       },
//     },
    // tags: 'Only alphanumeric characters are allowed. Third error. ' +
    //   'Minumum length of 10 characters is required.',
//     tag: 'Only alphanumeric characters are allowed.',
//   });
// });
