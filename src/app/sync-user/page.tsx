import { redirect } from "next/navigation";

const SyncUser = async () => {
  // Better Auth writes directly to PostgreSQL, so no separate sync step is needed.
  return redirect("/dashboard");
};

export default SyncUser;