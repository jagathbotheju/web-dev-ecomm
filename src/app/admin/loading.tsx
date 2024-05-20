import { Loader2 } from "lucide-react";

const loading = () => {
  return (
    <div className="justify-center flex">
      <Loader2 className="size-24 animate-spin text-primary" />
    </div>
  );
};

export default loading;
