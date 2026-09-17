export default function Loader() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950">
      <img
        src="/loaders/tomsom_turf_loader.gif"
        alt="Please wait..."
        className="w-16 h-16"
      />
      <span className='text-sm font-medium tracking-wide text-slate-300'>
        অনুগ্রহ করে অপেক্ষা করুন...
      </span>
    </div>
  );
}