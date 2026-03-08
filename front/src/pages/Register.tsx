import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Wallet, Mail, Lock, User, UserPlus, ArrowLeft } from 'lucide-react';
import { apiConfig } from '../services/apiConfig';
import { toast } from 'sonner';
import { AuthResponse } from '../services/apiConfig';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const { setAuth } = useAuth()
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiConfig.post<AuthResponse>('/auth/register', { name, email, password }, { withCredentials: true });

      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      setAuth(response.data)
      navigate('/');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        'Não foi possível realizar o cadastro. Tente novamente.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Wallet className="w-8 h-8 text-emerald-600" />
          <span className="text-lg font-semibold text-foreground">Gestão Financeira</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Criar conta</CardTitle>
            <CardDescription>Registre-se para começar a organizar suas finanças.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Nome completo
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirmar senha
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isSubmitting}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                {isSubmitting ? 'Registrando...' : 'Registrar'}
              </Button>
            </form>

            <div className="mt-6 text-sm text-muted-foreground text-center">
              <span>Já tem uma conta?</span>{' '}
              <Link
                to="/login"
                className="inline-flex items-center gap-1 font-medium text-emerald-600 hover:text-emerald-700"
              >
                Voltar para o login
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

