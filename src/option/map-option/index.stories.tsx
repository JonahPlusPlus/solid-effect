import type { Meta, StoryObj } from "storybook-solidjs";

import { MapOption } from "..";
import { Option } from "effect";

const meta: Meta<typeof MapOption> = {
  component: MapOption,
  title: "option/MapOption",
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
type Story = StoryObj<typeof MapOption<any>>;

export const Basic: Story = {
  args: {
    on: Option.some(3),
    children: (x: () => number) => <h1>{x()}</h1>,
  },
};

export const Fallback: Story = {
  args: {
    on: undefined,
    children: (x: () => number) => <h1>{x()}</h1>,
    fallback: <i>Hello!</i>,
  },
};

export const Keyed: Story = {
  args: {
    on: Option.none(),
    children: (x: number) => <h1>{x}</h1>,
    keyed: true,
  },
};
