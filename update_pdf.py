import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_pdf = '''      // Header Text - Aligned with the new logo size
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
      const fileName = `Laporan_Servis_${dateFrom}_${dateTo}.pdf`;'''

new_pdf = """      // Header Text - Aligned with the new logo size
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      // Adjusted X position to be consistent with logo width + padding
      doc.text("PUSBANG SDM BKN", 40, 20);

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(reportCategory === 'servis' ? "LAPORAN SERVIS KENDARAAN" : "LAPORAN BBM & TOL", 40, 28);

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

      if (reportCategory === 'servis') {
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
      } else {
        // BBM & Tol PDF Layout
        doc.text(`Biaya BBM:`, 14, 65);
        doc.setFont("helvetica", "bold");
        doc.text(`Rp ${totalFuelCost.toLocaleString("id-ID")}`, 60, 65);

        doc.setFont("helvetica", "normal");
        doc.text(`Biaya Tol:`, 14, 72);
        doc.setFont("helvetica", "bold");
        doc.text(`Rp ${totalTollCost.toLocaleString("id-ID")}`, 60, 72);

        doc.setFont("helvetica", "normal");
        doc.text(`Total Liter:`, 110, 65);
        doc.setFont("helvetica", "bold");
        doc.text(`${totalLiters.toFixed(2)} L`, 150, 65);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Total Biaya:`, 110, 72);
        doc.setFont("helvetica", "bold");
        doc.text(`Rp ${(totalFuelCost + totalTollCost).toLocaleString("id-ID")}`, 150, 72);

        // Monthly BBM & Tol Costs Table
        if (monthlyFuelTollCosts.length > 0) {
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Tren Biaya Bulanan", 14, 95);

          autoTable(doc, {
            startY: 100,
            head: [["Bulan", "BBM", "Tol", "Total"]],
            body: monthlyFuelTollCosts.map((item) => [
              item.month,
              `Rp ${item.fuel.toLocaleString("id-ID")}`,
              `Rp ${item.toll.toLocaleString("id-ID")}`,
              `Rp ${item.total.toLocaleString("id-ID")}`,
            ]),
            theme: "striped",
            headStyles: { fillColor: [234, 88, 12], textColor: 255 },
            styles: { fontSize: 10 },
          });
        }

        // Add new page for Vehicle Expenses
        if (vehicleFuelTollCosts.length > 0) {
          doc.addPage();

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text("Biaya per Kendaraan", 14, 20);

          autoTable(doc, {
            startY: 25,
            head: [["Kendaraan", "BBM", "Tol", "Total"]],
            body: vehicleFuelTollCosts.map((item) => [
              item.vehicle,
              `Rp ${item.fuel.toLocaleString("id-ID")}`,
              `Rp ${item.toll.toLocaleString("id-ID")}`,
              `Rp ${item.total.toLocaleString("id-ID")}`,
            ]),
            theme: "striped",
            headStyles: { fillColor: [202, 138, 4], textColor: 255 },
            styles: { fontSize: 9 },
            columnStyles: { 0: { cellWidth: 70 } },
          });
        }
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
      const fileName = reportCategory === 'servis' ? `Laporan_Servis_${dateFrom}_${dateTo}.pdf` : `Laporan_BBM_Tol_${dateFrom}_${dateTo}.pdf`;"""

content = content.replace(old_pdf, new_pdf)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
