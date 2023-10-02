import { Text } from "@aws-amplify/ui-react";
const Dashboard = () => {
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
        Dashboard
      </Text>
    </div>
  );
};

export default Dashboard;
