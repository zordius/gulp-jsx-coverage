'use strict';

var assert = require('assert'),
    target = require('./target');

describe('target (tested by test1.js)', () => {
    it('should multiply correctly', function (done) { 
        assert.equal(9, target.multi(3, 3));
        assert.equal(6, target.multi(3, 2));
        done();
    });

    xit('should not show coverage info for test1.js', function(){
      console.log('test1.js is not included in coverage report');
    });

    it('should handle es6 template string correctly', function () {
        assert.equal(`<div>
 <h1>test title</h1>
 <p>this is a test</p>
</div>`, target.string('test title', 'this is a test'));
    });
});
