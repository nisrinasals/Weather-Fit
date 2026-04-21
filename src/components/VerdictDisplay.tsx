import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface VerdictDisplayProps {
  verdict: string;
  advice: string;
}

export function VerdictDisplay({ verdict, advice }: VerdictDisplayProps) {
  const getVerdictConfig = (verdict: string) => {
    const upperVerdict = verdict.toUpperCase();
    if (upperVerdict.includes('SAFE') || upperVerdict.includes('GO')) {
      return {
        icon: CheckCircle,
        bgColor: 'bg-emerald-900/30 border-emerald-700',
        iconColor: 'text-emerald-400',
        textColor: 'text-emerald-400',
        label: 'SAFE',
      };
    }
    if (upperVerdict.includes('WARNING') || upperVerdict.includes('CAUTION')) {
      return {
        icon: AlertTriangle,
        bgColor: 'bg-amber-900/30 border-amber-700',
        iconColor: 'text-amber-400',
        textColor: 'text-amber-400',
        label: 'WARNING',
      };
    }
    return {
      icon: XCircle,
      bgColor: 'bg-red-900/30 border-red-700',
      iconColor: 'text-red-400',
      textColor: 'text-red-400',
      label: 'DISASTER',
    };
  };

  const config = getVerdictConfig(verdict);
  const Icon = config.icon;

  return (
    <div className={`border rounded-lg p-6 ${config.bgColor}`}>
      <div className="flex items-center gap-3 mb-4">
        <Icon className={`w-8 h-8 ${config.iconColor}`} />
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide">Verdict</p>
          <p className={`text-2xl font-bold ${config.textColor}`}>{config.label}</p>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-white leading-relaxed">{advice}</p>
      </div>
    </div>
  );
}
