'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { LayoutDashboard, Settings } from 'lucide-react';

export default function Navigation() {
  const pathname = usePathname();
  const navItem = (path: string, label: string, Icon: any) => (
    <Link href={path} className={clsx("flex items-center gap-2 px-4 py-2 rounded-lg transition-all", pathname === path ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-slate-400 hover:text-white hover:bg-white/5")}>
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
  return (
    <nav className="glass-card p-4 flex justify-between items-center">
      <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">WebCMS<span className="font-light text-white">Bridge</span></div>
      <div className="flex gap-2">{navItem('/', 'Console', LayoutDashboard)}{navItem('/connections', 'Connections', Settings)}</div>
    </nav>
  );
}