import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const GOLD_SHADES = ['#f0c040', '#d4a017', '#b8860b', '#f0c040cc', '#d4a017aa'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm">
        <p className="font-mono text-gold-400">{label}</p>
        <p className="text-cream-100">{payload[0].value} pcs cleaned</p>
        {payload[1] && (
          <p className="text-emerald-400">₹{payload[1].value.toLocaleString('en-IN')} revenue</p>
        )}
      </div>
    );
  }
  return null;
};

const GarmentsChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
        No garment data yet
      </div>
    );
  }

  const chartData = data.map((d) => ({
    name: d._id,
    quantity: d.totalQuantity,
    revenue: d.totalRevenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#9ca3af', fontSize: 11, fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#9ca3af', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(240,192,64,0.05)' }} />
        <Bar dataKey="quantity" radius={[6, 6, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell key={index} fill={GOLD_SHADES[index % GOLD_SHADES.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GarmentsChart;
