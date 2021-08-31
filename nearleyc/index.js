#!/usr/bin/env node

var replaceExt = require('replace-ext');  // lol node.js moment

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
    .option('-e, --ext [extension]', 'Extension for new file with same name in same directory as input file (if no --out)')
    .option('-e, --export [name]', 'Variable to set parser to', 'grammar')
    .option('-q, --quiet', 'Suppress linter')
    .option('--nojs', 'Do not compile postprocessors')
    .parse(process.argv);


var input = opts.args[0] ? fs.createReadStream(opts.args[0]) : process.stdin;

/* var output = opts.out ? fs.createWriteStream(opts.out) : process.stdout; */
var output = opts.out
  ? fs.createWriteStream(opts.out)
  : (opts.ext
    ? fs.createWriteStream(replaceExt(opts.args[0], opts.ext))
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
    });
