import { describe, expect, test } from "vitest";
import { RunSyncExit } from "..";
import { Cause, Context, Effect, Layer, ManagedRuntime, Option } from "effect";
import { render } from "@solidjs/testing-library";
import { makeRuntime } from "../../runtime";

describe("RunSyncExit", async () => {
  test("succeed", () => {
    const effect = Effect.succeed("Hello");

    const Component = () => (
      <RunSyncExit effect={effect}>
        {{
          onSuccess: (x) => <>Success: {x}</>,
          onFailure: (x) => (
            <>Failure: {Cause.failureOption(x).pipe(Option.getOrUndefined)}</>
          ),
        }}
      </RunSyncExit>
    );

    const { getByText } = render(Component);

    expect(getByText("Success: Hello")).toBeInTheDocument();
  });

  test("fail", () => {
    const effect = Effect.fail(5);

    const Component = () => (
      <RunSyncExit effect={effect}>
        {{
          onSuccess: (x) => <>Success: {x}</>,
          onFailure: (x) => (
            <>Failure: {Cause.failureOption(x).pipe(Option.getOrUndefined)}</>
          ),
        }}
      </RunSyncExit>
    );

    const { getByText } = render(Component);

    expect(getByText("Failure: 5")).toBeInTheDocument();
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

  test("with dependency", () => {
    const effect = Effect.gen(function* () {
      const numberGenerator = yield* NumberGenerator;
      const number = yield* numberGenerator.generate;
      return number;
    });

    const Component = () => (
      <solidRt.RunSyncExit effect={effect}>
        {{
          onSuccess: (x) => <>Success: {x}</>,
          onFailure: (x) => (
            <>Failure: {Cause.failureOption(x).pipe(Option.getOrUndefined)}</>
          ),
        }}
      </solidRt.RunSyncExit>
    );

    const { getByText } = render(Component);

    expect(getByText("Success: 5")).toBeInTheDocument();
  });
});
