import { Text, useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { Auth } from "aws-amplify";
import Preloader from "./components/Preloader";

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { route } = useAuthenticator((context) => [context.route]);
  const [customerId, setCustomerId] = useState("Loading...");
  const [load, updateLoad] = useState(true);

  useEffect(() => {
    //console.log("use effect " + user.attributes.email);
    fetchRemote();
  }, []);

  async function fetchRemote() {
    getJwt()
      .then((jwt) => fetchAPI(jwt))
      .catch(() => console.log("not logged in"));
  }
  async function getJwt() {
    return (await Auth.currentSession()).getAccessToken().getJwtToken();
  }

  const fetchAPI = (jwt) => {
    //console.log("jwt: " + jwt);
    const headers = {
      Authorization: `Bearer ${jwt}`,
    };

    return fetch("/simple", {
      method: "GET",
      headers,
    })
      .then((response) => response.text())
      .then((data) => {
        setCustomerId(data);
        updateLoad(false);
      });
  };

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
