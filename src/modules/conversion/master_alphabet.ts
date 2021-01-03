import { readFileSync } from 'fs';

export const letters = {};
let readingLetters = false;

// legit not sure how this path works, like if it 100% has to be from project root or why it can't just be ./grammar.ne
const grammarPath = `src/modules/conversion/grammar.ne`;

try {
    const content = readFileSync(grammarPath, `utf-8`);
    content.split(/\r?\n/).forEach(line => {
      if (line.startsWith(`#`) && line.endsWith(`LETTERS #`)) {
        readingLetters = line.startsWith(`# BEGIN`);
        return;
      }
      if (!readingLetters) {
        return;
      }
      if (line.trim().startsWith(`#`)) {
        return;
      }
      const match = line.match(/(\w+) -> "(.+?)"/);
      if (match) {
        letters[match[1]] = match[2];
        if (!/^[A-Z]$/.test(match[1][0])) {
          // as a dot-notation alternative
          letters[`_${match[1]}`] = match[2];
        }
      }
    });
} catch (e) {
    console.error(e);
}
