const generate = require('nearley/lib/generate.js');
var gen = require('./generatehelpers.js');

generate.module = generate.esmodule = function (parser, exportName) { 
  var output = "// Generated automatically by nearley, version " + parser.version + "\n"; 
  output +=  "// http://github.com/Hardmath123/nearley\n"; 
  output += "function id(x) { return x[0]; }\n"; 
  output += parser.body.join('\n'); 
  output += "export const Lexer = " + parser.config.lexer + ";\n"; 
  output += "export const ParserRules = " + gen.serializeRules(parser.rules, generate.javascript.builtinPostprocessors) + ";\n"; 
  output += "export const ParserStart = " + JSON.stringify(parser.start) + ";\n"; 
  return output; 
};

module.exports = generate;
