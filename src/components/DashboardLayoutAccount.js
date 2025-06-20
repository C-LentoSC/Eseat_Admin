import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import BarChartIcon from '@mui/icons-material/BarChart';
// import DescriptionIcon from '@mui/icons-material/Description';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import MapIcon from '@mui/icons-material/Map';
import AllInboxIcon from '@mui/icons-material/AllInbox';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import GroupIcon from '@mui/icons-material/Group';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import { AttachMoney, PaymentsOutlined, RequestQuoteOutlined } from '@mui/icons-material';
import BusAlert from '@mui/icons-material/BusAlert';
import Assignment from '@mui/icons-material/Assignment';
import HistoryIcon from '@mui/icons-material/History';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CancelScheduleSendIcon from '@mui/icons-material/CancelScheduleSend';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DateRangeIcon from '@mui/icons-material/DateRange';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PersonIcon from '@mui/icons-material/Person';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';



import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import { ReactComponent as Logo } from '../resources/eseat.svg';


// import Dashboard from './Dashboard'; //Dummy
import UserRegistrationPage from './UserRegistrationPage';
import ManageBusFacilities from './ManageBusFacilities';
import PointsManagement from './PointsManagement';
import RouteManagement from './RouteManagement';
import ActiveRouteManagement from './ActiveRouteManagement';
import ManageBusPoints from './ManageBusPoints';
import ManageBusFareBreaks from './ManageBusFareBreaks';
import ManageRegions from './ManageRegions';
import ManageDepots from './ManageDepots';
import BusLayoutManagement from './BusLayoutManagement';
import ActiveDepot from './ActiveDepot';
import BusManagement from './BusManagement';
import BusSchedule from './BusSchedule';
import CrewManagement from './CrewManagement';
import AgentManagement from './AgentManagement';
import SeatTransfer from './SeatTransfer';
import ManageFare from './ManageFare';
import ManageBreakFare from './ManageBreakFare';
import BulkBusManagement from './BulkBusManagement';
import BusReport from './BusReport';
import AllBookings from './AllBookings';
import PendingBookings from './PendingBookings';
import ManualCancelBookings from './ManualCancelBookings';
import AgentBookings from './AgentBookings';
import BookingHistory from './BookingHistory';
import FailBookings from './FailBookings';
import DeletedBookings from './DeletedBookings';
import ScheduleManagement from './ScheduleManagement';
import RefundBooking from './RefundBooking';
import TicketCancelRequests from './TicketCancelRequests';
import TicketMarkingSystem from './TicketMarkingSystem';
import CustomerDetails from './CustomerDetails';
import BulkSeatTransfer from './BulkSeatTransfer';
import TryToBook from './TryToBook';


import CustomAlert from './Parts/CustomAlert';
import {useEffect} from "react";
import api from "../model/API";

const NAVIGATION = {
  SuperAdmin: [
    // {
    //   segment: 'dashboard',
    //   title: 'Dashboard',
    //   icon: <DashboardIcon />,
    // },
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
          title: 'View-Add Routes',
          icon: <AllInboxIcon />,
        },
        {
          segment: 'active-route',
          title: 'B-D-P & Fare Breake',
          icon: <DirectionsRunIcon />,
        },
      ],
    },
    {
      segment: 'manage-regions',
      title: 'Manage Regions',
      icon: <LocationOnIcon />,
    },
    {
      segment: 'manage_depots',
      title: 'Manage Depots',
      icon: <WarehouseIcon />,
    },
    {
      segment: 'busLayoutManagement',
      title: 'Bus Layout Management',
      icon: <ViewComfyIcon />,
    },
    {
      segment: 'activeDepot',
      title: 'Bus Management',
      icon: <DirectionsBusIcon />,
    },
    {
      segment: 'agentManagement',
      title: 'Agent Management',
      icon: <GroupIcon />,
    },
    {
      segment: 'seatTransfer',
      title: 'Seat Transfer',
      icon: <AirlineSeatReclineNormalIcon />,
    },
    {
      segment: 'manageFare',
      title: 'Manage Fare',
      icon: <PaymentsOutlined />,
      children: [
        {
          segment: 'manage-fare',
          title: 'Manage Fare',
          icon: <AttachMoney />,
        },
        {
          segment: 'manage-break-fare',
          title: 'Manage Break Fare',
          icon: <RequestQuoteOutlined />,
        },
      ],
    },
    {
      segment: 'bulkBusManagement',
      title: 'Bulk Bus Management',
      icon: <BusAlert />,
    },
    {
      segment: 'busReport',
      title: 'Bus Report',
      icon: <Assignment />,
    },
    {
      segment: 'allBookings',
      title: 'All Bookings',
      icon: <HistoryIcon />,
      children: [
        {
          segment: 'allBookings',
          title: 'All Bookings',
          icon: <HistoryIcon />,
        },
        {
          segment: 'pendingBookings',
          title: 'Pending Bookings',
          icon: <PendingActionsIcon />,
        },
        {
          segment: 'manualCancelBookings',
          title: 'Manual Cancel Bookings',
          icon: <CancelScheduleSendIcon />,
        },
        {
          segment: 'agentBookings',
          title: 'Agent Bookings',
          icon: <PersonSearchIcon />,
        },
        {
          segment: 'failBookings',
          title: 'Fail Bookings',
          icon: <ErrorOutlineIcon />,
        },
        {
          segment: 'deletedBookings',
          title: 'Deleted Bookings',
          icon: <DeleteOutlineIcon />,
        },
        {
          segment: 'bookingHistory',
          title: 'Booking History',
          icon: <DateRangeIcon />,
        },
         {
          segment: 'tryToBook',
          title: 'Try To Book',
          icon: <PlayArrowIcon />,
        },
      ],
    },
    {
      segment: 'scheduleManagement',
      title: 'Schedule Management',
      icon: <EventAvailableIcon />,
    },
    {
      segment: 'refundBooking',
      title: 'Refund Booking',
      icon: <AttachMoneyIcon />,
    },
    {
      segment: 'ticketCancelRequests',
      title: 'Ticket Cancel Requests',
      icon: <CancelOutlinedIcon />,
    },
    {
      segment: 'ticketMarkingSystem',
      title: 'Ticket Marking System',
      icon: <ReceiptIcon />,
    },
    {
      segment: 'bulkSeatTransfer',
      title: 'Bulk Seat Transfer',
      icon: <SwapHorizIcon />,
    },
    {
      segment: 'customerDetails',
      title: 'Customer Details',
      icon: <PersonIcon />,
    },
  ],
  Admin: [
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
          title: 'View-Add Routes',
          icon: <AllInboxIcon />,
        },
        {
          segment: 'active-route',
          title: 'B-D-P & Fare Breake',
          icon: <DirectionsRunIcon />,
        },
      ],
    },
    {
      segment: 'manage-regions',
      title: 'Manage Regions',
      icon: <LocationOnIcon />,
    },
    {
      segment: 'manage_depots',
      title: 'Manage Depots',
      icon: <WarehouseIcon />,
    },
    {
      segment: 'busLayoutManagement',
      title: 'Bus Layout Management',
      icon: <ViewComfyIcon />,
    },
    {
      segment: 'activeDepot',
      title: 'Bus Management',
      icon: <DirectionsBusIcon />,
    },
    {
      segment: 'agentManagement',
      title: 'Agent Management',
      icon: <GroupIcon />,
    },
    {
      segment: 'seatTransfer',
      title: 'Seat Transfer',
      icon: <AirlineSeatReclineNormalIcon />,
    },
    {
      segment: 'manageFare',
      title: 'Manage Fare',
      icon: <PaymentsOutlined />,
      children: [
        {
          segment: 'manage-fare',
          title: 'Manage Fare',
          icon: <AttachMoney />,
        },
        {
          segment: 'manage-break-fare',
          title: 'Manage Break Fare',
          icon: <RequestQuoteOutlined />,
        },
      ],
    },
    {
      segment: 'bulkBusManagement',
      title: 'Bulk Bus Management',
      icon: <BusAlert />,
    },
    {
      segment: 'busReport',
      title: 'Bus Report',
      icon: <Assignment />,
    },
    {
      segment: 'allBookings',
      title: 'All Bookings',
      icon: <HistoryIcon />,
      children: [
        {
          segment: 'allBookings',
          title: 'All Bookings',
          icon: <HistoryIcon />,
        },
        {
          segment: 'pendingBookings',
          title: 'Pending Bookings',
          icon: <PendingActionsIcon />,
        },
        {
          segment: 'manualCancelBookings',
          title: 'Manual Cancel Bookings',
          icon: <CancelScheduleSendIcon />,
        },
        {
          segment: 'agentBookings',
          title: 'Agent Bookings',
          icon: <PersonSearchIcon />,
        },
        {
          segment: 'failBookings',
          title: 'Fail Bookings',
          icon: <ErrorOutlineIcon />,
        },
        {
          segment: 'deletedBookings',
          title: 'Deleted Bookings',
          icon: <DeleteOutlineIcon />,
        },
        {
          segment: 'bookingHistory',
          title: 'Booking History',
          icon: <DateRangeIcon />,
        },
         {
          segment: 'tryToBook',
          title: 'Try To Book',
          icon: <PlayArrowIcon />,
        },
      ],
    },
    {
      segment: 'scheduleManagement',
      title: 'Schedule Management',
      icon: <EventAvailableIcon />,
    },
    {
      segment: 'refundBooking',
      title: 'Refund Booking',
      icon: <AttachMoneyIcon />,
    },
    {
      segment: 'ticketCancelRequests',
      title: 'Ticket Cancel Requests',
      icon: <CancelOutlinedIcon />,
    },
    {
      segment: 'ticketMarkingSystem',
      title: 'Ticket Marking System',
      icon: <ReceiptIcon />,
    },
    {
      segment: 'bulkSeatTransfer',
      title: 'Bulk Seat Transfer',
      icon: <SwapHorizIcon />,
    },
    {
      segment: 'customerDetails',
      title: 'Customer Details',
      icon: <PersonIcon />,
    },
  ],
  OperationManager: [
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
          title: 'View-Add Routes',
          icon: <AllInboxIcon />,
        },
        {
          segment: 'active-route',
          title: 'B-D-P & Fare Breake',
          icon: <DirectionsRunIcon />,
        },
      ],
    },
    {
      segment: 'manage-regions',
      title: 'Manage Regions',
      icon: <LocationOnIcon />,
    },
    {
      segment: 'manage_depots',
      title: 'Manage Depots',
      icon: <WarehouseIcon />,
    },
    {
      segment: 'busLayoutManagement',
      title: 'Bus Layout Management',
      icon: <ViewComfyIcon />,
    },
    {
      segment: 'activeDepot',
      title: 'Bus Management',
      icon: <DirectionsBusIcon />,
    },
    {
      segment: 'agentManagement',
      title: 'Agent Management',
      icon: <GroupIcon />,
    },
    {
      segment: 'seatTransfer',
      title: 'Seat Transfer',
      icon: <AirlineSeatReclineNormalIcon />,
    },
    {
      segment: 'bulkBusManagement',
      title: 'Bulk Bus Management',
      icon: <BusAlert />,
    },
    {
      segment: 'busReport',
      title: 'Bus Report',
      icon: <Assignment />,
    },
    {
      segment: 'allBookings',
      title: 'All Bookings',
      icon: <HistoryIcon />,
      children: [
        {
          segment: 'allBookings',
          title: 'All Bookings',
          icon: <HistoryIcon />,
        },
        {
          segment: 'pendingBookings',
          title: 'Pending Bookings',
          icon: <PendingActionsIcon />,
        },
        {
          segment: 'manualCancelBookings',
          title: 'Manual Cancel Bookings',
          icon: <CancelScheduleSendIcon />,
        },
        {
          segment: 'agentBookings',
          title: 'Agent Bookings',
          icon: <PersonSearchIcon />,
        },
        {
          segment: 'failBookings',
          title: 'Fail Bookings',
          icon: <ErrorOutlineIcon />,
        },
        {
          segment: 'deletedBookings',
          title: 'Deleted Bookings',
          icon: <DeleteOutlineIcon />,
        },
        {
          segment: 'bookingHistory',
          title: 'Booking History',
          icon: <DateRangeIcon />,
        },
         {
          segment: 'tryToBook',
          title: 'Try To Book',
          icon: <PlayArrowIcon />,
        },
      ],
    },
    {
      segment: 'scheduleManagement',
      title: 'Schedule Management',
      icon: <EventAvailableIcon />,
    },
    {
      segment: 'refundBooking',
      title: 'Refund Booking',
      icon: <AttachMoneyIcon />,
    },
    {
      segment: 'ticketCancelRequests',
      title: 'Ticket Cancel Requests',
      icon: <CancelOutlinedIcon />,
    },
    {
      segment: 'bulkSeatTransfer',
      title: 'Bulk Seat Transfer',
      icon: <SwapHorizIcon />,
    },
    {
      segment: 'customerDetails',
      title: 'Customer Details',
      icon: <PersonIcon />,
    },
  ],
  OperationStaff: [
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
          title: 'View-Add Routes',
          icon: <AllInboxIcon />,
        },
        {
          segment: 'active-route',
          title: 'B-D-P & Fare Breake',
          icon: <DirectionsRunIcon />,
        },
      ],
    },
    {
      segment: 'busLayoutManagement',
      title: 'Bus Layout Management',
      icon: <ViewComfyIcon />,
    },
    {
      segment: 'activeDepot',
      title: 'Bus Management',
      icon: <DirectionsBusIcon />,
    },
    {
      segment: 'seatTransfer',
      title: 'Seat Transfer',
      icon: <AirlineSeatReclineNormalIcon />,
    },
    {
      segment: 'bulkBusManagement',
      title: 'Bulk Bus Management',
      icon: <BusAlert />,
    },
    {
      segment: 'busReport',
      title: 'Bus Report',
      icon: <Assignment />,
    },
    {
      segment: 'allBookings',
      title: 'All Bookings',
      icon: <HistoryIcon />,
      children: [
        {
          segment: 'allBookings',
          title: 'All Bookings',
          icon: <HistoryIcon />,
        },
        {
          segment: 'pendingBookings',
          title: 'Pending Bookings',
          icon: <PendingActionsIcon />,
        },
        {
          segment: 'manualCancelBookings',
          title: 'Manual Cancel Bookings',
          icon: <CancelScheduleSendIcon />,
        },
        {
          segment: 'agentBookings',
          title: 'Agent Bookings',
          icon: <PersonSearchIcon />,
        },
        {
          segment: 'failBookings',
          title: 'Fail Bookings',
          icon: <ErrorOutlineIcon />,
        },
        {
          segment: 'deletedBookings',
          title: 'Deleted Bookings',
          icon: <DeleteOutlineIcon />,
        },
        {
          segment: 'bookingHistory',
          title: 'Booking History',
          icon: <DateRangeIcon />,
        },
         {
          segment: 'tryToBook',
          title: 'Try To Book',
          icon: <PlayArrowIcon />,
        },
      ],
    },
    {
      segment: 'scheduleManagement',
      title: 'Schedule Management',
      icon: <EventAvailableIcon />,
    },
    {
      segment: 'refundBooking',
      title: 'Refund Booking',
      icon: <AttachMoneyIcon />,
    },
    {
      segment: 'ticketCancelRequests',
      title: 'Ticket Cancel Requests',
      icon: <CancelOutlinedIcon />,
    },
    {
      segment: 'bulkSeatTransfer',
      title: 'Bulk Seat Transfer',
      icon: <SwapHorizIcon />,
    },
    {
      segment: 'customerDetails',
      title: 'Customer Details',
      icon: <PersonIcon />,
    },
  ],
  CallCenterStaff: [
     {
      segment: 'user-registration',
      title: 'User Registration',
      icon: <PersonAddIcon />,
    },
    {
      segment: 'points-management',
      title: 'Points Management',
      icon: <LoyaltyIcon />,
    },
    {
      segment: 'busLayoutManagement',
      title: 'Bus Layout Management',
      icon: <ViewComfyIcon />,
    },
    {
      segment: 'activeDepot',
      title: 'Bus Management',
      icon: <DirectionsBusIcon />,
    },
    {
      segment: 'seatTransfer',
      title: 'Seat Transfer',
      icon: <AirlineSeatReclineNormalIcon />,
    },
    {
      segment: 'bulkBusManagement',
      title: 'Bulk Bus Management',
      icon: <BusAlert />,
    },
    {
      segment: 'busReport',
      title: 'Bus Report',
      icon: <Assignment />,
    },
    {
      segment: 'allBookings',
      title: 'All Bookings',
      icon: <HistoryIcon />,
      children: [
        {
          segment: 'allBookings',
          title: 'All Bookings',
          icon: <HistoryIcon />,
        },
        {
          segment: 'pendingBookings',
          title: 'Pending Bookings',
          icon: <PendingActionsIcon />,
        },
        {
          segment: 'manualCancelBookings',
          title: 'Manual Cancel Bookings',
          icon: <CancelScheduleSendIcon />,
        },
        {
          segment: 'agentBookings',
          title: 'Agent Bookings',
          icon: <PersonSearchIcon />,
        },
        {
          segment: 'failBookings',
          title: 'Fail Bookings',
          icon: <ErrorOutlineIcon />,
        },
        {
          segment: 'deletedBookings',
          title: 'Deleted Bookings',
          icon: <DeleteOutlineIcon />,
        },
        {
          segment: 'bookingHistory',
          title: 'Booking History',
          icon: <DateRangeIcon />,
        },
         {
          segment: 'tryToBook',
          title: 'Try To Book',
          icon: <PlayArrowIcon />,
        },
      ],
    },
    {
      segment: 'scheduleManagement',
      title: 'Schedule Management',
      icon: <EventAvailableIcon />,
    },
    {
      segment: 'refundBooking',
      title: 'Refund Booking',
      icon: <AttachMoneyIcon />,
    },
    {
      segment: 'customerDetails',
      title: 'Customer Details',
      icon: <PersonIcon />,
    },
  ],
  DeportOperator: [
    {
      segment: 'busReport',
      title: 'Bus Report',
      icon: <Assignment />,
    },
    {
      segment: 'ticketMarkingSystem',
      title: 'Ticket Marking System',
      icon: <ReceiptIcon />,
    },
  ],
  AccountDepartment: [
    {
      segment: 'refundBooking',
      title: 'Refund Booking',
      icon: <AttachMoneyIcon />,
    },
    {
      segment: 'bulkSeatTransfer',
      title: 'Bulk Seat Transfer',
      icon: <SwapHorizIcon />,
    },
  ],
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
      content = <UserRegistrationPage />; //Dummy
      break;
    // case '/dashboard':
    //   content = <Dashboard />; //Dummy
    //   break;
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
    case '/route-management/manageBusFareBreaks':
      content = <ManageBusFareBreaks />;
      break;
    case '/manage-regions':
      content = <ManageRegions />;
      break;
    case '/manage_depots':
      content = <ManageDepots />;
      break;
    case '/busLayoutManagement':
      content = <BusLayoutManagement />;
      break;
    case '/activeDepot':
      content = <ActiveDepot />;
      break;
    case '/busManagement':
      content = <BusManagement />;
      break;
    case '/busSchedule':
      content = <BusSchedule />;
      break;
    case '/crewManagement':
      content = <CrewManagement />;
      break;
    case '/agentManagement':
      content = <AgentManagement />;
      break;
    case '/seatTransfer':
      content = <SeatTransfer />;
      break;
    case '/manageFare':
      content = <ManageFare />;
      break;
    case '/manageFare/manage-fare':
      content = <ManageFare />;
      break;
    case '/manageFare/manage-break-fare':
      content = <ManageBreakFare />;
      break;
    case '/bulkBusManagement':
      content = <BulkBusManagement />;
      break;
    case '/busReport':
      content = <BusReport />;
      break;
    case '/allBookings':
      content = <AllBookings />;
      break;
    case '/allBookings/allBookings':
      content = <AllBookings />;
      break;
    case '/allBookings/pendingBookings':
      content = <PendingBookings />;
      break;
    case '/allBookings/manualCancelBookings':
      content = <ManualCancelBookings />;
      break;
    case '/allBookings/agentBookings':
      content = <AgentBookings />;
      break;
    case '/allBookings/failBookings':
      content = <FailBookings />;
      break;
    case '/allBookings/deletedBookings':
      content = <DeletedBookings />;
      break;
    case '/allBookings/bookingHistory':
      content = <BookingHistory />;
      break;
    case '/allBookings/tryToBook':
      content = <TryToBook />;
      break;
    case '/scheduleManagement':
      content = <ScheduleManagement />;
      break;
    case '/refundBooking':
      content = <RefundBooking />;
      break;
    case '/ticketCancelRequests':
      content = <TicketCancelRequests />;
      break;
    case '/ticketMarkingSystem':
      content = <TicketMarkingSystem />;
      break;
    case '/bulkSeatTransfer':
      content = <BulkSeatTransfer />;
      break;
    case '/customerDetails':
      content = <CustomerDetails />;
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





  const [session, setSession] = React.useState({
    user: {
      name: 'Nuwan Dhanushka',
      email: 'nuwanhelp@gmail.com',
      type: 'SuperAdmin',
      // image: 'https://avatars.githubusercontent.com/u/19550456',
    },
  });

  useEffect(() => {
    api.get('/user').then(r=>{
      setSession({
        user:{
          name: r.data.username,
          email:r.data.email,
          type: r.data.type.replace(" ","").replace(" ","").replace(" ","").replace(" ","")
        }
      })
    })
  }, [])

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
      <DashboardLayout defaultSidebarCollapsed
        sx={{
          '& .MuiDrawer-paper': {
            '& > *': {
              overflowY: 'auto !important',
              scrollbarWidth: 'none !important',
              msOverflowStyle: 'none !important',
              '&::-webkit-scrollbar': {
                width: '0 !important',
                display: 'none !important'
              }
            }
          }
        }}
      >
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
