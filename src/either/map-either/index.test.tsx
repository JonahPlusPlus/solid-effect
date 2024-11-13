import { describe, test, expect } from "vitest";
import { MapEither } from "./index.jsx";
import { Either } from "effect";
import { render } from "@solidjs/testing-library";

const testFactory = (
  expected: string,
  value: Either.Either<number, string> | undefined,
) => {
  const Component = () => (
    <MapEither on={value} fallback={"Fallback"}>
      {{
        onLeft: (x) => <>Left: {x()}</>,
        onRight: (x) => <>Right: {x()}</>,
      }}
    </MapEither>
  );

  const { getByText } = render(Component);

  expect(getByText(expected)).toBeInTheDocument();
};

describe.concurrent("MapOption", () => {
  test("left", () => testFactory("Left: Hello", Either.left("Hello")));

  test("right", () => testFactory("Right: 5", Either.right(5)));

  test("undefined", () => testFactory("Fallback", undefined));

  test("keyed", () => {
    const Component = () => (
      <MapEither on={Either.left("Hello")} fallback={"Fallback"} keyed>
        {{
          onLeft: (x) => <>Left: {x}</>,
          onRight: (x) => <>Right: {x}</>,
        }}
      </MapEither>
    );

    const { getByText } = render(Component);

    expect(getByText("Left: Hello")).toBeInTheDocument();
  });
});
