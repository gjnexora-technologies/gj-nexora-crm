import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useCRM } from '../../context/CRMContext';
import { Calendar, Clock, RotateCcw } from 'lucide-react';

interface RescheduleFollowupModalProps {
  followupId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleFollowupModal: React.FC<RescheduleFollowupModalProps> = ({
  followupId,
  isOpen,
  onClose,
}) => {
  const { followUps, rescheduleFollowUp } = useCRM();

  const item = followUps.find((f) => f.id === followupId);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    if (item) {
      setDate(item.date);
      setTime(item.time);
    }
  }, [item]);

  if (!item) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    rescheduleFollowUp(item.id, date, time || '11:00 AM');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Follow-up"
      subtitle={`Change reminder date for ${item.company} (${item.contactName})`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="p-3 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB] text-xs space-y-1">
          <p className="font-bold text-[#111827]">{item.title}</p>
          <p className="text-[#667085]">
            Currently scheduled for: {item.date} at {item.time} ({item.type})
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">New Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-1">New Time</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 02:30 PM"
              className="w-full px-3 py-1.5 text-xs bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#2563EB]"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#4B5563] bg-white border border-[#D1D5DB] rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-lg shadow-2xs transition-colors"
          >
            Update Schedule
          </button>
        </div>
      </form>
    </Modal>
  );
};
