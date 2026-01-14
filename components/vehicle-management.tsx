"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, Search, Edit, Trash2, Car, BarChart3 } from "lucide-react";

interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  year: number;
  type: string;
  status: "active" | "maintenance" | "inactive";
  lastService: string;
  nextService: string;
  lastServiceKm?: number;
  nextServiceKm?: number;
  taxExpireDate?: string;
}

const formatKm = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) return "-";
  try {
    return `${value.toLocaleString("id-ID")} km`;
  } catch {
    return `${value} km`;
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

const getTaxStatus = (expireDate?: string) => {
  if (!expireDate)
    return { label: "Belum diisi", color: "bg-gray-100 text-gray-800" };

  const today = new Date();
  const expire = new Date(expireDate);
  const daysUntilExpiry = Math.floor(
    (expire.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0) {
    return { label: "Expired", color: "bg-red-100 text-red-800" };
  } else if (daysUntilExpiry <= 30) {
    return { label: "Akan Expired", color: "bg-yellow-100 text-yellow-800" };
  } else {
    return { label: "Aktif", color: "bg-green-100 text-green-800" };
  }
};

export function VehicleManagement() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteVehicle, setDeleteVehicle] = useState<Vehicle | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    licensePlate: "",
    brand: "",
    model: "",
    year: "",
    type: "",
    status: "active" as Vehicle["status"],
    lastService: "",
    nextService: "",
    lastServiceKm: "",
    nextServiceKm: "",
    taxExpireDate: "",
  });

  // Fetch vehicles from API
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/vehicles");
      const data = await response.json();

      if (data.success) {
        // Transform data from database to match component interface
        const transformedVehicles = data.vehicles.map((v: any) => ({
          id: v.id,
          licensePlate: v.licensePlate,
          brand: v.brand,
          model: v.model,
          year: v.year,
          type: v.fuelType || "MPV",
          status: v.status,
          lastService: v.lastServiceDate
            ? new Date(v.lastServiceDate).toISOString().split("T")[0]
            : "",
          nextService: v.nextServiceDate
            ? new Date(v.nextServiceDate).toISOString().split("T")[0]
            : "",
          lastServiceKm: v.lastServiceKm || 0,
          nextServiceKm: v.nextServiceKm || 0,
          taxExpireDate: v.taxExpireDate
            ? new Date(v.taxExpireDate).toISOString().split("T")[0]
            : "",
        }));
        setVehicles(transformedVehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      licensePlate: "",
      brand: "",
      model: "",
      year: "",
      type: "",
      status: "active",
      lastService: "",
      nextService: "",
      lastServiceKm: "",
      nextServiceKm: "",
      taxExpireDate: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedYear = Number.parseInt(formData.year, 10);
    const parsedLastKm = formData.lastServiceKm
      ? Number.parseInt(formData.lastServiceKm, 10)
      : undefined;
    const parsedNextKm = formData.nextServiceKm
      ? Number.parseInt(formData.nextServiceKm, 10)
      : undefined;

    // Validate parsed values
    if (
      Number.isNaN(parsedYear) ||
      parsedYear < 1990 ||
      parsedYear > new Date().getFullYear() + 1
    ) {
      alert("Tahun kendaraan tidak valid");
      return;
    }

    if (
      parsedLastKm !== undefined &&
      (Number.isNaN(parsedLastKm) || parsedLastKm < 0)
    ) {
      alert("Kilometer servis terakhir tidak valid");
      return;
    }

    if (
      parsedNextKm !== undefined &&
      (Number.isNaN(parsedNextKm) || parsedNextKm < 0)
    ) {
      alert("Kilometer servis berikutnya tidak valid");
      return;
    }

    try {
      if (editingVehicle) {
        // Update existing vehicle
        const response = await fetch(`/api/vehicles/${editingVehicle.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            licensePlate: formData.licensePlate,
            brand: formData.brand,
            model: formData.model,
            year: parsedYear,
            fuelType: formData.type, // Map 'type' to 'fuelType' for database
            status: formData.status,
            lastServiceDate: formData.lastService,
            nextServiceDate: formData.nextService,
            lastServiceKm: parsedLastKm,
            nextServiceKm: parsedNextKm,
            taxExpireDate: formData.taxExpireDate,
          }),
        });

        if (response.ok) {
          await fetchVehicles(); // Refresh list
          setEditingVehicle(null);
          toast.success("Kendaraan berhasil diupdate!");
        } else {
          toast.error("Gagal mengupdate kendaraan");
        }
      } else {
        // Get user ID from localStorage
        let ownerId = "";
        try {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const user = JSON.parse(userStr);
            ownerId = user.id;
          }
        } catch (e) {
          console.error("Error getting user from localStorage:", e);
        }

        if (!ownerId) {
          // Fallback: Try to get user from /api/auth/me API
          try {
            const authResponse = await fetch("/api/auth/me");
            if (authResponse.ok) {
              const authData = await authResponse.json();
              if (authData.authenticated && authData.user) {
                ownerId = authData.user.id;
                // Update localStorage to prevent future API calls
                localStorage.setItem("user", JSON.stringify(authData.user));
              }
            }
          } catch (e) {
            console.error("Error fetching user from API:", e);
          }

          if (!ownerId) {
            toast.error("Sesi tidak valid", {
              description: "Silakan login ulang untuk menambah kendaraan.",
            });
            setIsAddDialogOpen(false);
            // Optional: redirect to login
            // window.location.href = "/";
            return;
          }
        }

        // Create new vehicle
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            year: parsedYear,
            lastServiceKm: parsedLastKm,
            nextServiceKm: parsedNextKm,
            ownerId: ownerId,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          await fetchVehicles(); // Refresh list
          toast.success("Kendaraan berhasil ditambahkan!", {
            description: `${formData.brand} ${formData.model} - ${formData.licensePlate}`,
          });
        } else {
          console.error("API Error:", result);
          toast.error("Gagal menambah kendaraan", {
            description: result.details || result.error || "Terjadi kesalahan",
          });
        }
      }

      resetForm();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      toast.error("Terjadi kesalahan saat menyimpan data");
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      licensePlate: vehicle.licensePlate,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year.toString(),
      type: vehicle.type,
      status: vehicle.status,
      lastService: vehicle.lastService,
      nextService: vehicle.nextService,
      lastServiceKm: vehicle.lastServiceKm?.toString() ?? "",
      nextServiceKm: vehicle.nextServiceKm?.toString() ?? "",
      taxExpireDate: vehicle.taxExpireDate ?? "",
    });
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setDeleteVehicle(vehicle);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteVehicle) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/vehicles/${deleteVehicle.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchVehicles(); // Refresh list
        toast.success("Kendaraan berhasil dihapus", {
          description: `${deleteVehicle.brand} ${deleteVehicle.model} - ${deleteVehicle.licensePlate}`,
        });
      } else {
        toast.error("Gagal menghapus kendaraan");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      toast.error("Terjadi kesalahan saat menghapus data");
    } finally {
      setIsDeleting(false);
      setDeleteVehicle(null);
    }
  };

  function getStatusBadge(status: Vehicle["status"]) {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Aktif</Badge>;
      case "maintenance":
        return (
          <Badge className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
        );
      case "inactive":
        return <Badge className="bg-red-100 text-red-800">Tidak Aktif</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-blue-600/90 to-indigo-600/90 backdrop-blur-xl p-8 text-white shadow-2xl shadow-blue-500/30 border border-white/20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/20 rounded-full blur-3xl animate-pulse" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 tracking-tight">
              Data Kendaraan
            </h1>
            <p className="text-blue-100/80 text-lg font-medium">
              Kelola data kendaraan operasional dengan mudah
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-white/20 text-white hover:bg-white/30 border border-gray-100 shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 rounded-xl h-12 px-6"
                size="lg"
                onClick={() => {
                  resetForm();
                  setEditingVehicle(null);
                }}
              >
                <Plus className="w-5 h-5 mr-2" />
                Tambah Kendaraan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-0 shadow-2xl bg-white/90 backdrop-blur-2xl rounded-[2rem]">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {editingVehicle ? "Edit Kendaraan" : "Tambah Kendaraan Baru"}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  {editingVehicle
                    ? "Ubah data kendaraan"
                    : "Masukkan data kendaraan baru"}
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={handleSubmit}
                className="space-y-5 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                {/* Form fields remain mostly the same but with enhanced input styling if needed */}
                <div className="space-y-2">
                  <Label
                    htmlFor="licensePlate"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Nomor Polisi
                  </Label>
                  <Input
                    id="licensePlate"
                    value={formData.licensePlate}
                    onChange={(e) =>
                      setFormData({ ...formData, licensePlate: e.target.value })
                    }
                    placeholder="B 1234 CD"
                    className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="brand"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Merek
                    </Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) =>
                        setFormData({ ...formData, brand: e.target.value })
                      }
                      placeholder="Toyota"
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="model"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Model
                    </Label>
                    <Input
                      id="model"
                      value={formData.model}
                      onChange={(e) =>
                        setFormData({ ...formData, model: e.target.value })
                      }
                      placeholder="Avanza"
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="year"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Tahun
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                      placeholder="2020"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="type"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Jenis
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50">
                        <SelectValue placeholder="Pilih jenis" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MPV">MPV</SelectItem>
                        <SelectItem value="Pickup">Pickup</SelectItem>
                        <SelectItem value="Ambulan">Ambulan</SelectItem>
                        <SelectItem value="Elf">Elf</SelectItem>
                        <SelectItem value="Motor">Motor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="status"
                    className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                  >
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: Vehicle["status"]) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Aktif</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="inactive">Tidak Aktif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="lastService"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Servis Terakhir
                    </Label>
                    <Input
                      id="lastService"
                      type="date"
                      value={formData.lastService}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          lastService: e.target.value,
                        })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                    />
                    <div className="space-y-2 mt-2">
                      <Label
                        htmlFor="lastServiceKm"
                        className="text-xs text-gray-500"
                      >
                        Kilometer (km)
                      </Label>
                      <Input
                        id="lastServiceKm"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="25000"
                        value={formData.lastServiceKm}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            lastServiceKm: e.target.value,
                          })
                        }
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="nextService"
                      className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                    >
                      Servis Berikutnya
                    </Label>
                    <Input
                      id="nextService"
                      type="date"
                      value={formData.nextService}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nextService: e.target.value,
                        })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                    />
                    <div className="space-y-2 mt-2">
                      <Label
                        htmlFor="nextServiceKm"
                        className="text-xs text-gray-500"
                      >
                        Kilometer (km)
                      </Label>
                      <Input
                        id="nextServiceKm"
                        type="number"
                        inputMode="numeric"
                        min="0"
                        placeholder="30000"
                        value={formData.nextServiceKm}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            nextServiceKm: e.target.value,
                          })
                        }
                        className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wider">
                    Pajak Kendaraan
                  </h3>
                  <div className="space-y-2">
                    <Label
                      htmlFor="taxExpireDate"
                      className="text-xs font-semibold text-gray-500"
                    >
                      Berlaku Hingga
                    </Label>
                    <Input
                      id="taxExpireDate"
                      type="date"
                      value={formData.taxExpireDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          taxExpireDate: e.target.value,
                        })
                      }
                      className="rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/50"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl h-11 shadow-lg shadow-blue-500/25"
                  >
                    {editingVehicle ? "Update Data" : "Simpan Data"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex-1 rounded-xl h-11 border-gray-200 hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <div className="relative group">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              placeholder="Cari berdasarkan nomor polisi, merek, atau model..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 border-0 bg-white rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all text-base"
            />
          </div>
        </div>

        <Card className="border-0 shadow-lg bg-white rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Total
                </p>
                <p className="text-3xl font-extrabold text-blue-900 mt-1">
                  {vehicles.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-2xl">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white rounded-[2rem] hover:-translate-y-1 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Aktif
                </p>
                <p className="text-3xl font-extrabold text-green-900 mt-1">
                  {vehicles.filter((v) => v.status === "active").length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-2xl">
                <Car className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicles Table */}
      <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
        <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
          <CardTitle className="flex items-center gap-4 text-xl font-bold text-gray-900">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20">
              <Car className="w-5 h-5 text-white" />
            </div>
            Daftar Kendaraan
            <Badge
              variant="secondary"
              className="ml-auto bg-white/50 text-gray-600 backdrop-blur-sm border border-white/50 px-4 py-1.5 rounded-full text-sm"
            >
              {filteredVehicles.length} unit
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs pl-8 py-5">
                    Nomor Polisi
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                    Kendaraan
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                    Jenis
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                    Status
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                    Servis Terakhir
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                    Servis Berikutnya
                  </TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                    Pajak
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs pr-8 py-5">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.map((vehicle, index) => {
                  const taxStatus = getTaxStatus(vehicle.taxExpireDate);
                  return (
                    <tr
                      key={vehicle.id}
                      className="hover:bg-blue-50/50 transition-all duration-200 group border-b border-gray-100 last:border-0 relative"
                    >
                      <TableCell className="font-bold text-blue-900 pl-8">
                        <div className="py-2 px-3 bg-blue-50 rounded-lg w-fit">
                          {vehicle.licensePlate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                            {vehicle.brand} {vehicle.model}
                          </p>
                          <p className="text-xs font-medium text-gray-500 mt-0.5">
                            {vehicle.year}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="font-semibold bg-white border-gray-200"
                        >
                          {vehicle.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">
                            {formatDate(vehicle.lastService) || "-"}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {formatKm(vehicle.lastServiceKm)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">
                            {formatDate(vehicle.nextService) || "-"}
                          </span>
                          <span className="text-xs font-medium text-gray-500">
                            {formatKm(vehicle.nextServiceKm)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Badge
                            className={`${taxStatus.color} font-bold mb-1 w-fit`}
                          >
                            {taxStatus.label}
                          </Badge>
                          {vehicle.taxExpireDate && (
                            <span className="text-xs text-gray-500 font-medium">
                              {vehicle.taxExpireDate}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(vehicle)}
                            className="bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg w-8 h-8 p-0"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(vehicle)}
                            className="bg-red-50 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg w-8 h-8 p-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </tr>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          {filteredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchTerm
                  ? "Tidak ada kendaraan yang ditemukan"
                  : "Belum ada data kendaraan"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteVehicle}
        onOpenChange={() => !isDeleting && setDeleteVehicle(null)}
      >
        <AlertDialogContent className="rounded-2xl border-0 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">
              Hapus Kendaraan?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Apakah Anda yakin ingin menghapus kendaraan{" "}
              <span className="font-bold text-gray-900">
                {deleteVehicle?.brand} {deleteVehicle?.model} -{" "}
                {deleteVehicle?.licensePlate}
              </span>
              ? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan
              dihapus secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel
              disabled={isDeleting}
              className="rounded-xl border-gray-200 hover:bg-gray-50"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Menghapus...
                </>
              ) : (
                "Ya, Hapus"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
