import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Compass, Mail, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)

      const res = await fetch("http://localhost:5001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        })
      })

      const data = await res.json()
      setLoading(false)

      if (data.token) {
        // save token
        localStorage.setItem("token", data.token)

        alert("Login successful")

        navigate(from, { replace: true })
      } else {
        setError(data.message)
      }

    } catch (err) {
      setLoading(false)
      setError("Server error")
    }
  }

  const fillDemo = () => setForm({ email: 'ramani@navaigate.in', password: 'password123' })

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      <div className="relative z-10 w-full max-w-md px-4">

        <Link to="/" className="flex items-center justify-center gap-2.5 mb-8">
          <span className="text-white text-2xl font-bold">NavAIgate</span>
        </Link>

        <div className="glass rounded-3xl p-8 border text-white">

          <h1 className="text-xl mb-4 text-center">Sign In</h1>

          {error && (
            <div className="text-red-400 mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="w-full p-2 rounded bg-slate-800"
            />

            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
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
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <p className="text-sm mt-4 text-center">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400">Sign Up</Link>
          </p>

        </div>
      </div>
    </div>
  )
}