import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
  staticData: {
    breadcrumb: {
      getTitle: () => "Dashboard",
      getLink:  () => ({ "to": "/dashboard" })
    }
  }
})

import Breadcrumbs from '../../components/nav/Breadcrumbs';
import Topbar from '../../components/nav/Topbar';
import Navbar from '../../components/nav/Navbar';
import useRouteBreadcrumbs from '../../hooks/nav/useRouteBreadcrumbs';
import useRouteNavigation from '../../hooks/nav/useRouteNavigation';
import { useAuth } from '../../lib/auth';
import { useEffect } from 'react';

function DashboardLayout() {
  const breadcrumbsInfo = useRouteBreadcrumbs();
  const navbarInfo      = useRouteNavigation();

  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && user === null) {
      navigate({ to: "/login" });
    }
  }, [user, loading]);
 
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Clarity+City:wght@300;400;500;600&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap');
        html, body, #root { height: 100%; }
        .hz { font-family: 'Inter', system-ui, sans-serif; }
        input::placeholder { color: #8fa3b0; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #d0dae0; border-radius: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
      `}</style>
 
      <div className="hz flex flex-col h-screen overflow-hidden">
        <Topbar />

        <div className="flex flex-1 overflow-hidden">
          <Navbar {...navbarInfo} />
          
          <main className="p-4 flex-1 flex flex-col gap-4 overflow-y-scroll">
            <Breadcrumbs {...breadcrumbsInfo} />

            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}