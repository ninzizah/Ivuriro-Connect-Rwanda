
export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Rwanda Health Connect. All rights reserved.
        </p>
        <p className="text-xs mt-1">
          Empowering Rwandan Healthcare.
        </p>
      </div>
    </footer>
  );
}
