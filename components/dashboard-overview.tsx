"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  Car,
  Wrench,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Activity,
} from "lucide-react";

export function DashboardOverview() {
  const [summaryData, setSummaryData] = useState({
    totalVehicles: 0,
    activeServices: 0,
    pendingServices: 0,
    completedThisMonth: 0,
  });

  const [serviceStatusData, setServiceStatusData] = useState<any[]>([]);
  const [monthlyServiceData, setMonthlyServiceData] = useState<any[]>([]);
  const [vehicleTypeData, setVehicleTypeData] = useState<any[]>([]);
  const [recentServices, setRecentServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch dashboard statistics
      const statsResponse = await fetch("/api/dashboard/stats");
      const statsData = await statsResponse.json();

      if (statsData.success) {
        const {
          summary,
          maintenancesByStatus,
          monthlyMaintenances,
          recentMaintenances,
          vehiclesByFuelType,
        } = statsData.data;

        // Update summary with actual status counts
        setSummaryData({
          totalVehicles: summary.totalVehicles || 0,
          activeServices: summary.inProgressServices || 0,
          pendingServices: summary.pendingServices || 0,
          completedThisMonth: summary.completedThisMonth || 0,
        });

        // Transform maintenance status for pie chart
        const statusData = maintenancesByStatus.map((item: any) => ({
          name:
            item.status === "completed"
              ? "Selesai"
              : item.status === "in-progress"
              ? "Dalam Proses"
              : "Menunggu",
          value: item._count.status,
          color:
            item.status === "completed"
              ? "#10b981"
              : item.status === "in-progress"
              ? "#f59e0b"
              : "#ef4444",
        }));
        setServiceStatusData(statusData.length > 0 ? statusData : []);

        // Transform vehicle types for bar chart
        const typeData = vehiclesByFuelType.map((item: any) => ({
          type: item.fuelType || "Unknown",
          count: item._count.fuelType,
        }));
        setVehicleTypeData(typeData.length > 0 ? typeData : []);

        // Transform recent maintenances
        const recent = recentMaintenances.map((m: any) => ({
          id: m.id,
          vehicle: `${m.vehicle.brand} ${m.vehicle.model} - ${m.vehicle.licensePlate}`,
          service: m.description,
          status: m.status || "pending",
          date: new Date(m.maintenanceDate).toLocaleDateString("id-ID"),
          cost: m.cost || 0,
        }));
        setRecentServices(recent);

        // Transform monthly maintenances (Group by Month)
        const monthlyDataMap = new Map<string, number>();
        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Ags",
          "Sep",
          "Okt",
          "Nov",
          "Des",
        ];

        // Initialize last 6 months with 0
        for (let i = 5; i >= 0; i--) {
          const d = new Date();
          d.setMonth(d.getMonth() - i);
          const monthKey = `${monthNames[d.getMonth()]}`;
          monthlyDataMap.set(monthKey, 0);
        }

        // Aggregate actual data
        if (monthlyMaintenances && Array.isArray(monthlyMaintenances)) {
          monthlyMaintenances.forEach((item: any) => {
            const date = new Date(item.maintenanceDate);
            const monthIndex = date.getMonth();
            const monthKey = monthNames[monthIndex];

            // Only update if this month is in our last 6 months range (simple check)
            if (monthlyDataMap.has(monthKey)) {
              const currentVal = monthlyDataMap.get(monthKey) || 0;
              monthlyDataMap.set(monthKey, currentVal + (item._count.id || 0));
            }
          });
        }

        const formattedMonthlyData = Array.from(monthlyDataMap.entries()).map(
          ([month, count]) => ({
            month,
            services: count,
          })
        );

        setMonthlyServiceData(formattedMonthlyData);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <Card className="relative overflow-hidden border border-gray-100 shadow-xl bg-white rounded-[2rem] group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-6">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Total Kendaraan
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Car className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6 pt-0">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {summaryData.totalVehicles}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full w-fit">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs font-medium text-green-700">
                Unit terdaftar
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-100 shadow-xl bg-white rounded-[2rem] group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-6">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Servis Aktif
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
              <Wrench className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6 pt-0">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {summaryData.activeServices}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 rounded-full w-fit">
              <Activity className="h-3 w-3 text-amber-600" />
              <p className="text-xs font-medium text-amber-700">Dalam proses</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-100 shadow-xl bg-white rounded-[2rem] group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-rose-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-6">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Menunggu Servis
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6 pt-0">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {summaryData.pendingServices}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full w-fit">
              <AlertTriangle className="h-3 w-3 text-red-600" />
              <p className="text-xs font-medium text-red-700">Perlu tindakan</p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden border border-gray-100 shadow-xl bg-white rounded-[2rem] group h-full">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 p-6">
            <CardTitle className="text-sm font-bold text-gray-600 uppercase tracking-wider">
              Selesai Bulan Ini
            </CardTitle>
            <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 p-6 pt-0">
            <div className="text-4xl font-extrabold text-gray-900 mb-2">
              {summaryData.completedThisMonth}
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 rounded-full w-fit">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <p className="text-xs font-medium text-green-700 text-nowrap">
                +12% growth
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Service Status Pie Chart */}
        <div className="h-full">
          <Card className="border border-gray-100 shadow-xl bg-white rounded-[2rem] h-full">
            <CardHeader className="pb-4 p-6">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>
                Status Servis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {serviceStatusData.length > 0 ? (
                <>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          cornerRadius={8}
                          stroke="none"
                        >
                          {serviceStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              strokeWidth={0}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid rgba(255,255,255,0.5)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                            padding: "10px",
                            fontWeight: "bold",
                          }}
                          itemStyle={{ color: "#374151" }}
                          cursor={{ fill: "transparent" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {serviceStatusData.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/50 rounded-full border border-gray-100 shadow-sm"
                      >
                        <div
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {item.name}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="h-72 flex items-center justify-center">
                  <div className="text-center">
                    <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 font-medium">
                      Belum ada data servis
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Monthly Services Line Chart */}
        <div className="h-full">
          <Card className="border border-gray-100 shadow-xl bg-white rounded-[2rem] h-full">
            <CardHeader className="pb-4 p-6">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                Tren Servis Bulanan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyServiceData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="rgba(0,0,0,0.05)"
                    />
                    <XAxis
                      dataKey="month"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }}
                    />
                    <Tooltip
                      cursor={{
                        stroke: "#3b82f6",
                        strokeWidth: 2,
                        strokeDasharray: "5 5",
                      }}
                      contentStyle={{
                        backgroundColor: "rgba(255, 255, 255, 0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.5)",
                        borderRadius: "16px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                        padding: "10px",
                        fontWeight: "bold",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="services"
                      stroke="#3b82f6"
                      strokeWidth={4}
                      dot={{
                        fill: "white",
                        stroke: "#3b82f6",
                        strokeWidth: 3,
                        r: 6,
                      }}
                      activeDot={{
                        r: 8,
                        stroke: "#3b82f6",
                        strokeWidth: 2,
                        fill: "white",
                        className: "animate-pulse",
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
        {/* Vehicle Types Bar Chart */}
        <div className="h-full">
          <Card className="border border-gray-100 shadow-xl bg-white rounded-[2rem] h-full">
            <CardHeader className="pb-4 p-6">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Car className="w-5 h-5 text-purple-600" />
                </div>
                Jenis Kendaraan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {vehicleTypeData.length > 0 ? (
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={vehicleTypeData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="rgba(0,0,0,0.05)"
                      />
                      <XAxis
                        dataKey="type"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#6b7280",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#6b7280",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(139, 92, 246, 0.1)", radius: 8 }}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.8)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255,255,255,0.5)",
                          borderRadius: "16px",
                          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                          padding: "10px",
                          fontWeight: "bold",
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="#8b5cf6"
                        radius={[8, 8, 8, 8]}
                        barSize={40}
                      >
                        {vehicleTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#8b5cf6", "#ec4899", "#3b82f6"][index % 3]}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-72 flex items-center justify-center">
                  <div className="text-center">
                    <Car className="h-12 w-12 text-gray-300 mx-auto mb-4 opacity-50" />
                    <p className="text-gray-500 font-medium">
                      Belum ada data kendaraan
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Services */}
        <div className="h-full">
          <Card className="border border-gray-100 shadow-xl bg-white rounded-[2rem] h-full">
            <CardHeader className="pb-4 p-6">
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-orange-600" />
                </div>
                Servis Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              {recentServices.length > 0 ? (
                <div className="space-y-3">
                  {recentServices.map((service, index) => (
                    <div
                      key={service.id}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/40 hover:bg-white/80 rounded-2xl transition-all duration-300 hover:shadow-lg border border-gray-100 gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 text-sm sm:text-base truncate">
                          {service.vehicle}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1 font-medium">
                          {service.service}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded-full w-fit">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                            <p className="text-[10px] text-gray-500 font-semibold">
                              {service.date}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-2">
                        <Badge
                          variant={
                            service.status === "completed"
                              ? "default"
                              : service.status === "in-progress"
                              ? "secondary"
                              : "destructive"
                          }
                          className={`text-xs px-3 py-1 uppercase tracking-wide font-bold shadow-sm ${
                            service.status === "completed"
                              ? "bg-green-100/80 text-green-700 border-green-200 hover:bg-green-200"
                              : service.status === "in-progress"
                              ? "bg-yellow-100/80 text-yellow-700 border-yellow-200 hover:bg-yellow-200"
                              : "bg-red-100/80 text-red-700 border-red-200 hover:bg-red-200"
                          }`}
                        >
                          {service.status === "completed"
                            ? "Selesai"
                            : service.status === "in-progress"
                            ? "Proses"
                            : "Menunggu"}
                        </Badge>
                        <p className="text-sm font-bold text-gray-900 bg-white/50 px-2 py-1 rounded-lg border border-white/50">
                          Rp {service.cost.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-4 opacity-50" />
                  <p className="text-gray-500 font-medium">
                    Belum ada riwayat servis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
