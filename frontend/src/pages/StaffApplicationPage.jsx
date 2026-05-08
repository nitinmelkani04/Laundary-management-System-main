import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, Briefcase, CheckCircle, Mail, Phone, Sparkles, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  skills: '',
};

const StaffApplicationPage = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submittedEmail, setSubmittedEmail] = useState('');

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Full name is required';
    if (!/^[^\s@]+@gmail\.com$/i.test(form.email.trim())) {
      nextErrors.email = 'Use your Gmail address like example@gmail.com';
    }
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Enter a valid 10-digit Indian mobile number';
    }
    if (!form.position.trim()) nextErrors.position = 'Position is required';
    if (form.experience === '' || Number(form.experience) < 0) {
      nextErrors.experience = 'Enter years of experience';
    }
    if (!form.skills.trim()) nextErrors.skills = 'Add skills or eligibility details';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const mutation = useMutation({
    mutationFn: () => authAPI.submitStaffApplication({
      ...form,
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      experience: Number(form.experience),
    }),
    onSuccess: () => {
      setSubmittedEmail(form.email.trim().toLowerCase());
      setForm(initialForm);
      toast.success('Request submitted for admin review');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Could not submit request');
    },
  });

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate();
  };

  return (
    <main className="min-h-screen bg-charcoal-950 text-cream-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gold-400 transition-colors mb-7"
        >
          <ArrowLeft size={16} />
          Staff login
        </Link>

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-6 items-start">
          <section className="space-y-5">
            <div>
              <p className="text-gold-400 text-sm font-mono mb-2">CleanPress hiring access</p>
              <h1 className="font-display font-bold text-3xl sm:text-4xl leading-tight">
                Request a staff vacancy review
              </h1>
              <p className="text-gray-500 text-sm mt-3 max-w-md">
                New joiners submit their details here. Admin checks eligibility, approves the request, and the system emails the login password.
              </p>
            </div>

            <div className="glass-card p-5 border border-gold-400/20 bg-gold-400/5">
              <h2 className="font-semibold text-sm text-cream-100 flex items-center gap-2 mb-4">
                <Sparkles size={15} className="text-gold-400" />
                What happens next
              </h2>
              <div className="space-y-3">
                {[
                  'Submit details with your Gmail address.',
                  'Admin reviews eligibility from the staff panel.',
                  'Approved joiners receive generated login email + password automatically.',
                ].map((item, index) => (
                  <div key={item} className="flex gap-3 text-sm text-gray-400">
                    <span className="font-mono text-gold-400 text-xs mt-0.5">{String(index + 1).padStart(2, '0')}</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="glass-card p-6 border border-white/8">
            {submittedEmail ? (
              <div className="py-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400/10 border border-emerald-400/25 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={30} className="text-emerald-400" />
                </div>
                <h2 className="font-display font-semibold text-2xl mb-2">Request submitted</h2>
                <p className="text-gray-500 text-sm max-w-sm mx-auto mb-6">
                  Admin will review eligibility. If approved, login credentials will be emailed to {submittedEmail}.
                </p>
                <Button variant="secondary" onClick={() => setSubmittedEmail('')}>
                  Submit Another Request
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h2 className="font-display font-semibold text-xl">Joiner Details</h2>
                  <p className="text-gray-600 text-sm mt-1">Use your Gmail address for approval updates.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Ravi Kumar"
                    icon={User}
                    value={form.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    error={errors.name}
                  />
                  <Input
                    label="Gmail Address"
                    type="email"
                    placeholder="ravi@gmail.com"
                    icon={Mail}
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    error={errors.email}
                  />
                  <Input
                    label="Phone"
                    placeholder="9876543210"
                    icon={Phone}
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    error={errors.phone}
                  />
                  <Input
                    label="Position"
                    placeholder="Counter Staff"
                    icon={Briefcase}
                    value={form.position}
                    onChange={(e) => updateField('position', e.target.value)}
                    error={errors.position}
                  />
                  <Input
                    label="Experience"
                    type="number"
                    min="0"
                    placeholder="2"
                    value={form.experience}
                    onChange={(e) => updateField('experience', e.target.value)}
                    error={errors.experience}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-300 font-body">Skills / Eligibility</label>
                  <textarea
                    rows={5}
                    placeholder="Laundry operations, counter handling, delivery coordination..."
                    value={form.skills}
                    onChange={(e) => updateField('skills', e.target.value)}
                    className={`w-full input-dark rounded-xl px-4 py-3 font-body text-sm resize-none ${errors.skills ? 'border-rose-500 focus:border-rose-400' : ''}`}
                  />
                  {errors.skills && <p className="text-xs text-rose-400">{errors.skills}</p>}
                </div>

                <Button type="submit" variant="primary" loading={mutation.isPending} className="w-full">
                  Submit Request
                </Button>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default StaffApplicationPage;
