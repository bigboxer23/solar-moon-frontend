import '@aws-amplify/ui-react/styles.css';
import './style.css';
import 'chartjs-adapter-moment';

import { Authenticator, ThemeProvider } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import {
  CategoryScale,
  Chart as ChartJS,
  Colors,
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
import { Footer } from './components/login/Footer';
import { Header } from './components/login/Header';
import { SignInFooter } from './components/login/SignInFooter';
import Footer2 from './components/newUIComponents/Footer2';
import Navbar2 from './components/newUIComponents/nav/Navbar2';
import Alerts from './components/newUIComponents/views/alerts/Alerts';
import CheckoutForm from './components/newUIComponents/views/checkout/CheckoutForm';
import Return from './components/newUIComponents/views/checkout/CheckoutReturn';
import PricingPage from './components/newUIComponents/views/checkout/PricingPage';
import Dashboard from './components/newUIComponents/views/dashboard/Dashboard';
import { LockPage } from './components/newUIComponents/views/lock/LockPage';
import Mapping from './components/newUIComponents/views/mapping/Mapping';
import Profile from './components/newUIComponents/views/profile/Profile';
import Reports from './components/newUIComponents/views/reports/Reports';
import SiteDetails from './components/newUIComponents/views/site-details/SiteDetails';
import SiteList from './components/newUIComponents/views/site-list/SiteList';
import SiteManagement from './components/newUIComponents/views/site-management/SiteManagement';
import { oldTheme } from './themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Colors,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
);

Amplify.configure(awsExports);
function App() {
  const components = {
    Header,
    SignIn: {
      Footer: SignInFooter,
    },
    Footer,
  };

  // temp Hack for new theme bg color
  document.getElementsByTagName('body')[0].style.backgroundColor = '#eef2f9';

  return (
    <IntlProvider locale={navigator.language}>
      <ThemeProvider theme={oldTheme}>
        <Authenticator components={components}>
          <Router>
            <div className='App' id='scroll'>
              <Routes>
                <Route element='' path='/checkout' />
                <Route element='' path='/pricing' />
                <Route element='' path='/lock' />
                <Route element={<Navbar2 />} path='*' />
              </Routes>
              <Routes>
                <Route element={<Dashboard />} path='/' />
                <Route element={<Reports />} path='/reports' />
                <Route element={<SiteList />} path='/sites' />
                <Route element={<SiteDetails />} path='/sites/:siteId' />
                <Route element={<Alerts />} path='/alerts' />
                <Route element={<Profile />} path='/profile' />
                <Route element={<CheckoutForm />} path='/checkout' />
                <Route element={<Return />} path='/return' />
                <Route element={<PricingPage />} path='/pricing' />
                <Route element={<SiteManagement />} path='/siteManagement' />
                <Route element={<LockPage />} path='/lock' />
                <Route element={<Mapping />} path='/mapping' />
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
