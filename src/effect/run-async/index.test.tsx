import { describe, expect, test } from "vitest";
import { RunAsync } from "..";
import { Context, Effect, Layer, ManagedRuntime } from "effect";
import { render, waitFor } from "@solidjs/testing-library";
import { ErrorBoundary } from "solid-js";
import { makeRuntime } from "../../runtime";

describe("RunAsync", async () => {
  test("succeed", async () => {
    const effect = Effect.succeed("Success");

    const Component = () => (
      <RunAsync effect={effect}>{(x) => <>{x}</>}</RunAsync>
    );

    const { getByText } = render(Component);

    await waitFor(async () => expect(getByText("Success")).toBeInTheDocument());
  });

  test("fail", async () => {
    const effect = Effect.fail("Fail");

    const Component = () => (
      <ErrorBoundary fallback="Failure">
        <RunAsync effect={effect}>{(x) => <>{x}</>}</RunAsync>
      </ErrorBoundary>
    );

    const { getByText } = render(Component);

    await waitFor(async () => expect(getByText("Failure")).toBeInTheDocument());
  });

  class NumberGenerator extends Context.Tag("NumberGeneratorService")<
    NumberGenerator,
    { readonly generate: Effect.Effect<number> }
  >() {}

  const NumberGeneratorLive = Layer.succeed(
    NumberGenerator,
    NumberGenerator.of({
      generate: Effect.succeed(5),
    }),
  );

  const rt = ManagedRuntime.make(NumberGeneratorLive);

  const solidRt = makeRuntime(await rt.runtime());

  test("with dependency", async () => {
    const effect = Effect.gen(function* () {
      const numberGenerator = yield* NumberGenerator;
      const number = yield* numberGenerator.generate;
      return number;
    });

    const Component = () => (
      <solidRt.RunAsync effect={effect}>{(x) => <>{x}</>}</solidRt.RunAsync>
    );

    const { getByText } = render(Component);

    await waitFor(async () => expect(getByText("5")).toBeInTheDocument());
  });
});
