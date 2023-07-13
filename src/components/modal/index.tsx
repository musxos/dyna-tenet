import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useOnClickOutside } from "usehooks-ts";

export type ModalProps = {
  className?: string;
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export default function Modal(props: ModalProps) {
  const ref = useRef<any>(null);
  const modalRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useOnClickOutside(modalRef, () => props.setOpen && props.setOpen(false));

  useEffect(() => {
    ref.current = document.getElementById("modal-root");
    setMounted(true);
  }, []);

  return mounted && props.open
    ? createPortal(
        <div className="fixed  top-0 left-0 w-full h-full overflow-hidden bg-black/40 z-50 flex items-center justify-center">
          <div ref={modalRef} className={props.className}>
            {props.children}
          </div>
        </div>,
        ref.current,
      )
    : null;
}
