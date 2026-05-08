
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  UserPlus, Trash2, Power, Mail, Lock, User,
  CheckCircle, XCircle, Shield, Info, Eye, EyeOff,
  Briefcase, Phone, ClipboardList, UserCheck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import Layout from '../components/common/Layout';
import Card, { CardHeader } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

// ─── Create Staff Modal ────────────────────────────────
const CreateStaffModal = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [createdStaff, setCreatedStaff] = useState(null); // show after creation

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^[^\s@]+@cleanpress\.com$/i.test(form.email.trim())) {
      errs.email = 'Use a CleanPress email like example@cleanpress.com';
    }
    if (form.password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const mutation = useMutation({
    mutationFn: () => authAPI.registerStaff(form),
    onSuccess: (res) => {
      toast.success(`✅ Staff account created for ${res.data.data.user.name}`);
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
      // Show credentials to share with staff
      setCreatedStaff({ ...res.data.data.user, password: form.password });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to create staff account');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  const handleClose = () => {
    setForm({ name: '', email: '', password: '' });
    setErrors({});
    setCreatedStaff(null);
    setShowPassword(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={createdStaff ? '✅ Staff Account Created' : 'Add New Staff Member'}
      size="sm"
    >
      {/* ── After creation: show credentials ── */}
      {createdStaff ? (
        <div className="flex flex-col gap-4">
          <div className="bg-emerald-400/8 border border-emerald-400/25 rounded-xl p-4">
            <p className="text-emerald-400 text-sm font-medium mb-3 flex items-center gap-2">
              <CheckCircle size={15} /> Account ready! Share these with {createdStaff.name}:
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Name</span>
                <span className="text-sm font-medium text-cream-100">{createdStaff.name}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Email</span>
                <span className="text-sm font-mono text-cream-100">{createdStaff.email}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Password</span>
                <span className="text-sm font-mono text-cream-100">{createdStaff.password}</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 rounded-lg px-3 py-2">
                <span className="text-xs text-gray-500">Login URL</span>
                <span className="text-sm font-mono text-gold-400">/login</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-400/8 border border-amber-400/20 rounded-xl p-3 text-xs text-amber-300 flex items-start gap-2">
            <Info size={13} className="flex-shrink-0 mt-0.5" />
            Save these credentials now. The password will not be shown again.
          </div>

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => {
                const text = `CleanPress Login\nEmail: ${createdStaff.email}\nPassword: ${createdStaff.password}\nURL: ${window.location.origin}/login`;
                navigator.clipboard.writeText(text);
                toast.success('Credentials copied!');
              }}
            >
              Copy Credentials
            </Button>
            <Button variant="primary" className="flex-1" onClick={() => { setCreatedStaff(null); handleClose(); }}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        /* ── Create form ── */
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="bg-blue-400/8 border border-blue-400/20 rounded-xl p-3 text-xs text-blue-300 flex items-start gap-2">
            <Shield size={13} className="flex-shrink-0 mt-0.5" />
            <span>
              Staff can create orders and update statuses. They cannot see revenue or manage other staff.
            </span>
          </div>

          <Input
            label="Full Name"
            placeholder="e.g. Ravi Kumar"
            icon={User}
            value={form.name}
            onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
            error={errors.name}
            autoFocus
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="ravi@cleanpress.com"
            icon={Mail}
            value={form.email}
            onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
            error={errors.email}
          />

          {/* Password with show/hide */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                className={`w-full input-dark rounded-xl pl-9 pr-10 py-2.5 font-body text-sm ${errors.password ? 'border-rose-500' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-rose-400">{errors.password}</p>}
          </div>

          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={mutation.isPending}
              icon={UserPlus}
              className="flex-1"
            >
              Create Staff
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

// ─── Staff Management Page ─────────────────────────────
const StaffManagementPage = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['staff-list'],
    queryFn: () => authAPI.getStaff().then((r) => r.data.data.staff),
  });

  const { data: applicationsData, isLoading: applicationsLoading } = useQuery({
    queryKey: ['staff-applications'],
    queryFn: () => authAPI.getStaffApplications().then((r) => r.data.data.applications),
  });

  const toggleMutation = useMutation({
    mutationFn: (id) => authAPI.toggleStaff(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => authAPI.deleteStaff(id),
    onSuccess: (_, id) => {
      toast.success('Staff account removed');
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: () => toast.error('Failed to delete staff'),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => authAPI.approveStaffApplication(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['staff-applications'] });
      queryClient.invalidateQueries({ queryKey: ['staff-list'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to approve request'),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => authAPI.rejectStaffApplication(id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({ queryKey: ['staff-applications'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to reject request'),
  });

  const handleDelete = (staff) => {
    if (window.confirm(`Remove ${staff.name}'s account permanently? They will lose all access.`)) {
      deleteMutation.mutate(staff._id);
    }
  };

  const staffList = data || [];
  const applications = applicationsData || [];
  const pendingApplications = applications.filter((request) => request.status === 'pending');
  const activeCount = staffList.filter((s) => s.isActive).length;

  return (
    <Layout>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-cream-100">Staff Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Review staff vacancy requests, approve eligible joiners, and manage active accounts.
          </p>
        </div>
        <Link
          to="/join-staff"
          className="inline-flex items-center justify-center gap-2 font-body font-medium btn-primary text-charcoal-900 px-5 py-2.5 text-sm rounded-xl"
        >
          <ClipboardList size={16} />
          Request Form
        </Link>
      </div>

      {/* How it works — guide box */}
      <div className="mb-6 glass-card p-5 border border-blue-400/20 bg-blue-400/5">
        <h3 className="font-semibold text-cream-100 mb-4 flex items-center gap-2 text-sm">
          <Info size={15} className="text-blue-400" />
          How Staff Hiring Works
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '01', text: 'New joiner opens the request form' },
            { step: '02', text: 'They apply with their Gmail address' },
            { step: '03', text: 'Admin approves only eligible requests' },
            { step: '04', text: 'Generated login email and password are emailed automatically' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-2.5">
              <span className="text-gold-400 font-mono text-xs font-bold mt-0.5 flex-shrink-0">{s.step}</span>
              <span className="text-sm text-gray-400">{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary pills */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Staff', value: staffList.length, color: 'text-cream-100' },
          { label: 'Active', value: activeCount, color: 'text-emerald-400' },
          { label: 'Pending Requests', value: pendingApplications.length, color: 'text-gold-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center border border-white/5">
            <p className={`font-display font-bold text-2xl ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-600 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Card className="mb-6">
        <CardHeader
          title="Vacancy Requests"
          subtitle={`${pendingApplications.length} pending review${pendingApplications.length !== 1 ? 's' : ''}`}
          action={
            <Button variant="secondary" size="sm" icon={UserPlus} onClick={() => setModalOpen(true)}>
              Manual Add
            </Button>
          }
        />

        {applicationsLoading ? (
          <div className="text-center py-10 text-gray-600 text-sm">Loading requests...</div>
        ) : pendingApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <ClipboardList size={24} className="text-gray-600" />
            </div>
            <p className="font-display text-gray-500 text-lg">No pending requests</p>
            <p className="text-gray-700 text-sm mt-1">New joiner applications will appear here for eligibility review.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingApplications.map((request) => (
              <div key={request._id} className="border border-white/8 rounded-xl p-4 bg-white/[0.02]">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gold-400/12 border border-gold-400/25 flex items-center justify-center">
                        <span className="text-gold-400 text-sm font-bold">{request.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="font-medium text-cream-100">{request.name}</p>
                        <p className="text-xs text-gray-600 font-mono">
                          Applied {format(new Date(request.createdAt), 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-3 text-xs">
                      <span className="inline-flex items-center gap-2 text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                        <Mail size={13} className="text-gold-400" /> {request.email}
                      </span>
                      <span className="inline-flex items-center gap-2 text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                        <Phone size={13} className="text-blue-400" /> {request.phone}
                      </span>
                      <span className="inline-flex items-center gap-2 text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                        <Briefcase size={13} className="text-emerald-400" /> {request.position}
                      </span>
                      <span className="inline-flex items-center gap-2 text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                        <Shield size={13} className="text-purple-400" /> {request.experience} yrs
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 mt-3 leading-relaxed">{request.skills}</p>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:min-w-[140px]">
                    <button
                      onClick={() => approveMutation.mutate(request._id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border text-emerald-400 border-emerald-400/25 hover:bg-emerald-400/10 transition-all disabled:opacity-50"
                    >
                      <UserCheck size={13} />
                      Approve
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(request._id)}
                      disabled={approveMutation.isPending || rejectMutation.isPending}
                      className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium border text-rose-400 border-rose-400/25 hover:bg-rose-400/10 transition-all disabled:opacity-50"
                    >
                      <XCircle size={13} />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Staff table */}
      <Card>
        <CardHeader
          title="All Staff Members"
          subtitle={`${staffList.length} account${staffList.length !== 1 ? 's' : ''} total`}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-600 text-sm">Loading staff list...</div>
        ) : staffList.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
              <User size={28} className="text-gray-600" />
            </div>
            <p className="font-display text-gray-500 text-lg">No staff accounts yet</p>
            <p className="text-gray-700 text-sm mt-1 mb-5">Click "Add Staff" to create the first account</p>
            <Button variant="primary" icon={UserPlus} onClick={() => setModalOpen(true)}>
              Add First Staff Member
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Staff Member', 'Email', 'Status', 'Created On', 'Actions'].map((h) => (
                    <th
                      key={h}
                      className="text-left text-xs text-gray-600 font-mono uppercase tracking-wider pb-3 pr-4 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {staffList.map((staff) => (
                  <tr key={staff._id} className="hover:bg-white/3 transition-colors group">

                    {/* Name + Avatar */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-400/15 border border-blue-400/25 flex items-center justify-center flex-shrink-0">
                          <span className="text-blue-400 text-sm font-bold">
                            {staff.name[0].toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-cream-100">{staff.name}</p>
                          <p className="text-xs text-blue-400/60 font-mono">staff</p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 pr-4">
                      <span className="font-mono text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-lg">
                        {staff.email}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className="py-4 pr-4">
                      {staff.isActive ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-2.5 py-1 rounded-full font-mono">
                          <CheckCircle size={11} /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full font-mono">
                          <XCircle size={11} /> Inactive
                        </span>
                      )}
                    </td>

                    {/* Created date */}
                    <td className="py-4 pr-4 text-gray-600 text-xs font-mono whitespace-nowrap">
                      {format(new Date(staff.createdAt), 'dd MMM yyyy')}
                    </td>

                    {/* Actions */}
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        {/* Toggle active/inactive */}
                        <button
                          onClick={() => toggleMutation.mutate(staff._id)}
                          disabled={toggleMutation.isPending}
                          title={staff.isActive ? 'Deactivate this staff' : 'Activate this staff'}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            staff.isActive
                              ? 'text-amber-400 border-amber-400/20 hover:bg-amber-400/10'
                              : 'text-emerald-400 border-emerald-400/20 hover:bg-emerald-400/10'
                          }`}
                        >
                          <Power size={12} />
                          {staff.isActive ? 'Deactivate' : 'Activate'}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(staff)}
                          disabled={deleteMutation.isPending}
                          title="Delete account permanently"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border text-rose-400 border-rose-400/20 hover:bg-rose-400/10 transition-all"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Staff Modal */}
      <CreateStaffModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
};

export default StaffManagementPage;
