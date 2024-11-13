<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./public/logo-dark.svg">
    <img alt="solid-effect logo" width="200" src="./public/logo-light.svg">
  </picture>
</p>

# solid-effect

[![NPM Version](https://img.shields.io/npm/v/solid-effect)](https://www.npmjs.com/package/solid-effect)
[!![Documentation](https://img.shields.io/badge/documentation-FF4785?logo=storybook&logoColor=white)](https://jonahplusplus.dev/solid-effect/)
![License](https://img.shields.io/badge/license-MIT%2FApache--2.0-green)

solid-effect is a utility library for working with [effect-ts](https://effect.website/) in [solid-js](https://www.solidjs.com/).

With Effect, you can compose your program as "effects", small programs that include the return type, error types, and requirements as part of their type signature, which establish an API contract, making defensive programming unnecessary.

Effect comes out of the box with utilities for error handling, caching, retry, interruption, concurrency, and observability, among others.

What solid-effect does is allow you to use these utilities closer to the edge of your SolidJS app.

## Documentation

[Read the docs to see all the features + examples!](https://jonahplusplus.dev/solid-effect/)

## Any examples of use-cases for using Effect with SolidJS?

So far, I've been using Effect in my SolidJS app for my GraphQL client (service layers allow for defining configuration and better error handling) and for i18n/l10n (e.g. caching formatters based on locale).

With solid-effect, I was able to pull out some of the utilities I created for displaying results (`MapOption` and `MatchTag`) and put them into their own library and improve them, while adding more utilities that I had yet to explore.
