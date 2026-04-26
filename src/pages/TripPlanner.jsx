import { useState } from 'react'
import { Sparkles, MapPin, Calendar, Wallet, Users, Heart, Mountain, Waves, Building, TreePine, ChevronDown, Check, ArrowRight, Download, Share2, Star } from 'lucide-react'

const DESTINATIONS = [
  'Goa', 'Ladakh', 'Manali', 'Pondicherry', 'Shimla', 'Munnar',
  'Darjeeling', 'Jaipur', 'Udaipur', 'Varanasi', 'Agra', 'Hampi',
  'Rishikesh', 'Coorg', 'Gangtok', 'Delhi', 'Mumbai', 'Hyderabad',
  'Andaman & Nicobar', 'Kerala Backwaters'
]

const TRAVEL_TYPES = [
  { value: 'adventure', label: 'Adventure', icon: Mountain },
  { value: 'romantic', label: 'Romantic', icon: Heart },
  { value: 'family', label: 'Family', icon: Users },
  { value: 'solo', label: 'Solo', icon: Star },
  { value: 'spiritual', label: 'Spiritual', icon: Sparkles },
  { value: 'beach', label: 'Beach', icon: Waves },
]

const PREFERENCES = ['Trekking', 'Food Tours', 'Nightlife', 'Museums', 'Shopping', 'Yoga', 'Wildlife', 'Photography', 'Local Culture', 'Backpacking']

const PLAN_DATA = {
  budget: {
    label: 'Budget Plan',
    subtitle: 'Smart savings, real experiences',
    color: 'from-green-500 to-emerald-400',
    borderColor: 'border-green-500/30',
    bgColor: 'bg-green-500/5',
    textColor: 'text-green-400',
    badge: 'Most Popular',
    badgeColor: 'bg-green-500/20 text-green-400',
    multiplier: 1,
    accommodation: 'Budget guesthouses & hostels',
    transport: 'Local buses & shared cabs',
    food: 'Street food & local dhabas',
    activities: 'Free & low-cost attractions',
  },
  deluxe: {
    label: 'Deluxe Plan',
    subtitle: 'Comfort meets adventure',
    color: 'from-blue-500 to-indigo-400',
    borderColor: 'border-blue-500/30',
    bgColor: 'bg-blue-500/5',
    textColor: 'text-blue-400',
    badge: 'Best Value',
    badgeColor: 'bg-blue-500/20 text-blue-400',
    multiplier: 2.2,
    accommodation: '3-star hotels & boutique stays',
    transport: 'AC buses & private taxis',
    food: 'Restaurants & rooftop cafes',
    activities: 'Guided tours & adventure sports',
  },
  luxury: {
    label: 'Luxury Plan',
    subtitle: 'Premium comfort, curated experiences',
    color: 'from-purple-500 to-violet-400',
    borderColor: 'border-purple-500/30',
    bgColor: 'bg-purple-500/5',
    textColor: 'text-purple-400',
    badge: 'Premium',
    badgeColor: 'bg-purple-500/20 text-purple-400',
    multiplier: 4,
    accommodation: '5-star resorts & heritage hotels',
    transport: 'Private car & domestic flights',
    food: 'Fine dining & celebrity restaurants',
    activities: 'Private tours & exclusive experiences',
  },
  jackpot: {
    label: 'Jackpot Plan',
    subtitle: 'The ultimate Indian splurge',
    color: 'from-amber-500 to-orange-400',
    borderColor: 'border-amber-500/30',
    bgColor: 'bg-amber-500/5',
    textColor: 'text-amber-400',
    badge: 'Ultimate',
    badgeColor: 'bg-amber-500/20 text-amber-400',
    multiplier: 7,
    accommodation: 'Palace hotels & private villas',
    transport: 'Chartered flights & luxury coaches',
    food: 'Chef\'s table & private dining',
    activities: 'Elephant safaris, private cruises & heli-tours',
  }
}

function generateItinerary(form, planType) {
  const plan = PLAN_DATA[planType]
  const days = parseInt(form.duration) || 5
  const basePerDay = (parseInt(form.budget) || 10000) / days

  const dayTemplates = [
    { morning: 'Arrival & check-in at accommodation', afternoon: 'Explore local market and city center', evening: 'Welcome dinner at a popular local restaurant' },
    { morning: 'Visit the main attraction / landmark', afternoon: 'Local sightseeing and photography', evening: 'Sunset viewpoint and street food tour' },
    { morning: 'Adventure activity / nature walk', afternoon: 'Museum or heritage site visit', evening: 'Cultural show or evening entertainment' },
    { morning: 'Day trip to nearby town or village', afternoon: 'Shopping and souvenir hunting', evening: 'Cooking class or food walk' },
    { morning: 'Leisure morning at resort/beach', afternoon: 'Water sports or trekking', evening: 'Farewell dinner and packing' },
  ]

  const itinerary = []
  for (let i = 0; i < Math.min(days, 5); i++) {
    const template = dayTemplates[i % dayTemplates.length]
    itinerary.push({
      day: i + 1,
      ...template,
      budget: Math.round(basePerDay * plan.multiplier / 3),
    })
  }
  return itinerary
}

function PlanCard({ planType, form, isSelected, onSelect }) {
  const plan = PLAN_DATA[planType]
  const budget = parseInt(form.budget) || 10000
  const estimatedCost = Math.round(budget * plan.multiplier)
  const itinerary = generateItinerary(form, planType)
  const [expanded, setExpanded] = useState(false)

  return (
    <div
      className={`plan-card rounded-2xl border ${plan.borderColor} ${plan.bgColor} ${
        isSelected ? 'ring-2 ring-offset-2 ring-offset-navy-950 ' + plan.borderColor.replace('border-', 'ring-') : ''
      } overflow-hidden cursor-pointer`}
      onClick={() => onSelect(planType)}
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${plan.color} p-5`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display font-bold text-white text-xl">{plan.label}</h3>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${plan.badgeColor} bg-white/20 text-white`}>
            {plan.badge}
          </span>
        </div>
        <p className="text-white/80 text-sm">{plan.subtitle}</p>
        <div className="mt-4 flex items-end gap-2">
          <span className="font-display font-bold text-3xl text-white">₹{estimatedCost.toLocaleString()}</span>
          <span className="text-white/60 text-sm mb-1">est. total</span>
        </div>
      </div>

      {/* Details */}
      <div className="p-5">
        <div className="grid grid-cols-1 gap-3 mb-4">
          {[
            { label: '🏨 Stay', value: plan.accommodation },
            { label: '🚌 Transport', value: plan.transport },
            { label: '🍽️ Food', value: plan.food },
            { label: '🎯 Activities', value: plan.activities },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-start gap-2">
              <span className="text-xs text-slate-400 w-24 flex-shrink-0 mt-0.5">{label}</span>
              <span className="text-xs text-slate-300">{value}</span>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        <button
          onClick={e => { e.stopPropagation(); setExpanded(!expanded) }}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg ${plan.bgColor} ${plan.textColor} text-sm font-medium transition-all`}
        >
          View {parseInt(form.duration) || 5}-Day Itinerary
          <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>

        {expanded && (
          <div className="mt-3 space-y-3">
            {itinerary.map(day => (
              <div key={day.day} className="glass rounded-xl p-3">
                <div className={`font-display font-semibold text-sm ${plan.textColor} mb-2`}>Day {day.day}</div>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div><span className="text-slate-500">🌅 Morning:</span> {day.morning}</div>
                  <div><span className="text-slate-500">☀️ Afternoon:</span> {day.afternoon}</div>
                  <div><span className="text-slate-500">🌙 Evening:</span> {day.evening}</div>
                  <div className={`font-medium ${plan.textColor} mt-1`}>~₹{day.budget.toLocaleString()}/person</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Select */}
        <button
          onClick={e => { e.stopPropagation(); onSelect(planType) }}
          className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isSelected
              ? `bg-gradient-to-r ${plan.color} text-white shadow-lg`
              : `glass border ${plan.borderColor} ${plan.textColor} hover:bg-white/5`
          }`}
        >
          {isSelected ? <><Check className="w-4 h-4" /> Selected</> : <>Select this Plan <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    </div>
  )
}

export default function TripPlanner() {
  const [step, setStep] = useState(1) // 1 = form, 2 = plans
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [form, setForm] = useState({
    destination: '',
    budget: '',
    duration: '',
    travelType: '',
    groupSize: '2',
    preferences: [],
  })

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const togglePref = (pref) => {
    setForm(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }))
  }

  const handleGenerate = () => {
    if (!form.destination || !form.budget || !form.duration) return
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setStep(2)
    }, 2000)
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="section-tag mx-auto w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            AI Trip Planner
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            Plan Your Perfect <span className="gradient-text">India Trip</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto">
            Tell us your preferences and get 4 personalized plans instantly — from budget backpacking to luxury splurge.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[{ n: 1, label: 'Your Preferences' }, { n: 2, label: 'Choose Your Plan' }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step >= n ? 'bg-teal-500 text-navy-950' : 'bg-navy-800 text-slate-500 border border-slate-700'
              }`}>
                {step > n ? <Check className="w-4 h-4" /> : n}
              </div>
              <span className={`text-sm ${step >= n ? 'text-white' : 'text-slate-500'}`}>{label}</span>
              {n < 2 && <div className={`w-16 h-px ${step > n ? 'bg-teal-500' : 'bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1: Form */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="card space-y-6">
              {/* Destination */}
              <div>
                <label className="label flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-400" /> Destination</label>
                <select
                  value={form.destination}
                  onChange={e => update('destination', e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a destination...</option>
                  {DESTINATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Budget & Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label flex items-center gap-2"><Wallet className="w-4 h-4 text-amber-400" /> Budget (₹)</label>
                  <input
                    type="number"
                    value={form.budget}
                    onChange={e => update('budget', e.target.value)}
                    placeholder="e.g. 15000"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-400" /> Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={form.duration}
                    onChange={e => update('duration', e.target.value)}
                    placeholder="e.g. 5"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Group Size */}
              <div>
                <label className="label flex items-center gap-2"><Users className="w-4 h-4 text-purple-400" /> Group Size</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={form.groupSize}
                  onChange={e => update('groupSize', e.target.value)}
                  className="input-field"
                />
              </div>

              {/* Travel Type */}
              <div>
                <label className="label">Travel Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {TRAVEL_TYPES.map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => update('travelType', value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all text-sm font-medium ${
                        form.travelType === value
                          ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                          : 'border-slate-700/50 bg-navy-800/50 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preferences */}
              <div>
                <label className="label">Interests (select any)</label>
                <div className="flex flex-wrap gap-2">
                  {PREFERENCES.map(pref => (
                    <button
                      key={pref}
                      onClick={() => togglePref(pref)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        form.preferences.includes(pref)
                          ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                          : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={!form.destination || !form.budget || !form.duration || isGenerating}
                className="w-full btn-primary py-4 text-base flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed glow-teal"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
                    Generating Your Plans...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate 4 AI Plans
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Plans */}
        {step === 2 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="font-display text-2xl font-bold text-white mb-2">
                Your Plans for <span className="gradient-text">{form.destination}</span>
              </h2>
              <p className="text-slate-400 text-sm">
                {form.duration} days · {form.groupSize} person(s) · Budget: ₹{parseInt(form.budget).toLocaleString()}
              </p>
              <button onClick={() => setStep(1)} className="btn-ghost text-sm mt-3">
                ← Modify Preferences
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
              {Object.keys(PLAN_DATA).map(planType => (
                <PlanCard
                  key={planType}
                  planType={planType}
                  form={form}
                  isSelected={selectedPlan === planType}
                  onSelect={setSelectedPlan}
                />
              ))}
            </div>

            {selectedPlan && (
              <div className="glass rounded-2xl p-6 text-center">
                <h3 className="font-display font-bold text-white text-xl mb-2">
                  Great choice! You selected the <span className={PLAN_DATA[selectedPlan].textColor}>{PLAN_DATA[selectedPlan].label}</span>
                </h3>
                <p className="text-slate-400 text-sm mb-6">Download your full itinerary or chat with AI to customize further.</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary flex items-center gap-2 px-6">
                    <Download className="w-4 h-4" /> Download Itinerary
                  </button>
                  <button className="btn-secondary flex items-center gap-2 px-6">
                    <Share2 className="w-4 h-4" /> Share Plan
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
