import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Navbar, Modal, Alert, StatusBadge } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { paymentService, userService } from '@/lib/services';
import { FiPlus, FiSearch, FiCheckCircle } from 'react-icons/fi';

export default function Payments() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [payments, setPayments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: '',
    payment_method: 'cash',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchData();
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      setPageLoading(true);
      const [paymentsRes, customersRes] = await Promise.all([
        paymentService.getAll(),
        userService.getAll(),
      ]);
      setPayments(paymentsRes.data.results || paymentsRes.data);
      setCustomers(customersRes.data.results || customersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setPageLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await paymentService.create({
        ...formData,
        customer: parseInt(formData.customer),
      });
      setMessage({ type: 'success', text: 'Payment recorded successfully' });
      resetForm();
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to record payment' });
    }
  };

  const handleMarkPaid = async (id) => {
    try {
      await paymentService.markPaid(id, {
        payment_method: 'cash',
      });
      setMessage({ type: 'success', text: 'Payment marked as paid' });
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to mark payment' });
    }
  };

  const resetForm = () => {
    setFormData({
      customer: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      amount: '',
      payment_method: 'cash',
    });
    setShowModal(false);
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customer_details.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${payment.customer_details.first_name} ${payment.customer_details.last_name}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || payment.payment_status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading || pageLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-2xl font-bold text-blue-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container-custom">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Payments</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Record Payment
          </button>
        </div>

        {/* Message Alert */}
        {message.text && (
          <Alert
            type={message.type}
            message={message.text}
            onClose={() => setMessage({ type: '', text: '' })}
          />
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="late">Late</option>
          </select>
        </div>

        {/* Payments Table */}
        <div className="card">
          {filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Month/Year</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold">{payment.customer_details.email}</p>
                        <p className="text-sm text-gray-600">
                          {payment.customer_details.first_name} {payment.customer_details.last_name}
                        </p>
                      </td>
                      <td className="px-6 py-4">{payment.month_display} {payment.year}</td>
                      <td className="px-6 py-4 font-semibold">${payment.amount}</td>
                      <td className="px-6 py-4">
                        <StatusBadge status={payment.payment_status} />
                      </td>
                      <td className="px-6 py-4">
                        {new Date(payment.due_date).toLocaleDateString()}
                        {payment.is_overdue && (
                          <p className="text-xs text-red-600 font-semibold mt-1">Overdue</p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {payment.payment_status !== 'paid' && (
                          <button
                            onClick={() => handleMarkPaid(payment.id)}
                            className="flex items-center text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg transition text-sm"
                          >
                            <FiCheckCircle className="mr-1" /> Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No payments found</div>
          )}
        </div>
      </main>

      {/* Record Payment Modal */}
      <Modal
        isOpen={showModal}
        title="Record Payment"
        onClose={resetForm}
        onSubmit={handleSubmit}
        submitText="Record"
      >
        <div className="space-y-4">
          <select
            name="customer"
            value={formData.customer}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Select Customer</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.first_name} {customer.last_name} ({customer.email})
              </option>
            ))}
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="month"
              value={formData.month}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            name="payment_method"
            value={formData.payment_method}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="online">Online</option>
            <option value="cheque">Cheque</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
