"use client";

import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Printer } from "lucide-react";
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

interface RekapBBMTableProps {
  selectedVehicle: Vehicle;
  vehicleTypeLabel: string;
  selectedMonthFuel: string;
  onMonthChange: (month: string) => void;
  filteredFuelRecords: any[];
  totalLiters: number;
  totalCost: number;
  lastDayOfMonthFuel: Date;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
}

interface RekapTolTableProps {
  selectedVehicle: Vehicle;
  vehicleTypeLabel: string;
  selectedMonthToll: string;
  onMonthChange: (month: string) => void;
  filteredTollRecords: any[];
  totalTollCost: number;
  lastDayOfMonthToll: Date;
  onEdit: (record: any) => void;
  onDelete: (id: string) => void;
}

// Static logo image - defined outside component to prevent recreation
const LOGO_SRC = "/logo-bkn.png";

// Memoized Logo component
const LogoBKN = memo(function LogoBKN() {
  return (
    <img
      src={LOGO_SRC}
      alt="Logo BKN"
      width="60"
      height="60"
      className="object-contain"
    />
  );
});

// Format tanggal helper
const formatDate = (date: Date) => {
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Memoized Rekap BBM Table Component
export const RekapBBMTable = memo(function RekapBBMTable({
  selectedVehicle,
  vehicleTypeLabel,
  selectedMonthFuel,
  onMonthChange,
  filteredFuelRecords,
  totalLiters,
  totalCost,
  lastDayOfMonthFuel,
  onEdit,
  onDelete,
}: RekapBBMTableProps) {
  return (
    <Card className="border-0 shadow-xl bg-white rounded-[2rem] overflow-hidden mt-6 print-area">
      <CardHeader className="bg-white px-4 py-2 border-b border-gray-100 flex flex-row items-center justify-between">
        <div className="w-[100px] flex justify-start">
          <LogoBKN />
        </div>
        <div className="flex-1 text-center">
          <CardTitle className="font-bold text-black uppercase text-lg leading-snug">
            REKAPITULASI BBM KENDARAAN {vehicleTypeLabel}
            <div className="text-xl mt-1">({selectedVehicle.licensePlate})</div>
          </CardTitle>
        </div>
        <div className="w-[100px] flex justify-end">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="no-print gap-2 border-gray-300 hover:bg-gray-100"
          >
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-x-auto">
        {/* MONTH FILTER */}
        <div className="mb-4 flex items-center gap-3 no-print">
          <Label className="text-sm font-medium text-gray-700">Periode:</Label>
          <Input
            type="month"
            value={selectedMonthFuel}
            onChange={(e) => onMonthChange(e.target.value)}
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
                    JUMLAH VOLUME
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
                    className="px-3 py-2 text-center text-sm font-bold text-black no-print"
                  >
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {filteredFuelRecords.length > 0 ? (
                  (() => {
                    let runningNumber = 0;
                    return filteredFuelRecords.map(
                      (record: any, idx: number) => {
                        runningNumber++;
                        return (
                          <tr key={record.id || idx} className="bg-white">
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              {runningNumber}
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              {new Date(record.date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              {record.liters?.toLocaleString("id-ID", {
                                minimumFractionDigits: 3,
                                maximumFractionDigits: 3,
                              })}
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              <div className="flex justify-between w-full px-2">
                                <span>Rp</span>
                                <span>
                                  {record.pricePerLiter?.toLocaleString(
                                    "id-ID"
                                  )}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-right text-sm text-black border-r border-black">
                              <div className="flex justify-between w-full px-2">
                                <span>Rp</span>
                                <span>
                                  {record.totalCost?.toLocaleString("id-ID")}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center no-print border-r border-black">
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => onEdit(record)}
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
                                        Data ini akan dihapus permanen.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Batal
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onDelete(record.id)}
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
                      }
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
                      <span>{totalCost.toLocaleString("id-ID")}</span>
                    </div>
                  </td>
                  <td className="no-print"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-8 flex justify-end">
          <div className="text-center">
            <p className="text-sm text-black mb-16">
              Bogor, {formatDate(lastDayOfMonthFuel)}
            </p>
            <p className="text-sm text-black font-bold">Kasubbag. Kendaraan</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Memoized Rekap Tol Table Component
export const RekapTolTable = memo(function RekapTolTable({
  selectedVehicle,
  vehicleTypeLabel,
  selectedMonthToll,
  onMonthChange,
  filteredTollRecords,
  totalTollCost,
  lastDayOfMonthToll,
  onEdit,
  onDelete,
}: RekapTolTableProps) {
  return (
    <Card className="border-0 shadow-xl bg-white rounded-[2rem] overflow-hidden mt-6 print-area">
      <CardHeader className="bg-white px-4 py-2 border-b border-gray-100 flex flex-row items-center justify-between">
        <div className="w-[100px] flex justify-start">
          <LogoBKN />
        </div>
        <div className="flex-1 text-center">
          <CardTitle className="font-bold text-black uppercase text-lg leading-snug">
            REKAPITULASI E-TOL KENDARAAN {vehicleTypeLabel}
            <div className="text-xl mt-1">({selectedVehicle.licensePlate})</div>
          </CardTitle>
        </div>
        <div className="w-[100px] flex justify-end">
          <Button
            variant="outline"
            onClick={() => window.print()}
            className="no-print gap-2 border-gray-300 hover:bg-gray-100"
          >
            <Printer className="w-4 h-4" /> Print
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 overflow-x-auto">
        {/* MONTH FILTER */}
        <div className="mb-4 flex items-center gap-3 no-print">
          <Label className="text-sm font-medium text-gray-700">Periode:</Label>
          <Input
            type="month"
            value={selectedMonthToll}
            onChange={(e) => onMonthChange(e.target.value)}
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
                    className="px-3 py-2 text-center text-sm font-bold text-black no-print"
                  >
                    AKSI
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {filteredTollRecords.length > 0 ? (
                  (() => {
                    let runningNumber = 0;
                    return filteredTollRecords.map(
                      (record: any, idx: number) => {
                        runningNumber++;
                        return (
                          <tr key={record.id || idx} className="bg-white">
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              {runningNumber}
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              {new Date(record.date).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                }
                              )}
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              <div className="flex justify-between w-full px-2">
                                <span>Rp</span>
                                <span>
                                  {record.cost?.toLocaleString("id-ID")}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                              1
                            </td>
                            <td className="px-3 py-2 text-right text-sm text-black border-r border-black">
                              <div className="flex justify-between w-full px-2">
                                <span>Rp</span>
                                <span>
                                  {record.cost?.toLocaleString("id-ID")}
                                </span>
                              </div>
                            </td>
                            <td className="px-3 py-2 text-center no-print border-r border-black">
                              <div className="flex justify-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => onEdit(record)}
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
                                        Data ini akan dihapus permanen.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Batal
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => onDelete(record.id)}
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
                      }
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
                    colSpan={3}
                    className="px-3 py-2 text-center text-sm text-black border-r border-black uppercase tracking-wider"
                  >
                    TOTAL
                  </td>
                  <td className="px-3 py-2 text-center text-sm text-black border-r border-black">
                    {filteredTollRecords.length}
                  </td>
                  <td className="px-3 py-2 text-right text-sm text-black">
                    <div className="flex justify-between w-full px-2">
                      <span>Rp</span>
                      <span>{totalTollCost.toLocaleString("id-ID")}</span>
                    </div>
                  </td>
                  <td className="no-print"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="mt-8 flex justify-end">
          <div className="text-center">
            <p className="text-sm text-black mb-16">
              Bogor, {formatDate(lastDayOfMonthToll)}
            </p>
            <p className="text-sm text-black font-bold">Kasubbag. Kendaraan</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
