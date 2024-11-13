import type { Meta, StoryObj } from "storybook-solidjs";

import { RunSync } from "..";

const meta: Meta<typeof RunSync> = {
  component: RunSync,
  title: "effect/RunSync",
  argTypes: {
    effect: {
      description: "A synchronous effect to run.",
      type: { name: "Effect<A, E, never>", required: true },
    },
    children: {
      description:
        "A function for mapping the successful Effect value from `effect` to a JSX element.",
      type: { name: "(v: A) => JSX.Element", required: true },
    },
  },
  decorators: [
    (Story: Component) => (
      <ErrorBoundary fallback={(e) => <>{e.toString()}</>}>
        <Story />
      </ErrorBoundary>
    ),
  ],
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = StoryObj<typeof RunSync<any, any>>;

import { Effect } from "effect";
import { Component, ErrorBoundary } from "solid-js";

export const Basic: Story = {
  args: {
    effect: Effect.succeed(42),
    children: (x: number) => x,
  },
};

export const Error: Story = {
  args: {
    effect: Effect.fail("something went wrong"),
    children: (x: number) => x,
  },
};
