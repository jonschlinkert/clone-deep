/*!
 * clone-deep <https://github.com/jonschlinkert/clone-deep>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

var should = require('should');
var cloneDeep = require('./');


describe('cloneDeep()', function () {
  it('should clone a simple array', function () {
    cloneDeep(['alpha', 'beta', 'gamma']).should.eql(['alpha', 'beta', 'gamma']);
  });
  it('should clone an array with varied keys', function () {
    var val = [0, 'a', {}, [{}], [function() {}], function() {}];
    cloneDeep(val).should.eql(val);
  });
  it('should return primitives directly', function () {
    cloneDeep(0).should.equal(0);
    cloneDeep("hello world").should.equal("hello world");
  });
  it('should clone arrays', function () {
    cloneDeep([1, 2, 3]).should.eql([1, 2, 3]);
  });
  it('should clone objects', function () {
    cloneDeep({a: 1, b: 2, c: 3 }).should.eql({a: 1, b: 2, c: 3 });
  });

  it('`cloneDeep` deep clone an array of objects.', function() {
    var expected = [{ 'a': 0 }, { 'b': 1 }];
    var actual = cloneDeep(expected);

    actual.should.eql.expected;
    (actual !== expected && actual[0] !== expected[0]).should.be.true;
  });
});