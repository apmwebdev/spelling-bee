import { useAppSelector } from "@/app/hooks";
import { selectUser } from "@/features/auth";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "@/features/auth/components/headerAuth/LoginButton";
import { SignupButton } from "@/features/auth/components/headerAuth/SignupButton";

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
        {/*<Link to="/login">Log in</Link>*/}
        {/*<Link to="/signup">Sign up</Link>*/}
      </>
    );
  };

  return <div className="HeaderAuth">{content()}</div>;
}
