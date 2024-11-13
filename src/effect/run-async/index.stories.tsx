import type { Meta, StoryObj } from "storybook-solidjs";

import { RunAsync } from "..";

const meta: Meta<typeof RunAsync> = {
  component: RunAsync,
  title: "effect/RunAsync",
  argTypes: {
    effect: {
      description: "An asynchronous effect to run.",
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
        <Suspense fallback="Loading...">
          <Story />
        </Suspense>
      </ErrorBoundary>
    ),
  ],
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = StoryObj<typeof RunAsync<any, any>>;

import { Effect, pipe } from "effect";
import { Component, ErrorBoundary, Suspense } from "solid-js";

export const Basic: Story = {
  args: {
    effect: pipe(Effect.sleep(2000), Effect.andThen(Effect.succeed(32))),
    children: (x: number) => x,
  },
};

export const Error: Story = {
  args: {
    effect: pipe(
      Effect.sleep(3000),
      Effect.andThen(Effect.fail("something went wrong")),
    ),
    children: (x: number) => x,
  },
};
