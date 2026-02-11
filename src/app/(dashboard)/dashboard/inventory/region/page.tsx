import InventoryDetail from "@/features/Inventory/component/InventoryDetail";
import { Suspense } from "react";

export default function page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <InventoryDetail />
      </Suspense>
    </div>
  );
}
