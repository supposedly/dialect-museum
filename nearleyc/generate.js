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

generate.ts = generate.typescript = function (parser, exportName) {
  var output = "// Generated automatically by nearley, version " + parser.version + "\n";
  output +=  "// http://github.com/Hardmath123/nearley\n";
  output +=  "// Bypasses TS6133. Allow declared but unused functions.\n";
  output +=  "// @ts-ignore\n";
  output +=  "// @ts-nocheck\n";
  output += "function id(d: any[]): any { return d[0]; }\n";

  // i'm not using this (see comment in compile.js) and it causes errors with tokens like `2` and `3`
  /* output += parser.customTokens.map(function (token) { return "declare var " + token + ": any;\n" }).join("") */

  output += parser.body.join('\n');
  output += "\n";
  output += "interface NearleyToken {\n";
  output += "  value: any;\n";
  output += "  [key: string]: any;\n";
  output += "};\n";
  output += "\n";
  output += "interface NearleyLexer {\n";
  output += "  reset: (chunk: string, info: any) => void;\n";
  output += "  next: () => NearleyToken | undefined;\n";
  output += "  save: () => any;\n";
  output += "  formatError: (token: never) => string;\n";
  output += "  has: (tokenType: string) => boolean;\n";
  output += "};\n";
  output += "\n";
  output += "interface NearleyRule {\n";
  output += "  name: string;\n";
  output += "  symbols: NearleySymbol[];\n";
  output += "  postprocess?: (d: any[], loc?: number, reject?: {}) => any;\n";
  output += "};\n";
  output += "\n";
  output += "type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };\n";
  output += "\n";
  output += "interface Grammar {\n";
  output += "  Lexer: NearleyLexer | undefined;\n";
  output += "  ParserRules: NearleyRule[];\n";
  output += "  ParserStart: string;\n";
  output += "};\n";
  output += "\n";
  output += "const grammar: Grammar = {\n";
  output += "  Lexer: " + parser.config.lexer + ",\n";
  output += "  ParserRules: " + gen.serializeRules(parser.rules, generate.typescript.builtinPostprocessors, "  ") + ",\n";
  output += "  ParserStart: " + JSON.stringify(parser.start) + ",\n";
  output += "};\n";
  output += "\n";
  output += "export default grammar;\n";

  return output;
};

generate.typescript.builtinPostprocessors = {
  "joiner": "(d) => d.join('')",
  "arrconcat": "(d) => [d[0]].concat(d[1])",
  "arrpush": "(d) => d[0].concat([d[1]])",
  "nuller": "() => null",
  "id": "id"
};

module.exports = generate;
