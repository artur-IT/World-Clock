## Project info

World Clock is a web application that allows you to view the current time in different time zones around the world. The app has main big analog clock and two small analog clocks with +1 hour and -1 hour according main clock time. Under clocks is world map divided to 24 time zones. Every Clock have own shield and 1 hand for hours.

#### Functional requirements

- Start time on main clock is actual time in UTC from local device time.
- User can grab tip and change time by dragging to another hour on shield.
- Only main big clock is interactive.
- User can change time zone by clicking time zone on map.
- User can see current time in main clock and two small clocks.
- User can see time in other time zones on map.
- When user change hour on main clock shield - time in small clocks should be updated automatically.
- When user change hour on main clock shield - time zones in world map should be updated automatically.

### Project structure

The project is a single-page application built with React. The app is styled with CSS. The app is tested with Jest and React Testing Library.

### Project goals

1. The app should be a simple and easy to use clock app.
2. The app should be responsive and work on all devices. The app should be fast and efficient.
3. The app should be secure.
4. The app should be small and lightweight.

## Coding practices

### Guidelines for clean code

- Adjust to my style of coding
- Use feedback from linters to improve the code when making changes.
- Prioritize error handling and edge cases.
- Handle errors and edge cases at the beginning of functions.
- Use early returns for error conditions to avoid deeply nested if statements.
- Place the happy path last in the function for improved readability.
- Avoid unnecessary else statements; use if-return pattern instead.
- Use guard clauses to handle preconditions and invalid states early.
- Don't add libraries without permission.
- Always add short comment to new code sections if function is not very simple and obvious and not self-explanatory.
- Suggest two or three ways to solve the problem and briefly explain why you chose the solution you did.

### Coding conventions

- **Imports:** Use absolute paths (e.g. `@/components`, `@/lib`) instead of relative (`../components`).
- **Code size:** Generate minimal length code.
- **Implementation order:** Prefer HTML5 → JavaScript → React 19.2 solutions when applicable.
- **Libraries:** Do not add libraries without permission.

### Testing

- Where: Unit tests for services and utilities; React Testing Library for components.
- Each new component must include at least one test file in the tests folder, named like the component with `.test.tsx` extension.
- Never mock unnecessarily; only mock when needed (e.g. network requests).
- Add only the minimum necessary tests.
- Do not add very simple smoke tests.
- Tests should cover helper functions so regressions stay obvious.
- Components should update correctly when their critical props or data change.
