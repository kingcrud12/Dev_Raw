import { useState } from 'react';
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { email, password });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="bg-secondary-container p-8 neo-border neo-shadow-md w-full max-w-md">
        <h1 className="font-headline-md text-headline-md font-bold mb-6">Créer un compte</h1>
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
              value={password} onChange={e => setPassword(e.target.value)} required minLength={6}
            />
          </div>
          <button type="submit" className="w-full bg-on-background text-surface-container-lowest py-3 neo-border font-bold uppercase mt-4 hover:bg-primary transition-colors neo-btn neo-shadow-sm">
            S'inscrire
          </button>
        </form>
        <p className="mt-4 font-label-mono text-sm text-center">
          Déjà un compte ? <Link to="/login" className="underline font-bold">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
