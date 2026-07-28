import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Navbar, StatCard, Pagination } from '@/components';
import { useAuth } from '@/context/AuthContext';
import { dashboardService, paymentService } from '@/lib/services';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiCreditCard, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';

const COLORS = ['#3b82f6', '#ef4444', '#f97316', '#10b981'];

export default function Dashboard() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);
  const [recentPayments, setRecentPayments] = useState([]);
  const [newMembers, setNewMembers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      fetchDashboardData();
    }
  }, [user, loading, router]);

  const fetchDashboardData = async () => {
    try {
      setPageLoading(true);
      const [statsRes, revenueRes, breakdownRes, recentRes, newRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRevenueStats(),
        dashboardService.getPaymentStatusBreakdown(),
        dashboardService.getRecentPayments(),
        dashboardService.getNewMembers(),
      ]);

      setStats(statsRes.data);
      setRevenueData(revenueRes.data.monthly_revenue || []);
      setPaymentBreakdown(breakdownRes.data || []);
      setRecentPayments(recentRes.data || []);
      setNewMembers(newRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setPageLoading(false);
    }
  };

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user.first_name}! 👋</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your gym today</p>
        </div>

        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Customers"
              value={stats.total_customers}
              icon={FiUsers}
              color="blue"
            />
            <StatCard
              title="Active Members"
              value={stats.active_members}
              icon={FiTrendingUp}
              color="green"
            />
            <StatCard
              title="Unpaid Payments"
              value={stats.total_unpaid}
              icon={FiCreditCard}
              color="orange"
            />
            <StatCard
              title="Overdue Payments"
              value={stats.overdue_payments}
              icon={FiAlertCircle}
              color="red"
            />
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue Chart */}
          {revenueData.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Payment Status Pie Chart */}
          {paymentBreakdown.length > 0 && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Payment Status Breakdown</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentBreakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                  >
                    {paymentBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Payments Table */}
          {recentPayments.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Recent Payments</h3>
                <Link href="/payments" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-2 text-left">Customer</th>
                      <th className="px-4 py-2 text-left">Amount</th>
                      <th className="px-4 py-2 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{payment.customer_details.email}</td>
                        <td className="px-4 py-2 font-semibold">${payment.amount}</td>
                        <td className="px-4 py-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.payment_status === 'paid'
                              ? 'bg-green-100 text-green-800'
                              : payment.payment_status === 'unpaid'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {payment.payment_status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* New Members */}
          {newMembers.length > 0 && (
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">New Members (Last 30 Days)</h3>
                <Link href="/customers" className="text-blue-600 hover:text-blue-800 text-sm">
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {newMembers.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold">{member.first_name} {member.last_name}</p>
                      <p className="text-xs text-gray-600">{member.email}</p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {member.membership_type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
