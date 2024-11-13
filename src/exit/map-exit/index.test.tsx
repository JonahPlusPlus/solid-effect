import { describe, test, expect } from "vitest";
import { MapExit } from "./index.jsx";
import { Exit } from "effect";
import { render } from "@solidjs/testing-library";

const testFactory = (
  expected: string,
  value: Exit.Exit<number, string> | undefined,
) => {
  const Component = () => (
    <MapExit on={value} fallback={"Fallback"}>
      {{
        onSuccess: (t) => <>Success: {t()}</>,
        onFailure: (f) => <>Failure: {f().toString()}</>,
      }}
    </MapExit>
  );

  const { getByText } = render(Component);

  expect(getByText(expected)).toBeInTheDocument();
};

describe.concurrent("MapOption", () => {
  test("failure", () =>
    testFactory("Failure: Error: Hello", Exit.fail("Hello")));

  test("success", () => testFactory("Success: 5", Exit.succeed(5)));

  test("undefined", () => testFactory("Fallback", undefined));
});
