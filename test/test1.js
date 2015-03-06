'use strict';

var assert = require('assert'),
    target = require('./target');

describe('target (tested by test1.js)', () => {
    it('should multiply correctly', function (done) { 
        assert.equal(9, target.multi(3, 3));
        assert.equal(6, target.multi(3, 2));
        done();
    });
    it.skip('should not show coverage info for test1.js', function(){
      console.log('test1.js is not included in coverage report');
    });
});