export interface Patient {
  patientId: string;
  user: {
    fullName: string;
  };
  gender?: string;
}
