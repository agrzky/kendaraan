import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ServiceHistory } from "@/components/service-history"

export default function ServiceHistoryPage() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <ServiceHistory />
      </DashboardLayout>
    </AuthGuard>
  )
}
