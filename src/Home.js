import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import Preloader from "./components/Preloader";
import { Card, CardHeader } from "react-bootstrap";

const Home = () => {
  const { user } = useAuthenticator((context) => [context.user]);
  const { route } = useAuthenticator((context) => [context.route]);
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
      <Card>
        <CardHeader>
          Welcome {user.attributes.email}!
          <br />
        </CardHeader>
      </Card>
      <Preloader load={load} />
    </div>
  ) : (
    <div>Not logged in</div>
  );
};

export default Home;
