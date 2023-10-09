import { InlineIcon } from "@iconify/react";
import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { useLogoutMutation } from "@/features/auth";
import { useState } from "react";

export function UserMenu() {
  const [logout] = useLogoutMutation();
  const [buttonClasses, setButtonClasses] = useState("UserMenuTrigger");

  const handleLogoutSelect = async () => {
    try {
      await logout().unwrap();
    } catch (error) {
      console.error("Failed to log out: ", error);
    }
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className={buttonClasses}
        onMouseEnter={() =>
          setButtonClasses("UserMenuTrigger UserMenuTrigger___hover")
        }
        onMouseLeave={() => setButtonClasses("UserMenuTrigger")}
      >
        <svg
          className="UserMenuTriggerAccountIcon"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          aria-hidden="true"
          role="img"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <circle
            className="UserMenuTrigger_svgBorder"
            r="11"
            cx="12"
            cy="12"
          ></circle>
          <circle
            className="UserMenuTrigger_svgBackground"
            r="7"
            cx="12"
            cy="12"
          ></circle>
          <path
            className="UserMenuTrigger_svgForeground"
            d="M12 19.2c-2.5 0-4.71-1.28-6-3.2c.03-2 4-3.1 6-3.1s5.97 1.1 6 3.1a7.232 7.232 0 0 1-6 3.2M12 5a3 3 0 0 1 3 3a3 3 0 0 1-3 3a3 3 0 0 1-3-3a3 3 0 0 1 3-3m0-3A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10c0-5.53-4.5-10-10-10Z"
          ></path>
        </svg>
      </DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal>
        <DropdownMenu.Item>
          <InlineIcon icon="heroicons-outline:light-bulb" />
          Hint Profiles
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <InlineIcon icon="mdi:puzzle-outline" />
          Puzzles
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <InlineIcon icon="tabler:letter-w" />
          Saved Words
        </DropdownMenu.Item>
        <DropdownMenu.Item>
          <InlineIcon icon="mdi:cog" />
          Account
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item onSelect={handleLogoutSelect}>
          <InlineIcon icon="mdi:logout" />
          Log Out
        </DropdownMenu.Item>
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
