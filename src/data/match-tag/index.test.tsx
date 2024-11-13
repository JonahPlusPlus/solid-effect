import { Switch } from "solid-js";
import { describe, expect, test } from "vitest";
import { MatchTag } from "./index.jsx";
import { Data } from "effect";
import { render } from "@solidjs/testing-library";

const testFactory = (expected: string, value: Tagged | undefined) => {
  const Component = () => (
    <Switch fallback="Fallback">
      <MatchTag on={value} tag="Foo">
        {(v) => `Foo: ${v.value}`}
      </MatchTag>
      <MatchTag on={value} tag="Bar">
        {(v) => `Bar: ${v.value}`}
      </MatchTag>
    </Switch>
  );

  const { getByText } = render(Component);

  expect(getByText(expected)).toBeInTheDocument();
};

type Tagged = Data.TaggedEnum<{
  Foo: { value: number };
  Bar: { value: string };
  Qux: { value: null };
}>;
const Tagged = Data.taggedEnum<Tagged>();

describe.concurrent("MatchTag", () => {
  test("Case 'Foo'", () => testFactory("Foo: 5", Tagged.Foo({ value: 5 })));

  test("Case 'Bar'", () =>
    testFactory("Bar: Hello", Tagged.Bar({ value: "Hello" })));

  test("Case 'Qux'", () =>
    testFactory("Fallback", Tagged.Qux({ value: null })));

  test("undefined", () => testFactory("Fallback", undefined));
});
