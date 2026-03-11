import { Link } from 'react-router';
import { Card, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { User, Receipt, ChevronRight } from 'lucide-react';
import { settingsMenuItems, type SettingsMenuItem } from '../utils/settingsSections';

const iconMap = { User, Receipt };

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Configurações</h2>
        <p className="text-muted-foreground">
          Escolha o que deseja configurar.
        </p>
      </div>

      <ul className="space-y-3 list-none p-0 m-0">
        {settingsMenuItems.map((item) => (
          <SettingsListItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function SettingsListItem({ item }: { item: SettingsMenuItem }) {
  const IconComponent = iconMap[item.icon as keyof typeof iconMap] ?? User;

  return (
    <li>
      <Link to={item.path} className="block outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-ring">
        <Card className="transition-colors hover:bg-muted/50 cursor-pointer">
          <CardHeader className="py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="min-w-0">
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  {item.description && (
                    <CardDescription className="mt-0.5 truncate">
                      {item.description}
                    </CardDescription>
                  )}
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            </div>
          </CardHeader>
        </Card>
      </Link>
    </li>
  );
}
