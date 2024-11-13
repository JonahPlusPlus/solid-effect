import type { Meta, StoryObj } from "storybook-solidjs";

import { MapEither } from "..";
import { Either } from "effect";

const meta: Meta<typeof MapEither> = {
  component: MapEither,
  title: "either/MapEither",
  argTypes: {
    on: {
      description: "An either value or undefined.",
      type: { name: "Either<R, L> | undefined", required: true },
    },
    children: {
      description:
        "An object containing functions `onLeft` and `onRight` for mapping `on`.",
      type: {
        name: "{ onLeft: (accessor: L | (() => L)) => JSX.Element, onRight: (accessor: R | (() => R)) => JSX.Element }",
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
type Story = StoryObj<typeof MapEither<any, any>>;

export const Basic: Story = {
  args: {
    on: Either.left(32),
    children: {
      onLeft: (x: () => number) => <h1>{x()}</h1>,
      onRight: (x: () => number) => <p>{x()}</p>,
    },
    fallback: <i>Hello!</i>,
  },
};

export const Fallback: Story = {
  args: {
    on: undefined,
    children: {
      onLeft: (x: () => number) => <h1>{x()}</h1>,
      onRight: (x: () => number) => <p>{x()}</p>,
    },
    fallback: <i>Hello!</i>,
  },
};

export const Keyed: Story = {
  args: {
    on: Either.right(6),
    children: {
      onLeft: (x: number) => <h1>{x}</h1>,
      onRight: (x: number) => <p>{x}</p>,
    },
    keyed: true,
  },
};
