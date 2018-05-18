const Immutable = require('immutable');
const assert = require('assert');
const { List, Map, Set } = require('immutable');
const transformErrors = require('./index');

it('ignores empty objects', () => {
  const errors = Immutable.fromJS({
    names: [{}, {
      first: ['Only alphanumeric characters are allowed'],
      last: ['Only alphanumeric characters are allowed'],
    }, {}],
  });

  const result = transformErrors(errors);

  assert.deepEqual(result, Map({
    names: 'Only alphanumeric characters are allowed.',
  }));
});

it('concatenates errors into a single string', () => {
  const errors = Immutable.fromJS({
    name: ['This field is required', 'Another error'],
    age: ['Only numeric characters are allowed'],
  });

  const result = transformErrors(errors);

  assert.deepEqual(result, Map({
    name: 'This field is required. Another error.',
    age: 'Only numeric characters are allowed.'
  }));
});

it('defaults to concatenating errors to the top level', () => {
  const errors = Immutable.fromJS({
    name: {
      first: ['Only alphanumeric characters are allowed'],
      last: ['Only alphanumeric characters are allowed'],
    },
  })

  const result = transformErrors(errors);

  assert.deepEqual(result, Map({
    name: 'Only alphanumeric characters are allowed.',
  }));
});

it('preserves the nested structure if specified', () => {
  const errors = Immutable.fromJS({
    names: [{}, {
      first: ['Only alphanumeric characters are allowed'],
      last: ['Only alphanumeric characters are allowed'],
    }, {}],
  })

  const result = transformErrors(errors, List(['names']));

  assert.deepEqual(result, Immutable.fromJS({
    names: [{}, {
      first: 'Only alphanumeric characters are allowed.',
      last: 'Only alphanumeric characters are allowed.',
    }, {}],
  }));
});

it('should tranform errors', () => {
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

  const result = Map(transformErrors(errors, List(['urls', 'url'])));

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
