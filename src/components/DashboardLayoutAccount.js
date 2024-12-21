import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import MapIcon from '@mui/icons-material/Map';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { ReactComponent as Logo } from '../resources/eseat.svg';


import Dashboard1 from './Dashboard1'; //Dummy
import UserRegistrationPage from './UserRegistrationPage';
import ManageBusFacilities from './ManageBusFacilities';
import PointsManagement from './PointsManagement';
import RouteManagement from './RouteManagement';
import ActiveRouteManagement from './ActiveRouteManagement';
import ManageBusPoints from './ManageBusPoints';

import CustomAlert from './Parts/CustomAlert';


const NAVIGATION = {
  SuperAdmin: [
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
    },
    {
      segment: 'user-registration',
      title: 'User Registration',
      icon: <PersonAddIcon />,
    },
    {
      segment: 'busFacilities',
      title: 'Bus Facilities',
      icon: <AddCircleIcon />,
    },
    {
      segment: 'points-management',
      title: 'Points Management',
      icon: <LoyaltyIcon />,
    },
    {
      segment: 'route-management',
      title: 'Route Management',
      icon: <MapIcon />,
      children: [
        {
          segment: 'all-route',
          title: 'All Routes',
          icon: <AllInboxIcon />,
        },
        {
          segment: 'active-route',
          title: 'Active Routes',
          icon: <DirectionsRunIcon />,
        },
      ],
    },
    {
      segment: 'sales',
      title: 'Reports',
      icon: <BarChartIcon />,
      children: [
        {
          segment: 'sales',
          title: 'Sales',
          icon: <DescriptionIcon />,
        },
        {
          segment: 'traffic',
          title: 'Traffic',
          icon: <DescriptionIcon />,
        },
      ],
    },
  ],
  Admin: [],
  OperationManager: [],
  OperationStaff: [],
  CallCenterStaff: [],
  DeportOperator: [],
  AccountDepartment: [],
};

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  defaultColorScheme: 'light',
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});


function DemoPageContent({ pathname }) {
  sessionStorage.setItem('currentPath', pathname);

  let content;

  switch (pathname) {
    case '/':
      content = <Dashboard1 />; //Dummy
      break;
    case '/dashboard':
      content = <Dashboard1 />; //Dummy
      break;
    case '/user-registration':
      content = <UserRegistrationPage />;
      break;
    case '/busFacilities':
      content = <ManageBusFacilities />;
      break;
    case '/points-management':
      content = <PointsManagement />;
      break;
    case '/route-management':
      content = <RouteManagement />;
      break;
    case '/route-management/all-route':
      content = <RouteManagement />;
      break;
    case '/route-management/active-route':
      content = <ActiveRouteManagement />;
      break;
    case '/route-management/manageBusPoints':
      content = <ManageBusPoints />;
      break;
    default:
      content = <Typography>No page found</Typography>;
  }

  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {content}

      {/* Alert */}
      <CustomAlert severity="error" message="Sample alert message" />

    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};


let routval = sessionStorage.getItem('currentPath') || '/';

export function setroutval(newRoute, RouteID) {
  routval = newRoute;
  sessionStorage.setItem('currentPath', newRoute);
  sessionStorage.setItem('currentValueID', RouteID);
  window.location.reload();
}

function DashboardLayoutAccount({ window, onLogout }) {
  // const { window } = props;




  const [session, setSession] = React.useState({
    user: {
      name: 'Nuwan Dhanushka',
      email: 'nuwanhelp@gmail.com',
      type: 'SuperAdmin',
      // image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });



  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        setSession({
          user: {
            name: 'Nuwan Dhanushka',
            email: 'nuwanhelp@gmail.com',
            type: 'SuperAdmin',
            // image: 'https://avatars.githubusercontent.com/u/19550456',
          },
        });
      },
      signOut: () => {
        setSession(null);
        onLogout();
      },
    };
  }, [onLogout]);

  const router = useDemoRouter(routval);

  const branding = {
    logo: (
      <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Logo style={{ width: '150px' }} />
      </Box>
    ),
    title: '',
  };


  const filteredNavigation = NAVIGATION[session?.user?.type] || [];

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  return (
    // preview-start
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={filteredNavigation}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      branding={branding}

    >
      <DashboardLayout defaultSidebarCollapsed>
        <DemoPageContent pathname={router.pathname} />
      </DashboardLayout>
    </AppProvider>
    // preview-end
  );
}

DashboardLayoutAccount.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
