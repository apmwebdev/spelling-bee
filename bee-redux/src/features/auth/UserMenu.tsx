import { Icon, InlineIcon } from "@iconify/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useLogoutMutation } from "../api/apiSlice";

export function UserMenu() {
  const [logout] = useLogoutMutation();

  const handleLogoutSelect = async () => {
    try {
      await logout(null).then((response) => console.log(response));
    } catch (error) {
      console.log("Failed to log out: ", error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="user-menu-trigger">
        <Icon icon="mdi:account-circle" className="account-icon" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="user-menu-content"
          avoidCollisions={true}
          collisionPadding={24}
        >
          <DropdownMenu.Item className="menu-item">
            <InlineIcon icon="heroicons-outline:light-bulb" />
            Hint Profiles
          </DropdownMenu.Item>
          <DropdownMenu.Item className="menu-item">
            <InlineIcon icon="mdi:puzzle-outline" />
            Puzzles
          </DropdownMenu.Item>
          <DropdownMenu.Item className="menu-item">
            <InlineIcon icon="tabler:letter-w" />
            Saved Words
          </DropdownMenu.Item>
          <DropdownMenu.Item className="menu-item">
            <InlineIcon icon="mdi:cog" />
            Account
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="separator" />
          <DropdownMenu.Item
            className="menu-item"
            onSelect={handleLogoutSelect}
          >
            <InlineIcon icon="mdi:logout" />
            Log Out
          </DropdownMenu.Item>
          <DropdownMenu.Arrow className="arrow" width={10} height={5} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
