import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-red-600">
        403
      </h1>

      <p className="mt-3 text-gray-600">
        You are not authorized to access this page.
      </p>

      <Link
        to="/login"
        className="mt-5 px-5 py-2 bg-blue-600 text-white rounded-lg"
      >
        Go to Login
      </Link>
    </div>
  );
}

export default Unauthorized;