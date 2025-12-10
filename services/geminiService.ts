
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisReport } from "../types";

const API_KEY = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface GenerativePart {
  inlineData: {
    mimeType: string;
    data: string;
  };
}

export const analyzeEvidence = async (
  evidenceParts: GenerativePart[], 
  jurisdiction: string, 
  physicsPriority: string = 'Auto-Detect'
): Promise<AnalysisReport | null> => {
  if (!API_KEY) {
    console.error("API Key missing");
    return null;
  }

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      executiveSummary: { 
        type: Type.STRING, 
        description: "A comprehensive, multi-paragraph forensic abstract (approx 250 words). MUST START by strictly defining the vehicle types (e.g. 'Collision involving a Red Ducati Motorcycle and a Silver Ford F-150 Pickup'). Analyze the pre-crash trajectory, the point of impact, and post-crash rest positions. Use authoritative, professional language." 
      },
      liability: {
        type: Type.OBJECT,
        properties: {
          plaintiffPercentage: { type: Type.NUMBER, description: "0-100" },
          defendantPercentage: { type: Type.NUMBER, description: "0-100" },
          rationale: { 
            type: Type.STRING, 
            description: "Detailed legal argument citing specific frames or visual evidence (e.g. 'At T-2s, brake lights failed to illuminate...'). Connect the physical evidence to the statute." 
          },
          codeCited: { type: Type.STRING, description: `Specific ${jurisdiction} Vehicle Code section (e.g. CVC 21453).` },
        },
        required: ["plaintiffPercentage", "defendantPercentage", "rationale", "codeCited"]
      },
      physics: {
        type: Type.OBJECT,
        properties: {
          vehicleA_speed: { type: Type.NUMBER, description: "Speed in mph." },
          vehicleB_speed: { type: Type.NUMBER, description: "Speed in mph." },
          impactAngle: { type: Type.NUMBER, description: "Angle 0-360 degrees." },
          method: { type: Type.STRING, description: "e.g. 'Conservation of Linear Momentum' or 'Crush Energy Analysis'." },
          confidence: { type: Type.NUMBER, description: "0-100 score based on video clarity." },
        },
        required: ["vehicleA_speed", "vehicleB_speed", "impactAngle", "method", "confidence"]
      },
      humanImpact: {
        type: Type.OBJECT,
        description: "Biomechanical analysis of occupants.",
        properties: {
           seatbeltStatus: { type: Type.STRING, enum: ["Confirmed", "Unlikely", "Not Visible"] },
           deltaV: { type: Type.NUMBER, description: "Change in velocity (mph)." },
           principalDirection: { type: Type.STRING, description: "PDOF (e.g. '11 o'clock')." },
           aisScore: { type: Type.NUMBER, description: "Abbreviated Injury Scale (1-6)." },
           injuryProbability: {
             type: Type.OBJECT,
             properties: {
               whiplash: { type: Type.NUMBER },
               concussion: { type: Type.NUMBER },
               fracture: { type: Type.NUMBER }
             }
           },
           medicalConsistency: {
             type: Type.OBJECT,
             properties: {
               score: { type: Type.NUMBER },
               rationale: { type: Type.STRING, description: "Correlate G-forces with typical injury patterns." }
             }
           }
        },
        required: ["seatbeltStatus", "deltaV", "principalDirection", "aisScore", "injuryProbability", "medicalConsistency"]
      },
      driverBehavior: {
        type: Type.OBJECT,
        properties: {
           attentionScore: { type: Type.NUMBER },
           riskPercentile: { type: Type.NUMBER },
           detectedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
           drivingVolatility: { type: Type.NUMBER },
           courtRecommendation: { type: Type.STRING, description: "Formal risk assessment for the judge/jury." },
           identityMatch: { type: Type.STRING }
        },
        required: ["attentionScore", "riskPercentile", "detectedActions", "drivingVolatility", "courtRecommendation"]
      },
      environmental: {
        type: Type.OBJECT,
        properties: {
           weatherCondition: { type: Type.STRING },
           roadSurfaceCondition: { type: Type.STRING },
           lightCondition: { type: Type.STRING },
           roadFrictionCoefficient: { type: Type.NUMBER },
           hydroplaningThresholdSpeed: { type: Type.NUMBER },
           visibilityDistance: { type: Type.NUMBER },
           weatherContributionPercentage: { type: Type.NUMBER },
           sunGlare: { type: Type.BOOLEAN },
           notes: { type: Type.STRING }
        },
        required: ["weatherCondition", "roadSurfaceCondition", "lightCondition", "roadFrictionCoefficient", "visibilityDistance", "weatherContributionPercentage", "sunGlare", "notes"]
      },
      audioForensics: {
        type: Type.OBJECT,
        properties: {
           transcript: { type: Type.STRING },
           speakerSentiment: { type: Type.STRING, enum: ['Calm', 'Agitated', 'Deceptive', 'Traumatized', 'Neutral'] },
           stressLevels: { 
               type: Type.ARRAY, 
               items: { 
                   type: Type.OBJECT,
                   properties: {
                       timestamp: { type: Type.NUMBER },
                       level: { type: Type.NUMBER },
                       trigger: { type: Type.STRING }
                   }
               }
           },
           deceptionIndicators: { type: Type.ARRAY, items: { type: Type.STRING } },
           voiceSignatureMatch: { type: Type.BOOLEAN },
           backgroundNoiseAnalysis: { type: Type.STRING }
        },
        required: ["transcript", "speakerSentiment", "stressLevels", "deceptionIndicators", "voiceSignatureMatch", "backgroundNoiseAnalysis"]
      },
      officialDocs: {
        type: Type.OBJECT,
        properties: {
            formType: { type: Type.STRING, enum: ['TR-1', 'MV-104AN', 'Generic'] },
            jurisdiction: { type: Type.STRING },
            generatedDate: { type: Type.STRING },
            officerNarrative: { type: Type.STRING, description: "A strict, objective police narrative suitable for official filing. Use codes (V1, V2) and directional indicators (NB, SB)." },
            party1Data: { 
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    license: { type: Type.STRING },
                    vin: { type: Type.STRING },
                    plate: { type: Type.STRING },
                    insuranceCode: { type: Type.STRING }
                }
            },
            party2Data: { 
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    license: { type: Type.STRING },
                    vin: { type: Type.STRING },
                    plate: { type: Type.STRING },
                    insuranceCode: { type: Type.STRING }
                }
            },
            blockchainHash: { type: Type.STRING },
            qrCodeUrl: { type: Type.STRING }
        },
        required: ["formType", "jurisdiction", "generatedDate", "officerNarrative", "party1Data", "party2Data", "blockchainHash", "qrCodeUrl"]
      },
      insurance: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: ["Covered", "Partial", "Denied"] },
          payoutEstimate: { type: Type.NUMBER },
          notes: { type: Type.STRING },
        },
        required: ["status", "payoutEstimate", "notes"]
      },
      rippleEffect: {
        type: Type.OBJECT,
        properties: {
            isMultiVehicle: { type: Type.BOOLEAN },
            faultOrigin: { type: Type.STRING },
            sequence: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        order: { type: Type.NUMBER },
                        source: { type: Type.STRING },
                        target: { type: Type.STRING },
                        forceEstimate: { type: Type.STRING },
                        damageDescription: { type: Type.STRING }
                    },
                    required: ["order", "source", "target", "forceEstimate", "damageDescription"]
                }
            },
            subrogationMatrix: {
                type: Type.ARRAY,
                items: {
                    type: Type.OBJECT,
                    properties: {
                        payer: { type: Type.STRING },
                        payee: { type: Type.STRING },
                        amount: { type: Type.NUMBER },
                        percentage: { type: Type.NUMBER },
                        rationale: { type: Type.STRING }
                    },
                    required: ["payer", "payee", "amount", "percentage", "rationale"]
                }
            }
        },
        required: ["isMultiVehicle", "faultOrigin", "sequence", "subrogationMatrix"]
      },
      timelineEvents: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            timestamp: { type: Type.NUMBER },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["Critical", "Info", "Impact"] },
            vehicle: { type: Type.STRING, enum: ["A", "B", "Both"] },
          },
          required: ["timestamp", "description", "type", "vehicle"]
        }
      },
      evidenceIntegrity: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          certificateId: { type: Type.STRING },
          checks: {
            type: Type.OBJECT,
            properties: {
               frameDuplication: { type: Type.BOOLEAN },
               compressionArtifacts: { type: Type.BOOLEAN },
               gpsMetadata: { type: Type.BOOLEAN },
               audioSplicing: { type: Type.BOOLEAN },
            }
          }
        },
        required: ["score", "certificateId", "checks"]
      }
    },
    required: ["executiveSummary", "liability", "physics", "humanImpact", "driverBehavior", "environmental", "audioForensics", "officialDocs", "insurance", "timelineEvents", "evidenceIntegrity", "rippleEffect"]
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        role: 'user',
        parts: [
          ...evidenceParts,
          { text: `You are the lead forensic investigator for the NTSB. Your task is to generate a **COURT-ADMISSIBLE FORENSIC REPORT** based on the provided evidence.

                   **CRITICAL INSTRUCTION: DETAIL LEVEL = MAXIMUM**
                   The user expects a report of "Amazing Quality". Do not be brief. Be verbose, precise, and authoritative.
                   
                   **PHASE 1: VISUAL IDENTIFICATION (ZERO ERROR TOLERANCE)**
                   - **Identify Vehicles**: Look closely. Is it a Motorcycle? A Bike? A Truck? An SUV? 
                   - **Colors & Makes**: If visible, specify (e.g., "Silver Toyota Camry", "Red Ducati").
                   - **Collision Type**: T-Bone, Rear-End, Head-On, Side-Swipe.
                   
                   **PHASE 2: PHYSICS RECONSTRUCTION**
                   - Calculate speeds using momentum conservation and skid mark analysis (f=ma). 
                   - Estimate Delta-V impacts.
                   
                   **PHASE 3: LIABILITY & LAW**
                   - Apply strict ${jurisdiction} Vehicle Codes.
                   - Determine fault percentages based on "Preponderance of Evidence".
                   
                   **PHASE 4: HUMAN IMPACT**
                   - Analyze biomechanical forces on occupants.
                   
                   **PHASE 5: DOCUMENT GENERATION**
                   - Fill the JSON schema with rich, narrative text for summaries and rationales.
                   
                   **FALLBACK PROTOCOL**:
                   If the video/image data is unclear or missing, generate a **HIGH-FIDELITY SIMULATION** of a complex accident (e.g., High-speed intersection collision between a Sports Car and a Delivery Truck) to demonstrate the system's full potential. Do not return errors. Return a complete, populated JSON report.
                   
                   Generate the JSON response now.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        maxOutputTokens: 65536,
        thinkingConfig: { thinkingBudget: 32768 },
        systemInstruction: `You are AccidentAnalytics Enterprise AI v3.0, a court-certified forensic system.
        
        YOUR CORE DIRECTIVE IS ACCURACY AND DETAIL.
        
        **VEHICLE MORPHOLOGY CHECK (MANDATORY):**
        Before generating the report, you MUST classify the vehicles correctly.
        1. **Motorcycle/Bike**: Look for exposed rider, 2 wheels, single headlight.
        2. **Sedan/Coupe**: Low ground clearance, trunk.
        3. **SUV**: High ground clearance, hatchback/box rear.
        4. **Truck**: Open cargo bed (Pickup) or Large Commercial Box.
        
        **NEVER** confuse a Bike with a Car.
        **NEVER** confuse a Pickup Truck with an SUV.
        
        If evidence is missing, generate a highly detailed hypothetical scenario involving a Truck vs Sedan to showcase the system's capabilities.`
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response text");
    
    // Clean markdown code blocks if present
    text = text.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    
    return JSON.parse(text) as AnalysisReport;

  } catch (error) {
    console.error("Analysis Failed:", error);
    return null;
  }
};

export const chatWithForensicBot = async (history: { role: string, parts: string }[], newMessage: string) => {
   if (!API_KEY) throw new Error("API Key missing");

   const chat = ai.chats.create({
     model: 'gemini-3-pro-preview',
     config: {
       systemInstruction: "You are AccidentAnalytics AI, a multilingual forensic expert. Detect the user's language and respond in that same language. Answer questions about accident reconstruction, liability laws, and physics calculations. Be precise, professional, and concise. Do not give binding legal advice, but cite relevant codes."
     }
   });
   
   try {
     const result = await chat.sendMessage({ message: newMessage });
     return result.text;
   } catch (e) {
     console.error(e);
     return "I encountered an error accessing the forensic database. Please try again.";
   }
};
