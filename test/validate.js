var util = require('..');
var through = require('through2');
var File = require('vinyl');
var assert = require('assert');
var es = require('event-stream');
require('should');
require('mocha');

describe('validate()', function() {
    it('should log a checkmark', function(done) {

      // create the fake file
      var fakeFile = new File({
        contents: es.readArray(['stream', 'with', 'those', 'contents'])
      });

      // write the fake file to it
      util.validate(fakeFile);
      done()

    });
});