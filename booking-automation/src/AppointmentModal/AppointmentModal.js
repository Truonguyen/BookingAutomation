import React, { useState } from "react";
import { db } from "../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const AppointmentModal = ({ selectedDate, onAddEvent, onClose }) => {
  const workers = ["Alice", "Bob", "Charlie"];
  const services = ["Haircut", "Manicure", "Massage"];

  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [worker, setWorker] = useState(workers[0]);
  const [service, setService] = useState(services[0]);
  const [time, setTime] = useState("");
  const [lookupError, setLookupError] = useState("");

  const handleLookup = async () => {
    try {
      const customersRef = collection(db, "customers");
      const q = query(customersRef, where("phoneNumber", "==", phone.trim())); // Ensure trimming of phone input
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // If a customer with this phone number is found
        const customerData = querySnapshot.docs[0].data();
        setCustomerName(customerData.name);
        setLookupError(""); // Clear any previous error message
      } else {
        // No customer found with this phone number
        setCustomerName("");
        setLookupError("Customer not found.");
      }
    } catch (error) {
      console.error("Error fetching customer:", error);
      setLookupError("Failed to lookup customer. Please try again.");
    }
  };

  const handleConfirm = async () => {
    if (!customerName) {
      setLookupError("Please look up a valid customer by phone number.");
      return;
    }

    const appointmentDetails = {
      phone,
      customerName,
      worker,
      service,
      date: selectedDate.toISOString().split("T")[0],
      time,
    };

    try {
      console.log(appointmentDetails);
      await addDoc(collection(db, "appointments"), appointmentDetails);
      onAddEvent(appointmentDetails); // Pass details back to parent for local update
      onClose(); // Close modal
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  return (
    <div className="appointment-modal">
      <h2>Book Appointment</h2>

      <label>Customer Phone Number:</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={handleLookup}>Lookup</button>
      {lookupError && <p style={{ color: "red" }}>{lookupError}</p>}
      {customerName && <p>Customer: {customerName}</p>}
      <br></br>
      <label>Select Worker:</label>
      <select value={worker} onChange={(e) => setWorker(e.target.value)}>
        {workers.map((worker) => (
          <option key={worker} value={worker}>
            {worker}
          </option>
        ))}
      </select>
      <br></br>
      <label>Select Service:</label>
      <select value={service} onChange={(e) => setService(e.target.value)}>
        {services.map((service) => (
          <option key={service} value={service}>
            {service}
          </option>
        ))}
      </select>
      <br></br>
      <label>Select Date:</label>
      <input
        type="date"
        value={selectedDate.toISOString().split("T")[0]}
        disabled
      />
      <label>Select Time:</label>
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <button onClick={handleConfirm}>Confirm</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default AppointmentModal;
