const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const EXCEL_FILE_PATH = path.join(__dirname, 'All_Patients.xlsx');

app.use(cors());
app.use(bodyParser.json());

// Load existing patients
const loadPatients = () => {
  if (!fs.existsSync(EXCEL_FILE_PATH)) return [];
  const workbook = xlsx.readFile(EXCEL_FILE_PATH);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
};

// Save updated list to Excel
const savePatients = (patients) => {
  const worksheet = xlsx.utils.json_to_sheet(patients);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'All Patients');
  xlsx.writeFile(workbook, EXCEL_FILE_PATH);
};

// GET: retrieve all patients
app.get('/api/patients', (req, res) => {
  const patients = loadPatients();
  res.json(patients);
});

// POST: add a new patient
app.post('/api/add-patient', (req, res) => {
  const newPatient = req.body;
  const patients = loadPatients();
  patients.push(newPatient);
  savePatients(patients);
  res.status(201).json({ message: 'Patient added successfully!' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Serve React build
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});