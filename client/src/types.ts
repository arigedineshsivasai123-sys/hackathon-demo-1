export interface User {
  id: string;
  name: string;
  email: string;
  created_at?: string;
}

export type FarmerObjective =
  | 'Improve yield'
  | 'Reduce disease risk'
  | 'Reduce fertilizer cost'
  | 'Improve soil health'
  | 'Select a suitable crop'
  | 'Improve irrigation'
  | 'Identify possible pest/disease issue'
  | 'General crop guidance';

export interface AdvisoryInputPayload {
  // Farm Information
  farmName?: string;
  location: string;
  farmSize?: number;
  farmSizeUnit?: 'Acres' | 'Hectares' | 'Bigha' | 'Guntha' | 'Square Meters';
  soilType: string;
  soilPh?: number;
  soilFertilityStatus?: 'Poor' | 'Moderate' | 'Good' | 'Rich' | 'Unknown';
  previousCrop?: string;
  irrigationMethod?: 'Drip' | 'Sprinkler' | 'Flood/Furrow' | 'Rainfed' | 'Canal' | 'Borewell' | 'Manual' | 'None';
  waterAvailability: 'Abundant' | 'Adequate' | 'Limited' | 'Scarce' | 'Drought-prone';

  // Crop Information
  crop: string;
  cropVariety?: string;
  growthStage: 'Pre-sowing/Preparation' | 'Germination/Seedling' | 'Vegetative' | 'Flowering/Tillering' | 'Fruiting/Grain filling' | 'Maturity/Harvest' | 'Post-harvest';
  plantingDate?: string;
  expectedHarvestDate?: string;

  // Environmental Information
  temperature?: number;
  recentRainfall?: 'None' | 'Light' | 'Moderate' | 'Heavy' | 'Excessive';
  weatherCondition: 'Sunny/Clear' | 'Partly Cloudy' | 'Overcast' | 'Humid' | 'Rainy' | 'Dry/Arid' | 'Stormy';
  humidity?: number;
  season?: 'Kharif/Monsoon' | 'Rabi/Winter' | 'Zaid/Summer' | 'Spring' | 'Autumn' | 'All-season';

  // Crop Health
  visibleSymptoms?: string;
  pestObservations?: string;
  diseaseObservations?: string;
  leafColorAbnormalities?: 'None' | 'Yellowing/Chlorosis' | 'Browning/Necrosis' | 'Purpling' | 'Mottling' | 'White powdery coating' | 'Spots/Lesions';
  growthAbnormalities?: 'None' | 'Stunted growth' | 'Wilting' | 'Leaf curling' | 'Premature drop' | 'Stem thinning';
  soilProblems?: 'None' | 'Waterlogging' | 'Crusting/Hardpan' | 'Salinity' | 'Erosion' | 'Compaction';
  previousDiseasePestProblems?: string;

  // Farming Inputs
  fertilizersUsed?: string;
  pesticidesUsed?: string;
  organicManureUsage?: 'None' | 'Farmyard Manure (FYM)' | 'Vermicompost' | 'Green Manure' | 'Biofertilizers' | 'Compost' | 'Multiple';
  irrigationFrequency?: 'Daily' | 'Alternate Days' | 'Weekly' | 'Bi-weekly' | 'Rain-dependent' | 'As needed';
  otherTreatments?: string;

  // Farmer Objective & Notes
  farmingObjective: FarmerObjective;
  additionalObservations?: string;
}

export interface PestDiseaseItem {
  name: string;
  type: 'pest' | 'disease';
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
  symptoms: string;
  recommendedTreatment: string;
  organicRemedy?: string;
}

export interface RiskItem {
  category: 'Weather' | 'Pest' | 'Disease' | 'Soil/Nutrient' | 'Market/Yield' | 'Water';
  description: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  mitigation: string;
}

export interface StructuredAdvisoryResponse {
  overallRecommendation: string;
  cropSuitability: {
    score: number;
    rating: 'Poor' | 'Moderate' | 'Good' | 'Optimal';
    explanation: string;
    favorableFactors: string[];
    limitingFactors: string[];
  };
  soilSuitability: {
    rating: 'Poor' | 'Moderate' | 'Good' | 'Optimal';
    analysis: string;
    recommendedAmendments: string[];
    phRecommendation?: string;
  };
  irrigationRecommendations: {
    waterRequirement: 'Low' | 'Moderate' | 'High' | 'Critical';
    frequencyGuidance: string;
    methodEvaluation: string;
    timingAdvice: string;
    conservationTips: string[];
  };
  fertilizerRecommendations: {
    basalApplication: string[];
    topDressing: string[];
    micronutrients: string[];
    organicAlternatives: string[];
    applicationTiming: string;
    precautionNotes: string[];
  };
  nutrientManagement: {
    nitrogenStatus: string;
    phosphorusStatus: string;
    potassiumStatus: string;
    specificNutrientAdvice: string[];
  };
  pestAndDiseaseRisk: {
    overallRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
    identifiedRisks: PestDiseaseItem[];
    preventiveMeasures: string[];
  };
  preventiveMeasures: string[];
  cropCareRecommendations: string[];
  weatherConsiderations: {
    currentImpact: string;
    temperatureGuidance: string;
    rainfallGuidance: string;
    extremeWeatherProtection: string;
  };
  expectedRisks: RiskItem[];
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  importantWarnings: string[];
  missingInformation: string[];
  confidenceLevel: {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    explanation: string;
  };
  scientificExplanation: string;
  disclaimer: string;
  aiModelUsed: string;
  generatedAt: string;
}

export interface AdvisoryRecord {
  id: string;
  user_id?: string | null;
  farm_name?: string;
  location: string;
  crop: string;
  farm_size?: number;
  farm_size_unit?: string;
  soil_type?: string;
  growth_stage?: string;
  farming_objective?: string;
  input_payload: AdvisoryInputPayload;
  advisory_result: StructuredAdvisoryResponse;
  crop_suitability_score: number;
  overall_risk_level: 'Low' | 'Moderate' | 'High' | 'Critical';
  status: string;
  created_at: string;
}

export interface DashboardStats {
  totalAdvisories: number;
  averageSuitability: number;
  riskBreakdown: {
    Low: number;
    Moderate: number;
    High: number;
    Critical: number;
  };
  recentCrop: string | null;
  cropsMonitored: number;
  recentAdvisory: {
    id: string;
    crop: string;
    location: string;
    score: number;
    risk: 'Low' | 'Moderate' | 'High' | 'Critical';
    date: string;
  } | null;
}
