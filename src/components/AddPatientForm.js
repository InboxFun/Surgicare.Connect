import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import '../App.css';

function AddPatientForm({ onAddPatient }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    surgeryDate: '',
    surgeryType: '',
    notes: '',
    mentalHealth: '',
    goals: '',
    username: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Last Name:', formData.lastName); // Corrected to access lastName from formData
    const { firstName, lastName, surgeryDate } = formData;

    const year = new Date(surgeryDate).getFullYear().toString().slice(-2);
    const username =
      (firstName.slice(0, 4) + lastName.slice(0, 3) + year).replace(/\s+/g, '').toLowerCase();

    const newPatient = { ...formData, username };

    try {
      const response = await fetch('http://localhost:5000/api/add-patient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      });

      if (response.ok) {
        alert(`Patient added successfully!\nGenerated Username: ${username}`);
        setFormData({
          firstName: '',
          lastName: '',
          surgeryDate: '',
          surgeryType: '',
          notes: '',
          mentalHealth: '',
          goals: '',
          username: '',
        });
      } else {
        alert('Failed to add patient.');
      }
    } catch (error) {
      console.error('Error submitting patient:', error);
      alert('An error occurred.');
    }
  };

  return (
    <Container
      className="mt-4 p-4 shadow rounded bg-white"
      style={{ maxWidth: '600px' }}
    >
      <h3 className="mb-4 text-primary fw-bold">Add New Patient</h3>
      <Form onSubmit={handleSubmit} style={{ width: '80%', margin: 'auto' }}>
        <Form.Group className="mb-3" controlId="firstName">
          <Form.Label className="fw-bold">Patient's First Name</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            required
            className="placeholder-light"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="lastName">
          <Form.Label className="fw-bold">Patient's Last Name</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            required
            className="placeholder-light"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="surgeryDate">
          <Form.Label className="fw-bold">Surgery Date</Form.Label>
          <Form.Control
            type="date"
            name="surgeryDate"
            value={formData.surgeryDate}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="surgeryType">
          <Form.Label className="fw-bold">Type of Surgery</Form.Label>
          <Form.Control
            type="text"
            name="surgeryType"
            value={formData.surgeryType}
            onChange={handleChange}
            placeholder="e.g., Lumpectomy, Mastectomy"
            required
            className="placeholder-light"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="notes">
          <Form.Label className="fw-bold">Important Post-Surgery Notes</Form.Label>
          <Form.Control
            as="textarea"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="e.g., Diabetes, history of infections, drain management concerns"
            rows={3}
            className="placeholder-light"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="mentalHealth">
          <Form.Label className="fw-bold">Mental Health Considerations</Form.Label>
          <Form.Control
            as="textarea"
            name="mentalHealth"
            value={formData.mentalHealth}
            onChange={handleChange}
            placeholder="e.g., Pre-existing anxiety, body image concerns, support system at home"
            rows={3}
            className="placeholder-light"
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="goals">
          <Form.Label className="fw-bold">Custom Recovery Goals (Optional)</Form.Label>
          <Form.Control
            type="text"
            name="goals"
            value={formData.goals}
            onChange={handleChange}
            placeholder="e.g., Regain full arm mobility by Day 10"
            className="placeholder-light"
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="primary" type="submit">
            Add Patient
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddPatientForm;
