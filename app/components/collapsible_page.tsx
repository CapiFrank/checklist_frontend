import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretRight,
  faCircleMinus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import { usePage } from "~/contexts/page_context";
import type { Page } from "~/types/page";
import { useTasks } from "~/contexts/task_context";

type CollapsiblePageProps = {
  page: Page;
  allowAddingChildren?: boolean;
};

export default function CollapsiblePage({
  page,
  allowAddingChildren = true,
}: CollapsiblePageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(page.title);
  const { selectedPageId, setSelectedPageId, setSelectedCategory } = useTasks();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { isEditingMode, createPage, updatePage, deletePage } = usePage();
  const hasChildren = (page.children?.length ?? 0) > 0;

  const saveTitle = () => {
    if (title.trim() === "") return;
    setIsEditingTitle(false);
    updatePage(page.id!, title);
  };

  const handleClick = (pageId: string) => {
    setSelectedPageId(pageId);
    setSelectedCategory(undefined);
  };

  return (
    <div className="ml-4">
      <div className="flex items-center gap-2">
        {hasChildren && (
          <FontAwesomeIcon
            icon={isOpen ? faCaretDown : faCaretRight}
            className="cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          />
        )}

        {isEditingTitle && isEditingMode ? (
          <textarea
            ref={inputRef}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === "Enter" && saveTitle()}
            autoFocus
            rows={1}
            className="border-b border-slate-500 outline-none w-full resize-none overflow-hidden"
          />
        ) : (
          <span
            className={`w-full break-words whitespace-pre-wrap cursor-pointer p-2 ${
              isEditingMode
                ? ""
                : `select-none hover:bg-slate-700 active:bg-slate-900 ${selectedPageId === page.id ? "bg-slate-900" : ""}`
            }`}
            onClick={() =>
              isEditingMode
                ? setIsEditingTitle(true)
                : handleClick(page.id ?? "")
            }
          >
            {title}
          </span>
        )}

        {isEditingMode && (
          <div className="flex">
            {allowAddingChildren && (
              <FontAwesomeIcon
                icon={faCirclePlus}
                className="cursor-pointer text-slate-500 hover:text-slate-700 mr-2"
                onClick={() => {
                  createPage(page.id!, "Nueva página");
                  setIsOpen(true);
                }}
              />
            )}
            <FontAwesomeIcon
              icon={faCircleMinus}
              className="cursor-pointer text-slate-500 hover:text-slate-700"
              onClick={() => deletePage(page)}
            />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="ml-4 mt-2">
          {(page.children || []).map((child) => (
            <CollapsiblePage
              key={child.id}
              page={child}
              allowAddingChildren={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
