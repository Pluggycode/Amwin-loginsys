export default function PendingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow text-center">
        <h1 className="text-2xl font-bold mb-2">
          Awaiting Approval
        </h1>
        <p className="text-gray-500">
          Your account is under review. You’ll be notified soon.
        </p>
      </div>
    </div>
  );
}