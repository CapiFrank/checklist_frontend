import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import Swal from "sweetalert2";
import { pageService } from "~/services/page_service";
import type { Page } from "~/types/page";

// Helpers --------------------------
const showAlert = (title: string, icon: "success" | "error") =>
  Swal.fire({
    title,
    icon,
    showConfirmButton: false,
    timer: 1500,
  });

const confirmDialog = async (title: string) =>
  Swal.fire({
    title,
    icon: "question",
    showConfirmButton: true,
    showCancelButton: true,
  });

const attachToParent = (nodes: Page[], page: Page): Page[] =>
  nodes.map((node) =>
    node.id === page.parent_id
      ? { ...node, children: [...(node.children ?? []), page] }
      : { ...node, children: attachToParent(node.children ?? [], page) }
  );

const applyUpdate = (nodes: Page[], page: Page): Page[] =>
  nodes.map((node) =>
    node.id === page.id
      ? { ...node, title: page.title }
      : { ...node, children: applyUpdate(node.children ?? [], page) }
  );

const applyDelete = (nodes: Page[], pageId: string): Page[] =>
  nodes
    .filter((node) => node.id !== pageId)
    .map((node) => ({
      ...node,
      children: applyDelete(node.children ?? [], pageId),
    }));

// Context --------------------------
type PageContextType = {
  isEditingMode: boolean;
  setEditingMode: (value: boolean) => void;
  pages: Page[];
  setPages: (pages: Page[]) => void;
  createPage: (parentId: string | null, title: string) => void;
  updatePage: (pageId: string, title: string) => void;
  deletePage: (page: Page) => void;
  loadPages: () => Promise<void>;
};

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({ children }: { children: ReactNode }) {
  const [isEditingMode, setEditingMode] = useState(false);
  const [pages, setPages] = useState<Page[]>([]);

  const loadPages = useCallback(async () => {
    try {
      const response = await pageService.getPages();
      if (response.status === 200 && response.data) {
        setPages(response.data.data as Page[]);
      } else {
        showAlert("Ocurrió un error", "error");
      }
    } catch {
      showAlert("Ocurrió un error", "error");
    }
  }, []);

  const createPage = useCallback(
    async (parentId: string | null, title: string) => {
      try {
        const response = await pageService.createPage({ title, parent_id: parentId });
        if (response.status === 201 && response.data) {
          const page = response.data.data as Page;
          setPages((prev) =>
            page.parent_id ? attachToParent(prev, page) : [...prev, page]
          );
          showAlert("Página creada con éxito!", "success");
        } else {
          showAlert("Ocurrió un error", "error");
        }
      } catch {
        showAlert("Ocurrió un error", "error");
      }
    },
    []
  );

  const updatePage = useCallback(async (id: string, title: string) => {
    try {
      const response = await pageService.updatePage({ id, title });
      if (response.status === 200 && response.data) {
        const page = response.data.data as Page;
        setPages((prev) => applyUpdate(prev, page));
        showAlert("Página actualizada con éxito!", "success");
      } else {
        showAlert("Ocurrió un error", "error");
      }
    } catch {
      showAlert("Ocurrió un error", "error");
    }
  }, []);

  const deletePage = useCallback(async (page: Page) => {
    const { isConfirmed } = await confirmDialog("Desea eliminar la página?");
    if (!isConfirmed) return;

    try {
      const response = await pageService.deletePage(page);
      if (response.status === 200) {
        setPages((prev) => applyDelete(prev, page.id!));
        showAlert("Página eliminada con éxito", "success");
      } else {
        showAlert("Ocurrió un error", "error");
      }
    } catch {
      showAlert("Ocurrió un error", "error");
    }
  }, []);

  const value = useMemo<PageContextType>(
    () => ({
      isEditingMode,
      setEditingMode,
      pages,
      setPages,
      createPage,
      updatePage,
      deletePage,
      loadPages,
    }),
    [isEditingMode, pages, createPage, updatePage, deletePage, loadPages]
  );

  return <PageContext.Provider value={value}>{children}</PageContext.Provider>;
}

export function usePage() {
  const ctx = useContext(PageContext);
  if (!ctx) {
    throw new Error("usePage debe usarse dentro de <PageProvider>.");
  }
  return ctx;
}
