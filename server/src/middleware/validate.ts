import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

export const advisoryInputSchema = z.object({
  farmName: z.string().optional(),
  location: z.string().min(2, 'Farm location is required'),
  farmSize: z.number().positive().optional(),
  farmSizeUnit: z.enum(['Acres', 'Hectares', 'Bigha', 'Guntha', 'Square Meters']).optional(),
  soilType: z.string().min(2, 'Soil type is required'),
  soilPh: z.number().min(0).max(14).optional(),
  soilFertilityStatus: z.enum(['Poor', 'Moderate', 'Good', 'Rich', 'Unknown']).optional(),
  previousCrop: z.string().optional(),
  irrigationMethod: z.enum(['Drip', 'Sprinkler', 'Flood/Furrow', 'Rainfed', 'Canal', 'Borewell', 'Manual', 'None']).optional(),
  waterAvailability: z.enum(['Abundant', 'Adequate', 'Limited', 'Scarce', 'Drought-prone']),

  crop: z.string().min(2, 'Crop name is required'),
  cropVariety: z.string().optional(),
  growthStage: z.enum([
    'Pre-sowing/Preparation',
    'Germination/Seedling',
    'Vegetative',
    'Flowering/Tillering',
    'Fruiting/Grain filling',
    'Maturity/Harvest',
    'Post-harvest'
  ]),
  plantingDate: z.string().optional(),
  expectedHarvestDate: z.string().optional(),

  temperature: z.number().optional(),
  recentRainfall: z.enum(['None', 'Light', 'Moderate', 'Heavy', 'Excessive']).optional(),
  weatherCondition: z.enum(['Sunny/Clear', 'Partly Cloudy', 'Overcast', 'Humid', 'Rainy', 'Dry/Arid', 'Stormy']),
  humidity: z.number().min(0).max(100).optional(),
  season: z.enum(['Kharif/Monsoon', 'Rabi/Winter', 'Zaid/Summer', 'Spring', 'Autumn', 'All-season']).optional(),

  visibleSymptoms: z.string().optional(),
  pestObservations: z.string().optional(),
  diseaseObservations: z.string().optional(),
  leafColorAbnormalities: z.enum([
    'None',
    'Yellowing/Chlorosis',
    'Browning/Necrosis',
    'Purpling',
    'Mottling',
    'White powdery coating',
    'Spots/Lesions'
  ]).optional(),
  growthAbnormalities: z.enum([
    'None',
    'Stunted growth',
    'Wilting',
    'Leaf curling',
    'Premature drop',
    'Stem thinning'
  ]).optional(),
  soilProblems: z.enum([
    'None',
    'Waterlogging',
    'Crusting/Hardpan',
    'Salinity',
    'Erosion',
    'Compaction'
  ]).optional(),
  previousDiseasePestProblems: z.string().optional(),

  fertilizersUsed: z.string().optional(),
  pesticidesUsed: z.string().optional(),
  organicManureUsage: z.enum([
    'None',
    'Farmyard Manure (FYM)',
    'Vermicompost',
    'Green Manure',
    'Biofertilizers',
    'Compost',
    'Multiple'
  ]).optional(),
  irrigationFrequency: z.enum([
    'Daily',
    'Alternate Days',
    'Weekly',
    'Bi-weekly',
    'Rain-dependent',
    'As needed'
  ]).optional(),
  otherTreatments: z.string().optional(),

  farmingObjective: z.enum([
    'Improve yield',
    'Reduce disease risk',
    'Reduce fertilizer cost',
    'Improve soil health',
    'Select a suitable crop',
    'Improve irrigation',
    'Identify possible pest/disease issue',
    'General crop guidance'
  ]),
  additionalObservations: z.string().optional()
});

export function validateBody(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message
      }));
      res.status(400).json({ error: 'Validation failed', details: errors });
      return;
    }
    req.body = result.data;
    next();
  };
}
