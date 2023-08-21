import { useAppSelector } from "@/app/hooks";
import { selectUser } from "../authSlice";
import { Link } from "react-router-dom";
import { UserMenu } from "./UserMenu";
import { useGetUserBaseDataQuery } from "@/features/userData/userDataApiSlice";

export function HeaderAuth() {
  const user = useAppSelector(selectUser);
  useGetUserBaseDataQuery();

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
        <Link to="/login">Log in</Link>
        <Link to="/signup">Sign up</Link>
      </>
    );
  };

  return <div className="header-auth">{content()}</div>;
}
