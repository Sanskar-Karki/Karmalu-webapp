"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { importBuiltInCatalog } from "@/app/admin/actions";
import { buttonPrimary } from "@/lib/admin-ui";
import { useToast } from "@/components/admin/Toaster";

export default function ImportCatalogButton() {
  const router = useRouter();
  const toast = useToast();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      className={buttonPrimary}
      onClick={() =>
        start(async () => {
          try {
            const res = await importBuiltInCatalog();
            if (res.ok) {
              toast.success(
                "Products imported",
                `${res.data.products} products and ${res.data.categories} categories are now editable here.`,
              );
              router.refresh();
            } else {
              toast.error("Import failed", res.error);
            }
          } catch {
            toast.error("Import failed", "The connection dropped. Check your internet and try again.");
          }
        })
      }
    >
      {pending ? "Importing…" : "Import current products"}
    </button>
  );
}
