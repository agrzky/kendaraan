"use client";

import { useState, useEffect, memo, useMemo, useCallback } from "react";
import { AuthGuard } from "@/components/auth-guard";
import { DashboardLayout } from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Loader2,
  Fuel,
  CreditCard,
  Receipt,
  Car,
  Pencil,
  Trash2,
  Printer,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Vehicle {
  id: string;
  licensePlate: string;
  brand: string;
  model: string;
  fuelType: string;
}

// Logo BKN menggunakan CSS background-image untuk mencegah re-request
// Komponen ini menggunakan div dengan background-image bukan img tag
const LogoBKN = memo(
  function LogoBKN({ size = 60 }: { size?: number }) {
    return (
      <div
        role="img"
        aria-label="Logo BKN"
        style={{
          width: size,
          height: size,
          backgroundImage: 'url("/logo-bkn.png")',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      />
    );
  },
  () => true, // Always return true from comparison = never re-render
);

const DRIVERS = [
  "Cherry Lembek",
  "Denih",
  "Akhid Nuroji",
  "Setio Putra Andika",
];

export default function RekapBbmTolPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingVehicles, setFetchingVehicles] = useState(true);

  // Fuel Form State
  const [fuelForm, setFuelForm] = useState({
    date: new Date().toISOString().split("T")[0],
    vehicleId: "",
    driver: "",
    fuelType: "",
    liters: "",
    pricePerLiter: "",
    totalCost: "",
    remarks: "",
  });

  // Toll Form State
  const [tollForm, setTollForm] = useState({
    date: new Date().toISOString().split("T")[0],
    vehicleId: "",
    driver: "",
    cost: "",
    remarks: "",
  });

  const [loadingRecords, setLoadingRecords] = useState(false);

  // Records State
  const [fuelRecords, setFuelRecords] = useState<any[]>([]);
  const [tollRecords, setTollRecords] = useState<any[]>([]);

  // Month Filter State (default: current month)
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  const [selectedMonthFuel, setSelectedMonthFuel] = useState(currentMonth);
  const [selectedMonthToll, setSelectedMonthToll] = useState(currentMonth);

  // Filtered Records by Month
  // Use UTC methods since API stores dates at UTC noon (12:00:00 UTC)
  const filteredFuelRecords = fuelRecords.filter((r) => {
    const recordDate = new Date(r.date);
    const year = recordDate.getUTCFullYear();
    const month = String(recordDate.getUTCMonth() + 1).padStart(2, "0");
    const recordMonth = `${year}-${month}`;
    return recordMonth === selectedMonthFuel;
  });

  const filteredTollRecords = tollRecords.filter((r) => {
    const recordDate = new Date(r.date);
    const year = recordDate.getUTCFullYear();
    const month = String(recordDate.getUTCMonth() + 1).padStart(2, "0");
    const recordMonth = `${year}-${month}`;
    return recordMonth === selectedMonthToll;
  });

  // Computed Totals (using filtered data)
  const totalLiters = filteredFuelRecords.reduce(
    (sum, r) => sum + (r.liters || 0),
    0,
  );
  const totalCost = Math.round(
    filteredFuelRecords.reduce((sum, r) => sum + (r.totalCost || 0), 0),
  );
  const totalTollCost = Math.round(
    filteredTollRecords.reduce((sum, r) => sum + (r.cost || 0), 0),
  );
  const selectedVehicleToll = vehicles.find((v) => v.id === tollForm.vehicleId);

  useEffect(() => {
    if (fuelForm.vehicleId) {
      fetchFuelRecords(fuelForm.vehicleId);
    } else {
      setFuelRecords([]);
    }
  }, [fuelForm.vehicleId]);

  useEffect(() => {
    if (tollForm.vehicleId) {
      fetchTollRecords(tollForm.vehicleId);
    } else {
      setTollRecords([]);
    }
  }, [tollForm.vehicleId]);

  const fetchFuelRecords = async (vehicleId: string) => {
    setLoadingRecords(true);
    try {
      const response = await fetch("/api/fuel");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const filtered = data.records
            .filter((r: any) => r.vehicleId === vehicleId)
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
          setFuelRecords(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  const fetchTollRecords = async (vehicleId: string) => {
    setLoadingRecords(true);
    try {
      const response = await fetch("/api/toll");
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const filtered = data.records
            .filter((r: any) => r.vehicleId === vehicleId)
            .sort(
              (a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime(),
            );
          setTollRecords(filtered);
        }
      }
    } catch (error) {
      console.error("Error fetching toll records:", error);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Toll Edit & Delete Logic
  const [editingTollRecord, setEditingTollRecord] = useState<any>(null);
  const [editTollForm, setEditTollForm] = useState<any>({});
  const [editTollLoading, setEditTollLoading] = useState(false);

  const deleteTollRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/toll?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Data Tol berhasil dihapus");
        if (tollForm.vehicleId) fetchTollRecords(tollForm.vehicleId);
      } else {
        toast.error("Gagal menghapus data Tol");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const startEditToll = (record: any) => {
    setEditingTollRecord(record);
    setEditTollForm({
      ...record,
      date: new Date(record.date).toISOString().split("T")[0],
      cost: record.cost.toString(),
    });
  };

  const handleEditTollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditTollLoading(true);
    try {
      const response = await fetch("/api/toll", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTollForm),
      });

      if (response.ok) {
        toast.success("Data Tol berhasil diperbarui");
        setEditingTollRecord(null);
        if (tollForm.vehicleId) fetchTollRecords(tollForm.vehicleId);
      } else {
        toast.error("Gagal memperbarui data Tol");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setEditTollLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await fetch("/api/vehicles");
      const data = await response.json();
      if (data.success) {
        setVehicles(data.vehicles);
      }
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Gagal memuat data kendaraan");
    } finally {
      setFetchingVehicles(false);
    }
  };

  const handleFuelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/fuel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fuelForm),
      });

      if (response.ok) {
        toast.success("Data BBM berhasil disimpan!");
        setFuelForm({
          ...fuelForm,
          liters: "",
          pricePerLiter: "",
          totalCost: "",
          remarks: "",
        });
        if (fuelForm.vehicleId) fetchFuelRecords(fuelForm.vehicleId);
      } else {
        toast.error("Gagal menyimpan data BBM");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  // Delete & Edit Logic
  const deleteFuelRecord = async (id: string) => {
    try {
      const response = await fetch(`/api/fuel?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Data berhasil dihapus");
        if (fuelForm.vehicleId) fetchFuelRecords(fuelForm.vehicleId);
      } else {
        toast.error("Gagal menghapus data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);

  const startEdit = (record: any) => {
    setEditingRecord(record);
    setEditForm({
      ...record,
      date: new Date(record.date).toISOString().split("T")[0],
      totalCost: record.totalCost.toString(),
      pricePerLiter: record.pricePerLiter.toString(),
      liters: record.liters.toString(),
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const response = await fetch("/api/fuel", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        toast.success("Data berhasil diperbarui");
        setEditingRecord(null);
        if (fuelForm.vehicleId) fetchFuelRecords(fuelForm.vehicleId);
      } else {
        toast.error("Gagal memperbarui data");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    } finally {
      setEditLoading(false);
    }
  };

  // Auto-calc for Edit Form
  useEffect(() => {
    if (editingRecord && editForm.totalCost && editForm.pricePerLiter) {
      const price = parseFloat(editForm.pricePerLiter);
      if (price > 0) {
        const liters = parseFloat(editForm.totalCost) / price;
        if (!isNaN(liters)) {
          setEditForm((prev: any) => ({ ...prev, liters: liters.toString() }));
        }
      }
    }
  }, [editForm.totalCost, editForm.pricePerLiter]);

  const handleTollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/toll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tollForm),
      });

      if (response.ok) {
        toast.success("Data Tol berhasil disimpan!");
        setTollForm({
          ...tollForm,
          cost: "",
          remarks: "",
        });
        if (tollForm.vehicleId) fetchTollRecords(tollForm.vehicleId);
      } else {
        toast.error("Gagal menyimpan data Tol");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setLoading(false);
    }
  };

  // Auto-calculate Liters for Fuel if Total Cost and Price are known
  useEffect(() => {
    if (fuelForm.totalCost && fuelForm.pricePerLiter) {
      const price = parseFloat(fuelForm.pricePerLiter);
      if (price > 0) {
        const liters = parseFloat(fuelForm.totalCost) / price;
        if (!isNaN(liters)) {
          setFuelForm((prev) => ({ ...prev, liters: liters.toString() }));
        }
      }
    }
  }, [fuelForm.totalCost, fuelForm.pricePerLiter]);

  // Determine Fuel Type automatically when vehicle is selected
  useEffect(() => {
    if (fuelForm.vehicleId) {
      const vehicle = vehicles.find((v) => v.id === fuelForm.vehicleId);
      if (vehicle) {
        // Default to Pertalite if not specified or map fuelType logic
        setFuelForm((prev) => ({ ...prev, fuelType: "Pertalite" }));
      }
    }
  }, [fuelForm.vehicleId, vehicles]);

  // Helpers for table display
  const selectedVehicle = vehicles.find((v) => v.id === fuelForm.vehicleId);
  const isRoda2 =
    selectedVehicle &&
    ["F 6878 G", "F 2716 F"].includes(selectedVehicle.licensePlate);
  const vehicleTypeLabel = isRoda2 ? "RODA 2" : "RODA 4";

  const isRoda2Toll =
    selectedVehicleToll &&
    ["F 6878 G", "F 2716 F"].includes(selectedVehicleToll.licensePlate);
  const vehicleTypeLabelToll = isRoda2Toll ? "RODA 2" : "RODA 4";

  // Calculate last day of selected month for signatures
  const getLastDayOfMonth = (monthStr: string) => {
    const [year, month] = monthStr.split("-").map(Number);
    return new Date(year, month, 0); // Day 0 of next month = last day of selected month
  };
  const lastDayOfMonthFuel = getLastDayOfMonth(selectedMonthFuel);
  const lastDayOfMonthToll = getLastDayOfMonth(selectedMonthToll);

  // Adaptive print: bigger fonts for few rows, only scales DOWN for many rows
  const handlePrint = useCallback((e: React.MouseEvent) => {
    const button = e.currentTarget;
    const printArea = button.closest(".print-area") as HTMLElement;
    if (!printArea) {
      window.print();
      return;
    }

    // Count data rows
    const rowCount = printArea.querySelectorAll("tbody tr").length;

    // Adaptive sizing tiers
    let fs: number, cp: string, ts: number, sts: number;
    let ls: number, sm: string, sg: string, hp: string, ctp: string;

    if (rowCount <= 5) {
      // Very few rows - extra large
      fs = 16;
      cp = "8px 14px";
      ts = 18;
      sts = 20;
      ls = 65;
      sm = "50px";
      sg = "80px";
      hp = "14px 18px";
      ctp = "20px";
    } else if (rowCount <= 10) {
      // Few rows - large
      fs = 14;
      cp = "6px 12px";
      ts = 16;
      sts = 18;
      ls = 60;
      sm = "40px";
      sg = "70px";
      hp = "12px 16px";
      ctp = "16px";
    } else if (rowCount <= 18) {
      // Medium rows
      fs = 13;
      cp = "5px 10px";
      ts = 15;
      sts = 16;
      ls = 55;
      sm = "30px";
      sg = "60px";
      hp = "10px 14px";
      ctp = "14px";
    } else if (rowCount <= 28) {
      // Many rows
      fs = 12;
      cp = "4px 8px";
      ts = 14;
      sts = 15;
      ls = 50;
      sm = "20px";
      sg = "50px";
      hp = "8px 12px";
      ctp = "12px";
    } else {
      // Very many rows
      fs = 12;
      cp = "3px 6px";
      ts = 13;
      sts = 14;
      ls = 45;
      sm = "14px";
      sg = "40px";
      hp = "6px 10px";
      ctp = "10px";
    }

    // Remove previous style
    const existing = document.getElementById("dynamic-print-scale");
    if (existing) existing.remove();

    const styleEl = document.createElement("style");
    styleEl.id = "dynamic-print-scale";
    styleEl.textContent = `
      @media print {
        .print-area th, .print-area td {
          padding: ${cp} !important;
          font-size: ${fs}px !important;
          line-height: 1.4 !important;
        }
        .print-area th { font-weight: bold !important; }
        .print-area [class*="CardTitle"] { font-size: ${ts}px !important; }
        .print-area [class*="CardTitle"] div { font-size: ${sts}px !important; margin-top: 2px !important; }
        .print-area img, .print-area [role="img"] {
          width: ${ls}px !important; height: ${ls}px !important;
          min-width: ${ls}px !important; min-height: ${ls}px !important;
        }
        .print-area .mt-12, .print-area .mt-8 { margin-top: ${sm} !important; }
        .print-area .mb-16 { margin-bottom: ${sg} !important; }
        .print-area [class*="CardHeader"] { padding: ${hp} !important; }
        .print-area [class*="CardContent"] { padding: ${ctp} !important; }
      }
    `;
    document.head.appendChild(styleEl);

    // Only scale DOWN if content overflows - never scale up
    requestAnimationFrame(() => {
      const noPrintEls = printArea.querySelectorAll(".no-print");
      noPrintEls.forEach((el) => ((el as HTMLElement).style.display = "none"));
      const contentHeight = printArea.scrollHeight;
      noPrintEls.forEach((el) => ((el as HTMLElement).style.display = ""));

      // A4 printable height at 96dpi with 10mm margins
      const pageHeight = 1050;
      if (contentHeight > pageHeight) {
        const scale = Math.max(pageHeight / contentHeight, 0.55);
        styleEl.textContent += `
          @media print {
            .print-area {
              transform: scale(${scale}) !important;
              transform-origin: top left !important;
              width: ${100 / scale}% !important;
            }
          }
        `;
      }

      setTimeout(() => {
        window.print();
        setTimeout(() => {
          const el = document.getElementById("dynamic-print-scale");
          if (el) el.remove();
        }, 1000);
      }, 150);
    });
  }, []);

  return (
    <AuthGuard>
      <DashboardLayout>
        {/* PRINT STYLES - Base structural rules only, sizing handled dynamically by JS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }

            html, body {
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              height: auto !important;
              overflow: visible !important;
              background: white !important;
            }

            body * {
              visibility: hidden;
            }

            .print-area, .print-area * {
              visibility: visible;
            }

            .print-area {
              position: absolute;
              left: 0;
              top: 0;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              overflow: visible !important;
              border-radius: 0 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            .no-print {
              display: none !important;
            }

            table {
              border-collapse: collapse !important;
              width: 100% !important;
            }
            table, th, td {
              border: 1px solid black !important;
            }

            .print-area, .print-area * {
              box-shadow: none !important;
              border-radius: 0 !important;
            }

            .overflow-x-auto, .overflow-hidden {
              overflow: visible !important;
            }

            .max-w-4xl, .max-w-xl {
              max-width: none !important;
            }

            nav, aside, header, footer,
            [class*="sidebar"], [class*="Sidebar"],
            [class*="DashboardLayout"] > *:not(.print-area) {
              display: none !important;
            }

            /* Prevent kop from separating */
            .print-area [class*="CardHeader"] {
              break-after: avoid !important;
              page-break-after: avoid !important;
            }
            .print-area [class*="CardContent"] {
              break-before: avoid !important;
              page-break-before: avoid !important;
            }
            thead {
              break-after: avoid !important;
              page-break-after: avoid !important;
            }
          }
        `,
          }}
        />

        {/* EDIT DIALOG */}
        <Dialog
          open={!!editingRecord}
          onOpenChange={(open) => !open && setEditingRecord(null)}
        >
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Edit Data BBM</DialogTitle>
              <DialogDescription>
                Ubah detail data pengisian BBM.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input
                    type="date"
                    required
                    value={editForm.date || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, date: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Driver</Label>
                  <Select
                    value={editForm.driver || ""}
                    onValueChange={(val) =>
                      setEditForm({ ...editForm, driver: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Driver" />
                    </SelectTrigger>
                    <SelectContent position="popper" side="bottom" className="max-h-[250px]">
                      {DRIVERS.map((driver) => (
                        <SelectItem key={driver} value={driver}>
                          {driver}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Biaya</Label>
                  <Input
                    type="number"
                    required
                    value={editForm.totalCost || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, totalCost: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Harga/Liter</Label>
                  <Input
                    type="number"
                    required
                    value={editForm.pricePerLiter || ""}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        pricePerLiter: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Jumlah Liter</Label>
                  <Input
                    value={parseFloat(editForm.liters || "0").toLocaleString("id-ID", {
                      minimumFractionDigits: 3,
                      maximumFractionDigits: 3,
                    }) + " L"}
                    disabled
                    className="bg-gray-100 font-bold"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingRecord(null)}
                >
                  Batal
                </Button>
                <Button type="submit" disabled={editLoading}>
                  {" "}
                  Simpan Perubahan{" "}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <div className="space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Rekap BBM & Tol
            </h1>
          </div>

          <Tabs defaultValue="bbm" className="w-full">
            <TabsList className="grid w-full grid-cols-2 h-14 p-1 bg-slate-100/80 rounded-2xl mb-6">
              <TabsTrigger
                value="bbm"
                className="rounded-xl h-12 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-orange-600 data-[state=active]:shadow-md transition-all"
              >
                <Fuel className="w-4 h-4 mr-2" />
                Input BBM
              </TabsTrigger>
              <TabsTrigger
                value="tol"
                className="rounded-xl h-12 text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Input TOL
              </TabsTrigger>
            </TabsList>

            {/* TAB: INPUT BBM */}
            <TabsContent value="bbm" className="mt-0">
              <Card className="border-0 shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-orange-50/50 border-b border-orange-100 px-8 py-6">
                  <CardTitle className="flex items-center gap-3 text-orange-900">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Fuel className="w-5 h-5 text-orange-600" />
                    </div>
                    Form Pengisian BBM
                  </CardTitle>
                  <CardDescription>
                    Catat pengeluaran bahan bakar kendaraan operasional.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleFuelSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Tanggal & Kendaraan */}
                      <div className="space-y-2">
                        <Label>Tanggal</Label>
                        <Input
                          type="date"
                          required
                          value={fuelForm.date}
                          onChange={(e) =>
                            setFuelForm({ ...fuelForm, date: e.target.value })
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kendaraan</Label>
                        <Select
                          value={fuelForm.vehicleId}
                          onValueChange={(val) =>
                            setFuelForm({ ...fuelForm, vehicleId: val })
                          }
                          required
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Pilih Kendaraan" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" className="max-h-[250px]">
                            {vehicles.map((v) => (
                              <SelectItem key={v.id} value={v.id}>
                                {v.licensePlate} - {v.brand} {v.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Driver */}
                      <div className="space-y-2">
                        <Label>Driver</Label>
                        <Select
                          value={fuelForm.driver}
                          onValueChange={(val) =>
                            setFuelForm({ ...fuelForm, driver: val })
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Pilih Driver" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" className="max-h-[250px]">
                            {DRIVERS.map((driver) => (
                              <SelectItem key={driver} value={driver}>
                                {driver}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Jenis BBM */}
                      <div className="space-y-2">
                        <Label>Jenis BBM</Label>
                        <Select
                          value={fuelForm.fuelType}
                          onValueChange={(val) =>
                            setFuelForm({ ...fuelForm, fuelType: val })
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Pilih Jenis BBM" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" className="max-h-[250px]">
                            <SelectItem value="Pertamax">Pertamax</SelectItem>
                            <SelectItem value="Pertamina Dex">
                              Pertamina Dex
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Perhitungan Biaya */}
                      <div className="space-y-2">
                        <Label>Total Biaya (Rp)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          required
                          value={fuelForm.totalCost}
                          onChange={(e) =>
                            setFuelForm({ ...fuelForm, totalCost: e.target.value })
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Harga per Liter (Rp)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          required
                          value={fuelForm.pricePerLiter}
                          onChange={(e) =>
                            setFuelForm({
                              ...fuelForm,
                              pricePerLiter: e.target.value,
                            })
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex justify-between items-center">
                      <span className="font-bold text-orange-800">
                        Jumlah Liter
                      </span>
                      <span className="text-xl font-extrabold text-orange-600">
                        {parseFloat(fuelForm.liters || "0").toLocaleString("id-ID", {
                          minimumFractionDigits: 3,
                          maximumFractionDigits: 3,
                        })}{" "}
                        L
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Label>Keterangan Tambahan</Label>
                      <Textarea
                        placeholder="Catatan..."
                        value={fuelForm.remarks}
                        onChange={(e) =>
                          setFuelForm({ ...fuelForm, remarks: e.target.value })
                        }
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl min-w-[140px]"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Receipt className="w-4 h-4 mr-2" />
                        )}
                        Simpan Data BBM
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* REKAP TABLE SECTION */}
              {selectedVehicle && (
                <Card className="border-0 shadow-xl bg-white rounded-[2rem] overflow-hidden mt-6 print-area">
                  <CardHeader className="bg-white px-4 py-2 border-b border-gray-100 flex flex-row items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                      <LogoBKN />
                    </div>
                    <div className="flex-1 text-center">
                      <CardTitle className="font-bold text-black uppercase text-lg leading-snug">
                        REKAPITULASI BBM KENDARAAN {vehicleTypeLabel}
                        <div className="text-xl mt-1">
                          ({selectedVehicle.licensePlate})
                        </div>
                      </CardTitle>
                    </div>
                    <div className="w-[100px] flex justify-end">
                      <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="no-print gap-2 border-gray-300 hover:bg-gray-100"
                      >
                        <Printer className="w-4 h-4" /> Print
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 overflow-x-auto">
                    {/* MONTH FILTER */}
                    <div className="mb-4 flex items-center gap-3 no-print">
                      <Label className="text-sm font-medium text-gray-700">
                        Periode:
                      </Label>
                      <Input
                        type="month"
                        value={selectedMonthFuel}
                        onChange={(e) => setSelectedMonthFuel(e.target.value)}
                        className="w-48"
                      />
                    </div>
                    <div className="min-w-full inline-block align-middle">
                      <div className="border border-black">
                        <table className="min-w-full divide-y divide-black">
                          <thead>
                            <tr className="bg-white">
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black w-12"
                              >
                                NO
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                TANGGAL
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                LITER
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                HARGA SATUAN
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                JUMLAH
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black width-24 no-print"
                              >
                                AKSI
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            {filteredFuelRecords.length > 0 ? (
                              (() => {
                                let fuelNumber = 0;
                                return filteredFuelRecords.map(
                                  (record, index) => {
                                    const isSameDate =
                                      index > 0 &&
                                      new Date(record.date).toDateString() ===
                                        new Date(
                                          filteredFuelRecords[index - 1].date,
                                        ).toDateString();

                                    if (!isSameDate) fuelNumber++;

                                    return (
                                      <tr
                                        key={record.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black font-medium">
                                          {!isSameDate && fuelNumber}
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                                          {!isSameDate &&
                                            new Date(
                                              record.date,
                                            ).toLocaleDateString("id-ID", {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                                          {record.liters?.toLocaleString(
                                            "id-ID",
                                            {
                                              minimumFractionDigits: 3,
                                              maximumFractionDigits: 3,
                                            },
                                          )}
                                        </td>
                                        <td className="px-3 py-2 text-right text-sm text-black border-r border-black">
                                          <div className="flex justify-between w-full px-2">
                                            <span>Rp</span>
                                            <span>
                                              {record.pricePerLiter?.toLocaleString(
                                                "id-ID",
                                              )}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-right text-sm text-black font-medium border-r border-black">
                                          <div className="flex justify-between w-full px-2">
                                            <span>Rp</span>
                                            <span>
                                              {Math.round(
                                                record.totalCost || 0,
                                              ).toLocaleString("id-ID")}
                                            </span>
                                          </div>
                                        </td>
                                        {/* ACTIONS CELL */}
                                        <td className="px-3 py-2 text-center no-print border-r border-black">
                                          <div className="flex justify-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                              onClick={() => startEdit(record)}
                                            >
                                              <Pencil className="w-4 h-4" />
                                            </Button>

                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Hapus Data?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    Data ini akan dihapus
                                                    permanen.
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Batal
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() =>
                                                      deleteFuelRecord(
                                                        record.id,
                                                      )
                                                    }
                                                    className="bg-red-600"
                                                  >
                                                    Hapus
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  },
                                );
                              })()
                            ) : (
                              <tr>
                                <td
                                  colSpan={6}
                                  className="px-3 py-8 text-center text-sm text-gray-500 italic"
                                >
                                  Belum ada data untuk kendaraan ini
                                </td>
                              </tr>
                            )}
                            {/* TOTAL ROW */}
                            <tr className="bg-white font-bold border-t-2 border-black">
                              <td
                                colSpan={2}
                                className="px-3 py-2 text-center text-sm text-black border-r border-black uppercase tracking-wider"
                              >
                                TOTAL
                              </td>
                              <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                                {totalLiters.toLocaleString("id-ID", {
                                  minimumFractionDigits: 3,
                                  maximumFractionDigits: 3,
                                })}
                              </td>
                              <td className="px-3 py-2 text-center text-sm text-black border-r border-black bg-gray-100">
                                {/* Empty cell for price */}
                              </td>
                              <td className="px-3 py-2 text-right text-sm text-black">
                                <div className="flex justify-between w-full px-2">
                                  <span>Rp</span>
                                  <span>
                                    {totalCost.toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </td>
                              <td className="no-print"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* SIGNATURE BLOCK */}
                      <div className="mt-12 flex justify-end">
                        <div className="text-center w-64">
                          <p className="text-sm font-medium text-black mb-1">
                            Bogor,{" "}
                            {lastDayOfMonthFuel.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm font-medium text-black mb-16">
                            Mengetahui,
                          </p>
                          <p className="text-sm font-bold text-black">
                            {filteredFuelRecords.filter((r) => r.driver).pop()
                              ?.driver || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* TAB: INPUT TOL */}
            <TabsContent value="tol" className="mt-0">
              <Card className="border-0 shadow-xl bg-white rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-blue-50/50 border-b border-blue-100 px-8 py-6">
                  <CardTitle className="flex items-center gap-3 text-blue-900">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <CreditCard className="w-5 h-5 text-blue-600" />
                    </div>
                    Form Pengeluaran TOL
                  </CardTitle>
                  <CardDescription>
                    Catat biaya e-Toll untuk perjalanan dinas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <form onSubmit={handleTollSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Tanggal</Label>
                        <Input
                          type="month"
                          required
                          value={tollForm.date ? tollForm.date.substring(0, 7) : ""}
                          onChange={(e) =>
                            setTollForm({ ...tollForm, date: e.target.value ? `${e.target.value}-01` : "" })
                          }
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Kendaraan</Label>
                        <Select
                          value={tollForm.vehicleId}
                          onValueChange={(val) =>
                            setTollForm({ ...tollForm, vehicleId: val })
                          }
                          required
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Pilih Kendaraan" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" className="max-h-[250px]">
                            {vehicles.map((v) => (
                              <SelectItem key={v.id} value={v.id}>
                                {v.licensePlate} - {v.brand} {v.model}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Driver</Label>
                        <Select
                          value={tollForm.driver}
                          onValueChange={(val) =>
                            setTollForm({ ...tollForm, driver: val })
                          }
                        >
                          <SelectTrigger className="rounded-xl">
                            <SelectValue placeholder="Pilih Driver" />
                          </SelectTrigger>
                          <SelectContent position="popper" side="bottom" className="max-h-[250px]">
                            {DRIVERS.map((driver) => (
                              <SelectItem key={driver} value={driver}>
                                {driver}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Biaya Tol (Rp)</Label>
                        <Input
                          type="number"
                          placeholder="0"
                          required
                          value={tollForm.cost}
                          onChange={(e) =>
                            setTollForm({ ...tollForm, cost: e.target.value })
                          }
                          className="rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Keterangan Tambahan</Label>
                      <Textarea
                        placeholder="Catatan..."
                        value={tollForm.remarks}
                        onChange={(e) =>
                          setTollForm({ ...tollForm, remarks: e.target.value })
                        }
                        className="rounded-xl resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-xl"
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl min-w-[140px]"
                      >
                        {loading ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Receipt className="w-4 h-4 mr-2" />
                        )}
                        Simpan Data Tol
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* REKAP TABLE TOL */}
              {selectedVehicleToll && (
                <Card className="border-0 shadow-xl bg-white rounded-[2rem] overflow-hidden mt-6 print-area">
                  <CardHeader className="bg-white px-4 py-2 border-b border-gray-100 flex flex-row items-center justify-between">
                    <div className="w-[100px] flex justify-start">
                      <LogoBKN />
                    </div>
                    <div className="flex-1 text-center">
                      <CardTitle className="font-bold text-black uppercase text-lg leading-snug">
                        REKAPITULASI E-TOL KENDARAAN {vehicleTypeLabelToll}
                        <div className="text-xl mt-1">
                          ({selectedVehicleToll.licensePlate})
                        </div>
                      </CardTitle>
                    </div>
                    <div className="w-[100px] flex justify-end">
                      <Button
                        variant="outline"
                        onClick={handlePrint}
                        className="no-print gap-2 border-gray-300 hover:bg-gray-100"
                      >
                        <Printer className="w-4 h-4" /> Print
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 overflow-x-auto">
                    {/* MONTH FILTER */}
                    <div className="mb-4 flex items-center gap-3 no-print">
                      <Label className="text-sm font-medium text-gray-700">
                        Periode:
                      </Label>
                      <Input
                        type="month"
                        value={selectedMonthToll}
                        onChange={(e) => setSelectedMonthToll(e.target.value)}
                        className="w-48"
                      />
                    </div>
                    <div className="min-w-full inline-block align-middle">
                      <div className="border border-black">
                        <table className="min-w-full divide-y divide-black">
                          <thead>
                            <tr className="bg-white">
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black w-12"
                              >
                                NO
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                TANGGAL
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                HARGA SATUAN
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                JUMLAH VOLUME
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black"
                              >
                                JUMLAH
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-2 text-center text-sm font-bold text-black border-r border-black width-24 no-print"
                              >
                                AKSI
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black">
                            {filteredTollRecords.length > 0 ? (
                              (() => {
                                const grouped = new Map();
                                filteredTollRecords.forEach((record) => {
                                  const dateKey = new Date(
                                    record.date,
                                  ).toDateString();
                                  if (!grouped.has(dateKey)) {
                                    grouped.set(dateKey, new Map());
                                  }
                                  const dateGroup = grouped.get(dateKey);

                                  const cost = Number(record.cost) || 0;
                                  if (!dateGroup.has(cost)) {
                                    dateGroup.set(cost, {
                                      count: 0,
                                      total: 0,
                                      records: [],
                                    });
                                  }

                                  const entry = dateGroup.get(cost);
                                  entry.count += 1;
                                  entry.total += cost;
                                  entry.records.push(record);
                                });

                                let numbering = 0;
                                const renderedRows: JSX.Element[] = [];

                                grouped.forEach((costMap, dateKey) => {
                                  numbering++;
                                  let isFirstForDate = true;

                                  costMap.forEach((data: any, cost: number) => {
                                    renderedRows.push(
                                      <tr
                                        key={`${dateKey}-${cost}`}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black font-medium">
                                          {isFirstForDate ? numbering : ""}
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                                          {isFirstForDate
                                            ? new Date(
                                                dateKey,
                                              ).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                              })
                                            : ""}
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                                          <div className="flex justify-between w-full px-2">
                                            <span>Rp</span>
                                            <span>
                                              {Number(cost).toLocaleString(
                                                "id-ID",
                                              )}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                                          {data.count}
                                        </td>
                                        <td className="px-3 py-2 text-right text-sm text-black font-medium border-r border-black">
                                          <div className="flex justify-between w-full px-2">
                                            <span>Rp</span>
                                            <span>
                                              {data.total.toLocaleString(
                                                "id-ID",
                                              )}
                                            </span>
                                          </div>
                                        </td>
                                        <td className="px-3 py-2 text-center no-print border-r border-black">
                                          <div className="flex justify-center">
                                            <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                                                >
                                                  <Trash2 className="w-4 h-4" />
                                                </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                <AlertDialogHeader>
                                                  <AlertDialogTitle>
                                                    Hapus {data.count} Data?
                                                  </AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                    {data.count > 1
                                                      ? `Semua ${
                                                          data.count
                                                        } transaksi dengan harga Rp ${Number(
                                                          cost,
                                                        ).toLocaleString(
                                                          "id-ID",
                                                        )} pada tanggal ini akan dihapus permanen.`
                                                      : "Data ini akan dihapus permanen."}
                                                  </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                  <AlertDialogCancel>
                                                    Batal
                                                  </AlertDialogCancel>
                                                  <AlertDialogAction
                                                    onClick={() => {
                                                      data.records.forEach(
                                                        (rec: any) =>
                                                          deleteTollRecord(
                                                            rec.id,
                                                          ),
                                                      );
                                                    }}
                                                    className="bg-red-600"
                                                  >
                                                    Hapus
                                                  </AlertDialogAction>
                                                </AlertDialogFooter>
                                              </AlertDialogContent>
                                            </AlertDialog>
                                          </div>
                                        </td>
                                      </tr>,
                                    );
                                    isFirstForDate = false;
                                  });
                                });

                                return renderedRows;
                              })()
                            ) : (
                              <tr>
                                <td
                                  colSpan={5}
                                  className="px-3 py-8 text-center text-sm text-gray-500 italic"
                                >
                                  Belum ada data untuk kendaraan ini
                                </td>
                              </tr>
                            )}
                            {/* TOTAL ROW */}
                            <tr className="bg-white font-bold border-t-2 border-black">
                              <td
                                colSpan={4}
                                className="px-3 py-2 text-center text-sm text-black border-r border-black uppercase tracking-wider"
                              >
                                TOTAL
                              </td>
                              <td className="px-3 py-2 text-right text-sm text-black font-medium border-r border-black">
                                <div className="flex justify-between w-full px-2">
                                  <span>Rp</span>
                                  <span>
                                    {totalTollCost.toLocaleString("id-ID")}
                                  </span>
                                </div>
                              </td>
                              <td className="no-print"></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* SIGNATURE BLOCK */}
                      <div className="mt-12 flex justify-end">
                        <div className="text-center w-64">
                          <p className="text-sm font-medium text-black mb-1">
                            Bogor,{" "}
                            {lastDayOfMonthToll.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-sm font-medium text-black mb-16">
                            Mengetahui,
                          </p>
                          <p className="text-sm font-bold text-black">
                            {filteredTollRecords.filter((r) => r.driver).pop()
                              ?.driver || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* EDIT DIALOG TOL */}
          <Dialog
            open={!!editingTollRecord}
            onOpenChange={(open) => !open && setEditingTollRecord(null)}
          >
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Edit Data Tol</DialogTitle>
                <DialogDescription>
                  Ubah detail data pengeluaran Tol.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEditTollSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tanggal</Label>
                    <Input
                      type="date"
                      required
                      value={editTollForm.date || ""}
                      onChange={(e) =>
                        setEditTollForm({
                          ...editTollForm,
                          date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Driver</Label>
                    <Select
                      value={editTollForm.driver || ""}
                      onValueChange={(val) =>
                        setEditTollForm({
                          ...editTollForm,
                          driver: val,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Driver" />
                      </SelectTrigger>
                      <SelectContent>
                        {DRIVERS.map((driver) => (
                          <SelectItem key={driver} value={driver}>
                            {driver}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Biaya Tol</Label>
                    <Input
                      type="number"
                      required
                      value={editTollForm.cost || ""}
                      onChange={(e) =>
                        setEditTollForm({
                          ...editTollForm,
                          cost: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Keterangan</Label>
                    <Input
                      value={editTollForm.remarks || ""}
                      onChange={(e) =>
                        setEditTollForm({
                          ...editTollForm,
                          remarks: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingTollRecord(null)}
                  >
                    Batal
                  </Button>
                  <Button type="submit" disabled={editTollLoading}>
                    {" "}
                    Simpan Perubahan{" "}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
