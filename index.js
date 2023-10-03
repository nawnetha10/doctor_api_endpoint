const express = require('express');
const app = express();

const PORT = 3000; // You can use any available port

const doctors = [
  {
    id: 1,
    name: 'Dr. Smith',
    specialty: 'Cardiology',
    available_days: ['Monday', 'Wednesday', 'Friday'],
    max_patients_per_day: 10
  },
  {
    id: 2,
    name: 'Dr. Johnson',
    specialty: 'Dermatology',
    available_days: ['Tuesday', 'Thursday'],
    max_patients_per_day: 8
  }
];

const appointments = [];

app.use(express.json()); // Parse JSON requests

// Doctor Listing Endpoint
app.get('/doctors', (req, res) => {
  res.json(doctors);
});

// Doctor Detail Endpoint
app.get('/doctors/:doctor_id', (req, res) => {
  const doctorId = parseInt(req.params.doctor_id);
  const doctor = doctors.find(doctor => doctor.id === doctorId);

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404).json({ message: 'Doctor not found' });
  }
});

// Appointment Booking Endpoint
app.post('/appointments', (req, res) => {
  const { doctor_id, appointment_date, patient_name } = req.body;

  // Check if the doctor exists
  const doctor = doctors.find(doctor => doctor.id === doctor_id);
  if (!doctor) {
    return res.status(400).json({ message: 'Doctor not found' });
  }

  // Check if the appointment date is valid
  const appointmentDay = new Date(appointment_date).toLocaleDateString('en-US', { weekday: 'long' });
  if (!doctor.available_days.includes(appointmentDay)) {
    return res.status(400).json({ message: 'Doctor is not available on this day' });
  }

  // Check if max patients for the day is reached
  const appointmentsForDay = appointments.filter(appt => appt.doctor_id === doctor_id && appt.appointment_date === appointment_date);
  if (appointmentsForDay.length >= doctor.max_patients_per_day) {
    return res.status(400).json({ message: 'No available slots for this day' });
  }

  // Book the appointment
  const appointment = {
    appointment_id: appointments.length + 1,
    doctor_id,
    appointment_date,
    patient_name
  };
  appointments.push(appointment);

  res.status(201).json(appointment);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
