import { selectUser, Signup } from "@/features/auth";
import { useAppSelector } from "@/app/hooks";
import { Navigate } from "react-router-dom";

export function SignupRoute() {
  const user = useAppSelector(selectUser);

  if (user) return <Navigate to="/puzzle/latest" />;
  return (
    <div className="Auth_route">
      <h2>Sign Up</h2>
      <Signup />
    </div>
  );
}
