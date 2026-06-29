import { useState } from 'react';
import Icon from '@/components/ui/icon';

type Mode = 'login' | 'register';

interface Props {
  onAuth: (user: { name: string; username: string }) => void;
}

export default function Auth({ onAuth }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    setError('');
    if (mode === 'login') {
      if (!email.trim() || !password.trim()) { setError('Заполните все поля'); return; }
      onAuth({ name: email.split('@')[0], username: '@' + email.split('@')[0] });
    } else {
      if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) { setError('Заполните все поля'); return; }
      if (password.length < 6) { setError('Пароль минимум 6 символов'); return; }
      onAuth({ name: name.trim(), username: '@' + username.trim().replace('@', '') });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-accent opacity-40 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-secondary opacity-60 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <span className="text-2xl font-extrabold text-primary-foreground leading-none">Z</span>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-extrabold tracking-tight">MrZen</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте аккаунт'}
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-black/5">
          {/* Mode toggle */}
          <div className="mb-6 flex rounded-xl bg-secondary p-1">
            {(['login', 'register'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); }}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${mode === m ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m === 'login' ? 'Вход' : 'Регистрация'}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {mode === 'register' && (
              <>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Имя</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Как вас зовут?"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Никнейм</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value.replace('@', ''))}
                      placeholder="username"
                      className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submit()}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">Пароль</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                  className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-11 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon name={showPass ? 'EyeOff' : 'Eye'} size={17} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                <Icon name="CircleAlert" size={15} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={submit}
              className="mt-1 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {mode === 'login' ? 'Войти' : 'Создать аккаунт'}
            </button>

            {mode === 'login' && (
              <button className="text-center text-xs text-muted-foreground hover:text-foreground transition-colors">
                Забыли пароль?
              </button>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          {mode === 'login' ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
            className="font-semibold text-foreground hover:underline"
          >
            {mode === 'login' ? 'Зарегистрируйтесь' : 'Войдите'}
          </button>
        </p>
      </div>
    </div>
  );
}
