import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Reports } from "@/components/reports"

export default function ReportsPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Reports />
      </DashboardLayout>
    </AuthGuard>
  )
}
