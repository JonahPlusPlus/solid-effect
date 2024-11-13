import { describe, test, expect } from "vitest";
import { MapOption } from "./index.jsx";
import { Option } from "effect";
import { render } from "@solidjs/testing-library";

const testFactory = (
  expected: string,
  value: Option.Option<number> | undefined,
) => {
  const Component = () => (
    <MapOption on={value} fallback="Fallback">
      {(x) => <>{x()}</>}
    </MapOption>
  );

  const { getByText } = render(Component);

  expect(getByText(expected)).toBeInTheDocument();
};

describe.concurrent("MapOption", () => {
  test("some", () => testFactory("5", Option.some(5)));

  test("none", () => testFactory("Fallback", Option.none()));

  test("undefined", () => testFactory("Fallback", undefined));

  test("keyed", () => {
    const Component = () => (
      <MapOption on={Option.some("Hello")} fallback="Fallback" keyed>
        {(x) => <>{x}</>}
      </MapOption>
    );

    const { getByText } = render(Component);

    expect(getByText("Hello")).toBeInTheDocument();
  });
});
