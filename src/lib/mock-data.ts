
export interface ServiceWaitTime {
  id: string;
  name: string;
  waitTimeMinutes: number;
  lastUpdated: string;
}

export interface DepartmentBedInfo {
  id: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
}

export interface Hospital {
  id: string;
  name: string;
  location: string;
  generalWaitTimeMinutes: number;
  services: ServiceWaitTime[];
  departments: DepartmentBedInfo[];
  lastUpdated: string;
}

const generateLastUpdated = () => new Date().toISOString();

export const mockHospitals: Hospital[] = [
  {
    id: "ch_kigali_1",
    name: "King Faisal Hospital, Kigali",
    location: "Kigali",
    generalWaitTimeMinutes: 45,
    services: [
      { id: "s1_1", name: "General Consultation", waitTimeMinutes: 30, lastUpdated: generateLastUpdated() },
      { id: "s1_2", name: "Emergency Care", waitTimeMinutes: 15, lastUpdated: generateLastUpdated() },
      { id: "s1_3", name: "Pediatrics", waitTimeMinutes: 60, lastUpdated: generateLastUpdated() },
      { id: "s1_4", name: "Radiology", waitTimeMinutes: 90, lastUpdated: generateLastUpdated() },
    ],
    departments: [
      { id: "d1_1", name: "Intensive Care Unit (ICU)", totalBeds: 20, availableBeds: 5 },
      { id: "d1_2", name: "General Ward", totalBeds: 100, availableBeds: 25 },
      { id: "d1_3", name: "Maternity Ward", totalBeds: 30, availableBeds: 10 },
    ],
    lastUpdated: generateLastUpdated(),
  },
  {
    id: "ch_butare_2",
    name: "Butare University Teaching Hospital (CHUB)",
    location: "Huye",
    generalWaitTimeMinutes: 70,
    services: [
      { id: "s2_1", name: "General Consultation", waitTimeMinutes: 50, lastUpdated: generateLastUpdated() },
      { id: "s2_2", name: "Specialist Clinic", waitTimeMinutes: 120, lastUpdated: generateLastUpdated() },
      { id: "s2_3", name: "Surgery", waitTimeMinutes: 45, lastUpdated: generateLastUpdated() }, 
    ],
    departments: [
      { id: "d2_1", name: "Surgical Ward", totalBeds: 50, availableBeds: 8 },
      { id: "d2_2", name: "Medical Ward", totalBeds: 80, availableBeds: 15 },
    ],
    lastUpdated: generateLastUpdated(),
  },
  {
    id: "ch_gisenyi_3",
    name: "Gisenyi District Hospital",
    location: "Rubavu",
    generalWaitTimeMinutes: 30,
    services: [
      { id: "s3_1", name: "General Consultation", waitTimeMinutes: 25, lastUpdated: generateLastUpdated() },
      { id: "s3_2", name: "Emergency Care", waitTimeMinutes: 10, lastUpdated: generateLastUpdated() },
      { id: "s3_3", name: "Pharmacy", waitTimeMinutes: 15, lastUpdated: generateLastUpdated() },
    ],
    departments: [
      { id: "d3_1", name: "General Ward", totalBeds: 60, availableBeds: 30 },
      { id: "d3_2", name: "Pediatric Ward", totalBeds: 25, availableBeds: 10 },
    ],
    lastUpdated: generateLastUpdated(),
  },
   {
    id: "ch_ruhengeri_4",
    name: "Ruhengeri Referral Hospital",
    location: "Musanze",
    generalWaitTimeMinutes: 60,
    services: [
      { id: "s4_1", name: "General Consultation", waitTimeMinutes: 40, lastUpdated: generateLastUpdated() },
      { id: "s4_2", name: "Orthopedics", waitTimeMinutes: 90, lastUpdated: generateLastUpdated() },
      { id: "s4_3", name: "Ophthalmology", waitTimeMinutes: 75, lastUpdated: generateLastUpdated() },
    ],
    departments: [
      { id: "d4_1", name: "Orthopedic Ward", totalBeds: 30, availableBeds: 7 },
      { id: "d4_2", name: "General Ward", totalBeds: 70, availableBeds: 18 },
    ],
    lastUpdated: generateLastUpdated(),
  },
];

export const formatWaitTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hr${hours > 1 ? 's' : ''}`;
  }
  return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
};

export const timeSince = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
};
