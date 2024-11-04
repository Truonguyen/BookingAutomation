import React, { useState } from "react";
import { TextField, Button, Box, Modal, Typography } from "@mui/material";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import "./AddCustomerModal.css";

const AddCustomerModal = ({ open, onCustomerAdded, onClose }) => {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleAddCustomer = async () => {
    try {
      const customersRef = collection(db, "customers");
      const q = query(customersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setError("Phone number is already taken by another customer.");
        return;
      }

      await addDoc(customersRef, { name, phoneNumber });
      onCustomerAdded(`Customer "${name}" added successfully.`);
      onClose();
    } catch (err) {
      setError("Failed to add customer. Please try again.");
    }
  };

  return (
    <Modal open={open} onClose={onClose} aria-labelledby="add-customer-title">
      <Box className="modal-content">
        <Typography id="add-customer-title" variant="h6">
          Add New Customer
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          fullWidth
        />
        <TextField
          label="Phone Number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          margin="normal"
          fullWidth
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCustomer}
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCustomerModal;
