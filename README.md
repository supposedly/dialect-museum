# Orthography walkthrough
This is a quick web walkthrough of my (WIP) proposed Lebanese writing system. It'll also be able to demo **any** proposed writing system, even if it's stochastic (looking at you, *3/aa-(a)-r-(a)-b-(i/y/ee)-z-i/y/ee*), as long as you can figure out how to express it in JavaScript using the magical, not-yet-existent API. I'm not making any guarantees about speed, though.

## Development info
`npm run build` to build for production (to `/dist`) and `npm run serve` to develop.

Note that the two `Inter` files included were modified to better support the glyph `U+0269 LATIN SMALL LETTER IOTA`. Inter's maintainer has since implemented (and outdone!) those changes upstream, so the files will be removed as soon as Inter 3.18+ makes it onto Google Fonts.
