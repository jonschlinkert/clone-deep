'use strict';

require('mocha');
var assert = require('assert');
var clone = require('./');

describe('cloneDeep()', function() {
  it('should clone arrays', function() {
    assert.deepEqual(clone(['alpha', 'beta', 'gamma']), ['alpha', 'beta', 'gamma']);
    assert.deepEqual(clone([1, 2, 3]), [1, 2, 3]);

    var a = [{ 'a': 0 }, { 'b': 1 }];
    var b = clone(a);

    assert.deepEqual(b, a);
    assert.deepEqual(b[0], a[0]);

    var val = [0, 'a', {}, [{}], [function() {}], function() {}];
    assert.deepEqual(clone(val), val);
  });

  it('should deep clone object', function() {
    var one = {a: 'b'};
    var two = clone(one);
    two.c = 'd';
    assert.notDeepEqual(one, two);
  });

  it('should deep clone arrays', function() {
    var one = {a: 'b'};
    var arr1 = [one];
    var arr2 = clone(arr1);
    one.c = 'd';
    assert.notDeepEqual(arr1, arr2);
  });

  it('should return primitives', function() {
    assert.equal(clone(0), 0);
    assert.equal(clone('foo'), 'foo');
  });

  it('should clone a regex', function() {
    assert.deepEqual(clone(/foo/g), /foo/g);
  });

  it('should clone objects', function() {
    assert.deepEqual(clone({a: 1, b: 2, c: 3 }), {a: 1, b: 2, c: 3 });
  });
});
