import { Link } from "@/components/react-router/Link";

//TODO: Figure out how to make this look better
export function MoreActions() {
  return (
    <div className="Auth_moreActions">
      <h3>More Actions</h3>
      <ul className="Auth_moreActionsList">
        <li>
          <Link to="/auth/password_reset">Reset password</Link>
        </li>
        <li>
          <Link to="/auth/resend_confirmation">Resend confirmation email</Link>
        </li>
        <li>
          <Link to="/auth/resend_unlock">Resend account unlock email</Link>
        </li>
      </ul>
    </div>
  );
}
