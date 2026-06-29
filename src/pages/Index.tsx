import { useState, useRef, useEffect } from 'react';
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
type ChatItem = { name: string; last: string; time: string; unread: number; online: boolean };
type Message = { author: string; text: string; me: boolean; time: string; role: string; pinned?: boolean };

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

const INITIAL_CHATS: ChatItem[] = [
  { name: 'Анна Корн', last: 'Отправила макет, посмотри', time: '14:32', unread: 2, online: true },
  { name: 'Команда MrZen', last: 'Релиз завтра в 12:00', time: '13:05', unread: 0, online: true },
  { name: 'Дмитрий', last: 'Спасибо за помощь!', time: 'Вчера', unread: 0, online: false },
  { name: 'Книжный клуб', last: 'Кто читал последнюю главу?', time: 'Вчера', unread: 5, online: false },
];

const ROOM_MESSAGES: Record<string, Message[]> = {
  'Дизайн и эстетика': [
    { author: 'Мария', text: 'Кто-нибудь пробовал новый подход к сетке?', me: false, time: '14:20', role: '' },
    { author: 'Вы', text: 'Да, работает отлично на мобильных', me: true, time: '14:22', role: '' },
    { author: 'Олег', text: 'Закрепил гайд в описании комнаты', me: false, time: '14:25', role: 'Модератор', pinned: true },
    { author: 'Света', text: 'Поделитесь ссылкой на гайд?', me: false, time: '14:27', role: '' },
    { author: 'Вы', text: 'Посмотрите закреплённое сообщение выше', me: true, time: '14:28', role: '' },
  ],
  'Технологии': [
    { author: 'Артём', text: 'Что думаете о новом релизе React 19?', me: false, time: '13:10', role: '' },
    { author: 'Вы', text: 'Компилятор — это мощно', me: true, time: '13:12', role: '' },
    { author: 'Дима', text: 'Уже переходим на него в проде', me: false, time: '13:15', role: 'Модератор' },
  ],
  'Философия': [
    { author: 'Ира', text: 'Осознанность — это навык или состояние?', me: false, time: '12:00', role: '' },
    { author: 'Вы', text: 'Думаю, и то и другое одновременно', me: true, time: '12:05', role: '' },
  ],
  'Музыка': [
    { author: 'Коля', text: 'Слушали новый альбом Radiohead?', me: false, time: '11:30', role: '' },
    { author: 'Вы', text: 'Ещё нет, но уже в очереди!', me: true, time: '11:32', role: '' },
    { author: 'Лена', text: 'Обязательно послушайте, это шедевр', me: false, time: '11:35', role: '' },
  ],
};

const CHAT_MESSAGES: Record<string, Message[]> = {
  'Анна Корн': [
    { author: 'Анна Корн', text: 'Привет! Как дела с проектом?', me: false, time: '14:10', role: '' },
    { author: 'Вы', text: 'Всё идёт по плану', me: true, time: '14:12', role: '' },
    { author: 'Анна Корн', text: 'Отправила макет, посмотри', me: false, time: '14:32', role: '' },
  ],
  'Команда MrZen': [
    { author: 'Саша', text: 'Всем привет! Готовимся к релизу', me: false, time: '13:00', role: '' },
    { author: 'Вы', text: 'Готов, тестирование завершено', me: true, time: '13:02', role: '' },
    { author: 'Саша', text: 'Релиз завтра в 12:00', me: false, time: '13:05', role: '' },
  ],
  'Дмитрий': [
    { author: 'Дмитрий', text: 'Можешь помочь с задачей?', me: false, time: 'Вчера', role: '' },
    { author: 'Вы', text: 'Конечно, что нужно?', me: true, time: 'Вчера', role: '' },
    { author: 'Дмитрий', text: 'Спасибо за помощь!', me: false, time: 'Вчера', role: '' },
  ],
  'Книжный клуб': [
    { author: 'Таня', text: 'Всем привет! Читаем «Мастер и Маргарита»', me: false, time: 'Вчера', role: '' },
    { author: 'Вы', text: 'Дочитал до середины', me: true, time: 'Вчера', role: '' },
    { author: 'Таня', text: 'Кто читал последнюю главу?', me: false, time: 'Вчера', role: '' },
  ],
};

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

function RoomScreen({ room, onBack }: { room: Room; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(
    ROOM_MESSAGES[room.name] || []
  );
  const [input, setInput] = useState('');
  const [showMod, setShowMod] = useState(false);
  const [modTab, setModTab] = useState<'messages' | 'members' | 'settings'>('messages');
  const [pinnedMsg, setPinnedMsg] = useState<Message | null>(
    (ROOM_MESSAGES[room.name] || []).find((m) => m.pinned) || null
  );
  const [members, setMembers] = useState([
    { name: 'Мария', role: '', muted: false, online: true },
    { name: 'Олег', role: 'Модератор', muted: false, online: true },
    { name: 'Света', role: '', muted: false, online: false },
    { name: 'Артём', role: '', muted: true, online: false },
  ]);
  const [slowMode, setSlowMode] = useState(false);
  const [closeRoom, setCloseRoom] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages((prev) => [...prev, { author: 'Вы', text, me: true, time, role: '' }]);
    setInput('');
  };

  const pinMessage = (msg: Message) => setPinnedMsg(msg);
  const deleteMessage = (idx: number) => setMessages((prev) => prev.filter((_, i) => i !== idx));
  const toggleMute = (i: number) => setMembers((prev) => prev.map((m, idx) => idx === i ? { ...m, muted: !m.muted } : m));
  const promoteToMod = (i: number) => setMembers((prev) => prev.map((m, idx) => idx === i ? { ...m, role: m.role ? '' : 'Модератор' } : m));
  const kickMember = (i: number) => setMembers((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div className="flex h-screen flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${room.color})` }}>
          <Icon name="Hash" size={20} style={{ color: `hsl(${room.accent})` }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate">{room.name}</div>
          <div className="text-xs text-muted-foreground">{room.topic} · {room.online} онлайн</div>
        </div>
        <button
          onClick={() => setShowMod(true)}
          className="flex items-center gap-1.5 rounded-xl bg-secondary px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent"
        >
          <Icon name="Shield" size={14} /> Модерация
        </button>
      </div>

      {/* Moderation modal */}
      {showMod && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/30 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setShowMod(false)}>
          <div className="animate-scale-in w-full max-w-lg rounded-t-3xl border border-border bg-card sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={18} />
                <span className="font-bold">Модерация — {room.name}</span>
              </div>
              <button onClick={() => setShowMod(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary">
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-5">
              {([['messages', 'Сообщения', 'MessageSquare'], ['members', 'Участники', 'Users'], ['settings', 'Настройки', 'Settings2']] as const).map(([id, label, icon]) => (
                <button
                  key={id}
                  onClick={() => setModTab(id)}
                  className={`flex items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-semibold transition-colors ${modTab === id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                >
                  <Icon name={icon} size={13} /> {label}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {/* Tab: Messages */}
              {modTab === 'messages' && (
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground mb-1">Наведите на действие или выберите сообщение</p>
                  {messages.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">Сообщений нет</p>}
                  {messages.map((m, i) => (
                    <div key={i} className="group flex items-start gap-3 rounded-xl border border-border p-3 hover:bg-secondary transition-colors">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{m.author[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-semibold">{m.author}</span>
                          <span className="text-[10px] text-muted-foreground">{m.time}</span>
                          {m.role && <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">{m.role}</span>}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{m.text}</p>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => pinMessage(m)} title="Закрепить" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                          <Icon name="Pin" size={13} />
                        </button>
                        <button onClick={() => deleteMessage(i)} title="Удалить" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <Icon name="Trash2" size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {messages.length > 0 && (
                    <button onClick={() => setMessages([])} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors">
                      <Icon name="Trash2" size={15} /> Очистить все сообщения
                    </button>
                  )}
                </div>
              )}

              {/* Tab: Members */}
              {modTab === 'members' && (
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-xs text-muted-foreground mb-1">{members.length} участников</p>
                  {members.map((m, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-xl border border-border p-3">
                      <div className="relative shrink-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold">{m.name[0]}</div>
                        {m.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold truncate">{m.name}</span>
                          {m.role && <span className="rounded bg-accent px-1.5 py-0.5 text-[9px] font-bold text-accent-foreground">{m.role}</span>}
                          {m.muted && <span className="rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold text-muted-foreground">Заглушен</span>}
                        </div>
                        <div className="text-xs text-muted-foreground">{m.online ? 'онлайн' : 'не в сети'}</div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button onClick={() => promoteToMod(i)} title={m.role ? 'Снять модератора' : 'Назначить модератором'} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                          <Icon name="ShieldCheck" size={13} />
                        </button>
                        <button onClick={() => toggleMute(i)} title={m.muted ? 'Включить звук' : 'Заглушить'} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                          <Icon name={m.muted ? 'MicOff' : 'Mic'} size={13} />
                        </button>
                        <button onClick={() => kickMember(i)} title="Исключить" className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                          <Icon name="UserX" size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Settings */}
              {modTab === 'settings' && (
                <div className="p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <div className="text-sm font-semibold">Медленный режим</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Сообщение раз в 30 секунд</div>
                    </div>
                    <button onClick={() => setSlowMode(!slowMode)} className={`relative h-6 w-11 rounded-full transition-colors ${slowMode ? 'bg-primary' : 'bg-muted'}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${slowMode ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div>
                      <div className="text-sm font-semibold">Закрыть комнату</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Только участники смогут читать</div>
                    </div>
                    <button onClick={() => setCloseRoom(!closeRoom)} className={`relative h-6 w-11 rounded-full transition-colors ${closeRoom ? 'bg-primary' : 'bg-muted'}`}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${closeRoom ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/30 py-3 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors">
                    <Icon name="Trash2" size={15} /> Удалить комнату
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pinned */}
      {pinnedMsg && (
        <div className="flex items-center gap-2 border-b border-border bg-accent/50 px-4 py-2">
          <Icon name="Pin" size={13} className="text-accent-foreground shrink-0" />
          <span className="text-xs text-accent-foreground truncate"><span className="font-semibold">{pinnedMsg.author}:</span> {pinnedMsg.text}</span>
          <button onClick={() => setPinnedMsg(null)} className="ml-auto shrink-0 text-muted-foreground hover:text-foreground"><Icon name="X" size={13} /></button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm gap-2">
            <Icon name="MessageCircle" size={36} className="opacity-20" />
            Нет сообщений. Начните обсуждение!
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`group flex flex-col ${m.me ? 'items-end' : 'items-start'}`}>
            <div className="mb-1 flex items-center gap-2 px-1">
              {!m.me && <span className="text-xs font-semibold">{m.author}</span>}
              {m.role && <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{m.role}</span>}
              <span className="text-[11px] text-muted-foreground">{m.time}</span>
              {showMod && (
                <button onClick={() => deleteMessage(i)} className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/70">
                  <Icon name="X" size={13} />
                </button>
              )}
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary text-foreground'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/80 p-3 pb-safe backdrop-blur">
        <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`Написать в #${room.name}…`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={send} disabled={!input.trim()} className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100">
            <Icon name="ArrowUp" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ChatScreen({ chat, onBack }: { chat: ChatItem; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>(CHAT_MESSAGES[chat.name] || []);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMessages((prev) => [...prev, { author: 'Вы', text, me: true, time, role: '' }]);
    setInput('');
  };

  return (
    <div className="flex h-screen flex-col bg-background animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border bg-card/80 px-4 py-3 backdrop-blur">
        <button onClick={onBack} className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary">
          <Icon name="ArrowLeft" size={20} />
        </button>
        <div className="relative shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold">
            {chat.name[0]}
          </div>
          {chat.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate">{chat.name}</div>
          <div className="text-xs text-muted-foreground">{chat.online ? 'онлайн' : 'не в сети'}</div>
        </div>
        <button className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary">
          <Icon name="Phone" size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.me ? 'items-end' : 'items-start'}`}>
            <div className="mb-1 px-1">
              <span className="text-[11px] text-muted-foreground">{m.time}</span>
            </div>
            <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary text-foreground'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/80 p-3 backdrop-blur">
        <div className="flex items-center gap-2 rounded-xl bg-secondary px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            placeholder={`Написать ${chat.name}…`}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <button onClick={send} disabled={!input.trim()} className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100">
            <Icon name="ArrowUp" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Section: Chats list ─────────────────────────────────────────────────────
function ChatsSection({ onOpenChat }: { onOpenChat: (c: ChatItem) => void }) {
  const [search, setSearch] = useState('');
  const filtered = INITIAL_CHATS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Чаты</h2>
          <p className="text-sm text-muted-foreground mt-1">Личные и групповые переписки</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform">
          <Icon name="Plus" size={15} className="inline mr-1.5" />Новый чат
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 mb-4">
        <Icon name="Search" size={16} className="text-muted-foreground shrink-0" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти чат…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-10">Ничего не найдено</p>}
        {filtered.map((chat, i) => (
          <button key={chat.name} onClick={() => onOpenChat(chat)} className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary ${i !== 0 ? 'border-t border-border' : ''}`}>
            <div className="relative shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-base font-semibold">{chat.name[0]}</div>
              {chat.online && <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-green-500" />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">{chat.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-0.5">
                <span className="truncate text-sm text-muted-foreground">{chat.last}</span>
                {chat.unread > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">{chat.unread}</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Section: Rooms list ─────────────────────────────────────────────────────
function RoomsSection({ rooms, onOpenRoom, onCreateRoom }: { rooms: Room[]; onOpenRoom: (r: Room) => void; onCreateRoom: () => void }) {
  const [search, setSearch] = useState('');
  const filtered = rooms.filter((r) => r.name.toLowerCase().includes(search.toLowerCase()) || r.topic.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Комнаты</h2>
          <p className="text-sm text-muted-foreground mt-1">{rooms.length} тематических пространств</p>
        </div>
        <button onClick={onCreateRoom} className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform">
          <Icon name="Plus" size={15} className="inline mr-1.5" />Создать
        </button>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2.5 mb-5">
        <Icon name="Search" size={16} className="text-muted-foreground shrink-0" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Найти комнату…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {filtered.map((room, i) => (
          <article key={room.name} onClick={() => onOpenRoom(room)} className="cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${room.color})` }}>
                <Icon name="Hash" size={22} style={{ color: `hsl(${room.accent})` }} />
              </div>
              <span className="flex items-center gap-1 text-xs text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />{room.online}</span>
            </div>
            <h3 className="mt-4 text-base font-bold tracking-tight">{room.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{room.topic}</p>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Icon name="Users" size={13} />{room.members.toLocaleString('ru')}</span>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="col-span-2 text-center text-sm text-muted-foreground py-10">Ничего не найдено</p>}
      </div>
    </div>
  );
}

// ── Section: Search ─────────────────────────────────────────────────────────
function SearchSection({ rooms, onOpenRoom, onOpenChat }: { rooms: Room[]; onOpenRoom: (r: Room) => void; onOpenChat: (c: ChatItem) => void }) {
  const [q, setQ] = useState('');
  const lq = q.toLowerCase();
  const filteredRooms = q ? rooms.filter((r) => r.name.toLowerCase().includes(lq) || r.topic.toLowerCase().includes(lq)) : [];
  const filteredChats = q ? INITIAL_CHATS.filter((c) => c.name.toLowerCase().includes(lq)) : [];
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight mb-2">Поиск</h2>
      <p className="text-sm text-muted-foreground mb-6">Комнаты, чаты и обсуждения</p>
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 mb-6 focus-within:border-foreground/30 transition-colors">
        <Icon name="Search" size={18} className="text-muted-foreground shrink-0" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Введите запрос…" className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        {q && <button onClick={() => setQ('')} className="text-muted-foreground hover:text-foreground"><Icon name="X" size={15} /></button>}
      </div>
      {!q && (
        <div className="flex flex-col items-center gap-3 py-16 text-muted-foreground">
          <Icon name="Search" size={40} className="opacity-15" />
          <span className="text-sm">Начните вводить для поиска</span>
        </div>
      )}
      {q && filteredRooms.length === 0 && filteredChats.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-10">Ничего не найдено по запросу «{q}»</p>
      )}
      {filteredRooms.length > 0 && (
        <div className="mb-6">
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Комнаты</p>
          <div className="flex flex-col gap-2">
            {filteredRooms.map((room) => (
              <button key={room.name} onClick={() => onOpenRoom(room)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:bg-secondary transition-colors">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${room.color})` }}>
                  <Icon name="Hash" size={18} style={{ color: `hsl(${room.accent})` }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{room.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{room.topic}</div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{room.members.toLocaleString('ru')}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {filteredChats.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Чаты</p>
          <div className="flex flex-col gap-2">
            {filteredChats.map((chat) => (
              <button key={chat.name} onClick={() => onOpenChat(chat)} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 text-left hover:bg-secondary transition-colors">
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-semibold">{chat.name[0]}</div>
                  {chat.online && <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold truncate">{chat.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{chat.last}</div>
                </div>
                <span className={`text-xs shrink-0 ${chat.online ? 'text-green-600' : 'text-muted-foreground'}`}>{chat.online ? 'онлайн' : 'офлайн'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Section: Profile ─────────────────────────────────────────────────────────
function ProfileSection() {
  const [name, setName] = useState('Ваше имя');
  const [username, setUsername] = useState('@you');
  const [bio, setBio] = useState('Люблю осознанные беседы и минимализм');
  const [editing, setEditing] = useState(false);
  return (
    <div className="animate-fade-in max-w-lg">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Профиль</h2>
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary text-2xl font-extrabold text-primary-foreground">{name[0]}</div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-semibold outline-none mb-1.5" />
                <input value={username} onChange={(e) => setUsername(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground outline-none" />
              </>
            ) : (
              <>
                <div className="text-xl font-bold truncate">{name}</div>
                <div className="text-sm text-muted-foreground">{username}</div>
              </>
            )}
          </div>
        </div>
        <div className="mt-4">
          {editing ? (
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none resize-none" />
          ) : (
            <p className="text-sm text-muted-foreground">{bio}</p>
          )}
        </div>
        <div className="mt-5 flex gap-2">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:scale-[1.02] transition-transform">Сохранить</button>
              <button onClick={() => setEditing(false)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">Отмена</button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:bg-secondary transition-colors">
              <Icon name="Pencil" size={14} /> Редактировать
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {[{ label: 'Комнаты', value: '4' }, { label: 'Чаты', value: '4' }, { label: 'Сообщений', value: '18' }].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
            <div className="text-2xl font-extrabold">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Section: Settings ────────────────────────────────────────────────────────
function SettingsSection() {
  const [notif, setNotif] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [compact, setCompact] = useState(false);
  const [lang, setLang] = useState('ru');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange} className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  return (
    <div className="animate-fade-in max-w-lg">
      <h2 className="text-2xl font-bold tracking-tight mb-6">Настройки</h2>

      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border bg-secondary/40">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Уведомления</span>
        </div>
        {[
          { label: 'Push-уведомления', desc: 'Новые сообщения и упоминания', value: notif, onChange: () => setNotif(!notif) },
          { label: 'Звуки', desc: 'Звуки при получении сообщений', value: sounds, onChange: () => setSounds(!sounds) },
        ].map((item, i) => (
          <div key={item.label} className={`flex items-center justify-between px-5 py-4 ${i !== 0 ? 'border-t border-border' : ''}`}>
            <div>
              <div className="text-sm font-semibold">{item.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{item.desc}</div>
            </div>
            <Toggle value={item.value} onChange={item.onChange} />
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden mb-4">
        <div className="px-5 py-3 border-b border-border bg-secondary/40">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Интерфейс</span>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <div className="text-sm font-semibold">Компактный режим</div>
            <div className="text-xs text-muted-foreground mt-0.5">Уменьшить отступы и размер шрифта</div>
          </div>
          <Toggle value={compact} onChange={() => setCompact(!compact)} />
        </div>
        <div className="flex items-center justify-between px-5 py-4 border-t border-border">
          <div>
            <div className="text-sm font-semibold">Язык</div>
            <div className="text-xs text-muted-foreground mt-0.5">Язык интерфейса</div>
          </div>
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none">
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-secondary/40">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Аккаунт</span>
        </div>
        <button className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-secondary transition-colors">
          <Icon name="Lock" size={16} className="text-muted-foreground" />
          <span className="text-sm font-semibold">Изменить пароль</span>
          <Icon name="ChevronRight" size={15} className="ml-auto text-muted-foreground" />
        </button>
        <button className="flex w-full items-center gap-3 px-5 py-4 border-t border-border text-left text-destructive hover:bg-destructive/5 transition-colors">
          <Icon name="LogOut" size={16} />
          <span className="text-sm font-semibold">Выйти из аккаунта</span>
        </button>
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function Index() {
  const [active, setActive] = useState<NavId>('home');
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', topic: '', palette: 0 });
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [openRoom, setOpenRoom] = useState<Room | null>(null);
  const [openChat, setOpenChat] = useState<ChatItem | null>(null);

  const openCreate = () => { setForm({ name: '', topic: '', palette: 0 }); setShowCreate(true); };
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

  // Открыт экран комнаты
  if (openRoom) return <RoomScreen room={openRoom} onBack={() => setOpenRoom(null)} />;
  // Открыт экран чата
  if (openChat) return <ChatScreen chat={openChat} onBack={() => setOpenChat(null)} />;

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

          {/* Non-home sections */}
          {active === 'chats' && <ChatsSection onOpenChat={setOpenChat} />}
          {active === 'rooms' && <RoomsSection rooms={rooms} onOpenRoom={setOpenRoom} onCreateRoom={openCreate} />}
          {active === 'search' && <SearchSection rooms={rooms} onOpenRoom={setOpenRoom} onOpenChat={setOpenChat} />}
          {active === 'profile' && <ProfileSection />}
          {active === 'settings' && <SettingsSection />}

          {/* Home section */}
          {active === 'home' && <>

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
                  onClick={() => setOpenRoom(room)}
                  className="group animate-scale-in cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/5"
                  style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${room.color})` }}>
                      <Icon name="Hash" size={22} style={{ color: `hsl(${room.accent})` }} />
                    </div>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary"
                    >
                      <Icon name="EllipsisVertical" size={18} />
                    </button>
                  </div>
                  <h3 className="mt-4 text-lg font-bold tracking-tight">{room.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{room.topic}</p>
                  <div className="mt-4 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Icon name="Users" size={14} /> {room.members.toLocaleString('ru')}</span>
                    <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-green-500" /> {room.online} онлайн</span>
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
                {INITIAL_CHATS.map((chat) => (
                  <button key={chat.name} onClick={() => setOpenChat(chat)} className="flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-secondary">
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
                <button onClick={() => setOpenRoom(rooms[0])} className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-accent">
                  Открыть <Icon name="ArrowRight" size={13} />
                </button>
              </div>
              <div className="flex flex-1 flex-col gap-4 px-5 py-5">
                {(ROOM_MESSAGES['Дизайн и эстетика'] || []).slice(0, 3).map((m, i) => (
                  <div key={i} className={`flex flex-col ${m.me ? 'items-end' : 'items-start'}`}>
                    <div className="mb-1 flex items-center gap-2 px-1">
                      <span className="text-xs font-semibold">{m.author}</span>
                      {m.role && <span className="rounded-md bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">{m.role}</span>}
                      <span className="text-[11px] text-muted-foreground">{m.time}</span>
                    </div>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${m.me ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-secondary text-foreground'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border p-3">
                <button
                  onClick={() => setOpenRoom(rooms[0])}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon name="ArrowRight" size={15} /> Войти в комнату
                </button>
              </div>
            </div>
          </section>

          {/* Feature strip */}
          <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: 'Shield', title: 'Модерация', text: 'Закрепляйте, удаляйте и управляйте участниками' },
              { icon: 'EyeOff', title: 'Чистый контент', text: 'Фильтры и правила для спокойных обсуждений' },
              { icon: 'Sparkles', title: 'Фокус на теме', text: 'Минимум шума, максимум смысла' },
            ].map((f, i) => (
              <div key={f.title} className="animate-fade-in rounded-2xl border border-border bg-card p-5" style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}>
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
          </>}
        </main>
      </div>

      {/* Mobile nav drawer */}
      {showMobileNav && (
        <div className="fixed inset-0 z-[60] flex md:hidden" onClick={() => setShowMobileNav(false)}>
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" />
          <div
            className="relative ml-auto flex h-full w-72 flex-col bg-card px-4 py-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'slideInRight 0.25s ease-out' }}
          >
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button onClick={() => setShowMobileNav(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary">
                <Icon name="X" size={20} />
              </button>
            </div>
            <nav className="mt-8 flex flex-col gap-1">
              {NAV.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActive(item.id); setShowMobileNav(false); }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors ${
                    active === item.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
        <div className="fixed inset-0 z-[60] flex items-start justify-center bg-foreground/30 p-4 pt-16 backdrop-blur-sm" onClick={() => { setShowSearch(false); setSearchQuery(''); }}>
          <div className="animate-scale-in w-full max-w-lg rounded-2xl border border-border bg-card shadow-xl" onClick={(e) => e.stopPropagation()}>
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
                const filtered = rooms.filter((r) => r.name.toLowerCase().includes(q) || r.topic.toLowerCase().includes(q));
                if (!searchQuery) return <div className="px-4 py-6 text-center text-sm text-muted-foreground">Начните вводить название или тему комнаты</div>;
                if (!filtered.length) return <div className="px-4 py-6 text-center text-sm text-muted-foreground">Ничего не найдено по запросу «{searchQuery}»</div>;
                return filtered.map((room) => (
                  <button
                    key={room.name}
                    onClick={() => { setShowSearch(false); setSearchQuery(''); setOpenRoom(room); }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `hsl(${room.color})` }}>
                      <Icon name="Hash" size={18} style={{ color: `hsl(${room.accent})` }} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold">{room.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{room.topic}</div>
                    </div>
                    <div className="ml-auto shrink-0 text-right">
                      <div className="text-xs font-medium">{room.members.toLocaleString('ru')}</div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground"><span className="h-1.5 w-1.5 rounded-full bg-green-500" />{room.online}</div>
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
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-foreground/30 p-0 backdrop-blur-sm sm:items-center sm:p-4" onClick={() => setShowCreate(false)}>
          <div className="animate-scale-in w-full max-w-md rounded-t-3xl border border-border bg-card p-6 sm:rounded-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight">Новая комната</h3>
              <button onClick={() => setShowCreate(false)} className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary">
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
                  className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${form.palette === i ? 'ring-2 ring-foreground ring-offset-2 ring-offset-card' : ''}`}
                  style={{ backgroundColor: `hsl(${p.color})` }}
                >
                  <Icon name="Hash" size={16} style={{ color: `hsl(${p.accent})` }} />
                </button>
              ))}
            </div>
            <div className="mt-7 flex gap-3">
              <button onClick={() => setShowCreate(false)} className="flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition-colors hover:bg-secondary">
                Отмена
              </button>
              <button onClick={createRoom} disabled={!form.name.trim()} className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100">
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