'use strict';

var assert = require('assert'),
    target = require('./target');

describe('test1.js coverage', function () {
    it('should covered', function (done) { 
        assert.equal(9, target.multi(3, 3));
        assert.equal(6, target.multi(3, 2));
        done();
    });
});