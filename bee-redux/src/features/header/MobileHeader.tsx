import { MobileHamburgerMenu } from "@/features/header/MobileHamburgerMenu";
import { HeaderTitle } from "@/features/header/HeaderTitle";
import { MobileAuth } from "@/features/auth/components/MobileAuth";

export function MobileHeader() {
  return (
    <div className="Header___mobile Header___common">
      <MobileHamburgerMenu />
      <HeaderTitle />
      <MobileAuth />
    </div>
  );
}
