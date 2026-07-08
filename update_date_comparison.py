import re

with open('components/reports.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the date filtering logic in maintenances
old_maintenances = '''        const maintenances = dataMaintenances.maintenances.filter((m: any) => {
          if (!dateFrom || !dateTo) return true;
          const d = new Date(m.maintenanceDate);
          return d >= new Date(dateFrom) && d <= new Date(dateTo);
        });'''

new_maintenances = '''        const maintenances = dataMaintenances.maintenances.filter((m: any) => {
          if (!dateFrom || !dateTo) return true;
          const recordDate = m.maintenanceDate.substring(0, 10);
          return recordDate >= dateFrom && recordDate <= dateTo;
        });'''
content = content.replace(old_maintenances, new_maintenances)

# Replace the date filtering logic in fuel and toll
old_fuel_toll = '''        const fuels = dataFuel.records.filter((r: any) => {
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

new_fuel_toll = '''        const fuels = dataFuel.records.filter((r: any) => {
          if (excludedPlates.includes(r.vehicle?.licensePlate)) return false;
          if (!dateFrom || !dateTo) return true;
          const recordDate = r.date.substring(0, 10);
          return recordDate >= dateFrom && recordDate <= dateTo;
        });
        const tolls = dataToll.records.filter((r: any) => {
          if (excludedPlates.includes(r.vehicle?.licensePlate)) return false;
          if (!dateFrom || !dateTo) return true;
          const recordDate = r.date.substring(0, 10);
          return recordDate >= dateFrom && recordDate <= dateTo;
        });'''
content = content.replace(old_fuel_toll, new_fuel_toll)

with open('components/reports.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
