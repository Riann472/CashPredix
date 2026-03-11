export interface SettingsMenuItem {
  id: string;
  title: string;
  description?: string;
  path: string;
  icon: string;
}

export const settingsMenuItems: SettingsMenuItem[] = [
  {
    id: 'user',
    title: 'Configurações do usuário',
    description: 'Dados pessoais e informações de conta.',
    path: '/settings/user',
    icon: 'User',
  },
  {
    id: 'expenses',
    title: 'Configuração de despesas',
    description: 'Categorias padrão e limites de gastos.',
    path: '/settings/expenses',
    icon: 'Receipt',
  },
];
