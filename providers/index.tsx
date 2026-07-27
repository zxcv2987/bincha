import { CategoryStoreProvider } from "@/features/category/provider";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CategoryStoreProvider>{children}</CategoryStoreProvider>;
}
