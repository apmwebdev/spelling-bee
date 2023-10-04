import { Login } from "@/features/auth";

export function LoginRoute() {
  return (
    <div className="Auth_route">
      <Login redirectTo="../puzzle/latest" />
    </div>
  );
}
