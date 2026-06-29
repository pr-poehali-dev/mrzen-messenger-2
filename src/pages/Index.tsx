import { useState } from 'react';
import Icon from '@/components/ui/icon';

type NavId = 'home' | 'chats' | 'rooms' | 'search' | 'profile' | 'settings';

const NAV: { id: NavId; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'House' },
  { id: 'chats', label: 'Чаты', icon: 'MessageCircle' },
  { id: 'rooms', label: 'Комнаты', icon: 'Hash' },
  { id: 'search', label: 'Поиск', icon: 'Search' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

type Room = { name: string; topic: string; members: number; online: number; color: string; accent: string };

const INITIAL_ROOMS: Room[] = [
  { name: 'Дизайн и эстетика', topic: 'Минимализм, типографика, UI', members: 1240, online: 87, color: '150 30% 90%', accent: '158 40% 30%' },
  { name: 'Технологии', topic: 'Код, AI, продукты', members: 3180, online: 214, color: '210 35% 90%', accent: '215 45% 32%' },
  { name: 'Философия', topic: 'Мысли, дзен, осознанность', members: 642, online: 41, color: '40 45% 90%', accent: '36 55% 32%' },
  { name: 'Музыка', topic: 'Альбомы, плейлисты, концерты', members: 1890, online: 132, color: '280 30% 91%', accent: '280 35% 36%' },
];

const PALETTES = [
  { color: '150 30% 90%', accent: '158 40% 30%' },
  { color: '210 35% 90%', accent: '215 45% 32%' },
  { color: '40 45% 90%', accent: '36 55% 32%' },
  { color: '280 30% 91%', accent: '280 35% 36%' },
  { color: '0 50% 92%', accent: '0 55% 38%' },
  { color: '190 40% 90%', accent: '190 50% 30%' },
];

const CHATS = [
  { name: 'Анна Корн', last: 'Отправила макет, посмотри', time: '14:32', unread: 2, online: true },
  { name: 'Команда MrZen', last: 'Релиз завтра в 12:00', time: '13:05', unread: 0, online: true },
  { name: 'Дмитрий', last: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false },
  { name: 'Книжный клуб', last: 'Кто читал последнюю главу?', time: 'Вчера', unread: 5, online: false },
];

const MESSAGES = [
  { author: 'Мария', text: 'Кто-нибудь пробовал новый подход к сетке?', me: false, time: '14:20', role: '' },
  { author: 'Вы', text: 'Да, работает отлично на мобильных', me: true, time: '14:22', role: '' },
  { author: 'Олег', text: 'Закрепил гайд в описании комнаты', me: false, time: '14:25', role: 'Модератор' },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
        <span className="font-extrabold text-primary-foreground text-lg leading-none">Z</span>
      </div>
      <span className="text-xl font-extrabold tracking-tight">MrZen</span>
    </div>
  );
}

export default function Index() {
  const [active, setActive] = useState<NavId>('home');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', topic: '', palette: 0 });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileNav, setShowMobileNav] = useState(false);

  const openCreate = () => {
    setForm({ name: '', topic: '', palette: 0 });
    setShowCreate(true);
  };

  const createRoom = () => {
    const name = form.name.trim();
    if (!name) return;
    const p = PALETTES[form.palette];
    setRooms((prev) => [
      { name, topic: form.topic.trim() || 'Новая тема для обсуждения', members: 1, online: 1, color: p.color, accent: p.accent },
      ...prev,
    ]);
    setShowCreate(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <div className="mx-auto flex max-w-[1400px]">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card/40 px-4 py-6 md:flex">
          <div className="px-2"><Logo /></div>
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active === item.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon name={item.icon} size={19} />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto flex items-center gap-3 rounded-xl bg-secondary px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">Я</div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold">Ваш профиль</div>
              <div className="truncate text-xs text-muted-foreground">@you</div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="min-h-screen flex-1 px-5 py-6 pb-24 md:px-10 md:py-10 md:pb-10">
          {/* Mobile header */}
          <div className="mb-8 flex items-center justify-between md:hidden">
            <Logo />
            <button onClick={() => setShowMobileNav(true)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
              <Icon name="Menu" size={20} />
            </button>
          </div>

          {/* Hero */}
          <section className="animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              482 человека онлайн
            </div>
            <h1 className="mt-5 max-w-2xl text-balance text-4xl font-extrabold leading-[1.05] tracking-tight md:text-6xl">
              Открытые чаты и комнаты для спокойных бесед
            </h1>
            <p className="mt-4 max-w-lg text-balance text-base text-muted-foreground md:text-lg">
              MrZen — пространство, где темы важнее шума. Заходите в комнату, делитесь мыслями, модерируйте обсуждения.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button onClick={openCreate} className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
                Создать комнату
              </button>
              <button onClick={() => setShowSearch(true)} className="rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-secondary">
                Найти обсуждение
              </button>
            </div>
          </section>

          {/* Rooms */}
          <section className="mt-14">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Популярные комнаты</h2>
                <p className="mt-1 text-sm text-muted-foreground">Тематические пространства для общения</p>
              </div>
              <button onClick={openCreate} className="hidden text-sm font-semibold text-muted-foreground hover:text-foreground sm:block">Создать комнату →</button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {rooms.map((room, i) => (
                <article
                  key={room.name}
                  className="group animate-scale-in rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                  style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `hsl(${room.color})` }}
                    >
                      <Icon name="Hash" size={22} style={{ color: `hsl(${room.accent})` }} />
                    </div>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary">
                      <Icon name="EllipsisVertical" size={18} />
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{room.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{room.topic}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Icon name="Users" size={14} /> {room.members.toLocaleString('ru')}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {room.online} онлайн
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Two columns: chats + live room */}
          <section className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Chats */}
            <div className="rounded-2xl border border-border bg-card p-2">
              <div className="flex items-center justify-between px-4 py-3">
                <h2 className="text-lg font-bold tracking-tight">Ваши чаты</h2>
                <Icon name="MessageCircle" size={18} className="text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                {CHATS.map((chat) => (
                  <button key={chat.name} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-secondary">
                    <div className="relative shrink-0">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
                        {chat.name[0]}
                      </div>
                      {chat.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm font-semibold">{chat.name}</span>
                        <span className="shrink-0 text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-sm text-muted-foreground">{chat.last}</span>
                        {chat.unread > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                            {chat.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Live room preview */}
            <div className="flex flex-col rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent">
                    <Icon name="Hash" size={20} className="text-accent-foreground" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Дизайн и эстетика</div>
                    <div className="text-xs text-muted-foreground">87 онлайн</div>
                  </div>
                </div>
                <button className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent">
                  <Icon name="Shield" size={14} /> Модерация
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-5 py-5">
                {MESSAGES.map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.me ? 'items-end' : 'items-start'}`}>
                    <div className="mb-1 flex items-center gap-2 px-1">
                      <span className="text-xs font-semibold">{m.author}</span>
                      {m.role && (
                        <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{m.role}</span>
                      )}
                      <span className="text-[11px] text-muted-foreground">{m.time}</span>
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                        m.me ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary text-foreground'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2">
                  <input
                    placeholder="Написать в комнату…"
                    className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform hover:scale-105">
                    <Icon name="ArrowUp" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Moderation feature strip */}
          <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: 'Shield', title: 'Модерация', text: 'Закрепляйте, удаляйте и управляйте участниками' },
              { icon: 'EyeOff', title: 'Чистый контент', text: 'Фильтры и правила для спокойных обсуждений' },
              { icon: 'Sparkles', title: 'Фокус на теме', text: 'Минимум шума, максимум смысла' },
            ].map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-in rounded-2xl border border-border bg-card p-5"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                  <Icon name={f.icon} size={20} />
                </div>
                <h3 className="mt-3 text-base font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </section>

          <footer className="mt-16 border-t border-border pt-6 text-center text-sm text-muted-foreground">
            MrZen — пространство для осознанного общения
          </footer>
        </main>
      </div>

      {/* Mobile nav drawer */}
      {showMobileNav && (
        <div
          className="fixed inset-0 z-[60] flex md:hidden"
          onClick={() => setShowMobileNav(false)}
        >
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <div
            className="animate-slide-in-right relative ml-auto flex h-full w-72 flex-col bg-card px-4 py-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideInRight 0.25s ease-out' }}
          >
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button
                onClick={() => setShowMobileNav(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); setShowMobileNav(false); }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active === item.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon name={item.icon} size={20} />
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto flex items-center gap-3 rounded-xl bg-secondary px-3 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">Я</div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">Ваш профиль</div>
                <div className="truncate text-xs text-muted-foreground">@you</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search modal */}
      {showSearch && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-foreground/30 p-4 pt-16 backdrop-blur-sm"
          onClick={() => { setShowSearch(false); setSearchQuery(''); }}
        >
          <div
            className="animate-scale-in w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Icon name="Search" size={18} className="shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && (setShowSearch(false), setSearchQuery(''))}
                placeholder="Поиск комнат и обсуждений…"
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-muted-foreground transition-colors hover:text-foreground">
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {(() => {
                const q = searchQuery.toLowerCase();
                const filtered = rooms.filter(
                  (r) => r.name.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q)
                );
                if (!searchQuery) return (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Начните вводить название или тему комнаты
                  </div>
                );
                if (!filtered.length) return (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Ничего не найдено по запросу «{searchQuery}»
                  </div>
                );
                return filtered.map((room) => (
                  <button
                    key={room.name}
                    onClick={() => { setShowSearch(false); setSearchQuery(''); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `hsl(${room.color})` }}
                    >
                      <Icon name="Hash" size={18} style={{ color: `hsl(${room.accent})` }} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{room.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{room.topic}</div>
                    </div>
                    <div className="ml-auto shrink-0 text-right">
                      <div className="text-xs font-medium">{room.members.toLocaleString('ru')}</div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />{room.online}
                      </div>
                    </div>
                  </button>
                ));
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Create room modal */}
      {showCreate && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/30 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="animate-scale-in w-full max-w-md rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Новая комната</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary"
              >
                <Icon name="X" size={20} />
              </button>
            </div>

            <label className="mt-5 block text-sm font-semibold">Название</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && createRoom()}
              placeholder="Например, Путешествия"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
            />

            <label className="mt-4 block text-sm font-semibold">Тема обсуждения</label>
            <input
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && createRoom()}
              placeholder="О чём комната?"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-foreground/40 placeholder:text-muted-foreground"
            />

            <label className="mt-4 block text-sm font-semibold">Цвет</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {PALETTES.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setForm({ ...form, palette: i })}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                    form.palette === i ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : ''
                  }`}
                  style={{ backgroundColor: `hsl(${p.color})` }}
                >
                  <Icon name="Hash" size={16} style={{ color: `hsl(${p.accent})` }} />
                </button>
              ))}
            </div>

            <div className="mt-7 flex gap-3">
              <button
                onClick={() => setShowCreate(false)}
                className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary"
              >
                Отмена
              </button>
              <button
                onClick={createRoom}
                disabled={!form.name.trim()}
                className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
              >
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-border bg-card/95 backdrop-blur md:hidden">
        {NAV.slice(0, 5).map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors ${
              active === item.id ? 'text-foreground' : 'text-muted-foreground'
            }`}
          >
            <Icon name={item.icon} size={20} />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}