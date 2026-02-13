'use client';
import { useState, useEffect } from 'react';
import { Connection, FetchResponse, LookupType } from '@/lib/types';
import { clsx } from 'clsx';
// FIX: Added LayoutDashboard to the import list
import { ExternalLink, Power, PowerOff, Loader2, LayoutDashboard } from 'lucide-react';
import PreviewCard from './PreviewCard';

interface Props { isDraftMode: boolean; }

export default function Console({ isDraftMode }: Props) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConn, setSelectedConn] = useState<string>('');
  const [mode, setMode] = useState<'live' | 'preview'>(isDraftMode ? 'preview' : 'live');
  const [lookup, setLookup] = useState<LookupType>('path');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FetchResponse | null>(null);

  useEffect(() => {
    fetch('/api/connections').then(r => r.json()).then(data => {
      setConnections(data);
      if (data.length > 0) setSelectedConn(data[0].id);
    });
  }, []);

  const handleFetch = async () => {
    if (!selectedConn) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/fetch', {
        method: 'POST',
        body: JSON.stringify({ connectionId: selectedConn, mode, lookupType: lookup, value })
      });
      const json = await res.json();
      setResult(json);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const currentConn = connections.find(c => c.id === selectedConn);
  const getPreviewUrl = () => {
    if (!currentConn) return '#';
    const params = new URLSearchParams({ secret: currentConn.previewSecret, path: '/', connectionId: currentConn.id });
    return `/api/preview?${params.toString()}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="glass-card p-6 flex flex-col gap-6 h-fit">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Request Config</h2>
          {isDraftMode ? <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/50">Draft Enabled</span> : <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded border border-green-500/50">Live Mode</span>}
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">Connection Profile</label>
          <select className="input-field" value={selectedConn} onChange={(e) => setSelectedConn(e.target.value)}>
            {connections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">Target Mode</label>
          <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
            <button onClick={() => setMode('live')} className={clsx("flex-1 py-1 text-sm rounded transition-all", mode === 'live' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white')}>Live (LSCS)</button>
            <button onClick={() => setMode('preview')} className={clsx("flex-1 py-1 text-sm rounded transition-all", mode === 'preview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white')}>Preview (Auth)</button>
          </div>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">Lookup Method</label>
          <select className="input-field" value={lookup} onChange={(e) => setLookup(e.target.value as LookupType)}>
            <option value="path">By Path</option>
            <option value="id">By DCR/Content ID</option>
            <option value="query">Custom Query (LSCS only)</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-400 mb-2">{lookup === 'path' ? 'Path (e.g. /home)' : lookup === 'id' ? 'ID (e.g. 12345)' : 'Query String'}</label>
          <input type="text" className="input-field" value={value} onChange={(e) => setValue(e.target.value)} placeholder={lookup === 'path' ? '/sites/mysite/home.xml' : '...'} />
        </div>
        <button onClick={handleFetch} disabled={loading || !selectedConn} className="btn-primary w-full flex justify-center items-center gap-2">
          {loading ? <Loader2 className="animate-spin" size={18}/> : 'Fetch Content'}
        </button>
        <hr className="border-white/10" />
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-bold text-slate-400">SESSION TOOLS</h3>
          <a href={getPreviewUrl()} className="btn-secondary text-xs flex justify-between items-center">Enable Next.js Preview Mode <Power size={14}/></a>
          {isDraftMode && <a href="/api/exit-preview" className="btn-secondary text-xs flex justify-between items-center text-red-300 border-red-900/50 hover:bg-red-900/20">Exit Preview Mode <PowerOff size={14}/></a>}
        </div>
      </div>
      <div className="lg:col-span-2 flex flex-col gap-6">
        {result && (
          <div className="glass-card p-0 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900/50 p-4 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className={clsx("w-2 h-2 rounded-full", result.success ? "bg-green-500" : "bg-red-500")} />
                <span className="font-mono text-sm text-slate-300">{result.httpStatus}</span>
                <span className="font-mono text-sm text-slate-500">{result.durationMs}ms</span>
              </div>
              <div className="text-xs font-mono text-slate-500 max-w-md truncate" title={result.endpointUsed}>{result.endpointUsed}</div>
            </div>
            <div className="p-4 grid grid-cols-1 xl:grid-cols-2 gap-4">
               <div className="bg-slate-950 rounded-lg p-4 overflow-auto max-h-[500px] border border-slate-800">
                 <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Raw JSON</h4>
                 <pre className="text-xs font-mono text-blue-300 whitespace-pre-wrap break-all">{JSON.stringify(result.data, null, 2)}</pre>
               </div>
               <div className="bg-slate-100/5 rounded-lg p-4 overflow-auto max-h-[500px] border border-white/10">
                 <h4 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Visual Preview</h4>
                 <PreviewCard data={result.data} />
               </div>
            </div>
          </div>
        )}
        {!result && !loading && (
           <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50 min-h-[300px]">
             {/* FIX: LayoutDashboard is now properly imported */}
             <LayoutDashboard size={48} className="mb-4"/><p>Select configuration and fetch to see results</p>
           </div>
        )}
      </div>
    </div>
  );
}