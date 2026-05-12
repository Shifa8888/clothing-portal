export type ThemeType = 'light' | 'dark' | 'minimal' | 'luxury' | 'gradient';

export interface ThemeStyles {
  body: string;
  sidebar: string;
  sidebarText: string;
  sidebarActive: string;
  card: string;
  cardHeader: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  buttonPrimary: string;
  buttonSecondary: string;
  input: string;
  badgeSuccess: string;
  badgeWarning: string;
  badgeInfo: string;
  badgeDanger: string;
  accentColor: string;
  tableHeader: string;
  tableRowHover: string;
}

export const themes: Record<ThemeType, ThemeStyles> = {
  light: {
    body: 'bg-slate-50 text-slate-800 font-sans transition-colors duration-200',
    sidebar: 'bg-slate-900 text-slate-200 border-r border-slate-800 shadow-xl',
    sidebarText: 'text-slate-400 hover:text-white hover:bg-slate-800',
    sidebarActive: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20',
    card: 'bg-white rounded-xl border border-slate-200/80 shadow-sm transition-all hover:shadow-md duration-200',
    cardHeader: 'border-b border-slate-100 bg-slate-50/50 rounded-t-xl px-6 py-4',
    border: 'border-slate-200',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-500',
    buttonPrimary: 'bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow duration-200',
    buttonSecondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium px-4 py-2 rounded-lg transition-all duration-200',
    input: 'bg-white border border-slate-300 text-slate-950 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-lg px-4 py-2 outline-none transition-all',
    badgeSuccess: 'bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-semibold',
    badgeWarning: 'bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold',
    badgeInfo: 'bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full text-xs font-semibold',
    badgeDanger: 'bg-rose-50 text-rose-700 border border-rose-200 px-2.5 py-1 rounded-full text-xs font-semibold',
    accentColor: 'indigo',
    tableHeader: 'bg-slate-50 text-slate-500 border-b border-slate-200 text-xs uppercase tracking-wider',
    tableRowHover: 'hover:bg-slate-50/80 transition-colors',
  },
  dark: {
    body: 'bg-slate-950 text-slate-100 font-sans transition-colors duration-200',
    sidebar: 'bg-slate-900 text-slate-200 border-r border-slate-800 shadow-2xl',
    sidebarText: 'text-slate-400 hover:text-white hover:bg-slate-800/80',
    sidebarActive: 'bg-violet-600 text-white shadow-md shadow-violet-900/50',
    card: 'bg-slate-900 rounded-xl border border-slate-800/80 shadow-md transition-all hover:border-slate-700 duration-200',
    cardHeader: 'border-b border-slate-800/80 bg-slate-900 rounded-t-xl px-6 py-4',
    border: 'border-slate-800',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    buttonPrimary: 'bg-violet-600 hover:bg-violet-700 text-white font-medium px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
    buttonSecondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium px-4 py-2 rounded-lg transition-all duration-200',
    input: 'bg-slate-950 border border-slate-800 text-slate-100 focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 rounded-lg px-4 py-2 outline-none transition-all',
    badgeSuccess: 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/50 px-2.5 py-1 rounded-full text-xs font-semibold',
    badgeWarning: 'bg-amber-950/40 text-amber-400 border border-amber-900/50 px-2.5 py-1 rounded-full text-xs font-semibold',
    badgeInfo: 'bg-blue-950/40 text-blue-400 border border-blue-900/50 px-2.5 py-1 rounded-full text-xs font-semibold',
    badgeDanger: 'bg-rose-950/40 text-rose-400 border border-rose-900/50 px-2.5 py-1 rounded-full text-xs font-semibold',
    accentColor: 'violet',
    tableHeader: 'bg-slate-900 text-slate-400 border-b border-slate-800 text-xs uppercase tracking-wider',
    tableRowHover: 'hover:bg-slate-800/30 transition-colors',
  },
  minimal: {
    body: 'bg-white text-zinc-900 font-mono transition-colors duration-100',
    sidebar: 'bg-white text-zinc-900 border-r border-zinc-200',
    sidebarText: 'text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100',
    sidebarActive: 'bg-zinc-950 text-white font-bold border border-zinc-950',
    card: 'bg-white rounded-none border border-zinc-200 shadow-none hover:border-zinc-400 transition-all duration-100',
    cardHeader: 'border-b border-zinc-200 bg-zinc-50 rounded-none px-6 py-4',
    border: 'border-zinc-200',
    textPrimary: 'text-zinc-900',
    textSecondary: 'text-zinc-500',
    buttonPrimary: 'bg-zinc-950 hover:bg-zinc-900 text-white font-bold px-4 py-2 rounded-none transition-all duration-100 border border-zinc-950',
    buttonSecondary: 'bg-white hover:bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold px-4 py-2 rounded-none transition-all duration-100',
    input: 'bg-white border-2 border-zinc-200 text-zinc-950 focus:border-zinc-950 rounded-none px-4 py-2 outline-none transition-all',
    badgeSuccess: 'bg-white text-emerald-800 border-2 border-emerald-800 px-2 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider',
    badgeWarning: 'bg-white text-amber-800 border-2 border-amber-800 px-2 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider',
    badgeInfo: 'bg-white text-zinc-800 border-2 border-zinc-800 px-2 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider',
    badgeDanger: 'bg-white text-rose-800 border-2 border-rose-800 px-2 py-0.5 rounded-none text-xs font-bold uppercase tracking-wider',
    accentColor: 'zinc',
    tableHeader: 'bg-zinc-50 text-zinc-600 border-b-2 border-zinc-200 text-xs uppercase tracking-wider font-bold',
    tableRowHover: 'hover:bg-zinc-50 transition-colors',
  },
  luxury: {
    body: 'bg-stone-950 text-stone-100 font-serif transition-colors duration-200',
    sidebar: 'bg-stone-900 text-stone-200 border-r border-amber-600/30 shadow-[0_0_20px_rgba(212,175,55,0.05)]',
    sidebarText: 'text-stone-400 hover:text-amber-400 hover:bg-stone-850',
    sidebarActive: 'bg-gradient-to-r from-amber-800/40 to-amber-700/20 text-amber-400 border border-amber-500/50 shadow-[0_0_15px_rgba(212,175,55,0.1)]',
    card: 'bg-stone-900 rounded-none border border-amber-500/15 hover:border-amber-500/30 shadow-[0_4px_12px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 duration-200',
    cardHeader: 'border-b border-amber-500/15 bg-gradient-to-r from-stone-900 to-stone-850 rounded-none px-6 py-4',
    border: 'border-amber-500/15',
    textPrimary: 'text-stone-100',
    textSecondary: 'text-stone-400',
    buttonPrimary: 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-bold px-5 py-2.5 rounded-none shadow-[0_4px_10px_rgba(212,175,55,0.15)] transition-all duration-200',
    buttonSecondary: 'bg-stone-900 hover:bg-stone-800 text-amber-400 border border-amber-500/35 font-medium px-5 py-2.5 rounded-none transition-all duration-200',
    input: 'bg-stone-950 border border-amber-500/30 text-amber-100 focus:border-amber-400 focus:ring-1 focus:ring-amber-500/30 rounded-none px-4 py-2 outline-none transition-all font-sans',
    badgeSuccess: 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-none text-xs uppercase tracking-wider font-semibold',
    badgeWarning: 'bg-amber-950/30 text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-none text-xs uppercase tracking-wider font-semibold',
    badgeInfo: 'bg-yellow-950/30 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-none text-xs uppercase tracking-wider font-semibold',
    badgeDanger: 'bg-rose-950/30 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-none text-xs uppercase tracking-wider font-semibold',
    accentColor: 'amber',
    tableHeader: 'bg-stone-900 text-amber-500/80 border-b border-amber-500/15 text-xs uppercase tracking-widest font-semibold',
    tableRowHover: 'hover:bg-amber-500/5 transition-colors',
  },
  gradient: {
    body: 'bg-slate-950 text-slate-100 font-sans min-h-screen relative overflow-x-hidden transition-colors duration-300 bg-gradient-to-tr from-indigo-950 via-slate-950 to-violet-950',
    sidebar: 'bg-slate-900/65 backdrop-blur-xl text-slate-200 border-r border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]',
    sidebarText: 'text-slate-400 hover:text-white hover:bg-white/5',
    sidebarActive: 'bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-[0_0_20px_rgba(217,70,239,0.4)]',
    card: 'bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] hover:border-white/20 hover:shadow-[0_8px_32px_0_rgba(147,51,234,0.15)] transition-all hover:-translate-y-0.5 duration-300',
    cardHeader: 'border-b border-white/10 bg-white/5 rounded-t-2xl px-6 py-4',
    border: 'border-white/10',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-400',
    buttonPrimary: 'bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-4 py-2 rounded-xl shadow-lg shadow-fuchsia-500/20 hover:shadow-fuchsia-500/35 transition-all duration-200',
    buttonSecondary: 'bg-white/10 hover:bg-white/15 text-white border border-white/15 font-semibold px-4 py-2 rounded-xl transition-all duration-200',
    input: 'bg-black/25 border border-white/10 text-white focus:ring-2 focus:ring-fuchsia-500/30 focus:border-fuchsia-500 rounded-xl px-4 py-2 outline-none transition-all backdrop-blur-sm',
    badgeSuccess: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold',
    badgeWarning: 'bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold',
    badgeInfo: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold',
    badgeDanger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-xl text-xs font-semibold',
    accentColor: 'fuchsia',
    tableHeader: 'bg-white/5 text-slate-300 border-b border-white/10 text-xs uppercase tracking-wider',
    tableRowHover: 'hover:bg-white/5 transition-colors',
  }
};
