import { draftMode } from 'next/headers';
import Console from './components/Console';

export default function Home() {
  const isDraft = draftMode().isEnabled;
  return (
    <main>
      <div className="mb-6"><h1 className="text-3xl font-bold">OpenText Console</h1><p className="text-slate-400 mt-2">Test connectivity between Next.js App Router and TeamSite/LSCS endpoints.</p></div>
      <Console isDraftMode={isDraft} />
    </main>
  );
}