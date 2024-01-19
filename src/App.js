import '@aws-amplify/ui-react/styles.css';
import 'chartjs-adapter-moment';

import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import {
  BarElement,
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
import Navbar from './components/nav/Navbar';
import PageFooter from './components/PageFooter';
import Alerts from './components/views/alerts/Alerts';
import CheckoutForm from './components/views/checkout/CheckoutForm';
import Return from './components/views/checkout/CheckoutReturn';
import PricingPage from './components/views/checkout/PricingPage';
import Dashboard from './components/views/dashboard/Dashboard';
import { LockPage } from './components/views/lock/LockPage';
import Mapping from './components/views/mapping/Mapping';
import Profile from './components/views/profile/Profile';
import Reports from './components/views/reports/Reports';
import SiteDetails from './components/views/site-details/SiteDetails';
import SiteList from './components/views/site-list/SiteList';
import SiteManagement from './components/views/site-management/SiteManagement';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  Colors,
  LineElement,
  BarElement,
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
      <Authenticator components={components}>
        <Router>
          <div className='App' id='scroll'>
            <Routes>
              <Route element='' path='/checkout' />
              <Route element='' path='/pricing' />
              <Route element='' path='/lock' />
              <Route element={<Navbar />} path='*' />
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
              <Route element={<SiteManagement />} path='/manage' />
              <Route element={<LockPage />} path='/lock' />
              <Route element={<Mapping />} path='/mapping' />
              <Route element={<Navigate to='/' />} path='*' />
            </Routes>
            <PageFooter />
          </div>
        </Router>
      </Authenticator>
    </IntlProvider>
  );
}

export default App;
