export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 flex-col justify-between">
        <h1 className="text-3xl font-bold">Amwin CRM</h1>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Manage your business smarter
          </h2>
          <p className="mt-4 text-gray-200">
            Sales, Technical & Admin in one platform.
          </p>
        </div>

        <p className="text-sm text-gray-300">
          © {new Date().getFullYear()} Amwin Systems
        </p>
      </div>

      {/* Right Form Area */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gray-50 p-6">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}