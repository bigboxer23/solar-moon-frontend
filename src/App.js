import '@aws-amplify/ui-react/styles.css';
import './style.css';
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
import CheckoutForm from './components/checkout/CheckoutForm';
import Return from './components/checkout/CheckoutReturn';
import { Footer } from './components/login/Footer';
import { Header } from './components/login/Header';
import { SignInFooter } from './components/login/SignInFooter';
import Navbar from './components/Navbar';
import Footer2 from './components/newUIComponents/Footer2';
import Navbar2 from './components/newUIComponents/nav/Navbar2';
import Alerts from './components/newUIComponents/views/alerts/Alerts';
import PricingPage from './components/newUIComponents/views/checkout/PricingPage';
import Dashboard from './components/newUIComponents/views/dashboard/Dashboard';
import { LockPage } from './components/newUIComponents/views/lock/LockPage';
import Reports from './components/newUIComponents/views/reports/Reports';
import SiteDetails from './components/newUIComponents/views/site-details/SiteDetails';
import SiteList from './components/newUIComponents/views/site-list/SiteList';
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
  const newUI = true;
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
                <Route element={<Dashboard />} path='/' />
                <Route element={<Reports />} path='/reports' />
                <Route element={<SiteList />} path='/sites' />
                <Route element={<SiteDetails />} path='/sites/:siteId' />
                <Route element={<Alerts />} path='/alerts' />
                <Route element={<UserManagement />} path='/profile' />
                <Route element={<CheckoutForm />} path='/checkout' />
                <Route element={<Return />} path='/return' />
                <Route element={<PricingPage />} path='/pricing' />
                <Route element={<LockPage />} path='/lock' />
                <Route element={<Navigate to='/' />} path='*' />
              </Routes>
              <Footer2 />
            </div>
          </Router>
        </Authenticator>
      </ThemeProvider>
    </IntlProvider>
  );
}

export default App;
