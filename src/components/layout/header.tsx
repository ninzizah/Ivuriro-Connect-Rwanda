
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse, LayoutDashboard, Clock, CalendarPlus, BedDouble, BrainCircuit, Menu, X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/wait-times', label: 'Wait Times', icon: Clock },
  { href: '/pre-registration', label: 'Pre-Register', icon: CalendarPlus },
  { href: '/bed-availability', label: 'Bed Availability', icon: BedDouble },
  { href: '/ai-hospital-suggestion', label: 'AI Suggestion', icon: BrainCircuit },
  { href: '/statistics', label: 'Statistics', icon: BarChart3 },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavLink = ({ href, label, icon: Icon, onClick }: { href: string; label: string; icon: React.ElementType; onClick?: () => void }) => (
    <Link href={href} passHref legacyBehavior>
      <a
        onClick={onClick}
        className={cn(
          "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out",
          pathname === href
            ? "bg-accent text-accent-foreground shadow-md hover:bg-accent/90" // Active state
            : "text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground" // Inactive state
        )}
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </a>
    </Link>
  );
  
  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" passHref legacyBehavior>
            <a className="flex items-center text-primary-foreground hover:text-primary-foreground/90 transition-colors">
              <HeartPulse className="h-8 w-8 mr-2 text-accent" />
              <span className="text-xl font-bold font-headline">Ivuriro Connect</span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </nav>

          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-primary text-primary-foreground p-4 w-64">
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center mb-4">
                     <Link href="/" passHref legacyBehavior>
                        <a onClick={() => setMobileMenuOpen(false)} className="flex items-center text-primary-foreground hover:text-primary-foreground/90 transition-colors">
                          <HeartPulse className="h-7 w-7 mr-2 text-accent" />
                          <span className="text-lg font-bold font-headline">Ivuriro Connect</span>
                        </a>
                      </Link>
                    <SheetClose asChild>
                       <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                        <X className="h-6 w-6" />
                        <span className="sr-only">Close menu</span>
                      </Button>
                    </SheetClose>
                  </div>
                  {navItems.map((item) => (
                     <NavLink key={item.href} href={item.href} label={item.label} icon={item.icon} onClick={() => setMobileMenuOpen(false)} />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
