# CLI Learning Site — Development Specification

## Runtime
Static HTML, CSS, JavaScript, and JSON only.

## Shared runtime
src/cli/_shared/css/app.css
src/cli/_shared/js/app.js

## OS structure
src/cli/<os>/index.html
src/cli/<os>/<page>/index.html
src/cli/<os>/data/site.json
src/cli/<os>/data/search.json
src/cli/<os>/data/pages/<page>.json

## Page boot contract
Each HTML declares data-site, data-page, and data-root.
Shared app.js fetches site and page JSON and renders shared chrome plus page-specific content.

## URL behavior
Main navigation uses real folder/index.html pages, not hash navigation.
Search uses query parameters.

## Content blocks
text, cards, table, code, callout, flow, steps, command-list, links.

## Validation
JSON parse, JavaScript parse, page existence, path resolution, query persistence, mobile drawer, keyboard escape, theme persistence.
