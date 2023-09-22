import { useAppSelector } from "@/app/hooks";
import { selectUser } from "../authSlice";
import { UserMenu } from "./UserMenu";
import { LoginButton } from "@/features/auth/headerAuth/LoginButton";
import { SignupButton } from "@/features/auth/headerAuth/SignupButton";

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
