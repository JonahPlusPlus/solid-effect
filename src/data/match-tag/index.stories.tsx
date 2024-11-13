import type { Meta, StoryObj } from "storybook-solidjs";

import { MatchTag } from "..";
import { Data } from "effect";
import { Component, JSX, Switch } from "solid-js";

const meta: Meta<typeof MatchTag> = {
  component: MatchTag,
  title: "data/MatchTag",
  decorators: [
    (Story: Component) => (
      <Switch>
        <Story />
      </Switch>
    ),
  ],
  argTypes: {
    on: {
      description: "A tagged value.",
      type: { name: "T extends { _tag: string }", required: true },
    },
    tag: {
      description: "The tag being matched.",
      type: { name: 'S extends T["_tag"]', required: true },
    },
    children: {
      description: "A function for mapping `on`",
      type: {
        name: "(value: Extract<T, { _tag: S }>) => JSX.Element",
        required: true,
      },
    },
  },
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = StoryObj<typeof MatchTag<any, any>>;

type Tagged = Data.TaggedEnum<{
  Foo: { value: JSX.Element };
  Bar: { value: string };
  Qux: { value: null };
}>;
const Tagged = Data.taggedEnum<Tagged>();

export const Basic: Story = {
  args: {
    on: Tagged.Bar({ value: "Hello" }),
    tag: "Bar",
    children: (s: Tagged & { _tag: "Bar" }) => s.value.toUpperCase(),
  },
};
