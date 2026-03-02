"use client";

import type { ReactNode } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ListingActionAlertDialogProps = {
  actionLabel: string;
  cancelLabel: string;
  children?: ReactNode;
  description: string;
  disabled?: boolean;
  onAction: () => void;
  title: string;
  trigger: ReactNode;
  actionClassName?: string;
};

export function ListingActionAlertDialog({
  actionClassName,
  actionLabel,
  cancelLabel,
  children,
  description,
  disabled = false,
  onAction,
  title,
  trigger,
}: ListingActionAlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={disabled}>
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            className={actionClassName}
            disabled={disabled}
            onClick={onAction}
          >
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
