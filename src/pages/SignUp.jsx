import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Compass, Mail, Lock, Eye, EyeOff, User, Sparkles, AlertCircle, Check } from 'lucide-react'

function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ characters', ok: password.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(password) },
    { label: 'Number', ok: /[0-9]/.test(password) },
  ]
  const score = checks.filter(c => c.ok).length
  const colors = ['bg-red-500', 'bg-amber-500', 'bg-green-500']
  const labels = ['Weak', 'Fair', 'Strong']

  if (!password) return null

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0, 1, 2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i < score ? colors[score - 1] : 'bg-slate-700'}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {checks.map(({ label, ok }) => (
            <span key={label} className={`text-xs flex items-center gap-1 ${ok ? 'text-green-400' : 'text-slate-600'}`}>
              <Check className="w-3 h-3" /> {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-medium ${['text-red-400', 'text-amber-400', 'text-green-400'][score - 1]}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  )
}

export default function SignUp() {
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:5001/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password
        })
      })

      const data = await res.json()
      setLoading(false)

      if (res.ok) {
        alert("Signup successful")
        navigate("/signin")
      } else {
        setError(data.message)
      }

    } catch (err) {
      setLoading(false)
      setError("Server error")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">

        <Link to="/" className="flex justify-center mb-6 text-white text-xl font-bold">
          NavAIgate
        </Link>

        <div className="p-6 border rounded-xl bg-slate-900 text-white">
          <h2 className="text-xl mb-4">Create Account</h2>

          {error && <p className="text-red-400 mb-3">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-3">

            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full p-2 rounded bg-slate-800"
            />

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full p-2 rounded bg-slate-800"
            />

            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              className="w-full p-2 rounded bg-slate-800"
            />

            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={(e) => setForm(p => ({ ...p, confirm: e.target.value }))}
              className="w-full p-2 rounded bg-slate-800"
            />

            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="text-sm text-blue-400"
            >
              {showPass ? "Hide Password" : "Show Password"}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 py-2 rounded"
            >
              {loading ? "Creating..." : "Signup"}
            </button>

          </form>

          <p className="text-sm mt-4">
            Already have account? <Link to="/signin" className="text-blue-400">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}