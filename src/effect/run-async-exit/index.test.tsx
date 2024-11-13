import { describe, expect, test } from "vitest";
import { RunAsyncExit } from "..";
import { Cause, Context, Effect, Layer, ManagedRuntime, Option } from "effect";
import { render, waitFor } from "@solidjs/testing-library";
import { ErrorBoundary } from "solid-js";
import { makeRuntime } from "../../runtime";

describe("RunAsyncExit", async () => {
  test("succeed", async () => {
    const effect = Effect.succeed("Success");

    const Component = () => (
      <RunAsyncExit effect={effect}>
        {{
          onSuccess: (x) => <>{x}</>,
          onFailure: (x) => (
            <>{Cause.failureOption(x).pipe(Option.getOrUndefined)}</>
          ),
        }}
      </RunAsyncExit>
    );

    const { getByText } = render(Component);

    await waitFor(async () => expect(getByText("Success")).toBeInTheDocument());
  });

  test("fail", async () => {
    const effect = Effect.fail("Fail");

    const Component = () => (
      <ErrorBoundary fallback="Failure">
        <RunAsyncExit effect={effect}>
          {{
            onSuccess: (x) => <>Success: {x}</>,
            onFailure: (x) => (
              <>{Cause.failureOption(x).pipe(Option.getOrUndefined)}</>
            ),
          }}
        </RunAsyncExit>
      </ErrorBoundary>
    );

    const { getByText } = render(Component);

    await waitFor(async () => expect(getByText("Fail")).toBeInTheDocument());
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
      <solidRt.RunAsyncExit effect={effect}>
        {{
          onSuccess: (x) => <>{x}</>,
          onFailure: (x) => (
            <>{Cause.failureOption(x).pipe(Option.getOrUndefined)}</>
          ),
        }}
      </solidRt.RunAsyncExit>
    );

    const { getByText } = render(Component);

    await waitFor(async () => expect(getByText("5")).toBeInTheDocument());
  });
});
