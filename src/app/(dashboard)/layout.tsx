import { DemoSessionProvider } from '@/components/providers/demo-session-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';
import { RightPanel } from '@/components/layout/right-panel';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DemoSessionProvider>
      <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Topbar />
          <div className="flex-1 flex min-w-0 overflow-hidden">
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
              {children}
            </main>
            <RightPanel />
          </div>
        </div>
      </div>
    </DemoSessionProvider>
  );
}
