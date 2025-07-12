import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import '../App.css';


const samplePatients = [
  {
    id: 1,
    name: 'Jane Doe',
    recoveryStage: 'Day 5 / 14',
    alerts: ['High pain level'],
    message: 'Reported anxiety about scarring',
  },
  {
    id: 2,
    name: 'Alma Smith',
    recoveryStage: 'Day 10 / 14',
    alerts: [],
    message: 'No current issues',
  },
];

function DoctorDashboard() {
  const [patients, setPatients] = useState(samplePatients);
  
  const navigate = useNavigate();

  const handleAddPatient = () => {
    navigate('/add-patient'); // Redirect to the Add Patient form
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/patients')
      .then((res) => res.json())
      .then((data) => {
        const enriched = data.map((patient, index) => {
          const surgeryDate = new Date(patient.surgeryDate);
          const today = new Date();
          const diffDays = Math.floor((today - surgeryDate) / (1000 * 60 * 60 * 24));
          const recoveryStage = `Day ${Math.max(1, diffDays)} / 14`;
  
          const alerts = [];
          if (diffDays <= 3) alerts.push('Monitor pain level');
          if (patient.notes?.toLowerCase().includes('diabetes')) alerts.push('High infection risk');
          if (patient.mentalHealth?.toLowerCase().includes('anxiety')) alerts.push('Mental health risk');
  
          const message = alerts.length > 0
            ? 'Attention needed: ' + alerts[0]
            : 'Recovery progressing well.';
  
          return {
            id: index + 1,
            name: patient.firstName + ' ' + patient.lastName,
            recoveryStage,
            alerts,
            message,
          };
        });
  
        setPatients(enriched);
      })
      .catch((err) => console.error('Error fetching patients:', err));
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Patient Recovery Dashboard</h2>
        <Button variant="primary" onClick={handleAddPatient}>
          + Add Patient
        </Button>
      </div>

      <Row className="g-4">
        {patients.map((patient) => (
          <Col md={6} lg={4} key={patient.id} className="d-flex">
            <Card className="flex-fill custom-card shadow-sm rounded-4 border-0">
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-semibold fs-5">{patient.name}</Card.Title>
                <Card.Subtitle className="mb-3 text-muted small">
                  Recovery Progress: <strong>{patient.recoveryStage}</strong>
                </Card.Subtitle>

                {patient.alerts.length > 0 ? (
                  <div className="mb-3">
                    {patient.alerts.map((alert, index) => (
                      <Badge bg="danger" className="me-2 mb-1" key={index}>
                        ⚠️ {alert}
                      </Badge>
                    ))}
                  </div>
                ) : (
                    <div className="mb-3">
                    <Badge bg="success" className="badge-compact">
                        Stable
                    </Badge>
                    </div>
                )}

                <Card.Text className="text-secondary flex-grow-1">{patient.message}</Card.Text>

                <div className="d-flex justify-content-between mt-3">
                  <Button variant="primary" size="sm" className="text-white w-50 me-2">
                    Schedule Consultation
                  </Button>
                  <Button variant="secondary" size="sm" className="text-white w-50">
                    Respond to Message
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default DoctorDashboard;
