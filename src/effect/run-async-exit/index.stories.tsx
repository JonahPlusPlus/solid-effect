import type { Meta, StoryObj } from "storybook-solidjs";

import { RunAsyncExit } from "..";

const meta: Meta<typeof RunAsyncExit> = {
  component: RunAsyncExit,
  title: "effect/RunAsyncExit",
  argTypes: {
    effect: {
      description: "An asynchronous effect to run.",
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
        <Suspense fallback="Loading...">
          <Story />
        </Suspense>
      </ErrorBoundary>
    ),
  ],
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = StoryObj<typeof RunAsyncExit<any, any>>;

import { Effect, pipe } from "effect";
import { Component, ErrorBoundary, Suspense } from "solid-js";

export const Basic: Story = {
  args: {
    effect: pipe(Effect.sleep(2000), Effect.andThen(Effect.succeed(32))),
    children: {
      onSuccess: (x: number) => x,
      onFailure: () => "Something bad happened",
    },
  },
};

export const Error: Story = {
  args: {
    effect: pipe(
      Effect.sleep(3000),
      Effect.andThen(Effect.fail("something went wrong")),
    ),
    children: {
      onSuccess: (x: number) => x,
      onFailure: () => "Something bad happened",
    },
  },
};
