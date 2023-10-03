import { Text, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { route } = useAuthenticator((context) => [context.route]);
  const [customerId, setCustomerId] = useState("Loading...");
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    updateLoad(false);
    /*getCustomerInfo().then(({ data }) => {
      setCustomerId(data);
      updateLoad(false);
    });*/
  }, []);

  return route === "authenticated" ? (
    <div className={"root-page container"}>
      <Preloader load={load} />
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
        Welcome {user.attributes.email}
        <br />
        <div>Your customer id is {customerId}</div>
      </Text>
    </div>
  ) : (
    <div>Not logged in</div>
  );
};

export default Home;
