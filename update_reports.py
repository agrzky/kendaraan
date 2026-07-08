import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

state_old = """  // State for report data
  const [monthlyServiceCosts, setMonthlyServiceCosts] = useState<any[]>([]);
  const [serviceTypeDistribution, setServiceTypeDistribution] = useState<any[]>(
    []
  );
  const [vehicleServiceFrequency, setVehicleServiceFrequency] = useState<any[]>(
    []
  );

  const [totalServices, setTotalServices] = useState(0);
  const [totalCost, setTotalCost] = useState(0);"""

state_new = """  const [reportCategory, setReportCategory] = useState("servis");

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

  // State for BBM & Tol
  const [totalFuelCost, setTotalFuelCost] = useState(0);
  const [totalTollCost, setTotalTollCost] = useState(0);
  const [totalLiters, setTotalLiters] = useState(0);
  const [monthlyFuelTollCosts, setMonthlyFuelTollCosts] = useState<any[]>([]);
  const [vehicleFuelTollCosts, setVehicleFuelTollCosts] = useState<any[]>([]);"""

content = content.replace(state_old, state_new)

fetch_old = """      // Fetch maintenances
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
      }"""

fetch_new = """      const [resMaintenances, resFuel, resToll] = await Promise.all([
        fetch("/api/maintenances"),
        fetch("/api/fuel"),
        fetch("/api/toll")
      ]);

      const dataMaintenances = await resMaintenances.json();
      const dataFuel = await resFuel.json();
      const dataToll = await resToll.json();

      if (dataMaintenances.success && dataMaintenances.maintenances.length > 0) {
        const maintenances = dataMaintenances.maintenances;

        const total = maintenances.length;
        const totalCostValue = maintenances.reduce(
          (sum: number, m: any) => sum + (m.cost || 0),
          0
        );

        setTotalServices(total);
        setTotalCost(totalCostValue);

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
        setTotalServices(0);
        setTotalCost(0);
        setMonthlyServiceCosts([]);
        setServiceTypeDistribution([]);
        setVehicleServiceFrequency([]);
      }

      if (dataFuel.success && dataToll.success) {
        const excludedPlates = ["B 7381 TPA", "F 1562 H"];
        const fuels = dataFuel.records.filter((r: any) => !excludedPlates.includes(r.vehicle?.licensePlate));
        const tolls = dataToll.records.filter((r: any) => !excludedPlates.includes(r.vehicle?.licensePlate));

        const fuelCost = fuels.reduce((sum: number, r: any) => sum + (r.totalCost || 0), 0);
        const tollCost = tolls.reduce((sum: number, r: any) => sum + (r.cost || 0), 0);
        const liters = fuels.reduce((sum: number, r: any) => sum + (r.liters || 0), 0);

        setTotalFuelCost(fuelCost);
        setTotalTollCost(tollCost);
        setTotalLiters(liters);

        const monthlyData: { [key: string]: { fuel: number; toll: number } } = {};
        
        const processDate = (dateStr: string, cost: number, isFuel: boolean) => {
          const date = new Date(dateStr);
          const monthKey = date.toLocaleDateString("id-ID", { month: "short" });
          if (!monthlyData[monthKey]) monthlyData[monthKey] = { fuel: 0, toll: 0 };
          if (isFuel) monthlyData[monthKey].fuel += cost;
          else monthlyData[monthKey].toll += cost;
        };

        fuels.forEach((r: any) => processDate(r.date, r.totalCost || 0, true));
        tolls.forEach((r: any) => processDate(r.date, r.cost || 0, false));

        const monthlyArray = Object.entries(monthlyData).map(([month, data]) => ({
          month,
          fuel: data.fuel,
          toll: data.toll,
          total: data.fuel + data.toll
        }));
        setMonthlyFuelTollCosts(monthlyArray);

        const vehicleData: { [key: string]: { fuel: number; toll: number; name: string } } = {};
        
        fuels.forEach((r: any) => {
          const vehicleId = r.vehicleId;
          const name = `${r.vehicle.licensePlate} - ${r.vehicle.brand} ${r.vehicle.model}`;
          if (!vehicleData[vehicleId]) vehicleData[vehicleId] = { fuel: 0, toll: 0, name };
          vehicleData[vehicleId].fuel += r.totalCost || 0;
        });
        
        tolls.forEach((r: any) => {
          const vehicleId = r.vehicleId;
          const name = `${r.vehicle.licensePlate} - ${r.vehicle.brand} ${r.vehicle.model}`;
          if (!vehicleData[vehicleId]) vehicleData[vehicleId] = { fuel: 0, toll: 0, name };
          vehicleData[vehicleId].toll += r.cost || 0;
        });

        const vehicleArray = Object.values(vehicleData).map(data => ({
          vehicle: data.name,
          fuel: data.fuel,
          toll: data.toll,
          total: data.fuel + data.toll
        }));
        setVehicleFuelTollCosts(vehicleArray);
      } else {
        setTotalFuelCost(0);
        setTotalTollCost(0);
        setTotalLiters(0);
        setMonthlyFuelTollCosts([]);
        setVehicleFuelTollCosts([]);
      }"""

content = content.replace(fetch_old, fetch_new)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
