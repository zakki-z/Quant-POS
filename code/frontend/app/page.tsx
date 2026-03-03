import Link from 'next/link';

export default function Home() {
  return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 max-w-lg w-full">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">Quant POS</h1>
          <p className="text-gray-600 mb-8">
            A minimalist point-of-sale system. Manage your products, process orders, and handle transactions seamlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                href="/login"
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
                href="/register"
                className="flex-1 bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition"
            >
              Create Account
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100 text-sm text-gray-500 text-left">
            <p className="font-semibold mb-2">Quick Testing Tip:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Create an account as a <b>USER</b> to test the POS checkout.</li>
              <li>Create an account as an <b>ADMIN</b> to test adding, updating, or deleting products.</li>
            </ul>
          </div>
        </div>
      </div>
  );
}