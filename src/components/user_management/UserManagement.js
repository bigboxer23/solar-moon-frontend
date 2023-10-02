import { Text } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { getCustomerInfo } from "../../services/services";
const UserManagement = () => {
  useEffect(() => {
    getCustomerInfo()
      .then(({ data }) => {
        console.log("data: " + JSON.stringify(data));
        //setCustomerId(data);
        //updateLoad(false);
      })
      .catch((e) => {
        console.log("e " + e);
      });
  }, []);

  return (
    <div className={"root-page container"}>
      <Text
        variation="primary"
        as="div"
        lineHeight="1.5em"
        fontWeight={400}
        fontSize="1em"
        fontStyle="normal"
        textDecoration="none"
        width="30vw"
      >
        User Management
      </Text>
    </div>
  );
};

export default UserManagement;
