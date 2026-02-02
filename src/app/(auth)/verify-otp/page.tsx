import Verifycode from "@/features/auth/component/Verifycode";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verifycode />
    </Suspense>
  );
}
