const Loader = ({ size = 'h-10 w-10' }) => {
  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 ${size}`} />
    </div>
  );
};

export default Loader;
