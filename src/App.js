import '@aws-amplify/ui-react/styles.css';
import 'chartjs-adapter-date-fns';

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
import PageTitleRoute from './components/nav/PageTitleRoute';
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
import SiteManagement from './components/views/site-management/SiteManagement';
import { useStickyState } from './utils/Utils';

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

  const [trialDate, setTrialDate] = useStickyState(-1, 'trialDate');

  return (
    <IntlProvider locale={navigator.language}>
      <Authenticator components={components}>
        <Router>
          <div
            className='App bg-brand-primary-light dark:bg-gray-950'
            id='scroll'
          >
            <Routes>
              <Route element='' path='/checkout' />
              <Route element='' path='/pricing' />
              <Route element='' path='/lock' />
              <Route element={<Navbar trialDate={trialDate} />} path='*' />
            </Routes>
            <Routes>
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Dashboard' />
                    <Dashboard setTrialDate={setTrialDate} />
                  </>
                }
                path='/'
              />
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Reports' />
                    <Reports />
                  </>
                }
                path='/reports'
              />
              <Route
                element={<SiteDetails setTrialDate={setTrialDate} />}
                path='/sites/:siteId'
              />
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Alerts' />
                    <Alerts setTrialDate={setTrialDate} />
                  </>
                }
                path='/alerts'
              />
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Profile' />
                    <Profile setTrialDate={setTrialDate} />
                  </>
                }
                path='/profile'
              />
              <Route element={<CheckoutForm />} path='/checkout' />
              <Route element={<Return />} path='/return' />
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Pricing' />
                    <PricingPage />
                  </>
                }
                path='/pricing'
              />
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Site Management' />
                    <SiteManagement setTrialDate={setTrialDate} />
                  </>
                }
                path='/manage'
              />
              <Route element={<LockPage />} path='/lock' />
              <Route
                element={
                  <>
                    <PageTitleRoute title='SMA Mappings' />
                    <Mapping />
                  </>
                }
                path='/mapping'
              />
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
