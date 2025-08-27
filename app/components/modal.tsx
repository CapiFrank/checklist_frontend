import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareXmark } from "@fortawesome/free-solid-svg-icons";
import { useRef, useEffect, type FC } from "react";

interface ModalProps{
  children: React.ReactNode;
  show: boolean;
  onClose?: () => void;
}

const Modal:FC<ModalProps> = ({
  children,
  show,
  onClose = () => {},
}) => {
  const modalRef = useRef<HTMLDialogElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const closeModal = () => {
    onClose();
  };

  const handleClickOutside = (event: { target: any; }) => {
    if(modalContentRef.current === null) return;
    if (modalRef.current && !modalContentRef.current.contains(event.target)) {
      closeModal(); // Cerrar modal si se hace clic fuera del contenido
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [show]);

  return (
    <>
      {show && (
        <dialog
          ref={modalRef}
          className="fixed inset-0 w-full h-full border-none flex items-center justify-center bg-black/30 m-0 p-0 overflow-hidden z-50 transition-opacity duration-300 opacity-100"
          open
        >
          {/* Contenido del modal con transiciones */}
          <div
            ref={modalContentRef}
            className="bg-white p-6 relative flex flex-col transition-transform duration-300 transform border-none rounded-md shadow-md"
          >
            <FontAwesomeIcon
              icon={faSquareXmark}
              onClick={close}
              className="text-2xl flex absolute top-2 right-2 cursor-pointer rounded-md transition duration-150 ease-in-out active:outline-none active:ring-2 active:ring-offset-3 text-slate-800 hover:text-slate-700 active:text-slate-900 focus:text-slate-700 active:ring-slate-700"
            />
            {children}
          </div>
        </dialog>
      )}
    </>
  );
};

export default Modal;