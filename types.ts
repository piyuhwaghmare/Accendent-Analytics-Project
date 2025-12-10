
export interface UserProfile {
  id: string;
  name: string;
  role: 'Investigator' | 'Adjuster' | 'Attorney';
  jurisdiction: string;
  email: string;
}

export interface CaseFile {
  id: string;
  referenceNumber: string;
  status: 'Processing' | 'Analysis Complete' | 'Admissible' | 'Draft';
  dateCreated: string;
  description: string;
  location: string;
  thumbnailUrl: string;
  parties: {
    plaintiff: string;
    defendant: string;
  };
}

export interface RippleSequenceItem {
  order: number;
  source: string;
  target: string;
  forceEstimate: string; // e.g., "15kN"
  damageDescription: string;
}

export interface SubrogationItem {
  payer: string;
  payee: string;
  amount: number;
  percentage: number;
  rationale: string;
}

export interface SettlementStrategy {
  policies: {
    vehicleA: {
      carrier: string;
      policyNumber: string;
      limitBodilyInjury: number;
      limitPropertyDamage: number;
      deductible?: number;
      status: string;
    };
    vehicleB: {
      carrier: string;
      policyNumber: string;
      deductible: number;
      limitBodilyInjury?: number;
      limitPropertyDamage?: number;
      status: string;
    };
  };
  calculation: {
    totalDamages: number;
    liabilityAdjustment: number;
    finalOffer: number;
  };
  demandLetter: {
    recipient: string;
    content: string;
  };
  emailDraft: {
    to: string;
    subject: string;
    body: string;
  };
}

export interface HumanImpactAnalysis {
  seatbeltStatus: 'Confirmed' | 'Unlikely' | 'Not Visible';
  deltaV: number; // change in velocity in mph
  principalDirection: string; // e.g., "12 o'clock"
  aisScore: number; // Abbreviated Injury Scale (1-6)
  injuryProbability: {
    whiplash: number; // percentage
    concussion: number; // percentage
    fracture: number; // percentage
  };
  medicalConsistency: {
    score: number; // % match
    rationale: string;
  };
}

export interface DriverBehaviorAnalysis {
  attentionScore: number; // 0-100 (100 is fully attentive)
  riskPercentile: number; // 0-100 (higher is worse relative to population)
  detectedActions: string[]; // e.g., "Texting", "Looking Down", "Hands off wheel"
  drivingVolatility: number; // 0-100 based on micro-corrections/speed variance
  courtRecommendation: string; // "Driver poses 87% higher re-offense risk"
  identityMatch?: string; // "Confirmed (88%)" or "Unknown"
}

export interface EnvironmentalAnalysis {
  weatherCondition: string; // e.g., "Heavy Rain", "Clear"
  roadSurfaceCondition: string; // e.g., "Wet Asphalt", "Black Ice"
  lightCondition: string; // e.g., "Overcast", "Night"
  roadFrictionCoefficient: number; // 0.0 to 1.0 (e.g. 0.7 for dry, 0.4 for wet)
  hydroplaningThresholdSpeed?: number; // mph
  visibilityDistance: number; // feet
  weatherContributionPercentage: number; // 0-100
  sunGlare: boolean;
  notes: string;
}

export interface AudioForensics {
  transcript: string;
  speakerSentiment: 'Calm' | 'Agitated' | 'Deceptive' | 'Traumatized' | 'Neutral';
  stressLevels: Array<{ timestamp: number; level: number; trigger?: string }>; // 0-100 microtremor level
  deceptionIndicators: string[]; // e.g. "Pitch Jitter > 5%", "Inconsistent Pause"
  voiceSignatureMatch: boolean;
  backgroundNoiseAnalysis: string;
}

export interface OfficialDocs {
  formType: 'TR-1' | 'MV-104AN' | 'Generic';
  jurisdiction: string;
  generatedDate: string;
  officerNarrative: string; // "V1 traveling NB on..."
  party1Data: { name: string; license: string; vin: string; plate: string; insuranceCode: string };
  party2Data: { name: string; license: string; vin: string; plate: string; insuranceCode: string };
  blockchainHash: string; // Immutable record hash
  qrCodeUrl: string; // Link to report
}

export interface AnalysisReport {
  executiveSummary: string;
  liability: {
    plaintiffPercentage: number;
    defendantPercentage: number;
    rationale: string;
    codeCited: string;
  };
  physics: {
    vehicleA_speed: number;
    vehicleB_speed: number;
    impactAngle: number;
    method: string;
    confidence: number;
  };
  humanImpact?: HumanImpactAnalysis;
  driverBehavior?: DriverBehaviorAnalysis;
  environmental?: EnvironmentalAnalysis;
  audioForensics?: AudioForensics;
  officialDocs?: OfficialDocs;
  insurance: {
    status: 'Covered' | 'Partial' | 'Denied';
    payoutEstimate: number;
    notes: string;
  };
  rippleEffect?: {
    isMultiVehicle: boolean;
    faultOrigin: string; // The "Patient Zero" of the accident
    sequence: RippleSequenceItem[];
    subrogationMatrix: SubrogationItem[];
  };
  settlementStrategy?: SettlementStrategy;
  timelineEvents: TimelineEvent[];
  evidenceIntegrity: {
    score: number;
    certificateId: string;
    checks: {
      frameDuplication: boolean;
      compressionArtifacts: boolean;
      gpsMetadata: boolean;
      audioSplicing: boolean;
    };
  };
}

export interface TimelineEvent {
  timestamp: number; // Seconds relative to impact (0.0)
  description: string;
  type: 'Critical' | 'Info' | 'Impact';
  vehicle: 'A' | 'B' | 'Both';
}

export enum AppView {
  LOGIN,
  SIGNUP,
  DASHBOARD,
  UPLOAD,
  REPORT,
  AR_MODE
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
