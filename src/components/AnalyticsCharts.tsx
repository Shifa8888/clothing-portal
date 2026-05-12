import React, { useState } from 'react';

// Interfaces for our custom chart data
interface DataPoint {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: DataPoint[];
  color?: string;
  title: string;
  suffix?: string;
}

export const SalesAreaChart: React.FC<AreaChartProps> = ({
  data,
  color = 'indigo',
  title,
  suffix = '',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const height = 180;
  const width = 500;
  const padding = 30;

  // Calculate points
  const points = data.map((d, i) => {
    const x = padding + (i * (width - padding * 2)) / (data.length - 1);
    // Invert Y coordinate because SVG origin is top-left
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return { x, y, label: d.label, value: d.value };
  });

  // Generate path coordinates
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  // Area path (closes the shape at the bottom)
  const areaPathData = points.length > 0
    ? `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold tracking-wider uppercase opacity-80">{title}</h4>
        {hoveredIndex !== null && (
          <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-white rounded shadow-sm">
            {data[hoveredIndex].label}: {suffix}{data[hoveredIndex].value.toLocaleString()}
          </span>
        )}
      </div>

      <div className="relative w-full h-[180px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id={`areaGrad-${color}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`var(--color-${color}-500, currentColor)`} stopOpacity="0.4" />
              <stop offset="100%" stopColor={`var(--color-${color}-500, currentColor)`} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + ratio * (height - padding * 2);
            const val = Math.round(maxValue * (1 - ratio));
            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-slate-500/10"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono font-medium"
                >
                  {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                </text>
              </g>
            );
          })}

          {/* Area under the line */}
          {areaPathData && (
            <path
              d={areaPathData}
              fill={`url(#areaGrad-${color})`}
              className="text-indigo-500 violet-500 amber-500 zinc-500 fuchsia-500"
            />
          )}

          {/* Main Line path */}
          {pathData && (
            <path
              d={pathData}
              fill="none"
              strokeWidth="2.5"
              className={`stroke-${color}-500 text-${color}-500 transition-all duration-300`}
            />
          )}

          {/* Data Points and Interaction Areas */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIndex === i ? '6' : '3'}
                className={`fill-white stroke-${color}-500 stroke-2 cursor-pointer transition-all duration-150`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
              {/* Invisible interactive overlay bar for easy hovering */}
              <rect
                x={p.x - 15}
                y={padding}
                width="30"
                height={height - padding * 2}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => {
            // Show first, middle, and last label on small screen scales, or all on wide SVG
            if (i % 2 !== 0 && points.length > 5) return null;
            return (
              <text
                key={i}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                className="text-[9px] fill-slate-400 font-medium font-sans"
              >
                {p.label}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export const OrdersBarChart: React.FC<{
  data: DataPoint[];
  color?: string;
  title: string;
}> = ({ data, color = 'indigo', title }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const height = 180;
  const width = 500;
  const padding = 30;

  const chartWidth = width - padding * 2;
  const barWidth = (chartWidth / data.length) * 0.6;
  const gap = (chartWidth / data.length) * 0.4;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-sm font-semibold tracking-wider uppercase opacity-80">{title}</h4>
        {hoveredIndex !== null && (
          <span className="text-xs font-semibold px-2 py-1 bg-slate-800 text-white rounded shadow-sm">
            {data[hoveredIndex].label}: {data[hoveredIndex].value} orders
          </span>
        )}
      </div>

      <div className="relative w-full h-[180px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = padding + ratio * (height - padding * 2);
            const val = Math.round(maxValue * (1 - ratio));
            return (
              <g key={index}>
                <line
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  className="stroke-slate-500/10"
                  strokeDasharray="4"
                />
                <text
                  x={padding - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="text-[10px] fill-slate-400 font-mono font-medium"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((d, i) => {
            const barHeight = (d.value / maxValue) * (height - padding * 2);
            const x = padding + i * (barWidth + gap) + gap / 2;
            const y = height - padding - barHeight;

            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="3"
                  className={`fill-${color}-500/80 hover:fill-${color}-500 transition-all cursor-pointer ${
                    hoveredIndex === i ? 'opacity-100 filter brightness-110' : 'opacity-90'
                  }`}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                {/* Invisible hover area for easy targeting */}
                <rect
                  x={x - gap / 2}
                  y={padding}
                  width={barWidth + gap}
                  height={height - padding * 2}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                  className="text-[9px] fill-slate-400 font-medium font-sans"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

interface CategorySharePoint {
  category: string;
  count: number;
  color: string;
}

export const CategoryShareDonut: React.FC<{
  data: CategorySharePoint[];
  title: string;
}> = ({ data, title }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const total = data.reduce((acc, curr) => acc + curr.count, 0);
  const size = 180;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const segments = data.map((d) => {
    const percent = d.count / total;
    const strokeDashoffset = circumference - percent * circumference;
    const rotation = accumulatedPercent * 360;
    accumulatedPercent += percent;

    return {
      ...d,
      percent,
      strokeDashoffset,
      rotation,
    };
  });

  return (
    <div className="w-full flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1">
        <h4 className="text-sm font-semibold tracking-wider uppercase opacity-80 mb-4">{title}</h4>
        <div className="flex flex-col gap-2">
          {segments.map((s, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-1.5 rounded transition-all cursor-pointer ${
                hoveredIndex === idx ? 'bg-slate-500/10 scale-[1.01]' : 'opacity-95'
              }`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${s.color}`} />
                <span className="text-xs font-semibold">{s.category}</span>
              </div>
              <span className="text-xs font-mono font-bold">
                {s.count} ({Math.round(s.percent * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-[180px] h-[180px] flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="transparent"
              strokeWidth={strokeWidth}
              className={`${s.color.replace('bg-', 'stroke-')} transition-all duration-300 cursor-pointer`}
              strokeDasharray={circumference}
              strokeDashoffset={s.strokeDashoffset}
              style={{
                transformOrigin: '50% 50%',
                transform: `rotate(${s.rotation}deg)`,
              }}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Center content */}
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold font-mono">
            {hoveredIndex !== null ? segments[hoveredIndex].count : total}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            {hoveredIndex !== null ? segments[hoveredIndex].category.split(' ')[0] : 'Products'}
          </span>
        </div>
      </div>
    </div>
  );
};
