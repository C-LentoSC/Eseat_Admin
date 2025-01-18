import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Autocomplete,
  TextField,
  Grid,
  Modal,
  Button,
  Select,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TablePagination
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import api from "../model/API";
import CustomAlert from "./Parts/CustomAlert";
const BusReport = () => {

  const [schedules, setSchedules] = useState([
    {
      id: 1,
      scheduleNo: "KC002-5600MC",
      startTime: "08:00",
      startDate: "2025-01-04",
      startPoint: "Colombo",
      endPoint: "Kandy",
      routeNo: "R001",
      busType: "Luxury",
      busCode: "BC001",
      depot: "Central",
      travelNo: "T123",
      busNo: "NA-1234",
      conductorNo: "C789",
      manualClosedAt: "2024-01-03 17:00",
      closedBy: "John Doe",
      tripStatus: "No Action",
      status: "closed",
      seatDetails: {
        "seat-0-0": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "blocked"
        }, "seat-0-12": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "available"
        }, "seat-5-0": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "blocked"
        }, "seat-5-12": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "blocked"
        }, "seat-4-12": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "hold"
        }, "seat-3-12": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "hold"
        }, "seat-2-12": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "available"
        }, "seat-1-12": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "available"
        }, "seat-0-13": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "available"
        }, "seat-0-1": {
          seatNumber: "A1",
          serviceChargeCTB: "100",
          serviceChargeHGH: "150",
          serviceChargeOther: "50",
          corporateTax: "25",
          vat: "15",
          discount: "10",
          otherCharges: "30",
          agentCommission: "75",
          bankCharges: "20",
          status: "available"
        }
      },
      bookings: [
        {
          refNo: "346408407807049",
          seatNo: "1",
          vCode: "-",
          modeOfPay: "Full Ticket",
          route: "Colombo - Nuwaraeliya",
          nic: "-",
          bookedBy: "CBS-Praneeth",
          bookedDate: "2024-11-20 00:12",
          seatStatus: 'transfer',
        },
        {
          refNo: "346402643030861",
          seatNo: "2",
          vCode: "-",
          modeOfPay: "Full Ticket",
          route: "Colombo - Nuwaraeliya",
          nic: "-",
          bookedBy: "CBS-Praneeth",
          bookedDate: "2024-11-19 16:15",
          seatStatus: 'direct',
        },
        {
          refNo: "346408407807049",
          seatNo: "3",
          vCode: "-",
          modeOfPay: "Full Ticket",
          route: "Colombo - Nuwaraeliya",
          nic: "-",
          bookedBy: "CBS-Praneeth",
          bookedDate: "2024-11-20 00:12",
          seatStatus: 'transfer',
        },
        {
          refNo: "346402643030861",
          seatNo: "4",
          vCode: "-",
          modeOfPay: "Full Ticket",
          route: "Colombo - Nuwaraeliya",
          nic: "-",
          bookedBy: "CBS-Praneeth",
          bookedDate: "2024-11-19 16:15",
          seatStatus: 'direct',
        },
        {
          refNo: "346408407807049",
          seatNo: "5",
          vCode: "-",
          modeOfPay: "Full Ticket",
          route: "Colombo - Nuwaraeliya",
          nic: "-",
          bookedBy: "CBS-Praneeth",
          bookedDate: "2024-11-20 00:12",
          seatStatus: 'direct',
        },

      ],
      summary: [
        {
          bookedBy: "CBS-Praneeth",
          modeOfPay: "Full Ticket",
          route: "Colombo-Nuwaraeliya",
          busFare: "603.00",
          noOfSeate: "6",
          totalBusFare: "3,618.00",
        },
        {
          bookedBy: "Online",
          modeOfPay: "Credit / Debit Card",
          route: "Colombo-Talawakelle",
          busFare: "603.00",
          noOfSeate: "2",
          totalBusFare: "1,206.00",
        },
        {
          bookedBy: "Online",
          modeOfPay: "Credit / Debit Card",
          route: "Colombo-Hatton",
          busFare: "603.00",
          noOfSeate: "1",
          totalBusFare: "603.00",
        },
        {
          bookedBy: "Total",
          modeOfPay: "",
          route: "",
          busFare: "",
          noOfSeate: "9",
          totalBusFare: "5,427.00",
        },
        //2nd table
        {
          bookedBy: "",
          modeOfPay: "",
          route: "",
          busFare: "Full Ticket",
          noOfSeate: "",
          totalBusFare: "6",
        },
        {
          bookedBy: "",
          modeOfPay: "",
          route: "",
          busFare: "Credit / Debit Card",
          noOfSeate: "",
          totalBusFare: "3",
        },
        {
          bookedBy: "",
          modeOfPay: "",
          route: "",
          busFare: "Cash Pay",
          noOfSeate: "",
          totalBusFare: "3,618.00",
        },
        {
          bookedBy: "",
          modeOfPay: "",
          route: "",
          busFare: "Transfer Pay",
          noOfSeate: "",
          totalBusFare: "0.00",
        },
        {
          bookedBy: "",
          modeOfPay: "",
          route: "",
          busFare: "Online Pay",
          noOfSeate: "",
          totalBusFare: "1,809.00",
        },
        {
          bookedBy: "",
          modeOfPay: "",
          route: "",
          busFare: "Net Total",
          noOfSeate: "",
          totalBusFare: "5,427.00",
        },
      ],
    },
    {
      id: 2,
      scheduleNo: "LK002-5600CC",
      startTime: "08:00",
      startDate: "2025-01-04",
      startPoint: "Colombo",
      endPoint: "Kandy",
      routeNo: "R001",
      busType: "Luxury",
      busCode: "BC001",
      depot: "Central",
      travelNo: "T123",
      busNo: "NA-1234",
      conductorNo: "C789",
      manualClosedAt: "2024-01-03 17:00",
      closedBy: "John Doe",
      tripStatus: "No Action",
      status: "opened",
      seatDetails: {},
      bookings: [],
      summary: [],
    },
  ]);
  const loadAll=()=>{
    api.get('admin/schedule-report/get-all')
        .then(res=>{
          setSchedules(res.data);
          if(!isModalOpen)return
          let s=(res.data.filter(s=>s.id===selectedBus.id)[0])
          if(s){
            setSelectedBus(s)
          }
        })
        .catch(handleError)
  }
  useEffect(() => {
    loadAll()
  }, []);
  const [alert, setAlert] = useState(null);
  const sendAlert = (text) => setAlert({ message: text, severity: "info" })
  const handleError = (err) => setAlert({ message: err?.response?.data?.message??"error", severity: "error" })

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTransferBus, setSelectedTransferBus] = useState(null);
  const [isBookingStatusModalOpen, setIsBookingStatusModalOpen] = useState(false);
  const [conductorMobile, setConductorMobile] = useState("");
  const [busNumber, setBusNumber] = useState("");
  const [bookingAction, setBookingAction] = useState("");
  const [statusChangeDialog, setStatusChangeDialog] = useState({
    open: false,
    scheduleId: null,
    newStatus: '',
    oldStatus: ''
  });


  const depots = ["Central", "Northern", "Eastern"];
  const routes = ["R001", "R002", "R003"];
  const tripStatuses = ["No Action", "Trip Cancel", "Break Down", "Other", "Layout Change"];

  // Filter schedules based on selected filters
  const filteredSchedules = schedules.filter(schedule => {
    const dateMatch = !selectedDate || dayjs(schedule.startDate).isSame(selectedDate, 'day');
    const timeMatch = !selectedTime || schedule.startTime.includes(selectedTime);
    const depotMatch = !selectedDepot || schedule.depot === selectedDepot;
    const routeMatch = !selectedRoute || schedule.routeNo === selectedRoute;

    return dateMatch && timeMatch && depotMatch && routeMatch;
  });

  useEffect(() => {
    if (selectedBus) {
      setConductorMobile(selectedBus.conductorNo || "");
      setBusNumber(selectedBus.busNo || "");
    }
  }, [selectedBus]);


  const handleTransfer = (schedule) => {
    setSelectedTransferBus(schedule);
    setIsTransferModalOpen(true);
  };

  const TransferModal = () => (
    <Modal
      open={isTransferModalOpen}
      onClose={() => setIsTransferModalOpen(false)}
      sx={{ overflow: "auto", py: 2 }}
    >
      <Box sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        maxWidth: 1200,
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        maxHeight: "90vh",
        overflow: "auto",
        borderRadius: "10px",
        border: "2px solid gray",
      }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Transfer Details - {selectedTransferBus?.scheduleNo}
        </Typography>

        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                <TableCell sx={{ py: 1 }}>Ref No</TableCell>
                <TableCell sx={{ py: 1 }}>Seat No</TableCell>
                <TableCell sx={{ py: 1 }}>V-Code</TableCell>
                <TableCell sx={{ py: 1 }}>Mode Of Pay</TableCell>
                <TableCell sx={{ py: 1 }}>Route</TableCell>
                <TableCell sx={{ py: 1 }}>NIC</TableCell>
                <TableCell sx={{ py: 1 }}>Book By</TableCell>
                <TableCell sx={{ py: 1 }}>Book Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedTransferBus?.bookings
            .slice(startIndex, startIndex + rowsPerPage)
          .map((row, index) => (
                row.seatStatus === 'transfer' ? (
                  <TableRow key={index}>
                    <TableCell sx={{ py: 0 }}>{row.refNo}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.seatNo}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.vCode}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.modeOfPay}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.route}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.nic}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.bookedBy}</TableCell>
                    <TableCell sx={{ py: 0 }}>{row.bookedDate}</TableCell>
                  </TableRow>
                ) : null
              ))}
            </TableBody>
          </Table>
              <TablePagination
                        component="div"
                        count={selectedTransferBus?.bookings.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
        </TableContainer>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setIsTransferModalOpen(false)}
            sx={{ backgroundColor: 'gray' }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );

  const handleBookingToggle = React.useCallback((status,bus) => () => {
    setBookingAction(status === "opened" ? "close" : "open");
    setIsBookingStatusModalOpen(true);
  }, []);

  const handleBookingConfirm = () => {
    // Add your logic here to handle the status change
    api.post("admin/schedule-report/toggle-status",{
      action: bookingAction,
      conductorMobile,
      ...selectedBus
    }).then(res=>{
      sendAlert("status changed")
            loadAll()
    })
        .catch(handleError)

    setIsBookingStatusModalOpen(false);
  };

  const handleStatusChangeClick = (scheduleId, newStatus, oldStatus) => {
    setStatusChangeDialog({
      open: true,
      scheduleId,
      newStatus,
      oldStatus
    });
  };

  const handleStatusChangeConfirm = () => {
    const { scheduleId, newStatus } = statusChangeDialog;
    console.log(scheduleId, newStatus);
    api.post("admin/schedule-report/status-change",statusChangeDialog)
        .then(res=>{
          sendAlert("status changed")
          loadAll()
        })
    .catch(handleError)
    setStatusChangeDialog({ open: false, scheduleId: null, newStatus: '', oldStatus: '' });
  };

  const handleStatusChangeCancel = () => {
    setStatusChangeDialog({ open: false, scheduleId: null, newStatus: '', oldStatus: '' });
  };

  const StatusChangeConfirmation = () => (
    <Dialog
      open={statusChangeDialog.open}
      onClose={handleStatusChangeCancel}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Confirm Bus Close</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to change the Bus status from "{statusChangeDialog.oldStatus}" to "{statusChangeDialog.newStatus}"?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleStatusChangeCancel}>
          No
        </Button>
        <Button onClick={handleStatusChangeConfirm} autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );

  const handleSendSMS = () => { };

  const handleView = (bus) => {
    setSelectedBus(bus);
    setIsModalOpen(true);
  };

  // PDF download function
  const handleDownloadPDF = async () => {
    try {
      if (!selectedBus) return;

      const element = document.querySelector('.modal-content');
      if (!element) return;

      // Add consistent padding
      const elements = document.querySelectorAll(".setpadding01");
      elements.forEach((element) => {
        element.style.paddingBottom = "12px";
      });

      // Create PDF with A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const margin = 10;
      const pageWidth = 210 - (2 * margin);
      const pageHeight = 287 - margin;

      // Generate canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions
      const contentWidth = canvas.width;
      const contentHeight = canvas.height;
      const pdfWidth = pageWidth;
      const pdfHeight = (contentHeight * pdfWidth) / contentWidth;

      // Calculate total pages needed
      const totalPages = Math.ceil(pdfHeight / pageHeight);

      // Add content page by page
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        // Calculate source and destination coordinates
        const sourceY = page * (contentHeight / totalPages);
        const sourceHeight = contentHeight / totalPages;

        // Create temporary canvas for this page section
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = contentWidth;
        tempCanvas.height = sourceHeight;
        const ctx = tempCanvas.getContext('2d');

        // Draw portion of original canvas to temp canvas
        ctx.drawImage(
          canvas,
          0,
          sourceY,
          contentWidth,
          sourceHeight,
          0,
          0,
          contentWidth,
          sourceHeight
        );

        // Add temp canvas to PDF
        const imgData = tempCanvas.toDataURL('image/png');
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          margin,
          pdfWidth,
          pageHeight,
          '',
          'FAST'
        );
      }

      pdf.save(`bus-report-${selectedBus.scheduleNo}.pdf`);

      // remove consistent padding
      const elements2 = document.querySelectorAll(".setpadding01");
      elements2.forEach((element) => {
        element.style.paddingBottom = "0px";
      });

    } catch (error) {
      console.error('Error generating PDF:', error);

      // remove consistent padding
      const elements2 = document.querySelectorAll(".setpadding01");
      elements2.forEach((element) => {
        element.style.paddingBottom = "0px";
      });
    }
  };

  const SeatIcon = ({ status, Setwidth, Setheight }) => {
    const colors = {
      available: "#4CAF50",
      hold: "#FF9800",
      blocked: "#F44336"
    };

    return (
      <div className="relative flex flex-col items-center">
        <svg
          viewBox="0 0 100 100"
          className={`w-${Setwidth ? Setwidth : '12'}  h-${Setheight ? Setheight : '12'} cursor-pointer transition-colors duration-200`}
        >
          <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
            <path d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z"
              fill={colors[status]} />
          </g>
        </svg>
      </div>
    );
  };

  const EmpltySeatIcon = () => (
    <div className="relative flex flex-col items-center">
      <svg
        viewBox="0 0 100 100"
        className={`w-12 h-12 cursor-pointer transition-colors duration-200}`}
        style={{ visibility: "hidden" }}
      >
        <g transform="translate(50,50) rotate(-90) translate(-50,-50)">
          <path d="M90.443,34.848c-2.548,0-4.613,2.065-4.613,4.614v31.534c-0.284,0.098-0.57,0.179-0.846,0.313c-0.081,0.037-4.414,2.11-11.406,4.046c-2.226-1.561-5.054-2.257-7.933-1.7c-10.579,2.052-20.845,2.078-31.411,0.065c-2.85-0.537-5.646,0.146-7.857,1.68c-6.969-1.933-11.286-4.014-11.414-4.076c-0.259-0.128-0.526-0.205-0.792-0.297V39.46c0-2.547-2.065-4.614-4.614-4.614c-2.548,0-4.613,2.066-4.613,4.614v37.678c0,0.222,0.034,0.431,0.064,0.644c0.096,2.447,1.456,4.772,3.804,5.939c0.398,0.196,5.779,2.828,14.367,5.164c1.438,2.634,3.997,4.626,7.174,5.233c6.498,1.235,13.021,1.863,19.394,1.863c6.521,0,13.2-0.655,19.851-1.944c3.143-0.607,5.675-2.575,7.109-5.173c8.575-2.324,13.97-4.931,14.369-5.127c2.187-1.073,3.54-3.146,3.805-5.396c0.104-0.385,0.179-0.784,0.179-1.202V39.46C95.059,36.913,92.992,34.848,90.443,34.848z M20.733,37.154l-0.001,29.092c0.918,0.355,2.034,0.771,3.371,1.215c3.577-1.812,7.759-2.428,11.756-1.672c9.628,1.837,18.689,1.814,28.359-0.063c4.035-0.78,8.207-0.165,11.794,1.641c1.23-0.411,2.274-0.793,3.151-1.132l0.017-29.083c0-5.198,3.85-9.475,8.843-10.226V12.861c0-2.548-1.927-3.75-4.613-4.615c0,0-14.627-4.23-33.165-4.23c-18.543,0-33.739,4.23-33.739,4.23c-2.619,0.814-4.614,2.065-4.614,4.615v14.066C16.883,27.678,20.733,31.956,20.733,37.154z" fill="currentColor" />
        </g>
      </svg>
    </div>
  );

  const SeatLegend = () => (
    <Box className="flex gap-4 justify-center mb-5">
      {[
        { status: 'available', label: 'Available' },
        { status: 'hold', label: 'Reserved (Hold)' },
        { status: 'blocked', label: 'Blocked' }
      ].map(({ status, label }) => (
        <div key={status} className="flex items-center gap-2">
          <SeatIcon status={status} Setwidth="6" Setheight="6" />
          <span className="setpadding01">{label}</span>
        </div>
      ))}
    </Box>
  );

  // const renderSeatLayout = (layout) => {
  //   const rows = 6;
  //   const cols = 13;
  //   const grid = [];
  //
  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < cols; j++) {
  //       const seatId = `seat-${i}-${j}`;
  //       const seatInfo = layout.seatDetails[seatId];
  //
  //       // Add seat (selected or empty) to the grid
  //       grid.push(
  //         seatInfo ? (
  //           <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} key={seatId} className="relative m-1">
  //             <SeatIcon status={seatInfo.status} />
  //             {seatInfo?.seatNumber && (
  //               <span style={{ left: "11px", fontWeight: "bold", color: "#FFFFFF" }} className="setpadding01 absolute text-xs font-medium cursor-pointer">
  //                 {seatInfo.seatNumber}
  //               </span>
  //             )}
  //           </div>
  //         ) : (
  //           <div key={seatId} >
  //             <EmpltySeatIcon />
  //           </div>
  //         )
  //       );
  //     }
  //   }
  //
  //   return (
  //     <div
  //       style={{
  //         display: 'grid',
  //         gridTemplateRows: `repeat(${rows}, 1fr)`,
  //         gridTemplateColumns: `repeat(${cols}, 1fr)`,
  //         // gap: '10px',
  //         marginTop: '10px',
  //         maxWidth: '800px',
  //         maxHeight: '400px',
  //       }}
  //     >
  //       {grid}
  //     </div>
  //   );
  // };
  const renderSeatLayout = (layout) => {
    const rows = 6;
    const cols = 13;
    const grid = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const seatId = `seat-${i}-${j}`;
        const seatInfo = layout.seatDetails[seatId];

        // Add seat (selected or empty) to the grid
        grid.push(
            seatInfo ? (
                <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    key={seatId}
                    className="relative m-1"
                >
                  <SeatIcon status={seatInfo.status || "default"} />
                  {seatInfo.seatNumber && (
                      <span
                          style={{
                            left: "11px",
                            fontWeight: "bold",
                            color: "#FFFFFF",
                          }}
                          className="setpadding01 absolute text-xs font-medium cursor-pointer"
                      >
                {String(seatInfo.seatNumber)}
              </span>
                  )}
                </div>
            ) : (
                <div key={seatId}>
                  <EmpltySeatIcon />
                </div>
            )
        );
      }
    }

    return (
        <div
            style={{
              display: 'grid',
              gridTemplateRows: `repeat(${rows}, 1fr)`,
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              marginTop: '10px',
              maxWidth: '800px',
              maxHeight: '400px',
            }}
        >
          {grid}
        </div>
    );
  };

 //Pagination
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const startIndex = page * rowsPerPage;
    //End Pagination


  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container component="main" maxWidth="lg">
        {alert ? <CustomAlert severity={alert.severity} message={alert.message} open={alert}
                              setOpen={setAlert}/> : <></>}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
            Bus Schedule Report
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Date"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                format="YYYY-MM-DD"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                      ),
                    },
                    sx: {
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        height: '40px'
                      }
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                type="time"
                label="Start Time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                InputLabelProps={{ shrink: true }}
                sx={{
                  width: '100%',
                  '& .MuiOutlinedInput-root': {
                    height: '40px'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                value={selectedDepot}
                onChange={(_, newValue) => setSelectedDepot(newValue)}
                options={depots}
                // renderInput={(params) => <TextField {...params} label="Depot" />}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Depot"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                      ),
                    }}

                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px'
                  }
                }}
              />

            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Autocomplete
                value={selectedRoute}
                onChange={(_, newValue) => setSelectedRoute(newValue)}
                options={routes}
                // renderInput={(params) => <TextField {...params} label="Route" />}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Route"
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                        </InputAdornment>
                      ),
                    }}

                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '40px'
                  }
                }}
              />

            </Grid>
          </Grid>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                  <TableCell sx={{ py: 1 }}>Schedule No</TableCell>
                  <TableCell sx={{ py: 1 }}>Start date</TableCell>
                  <TableCell sx={{ py: 1 }}>Start Time</TableCell>
                  <TableCell sx={{ py: 1 }}>Start Point</TableCell>
                  <TableCell sx={{ py: 1 }}>End Point</TableCell>
                  <TableCell sx={{ py: 1 }}>Route No</TableCell>
                  <TableCell sx={{ py: 1 }}>Bus Type</TableCell>
                  <TableCell sx={{ py: 1 }}>Bus No</TableCell>
                  <TableCell sx={{ py: 1 }}>Conductor No</TableCell>
                  <TableCell sx={{ py: 1 }}>Deport</TableCell>
                  <TableCell sx={{ py: 1 }} align="center">Status</TableCell>
                  <TableCell sx={{ py: 1 }} align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSchedules
                   .slice(startIndex, startIndex + rowsPerPage)
                  .map((schedule) => (
                  <TableRow key={schedule.id}>
                    <TableCell sx={{ py: 0 }}>{schedule.scheduleNo}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.startDate}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.startTime}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.startPoint}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.endPoint}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.routeNo}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.busType}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.busNo}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.conductorNo}</TableCell>
                    <TableCell sx={{ py: 0 }}>{schedule.depot}</TableCell>
                    <TableCell sx={{ py: 0 }} align="center">
                      <Select
                        size="small"
                        value={schedule.tripStatus}
                        onChange={(e) => handleStatusChangeClick(
                          schedule.id,
                          e.target.value,
                          schedule.tripStatus
                        )}
                           sx={{ height : 30 }}
                      >
                        {tripStatuses.map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ py: 0 }} align="right">
                      <IconButton onClick={() => handleView(schedule)}>
                        <VisibilityIcon />
                      </IconButton>
                      {schedule?.bookings.length > 0 && (
                        <Button size="small" variant="contained" sx={{ ml: 1, height: 25 }} onClick={() => handleTransfer(schedule)}>
                          Transfer
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
                   <TablePagination
                        component="div"
                        count={filteredSchedules.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[10, 25, 50, 100]}
                    />
          </TableContainer>

          <Modal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            sx={{ overflow: "auto", py: 2 }}
          >
            <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "90%",
              maxWidth: 1200,
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              maxHeight: "90vh",
              overflow: "auto",
              borderRadius: "10px",
              border: "2px solid gray",
            }}>
              <Box sx={{ mt: 2, mr: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleDownloadPDF}
                  startIcon={<FileDownloadIcon />}
                >
                  Download PDF
                </Button>
              </Box>
              <div className="modal-content" style={{ padding: '20px' }}>

                <div sx={{ mt: 2, mr: 2, ml: 2, mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2 }}>Bus Details ({selectedBus?.scheduleNo})</Typography>

                  <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                    <SeatLegend />
                  </Box>

                  <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
                    {selectedBus && renderSeatLayout(selectedBus)}
                  </Box>
                </div>

                <Box sx={{ mt: 2, display: "flex", gap: 2, justifyContent: "center" }}>
                  <Button variant="contained" onClick={handleSendSMS()}>
                    <span className="setpadding01">Send SMS to Conductor</span>
                  </Button>

                  <Button
                    variant="contained"
                    color={selectedBus?.status === "opened" ? "secondary" : "primary"}
                    onClick={handleBookingToggle(selectedBus?.status,selectedBus)}
                  >
                    <span className="setpadding01">{selectedBus?.status === "opened" ? 'Close Booking' : 'Open Booking'}</span>
                  </Button>
                </Box>

                <div sx={{ mt: 2, mr: 2, ml: 2, mb: 4 }}>
                  <Box sx={{ pb: 4, mt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6} md={6} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography variant="subtitle2">Manual close at :</Typography>
                        <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.manualClosedAt}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <Typography variant="subtitle2">Closed By :</Typography>
                        <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.closedBy}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                        <Typography variant="subtitle2">Conductor No :</Typography>
                        <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.conductorNo}</Typography>
                      </Grid>
                      <Grid item xs={6} md={6} sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end" }}>
                        <Typography variant="subtitle2">Bus No :</Typography>
                        <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.busNo}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </div>

                <div sx={{ mt: 2, mr: 2, ml: 2, mb: 4 }}>
                  <Typography variant="h6" sx={{ mt: 3 }}>Booking Details</Typography>

                  <Grid container spacing={2} sx={{ mb: 3, mt: 1 }}>
                    <Grid item xs={6} md={4} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography variant="subtitle2">Depot Name :</Typography>
                      <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.depot}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography variant="subtitle2">Bus No :</Typography>
                      <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.busNo}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography variant="subtitle2">Date :</Typography>
                      <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.startDate}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography variant="subtitle2">From :</Typography>
                      <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.startPoint}</Typography>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                      <Typography variant="subtitle2">To :</Typography>
                      <Typography sx={{ ml: 1 }} variant="body2">{selectedBus?.endPoint}</Typography>
                    </Grid>
                  </Grid>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Ref No</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Seat no</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">V-Code</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Mode of Pay</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Route</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">NIC</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Booked By</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Booked Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedBus?.bookings
                      .map((booking, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.refNo}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.seatNo}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.vCode}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.modeOfPay}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.route}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.nic}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.bookedBy}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{booking.bookedDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </TableContainer>
                </div>

                <div sx={{ mt: 2, mr: 2, ml: 2, mb: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, paddingTop: '40px' }}>Summary Report</Typography>

                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{backgroundColor: '#7cdffa4b'}}>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Booked By</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Mode of Pay</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Route</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">Bus Fare</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01">No of Seats</TableCell>
                          <TableCell sx={{ py: 1 }} className="setpadding01" align="right">Total Bus Fare</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedBus?.summary
                        .map((summary, index) => (
                          <TableRow key={index}>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{summary.bookedBy}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{summary.modeOfPay}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{summary.route}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{summary.busFare}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01">{summary.noOfSeate}</TableCell>
                            <TableCell sx={{ py: 0 }} className="setpadding01" align="right">{summary.totalBusFare}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                  </TableContainer>
                </div>

              </div>


              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mr: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsModalOpen(false)}
                  sx={{ backgroundColor: 'gray' }}
                >
                  Close
                </Button>
              </Box>
            </Box>
          </Modal>

          <Modal
            open={isBookingStatusModalOpen}
            onClose={() => setIsBookingStatusModalOpen(false)}
          >
            <Box sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "400px",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              borderRadius: "10px",
              border: "2px solid gray",
            }}>
              <Typography variant="h6" sx={{ mb: 3 }}>
                {bookingAction === "close" ? "Close Booking" : "Open Booking"}
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Conductor Mobile"
                    value={conductorMobile}
                    onChange={(e) => setConductorMobile(e.target.value)}
                    placeholder="Enter conductor mobile number"
                  // size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bus Number"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="Enter bus number"
                  // size="small"
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => setIsBookingStatusModalOpen(false)}
                  sx={{ backgroundColor: 'gray' }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBookingConfirm}
                >
                  Confirm
                </Button>
              </Box>
            </Box>
          </Modal>

          <TransferModal />
          <StatusChangeConfirmation />

        </Box>
      </Container>
    </LocalizationProvider>

  );
};

export default BusReport;
