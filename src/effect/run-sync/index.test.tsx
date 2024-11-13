import { describe, expect, test } from "vitest";
import { RunSync } from "..";
import { Context, Effect, Layer, ManagedRuntime } from "effect";
import { render } from "@solidjs/testing-library";
import { makeRuntime } from "../../runtime";

describe("RunSync", async () => {
  test("succeed", () => {
    const effect = Effect.succeed("Hello");

    const Component = () => (
      <RunSync effect={effect}>{(x) => <>{x}</>}</RunSync>
    );

    const { getByText } = render(Component);

    expect(getByText("Hello")).toBeInTheDocument();
  });

  test("fail", () => {
    const effect = Effect.fail("Fail");

    const Component = () => (
      <RunSync effect={effect}>{(x) => <>{x}</>}</RunSync>
    );

    expect(() => {
      render(Component);
    }).toThrowError("Fail");
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
      <solidRt.RunSync effect={effect}>{(x) => <>{x}</>}</solidRt.RunSync>
    );

    const { getByText } = render(Component);

    expect(getByText("5")).toBeInTheDocument();
  });
});
