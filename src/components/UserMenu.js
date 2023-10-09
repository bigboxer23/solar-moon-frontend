import { NavDropdown } from "react-bootstrap";
import { AiOutlineLogin, AiOutlineUser } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useAuthenticator } from "@aws-amplify/ui-react";

const UserMenu = () => {
  const { user } = useAuthenticator((context) => [context.user]);

  return (
    <NavDropdown
      title={<CgProfile size={30} className={"profile"} />}
      className={"userProfile gap-3"}
    >
      <div className={"d-flex ps-2 pe-2 pb-1"}>
        <CgProfile size={30} className={"profile"} />
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
        <AiOutlineLogin className={"sub-menu-icon"} /> Sign Out
      </NavDropdown.Item>
    </NavDropdown>
  );
};
export default UserMenu;
