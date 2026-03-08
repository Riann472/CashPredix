import { Transaction } from "./types/types";

export function getMonthName() {
    const now = new Date();
    return now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
}

export function getMonthDayQtd(date: Date = new Date()): number {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
}

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
};

export function getExpenditureAverage(transactions: Transaction[], monthly: boolean = false): number {
    if (!transactions || transactions.length === 0) return 0;

    const expenses = transactions.filter(t => t.type === 'expense');

    const now = new Date();
    if (!monthly) {
        const dayQtd = now.getDate();
        const monthExpenses = expenses.filter(e => {
            const d = new Date(e.date);
            console.log(d.getFullYear())
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })
        console.log(monthExpenses)
        console.log(dayQtd)
        return monthExpenses.reduce((sum, e) => sum + e.amount, 0) / dayQtd;
    }

    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // se não tem despesas
    if (expenses.length === 0) return 0;

    // descobrir primeira despesa
    const firstExpenseDate = expenses.reduce((oldest, e) => {
        const d = new Date(e.date);
        return d < oldest ? d : oldest;
    }, new Date());

    let startYear = firstExpenseDate.getFullYear();
    let startMonth = firstExpenseDate.getMonth();

    // último mês fechado
    let endYear = currentYear;
    let endMonth = currentMonth - 1;

    if (endMonth < 0) {
        endMonth = 11;
        endYear--;
    }

    // mapa com total por mês
    const monthlyTotals = new Map<string, number>();

    expenses.forEach(e => {
        const date = new Date(e.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        monthlyTotals.set(key, (monthlyTotals.get(key) || 0) + e.amount);
    });

    let totalExpenses = 0;
    let totalMonths = 0;

    let year = startYear;
    let month = startMonth;

    while (
        year < endYear ||
        (year === endYear && month <= endMonth)
    ) {
        const key = `${year}-${month}`;
        totalExpenses += monthlyTotals.get(key) || 0;
        totalMonths++;

        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
    }

    if (totalMonths === 0) return 0;

    return totalExpenses / totalMonths;
}
