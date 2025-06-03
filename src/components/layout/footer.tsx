
export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 mt-auto shadow-inner">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Ivuriro Connect. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
