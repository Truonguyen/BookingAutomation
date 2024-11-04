import React, { useEffect, useState } from "react";
import { TextField, Button, Box } from "@mui/material";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import AppointmentModal from "./AppointmentModal/AppointmentModal";
import AddCustomerModal from "./AddCustomerModal/AddCustomerModal";
import loginUser from "./Login/Login";
import "./App.css";
import { db } from "./firebaseConfig"; // Adjust the path if necessary
import { collection, addDoc, getDocs } from "firebase/firestore";

const localizer = momentLocalizer(moment);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "appointments"));
        const fetchedEvents = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            title: `${data.worker} - ${data.service} - ${data.time}`,
            start: new Date(data.date),
            end: new Date(data.date),
          };
        });
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []); // Empty dependency array means this only runs on mount

  const handleAddEvent = async (appointmentDetails) => {
    const { customerName, worker, service, date, time } = appointmentDetails;

    try {
      // Add the appointment to Firestore
      await addDoc(collection(db, "appointments"), appointmentDetails);

      // Update the calendar events
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          title: `${worker} - ${service} - ${time}`,
          start: new Date(date),
          end: new Date(date),
        },
      ]);

      // Show success message
      setSuccessMessage(
        `Appointment with ${worker} for ${service} scheduled at ${time}.`
      );
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const handleDateClick = (slotInfo) => {
    setSelectedDate(slotInfo.start);
    setShowAppointmentModal(true);
  };

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      if (user) {
        setIsAuthenticated(true); // Successfully logged in
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error logging in:", err);
      setError("Login failed. Please check your credentials.");
    }
  };

  const handleCustomerAdded = (message) => {
    setSuccessMessage(message);
    setShowCustomerModal(false);
  };

  if (!isAuthenticated) {
    return (
      <Box className="login-container">
        <h2>Admin Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogin}
          className="button"
        >
          Login
        </Button>
      </Box>
    );
  }

  return (
    <div className="App">
      <h1>Appointment Calendar</h1>
      {successMessage && <p className="success-message">{successMessage}</p>}

      <BigCalendar
        localizer={localizer}
        events={events}
        selectable
        onSelectSlot={handleDateClick}
        defaultView="month"
        views={["month", "week", "day"]}
        style={{ height: "80vh" }}
      />
      {showAppointmentModal && (
        <AppointmentModal
          selectedDate={selectedDate}
          onAddEvent={handleAddEvent}
          onClose={() => setShowAppointmentModal(false)}
        />
      )}

      <button onClick={() => setShowCustomerModal(true)}>
        Add New Customer
      </button>

      {showCustomerModal && (
        <AddCustomerModal
          open={showCustomerModal}
          onCustomerAdded={handleCustomerAdded}
          onClose={() => setShowCustomerModal(false)}
        />
      )}
    </div>
  );
};

export default App;
