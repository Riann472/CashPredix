import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { User, Mail, DollarSign, Save } from 'lucide-react';
import { FinantialData, Transaction, UserProfile } from '../types';

const transactions: Transaction[] = [{
    id: '1',
    userId: 1,
    amount: 132,
    category: "sla",
    date: "23/02/2025",
    description: "Casa",
    type: "income",
  }, {
    id: '1',
    userId: 1,
    amount: 132,
    category: "sla",
    date: "23/02/2025",
    description: "Casa",
    type: "income"
  }]

const user: UserProfile = {
  id: 1,
  name: 'Riann',
  email: 'rianncarvalhomota472@gmail.com',
  transactions
};
  
const finantialData: FinantialData = {
  userId: 1,
  salary: 3000,
  extraIncome: 140,
  extraIncomeType: "weekly",
  balance: null
}
export default function Settings() {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    monthlySalary: finantialData.salary ? finantialData.salary.toString() : 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-muted-foreground">Gerencie suas informações pessoais e financeiras</p>
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
                value={formData.name}
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
                value={formData.email}
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
                value={formData.monthlySalary}
                onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
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

      {/* Current Info Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Informações</CardTitle>
          <CardDescription>Seus dados atuais</CardDescription>
        </CardHeader>
          <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium text-foreground">{user.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">E-mail</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Salário Mensal</p>
                <p className="font-medium text-foreground">{finantialData.salary ? formatCurrency(finantialData?.salary): "Não informado"}</p>
              </div>
            </div>
          </div>
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
