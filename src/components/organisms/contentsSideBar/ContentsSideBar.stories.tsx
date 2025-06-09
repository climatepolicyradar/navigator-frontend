import { Meta, StoryObj } from "@storybook/react";

import { Columns } from "@/components/atoms/columns/Columns";
import { Badge } from "@/components/atoms/label/Badge";

import { ContentsSideBar, ISideBarItem } from "./ContentsSideBar";

const meta = {
  title: "Organisms/ContentsSideBar",
  component: ContentsSideBar,
  argTypes: {},
} satisfies Meta<typeof ContentsSideBar>;
type TStory = StoryObj<typeof ContentsSideBar>;

export default meta;

const items: ISideBarItem[] = [
  {
    id: "section-description",
    display: "Description",
  },
  {
    id: "section-documents",
    display: "Documents",
  },
  {
    id: "section-targets",
    display: "Targets",
  },
  {
    id: "section-index",
    display: "Index",
  },
  {
    id: "section-collection",
    display: "Collection",
  },
  {
    id: "section-related",
    display: "Related",
  },
];

export const InIsolation: TStory = {
  args: {
    items,
  },
};

export const OnAPage: TStory = {
  name: "On a Page",
  args: {
    items,
  },
  render: ({ ...props }) => (
    <Columns>
      <ContentsSideBar {...props} />
      <div className="flex flex-col gap-8 cols-3:col-span-2 cols-4:col-span-3">
        {items.map((item) => (
          <section id={item.id} key={item.id}>
            <h1 className="text-2xl font-bold mb-4">{item.display}</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla molestie purus eget erat eleifend, id malesuada mauris vestibulum. Nunc
              eu urna eu risus elementum ultrices. Nulla ligula lorem, consequat ut massa in, efficitur dapibus tortor. Duis sagittis porta tristique.
              Aenean sit amet urna id nunc laoreet bibendum. Aliquam sem elit, condimentum sed lacus quis, tincidunt malesuada nisi. Duis fringilla
              enim sit amet est gravida bibendum. Nam dignissim dignissim sodales. Vivamus ornare, enim in vulputate finibus, justo arcu iaculis urna,
              a scelerisque est ligula sed arcu. Aliquam hendrerit porta luctus. Donec rhoncus, ex vel eleifend tincidunt, mauris libero rutrum eros,
              condimentum vehicula odio tortor sed diam. Sed cursus ullamcorper elit et semper. Praesent a libero ultricies neque tristique suscipit
              at et lorem. Sed a augue congue tellus volutpat dictum eget mollis ante. Nullam faucibus sapien ut feugiat feugiat. Curabitur eu
              fermentum dolor. Cras a sem nec velit rutrum aliquam. Praesent facilisis sagittis risus ut blandit. Aliquam erat volutpat. Nullam
              rhoncus sapien vitae dolor aliquet, in laoreet velit aliquet. Proin fringilla tempus magna, sed auctor erat pretium ac. Curabitur
              imperdiet id elit a aliquam. Morbi dapibus sollicitudin vestibulum. Nullam ac scelerisque justo, sit amet consectetur nisl. Suspendisse
              feugiat tincidunt sollicitudin. Vestibulum pulvinar augue massa, sit amet sollicitudin eros fringilla tempor. Pellentesque habitant
              morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed orci massa, pharetra vehicula lectus non, auctor auctor
              velit. Nunc ut finibus leo. Proin dapibus sollicitudin dui, ac hendrerit augue accumsan at. Suspendisse suscipit sapien lobortis cursus
              viverra. Ut enim mi, ullamcorper in urna eget, rhoncus accumsan neque. Phasellus gravida rhoncus congue. Vivamus commodo ex at augue
              accumsan porta. Sed orci urna, semper id convallis vel, pulvinar eu est. Vivamus sagittis rutrum erat at viverra. Quisque et felis ut
              diam iaculis tempus. Aliquam in venenatis urna. Quisque eu ligula ut lacus vestibulum pulvinar. Maecenas id ante aliquet, tempus ante
              ut, auctor nisl. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla justo odio,
              sollicitudin a aliquam id, fringilla eu erat. Morbi pretium luctus justo, nec pretium quam feugiat sed. Ut fringilla accumsan sapien eu
              congue. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla facilisi. Nullam luctus,
              urna nec lacinia euismod, lacus est interdum nisl, eu rhoncus leo odio sed lectus. Curabitur in nunc ut mauris convallis lobortis sit
              amet ac nisi. Duis tincidunt ultricies risus, ac mollis ante cursus quis. Morbi cursus velit rutrum sem scelerisque facilisis. Vivamus
              commodo aliquam pretium. Praesent rutrum faucibus diam, non fermentum metus scelerisque ut. Vivamus neque tortor, finibus quis turpis
              et, consectetur fermentum justo. Nunc urna lorem, egestas eu magna eu, convallis ullamcorper ipsum. Pellentesque volutpat quis metus
              vestibulum malesuada. Mauris aliquam tortor quis tincidunt finibus. Curabitur varius nisl eget urna pretium, eget ornare dolor mollis.
              Etiam vehicula lectus diam. Ut et gravida elit. Proin et imperdiet massa, id vestibulum ipsum. Aliquam rhoncus tincidunt lorem et
              hendrerit. Ut at tellus sit amet neque mattis interdum in sed mi. Fusce sed hendrerit lectus, non imperdiet eros. Aenean tincidunt nisl
              sit amet malesuada iaculis. Sed sit amet magna justo. Nam placerat sapien enim, vel dignissim felis eleifend et. Vestibulum convallis
              bibendum elementum. Aenean condimentum dolor in dui bibendum, sit amet aliquam tellus laoreet. Nulla malesuada malesuada ullamcorper.
              Suspendisse porttitor enim urna, ac fringilla nulla tristique imperdiet. Suspendisse non fermentum tortor. Suspendisse pharetra magna
              turpis, et tristique libero faucibus a. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Nulla ut
              convallis ipsum. Sed venenatis augue ante, eu auctor orci malesuada ut. Mauris elementum pellentesque ex, non blandit libero. Nam tempor
              felis eu feugiat ornare. Aliquam at eros massa. Aliquam massa nisi, lobortis id orci quis, tincidunt fringilla odio. Donec pulvinar dui
              ac justo scelerisque, ac vulputate diam malesuada. In vulputate vestibulum consectetur. Suspendisse potenti. Morbi mollis, ex non ornare
              fermentum, eros erat porttitor lacus, eget euismod ipsum eros non ante. Nullam rhoncus velit luctus diam rhoncus, id efficitur tellus
              blandit. Ut feugiat odio vitae erat accumsan vulputate. Aenean consequat, turpis at placerat auctor, erat dui scelerisque lacus, nec
              iaculis ex ipsum non lacus. Etiam tempus, lacus in lacinia mollis, urna nisi viverra mi, vel rutrum sem sem et felis. Vivamus pulvinar
              nulla a elit viverra, a ultricies neque ultrices. Maecenas et lacus quis ipsum auctor suscipit vitae quis augue. Vivamus tempor quam id
              faucibus malesuada. Nullam blandit at lacus sed elementum. Nunc sed volutpat leo. Donec eu dolor scelerisque, ultrices mauris non,
              lacinia erat. Nunc in ipsum sit amet urna rhoncus porttitor quis et urna. Aliquam ullamcorper gravida enim, in euismod orci consequat
              at. Ut mattis risus dolor, a posuere mi ullamcorper eu. Vestibulum blandit, erat malesuada convallis faucibus, ligula velit vulputate
              elit, id mollis nisl urna pretium leo. Vestibulum laoreet condimentum lacus ut suscipit. Aenean ullamcorper porta quam, accumsan
              ultricies nisl porta quis. In nec nisl et ipsum ultrices maximus. Sed aliquam, velit non fringilla aliquet, justo purus eleifend sapien,
              ut venenatis sem eros vitae sapien. Nunc dignissim imperdiet purus, in mollis sapien. Sed lacinia tempor tellus vulputate vehicula. Nunc
              tristique erat eget velit rhoncus placerat. Phasellus sodales velit ut finibus faucibus. Donec id mauris at nulla fringilla ultrices.
              Mauris varius lectus purus, ac aliquam odio ornare nec. Sed vulputate in mauris ut feugiat.
            </p>
          </section>
        ))}
      </div>
    </Columns>
  ),
};
