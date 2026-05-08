import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Layout from '../components/common/Layout';
import CreateOrderForm from '../components/orders/CreateOrderForm';

const CreateOrderPage = () => {
  return (
    <Layout>
      {/* Back nav */}
      <div className="mb-6">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gold-400 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Orders
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-cream-100">Create New Order</h1>
        <p className="text-gray-500 text-sm mt-1">
          Add customer details, select garments, and generate a bill instantly.
        </p>
      </div>

      <CreateOrderForm />
    </Layout>
  );
};

export default CreateOrderPage;
