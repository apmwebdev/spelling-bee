import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth";
import { UserMenu } from "@/features/auth/components/headerAuth/UserMenu";
import { MobileAuthLinks } from "@/features/auth/components/MobileAuthLinks";

export function MobileAuth() {
  const user = useAppSelector(selectUser);
  if (user) return <UserMenu isMobile />;
  return <MobileAuthLinks />;
}
