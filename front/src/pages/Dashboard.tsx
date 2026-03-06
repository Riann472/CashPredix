import { useMutation, useQuery } from '@tanstack/react-query';
import { apiConfig } from '../services/apiConfig';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Receipt, SquarePen } from 'lucide-react';
import { UserProfile, TransactionsSummary } from '../types/types';
import { getExpenditureAverage } from '../utils';
import { getMonthName, formatCurrency, formatDate } from '../utils'
import { useEffect, useState } from 'react';

const userId = 1

export default function Dashboard() {
  const { data: transactionsData } = useQuery<TransactionsSummary>({
    queryKey: ['transactionsSummary'],
    queryFn: () => apiConfig.get(`/transactions/summary/${userId}`).then(res => res.data),
  });
  const { data: user } = useQuery<UserProfile>({
    queryKey: ['userProfile'],
    queryFn: () => apiConfig.get(`/user/${userId}`).then(res => res.data),
  });
  const { income, expenses, transactions } = transactionsData || { income: 0, expenses: 0, transactions: [] }

  const [isEditingBalance, setIsEditingBalance] = useState(false);
  const [editableBalance, setEditableBalance] = useState<string>(
    String(user?.financialData?.balance ?? income - expenses)
  );

  const { mutate: updateBalance } = useMutation({
    mutationKey: ['updateBalance'],
    mutationFn: () =>
      apiConfig
        .patch(`/user/${userId}`, { financialData: { balance: +editableBalance } })
        .then(res => res.data),
  });

  useEffect(() => {
    if (user) {
      setEditableBalance(String(user.financialData?.balance ?? income - expenses));
    }
  }, [user, income, expenses]);

  const handleBalanceSave = () => {
    setIsEditingBalance(false);
    updateBalance()
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Olá, {user?.name}!</h2>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <Calendar className="w-4 h-4" />
          {getMonthName()}
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-linear-to-br from-emerald-500 to-emerald-700 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-emerald-50 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Receitas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(income)}</div>
            <p className="text-xs text-emerald-50 mt-1">
              Salário: {user?.financialData?.salary ? formatCurrency(user.financialData.salary) : "Não informado"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-red-500 to-red-700 text-white">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-50 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Despesas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(expenses)}</div>
            <p className="text-xs text-red-50 mt-1">
              Gastos do mês
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-linear-to-br from-blue-500 to-blue-700 text-white`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-white/90 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Saldo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 items-center text-2xl font-bold">
              {isEditingBalance ? (
                <>
                  <h2 className='text-2xl font-bold'>R$ </h2>
                  <input
                    type="number"
                    autoFocus
                    value={editableBalance}
                    onChange={(e) => setEditableBalance(e.target.value)}
                    onBlur={handleBalanceSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleBalanceSave();
                      if (e.key === 'Escape') setIsEditingBalance(false);
                    }}
                    className="bg-transparent border-none outline-none text-2xl font-bold text-white w-32"
                  />
                </>
              ) : (
                <>
                  {formatCurrency(+editableBalance)}
                  <SquarePen
                    className="w-4 h-4 mt-1 text-white/70 hover:text-white cursor-pointer"
                    onClick={() => setIsEditingBalance(true)}
                  />
                </>
              )}
            </div>
            <p className="text-xs text-white/90 mt-1">
              {+editableBalance >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
          <CardDescription>Últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-2 text-muted-foreground/50" />
              <p>Nenhuma transação registrada ainda</p>
              <p className="text-sm mt-1">
                Adicione suas despesas e receitas na aba Transações
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${transaction.type === 'income'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-5 h-5" />
                      ) : (
                        <TrendingDown className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.description || "Sem descrição"}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.category} • {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${transaction.type === 'income' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      {user?.transactions && user.transactions.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total de Transações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{user.transactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Receitas Extras</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {user.transactions.filter((t) => t.type === 'income').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Despesas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {user.transactions.filter((t) => t.type === 'expense').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Média de Gastos Diários</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(getExpenditureAverage(user, false))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Média de Gastos Mensais (Últimos 6 meses)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {formatCurrency(getExpenditureAverage(user, true))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}