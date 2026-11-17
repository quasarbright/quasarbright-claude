# American spelling, always

Mike is American. Use American spelling everywhere — chat, code, comments,
docstrings, commit messages, documentation, artifacts, variable names.

The ones I actually reach for by default and get wrong:

| wrong | right |
|---|---|
| colour, colours, coloured, colouring | color, colors, colored, coloring |
| behaviour, behaviours | behavior, behaviors |
| summarise, emphasise, recognise, organise, normalise | summarize, emphasize, recognize, organize, normalize |
| travelling, travelled | traveling, traveled |
| labelled, modelling, cancelled, signalled | labeled, modeling, canceled, signaled |
| centre, centred | center, centered |
| grey | gray |
| defence, licence (noun) | defense, license |
| analogue, catalogue, dialogue* | analog, catalog (*dialogue is fine) |
| whilst, amongst | while, among |

Rule of thumb for the ones not listed: `-ise` → `-ize`, `-our` → `-or`,
`-re` → `-er`, and don't double a final `l` before a suffix.

Exceptions — leave these alone, they're identifiers rather than prose:

- `aria-labelledby`, and any other HTML/CSS/API name that is spelled that way
- third-party library names, options and fields (`colour` in a UK-authored
  package stays `colour`)
- quoted text from someone else
