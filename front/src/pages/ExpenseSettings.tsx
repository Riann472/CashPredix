import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Receipt, Save, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiConfig } from '../services/apiConfig';
import useAuth from '../hooks/useAuth';
import { toast } from 'sonner';

export default function ExpenseSettings() {
  const { auth } = useAuth();

  const [monthlyBudgetLimit, setMonthlyBudgetLimit] = useState('');
  const [defaultCurrency, setDefaultCurrency] = useState('BRL');

  const { mutate: updateExpenseSettings, isPending } = useMutation({
    mutationKey: ['expenseSettings'],
    mutationFn: (data: { monthlyBudgetLimit?: number; defaultCurrency: string }) =>
      apiConfig.patch(`/user/${auth?.sub}/settings/expenses`, data).then((res) => res.data),
    onSuccess: () => toast.success('Configurações de despesas salvas.'),
    onError: () => toast.error('Erro ao salvar. Tente novamente.'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateExpenseSettings({
      monthlyBudgetLimit: monthlyBudgetLimit ? parseFloat(monthlyBudgetLimit) : undefined,
      defaultCurrency,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/settings" aria-label="Voltar">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Configuração de despesas</h2>
          <p className="text-muted-foreground">
            Categorias padrão e limites de gastos.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            Preferências de despesas
          </CardTitle>
          <CardDescription>
            Defina limites e moeda para seus gastos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="monthlyBudgetLimit">Limite de gastos mensal (opcional)</Label>
              <Input
                id="monthlyBudgetLimit"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={monthlyBudgetLimit}
                onChange={(e) => setMonthlyBudgetLimit(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Alerta quando seus gastos se aproximarem deste valor.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCurrency">Moeda</Label>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger id="defaultCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="USD">Dólar (US$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={isPending}>
              <Save className="w-4 h-4 mr-2" />
              {isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
