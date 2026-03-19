import logo from "@/assets/react.svg";

export default function Logo() {
  return (
    <div className="flex items-center justify-center md:justify-start gap-3">
      <img src={logo} className="w-10 h-10 object-contain" alt="logo" />
      <h1 className="text-2xl font-bold tracking-tight">Website Name</h1>
    </div>
  );
}
