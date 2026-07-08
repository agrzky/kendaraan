import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Grid Cols
old_grid = '''<div className="grid grid-cols-1 md:grid-cols-4 gap-6">'''
new_grid = '''<div className="grid grid-cols-1 md:grid-cols-5 gap-6">'''
content = content.replace(old_grid, new_grid)

# 2. Add Kategori Selector
old_report_type = '''              <div className="space-y-2">
                <Label
                  htmlFor="reportType"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Jenis Laporan
                </Label>'''
new_report_category = '''              <div className="space-y-2">
                <Label
                  htmlFor="reportCategory"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Kategori
                </Label>
                <Select value={reportCategory} onValueChange={setReportCategory}>
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 bg-white/50 h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="servis">Servis Kendaraan</SelectItem>
                    <SelectItem value="bbm_tol">BBM & Tol</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="reportType"
                  className="text-sm font-bold text-gray-700 uppercase tracking-wider"
                >
                  Jenis Laporan
                </Label>'''
content = content.replace(old_report_type, new_report_category)

# 3. Modify Summary Cards to switch based on category
old_summary = '''      {/* Summary Cards */}
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
      </div>'''

new_summary = """      {/* Summary Cards */}
      {reportCategory === 'servis' ? (
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Biaya BBM
                </CardTitle>
                <div className="p-2.5 bg-orange-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6">
                <div className="text-2xl font-extrabold text-orange-900 mb-1">
                  Rp {totalFuelCost.toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Biaya Tol
                </CardTitle>
                <div className="p-2.5 bg-yellow-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6">
                <div className="text-2xl font-extrabold text-yellow-900 mb-1">
                  Rp {totalTollCost.toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Total Biaya
                </CardTitle>
                <div className="p-2.5 bg-green-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6">
                <div className="text-2xl font-extrabold text-green-900 mb-1">
                  Rp {(totalFuelCost + totalTollCost).toLocaleString("id-ID")}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white rounded-[2rem] group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10 px-6 pt-6">
                <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                  Total Liter BBM
                </CardTitle>
                <div className="p-2.5 bg-blue-100/50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Car className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10 px-6 pb-6">
                <div className="text-2xl font-extrabold text-blue-900 mb-1">
                  {totalLiters.toFixed(2)} L
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}"""
content = content.replace(old_summary, new_summary)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
