import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace TabsList
old_tabs_list = '''          <TabsList className="grid w-full grid-cols-3 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm">
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
          </TabsList>'''

new_tabs_list = """          <TabsList className={reportCategory === 'servis' ? "grid w-full grid-cols-3 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm" : "grid w-full grid-cols-2 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-gray-100 shadow-sm"}>
            <TabsTrigger
              value="trends"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center gap-2 py-2.5 font-semibold text-gray-600"
            >
              <LineChartIcon className="w-4 h-4" />
              Tren Biaya
            </TabsTrigger>
            {reportCategory === 'servis' && (
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center gap-2 py-2.5 font-semibold text-gray-600"
              >
                <PieChartIcon className="w-4 h-4" />
                Jenis Servis
              </TabsTrigger>
            )}
            <TabsTrigger
              value="vehicles"
              className="data-[state=active]:bg-white data-[state=active]:text-purple-700 data-[state=active]:shadow-md rounded-xl transition-all duration-300 flex items-center gap-2 py-2.5 font-semibold text-gray-600"
            >
              <BarChart3 className="w-4 h-4" />
              Per Kendaraan
            </TabsTrigger>
          </TabsList>"""
content = content.replace(old_tabs_list, new_tabs_list)


# Replace Tren Biaya Content
old_tren_biaya = '''                  <ResponsiveContainer width="100%" height="100%">
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
                  </ResponsiveContainer>'''

new_tren_biaya = """                  <ResponsiveContainer width="100%" height="100%">
                    {reportCategory === 'servis' ? (
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
                    ) : (
                      <LineChart data={monthlyFuelTollCosts}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }} dy={10} />
                        <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontSize: 12, fontWeight: 500 }} dx={-10} />
                        <Tooltip
                          formatter={(value: number | undefined, name: string) => [
                            `Rp ${(value ?? 0).toLocaleString("id-ID")}`,
                            name === 'fuel' ? 'BBM' : 'Tol',
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
                        />
                        <Line type="monotone" dataKey="fuel" stroke="#ea580c" strokeWidth={4} name="fuel" dot={{ fill: "white", stroke: "#ea580c", strokeWidth: 3, r: 6 }} activeDot={{ r: 8, stroke: "#ea580c", strokeWidth: 0, fill: "#ea580c" }} />
                        <Line type="monotone" dataKey="toll" stroke="#ca8a04" strokeWidth={4} name="toll" dot={{ fill: "white", stroke: "#ca8a04", strokeWidth: 3, r: 6 }} activeDot={{ r: 8, stroke: "#ca8a04", strokeWidth: 0, fill: "#ca8a04" }} />
                      </LineChart>
                    )}
                  </ResponsiveContainer>"""
content = content.replace(old_tren_biaya, new_tren_biaya)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
