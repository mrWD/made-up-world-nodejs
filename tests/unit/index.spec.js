"use strict";
var chai = require('chai');
var expect = chai.expect;
describe('test', function () {
    it('should return a string', function () {
        expect('ci with travis').to.equal('ci with travis');
    });
});
