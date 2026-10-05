# CLI Learning Site — Product Plan

## Product
This is a developer learning and reference site. It teaches how each operating system behaves in a CLI environment, the commands needed there, Unix data flow, pipelines, and reusable troubleshooting workflows.

## Problems in the previous version
1. One long hash page mixed learning, lookup, OS concepts, examples, and troubleshooting.
2. Navigation listed sections but did not express a learning path.
3. Search hid large sections instead of returning ranked useful results.
4. OS-specific differences existed, but the UI still behaved like one generic template with replaced text.
5. Beginner-essential and advanced commands had equal visual weight.
6. Mobile navigation and long tables reduced discoverability.
7. Real page URLs were missing, weakening direct access, reload, back/forward, and sharing.

## User journeys
### Learn
OS overview → essential commands → filesystem/system/network → pipeline concepts → practice scenarios.

### Look up
Search → ranked result → dedicated topic or command reference page.

### Troubleshoot
Scenario → observe → filter → extract → pass → verify.

## Information architecture per OS
- Home / learning map
- OS characteristics
- Command reference
- Filesystem
- System and process
- Network and DNS
- Packages and services
- Pipeline and shell concepts
- SSH and remote
- Practical recipes
- Troubleshooting scenarios
- Safety
- Search results

Every item is a real static page.

## Command priority
- essential: memorize / first-line daily commands
- common: frequently useful development commands
- advanced: situational or deeper diagnostic commands

## Search
Search is global within the current OS and routes to a real search page.
Results rank exact command/title matches first, then essential/common/advanced priority.

## Success criteria
- A beginner can identify what is specific to macOS vs Ubuntu.
- A user can learn why a pipeline works, not only copy it.
- A user can reach any major topic in one navigation action.
- A user can search a command and see priority, purpose, example, and destination.
- Reload, direct URL, back, and forward work on every major page.
