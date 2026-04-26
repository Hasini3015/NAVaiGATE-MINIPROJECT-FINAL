import { useState } from 'react'
import { Wallet, Plus, Trash2, AlertTriangle, TrendingUp, Zap, ShoppingBag, Car, Hotel, Utensils, Ticket, Gift, Heart } from 'lucide-react'

const CATEGORIES = [
  { id: 'hotel', label: 'Hotel', icon: Hotel, color: 'text-blue-400' },
  { id: 'food', label: 'Food', icon: Utensils, color: 'text-amber-400' },
  { id: 'transport', label: 'Transport', icon: Car, color: 'text-green-400' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'text-pink-400' },
  { id: 'activities', label: 'Activities', icon: Ticket, color: 'text-purple-400' },
  { id: 'souvenir', label: 'Souvenir', icon: Gift, color: 'text-orange-400' },
  { id: 'other', label: 'Other', icon: Zap, color: 'text-slate-400' },
]

const QUICK_ADD = [
  { label: 'Auto-rickshaw', amount: 150, category: 'transport' },
  { label: 'Street food', amount: 200, category: 'food' },
  { label: 'Hotel 1 night', amount: 2500, category: 'hotel' },
  { label: 'Entry ticket', amount: 500, category: 'activities' },
  { label: 'Souvenir', amount: 300, category: 'souvenir' },
  { label: 'Tip', amount: 100, category: 'other' },
]

const CAT_ICONS = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

export default function BudgetTracker() {
  const [budget, setBudget] = useState(56000)
  const [expenses, setExpenses] = useState([
    { id: 1, desc: 'Auto-rickshaw', amount: 150, category: 'transport', date: '2026-04-22' },
    { id: 2, desc: 'paid', amount: 50000, category: 'shopping', date: '2026-04-22' },
    { id: 3, desc: 'paid', amount: 10000, category: 'hotel', date: '2026-04-22' },
  ])
  const [form, setForm] = useState({ desc: '', amount: '', category: 'food' })

  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const remaining = budget - total
  const percentage = Math.min((total / budget) * 100, 100)
  const isOverBudget = total > budget

  const addExpense = () => {
    if (!form.desc || !form.amount) return
    setExpenses(prev => [...prev, {
      id: Date.now(),
      desc: form.desc,
      amount: parseFloat(form.amount),
      category: form.category,
      date: new Date().toISOString().split('T')[0],
    }])
    setForm({ desc: '', amount: '', category: 'food' })
  }

  const removeExpense = (id) => setExpenses(prev => prev.filter(e => e.id !== id))

  const byCategory = CATEGORIES.map(cat => ({
    ...cat,
    total: expenses.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0),
    count: expenses.filter(e => e.category === cat.id).length,
  })).filter(c => c.total > 0)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="section-tag w-fit"><Wallet className="w-3.5 h-3.5" /> Budget Tracker</div>
          <h1 className="font-display text-4xl font-bold text-white">
            Budget <span className="gradient-text">Tracker</span>
          </h1>
          <p className="text-slate-400 mt-2">Track your travel expenses and stay within budget</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Budget Setup & Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="card">
                <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-teal-400" /> Set Your Budget
                </h3>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">₹</span>
                    <input
                      type="number"
                      value={budget}
                      onChange={e => setBudget(parseFloat(e.target.value) || 0)}
                      className="input-field pl-7"
                    />
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-teal-400" /> Summary
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Budget</div>
                    <div className="font-display font-bold text-white">₹{budget.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Spent</div>
                    <div className={`font-display font-bold ${isOverBudget ? 'text-red-400' : 'text-amber-400'}`}>
                      ₹{total.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Remaining</div>
                    <div className={`font-display font-bold ${remaining < 0 ? 'text-red-400' : 'text-teal-400'}`}>
                      {remaining < 0 ? '-' : ''}₹{Math.abs(remaining).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-400">Budget Used</span>
                <span className={`text-sm font-bold ${isOverBudget ? 'text-red-400' : 'text-teal-400'}`}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-3 bg-navy-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    isOverBudget
                      ? 'bg-gradient-to-r from-red-500 to-red-400'
                      : percentage > 80
                      ? 'bg-gradient-to-r from-amber-500 to-amber-400'
                      : 'bg-gradient-to-r from-teal-500 to-teal-400'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
              {isOverBudget && (
                <div className="mt-3 flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  You've exceeded your budget by ₹{Math.abs(remaining).toLocaleString()}
                </div>
              )}
            </div>

            {/* Add Expense */}
            <div className="card">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-teal-400" /> Add Expense
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <div className="sm:col-span-2">
                  <label className="label">Description</label>
                  <input
                    type="text"
                    value={form.desc}
                    onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                    placeholder="e.g. Hotel check-in"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Amount (₹)</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={e => setForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0"
                    className="input-field"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="label">Category</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setForm(p => ({ ...p, category: cat.id }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                        form.category === cat.id
                          ? 'border-teal-500/50 bg-teal-500/10 text-teal-400'
                          : 'border-slate-700/50 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={addExpense} className="btn-primary w-full flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Expense
              </button>
            </div>

            {/* Expense List */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-teal-400" /> All Expenses ({expenses.length})
                </h3>
                {expenses.length > 0 && (
                  <button onClick={() => setExpenses([])} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" /> Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {expenses.map(exp => {
                  const cat = CAT_ICONS[exp.category] || CAT_ICONS.other
                  return (
                    <div key={exp.id} className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/50 border border-slate-700/30 group">
                      <div className={`w-8 h-8 rounded-lg bg-navy-700 flex items-center justify-center flex-shrink-0`}>
                        <cat.icon className={`w-4 h-4 ${cat.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{exp.desc}</div>
                        <div className="text-xs text-slate-500">{cat.label} · {exp.date}</div>
                      </div>
                      <div className="font-display font-semibold text-white">₹{exp.amount.toLocaleString()}</div>
                      <button onClick={() => removeExpense(exp.id)} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all ml-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}

                {expenses.length === 0 && (
                  <div className="text-center py-8 text-slate-600">
                    <Wallet className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    No expenses yet. Add your first expense above!
                  </div>
                )}
              </div>

              {expenses.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-700/50 text-right font-display font-bold text-white">
                  Total: ₹{total.toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* By Category */}
            <div className="card">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-400" /> By Category
              </h3>
              {byCategory.length === 0 ? (
                <p className="text-slate-600 text-sm text-center py-4">No data yet</p>
              ) : (
                <div className="space-y-3">
                  {byCategory.map(cat => (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <cat.icon className={`w-4 h-4 ${cat.color}`} />
                          <span className="text-sm text-slate-300">{cat.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-white text-sm">₹{cat.total.toLocaleString()}</span>
                          <span className="text-slate-600 text-xs ml-1">{cat.count} items</span>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-navy-700 rounded-full">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${cat.color.replace('text-', 'from-').replace('-400', '-500')} to-${cat.color.replace('text-', '').replace('-400', '-400')}`}
                          style={{ width: `${(cat.total / total) * 100}%`, background: 'var(--tw-gradient-stops)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Add */}
            <div className="card">
              <h3 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" /> Quick Add
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ADD.map(({ label, amount, category }) => {
                  const cat = CAT_ICONS[category]
                  return (
                    <button
                      key={label}
                      onClick={() => {
                        setExpenses(prev => [...prev, {
                          id: Date.now(),
                          desc: label,
                          amount,
                          category,
                          date: new Date().toISOString().split('T')[0],
                        }])
                      }}
                      className="glass-light p-3 rounded-xl text-left hover:border-teal-500/20 transition-all group"
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <cat.icon className={`w-3.5 h-3.5 ${cat.color}`} />
                        <span className="text-xs text-slate-300 group-hover:text-white transition-colors truncate">{label}</span>
                      </div>
                      <div className="font-display font-semibold text-teal-400 text-sm">₹{amount}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
