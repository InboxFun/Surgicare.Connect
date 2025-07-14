import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Spinner } from 'react-bootstrap';
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

console.log('DoctorDashboard module loaded');

function DoctorDashboard() {
  console.log('DoctorDashboard rendering');
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleAddPatient = () => {
    navigate('/add-patient');
  };

  useEffect(() => {
    console.log('useEffect triggered');
    fetch('http://https://surgicare-connect.onrender.com/api/patients')
      .then((res) => {
        console.log('Response received', res);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Fetched patient data:', data);
        const enriched = data.map((patient, index) => {
          const surgeryDate = new Date(patient.surgeryDate);
          const today = new Date();
          const diffDays = Math.floor((today - surgeryDate) / (1000 * 60 * 60 * 24));
          const recoveryStage = `Day ${Math.max(1, diffDays)} / 14`;

          const alerts = [];
          if (diffDays <= 3) alerts.push('Monitor pain level');
          if (patient.notes?.toLowerCase().includes('diabetes')) alerts.push('High infection risk');
          
          const mentalHealthText = patient.mentalHealth?.toLowerCase() || '';
          const mentalHealthKeywords = ['anxiety', 'depression', 'body image'];
          if (mentalHealthKeywords.some(keyword => mentalHealthText.includes(keyword))) {
            alerts.push('Mental health risk');
          }

          const message = alerts.length > 0
            ? 'Attention needed: ' + alerts[0]
            : 'Recovery progressing well.';

          return {
            id: index + 1,
            name: patient.firstName + ' ' + patient.lastName,
            recoveryStage,
            alerts,
            message,
            notes: patient.notes || '',
            mentalHealth: patient.mentalHealth || '',
          };
        });
        console.log('Enriched patients:', enriched);
        setPatients(enriched);
      })
      .catch((err) => console.error('Error fetching patients:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary fw-bold">Patient Recovery Dashboard</h2>
        <Button variant="primary" onClick={handleAddPatient}>
          + Add Patient
        </Button>
      </div>

      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status" />
          <p className="mt-3">Loading patients...</p>
        </div>
      ) : patients.length === 0 ? (
        <p className="text-muted">No patients found. Please add a new patient to get started.</p>
      ) : (
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

                  {patient.alerts.length > 0 && (
                    <div
                      className="rounded px-3 py-2 mb-2"
                      style={{
                        backgroundColor: '#fff8e1',
                        color: '#151410ff',
                        fontSize: '0.85rem',
                      }}
                    >
                      <span role="img" aria-label="warning"></span>{' '}
                      <strong className="fw-medium">Attention needed:</strong> {patient.alerts[0]}
                    </div>
                  )}

                  {/* Notes */}
                  {(patient.notes || patient.mentalHealth) && (
                    <div
                      className="bg-light border rounded px-3 py-2 mb-2"
                      style={{ fontSize: '0.85rem', color: '#555' }}
                    >
                      <strong>Notes:</strong> {[patient.notes, patient.mentalHealth].filter(Boolean).join(', ')}
                    </div>
                  )}

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
      )}
    </Container>
  );
}

export default DoctorDashboard;