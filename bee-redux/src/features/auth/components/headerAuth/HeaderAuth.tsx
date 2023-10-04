import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "@/features/auth/components/headerAuth/LoginButton";
import { SignupButton } from "@/features/auth/components/headerAuth/SignupButton";
import { ResendConfirmationButton } from "@/features/auth/components/headerAuth/ResendConfirmationButton";

export function HeaderAuth() {
  const user = useAppSelector(selectUser);
  const content = () => {
    if (user) {
      return (
        <>
          <span>Welcome, {user.name}</span>
          <UserMenu />
        </>
      );
    }
    return (
      <>
        <LoginButton />
        <SignupButton />
      </>
    );
  };

  return <div className="HeaderAuth">{content()}</div>;
}
