function serializeRules(rules, builtinPostprocessors, extraIndent) {
  if (extraIndent == null) {
      extraIndent = ''
  }

  return '[\n    ' + rules.map(function(rule) {
      return serializeRule(rule, builtinPostprocessors);
  }).join(',\n    ') + '\n' + extraIndent + ']';
}

function dedentFunc(func) {
  var lines = func.toString().split(/\n/);

  if (lines.length === 1) {
      return [lines[0].replace(/^\s+|\s+$/g, '')];
  }

  var indent = null;
  var tail = lines.slice(1);
  for (var i = 0; i < tail.length; i++) {
      var match = /^\s*/.exec(tail[i]);
      if (match && match[0].length !== tail[i].length) {
          if (indent === null ||
              match[0].length < indent.length) {
              indent = match[0];
          }
      }
  }

  if (indent === null) {
      return lines;
  }

  return lines.map(function dedent(line) {
      if (line.slice(0, indent.length) === indent) {
          return line.slice(indent.length);
      }
      return line;
  });
}

function tabulateString(string, indent, options) {
  var lines;
  if(Array.isArray(string)) {
    lines = string;
  } else {
    lines = string.toString().split('\n');
  }

  options = options || {};
  var tabulated = lines.map(function addIndent(line, i) {
      var shouldIndent = true;

      if(i == 0 && !options.indentFirst) {
        shouldIndent = false;
      }

      if(shouldIndent) {
          return indent + line;
      } else {
          return line;
      }
  }).join('\n');

  return tabulated;
}

function serializeSymbol(s) {
  if (s instanceof RegExp) {
      return s.toString();
  } else if (s.token) {
      return s.token;
  } else {
      return JSON.stringify(s);
  }
}

function serializeRule(rule, builtinPostprocessors) {
  var ret = '{';
  ret += '"name": ' + JSON.stringify(rule.name);
  ret += ', "symbols": [' + rule.symbols.map(serializeSymbol).join(', ') + ']';
  if (rule.postprocess) {
      if(rule.postprocess.builtin) {
          rule.postprocess = builtinPostprocessors[rule.postprocess.builtin];
      }
      ret += ', "postprocess": ' + tabulateString(dedentFunc(rule.postprocess), '        ', {indentFirst: false});
  }
  ret += '}';
  return ret;
}

module.exports = {
  serializeRules,
  dedentFunc,
  tabulateString,
  serializeSymbol,
  serializeRule
};
