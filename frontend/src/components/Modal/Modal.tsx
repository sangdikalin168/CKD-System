import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";


interface ModalProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onConfirm: () => void
  onCancel: () => void
  children: React.ReactElement
}

const Modal = ({
  open,
  setOpen,
  onConfirm,
  onCancel,
  children,
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-3xl">
        <div className="mt-3">
          {children}
        </div>
        <DialogFooter className="flex-row-reverse gap-2 sm:gap-0">
          <Button
            type="button"
            variant="default"
            onClick={() => { onConfirm(); }}
          >
            Confirm
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={() => { setOpen(false); onCancel(); }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
