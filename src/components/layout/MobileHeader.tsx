import React from 'react';
import { Shield, Menu, X } from 'lucide-react';

interface MobileHeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const MobileHeader: React.FC<MobileHeaderProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  return (
      <div className="md:hidden fixed top-0 w-full bg-card/80 backdrop-blur-lg border-b border-border z-30 px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                  <Shield size={18} />
              </div>
              <span className="font-bold text-lg text-foreground">XPass</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-foreground">
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
      </div>
  );
};

export default MobileHeader;
