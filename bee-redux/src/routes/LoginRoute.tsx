import { Login } from "@/features/auth/Login";

export function LoginRoute() {
  return (
    <div className="Auth_route">
      <Login redirectTo="../puzzle/latest" />
    </div>
  );
}
