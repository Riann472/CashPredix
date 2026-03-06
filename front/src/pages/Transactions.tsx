import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, TrendingUp, TrendingDown, Trash2, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Transaction } from '../types/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiConfig } from '../services/apiConfig';
import { formatCurrency, formatDate } from '../utils';

const incomeCategories = [
  'Freelance',
  'Bônus',
  'Investimentos',
  'Vendas',
  'Presente',
  'Outros',
];

const expenseCategories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Contas',
  'Outros',
];

const userId = 1

export default function Transactions() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => apiConfig.get(`/transactions/${userId}`).then(res => res.data),
  });
  const { mutate: addTransaction } = useMutation({
    mutationKey: ['addTransaction'],
    mutationFn: (data: Omit<Transaction, 'id'>) =>
      apiConfig.post('/transactions', { ...data, userId }).then(res => res.data),
  });

  const [formData, setFormData] = useState({
    userId,
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(formData);
  };

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transações</h2>
          <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Transação</DialogTitle>
              <DialogDescription>
                Registre uma nova receita ou despesa
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: 'income' | 'expense') =>
                    setFormData({ ...formData, type: value, category: '' })
                  }
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Receita</SelectItem>
                    <SelectItem value="expense">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Almoço no restaurante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date ? formData.date.split('T')[0] : ''}
                  onChange={(e) => {
                    const isoString = new Date(e.target.value + 'T00:00:00').toISOString();

                    setFormData({
                      ...formData,
                      date: isoString,
                    });
                  }}
                />              </div>

              <div className="flex gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  Adicionar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm">Filtrar por tipo</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              Todas
            </Button>
            <Button
              variant={filterType === 'income' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('income')}
              className={filterType === 'income' ? 'bg-emerald-600 hover:bg-emerald-700' : ''}
            >
              Receitas
            </Button>
            <Button
              variant={filterType === 'expense' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('expense')}
              className={filterType === 'expense' ? 'bg-red-600 hover:bg-red-700' : ''}
            >
              Despesas
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
          <CardDescription>
            {transactions?.length} {transactions?.length === 1 ? 'transação' : 'transações'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactions?.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Plus className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
              <p>Nenhuma transação encontrada</p>
              <p className="text-sm mt-1 text-muted-foreground">Adicione sua primeira transação</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions?.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-muted rounded-lg hover:bg-muted/70 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center hrink-0 ${transaction.type === 'income'
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-6 h-6" />
                      ) : (
                        <TrendingDown className="w-6 h-6" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground">{transaction.description || "Sem descrição"}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div
                        className={`font-bold text-lg ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                          }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
