import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Plus, TrendingUp, TrendingDown, Trash2, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Transaction } from '../types/types';
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from '../services/apiConfig';
import { formatCurrency, formatDate } from '../utils/utils';
import LoadingDots from '../components/ui/loading-dots';
import { toast } from 'sonner';

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

export default function Transactions() {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(0);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    amount: '',
    date: new Date().toISOString(),
  });

  const queryClient = useQueryClient();
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () => apiConfig.get(`/transactions`).then(res => res.data),
  });
  const { mutate: addTransaction, isPending: isAddingTransaction } = useMutation({
    mutationKey: ['addTransaction'],
    mutationFn: () =>
      apiConfig.post<Transaction>('/transactions', { ...formData, amount: parseFloat(formData.amount) }).then(res => {
        setIsOpen(false);
        setFormData({
          type: 'expense',
          category: '',
          description: '',
          amount: '',
          date: new Date().toISOString(),
        });
        transactions.unshift(res.data);
        return res.data
      }),
  });


  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    addTransaction();
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
                <Label htmlFor="type">Tipo *</Label>
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
                <Label htmlFor="category">Categoria *</Label>
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
                <Label htmlFor="description">Descrição *</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ex: Almoço no restaurante"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Valor (R$) *</Label>
                <Input
                  id="amount"
                  type="text"
                  inputMode="decimal"
                  value={formData.amount}
                  placeholder="0,00"
                  onChange={(e) => {
                    let value = e.target.value;

                    // remove tudo que não é número ou vírgula
                    value = value.replace(/[^0-9,]/g, "");

                    // impede mais de uma vírgula
                    const parts = value.split(",");
                    if (parts.length > 2) {
                      value = parts[0] + "," + parts[1];
                    }

                    // limita 2 casas decimais
                    if (parts[1]?.length > 2) {
                      value = parts[0] + "," + parts[1].slice(0, 2);
                    }

                    setFormData({
                      ...formData,
                      amount: value
                    });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
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
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1 cursor-pointer">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 cursor-pointer">
                  {isAddingTransaction ? <LoadingDots /> : 'Adicionar'}
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
                      size="icon"
                      className={`text-red-600 bg-transparent hover:bg-transparent hover:text-red-700 ${deleteItemId === transaction.id && 'bg-red-900 hover:bg-red-900'}`}
                      onClick={() => {
                        if (deleteItemId !== transaction.id) {
                          setDeleteItemId(transaction.id);
                          return
                        }
                        apiConfig.delete(`/transactions/${transaction.id}`).then(() => {
                          queryClient.setQueryData<Transaction[]>(['transactions'], (old: Transaction[] | undefined) =>
                            old?.filter(t => t.id !== transaction.id) || []
                          );

                          toast.success('Transação excluída com sucesso');
                        }).catch(() => {
                          toast.error('Erro ao excluir transação');
                        });
                        setDeleteItemId(0);
                      }}
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
