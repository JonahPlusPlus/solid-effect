import type { Meta, StoryObj } from "storybook-solidjs";

import { MapExit } from "..";
import { Cause, Exit } from "effect";

const meta: Meta<typeof MapExit> = {
  component: MapExit,
  title: "exit/MapExit",
  argTypes: {
    on: {
      description: "An exit value or undefined.",
      type: { name: "Exit<T, E> | undefined", required: true },
    },
    children: {
      description:
        "An object containing functions `onLeft` and `onRight` for mapping `on`.",
      type: {
        name: "{ onSuccess: (accessor: T | (() => T)) => JSX.Element, onFailure: (accessor: Cause<E> | (() => Cause<E>)) => JSX.Element }",
        required: true,
      },
    },
    fallback: {
      description: "A fallback value displayed when `on` is undefined.",
      type: "JSX.Element",
    },
    keyed: {
      description: "Whether `children` should not use accessors.",
      type: "boolean",
    },
  },
};

export default meta;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Story = StoryObj<typeof MapExit<any, any>>;

export const Basic: Story = {
  args: {
    on: Exit.succeed(42),
    children: {
      onSuccess: (x: () => number) => <h1>{x()}</h1>,
      onFailure: (x: () => Cause.Cause<string>) => <p>{x().toString()}</p>,
    },
  },
};

export const Fallback: Story = {
  args: {
    on: undefined,
    children: {
      onSuccess: (x: () => number) => <h1>{x()}</h1>,
      onFailure: (x: () => Cause.Cause<string>) => <p>{x().toString()}</p>,
    },
    fallback: <i>Hello!</i>,
  },
};

export const Keyed: Story = {
  args: {
    on: Exit.fail("not found"),
    children: {
      onSuccess: (x: number) => <h1>{x}</h1>,
      onFailure: (x: Cause.Cause<string>) => <p>{x.toString()}</p>,
    },
    keyed: true,
  },
};
