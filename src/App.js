import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { ThemeProvider, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Header } from "./login/Header";
import { SignInFooter } from "./login/SignInFooter";
import { Footer } from "./login/Footer";
import Home from "./Home";

Amplify.configure(awsExports);

function App() {
  const theme = {
    name: "my-theme",
    tokens: {
      colors: {
        font: {
          primary: "#ffffff",
        },

        brand: {
          primary: {
            10: { value: "rgba(81,120,194,.1)" },
            20: { value: "rgba(81,120,194,.2)" },
            40: { value: "rgba(81,120,194,.4)" },
            60: { value: "rgba(81,120,194,.6)" },
            80: { value: "rgba(81,120,194,1)" },
            90: { value: "rgba(81,120,194,.9)" },
            100: { value: "rgba(81,120,194,1)" },
          },
          secondary: {
            10: { value: "rgba(240,207,96,.1)" },
            20: { value: "rgba(240,207,96,.2)" },
            40: { value: "rgba(240,207,96,.4)" },
            60: { value: "rgba(240,207,96,.6)" },
            80: { value: "rgba(240,207,96,.8)" },
            90: { value: "rgba(240,207,96,.9)" },
            100: { value: "rgba(240,207,96,1)" },
          },
        },
      },
    },
  };

  const components = {
    Header,
    SignIn: {
      Footer: SignInFooter,
    },
    Footer,
  };

  return (
    <ThemeProvider theme={theme}>
      <Authenticator components={components}>
        <Home />
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
