import { useState } from 'react';
import { useAuth } from '../AuthContext';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.role);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-primary-container p-8 neo-border neo-shadow-md w-full max-w-md">
        <h1 className="font-headline-md text-headline-md font-bold mb-6">Connexion CRM</h1>
        {error && <div className="bg-error text-on-error p-3 neo-border mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block font-label-mono mb-2">Email</label>
            <input 
              type="email" 
              className="w-full bg-surface-container-lowest neo-border p-3 focus:outline-none focus:bg-tertiary-container" 
              value={email} onChange={e => setEmail(e.target.value)} required 
            />
          </div>
          <div>
            <label className="block font-label-mono mb-2">Mot de passe</label>
            <input 
              type="password" 
              className="w-full bg-surface-container-lowest neo-border p-3 focus:outline-none focus:bg-tertiary-container" 
              value={password} onChange={e => setPassword(e.target.value)} required 
            />
          </div>
          <button type="submit" className="w-full bg-on-background text-surface-container-lowest py-3 neo-border font-bold uppercase mt-4 hover:bg-primary transition-colors neo-btn neo-shadow-sm">
            Se connecter
          </button>
        </form>
        <p className="mt-4 font-label-mono text-sm text-center">
          Pas de compte ? <Link to="/register" className="underline font-bold">S'inscrire</Link>
        </p>
      </div>
    </div>
  );
}
