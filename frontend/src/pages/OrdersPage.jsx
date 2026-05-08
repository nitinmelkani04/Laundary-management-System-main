import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { ordersAPI } from '../utils/api';
import Layout from '../components/common/Layout';
import OrderCard from '../components/orders/OrderCard';
import OrderFilters from '../components/orders/OrderFilters';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import EmptyState from '../components/common/EmptyState';
import { ShoppingBag } from 'lucide-react';

const LIMIT = 10;

const OrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: searchParams.get('status') || '',
    garmentType: searchParams.get('garmentType') || '',
  });

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (filters.search) params.search = filters.search;
    if (filters.status) params.status = filters.status;
    if (filters.garmentType) params.garmentType = filters.garmentType;
    setSearchParams(params);
    setPage(1);
  }, [filters]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['orders', filters, page],
    queryFn: () =>
      ordersAPI
        .getAll({ ...filters, page, limit: LIMIT })
        .then((r) => r.data.data),
    keepPreviousData: true,
  });

  const orders = data?.orders || [];
  const pagination = data?.pagination;

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', garmentType: '' });
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-3xl text-cream-100">All Orders</h1>
          {pagination && (
            <p className="text-gray-500 text-sm mt-1">
              {pagination.total} order{pagination.total !== 1 ? 's' : ''} found
            </p>
          )}
        </div>
        <Link to="/orders/new">
          <Button variant="primary" icon={Plus}>
            New Order
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <OrderFilters
          filters={filters}
          onChange={setFilters}
          onClear={handleClearFilters}
        />
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders found"
          subtitle={
            filters.search || filters.status || filters.garmentType
              ? 'Try adjusting your filters'
              : 'Create your first order to get started'
          }
          action={
            <Link to="/orders/new">
              <Button variant="primary" icon={Plus}>
                Create Order
              </Button>
            </Link>
          }
        />
      ) : (
        <>
          {/* Subtle fetching indicator */}
          {isFetching && !isLoading && (
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
              <Spinner size="sm" />
              Updating...
            </div>
          )}

          {/* Orders grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 font-mono">
                Page {pagination.page} of {pagination.pages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={ChevronLeft}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                  disabled={page === pagination.pages}
                >
                  Next
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Layout>
  );
};

export default OrdersPage;
