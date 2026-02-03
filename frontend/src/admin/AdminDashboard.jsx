import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Link } from "react-router-dom";
import { FaUsers, FaFileContract, FaMoneyBillWave, FaCalendarAlt, FaChartLine, FaSync } from "react-icons/fa";

const COLORS = ["#2563eb", "#16a34a", "#9333ea", "#f59e0b", "#dc2626", "#4f46e5"];

const Dashboard = () => {
  const [agreements, setAgreements] = useState([]);
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPersons: 0,
    todayAgreements: 0,
    weekAgreements: 0,
    monthAgreements: 0,
    totalFee: 0,
  });
  const [dateFilter, setDateFilter] = useState("all"); // all, today, week, month

  useEffect(() => {
    fetchDashboardData();
  }, [dateFilter]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [agreementsRes, personsRes] = await Promise.all([
        axios.get(`/api/agreements?filter=${dateFilter}`),
        axios.get("/api/persons"),
      ]);
      
      setAgreements(agreementsRes.data);
      setPersons(personsRes.data);
      calculateStats(agreementsRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (agreementList) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const todayCount = agreementList.filter(a => 
      new Date(a.agreementDate) >= today
    ).length;

    const weekCount = agreementList.filter(a => 
      new Date(a.agreementDate) >= weekAgo
    ).length;

    const monthCount = agreementList.filter(a => 
      new Date(a.agreementDate) >= monthAgo
    ).length;

    const totalFee = agreementList.reduce(
      (sum, a) => sum + Number(a.officeFee || 0),
      0
    );

    setStats({
      totalPersons: persons.length,
      todayAgreements: todayCount,
      weekAgreements: weekCount,
      monthAgreements: monthCount,
      totalFee,
    });
  };

  // ===== HELPERS =====
  const countByService = (service) =>
    agreements.filter((a) => a.service === service).length;

  // ===== CHART DATA =====
  const serviceData = [
    { name: "Wareejin", value: countByService("Wareejin") },
    { name: "Wakaalad", value: countByService("Wakaalad") },
    { name: "Daamaanad", value: countByService("Daamaanad") },
    { name: "Cedeyn", value: countByService("Cedeyn") },
    { name: "Rahan", value: countByService("Rahan") },
    { name: "Heshiishyo", value: countByService("Heshiishyo") },
  ];

  const feeLineData = agreements
    .slice()
    .sort((a, b) => new Date(a.agreementDate) - new Date(b.agreementDate))
    .map((a) => ({
      date: new Date(a.agreementDate).toLocaleDateString(),
      fee: Number(a.officeFee || 0),
      type: a.service,
    }))
    .slice(-10); // Last 10 entries

  const monthlyData = agreements.reduce((acc, agreement) => {
    const date = new Date(agreement.agreementDate);
    const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { month: monthYear, agreements: 0, fees: 0 };
    }
    
    acc[monthYear].agreements += 1;
    acc[monthYear].fees += Number(agreement.officeFee || 0);
    
    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData).slice(-6); // Last 6 months

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <FaChartLine className="text-blue-600" />
          Dashboard Overview
        </h2>
     
      </div>

     

      {/* ===== SERVICE STATS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <ServiceStat title="Wareejin" value={countByService("Wareejin")} color="blue" />
        <ServiceStat title="Wakaalad" value={countByService("Wakaalad")} color="green" />
        <ServiceStat title="Daamaanad" value={countByService("Daamaanad")} color="purple" />
        <ServiceStat title="Cedeyn" value={countByService("Cedeyn")} color="amber" />
        <ServiceStat title="Rahan" value={countByService("Rahan")} color="red" />
        <ServiceStat title="Heshiishyo" value={countByService("Heshiishyo")} color="indigo" />
        <ServiceStat title="Total Revenue" value={`$${stats.totalFee.toLocaleString()}`}  icon={<FaFileContract className="text-2xl" />} color="green" />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BAR CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            Agreements by Service
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={serviceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar 
                dataKey="value" 
                fill="#2563eb" 
                radius={[6, 6, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-green-600">🥧</span>
            Service Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData.filter(d => d.value > 0)}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {serviceData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== TREND CHARTS ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LINE CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-purple-600">📈</span>
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={feeLineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Fee']} />
              <Legend />
              <Line
                type="monotone"
                dataKey="fee"
                stroke="#9333ea"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AREA CHART */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span className="text-amber-600">📅</span>
            Monthly Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'fees' ? `$${value}` : value,
                  name === 'fees' ? 'Fees' : 'Agreements'
                ]}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="agreements"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
              />
              <Area
                type="monotone"
                dataKey="fees"
                stroke="#dc2626"
                fill="#dc2626"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== QUICK ACTIONS & LATEST ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg mb-4">⚡ Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/reception"
              className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              New reception
            </Link>
          
            <Link
              to="/agreement"
              className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              View All Agreements
            </Link>
            <Link
              to="/Reports"
              className="bg-amber-600 text-white p-4 rounded-lg hover:bg-amber-700 transition-colors text-center"
            >
               Reports
            </Link>
          </div>
        </div>

        {/* LATEST AGREEMENTS */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">📋 Latest Agreements</h3>
            <Link
              to="/agreements"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              View All →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ref No</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fee</th>
                  <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agreements.slice(0, 5).map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-900">
                      <Link to={`/agreement/${a._id}`} className="hover:text-blue-600">
                        {a.refNo}
                      </Link>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        a.service === "Wareejin" ? "bg-blue-100 text-blue-800" :
                        a.service === "Wakaalad" ? "bg-green-100 text-green-800" :
                        a.service === "Daamaanad" ? "bg-purple-100 text-purple-800" :
                        "bg-gray-100 text-gray-800"
                      }`}>
                        {a.service}
                      </span>
                    </td>
                    <td className="p-3 font-medium">${a.officeFee || 0}</td>
                    <td className="p-3 text-gray-500">
                      {new Date(a.agreementDate).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

     
    </div>
  );
};

/* ===== STAT CARD ===== */
const StatCard = ({ title, value, icon, color, description }) => {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    green: "bg-green-50 border-green-200 text-green-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    amber: "bg-amber-50 border-amber-200 text-amber-600",
  };

  return (
    <div className={`rounded-xl border p-6 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-white">
          {icon}
        </div>
      </div>
      <p className="text-sm opacity-70">{description}</p>
    </div>
  );
};

/* ===== SERVICE STAT ===== */
const ServiceStat = ({ title, value, color }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    purple: "text-purple-600 bg-purple-50",
    amber: "text-amber-600 bg-amber-50",
    red: "text-red-600 bg-red-50",
    indigo: "text-indigo-600 bg-indigo-50",
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 text-center">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className={`text-2xl font-bold ${colors[color]}`}>
        {value}
      </p>
    </div>
  );
};

export default Dashboard;