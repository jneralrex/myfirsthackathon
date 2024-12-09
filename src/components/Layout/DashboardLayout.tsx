import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 pt-16 md:pt-0 p-4 md:p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;