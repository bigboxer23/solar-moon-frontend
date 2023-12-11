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
import { IntlProvider } from "react-intl";
import Navbar2 from "./components/newUIComponents/nav/Navbar2";
import { newTheme, oldTheme } from "./themes";
import Home2 from "./components/newUIComponents/Home2";
import Footer2 from "./components/newUIComponents/Footer2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

import "chartjs-adapter-moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);
import Mapping from "./components/mapping/Mapping";
import { LockPage } from "./components/lock/LockPage";

Amplify.configure(awsExports);
function App() {
  // Enable for new UI
  const newUI = process.env.NEW_UI ?? false;
  const theme = newUI ? newTheme : oldTheme;

  const components = {
    Header,
    SignIn: {
      Footer: SignInFooter,
    },
    Footer,
  };

  // temp Hack for new theme bg color
  document.getElementsByTagName("body")[0].style.backgroundColor = newUI
    ? "#eef2f9"
    : "#23272d";

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme}>
        <Authenticator components={components}>
          <Router>
            <div className="App" id={"scroll"} data-bs-theme="dark">
              <Routes>
                <Route path="/checkout" element={""} />
                <Route path="/pricing" element={""} />
                <Route path="/lock" element={""} />
                <Route path="*" element={newUI ? <Navbar2 /> : <Navbar />} />
              </Routes>
              <Routes>
                <Route path="/" element={newUI ? <Home2 /> : <Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/sites" element={<SiteManagement />} />
                <Route path="/alarms" element={<Alarms />} />
                <Route path="/userManagement" element={<UserManagement />} />
                <Route path="/checkout" element={<CheckoutForm />} />
                <Route path="/return" element={<Return />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/lock" element={<LockPage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
              {newUI ? <Footer2 /> : <Footer />}
            </div>
          </Router>
        </Authenticator>
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
