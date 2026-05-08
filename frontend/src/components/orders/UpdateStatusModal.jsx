import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import Modal from '../common/Modal';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';
import { ordersAPI } from '../../utils/api';

const STATUS_OPTIONS = [
  { value: 'RECEIVED', label: '📥 Received' },
  { value: 'PROCESSING', label: '⚙️ Processing' },
  { value: 'READY', label: '✅ Ready for Pickup' },
  { value: 'DELIVERED', label: '🎉 Delivered' },
];

const STATUS_FLOW = {
  RECEIVED: 'PROCESSING',
  PROCESSING: 'READY',
  READY: 'DELIVERED',
  DELIVERED: null,
};

const UpdateStatusModal = ({ isOpen, onClose, order }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState(order?.status || 'RECEIVED');
  const [note, setNote] = useState('');

  const nextStatus = STATUS_FLOW[order?.status];

  const mutation = useMutation({
    mutationFn: () => ordersAPI.updateStatus(order._id, status, note),
    onSuccess: () => {
      toast.success(`Status updated to ${status}`);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', order._id] });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Update failed');
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Order Status" size="sm">
      <div className="flex flex-col gap-4">
        <Select
          label="New Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        <Input
          label="Note (optional)"
          placeholder="Add a note about this update..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        {nextStatus && status !== nextStatus && (
          <div className="text-xs text-gray-600 bg-white/3 rounded-lg p-3 border border-white/5">
            💡 Next step in the flow:{' '}
            <span className="text-gold-400">{nextStatus}</span>
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => mutation.mutate()}
            loading={mutation.isPending}
            className="flex-1"
          >
            Update Status
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default UpdateStatusModal;
