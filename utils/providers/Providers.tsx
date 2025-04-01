import { CategoryStoreProvider } from "./CategoryProvider";
import { ModalStoreProvider } from "./ModalProvider";
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModalStoreProvider>
      <CategoryStoreProvider>{children}</CategoryStoreProvider>
    </ModalStoreProvider>
  );
}
