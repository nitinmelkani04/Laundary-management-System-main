import { Search, X } from 'lucide-react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';

const GARMENT_TYPES = [
  'Shirt', 'Pants', 'Saree', 'Suit', 'Jacket',
  'Kurta', 'Lehenga', 'Bedsheet', 'Curtain', 'Blanket', 'Tie', 'Sweater',
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: '' },
  { label: 'Received', value: 'RECEIVED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Ready', value: 'READY' },
  { label: 'Delivered', value: 'DELIVERED' },
];

const OrderFilters = ({ filters, onChange, onClear }) => {
  const hasFilters = filters.search || filters.status || filters.garmentType;

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Input
        placeholder="Search by name, phone, order ID..."
        icon={Search}
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        containerClass="flex-1 min-w-48"
      />
      <Select
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(e) => onChange({ ...filters, status: e.target.value })}
        containerClass="w-44"
        placeholder="All Statuses"
      />
      <Select
        options={GARMENT_TYPES.map((g) => ({ label: g, value: g }))}
        value={filters.garmentType}
        onChange={(e) => onChange({ ...filters, garmentType: e.target.value })}
        containerClass="w-40"
        placeholder="All Garments"
      />
      {hasFilters && (
        <Button variant="ghost" size="md" icon={X} onClick={onClear}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default OrderFilters;
