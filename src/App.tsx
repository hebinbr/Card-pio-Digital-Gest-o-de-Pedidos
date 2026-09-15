import React, { useState } from 'react';
import { RestaurantProvider, useRestaurant } from './context/RestaurantContext';
import { Navbar } from './components/Navbar';
import { CustomerMenu } from './components/CustomerMenu';
import { AdminPanel } from './components/AdminPanel';
import { TableModal } from './components/TableModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';

const MainLayout: React.FC = () => {
  const { currentView } = useRestaurant();
  const [isTableModalOpen, setIsTableModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col text-zinc-900 font-sans">
      <Navbar onOpenTableModal={() => setIsTableModalOpen(true)} />

      <div className="flex-1">
        {currentView === 'menu' ? (
          <CustomerMenu onOpenTableModal={() => setIsTableModalOpen(true)} />
        ) : (
          <AdminPanel />
        )}
      </div>

      {/* Global Modals & Drawers */}
      <TableModal
        isOpen={isTableModalOpen}
        onClose={() => setIsTableModalOpen(false)}
      />

      <CartDrawer
        onOpenTableModal={() => setIsTableModalOpen(true)}
      />

      <OrderSuccessModal />
    </div>
  );
};

export default function App() {
  return (
    <RestaurantProvider>
      <MainLayout />
    </RestaurantProvider>
  );
}
