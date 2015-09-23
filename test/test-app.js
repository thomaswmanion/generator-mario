'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('aowp-marionette:app', function() {
  describe('default', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          someOption: true,
          projectName: 'demo-application'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc'
      ]);
    });
    it('sets name', function() {
      assert.fileContent('package.json', /"name": "demo-application"/);
    });
  });

  describe('with arcanist file default URL', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          someOption: true,
          phabricatorDeps: true
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc',
        '.arcconfig',
        '.arclint'
      ]);
    });
    it('sets phabricator uri', function() {
      assert.fileContent('.arcconfig', /conduit_uri" : "http:\/\/127.0.0.1/);
    });
  });

  describe('with arcanist and specified URL', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          someOption: true,
          phabricatorDeps: true,
          phabricatorIP: 'phabricator.mydomain.com'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc',
        '.arcconfig',
        '.arclint'
      ]);
    });
    it('sets default phabricator uri', function() {
      assert.fileContent('.arcconfig', /conduit_uri" : "http:\/\/phabricator.mydomain.com/);
    });
  });

  describe('with tests in separate directory', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          someOption: true,
          phabricatorDeps: true,
          phabricatorIP: 'phabricator.mydomain.com',
          tests: 'separate'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc',
        '.arcconfig',
        '.arclint',
        'karma.conf.js',
        'test/karma-test-main.js'
      ]);
    });
    it('karma.conf.js with configuration for separate dirs', function() {
      assert.fileContent('karma.conf.js', /pattern: 'test\/apps/);
    });
    it('karma-test-main.js for source in separate directory', function() {
      assert.fileContent('test/karma-test-main.js', /var SRC_REGEXP = \/\(test\)\\\.js/);
    });
  });

  describe('with tests in app directory', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          someOption: true,
          phabricatorDeps: true,
          phabricatorIP: 'phabricator.mydomain.com',
          tests: 'appcode'
        })
        .on('end', done);
    });

    it('creates files', function() {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc',
        '.arcconfig',
        '.arclint',
        'karma.conf.js',
        'test/karma-test-main.js'
      ]);
    });
    it('karma-test-main.js for source in appcode directory', function() {
      assert.fileContent('test/karma-test-main.js', /var SRC_REGEXP = \/app/);
    });
  });

  describe('grunt setup ES6', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          buildTool: 'grunt',
          ecma: 'ECMAScript 2015 (ES6)'
        })
        .on('end', done);
    });

    it('should copy grunt files', function() {
      assert.file(['Gruntfile.js', 'grunt-tasks']);
      assert.noFile(['Gulpfile.js', 'webpack.config.js']);
    });

    it('should copy package.json with grunt packages', function() {
      assert.file(['package.json']);
      assert.fileContent('package.json', /.grunt-/);
    });

    it('should have babel package in package.json', function() {
      assert.file(['package.json']);
      assert.fileContent('package.json', /grunt-babel/);
    });

    it('should have babelPreprocessor in karma.conf.js', function() {
      assert.file(['karma.conf.js']);
      assert.fileContent('karma.conf.js', /babelPreprocessor: {/);
    });

    it('should have esnext option in .jshintrc', function() {
      assert.file(['.jshintrc']);
      assert.fileContent('.jshintrc', /"esnext": true/);
    });
  });

  describe('gulp setup', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          buildTool: 'gulp'
        })
        .on('end', done);
    });

    it('should copy gulp file', function() {
      assert.file(['Gulpfile.js']);
      assert.noFile(['Gruntfile.js', 'grunt-tasks', 'webpack.config.js']);
    });

    it('should copy package.json with gulp packages', function() {
      assert.file(['package.json']);
      assert.fileContent('package.json', /.gulp-/);
    });
  });

  describe('webpack setup', function() {
    before(function(done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inDir(path.join(os.tmpdir(), './temp-test'))
        .withOptions({ 'skip-install': true })
        .withPrompt({
          buildTool: 'webpack (experimental)'
        })
        .on('end', done);
    });

    it('should copy webpack files', function() {
      assert.file(['Gruntfile.js', 'webpack.config.js']);
      assert.noFile(['Gulpfile.js']);
    });

    it('should copy package.json with grunt packages', function() {
      assert.file(['package.json']);
      assert.fileContent('package.json', /.grunt-/);
    });
  });
});
