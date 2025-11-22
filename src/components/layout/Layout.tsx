import React, { type ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Sidebar, { type ViewType } from './Sidebar';
import ChatButton from '../chat/ChatButton';
import ChatBot from '../chat/ChatBot';

interface TaskCounts {
  all: number;
  pending: number;
  'in-progress': number;
  completed: number;
}

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  isSidebarOpen?: boolean;
  onSidebarToggle?: () => void;
  activeView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  taskCounts?: TaskCounts;
  onCreateTask?: () => void;
  selectedCategoryId?: string | null;
  onCategorySelect?: (categoryId: string | null) => void;
  disableCreateTask?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  showSidebar = false,
  isSidebarOpen = true,
  onSidebarToggle = () => {},
  activeView = 'all',
  onViewChange = () => {},
  taskCounts = { all: 0, pending: 0, 'in-progress': 0, completed: 0 },
  onCreateTask = () => {},
  selectedCategoryId,
  onCategorySelect = () => {},
  disableCreateTask = false,
}) => {
  // State management for chat open/close
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleChatOpen = () => {
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] transition-colors">
      <Navbar 
        onMenuToggle={showSidebar ? onSidebarToggle : undefined}
        isSidebarOpen={isSidebarOpen}
      />
      
      {showSidebar && (
        <Sidebar
          isOpen={isSidebarOpen}
          onToggle={onSidebarToggle}
          activeView={activeView}
          onViewChange={onViewChange}
          taskCounts={taskCounts}
          onCreateTask={onCreateTask}
          selectedCategoryId={selectedCategoryId}
          onCategorySelect={onCategorySelect}
          disableCreateTask={disableCreateTask}
        />
      )}

      <main
        className={`
          transition-all duration-300
          ${showSidebar && isSidebarOpen ? 'md:ml-[280px]' : 'md:ml-0'}
          px-3 sm:px-4 md:px-6 lg:px-8 pb-24 sm:pb-8
          pt-24 sm:pt-28
        `}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* AI Task Assistant Chat */}
      <ChatButton onClick={handleChatOpen} />
      <ChatBot isOpen={isChatOpen} onClose={handleChatClose} />
    </div>
  );
};

export default Layout;
