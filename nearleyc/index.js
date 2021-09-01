#!/usr/bin/env node

/* following is gulpjs/replace-ext's license, as replace-ext has been reproduced here in full */
/* see the LICENSE file in this directory for nearley's license */
/* (which applies to the rest of this file and the ones in this dir) */
/*
The MIT License (MIT)

Copyright (c) 2014-2020 Blaine Bublitz <blaine.bublitz@gmail.com>, Eric Schoffstall <yo@contra.io> and other contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var path = require('path');

function replaceExt(npath, ext) {
  if (typeof npath !== 'string') {
    return npath;
  }

  if (npath.length === 0) {
    return npath;
  }

  var nFileName = path.basename(npath, path.extname(npath)) + ext;
  var nFilepath = path.join(path.dirname(npath), nFileName);

  // Because `path.join` removes the head './' from the given path.
  // This removal can cause a problem when passing the result to `require` or
  // `import`.
  if (startsWithSingleDot(npath)) {
    return '.' + path.sep + nFilepath;
  }

  return nFilepath;
}

function startsWithSingleDot(fpath) {
  var first2chars = fpath.slice(0, 2);
  return first2chars === '.' + path.sep || first2chars === './';
}

var fs = require('fs');
var nearley = require('nearley/lib/nearley.js');
var opts = require('commander');

/* var Compile = require('nearley/lib/compile.js'); */
var Compile = require('./compile.js');

var StreamWrapper = require('nearley/lib/stream.js');

var version = require('nearley/package.json').version;

opts.version(version, '-v, --version')
    .arguments('<file.ne>')
    .option('-o, --out [filename.js]', 'File to output to (defaults to stdout)', false)
    .option('-s, --suffix [extension]', 'Extension/suffix for new file with same name in same directory as input file (if no --out)')
    .option('-e, --export [name]', 'Variable to set parser to', 'grammar')
    .option('-q, --quiet', 'Suppress linter')
    .option('--nojs', 'Do not compile postprocessors')
    .parse(process.argv);


var input = opts.args[0] ? fs.createReadStream(opts.args[0]) : process.stdin;

/* var output = opts.out ? fs.createWriteStream(opts.out) : process.stdout; */
var output = opts.out
  ? fs.createWriteStream(opts.out)
  : (opts.suffix
    ? fs.createWriteStream(replaceExt(opts.args[0], opts.suffix))
    : process.stdout
  );

var parserGrammar = nearley.Grammar.fromCompiled(require('nearley/lib/nearley-language-bootstrapped.js'));
var parser = new nearley.Parser(parserGrammar);

/* var Compile = require('nearley/lib/generate.js'); */
var generate = require('./generate.js');

var lint = require('nearley/lib/lint.js');

input
    .pipe(new StreamWrapper(parser))
    .on('finish', function() {
        parser.feed('\n');
        var c = Compile(
            parser.results[0],
            Object.assign({version: version}, opts)
        );
        if (!opts.quiet) lint(c, {'out': process.stderr, 'version': version});
        output.write(generate(c, opts.export));
        output.end();
    });
