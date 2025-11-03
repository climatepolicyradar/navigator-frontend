import { Meta, StoryObj } from "@storybook/nextjs";

import { ViewMore } from "./ViewMore";

const meta = {
  title: "Molecules/ViewMore",
  component: ViewMore,
  argTypes: {},
} satisfies Meta<typeof ViewMore>;
type TStory = StoryObj<typeof ViewMore>;

export default meta;

const LOREM_IPSUM_LINES: string[] = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam interdum iaculis feugiat. Nulla eu tincidunt nibh, quis pharetra nulla. Donec odio velit, mattis non sodales sollicitudin, vehicula laoreet turpis. Suspendisse sed finibus mauris, eget faucibus lorem. Maecenas et feugiat tortor, a auctor elit. Nam ac ipsum nec ipsum auctor porta. Etiam viverra turpis efficitur luctus aliquet. Quisque bibendum sollicitudin suscipit. Nunc et nulla eros. Integer lobortis ac elit vehicula aliquet. Suspendisse eget neque ut velit egestas mollis posuere quis magna.`,
  `Maecenas laoreet congue eleifend. Pellentesque pretium leo ut vestibulum commodo. Integer ac turpis nibh. Etiam commodo, nunc malesuada pellentesque pulvinar, dui urna dapibus elit, at suscipit ligula augue malesuada ante. Nunc blandit, ex vitae porta vehicula, lorem risus vehicula lorem, id varius dolor lacus sit amet metus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras ac leo eget diam tristique molestie. Nulla dapibus feugiat magna varius volutpat. Proin tincidunt fringilla pretium. Cras convallis velit in urna aliquam, a pharetra ex fermentum. Duis eget semper neque. Aliquam feugiat ultrices nunc ac aliquam.`,
  `Suspendisse eget interdum neque. Nam eleifend ex urna, eget imperdiet nibh bibendum ac. Nulla quis nisl nec odio rhoncus luctus non ac odio. Aliquam nec porttitor dui. Fusce ac dui et magna sagittis pharetra. Fusce tempor urna semper congue rhoncus. Praesent semper sapien dui, eu porttitor augue commodo nec. Pellentesque quis massa orci. Cras vestibulum elit at orci tincidunt efficitur. Phasellus maximus sem in tellus egestas pellentesque. Nulla odio turpis, placerat eget dictum vitae, auctor vel libero.`,
  `Ut molestie ante eleifend, rhoncus orci imperdiet, rutrum lacus. Maecenas hendrerit id enim vitae semper. Quisque venenatis ligula eget quam pellentesque mattis. Proin ac sem imperdiet, sodales ligula quis, imperdiet mauris. Proin semper eros in scelerisque aliquet. Proin non nisl accumsan risus tempus volutpat. Integer rutrum neque id elit dignissim, non consequat velit tempor. Duis vehicula gravida arcu, vel efficitur arcu semper et.`,
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec laoreet mi quis scelerisque cursus. Maecenas neque massa, varius ac neque vel, auctor suscipit arcu. Nunc metus tellus, pretium vel cursus sed, pellentesque consequat justo. Phasellus vehicula velit a ante ultrices, eget volutpat mi suscipit. Sed facilisis velit vel turpis scelerisque blandit. Donec molestie dui quis consequat convallis. Donec vitae diam turpis.`,
];

export const PlainText: TStory = {
  args: {
    children: LOREM_IPSUM_LINES.join(" "),
    maxLines: 4,
  },
};

export const HTMLContent: TStory = {
  args: {
    children: LOREM_IPSUM_LINES.map((line, lineIndex) => (
      <p key={lineIndex} className="not-last:mb-6">
        {line}
      </p>
    )),
    maxHeight: 96,
  },
};

export const NoCutoff: TStory = {
  args: {
    children: LOREM_IPSUM_LINES[0].split(".")[0],
    maxLines: 4,
  },
};
