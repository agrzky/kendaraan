import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Fetch all relevant data for the authenticated user
async function getVehicleContext(userId: string) {
  try {
    const vehicles = await prisma.vehicle.findMany({
      where: { ownerId: userId },
      include: {
        fuelRecords: {
          orderBy: { date: "desc" },
          take: 20, // Last 20 fuel records per vehicle
        },
        tollRecords: {
          orderBy: { date: "desc" },
          take: 20, // Last 20 toll records per vehicle
        },
        maintenances: {
          orderBy: { maintenanceDate: "desc" },
          take: 10, // Last 10 maintenance records per vehicle
        },
      },
    });

    if (vehicles.length === 0) {
      return "Pengguna belum memiliki data kendaraan.";
    }

    let context = `Data Kendaraan Pengguna (${vehicles.length} kendaraan):\n\n`;

    for (const vehicle of vehicles) {
      context += `--- Kendaraan: ${vehicle.brand} ${vehicle.model} (${vehicle.year}) ---\n`;
      context += `  Plat Nomor: ${vehicle.licensePlate}\n`;
      context += `  Jenis BBM: ${vehicle.fuelType || "Tidak diatur"}\n`;
      context += `  Status: ${vehicle.status}\n`;

      if (vehicle.lastServiceDate) {
        context += `  Servis Terakhir: ${vehicle.lastServiceDate.toLocaleDateString("id-ID")}\n`;
      }
      if (vehicle.nextServiceDate) {
        context += `  Servis Berikutnya: ${vehicle.nextServiceDate.toLocaleDateString("id-ID")}\n`;
      }
      if (vehicle.taxExpireDate) {
        context += `  Pajak Expired: ${vehicle.taxExpireDate.toLocaleDateString("id-ID")}\n`;
      }
      if (vehicle.lastServiceKm) {
        context += `  KM Servis Terakhir: ${vehicle.lastServiceKm.toLocaleString("id-ID")} km\n`;
      }
      if (vehicle.nextServiceKm) {
        context += `  KM Servis Berikutnya: ${vehicle.nextServiceKm.toLocaleString("id-ID")} km\n`;
      }

      // Fuel records summary
      if (vehicle.fuelRecords.length > 0) {
        const totalFuelCost = vehicle.fuelRecords.reduce(
          (sum, r) => sum + r.totalCost,
          0
        );
        const totalLiters = vehicle.fuelRecords.reduce(
          (sum, r) => sum + r.liters,
          0
        );
        context += `  Riwayat BBM (${vehicle.fuelRecords.length} record terakhir):\n`;
        context += `    Total Biaya BBM: Rp ${totalFuelCost.toLocaleString("id-ID")}\n`;
        context += `    Total Liter: ${totalLiters.toLocaleString("id-ID")} L\n`;

        // Detail per record
        for (const fuel of vehicle.fuelRecords.slice(0, 5)) {
          context += `    - ${fuel.date.toLocaleDateString("id-ID")}: ${fuel.fuelType} ${fuel.liters}L x Rp ${fuel.pricePerLiter.toLocaleString("id-ID")} = Rp ${fuel.totalCost.toLocaleString("id-ID")}`;
          if (fuel.driver) context += ` (Driver: ${fuel.driver})`;
          if (fuel.remarks) context += ` [${fuel.remarks}]`;
          context += `\n`;
        }
      }

      // Toll records summary
      if (vehicle.tollRecords.length > 0) {
        const totalTollCost = vehicle.tollRecords.reduce(
          (sum, r) => sum + r.cost,
          0
        );
        context += `  Riwayat Tol (${vehicle.tollRecords.length} record terakhir):\n`;
        context += `    Total Biaya Tol: Rp ${totalTollCost.toLocaleString("id-ID")}\n`;

        for (const toll of vehicle.tollRecords.slice(0, 5)) {
          context += `    - ${toll.date.toLocaleDateString("id-ID")}: Rp ${toll.cost.toLocaleString("id-ID")}`;
          if (toll.driver) context += ` (Driver: ${toll.driver})`;
          if (toll.remarks) context += ` [${toll.remarks}]`;
          context += `\n`;
        }
      }

      // Maintenance records summary
      if (vehicle.maintenances.length > 0) {
        const totalMaintenanceCost = vehicle.maintenances.reduce(
          (sum, r) => sum + (r.cost || 0),
          0
        );
        context += `  Riwayat Perawatan (${vehicle.maintenances.length} record terakhir):\n`;
        context += `    Total Biaya Perawatan: Rp ${totalMaintenanceCost.toLocaleString("id-ID")}\n`;

        for (const m of vehicle.maintenances.slice(0, 5)) {
          context += `    - ${m.maintenanceDate.toLocaleDateString("id-ID")}: ${m.type} - ${m.description}`;
          if (m.cost) context += ` (Rp ${m.cost.toLocaleString("id-ID")})`;
          context += ` [${m.status}]`;
          context += `\n`;
        }
      }

      context += `\n`;
    }

    return context;
  } catch (error) {
    console.error("Error fetching vehicle context:", error);
    return "Gagal mengambil data kendaraan dari database.";
  }
}

const SYSTEM_PROMPT = `Kamu adalah AI Assistant untuk Sistem Manajemen Kendaraan. Namamu adalah "KENDARAAN AI".

Tugasmu:
1. Membantu menganalisis data kendaraan, BBM, Tol, dan perawatan kendaraan milik pengguna
2. Memberikan rekomendasi perawatan kendaraan
3. Menganalisis pengeluaran BBM dan Tol
4. Menjawab pertanyaan seputar kendaraan, perawatan, dan efisiensi bahan bakar
5. Memberikan tips hemat BBM dan perawatan kendaraan

Aturan:
- Jawab selalu dalam Bahasa Indonesia
- Gunakan format yang rapi dan mudah dibaca
- Jika diminta analisis, berikan angka dan data yang spesifik dari context yang diberikan
- Jika data tidak tersedia, sampaikan dengan sopan
- Gunakan emoji yang relevan untuk memperjelas respons
- Jangan membuat data palsu, hanya gunakan data yang ada di context
- Berikan jawaban yang ringkas namun informatif
- Jika ditanya di luar konteks kendaraan, tetap jawab dengan sopan tapi ingatkan bahwa fokusmu adalah manajemen kendaraan`;

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { messages } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 }
      );
    }

    // Fetch vehicle data for context
    const vehicleContext = await getVehicleContext(user.userId);

    // Build messages for Groq
    const groqMessages = [
      {
        role: "system" as const,
        content: `${SYSTEM_PROMPT}\n\nBerikut adalah data kendaraan pengguna saat ini:\n\n${vehicleContext}\n\nTanggal hari ini: ${new Date().toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
      },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
    ];

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: groqMessages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
    });

    const reply =
      chatCompletion.choices[0]?.message?.content ||
      "Maaf, saya tidak bisa memberikan respons saat ini.";

    return NextResponse.json({
      message: reply,
      usage: chatCompletion.usage,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);

    // Handle Groq-specific errors
    if (error && typeof error === "object" && "status" in error) {
      const groqError = error as { status: number; message?: string };
      if (groqError.status === 429) {
        return NextResponse.json(
          {
            error:
              "Terlalu banyak permintaan. Silakan tunggu beberapa saat dan coba lagi.",
          },
          { status: 429 }
        );
      }
      if (groqError.status === 401) {
        return NextResponse.json(
          { error: "API key tidak valid. Hubungi administrator." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Terjadi kesalahan pada server. Silakan coba lagi." },
      { status: 500 }
    );
  }
}
