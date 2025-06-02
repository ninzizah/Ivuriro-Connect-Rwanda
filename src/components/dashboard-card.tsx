
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  actionText?: string;
}

export default function DashboardCard({ title, description, href, icon: Icon, actionText = "Go to section" }: DashboardCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full animate-slide-in-up opacity-0" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
      <CardHeader className="flex flex-row items-center space-x-4 pb-4">
        <div className="p-3 rounded-full bg-accent/10 text-accent">
          <Icon className="h-8 w-8" />
        </div>
        <div>
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardContent>
      <CardContent className="pt-0">
         <Link href={href} passHref legacyBehavior>
          <Button variant="outline" className="w-full group">
            {actionText}
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
