import { NavigationMenu } from "@base-ui/react";
import { LucideMenu } from "lucide-react";
import { ReactNode } from "react";

import { ExternalLink } from "@/components/ExternalLink";
import { LinkWithQuery } from "@/components/LinkWithQuery";
import { TMenuLink } from "@/types";

interface IProps {
  icon?: ReactNode;
  links: TMenuLink[];
}

const MainMenu = ({ icon, links }: IProps) => {
  const triggerContent = icon || <LucideMenu size={24} className="text-white" />;

  return (
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item className="flex items-center">
          <NavigationMenu.Trigger className="group">{triggerContent}</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <ul className="p-2 bg-white border border-gray-200 rounded-md shadow-lg text-sm text-gray-700 leading-4 font-medium">
              {links.map(({ text, href, external, cy }) => {
                const cyValue = `navigation-${cy}`;
                const linkClasses = "block p-2 pr-8 rounded-sm hover:bg-gray-100 hover:text-gray-950";
                const linkElement = external ? (
                  <ExternalLink url={href} cy={cyValue} className={linkClasses}>
                    {text}
                  </ExternalLink>
                ) : (
                  <LinkWithQuery href={href} cypress={cy} className={linkClasses}>
                    {text}
                  </LinkWithQuery>
                );

                return <li key={cy}>{linkElement}</li>;
              })}
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner sideOffset={8} align="end">
          <NavigationMenu.Popup>
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  );
};
export default MainMenu;
