import { NavDropdown } from "react-bootstrap";
import { AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Avatar from "react-avatar";
import { MdLogin } from "react-icons/md";

const UserMenu = () => {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <NavDropdown
      title={
        <Avatar
          name={user.attributes.name}
          size={48}
          textSizeRatio={2}
          round={true}
        />
      }
      className={"userProfile gap-3 profile"}
    >
      <div className={"d-flex ps-2 pe-2 pb-1"}>
        <Avatar
          name={user.attributes.name}
          size={40}
          textSizeRatio={2}
          round={true}
        />
        <div className={"ms-3"}>
          <div className={"fw-bolder smaller-text"}>
            {user.attributes.email}
          </div>
          <div className={"text-body-secondary smaller-text"}>
            {user.attributes.name}
          </div>
        </div>
      </div>
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to="userManagement">
        <AiOutlineUser className={"sub-menu-icon"} />
        Profile
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item as={Link} to="/" onClick={() => signOut()}>
        <MdLogin className={"sub-menu-icon"} /> Sign Out
      </NavDropdown.Item>
    </NavDropdown>
  );
};
export default UserMenu;
