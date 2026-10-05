import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Sprout,
  MapPin,
  CloudSun,
  AlertTriangle,
  Send,
  Layers,
  Thermometer,
  Check,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import type { AdvisoryInputPayload, FarmerObjective } from '../types';
import { AdvisoryLoading } from '../components/LoadingSkeleton';

export const NewAdvisory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial form state
  const [formData, setFormData] = useState<AdvisoryInputPayload>({
    farmName: '',
    location: '',
    farmSize: 5,
    farmSizeUnit: 'Acres',
    soilType: 'Alluvial Loam',
    soilPh: 6.8,
    soilFertilityStatus: 'Moderate',
    previousCrop: 'Fallow / Green Manure',
    irrigationMethod: 'Drip',
    waterAvailability: 'Adequate',

    crop: 'Wheat',
    cropVariety: 'HD-2967 / Lok-1',
    growthStage: 'Vegetative',
    plantingDate: '',
    expectedHarvestDate: '',

    temperature: 24,
    recentRainfall: 'Light',
    weatherCondition: 'Sunny/Clear',
    humidity: 55,
    season: 'Rabi/Winter',

    visibleSymptoms: '',
    pestObservations: '',
    diseaseObservations: '',
    leafColorAbnormalities: 'None',
    growthAbnormalities: 'None',
    soilProblems: 'None',
    previousDiseasePestProblems: '',

    fertilizersUsed: 'DAP 50kg/acre at sowing',
    pesticidesUsed: 'None',
    organicManureUsage: 'Farmyard Manure (FYM)',
    irrigationFrequency: 'Weekly',
    otherTreatments: '',

    farmingObjective: 'Improve yield',
    additionalObservations: ''
  });

  // Presets definition
  const applyPreset = (presetName: string) => {
    if (presetName === 'wheat') {
      setFormData({
        farmName: 'Green Valley Farm',
        location: 'Ludhiana, Punjab',
        farmSize: 8,
        farmSizeUnit: 'Acres',
        soilType: 'Alluvial Loam',
        soilPh: 7.1,
        soilFertilityStatus: 'Good',
        previousCrop: 'Rice / Paddy',
        irrigationMethod: 'Flood/Furrow',
        waterAvailability: 'Adequate',

        crop: 'Wheat',
        cropVariety: 'HD-3086',
        growthStage: 'Vegetative',
        plantingDate: '2025-11-15',
        expectedHarvestDate: '2026-04-10',

        temperature: 21,
        recentRainfall: 'Light',
        weatherCondition: 'Sunny/Clear',
        humidity: 60,
        season: 'Rabi/Winter',

        visibleSymptoms: 'Mild yellowing on lower leaves, slow tillering',
        pestObservations: 'Minor aphid presence on leaf sheaths',
        diseaseObservations: 'No fungal rust spots detected yet',
        leafColorAbnormalities: 'Yellowing/Chlorosis',
        growthAbnormalities: 'None',
        soilProblems: 'None',
        previousDiseasePestProblems: 'Yellow rust in preceding season',

        fertilizersUsed: 'DAP 55kg/acre + Urea 45kg/acre at 21 days',
        pesticidesUsed: 'None',
        organicManureUsage: 'Farmyard Manure (FYM)',
        irrigationFrequency: 'Bi-weekly',
        otherTreatments: 'Seed treated with biofungicide',

        farmingObjective: 'Improve yield',
        additionalObservations: 'Aiming for 22 quintals/acre yield with optimal nitrogen split.'
      });
    } else if (presetName === 'rice') {
      setFormData({
        farmName: 'Cauvery Delta Plot',
        location: 'Thanjavur, Tamil Nadu',
        farmSize: 5,
        farmSizeUnit: 'Acres',
        soilType: 'Clay Loam',
        soilPh: 6.5,
        soilFertilityStatus: 'Good',
        previousCrop: 'Black Gram / Pulse',
        irrigationMethod: 'Canal',
        waterAvailability: 'Abundant',

        crop: 'Paddy / Rice',
        cropVariety: 'BPT-5204 (Samba Mahsuri)',
        growthStage: 'Flowering/Tillering',
        plantingDate: '2025-08-10',
        expectedHarvestDate: '2025-12-15',

        temperature: 31,
        recentRainfall: 'Moderate',
        weatherCondition: 'Humid',
        humidity: 78,
        season: 'Kharif/Monsoon',

        visibleSymptoms: 'Leaf tips slightly white, occasional dead hearts observed in central tillers',
        pestObservations: 'Stem borer moths flying at dusk',
        diseaseObservations: 'Early blast lesions suspected on nursery edges',
        leafColorAbnormalities: 'Spots/Lesions',
        growthAbnormalities: 'None',
        soilProblems: 'Waterlogging',
        previousDiseasePestProblems: 'Bacterial leaf blight history',

        fertilizersUsed: 'Complex 17:17:17 @ 75kg/acre',
        pesticidesUsed: 'Cartap Hydrochloride applied once',
        organicManureUsage: 'Green Manure',
        irrigationFrequency: 'Daily',
        otherTreatments: 'Neem cake incorporated at puddling',

        farmingObjective: 'Reduce disease risk',
        additionalObservations: 'Water level maintained at 5cm depth. Need disease prevention advice.'
      });
    } else if (presetName === 'tomato') {
      setFormData({
        farmName: 'Sunrise Polyfarm',
        location: 'Kolar, Karnataka',
        farmSize: 3,
        farmSizeUnit: 'Acres',
        soilType: 'Red / Laterite',
        soilPh: 6.2,
        soilFertilityStatus: 'Moderate',
        previousCrop: 'Fallow / Marigold',
        irrigationMethod: 'Drip',
        waterAvailability: 'Limited',

        crop: 'Tomato',
        cropVariety: 'Arka Rakshak F1',
        growthStage: 'Fruiting/Grain filling',
        plantingDate: '2025-09-01',
        expectedHarvestDate: '2025-12-20',

        temperature: 28,
        recentRainfall: 'None',
        weatherCondition: 'Sunny/Clear',
        humidity: 48,
        season: 'Zaid/Summer',

        visibleSymptoms: 'Upward curling of top leaves, blossom end rot on few young fruits',
        pestObservations: 'Whitefly sightings on leaf underside',
        diseaseObservations: 'Leaf curl suspected',
        leafColorAbnormalities: 'Mottling',
        growthAbnormalities: 'Leaf curling',
        soilProblems: 'Crusting/Hardpan',
        previousDiseasePestProblems: 'Early blight and fruit borer',

        fertilizersUsed: '19:19:19 water soluble via fertigation weekly',
        pesticidesUsed: 'Neem oil spray (1500ppm)',
        organicManureUsage: 'Vermicompost',
        irrigationFrequency: 'Alternate Days',
        otherTreatments: 'Calcium nitrate foliar spray once',

        farmingObjective: 'Identify possible pest/disease issue',
        additionalObservations: 'Need to control whitefly vector and address blossom end calcium deficit.'
      });
    }
  };

  useEffect(() => {
    const preset = searchParams.get('preset');
    if (preset) {
      applyPreset(preset);
    }
  }, [searchParams]);

  const handleChange = (field: keyof AdvisoryInputPayload, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation checks
    if (!formData.location || formData.location.trim().length < 2) {
      setError('Please provide a valid farm location (e.g. District, State/Province).');
      setCurrentStep(1);
      return;
    }

    if (!formData.crop || formData.crop.trim().length < 2) {
      setError('Please provide the crop name.');
      setCurrentStep(2);
      return;
    }

    setLoading(true);

    try {
      const response = await api.generateAdvisory(formData);
      navigate(`/advisory/${response.advisory.id}`);
    } catch (err: any) {
      console.error('Advisory creation failed:', err);
      setError(err.message || 'Failed to synthesize advisory report. Please verify inputs and try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return <AdvisoryLoading crop={formData.crop} />;
  }

  const steps = [
    { id: 1, label: 'Farm & Soil', icon: Layers },
    { id: 2, label: 'Crop Details', icon: Sprout },
    { id: 3, label: 'Weather & Climate', icon: CloudSun },
    { id: 4, label: 'Health & Symptoms', icon: AlertTriangle },
    { id: 5, label: 'Inputs & Goals', icon: Send }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            AI Agronomy Diagnostic Wizard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            New Crop Advisory Submission
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Fill in your farm conditions for personalized AI-generated irrigation, nutrient, and risk management advice.
          </p>
        </div>

        {/* Preset selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Quick Presets:</span>
          <button
            type="button"
            onClick={() => applyPreset('wheat')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
          >
            Wheat
          </button>
          <button
            type="button"
            onClick={() => applyPreset('rice')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 hover:bg-teal-100 transition-colors"
          >
            Paddy
          </button>
          <button
            type="button"
            onClick={() => applyPreset('tomato')}
            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 transition-colors"
          >
            Tomato
          </button>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-5 gap-2">
          {steps.map(s => {
            const Icon = s.icon;
            const isDone = currentStep > s.id;
            const isCurrent = currentStep === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrentStep(s.id)}
                className={`flex flex-col items-center gap-1.5 p-2 rounded-xl text-center transition-all ${
                  isCurrent
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                    : isDone
                    ? 'text-slate-700 font-semibold hover:bg-slate-50'
                    : 'text-slate-400 font-medium hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                    isCurrent
                      ? 'bg-emerald-600 text-white'
                      : isDone
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[11px] truncate w-full hidden sm:block">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {/* Step 1: Farm & Soil Profile */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">1. Farm & Soil Profile</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Farm Name <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.farmName}
                  onChange={e => handleChange('farmName', e.target.value)}
                  placeholder="e.g. Green Meadows Plot #3"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Farm Location <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={e => handleChange('location', e.target.value)}
                    placeholder="e.g. Ludhiana, Punjab or Fresno, California"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-hidden"
                  />
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Farm Size & Unit</label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={formData.farmSize || ''}
                    onChange={e => handleChange('farmSize', parseFloat(e.target.value) || undefined)}
                    className="col-span-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                    placeholder="5"
                  />
                  <select
                    value={formData.farmSizeUnit}
                    onChange={e => handleChange('farmSizeUnit', e.target.value)}
                    className="col-span-2 text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                  >
                    <option value="Acres">Acres</option>
                    <option value="Hectares">Hectares</option>
                    <option value="Bigha">Bigha</option>
                    <option value="Guntha">Guntha</option>
                    <option value="Square Meters">Square Meters</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Soil Type <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.soilType}
                  onChange={e => handleChange('soilType', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Alluvial Loam">Alluvial Loam (Fertile, river basin)</option>
                  <option value="Black / Vertisol">Black / Vertisol (High clay, moisture retentive)</option>
                  <option value="Red / Laterite">Red / Laterite (Porous, iron-rich, acidic)</option>
                  <option value="Sandy Loam">Sandy Loam (Light, free-draining)</option>
                  <option value="Clay Loam">Clay Loam (Heavy, nutrient rich)</option>
                  <option value="Silt Loam">Silt Loam (Smooth, easily compacted)</option>
                  <option value="Saline / Alkaline">Saline / Alkaline (Salt affected)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Soil pH <span className="text-slate-400 font-normal">(if tested, e.g. 6.8)</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="3.0"
                  max="11.0"
                  value={formData.soilPh !== undefined ? formData.soilPh : ''}
                  onChange={e => handleChange('soilPh', e.target.value ? parseFloat(e.target.value) : undefined)}
                  placeholder="e.g. 6.5"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Soil Fertility Status</label>
                <select
                  value={formData.soilFertilityStatus}
                  onChange={e => handleChange('soilFertilityStatus', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Poor">Poor (Depleted, low organic carbon)</option>
                  <option value="Moderate">Moderate (Average yields)</option>
                  <option value="Good">Good (Healthy organic matter)</option>
                  <option value="Rich">Rich (High fertility, composted)</option>
                  <option value="Unknown">Unknown / Not tested</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Previous Crop Grown</label>
                <input
                  type="text"
                  value={formData.previousCrop}
                  onChange={e => handleChange('previousCrop', e.target.value)}
                  placeholder="e.g. Fallow, Mustard, Legumes, Cotton"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Irrigation Method</label>
                <select
                  value={formData.irrigationMethod}
                  onChange={e => handleChange('irrigationMethod', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Drip">Drip Irrigation (Micro-irrigation)</option>
                  <option value="Sprinkler">Sprinkler Irrigation</option>
                  <option value="Flood/Furrow">Flood / Furrow Irrigation</option>
                  <option value="Rainfed">Rainfed (Dependent on monsoons)</option>
                  <option value="Canal">Canal Irrigation</option>
                  <option value="Borewell">Borewell / Tube well</option>
                  <option value="Manual">Manual Watering</option>
                  <option value="None">None</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Water Availability <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['Abundant', 'Adequate', 'Limited', 'Scarce', 'Drought-prone'] as const).map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleChange('waterAvailability', opt)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        formData.waterAvailability === opt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Crop Details */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sprout className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">2. Crop Information & Growth Stage</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Crop <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.crop}
                  onChange={e => handleChange('crop', e.target.value)}
                  placeholder="e.g. Wheat, Rice, Cotton, Tomato, Maize, Potato"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Crop Variety / Hybrid <span className="text-slate-400 font-normal">(if known)</span>
                </label>
                <input
                  type="text"
                  value={formData.cropVariety}
                  onChange={e => handleChange('cropVariety', e.target.value)}
                  placeholder="e.g. HD-2967, Arka Rakshak, Pioneer 3302"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Growth Stage <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.growthStage}
                  onChange={e => handleChange('growthStage', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden font-medium"
                >
                  <option value="Pre-sowing/Preparation">Pre-sowing / Land Preparation</option>
                  <option value="Germination/Seedling">Germination / Seedling Stage</option>
                  <option value="Vegetative">Vegetative Growth Stage (Branching & Foliage)</option>
                  <option value="Flowering/Tillering">Flowering / Tillering / Panicle Initiation</option>
                  <option value="Fruiting/Grain filling">Fruiting / Pod Formation / Grain Filling</option>
                  <option value="Maturity/Harvest">Maturity / Ripening / Pre-Harvest</option>
                  <option value="Post-harvest">Post-harvest / Residue Management</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Planting Date</label>
                <input
                  type="date"
                  value={formData.plantingDate}
                  onChange={e => handleChange('plantingDate', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Expected Harvest Date</label>
                <input
                  type="date"
                  value={formData.expectedHarvestDate}
                  onChange={e => handleChange('expectedHarvestDate', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Climate & Weather */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CloudSun className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">3. Environmental & Weather Conditions</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Temperature (°C)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="-10"
                    max="55"
                    value={formData.temperature !== undefined ? formData.temperature : ''}
                    onChange={e => handleChange('temperature', e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="e.g. 26"
                    className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                  />
                  <Thermometer className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Current Weather Condition <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.weatherCondition}
                  onChange={e => handleChange('weatherCondition', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Sunny/Clear">Sunny / Clear Skies</option>
                  <option value="Partly Cloudy">Partly Cloudy</option>
                  <option value="Overcast">Overcast / Cloud Cover</option>
                  <option value="Humid">Humid / Sultry</option>
                  <option value="Rainy">Rainy / Intermittent Showers</option>
                  <option value="Dry/Arid">Dry / Arid / Low Moisture</option>
                  <option value="Stormy">Stormy / High Winds</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Recent Rainfall</label>
                <select
                  value={formData.recentRainfall}
                  onChange={e => handleChange('recentRainfall', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="None">None (Dry spell)</option>
                  <option value="Light">Light Shower (&lt;10 mm)</option>
                  <option value="Moderate">Moderate Rainfall (10-30 mm)</option>
                  <option value="Heavy">Heavy Rain (30-60 mm)</option>
                  <option value="Excessive">Excessive Rain / Waterlogging risk</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Relative Humidity (%) <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.humidity !== undefined ? formData.humidity : ''}
                  onChange={e => handleChange('humidity', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="e.g. 60"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Agricultural Season</label>
                <select
                  value={formData.season}
                  onChange={e => handleChange('season', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Kharif/Monsoon">Kharif / Monsoon Season (June - October)</option>
                  <option value="Rabi/Winter">Rabi / Winter Season (October - April)</option>
                  <option value="Zaid/Summer">Zaid / Summer Season (March - June)</option>
                  <option value="Spring">Spring Season</option>
                  <option value="Autumn">Autumn Season</option>
                  <option value="All-season">Perennial / All-season</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Health & Symptoms */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900">4. Crop Health & Symptoms</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Visible Symptoms Observed on Plants
                </label>
                <textarea
                  rows={3}
                  value={formData.visibleSymptoms}
                  onChange={e => handleChange('visibleSymptoms', e.target.value)}
                  placeholder="Describe anything unusual: e.g. lower leaves turning pale yellow, brown necrotic spots on margins, wilting in afternoon sun..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Leaf Discoloration</label>
                  <select
                    value={formData.leafColorAbnormalities}
                    onChange={e => handleChange('leafColorAbnormalities', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                  >
                    <option value="None">None (Healthy green)</option>
                    <option value="Yellowing/Chlorosis">Yellowing / Chlorosis</option>
                    <option value="Browning/Necrosis">Browning / Necrosis</option>
                    <option value="Purpling">Purpling (Phosphorus deficiency)</option>
                    <option value="Mottling">Mottling / Mosaic Pattern</option>
                    <option value="White powdery coating">White Powdery Coating</option>
                    <option value="Spots/Lesions">Spots / Concentric Lesions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Growth Abnormalities</label>
                  <select
                    value={formData.growthAbnormalities}
                    onChange={e => handleChange('growthAbnormalities', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                  >
                    <option value="None">None (Normal vigour)</option>
                    <option value="Stunted growth">Stunted / Dwarfed</option>
                    <option value="Wilting">Wilting / Drooping</option>
                    <option value="Leaf curling">Leaf Curling (Upward/Downward)</option>
                    <option value="Premature drop">Premature Flower/Fruit Drop</option>
                    <option value="Stem thinning">Stem Thinning / Weak tillers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Soil/Field Problems</label>
                  <select
                    value={formData.soilProblems}
                    onChange={e => handleChange('soilProblems', e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                  >
                    <option value="None">None</option>
                    <option value="Waterlogging">Waterlogging / Poor Drainage</option>
                    <option value="Crusting/Hardpan">Soil Crusting / Hardpan</option>
                    <option value="Salinity">White Saline Patches</option>
                    <option value="Erosion">Topsoil Erosion</option>
                    <option value="Compaction">Heavy Compaction</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Pest Observations</label>
                  <input
                    type="text"
                    value={formData.pestObservations}
                    onChange={e => handleChange('pestObservations', e.target.value)}
                    placeholder="e.g. Aphids, whiteflies, caterpillars, stem borer"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Disease Observations</label>
                  <input
                    type="text"
                    value={formData.diseaseObservations}
                    onChange={e => handleChange('diseaseObservations', e.target.value)}
                    placeholder="e.g. Mildew, rust spots, blight, damping-off"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Previous Pest/Disease Problems on this Plot
                </label>
                <input
                  type="text"
                  value={formData.previousDiseasePestProblems}
                  onChange={e => handleChange('previousDiseasePestProblems', e.target.value)}
                  placeholder="e.g. Severe powdery mildew in last winter crop"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Inputs & Farming Objective */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Send className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">5. Current Inputs & Farmer Objective</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fertilizers Already Applied
                </label>
                <input
                  type="text"
                  value={formData.fertilizersUsed}
                  onChange={e => handleChange('fertilizersUsed', e.target.value)}
                  placeholder="e.g. DAP 50kg, Urea 45kg split dose"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Pesticides / Fungicides Used
                </label>
                <input
                  type="text"
                  value={formData.pesticidesUsed}
                  onChange={e => handleChange('pesticidesUsed', e.target.value)}
                  placeholder="e.g. Neem oil 1500ppm, Mancozeb spray"
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Organic Manure Usage</label>
                <select
                  value={formData.organicManureUsage}
                  onChange={e => handleChange('organicManureUsage', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="None">None</option>
                  <option value="Farmyard Manure (FYM)">Farmyard Manure (FYM)</option>
                  <option value="Vermicompost">Vermicompost</option>
                  <option value="Green Manure">Green Manure (Dhaincha/Sunn hemp)</option>
                  <option value="Biofertilizers">Biofertilizers (Azotobacter, PSB)</option>
                  <option value="Compost">Compost</option>
                  <option value="Multiple">Multiple Organic Inputs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Irrigation Frequency</label>
                <select
                  value={formData.irrigationFrequency}
                  onChange={e => handleChange('irrigationFrequency', e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:border-emerald-500 outline-hidden"
                >
                  <option value="Daily">Daily</option>
                  <option value="Alternate Days">Every Alternate Day</option>
                  <option value="Weekly">Weekly (Every 7 days)</option>
                  <option value="Bi-weekly">Bi-weekly (Every 12-15 days)</option>
                  <option value="Rain-dependent">Rain-dependent</option>
                  <option value="As needed">As needed / Soil tensiometer</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Primary Farmer Objective <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      'Improve yield',
                      'Reduce disease risk',
                      'Reduce fertilizer cost',
                      'Improve soil health',
                      'Select a suitable crop',
                      'Improve irrigation',
                      'Identify possible pest/disease issue',
                      'General crop guidance'
                    ] as FarmerObjective[]
                  ).map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => handleChange('farmingObjective', obj)}
                      className={`p-3 text-xs font-semibold rounded-2xl border text-center transition-all ${
                        formData.farmingObjective === obj
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Additional Notes / Specific Questions for AI Agronomist
                </label>
                <textarea
                  rows={2}
                  value={formData.additionalObservations}
                  onChange={e => handleChange('additionalObservations', e.target.value)}
                  placeholder="Any particular concerns, upcoming market dates, or local water restrictions..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-emerald-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step Navigation & Action Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Previous Step
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
              >
                Next Step ({currentStep + 1} of 5)
              </button>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm shadow-lg shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Synthesize AI Crop Advisory
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
