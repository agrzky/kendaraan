"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Badge } from "@/components/ui/badge";

import {
  Plus,
  Search,
  Eye,
  Wrench,
  Filter,
  Clock,
  CheckCircle2,
  Trash2,
} from "lucide-react";

interface ServiceRecord {
  id: string;
  vehicleId: string;
  vehiclePlate: string;
  vehicleName: string;
  serviceType: string;
  description: string;
  cost: number;
  status: "pending" | "in-progress" | "completed";
  serviceDate: string;
  completedDate?: string;
  technician: string;
  receipt?: string;
  notes?: string;
}

interface Vehicle {
  id: string;
  plate: string;
  name: string;
}

export function ServiceHistory() {
  const [serviceRecords, setServiceRecords] = useState<ServiceRecord[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<ServiceRecord | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<ServiceRecord | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: "",
    serviceType: "",
    description: "",
    cost: "",
    serviceDate: "",
    technician: "",
    notes: "",
  });

  // Fetch data from API
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch vehicles
      const vehiclesResponse = await fetch("/api/vehicles");
      const vehiclesData = await vehiclesResponse.json();

      if (vehiclesData.success) {
        const vehiclesList = vehiclesData.vehicles.map((v: any) => ({
          id: v.id,
          plate: v.licensePlate,
          name: `${v.brand} ${v.model}`,
        }));
        setVehicles(vehiclesList);
      }

      // Fetch maintenances
      const maintenancesResponse = await fetch("/api/maintenances");
      const maintenancesData = await maintenancesResponse.json();

      if (maintenancesData.success) {
        const records = maintenancesData.maintenances.map((m: any) => ({
          id: m.id,
          vehicleId: m.vehicleId,
          vehiclePlate: m.vehicle.licensePlate,
          vehicleName: `${m.vehicle.brand} ${m.vehicle.model}`,
          serviceType: m.type,
          description: m.description,
          cost: m.cost || 0,
          status: m.status || "pending", // Use status from database
          serviceDate: new Date(m.maintenanceDate).toISOString().split("T")[0],
          technician: m.technician || "-",
          notes: m.notes || "",
        }));
        setServiceRecords(records);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecords = serviceRecords.filter((record) => {
    const matchesSearch =
      record.vehiclePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.technician.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      vehicleId: "",
      serviceType: "",
      description: "",
      cost: "",
      serviceDate: "",
      technician: "",
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedVehicle = vehicles.find((v) => v.id === formData.vehicleId);
    if (!selectedVehicle) {
      toast.error("Pilih kendaraan terlebih dahulu");
      return;
    }

    const parsedCost = Number.parseFloat(formData.cost);

    // Validate cost
    if (Number.isNaN(parsedCost) || parsedCost <= 0) {
      toast.error("Biaya servis harus berupa angka positif");
      return;
    }

    try {
      // Send to API
      const response = await fetch("/api/maintenances", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicleId: formData.vehicleId,
          type: formData.serviceType,
          description: formData.description,
          cost: parsedCost,
          maintenanceDate: formData.serviceDate,
          technician: formData.technician,
          notes: formData.notes,
        }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data from database
        resetForm();
        setIsAddDialogOpen(false);
        toast.success("Riwayat servis berhasil ditambahkan!", {
          description: `${selectedVehicle.name} - ${formData.serviceType}`,
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menambahkan riwayat servis");
      }
    } catch (error) {
      console.error("Error saving service record:", error);
      toast.error("Terjadi kesalahan saat menyimpan data");
    }
  };

  const updateServiceStatus = async (
    id: string,
    status: ServiceRecord["status"]
  ) => {
    try {
      const response = await fetch(`/api/maintenances/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchData(); // Refresh data from database
        toast.success("Status servis berhasil diupdate!");
      } else {
        toast.error("Gagal mengupdate status servis");
      }
    } catch (error) {
      console.error("Error updating service status:", error);
      toast.error("Terjadi kesalahan saat mengupdate status");
    }
  };

  const confirmDelete = (record: ServiceRecord) => {
    setRecordToDelete(record);
    setDeleteDialogOpen(true);
  };

  const handleDeleteService = async () => {
    if (!recordToDelete) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/maintenances/${recordToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchData(); // Refresh data from database
        toast.success("Riwayat servis berhasil dihapus!", {
          description: `${recordToDelete.vehiclePlate} - ${recordToDelete.serviceType}`,
        });
      } else {
        const error = await response.json();
        toast.error(error.error || "Gagal menghapus riwayat servis");
      }
    } catch (error) {
      console.error("Error deleting service record:", error);
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setRecordToDelete(null);
    }
  };

  const getStatusBadge = (status: ServiceRecord["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Selesai</Badge>;
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Dalam Proses</Badge>
        );
      case "pending":
        return <Badge className="bg-red-100 text-red-800">Menunggu</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
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
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-emerald-600/90 to-teal-600/90 backdrop-blur-xl p-8 text-white shadow-2xl shadow-emerald-500/30 border border-white/20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              Riwayat Servis
            </h1>
            <p className="text-emerald-100/80 text-lg font-medium">
              Kelola dan pantau riwayat servis kendaraan operasional
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-white/20 text-white hover:bg-white/30 border border-gray-100 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-xl h-12 px-6"
                size="lg"
                onClick={resetForm}
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Servis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg border-0 shadow-2xl bg-white/90 backdrop-blur-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  Tambah Riwayat Servis Baru
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Masukkan data servis kendaraan dengan lengkap
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="space-y-5 max-h-[75vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="vehicle"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Kendaraan
                  </Label>
                  <Select
                    value={formData.vehicleId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, vehicleId: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50 h-11">
                      <SelectValue placeholder="Pilih kendaraan" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map((vehicle) => (
                        <SelectItem key={vehicle.id} value={vehicle.id}>
                          {vehicle.plate} - {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="serviceType"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Jenis Servis
                  </Label>
                  <Select
                    value={formData.serviceType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, serviceType: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50 h-11">
                      <SelectValue placeholder="Pilih jenis servis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ganti Oli & Filter">
                        Ganti Oli & Filter
                      </SelectItem>
                      <SelectItem value="Service Berkala">
                        Service Berkala
                      </SelectItem>
                      <SelectItem value="Perbaikan Mesin">
                        Perbaikan Mesin
                      </SelectItem>
                      <SelectItem value="Perbaikan AC">Perbaikan AC</SelectItem>
                      <SelectItem value="Ganti Ban">Ganti Ban</SelectItem>
                      <SelectItem value="Perbaikan Rem">
                        Perbaikan Rem
                      </SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Deskripsi
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Deskripsi detail servis yang dilakukan"
                    className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50 min-h-[80px]"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="cost"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Biaya (Rp)
                    </Label>
                    <Input
                      id="cost"
                      type="number"
                      value={formData.cost}
                      onChange={(e) =>
                        setFormData({ ...formData, cost: e.target.value })
                      }
                      placeholder="0"
                      min="0"
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="serviceDate"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Tanggal Servis
                    </Label>
                    <Input
                      id="serviceDate"
                      type="date"
                      value={formData.serviceDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          serviceDate: e.target.value,
                        })
                      }
                      className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="technician"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Teknisi
                  </Label>
                  <Input
                    id="technician"
                    value={formData.technician}
                    onChange={(e) =>
                      setFormData({ ...formData, technician: e.target.value })
                    }
                    placeholder="Nama teknisi yang menangani"
                    className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Catatan
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Catatan tambahan (opsional)"
                    className="rounded-xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-white/50"
                  />
                </div>

                <div className="flex gap-3 pt-6">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl h-11 shadow-lg shadow-emerald-500/25"
                    size="lg"
                  >
                    Simpan
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1 rounded-xl h-11 border-gray-200 hover:bg-gray-50"
                    size="lg"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="relative group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
            <Input
              placeholder="Cari berdasarkan kendaraan, jenis servis, atau teknisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 border-0 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-emerald-500/20 transition-all text-base"
            />
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white rounded-[2rem]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Filter className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-sm font-bold text-emerald-900">
                  Filter Status
                </span>
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-0 bg-white/50 rounded-xl h-10 focus:ring-emerald-500/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Menunggu</SelectItem>
                <SelectItem value="in-progress">Dalam Proses</SelectItem>
                <SelectItem value="completed">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Total Servis
                  </p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">
                    {filteredRecords.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-2xl">
                  <Wrench className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Dalam Proses
                  </p>
                  <p className="text-3xl font-extrabold text-amber-900 mt-1">
                    {
                      filteredRecords.filter((r) => r.status === "in-progress")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-amber-100 rounded-2xl">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                    Selesai
                  </p>
                  <p className="text-3xl font-extrabold text-green-900 mt-1">
                    {
                      filteredRecords.filter((r) => r.status === "completed")
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-2xl">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Records */}
      <div>
        <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
          <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
            <CardTitle className="flex items-center gap-4 text-xl font-bold text-gray-900">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/20">
                <Wrench className="w-5 h-5 text-white" />
              </div>
              Daftar Riwayat Servis
              <Badge
                variant="secondary"
                className="ml-auto bg-white/50 text-gray-600 backdrop-blur-sm border border-white/50 px-4 py-1.5 rounded-full text-sm"
              >
                {filteredRecords.length} servis
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs pl-8 py-5">
                      ID Servis
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Kendaraan
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Jenis Servis
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Teknisi
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Tanggal
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Biaya
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Catatan
                    </TableHead>
                    <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                      Status
                    </TableHead>
                    <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs pr-8 py-5">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, index) => (
                    <tr
                      key={record.id}
                      className="hover:bg-emerald-50/50 transition-all duration-200 group border-gray-100"
                    >
                      <TableCell className="font-bold text-emerald-900 pl-8">
                        <span className="font-mono text-xs bg-emerald-100/50 px-2 py-1 rounded-md">
                          #{record.id.substring(0, 8)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-200">
                            {record.vehiclePlate}
                          </p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                            {record.vehicleName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-semibold bg-white border-gray-200"
                        >
                          {record.serviceType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium">
                        {record.technician}
                      </TableCell>
                      <TableCell className="text-gray-600 font-medium whitespace-nowrap">
                        {record.serviceDate}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-600">
                        Rp {record.cost.toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p
                          className="text-sm text-gray-500 truncate"
                          title={record.notes}
                        >
                          {record.notes || "-"}
                        </p>
                      </TableCell>
                      <TableCell>{getStatusBadge(record.status)}</TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                            className="bg-emerald-50 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg w-8 h-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDelete(record)}
                            className="bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg w-8 h-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          {record.status !== "completed" && (
                            <Select
                              value={record.status}
                              onValueChange={(value: ServiceRecord["status"]) =>
                                updateServiceStatus(record.id, value)
                              }
                            >
                              <SelectTrigger className="w-8 h-8 p-0 border-0 bg-transparent hover:bg-gray-100 rounded-lg">
                                <Wrench className="w-4 h-4 text-gray-500" />
                              </SelectTrigger>
                              <SelectContent align="end">
                                <SelectItem value="pending">
                                  Menunggu
                                </SelectItem>
                                <SelectItem value="in-progress">
                                  Proses
                                </SelectItem>
                                <SelectItem value="completed">
                                  Selesai
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </TableCell>
                    </tr>
                  ))}
                </TableBody>
              </Table>
            </div>
            {filteredRecords.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg font-medium">
                  {searchTerm || statusFilter !== "all"
                    ? "Tidak ada data yang ditemukan"
                    : "Belum ada riwayat servis"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Service Detail Dialog */}
      {selectedRecord && (
        <Dialog
          open={!!selectedRecord}
          onOpenChange={() => setSelectedRecord(null)}
        >
          <DialogContent className="max-w-2xl border-0 shadow-2xl bg-white/95 backdrop-blur-2xl rounded-[2rem]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                Detail Servis
                <span className="ml-2 font-mono text-sm bg-gray-100 px-2 py-1 rounded-md text-gray-500 font-normal">
                  #{selectedRecord.id.substring(0, 8)}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Kendaraan
                  </Label>
                  <p className="text-base font-semibold text-gray-900 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    {selectedRecord.vehiclePlate} <br />
                    <span className="text-sm font-normal text-gray-500">
                      {selectedRecord.vehicleName}
                    </span>
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Jenis Servis
                  </Label>
                  <p className="text-base font-medium text-gray-900 bg-gray-50/50 p-3 rounded-xl border border-gray-100 flex items-center h-[72px]">
                    {selectedRecord.serviceType}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Teknisi
                  </Label>
                  <p className="text-base font-medium text-gray-900 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    {selectedRecord.technician}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </Label>
                  <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100 h-[50px] flex items-center">
                    {getStatusBadge(selectedRecord.status)}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Tanggal Servis
                  </Label>
                  <p className="text-base font-medium text-gray-900 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                    {selectedRecord.serviceDate}
                  </p>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Biaya
                  </Label>
                  <p className="text-xl font-bold text-emerald-600 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100">
                    Rp {selectedRecord.cost.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="space-y-1 col-span-2">
                  <Label className="text-sm font-semibold text-gray-600">
                    Catatan
                  </Label>
                  <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-base text-gray-900">
                      {selectedRecord.notes || "-"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-600">
                  Deskripsi
                </Label>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-base text-gray-900">
                    {selectedRecord.description}
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Hapus Riwayat Servis?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus riwayat servis ini?
              {recordToDelete && (
                <span className="block mt-2 font-semibold text-gray-800">
                  {recordToDelete.vehiclePlate} - {recordToDelete.serviceType}
                </span>
              )}
              <span className="block mt-2 text-sm text-amber-600">
                Tindakan ini tidak dapat dibatalkan. Data kendaraan tidak akan
                terhapus.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl" disabled={isDeleting}>
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteService}
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl"
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
