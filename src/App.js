import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
import { ThemeProvider, Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Header } from "./components/login/Header";
import { SignInFooter } from "./components/login/SignInFooter";
import { Footer } from "./components/login/Footer";
import Home from "./components/Home/Home";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Dashboard from "./components/dashboards/Dashboard";
import Reports from "./components/reports/Reports";
import SiteManagement from "./components/sites/SiteManagement";
import Alarms from "./components/alarms/Alarms";
import UserManagement from "./components/user_management/UserManagement";
import CheckoutForm from "./components/checkout/CheckoutForm";
import Return from "./components/checkout/CheckoutReturn";
import PricingPage from "./components/checkout/PricingPage";

Amplify.configure(awsExports);
function App() {
  const theme = {
    name: "my-theme",
    tokens: {
      fonts: {
        default: {
          static: {
            value: '"Raleway", serif',
          },
          variable: {
            value: '"Raleway", serif',
          },
        },
      },
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
        <Router>
          <div className="App" id={"scroll"} data-bs-theme="dark">
            <Routes>
              <Route path="/checkout" element={""} />
              <Route path="/return" element={""} />
              <Route path="/pricing" element={""} />
              <Route path="*" element={<Navbar />} />
            </Routes>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/sites" element={<SiteManagement />} />
              <Route path="/alarms" element={<Alarms />} />
              <Route path="/userManagement" element={<UserManagement />} />
              <Route path="/checkout" element={<CheckoutForm />} />
              <Route path="/return" element={<Return />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
            <Footer />
          </div>
        </Router>
      </Authenticator>
    </ThemeProvider>
  );
}

export default App;
