import * as DropdownMenu from "@/components/radix-ui/radix-dropdown-menu";
import { Icon } from "@iconify/react";
import { DropdownLinkIcon } from "@/components/DropdownLinkIcon";
import { useNavigate } from "react-router-dom";

export function MobileHamburgerMenu() {
  const navigate = useNavigate();
  const handleLatestPuzzleSelect = () => {
    navigate("/puzzles/latest");
  };

  const handleAllPuzzlesSelect = () => {
    navigate("/");
  };

  const handleStatsSelect = () => {
    navigate("/");
  };

  const handleHelpSelect = () => {
    navigate("/");
  };

  const handleAboutSelect = () => {
    navigate("/");
  };

  const handleSearchSelect = () => {
    navigate("/");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger showIcon={false} className="Header_hamburger">
        <Icon icon="mdi:menu" className="DropdownMenuIconTrigger" />
      </DropdownMenu.Trigger>
      <DropdownMenu.ContentWithPortal align="start" collisionPadding={8}>
        <DropdownMenu.Item onSelect={handleLatestPuzzleSelect}>
          <DropdownLinkIcon />
          Latest Puzzle
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleAllPuzzlesSelect}>
          <DropdownLinkIcon />
          All Puzzles
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleStatsSelect}>
          <DropdownLinkIcon />
          Stats
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleHelpSelect}>
          <DropdownLinkIcon />
          Help
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleAboutSelect}>
          <DropdownLinkIcon />
          About
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={handleSearchSelect}>
          <DropdownLinkIcon />
          Search
        </DropdownMenu.Item>
      </DropdownMenu.ContentWithPortal>
    </DropdownMenu.Root>
  );
}
