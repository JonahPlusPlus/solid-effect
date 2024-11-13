![Solid Effect Logo](./assets/logov2.svg)

# Solid Effect

solid-effect is a utility library for working with [effect-ts](https://effect.website/) in [solid-js](https://www.solidjs.com/).

With Effect, you can compose your program as "effects", small programs that include the return type, error types, and requirements as part of their type signature, which establish an API contract, making defensive programming unnecessary.

Effect comes out of the box with utilities for error handling, caching, retry, interruption, concurrency, and observability, among others.

What solid-effect does is allow you to use these utilities closer to the edge of your SolidJS app.

## Any examples of use-cases for using Effect with SolidJS?

So far, I've been using Effect in my SolidJS app for my GraphQL client (service layers allow for defining configuration and better error handling) and for i18n/l10n (e.g. caching formatters based on locale).

With solid-effect, I was able to pull out some of the utilities I created for displaying results (`MapOption` and `MatchTag`) and put them into their own library and improve them, while adding more utilities that I had yet to explore.
