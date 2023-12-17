import '@aws-amplify/ui-react/styles.css';
import './style.css';
//import 'bootstrap/dist/css/bootstrap.min.css';
import 'chartjs-adapter-moment';

import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from 'chart.js';
import { IntlProvider } from 'react-intl';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import awsExports from './aws-exports';
import Alarms from './components/alarms/Alarms';
import CheckoutForm from './components/checkout/CheckoutForm';
import Return from './components/checkout/CheckoutReturn';
import PricingPage from './components/checkout/PricingPage';
import Dashboard from './components/dashboards/Dashboard';
import Home from './components/Home/Home';
import { LockPage } from './components/lock/LockPage';
import { Footer } from './components/login/Footer';
import { Header } from './components/login/Header';
import { SignInFooter } from './components/login/SignInFooter';
import Navbar from './components/Navbar';
import Alerts from './components/newUIComponents/Alerts';
import Footer2 from './components/newUIComponents/Footer2';
import Home2 from './components/newUIComponents/Home2';
import Navbar2 from './components/newUIComponents/nav/Navbar2';
import Reports from './components/newUIComponents/reports/Reports';
import SiteManagement from './components/sites/SiteManagement';
import UserManagement from './components/user_management/UserManagement';
import { newTheme, oldTheme } from './themes';

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

Amplify.configure(awsExports);
function App() {
  // Enable for new UI
  const newUI = process.env.REACT_APP_NEW_UI ?? false;
  const theme = newUI ? newTheme : oldTheme;

  const components = {
    Header,
    SignIn: {
      Footer: SignInFooter,
    },
    Footer,
  };

  // temp Hack for new theme bg color
  document.getElementsByTagName('body')[0].style.backgroundColor = newUI
    ? '#eef2f9'
    : '#23272d';

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={theme}>
        <Authenticator components={components}>
          <Router>
            <div className='App' data-bs-theme='dark' id='scroll'>
              <Routes>
                <Route element='' path='/checkout' />
                <Route element='' path='/pricing' />
                <Route element='' path='/lock' />
                <Route element={newUI ? <Navbar2 /> : <Navbar />} path='*' />
              </Routes>
              <Routes>
                <Route element={newUI ? <Home2 /> : <Home />} path='/' />
                <Route element={<Dashboard />} path='/dashboard' />
                <Route element={<Reports />} path='/reports' />
                <Route element={<SiteManagement />} path='/sites' />
                <Route element={<Alarms />} path='/alarms' />
                {newUI && <Route element={<Alerts />} path='/alerts' />}
                <Route element={<UserManagement />} path='/userManagement' />
                <Route element={<CheckoutForm />} path='/checkout' />
                <Route element={<Return />} path='/return' />
                <Route element={<PricingPage />} path='/pricing' />
                <Route element={<LockPage />} path='/lock' />
                <Route element={<Navigate to='/' />} path='*' />
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
