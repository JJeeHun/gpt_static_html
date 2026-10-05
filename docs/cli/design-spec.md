# CLI Learning Site — Design Specification

## Layout
Desktop uses persistent left navigation, a sticky top utility bar, and a focused reading column.
Mobile turns navigation into an overlay drawer and keeps content single-column.

## Navigation
Sidebar groups: Learn, System, Practice, Safety.
Every entry is a real page link and the current page is highlighted.
Group labels stay consistent across OSes, while page content can differ.

## Header
- Menu open/close
- Current OS and page context
- Persistent search
- OS switch
- Theme toggle

## Search UX
Search is a primary task and stays visible on desktop.
Submit navigates to a real search result page.
Mobile search remains visible by wrapping below the utility row rather than disappearing.
Search results show type, priority, title or command, explanation, and target.

## Visual hierarchy
Page category → H1 topic → learning promise → key content → next recommended page.

## Color
Dark mode is default.
macOS uses cool cyan/blue accents.
Ubuntu uses warm orange accents.
Success, warning, and danger colors remain semantic and stable.

## Components
Learning path cards, fact cards, priority chips, command cards, concept flows, code blocks with copy, notes, warnings, scenario steps, previous/next navigation.
