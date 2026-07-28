import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar, Modal, Alert } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { userService } from '@/lib/services';
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';

export default function Customers() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone_number: '',
    address: '',
    membership_type: 'monthly',
    status: 'active',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchCustomers();
    }
  }, [user, loading, router]);

  const fetchCustomers = async () => {
    try {
      setPageLoading(true);
      const response = await userService.getAll();
      setCustomers(response.data.results || response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
      setMessage({ type: 'error', text: 'Failed to load customers' });
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
      if (editingId) {
        await userService.update(editingId, formData);
        setMessage({ type: 'success', text: 'Customer updated successfully' });
      } else {
        await userService.create({
          ...formData,
          password: formData.password || 'defaultpassword123',
        });
        setMessage({ type: 'success', text: 'Customer added successfully' });
      }
      resetForm();
      fetchCustomers();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save customer' });
    }
  };

  const handleEdit = (customer) => {
    setFormData({
      username: customer.username,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      phone_number: customer.phone_number,
      address: customer.address,
      membership_type: customer.membership_type,
      status: customer.status,
    });
    setEditingId(customer.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await userService.delete(id);
        setMessage({ type: 'success', text: 'Customer deleted successfully' });
        fetchCustomers();
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete customer' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone_number: '',
      address: '',
      membership_type: 'monthly',
      status: 'active',
    });
    setEditingId(null);
    setShowModal(false);
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold">Customers</h1>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="btn-primary flex items-center"
          >
            <FiPlus className="mr-2" /> Add Customer
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

        {/* Search Bar */}
        <div className="mb-6 relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        {/* Customers Table */}
        <div className="card">
          {filteredCustomers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Membership</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">{customer.first_name} {customer.last_name}</td>
                      <td className="px-6 py-4">{customer.email}</td>
                      <td className="px-6 py-4">{customer.phone_number || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {customer.membership_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => handleEdit(customer)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No customers found</div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        title={editingId ? 'Edit Customer' : 'Add Customer'}
        onClose={resetForm}
        onSubmit={handleSubmit}
        submitText={editingId ? 'Update' : 'Add'}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <textarea
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleInputChange}
            rows="2"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            name="membership_type"
            value={formData.membership_type}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </Modal>
    </div>
  );
}
