export default function PageShell({ title, children }) {
    return (
      <div className="min-h-screen w-screen bg-gray-500 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-semibold text-gray-900 mb-6">{title}</h1>
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl p-6">
            {children}
          </div>
        </div>
      </div>
    );
  }
  