"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Car,
  Loader2,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Helper to get current year dates
function getCurrentYearDates() {
  const currentYear = new Date().getFullYear();
  return {
    from: `${currentYear}-01-01`,
    to: `${currentYear}-12-31`,
  };
}

export function Reports() {
  // Get current year dates dynamically
  const currentYearDates = useMemo(() => getCurrentYearDates(), []);

  const [dateFrom, setDateFrom] = useState(currentYearDates.from);
  const [dateTo, setDateTo] = useState(currentYearDates.to);
  const [reportType, setReportType] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  // State for report data
  const [monthlyServiceCosts, setMonthlyServiceCosts] = useState<any[]>([]);
  const [serviceTypeDistribution, setServiceTypeDistribution] = useState<any[]>(
    []
  );
  const [vehicleServiceFrequency, setVehicleServiceFrequency] = useState<any[]>(
    []
  );

  const [totalServices, setTotalServices] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);

      // Fetch maintenances
      const response = await fetch("/api/maintenances");
      const data = await response.json();

      if (data.success && data.maintenances.length > 0) {
        const maintenances = data.maintenances;

        // Calculate totals
        const total = maintenances.length;
        const totalCostValue = maintenances.reduce(
          (sum: number, m: any) => sum + (m.cost || 0),
          0
        );

        setTotalServices(total);
        setTotalCost(totalCostValue);

        // Aggregate monthly data
        const monthlyData: {
          [key: string]: { cost: number; services: number };
        } = {};
        maintenances.forEach((m: any) => {
          const date = new Date(m.maintenanceDate);
          const monthKey = date.toLocaleDateString("id-ID", { month: "short" });

          if (!monthlyData[monthKey]) {
            monthlyData[monthKey] = { cost: 0, services: 0 };
          }
          monthlyData[monthKey].cost += m.cost || 0;
          monthlyData[monthKey].services += 1;
        });

        const monthlyArray = Object.entries(monthlyData).map(
          ([month, data]) => ({
            month,
            cost: data.cost,
            services: data.services,
          })
        );
        setMonthlyServiceCosts(monthlyArray);

        // Aggregate service type distribution
        const typeData: { [key: string]: { count: number; cost: number } } = {};
        const colors = [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
          "#06b6d4",
        ];

        maintenances.forEach((m: any) => {
          const type = m.type || "Lainnya";
          if (!typeData[type]) {
            typeData[type] = { count: 0, cost: 0 };
          }
          typeData[type].count += 1;
          typeData[type].cost += m.cost || 0;
        });

        const typeArray = Object.entries(typeData).map(
          ([type, data], index) => ({
            type,
            count: data.count,
            cost: data.cost,
            color: colors[index % colors.length],
          })
        );
        setServiceTypeDistribution(typeArray);

        // Aggregate vehicle frequency
        const vehicleData: {
          [key: string]: { services: number; cost: number; name: string };
        } = {};

        maintenances.forEach((m: any) => {
          const vehicleId = m.vehicleId;
          const vehicleName = `${m.vehicle.licensePlate} - ${m.vehicle.brand} ${m.vehicle.model}`;

          if (!vehicleData[vehicleId]) {
            vehicleData[vehicleId] = {
              services: 0,
              cost: 0,
              name: vehicleName,
            };
          }
          vehicleData[vehicleId].services += 1;
          vehicleData[vehicleId].cost += m.cost || 0;
        });

        const vehicleArray = Object.values(vehicleData).map((data) => ({
          vehicle: data.name,
          services: data.services,
          cost: data.cost,
        }));
        setVehicleServiceFrequency(vehicleArray);
      } else {
        // Empty state
        setTotalServices(0);
        setTotalCost(0);
        setMonthlyServiceCosts([]);
        setServiceTypeDistribution([]);
        setVehicleServiceFrequency([]);
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type: string) => {
    if (type === "pdf") {
      generatePDFReport();
    } else {
      toast.success(`Laporan ${type} berhasil diunduh!`, {
        description: `Periode: ${dateFrom} - ${dateTo}`,
      });
    }
  };

  // Generate PDF Report
  const generatePDFReport = async () => {
    try {
      setGeneratingPDF(true);

      // Create PDF document
      const doc = new jsPDF({ compress: true });
      const pageWidth = doc.internal.pageSize.getWidth();

      // Load logo
      const logoUrl = "/logo-bkn.png";
      try {
        const img = new Image();
        img.src = logoUrl;
        // Local image usually doesn't need crossOrigin if served from same origin,
        // but explicit empty string or Anonymous handles some edge cases in dev
        img.crossOrigin = "Anonymous";
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
        // Adjusted logo size and position for better proportion
        doc.addImage(img, "PNG", 14, 10, 20, 20, undefined, "FAST");
      } catch (e) {
        console.warn("Could not load logo", e);
      }

      // Header Text - Aligned with the new logo size
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      // Adjusted X position to be consistent with logo width + padding
      doc.text("PUSBANG SDM BKN", 40, 20);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN SERVIS KENDARAAN", 40, 28);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Periode: ${formatDate(dateFrom)} - ${formatDate(dateTo)}`,
        45,
        37
      );

      // Line Separator
      doc.setLineWidth(0.5);
      doc.line(14, 42, pageWidth - 14, 42);

      // Summary Title
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Ringkasan Laporan", 14, 55);

      // Summary Content with nice layout
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      // Layout summary in a grid-like structure without borders
      doc.text(`Total Servis:`, 14, 65);
      doc.setFont("helvetica", "bold");
      doc.text(`${totalServices}`, 60, 65);

      doc.setFont("helvetica", "normal");
      doc.text(`Total Biaya:`, 14, 72);
      doc.setFont("helvetica", "bold");
      doc.text(`Rp ${totalCost.toLocaleString("id-ID")}`, 60, 72);

      // Monthly Service Costs Table
      if (monthlyServiceCosts.length > 0) {
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Biaya Servis Bulanan", 14, 95);

        autoTable(doc, {
          startY: 100,
          head: [["Bulan", "Jumlah Servis", "Total Biaya"]],
          body: monthlyServiceCosts.map((item) => [
            item.month,
            item.services.toString(),
            `Rp ${item.cost.toLocaleString("id-ID")}`,
          ]),
          theme: "striped",
          headStyles: { fillColor: [124, 58, 237], textColor: 255 },
          styles: { fontSize: 10 },
        });
      }

      // Service Type Distribution Table
      if (serviceTypeDistribution.length > 0) {
        const finalY = (doc as any).lastAutoTable?.finalY || 100;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Distribusi Jenis Servis", 14, finalY + 15);

        autoTable(doc, {
          startY: finalY + 20,
          head: [["Jenis Servis", "Jumlah", "Total Biaya"]],
          body: serviceTypeDistribution.map((item) => [
            item.type,
            item.count.toString(),
            `Rp ${item.cost.toLocaleString("id-ID")}`,
          ]),
          theme: "striped",
          headStyles: { fillColor: [59, 130, 246], textColor: 255 },
          styles: { fontSize: 10 },
        });
      }

      // Add new page for Vehicle Service Frequency
      if (vehicleServiceFrequency.length > 0) {
        doc.addPage();

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Frekuensi Servis per Kendaraan", 14, 20);

        autoTable(doc, {
          startY: 25,
          head: [["Kendaraan", "Jumlah Servis", "Total Biaya", "Rata-rata"]],
          body: vehicleServiceFrequency.map((item) => [
            item.vehicle,
            item.services.toString(),
            `Rp ${item.cost.toLocaleString("id-ID")}`,
            `Rp ${(item.cost / item.services).toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}`,
          ]),
          theme: "striped",
          headStyles: { fillColor: [249, 115, 22], textColor: 255 },
          styles: { fontSize: 9 },
          columnStyles: { 0: { cellWidth: 70 } },
        });
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Halaman ${i} dari ${pageCount} | Digenerate pada ${new Date().toLocaleString(
            "id-ID"
          )}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `Laporan_Servis_${dateFrom}_${dateTo}.pdf`;
      doc.save(fileName);

      toast.success("Laporan PDF berhasil dibuat!", {
        description: `File: ${fileName}`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Gagal membuat laporan PDF");
    } finally {
      setGeneratingPDF(false);
    }
  };

  // Helper functions
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getReportTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      monthly: "Bulanan",
      quarterly: "Kuartalan",
      yearly: "Tahunan",
    };
    return labels[type] || type;
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
      },
    },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-600/90 to-indigo-600/90 backdrop-blur-xl p-8 text-white shadow-2xl shadow-purple-500/30 border border-white/20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2 tracking-tight">
            Laporan & Analisis
          </h1>
          <p className="text-purple-100/80 text-lg font-medium">
            Analisis mendalam dan laporan komprehensif servis kendaraan
          </p>
        </div>
      </div>

      {/* Filters */}
      <div>
        <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
            <CardTitle className="flex items-center gap-4 text-xl font-bold text-gray-900">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              Filter Laporan
            </CardTitle>
          </CardHeader>
          <CardContent className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="dateFrom"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Tanggal Mulai
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dateTo"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Tanggal Selesai
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="reportType"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Jenis Laporan
                </Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Bulanan</SelectItem>
                    <SelectItem value="quarterly">Kuartalan</SelectItem>
                    <SelectItem value="yearly">Tahunan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] rounded-xl h-11 text-white"
                  size="lg"
                  onClick={generatePDFReport}
                  disabled={generatingPDF || loading}
                >
                  {generatingPDF ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Membuat PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Laporan PDF
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Total Servis
              </CardTitle>
              <div className="p-2.5 bg-blue-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-6">
              <div className="text-3xl font-extrabold text-blue-900 mb-1">
                {totalServices}
              </div>
              <p className="text-xs font-semibold text-blue-600/80 flex items-center gap-1 bg-blue-50 w-fit px-2 py-1 rounded-lg">
                <TrendingUp className="h-3 w-3" />
                Periode ini
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
              <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                Total Biaya
              </CardTitle>
              <div className="p-2.5 bg-green-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 px-6 pb-6">
              <div className="text-3xl font-extrabold text-green-900 mb-1">
                Rp {totalCost.toLocaleString("id-ID")}
              </div>
              <p className="text-xs font-semibold text-green-600/80 flex items-center gap-1 bg-green-50 w-fit px-2 py-1 rounded-lg">
                {totalServices > 0 ? (
                  <>
                    <TrendingUp className="h-3 w-3" />
                    Total semua servis
                  </>
                ) : (
                  "Belum ada data"
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Report Tabs */}
      <div>
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center gap-2 py-2.5 font-semibold text-gray-600"
            >
              <LineChartIcon className="w-4 h-4" />
              Tren Biaya
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center gap-2 py-2.5 font-semibold text-gray-600"
            >
              <PieChartIcon className="w-4 h-4" />
              Jenis Servis
            </TabsTrigger>
            <TabsTrigger
              value="vehicles"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center gap-2 py-2.5 font-semibold text-gray-600"
            >
              <BarChart3 className="w-4 h-4" />
              Per Kendaraan
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="trends"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/20">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  Tren Biaya Servis Bulanan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyServiceCosts}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(0,0,0,0.05)"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="month"
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
                        tickFormatter={(value) =>
                          `${(value / 1000000).toFixed(0)}M`
                        }
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#6b7280",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        dx={-10}
                      />
                      <Tooltip
                        formatter={(value: number | undefined) => [
                          `Rp ${(value ?? 0).toLocaleString("id-ID")}`,
                          "Biaya",
                        ]}
                        labelFormatter={(label) => `Bulan: ${label}`}
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          backdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.5)",
                          borderRadius: "16px",
                          boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          padding: "12px 16px",
                        }}
                        itemStyle={{ color: "#4f46e5", fontWeight: 600 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="cost"
                        stroke="url(#colorGradient)"
                        strokeWidth={4}
                        dot={{
                          fill: "white",
                          stroke: "#8b5cf6",
                          strokeWidth: 3,
                          r: 6,
                        }}
                        activeDot={{
                          r: 8,
                          stroke: "#8b5cf6",
                          strokeWidth: 0,
                          fill: "#8b5cf6",
                        }}
                        animationDuration={1500}
                      />
                      <defs>
                        <linearGradient
                          id="colorGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="0"
                        >
                          <stop offset="0%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#4f46e5" />
                        </linearGradient>
                      </defs>
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent
            value="services"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg shadow-blue-500/20">
                      <PieChartIcon className="w-5 h-5 text-white" />
                    </div>
                    Distribusi Jenis Servis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={serviceTypeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={130}
                          paddingAngle={4}
                          dataKey="count"
                          cornerRadius={6}
                        >
                          {serviceTypeDistribution.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                          itemStyle={{ fontWeight: 600 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    {serviceTypeDistribution.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-colors duration-200 border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-3 h-3 rounded-full shadow-sm"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="font-medium text-gray-700 text-sm">
                            {item.type}
                          </span>
                        </div>
                        <span className="font-bold text-gray-900 text-sm">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
                <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg shadow-green-500/20">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    Biaya per Jenis Servis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={serviceTypeDistribution}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(0,0,0,0.05)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="type"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#6b7280",
                            fontSize: 11,
                            fontWeight: 500,
                          }}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            `${(value / 1000000).toFixed(0)}M`
                          }
                          axisLine={false}
                          tickLine={false}
                          tick={{
                            fill: "#6b7280",
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        />
                        <Tooltip
                          formatter={(value: number | undefined) => [
                            `Rp ${(value ?? 0).toLocaleString("id-ID")}`,
                            "Total Biaya",
                          ]}
                          contentStyle={{
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            backdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.5)",
                            borderRadius: "16px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                          }}
                          cursor={{ fill: "rgba(0,0,0,0.05)", radius: 8 }}
                        />
                        <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
                          {serviceTypeDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent
            value="vehicles"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/20">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  Frekuensi Servis per Kendaraan
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                        <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs pl-8 py-5">
                          Kendaraan
                        </TableHead>
                        <TableHead className="text-center font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                          Jumlah Servis
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                          Total Biaya
                        </TableHead>
                        <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs pr-8 py-5">
                          Rata-rata per Servis
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {vehicleServiceFrequency.map((vehicle, index) => (
                        <tr
                          key={index}
                          className="hover:bg-orange-50/50 transition-all duration-200 border-gray-100"
                        >
                          <TableCell className="font-bold text-gray-900 pl-8">
                            {vehicle.vehicle}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className="font-bold bg-white border-gray-200 shadow-sm"
                            >
                              {vehicle.services}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-semibold text-gray-900">
                            Rp {vehicle.cost.toLocaleString("id-ID")}
                          </TableCell>
                          <TableCell className="text-right font-bold text-orange-600 pr-8">
                            Rp{" "}
                            {(vehicle.cost / vehicle.services).toLocaleString(
                              "id-ID"
                            )}
                          </TableCell>
                        </tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
