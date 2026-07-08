import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_vehicles = '''          <TabsContent
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
          </TabsContent>'''

new_vehicles = """          <TabsContent
            value="vehicles"
            className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
          >
            <Card className="border-0 shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-white/40 border-b border-gray-100 backdrop-blur-md px-8 py-6">
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-lg shadow-orange-500/20">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  {reportCategory === 'servis' ? 'Frekuensi Servis per Kendaraan' : 'Total Biaya per Kendaraan'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  {reportCategory === 'servis' ? (
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
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-gray-100">
                          <TableHead className="font-bold text-gray-500 uppercase tracking-wider text-xs pl-8 py-5">
                            Kendaraan
                          </TableHead>
                          <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                            Biaya BBM
                          </TableHead>
                          <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs py-5">
                            Biaya Tol
                          </TableHead>
                          <TableHead className="text-right font-bold text-gray-500 uppercase tracking-wider text-xs pr-8 py-5">
                            Total Biaya
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {vehicleFuelTollCosts.map((vehicle, index) => (
                          <tr
                            key={index}
                            className="hover:bg-orange-50/50 transition-all duration-200 border-gray-100"
                          >
                            <TableCell className="font-bold text-gray-900 pl-8">
                              {vehicle.vehicle}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-gray-900">
                              Rp {vehicle.fuel.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right font-semibold text-gray-900">
                              Rp {vehicle.toll.toLocaleString("id-ID")}
                            </TableCell>
                            <TableCell className="text-right font-bold text-orange-600 pr-8">
                              Rp {vehicle.total.toLocaleString("id-ID")}
                            </TableCell>
                          </tr>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>"""

content = content.replace(old_vehicles, new_vehicles)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
