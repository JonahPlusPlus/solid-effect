import type { Meta, StoryObj } from "storybook-solidjs";

import { RunSyncExit } from "..";

const meta: Meta<typeof RunSyncExit> = {
  component: RunSyncExit,
  title: "effect/RunSyncExit",
  argTypes: {
    effect: {
      description: "A synchronous effect to run.",
      type: { name: "Effect<A, E, never>", required: true },
    },
    children: {
      description:
        "An object containing functions `onSuccess` and `onFailure` for mapping the exit value from `effect` to a JSX element.",
      type: {
        name: "{ onSuccess: (value: A) => JSX.Element; onFailure: (error: Cause<E>) => JSX.Element; }",
        required: true,
      },
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
type Story = StoryObj<typeof RunSyncExit<any, any>>;

import { Effect } from "effect";
import { Component, ErrorBoundary } from "solid-js";

export const Basic: Story = {
  args: {
    effect: Effect.succeed(32),
    children: {
      onSuccess: (x: number) => x,
      onFailure: () => "Something bad happened",
    },
  },
};

export const Error: Story = {
  args: {
    effect: Effect.fail("something went wrong"),
    children: {
      onSuccess: (x: number) => x,
      onFailure: () => "Something bad happened",
    },
  },
};
