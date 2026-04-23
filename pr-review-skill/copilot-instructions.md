# Copilot workspace instructions

These instructions apply to all Copilot interactions in this workspace.

## Code review standards

When reviewing code in this repository:
- treat security findings as blocking by default
- require tests for all new logic
- flag any code that does not handle errors explicitly

## Preferred patterns

- use early returns to reduce nesting
- prefer explicit error handling over silent failures
- name variables after what they contain, not their type

## What to avoid

- do not suggest console.log for production debugging
- do not suggest deprecated APIs
- do not generate code with hardcoded credentials, even as examples
