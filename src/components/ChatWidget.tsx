import { useState } from 'react';
import type { Translations, Lang } from '../i18n/utils';

interface Props { t: Translations; lang: Lang; }

const HELLO = {
  fr: "Salut ! Bienvenue chez Altitude. Comment on peut t'aider ?",
  en: "Hey! Welcome to Altitude. How can we help?",
  nl: "Hey! Welkom bij Altitude. Hoe kunnen we helpen?",
};
const REPLY = {
  fr: 'Merci ! Pour une réponse plus rapide, ouvre WhatsApp ↓',
  en: 'Thanks! For a faster reply, open WhatsApp ↓',
  nl: 'Bedankt! Voor een sneller antwoord, open WhatsApp ↓',
};

export default function ChatWidget({ t, lang }: Props) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([{ who: 'in', text: HELLO[lang] }]);
  const [input, setInput] = useState('');
  const tc = t.chat;
  const waLink = `https://wa.me/32400000000?text=${encodeURIComponent('Salut Altitude !')}`;

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs(m => [...m, { who: 'out', text: userMsg }]);
    setInput('');
    setTimeout(() => setMsgs(m => [...m, { who: 'in', text: REPLY[lang] }]), 800);
  };

  return (
    <>
      {open && (
        <div className="chat-panel">
          <div className="chat-head">
            <div className="avatar">A</div>
            <div className="meta">
              <div className="name">{tc.title}</div>
              <div className="status">{tc.online}</div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 0, color: '#fff', fontSize: 18 }}>✕</button>
          </div>
          <div className="chat-body">
            {msgs.map((m, i) => <div key={i} className={`bubble ${m.who}`}>{m.text}</div>)}
          </div>
          <div className="chat-cta-bar"><a href={waLink} target="_blank" rel="noopener">{tc.whatsapp} →</a></div>
          <div className="chat-input">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder={tc.placeholder} />
            <button onClick={send}>↑</button>
          </div>
        </div>
      )}
      <button className="chat-fab" onClick={() => setOpen(o => !o)} title={tc.open}>
        <span className="pulse" />
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm5.2 13.7c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-1.6-.1a14 14 0 01-2.5-1c-2.5-1.3-4-3.8-4.2-4-.1-.2-1-1.3-1-2.5s.7-1.8 1-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.1.1.3 0 .5l-.2.4-.4.5c-.2.1-.3.3-.1.5l1 1.5c.7 1 1.3 1.4 1.6 1.5.2.1.4.1.6-.1l.8-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.6.4 0 .2 0 .8-.2 1.2z"/></svg>
      </button>
    </>
  );
}
