import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { Icon } from "@iconify/react";
import { MoreActions } from "@/features/auth/components/MoreActions";
import { DropdownLinkIcon } from "@/components/DropdownLinkIcon";
import { useNavigate } from "react-router-dom";

export function MobileAuthLinks() {
  const navigate = useNavigate();
  const handleLoginSelect = () => navigate("/auth/login");
  const handleSignupSelect = () => navigate("/auth/signup");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger showIcon={false}>
        <Icon icon="mdi:user" />
      </DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal collisionPadding={8}>
        <DropdownMenu.Item onSelect={handleLoginSelect}>
          <DropdownLinkIcon />
          Log in
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleSignupSelect}>
          <DropdownLinkIcon />
          Sign up
        </DropdownMenu.Item>
        <MoreActions />
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
