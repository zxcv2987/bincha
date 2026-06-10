import ModalHost from "@/features/modal/components/ModalHost";
import { CategoryStoreProvider } from "@/features/category/provider";
import { ModalStoreProvider } from "@/features/modal/provider";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalStoreProvider>
      <CategoryStoreProvider>
        {children}
        <ModalHost />
      </CategoryStoreProvider>
    </ModalStoreProvider>
  );
}
