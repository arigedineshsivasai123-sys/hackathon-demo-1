import { Router, Response } from 'express';
import crypto from 'crypto';
import { query } from '../db/db.js';
import { generateCropAdvisory } from '../services/gemini.js';
import { advisoryInputSchema, validateBody } from '../middleware/validate.js';
import { requireAuth, optionalAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { AdvisoryInputPayload, AdvisoryRecord } from '../types/index.js';

export const advisoryRouter = Router();

// 1. Generate new advisory
advisoryRouter.post(
  '/generate',
  optionalAuth,
  validateBody(advisoryInputSchema),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const payload: AdvisoryInputPayload = req.body;
      const userId = req.user?.id || null;

      console.log(`[Advisory] Generating recommendation for Crop: ${payload.crop} in ${payload.location}`);

      // Call AI Service
      const advisoryResult = await generateCropAdvisory(payload);
      const advisoryId = crypto.randomUUID();

      // Save to database
      await query(
        `INSERT INTO advisories (
          id, user_id, farm_name, location, crop, farm_size,
          farm_size_unit, soil_type, growth_stage, farming_objective,
          input_payload, advisory_result, crop_suitability_score,
          overall_risk_level, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
        [
          advisoryId,
          userId,
          payload.farmName || null,
          payload.location,
          payload.crop,
          payload.farmSize || null,
          payload.farmSizeUnit || 'Acres',
          payload.soilType,
          payload.growthStage,
          payload.farmingObjective,
          JSON.stringify(payload),
          JSON.stringify(advisoryResult),
          advisoryResult.cropSuitability.score,
          advisoryResult.pestAndDiseaseRisk.overallRiskLevel,
          'completed'
        ]
      );

      const record: AdvisoryRecord = {
        id: advisoryId,
        user_id: userId,
        farm_name: payload.farmName,
        location: payload.location,
        crop: payload.crop,
        farm_size: payload.farmSize,
        farm_size_unit: payload.farmSizeUnit,
        soil_type: payload.soilType,
        growth_stage: payload.growthStage,
        farming_objective: payload.farmingObjective,
        input_payload: payload,
        advisory_result: advisoryResult,
        crop_suitability_score: advisoryResult.cropSuitability.score,
        overall_risk_level: advisoryResult.pestAndDiseaseRisk.overallRiskLevel,
        status: 'completed',
        created_at: new Date().toISOString()
      };

      res.status(201).json({
        message: 'Crop advisory successfully synthesized.',
        advisory: record
      });
    } catch (err: any) {
      console.error('[Advisory Generation Error]:', err);
      res.status(500).json({ error: 'Failed to synthesize crop advisory: ' + (err.message || 'Internal error') });
    }
  }
);

// 2. Get advisory history for authenticated user
advisoryRouter.get('/', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = await query(
      'SELECT id, farm_name, location, crop, farm_size, farm_size_unit, soil_type, growth_stage, farming_objective, crop_suitability_score, overall_risk_level, status, created_at, input_payload, advisory_result FROM advisories WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const formatted = result.rows.map(row => ({
      ...row,
      input_payload: typeof row.input_payload === 'string' ? JSON.parse(row.input_payload) : row.input_payload,
      advisory_result: typeof row.advisory_result === 'string' ? JSON.parse(row.advisory_result) : row.advisory_result
    }));

    res.json({ advisories: formatted });
  } catch (err: any) {
    console.error('[Advisory List Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve advisory history.' });
  }
});

// 3. User advisory statistics summary
advisoryRouter.get('/stats/summary', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const result = await query(
      'SELECT * FROM advisories WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    const list = result.rows;
    const total = list.length;
    const avgScore = total > 0
      ? Math.round(list.reduce((acc, a) => acc + (Number(a.crop_suitability_score) || 0), 0) / total)
      : 0;

    const riskBreakdown = {
      Low: list.filter(a => a.overall_risk_level === 'Low').length,
      Moderate: list.filter(a => a.overall_risk_level === 'Moderate').length,
      High: list.filter(a => a.overall_risk_level === 'High').length,
      Critical: list.filter(a => a.overall_risk_level === 'Critical').length,
    };

    const recentCrop = list.length > 0 ? list[0].crop : null;
    const uniqueCrops = Array.from(new Set(list.map(a => a.crop)));

    res.json({
      stats: {
        totalAdvisories: total,
        averageSuitability: avgScore,
        riskBreakdown,
        recentCrop,
        cropsMonitored: uniqueCrops.length,
        recentAdvisory: list.length > 0 ? {
          id: list[0].id,
          crop: list[0].crop,
          location: list[0].location,
          score: list[0].crop_suitability_score,
          risk: list[0].overall_risk_level,
          date: list[0].created_at
        } : null
      }
    });
  } catch (err: any) {
    console.error('[Advisory Stats Error]:', err);
    res.status(500).json({ error: 'Failed to calculate advisory statistics.' });
  }
});

// 4. Get single advisory by ID
advisoryRouter.get('/:id', optionalAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM advisories WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Advisory report not found.' });
      return;
    }

    const row = result.rows[0];
    const record: AdvisoryRecord = {
      ...row,
      input_payload: typeof row.input_payload === 'string' ? JSON.parse(row.input_payload) : row.input_payload,
      advisory_result: typeof row.advisory_result === 'string' ? JSON.parse(row.advisory_result) : row.advisory_result
    };

    // If record belongs to a user, verify it matches or is public/shared
    if (row.user_id && req.user && row.user_id !== req.user.id) {
      res.status(403).json({ error: 'Access denied to this advisory report.' });
      return;
    }

    res.json({ advisory: record });
  } catch (err: any) {
    console.error('[Get Advisory Error]:', err);
    res.status(500).json({ error: 'Failed to retrieve advisory report.' });
  }
});

// 5. Delete advisory by ID
advisoryRouter.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check ownership
    const existing = await query('SELECT * FROM advisories WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      res.status(404).json({ error: 'Advisory not found' });
      return;
    }

    if (existing.rows[0].user_id !== userId) {
      res.status(403).json({ error: 'You do not have permission to delete this record.' });
      return;
    }

    await query('DELETE FROM advisories WHERE id = $1', [id]);
    res.json({ message: 'Advisory record successfully deleted.' });
  } catch (err: any) {
    console.error('[Delete Advisory Error]:', err);
    res.status(500).json({ error: 'Failed to delete advisory record.' });
  }
});
