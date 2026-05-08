import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const STATUS_COLORS = {
  RECEIVED: '#3b82f6',
  PROCESSING: '#f59e0b',
  READY: '#10b981',
  DELIVERED: '#8b5cf6',
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm">
        <p className="font-mono text-gold-400">{payload[0].name}</p>
        <p className="text-cream-100 font-medium">{payload[0].value} orders</p>
      </div>
    );
  }
  return null;
};

const StatusChart = ({ data }) => {
  const chartData = Object.entries(data || {})
    .filter(([, v]) => v > 0)
    .map(([status, count]) => ({ name: status, value: count }));

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
        No order data yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={4}
          dataKey="value"
        >
          {chartData.map((entry) => (
            <Cell
              key={entry.name}
              fill={STATUS_COLORS[entry.name]}
              opacity={0.85}
              stroke="transparent"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => (
            <span style={{ color: '#9ca3af', fontSize: '12px', fontFamily: 'DM Sans' }}>
              {value}
            </span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default StatusChart;
