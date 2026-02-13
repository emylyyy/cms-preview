'use client';
import { useState, useEffect } from 'react';
import { Connection } from '@/lib/types';
import { Plus, Trash2, Save } from 'lucide-react';

const EMPTY_CONN: Partial<Connection> = {
  name: 'New Connection',
  deliveryBaseUrl: 'http://lscs.example.com',
  deliveryBasePath: '/lscs/v1/document',
  deliveryAuthType: 'none',
  authoringBaseUrl: 'http://teamsite.example.com/iw/rest',
  authoringAuthType: 'basic',
  previewSecret: 'my-secret-token',
  authoringByPathTemplate: '/sites/mysite{{path}}',
  deliveryByPathTemplate: 'path={{path}}'
};

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [editing, setEditing] = useState<Partial<Connection> | null>(null);
  const refresh = () => fetch('/api/connections').then(r => r.json()).then(setConnections);
  useEffect(() => { refresh(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    await fetch('/api/connections', { method: 'POST', body: JSON.stringify(editing) });
    setEditing(null);
    refresh();
  };
  const handleDelete = async (id: string) => {
    await fetch(`/api/connections?id=${id}`, { method: 'DELETE' });
    refresh();
  };

  return (
    <main>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Connections</h1><button onClick={() => setEditing(EMPTY_CONN)} className="btn-primary flex items-center gap-2"><Plus size={16}/> Add Connection</button></div>
      {editing ? (
        <div className="glass-card p-6 max-w-3xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Edit Connection</h2>
          <div className="space-y-4">
             <div><label className="block text-xs mb-1">Name</label><input className="input-field" value={editing.name} onChange={e => setEditing({...editing, name: e.target.value})} /></div>
             <div className="grid grid-cols-2 gap-4">
                <div><h3 className="font-bold text-blue-400 mb-2">Delivery (Live)</h3><label className="block text-xs mb-1">Base URL</label><input className="input-field mb-2" value={editing.deliveryBaseUrl} onChange={e => setEditing({...editing, deliveryBaseUrl: e.target.value})} /><label className="block text-xs mb-1">Path Template</label><input className="input-field" value={editing.deliveryByPathTemplate} onChange={e => setEditing({...editing, deliveryByPathTemplate: e.target.value})} /></div>
                <div><h3 className="font-bold text-purple-400 mb-2">Authoring (Preview)</h3><label className="block text-xs mb-1">Base URL</label><input className="input-field mb-2" value={editing.authoringBaseUrl} onChange={e => setEditing({...editing, authoringBaseUrl: e.target.value})} /><label className="block text-xs mb-1">Credentials (User)</label><input className="input-field" placeholder="username" value={editing.authoringUsername} onChange={e => setEditing({...editing, authoringUsername: e.target.value})} /><label className="block text-xs mb-1 mt-2">Credentials (Pass)</label><input className="input-field" type="password" placeholder="password" onChange={e => setEditing({...editing, authoringPassword: e.target.value})} /></div>
             </div>
             <div><label className="block text-xs mb-1">Preview Secret</label><input className="input-field" value={editing.previewSecret} onChange={e => setEditing({...editing, previewSecret: e.target.value})} /></div>
             <div className="flex gap-2 pt-4"><button onClick={handleSave} className="btn-primary flex gap-2"><Save size={16}/> Save</button><button onClick={() => setEditing(null)} className="btn-secondary">Cancel</button></div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map(c => (
            <div key={c.id} className="glass-card p-4 flex flex-col justify-between">
              <div><h3 className="font-bold text-lg">{c.name}</h3><div className="text-xs text-slate-400 mt-2 break-all">Live: {c.deliveryBaseUrl}</div><div className="text-xs text-slate-400 break-all">Prev: {c.authoringBaseUrl}</div></div>
              <div className="flex gap-2 mt-4 justify-end"><button onClick={() => setEditing(c)} className="btn-secondary text-xs">Edit</button><button onClick={() => handleDelete(c.id)} className="btn-secondary text-red-400 hover:bg-red-900/50 text-xs"><Trash2 size={14}/></button></div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}