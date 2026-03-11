import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, DollarSign, Save } from 'lucide-react';
import { UserProfile } from '../types/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiConfig } from '../services/apiConfig';
import { useNavigate, Link } from 'react-router';
import useAuth from '../hooks/useAuth';
import { ArrowLeft } from 'lucide-react';

export default function UserSettings() {
  const {auth} = useAuth()

  const navigate = useNavigate();
  const { data: user } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => apiConfig.get(`/user/${auth?.sub}`).then(res => res.data),
  });
  const { mutate: updateUser } = useMutation<UserProfile, Error, Partial<UserProfile>>({
    mutationKey: ['updateUser'],
    mutationFn: (data) => apiConfig.patch(`/user/${auth?.sub}`, data).then(res => res.data),
  });

  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    updateUser(formData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings" aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Configurações do usuário</h2>
            <p className="text-muted-foreground">Gerencie suas informações pessoais e financeiras</p>
          </div>
        </div>
        <Button
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
          onClick={handleLogout}
        >
          Sair
        </Button>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Atualize seus dados cadastrais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Nome Completo
              </Label>
              <Input
                id="name"
                defaultValue={user?.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Seu nome completo"
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
                defaultValue={user?.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Salário Mensal
              </Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                min="0"
                defaultValue={user?.financialData?.salary}
                onChange={(e) => {
                  setFormData({ ...formData, financialData: { ...formData.financialData, salary: parseFloat(e.target.value) || 0 } })
                }}
                placeholder="0.00"
              />
              <p className="text-sm text-muted-foreground">
                Este valor será usado como base para calcular seu saldo mensal
              </p>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-accent border border-border">
        <CardContent className="pt-6">
          <p className="text-sm text-accent-foreground">
            💡 <strong>Dica:</strong> Mantenha seu salário mensal atualizado para ter uma visão precisa do seu saldo e planejamento financeiro.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
