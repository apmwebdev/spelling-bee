import { InlineIcon } from "@iconify/react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { useLogoutMutation } from "../authApiSlice";

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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          className="account-icon"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <circle className="svg-bg" r="7" cx="12" cy="12"></circle>
          <path
            className="svg-fg"
            d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.232 7.232 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10Z"
          ></path>
        </svg>
        {/*<Icon icon="mdi:account-circle" className="account-icon" />*/}
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
