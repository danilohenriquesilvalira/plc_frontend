import React, { createContext, useContext, useState } from "react";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ 
  value, 
  onValueChange, 
  className = "", 
  children 
}) => {
  return (
    <TabsContext.Provider value={{ value, onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  className?: string;
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ className = "", children }) => {
  return (
    <div className={`flex space-x-1 rounded-lg p-1 ${className}`}>
      {children}
    </div>
  );
};

interface TabsTriggerProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, className = "", children }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsTrigger must be used within a Tabs component");
  }
  
  const isActive = context.value === value;
  
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? "active" : "inactive"}
      className={`px-3 py-2 text-sm font-medium rounded-md transition-all 
                ${isActive ? "bg-blue-600 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-slate-700"} 
                ${className}`}
      onClick={() => context.onValueChange(value)}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  className?: string;
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, className = "", children }) => {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error("TabsContent must be used within a Tabs component");
  }
  
  if (context.value !== value) {
    return null;
  }
  
  return <div className={className}>{children}</div>;
};