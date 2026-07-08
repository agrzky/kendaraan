import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update useEffect dependencies
old_use_effect = '''  useEffect(() => {
    fetchReportData();
  }, []);'''

new_use_effect = '''  useEffect(() => {
    fetchReportData();
  }, [dateFrom, dateTo]);'''
content = content.replace(old_use_effect, new_use_effect)

# 2. Add filtering to fetchReportData
old_fetch = '''      if (dataMaintenances.success && dataMaintenances.maintenances.length > 0) {
        const maintenances = dataMaintenances.maintenances;'''

new_fetch = '''      if (dataMaintenances.success && dataMaintenances.maintenances.length > 0) {
        const maintenances = dataMaintenances.maintenances.filter((m: any) => {
          if (!dateFrom || !dateTo) return true;
          const d = new Date(m.maintenanceDate);
          return d >= new Date(dateFrom) && d <= new Date(dateTo);
        });'''
content = content.replace(old_fetch, new_fetch)

old_fetch_fuel = '''      if (dataFuel.success && dataToll.success) {
        const excludedPlates = ["B 7381 TPA", "F 1562 H"];
        const fuels = dataFuel.records.filter((r: any) => !excludedPlates.includes(r.vehicle?.licensePlate));
        const tolls = dataToll.records.filter((r: any) => !excludedPlates.includes(r.vehicle?.licensePlate));'''

new_fetch_fuel = '''      if (dataFuel.success && dataToll.success) {
        const excludedPlates = ["B 7381 TPA", "F 1562 H"];
        const fuels = dataFuel.records.filter((r: any) => {
          if (excludedPlates.includes(r.vehicle?.licensePlate)) return false;
          if (!dateFrom || !dateTo) return true;
          const d = new Date(r.date);
          // Month inputs for toll might mean we should just check the year/month, but standard Date comparison works
          return d >= new Date(dateFrom) && d <= new Date(dateTo);
        });
        const tolls = dataToll.records.filter((r: any) => {
          if (excludedPlates.includes(r.vehicle?.licensePlate)) return false;
          if (!dateFrom || !dateTo) return true;
          const d = new Date(r.date);
          return d >= new Date(dateFrom) && d <= new Date(dateTo);
        });'''
content = content.replace(old_fetch_fuel, new_fetch_fuel)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
