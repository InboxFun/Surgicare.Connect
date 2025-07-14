const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const JSON_FILE_PATH = path.join(__dirname, 'patients.json');

app.use(cors());
app.use(bodyParser.json());

// Load existing patients from JSON
const loadPatients = () => {
  if (!fs.existsSync(JSON_FILE_PATH)) return [];
  const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
  try {
    return JSON.parse(data);
  } catch (err) {
    console.error('Error parsing JSON:', err);
    return [];
  }
};

// Save updated list to JSON
const savePatients = (patients) => {
  fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(patients, null, 2), 'utf8');
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

// Serve React static build if exists
const buildPath = path.join(__dirname, 'build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));

  
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});