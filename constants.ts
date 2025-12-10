
import { CaseFile, AnalysisReport } from './types';

export const MOCK_CASES: CaseFile[] = [
  {
    id: 'c-101',
    referenceNumber: 'CASE-2024-8842',
    status: 'Admissible',
    dateCreated: '2024-05-12',
    description: 'Intersection Collision @ 4th & Main',
    location: 'San Francisco, CA',
    thumbnailUrl: 'https://picsum.photos/400/225',
    parties: { plaintiff: 'J. Smith', defendant: 'R. Roe' }
  },
  {
    id: 'c-102',
    referenceNumber: 'CASE-2024-9911',
    status: 'Processing',
    dateCreated: '2024-05-14',
    description: 'Rear-end on I-5 South',
    location: 'Los Angeles, CA',
    thumbnailUrl: 'https://picsum.photos/400/226',
    parties: { plaintiff: 'SafeHaul Logistics', defendant: 'T. Miller' }
  },
  {
    id: 'c-103',
    referenceNumber: 'CASE-2024-9950',
    status: 'Draft',
    dateCreated: '2024-05-15',
    description: 'Parking Lot Dispute',
    location: 'Seattle, WA',
    thumbnailUrl: 'https://picsum.photos/400/227',
    parties: { plaintiff: 'Unknown', defendant: 'L. Chen' }
  }
];

export const MOCK_REPORT: AnalysisReport = {
  executiveSummary: "Analysis confirms a 4-vehicle chain reaction initiated by Vehicle A (Red Pickup) striking Vehicle B (Blue Sedan), which was pushed into Vehicle C (White SUV) and Vehicle D (Delivery Van). Environmental analysis indicates reduced friction due to moderate rainfall, contributing 12% to the accident cause, but primary liability remains with Vehicle A for failure to account for conditions.",
  liability: {
    plaintiffPercentage: 0,
    defendantPercentage: 100,
    rationale: "Vehicle A failed to maintain assured clear distance (rear-end). Vehicles B, C, and D were stationary or slowing lawfully. Liability rests entirely with Vehicle A for all subsequent impacts.",
    codeCited: "California Vehicle Code §21703"
  },
  physics: {
    vehicleA_speed: 65,
    vehicleB_speed: 15,
    impactAngle: 0,
    method: "Momentum Transfer Analysis",
    confidence: 96
  },
  humanImpact: {
    seatbeltStatus: 'Confirmed',
    deltaV: 18.5,
    principalDirection: '6 o\'clock (Rear)',
    aisScore: 2,
    injuryProbability: {
        whiplash: 88,
        concussion: 35,
        fracture: 12
    },
    medicalConsistency: {
        score: 92,
        rationale: "Plaintiff kinematics show severe cervical hyperextension consistent with reported Grade 2 whiplash. Seatbelt retraction marks visible."
    }
  },
  driverBehavior: {
    attentionScore: 12,
    riskPercentile: 96,
    detectedActions: ["Looking at Mobile Device", "Late Braking Reaction", "Eyes Off Road >2s"],
    drivingVolatility: 85,
    courtRecommendation: "Driver poses 87% higher re-offense risk due to sustained distraction patterns. Behavior is classified as 'Willful Negligence' under forensic review.",
    identityMatch: "Confirmed (94% Match)"
  },
  environmental: {
    weatherCondition: "Moderate Rain",
    roadSurfaceCondition: "Wet Asphalt",
    lightCondition: "Overcast",
    roadFrictionCoefficient: 0.45,
    hydroplaningThresholdSpeed: 58.0,
    visibilityDistance: 350,
    weatherContributionPercentage: 12,
    sunGlare: false,
    notes: "Standing water observed in lane 2. Friction coefficient reduced by 40% vs dry baseline. V1 speed (65mph) exceeded hydroplaning threshold (58mph)."
  },
  audioForensics: {
    transcript: "Driver A: 'I didn't see him stop!' | Driver B: 'You were on your phone!'",
    speakerSentiment: "Agitated",
    stressLevels: [
        { timestamp: 0, level: 20, trigger: "Normal Conversation" },
        { timestamp: 2.5, level: 85, trigger: "Impact Sound" },
        { timestamp: 5.0, level: 92, trigger: "Driver A Statement" },
        { timestamp: 10.0, level: 45, trigger: "Silence" }
    ],
    deceptionIndicators: [
        "Pitch Jitter > 8% during liability denial",
        "Delayed response latency (1.5s)"
    ],
    voiceSignatureMatch: true,
    backgroundNoiseAnalysis: "Tire screech detected at -0.8s relative to impact. No brake squeal detected."
  },
  officialDocs: {
    formType: 'TR-1',
    jurisdiction: 'California',
    generatedDate: '2024-05-12',
    officerNarrative: "V1 (Red Ford F-150) was traveling Southbound on I-5 at approximately 65mph. Conditions were wet with moderate rain. V2 (Blue Honda Civic), V3 (White Toyota RAV4), and V4 (Delivery Van) were slowed/stopped due to congestion. V1 failed to reduce speed to safe levels for conditions and struck the rear of V2. The force of impact propelled V2 into V3, and V3 into V4. Visual evidence confirms V1 brake lights did not illuminate until 0.5s prior to impact.",
    party1Data: {
        name: "Richard Roe",
        license: "CA-D992811",
        vin: "1FTFW1E56KD882",
        plate: "7XYZ992",
        insuranceCode: "SF-9982-X"
    },
    party2Data: {
        name: "Jane Smith",
        license: "CA-B112993",
        vin: "2HGF88299LK22",
        plate: "6ABC123",
        insuranceCode: "GE-4421-B"
    },
    blockchainHash: "8f4343460d4ac12e5c707268832709217688536551120242200",
    qrCodeUrl: "https://accidentanalytics.gov/verify/8f4343"
  },
  insurance: {
    status: 'Covered',
    payoutEstimate: 142000,
    notes: "Total loss for Veh B. Major repairs for C and A. Minor for D. Policy limits may be exceeded."
  },
  rippleEffect: {
    isMultiVehicle: true,
    faultOrigin: "Vehicle A (Red Pickup)",
    sequence: [
        { order: 1, source: "Vehicle A", target: "Vehicle B", forceEstimate: "245 kN", damageDescription: "Rear Crumple Zone Failure" },
        { order: 2, source: "Vehicle B", target: "Vehicle C", forceEstimate: "180 kN", damageDescription: "Front/Rear Bumper Crush" },
        { order: 3, source: "Vehicle C", target: "Vehicle D", forceEstimate: "45 kN", damageDescription: "Minor Tailgate Dent" }
    ],
    subrogationMatrix: [
        { payer: "Vehicle A (Insurer)", payee: "Vehicle B (Insurer)", amount: 32500, percentage: 100, rationale: "Direct Impact / Total Loss" },
        { payer: "Vehicle A (Insurer)", payee: "Vehicle C (Insurer)", amount: 18200, percentage: 100, rationale: "Proximate Cause (Push)" },
        { payer: "Vehicle A (Insurer)", payee: "Vehicle D (Owner)", amount: 2400, percentage: 100, rationale: "Proximate Cause (Push)" }
    ]
  },
  settlementStrategy: {
      policies: {
          vehicleA: { carrier: "State Farm", policyNumber: "SF-9982-X", limitBodilyInjury: 100000, limitPropertyDamage: 50000, deductible: 1000, status: 'Active' },
          vehicleB: { carrier: "Geico", policyNumber: "GE-4421-B", limitBodilyInjury: 50000, limitPropertyDamage: 25000, deductible: 500, status: 'Active' }
      },
      calculation: {
          totalDamages: 53100,
          liabilityAdjustment: 0, // 0% fault for plaintiff
          finalOffer: 53100
      },
      demandLetter: {
          recipient: "State Farm Claims Dept.",
          content: "Pursuant to the forensic analysis of Claim #CASE-2024-8842, we hereby demand settlement of $53,100 for damages sustained by our insured. Video evidence confirms your policyholder's 100% liability under CA VC §21703. Please respond within 15 business days."
      },
      emailDraft: {
          to: "claims@statefarm.com",
          subject: "Demand for Payment - Claim CASE-2024-8842",
          body: "Attached is the forensic reconstruction report and formal demand letter regarding the incident on May 12, 2024. \n\nOur analysis confirms your insured's liability. We expect a settlement offer of $53,100.\n\nRegards,\nAccidentAnalytics Agent"
      }
  },
  timelineEvents: [
    { timestamp: -2.0, description: "Vehicle A maintains 65mph (Speed Limit 55)", type: "Critical", vehicle: "A" },
    { timestamp: -0.5, description: "Vehicles B, C, D slowing for traffic", type: "Info", vehicle: "Both" },
    { timestamp: 0.0, description: "IMPACT 1: A strikes B", type: "Impact", vehicle: "A" },
    { timestamp: 0.3, description: "IMPACT 2: B strikes C", type: "Impact", vehicle: "B" },
    { timestamp: 0.7, description: "IMPACT 3: C strikes D", type: "Impact", vehicle: "Both" }
  ],
  evidenceIntegrity: {
    score: 98,
    certificateId: "0x7F2A9C3D1E",
    checks: {
      frameDuplication: true,
      compressionArtifacts: true,
      gpsMetadata: true,
      audioSplicing: true
    }
  }
};
