"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, ReactElement } from "react";
import { AlertColor, Snackbar, Alert, styled } from "@mui/material";

interface ToastContextType {
  showToast: (message: string, severity?: AlertColor) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: "12px",
  fontWeight: 600,
  fontSize: "0.875rem",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.4)",
  background: "rgba(17, 17, 24, 0.9) !important",
  backdropFilter: "blur(8px)",
  border: "1px solid rgba(255, 255, 255, 0.1) !important",
  color: "#F8FAFC !important",
  "& .MuiAlert-icon": {
    opacity: 0.9,
  },
  "&.MuiAlert-standardSuccess": {
    borderColor: "rgba(16, 185, 129, 0.2) !important",
    "& .MuiAlert-icon": { color: "#10B981" },
  },
  "&.MuiAlert-standardError": {
    borderColor: "rgba(239, 68, 68, 0.2) !important",
    "& .MuiAlert-icon": { color: "#EF4444" },
  },
  "&.MuiAlert-standardWarning": {
    borderColor: "rgba(245, 158, 11, 0.2) !important",
    "& .MuiAlert-icon": { color: "#F59E0B" },
  },
  "&.MuiAlert-standardInfo": {
    borderColor: "rgba(59, 130, 246, 0.2) !important",
    "& .MuiAlert-icon": { color: "#3B82F6" },
  },
}));

interface ToastContainerProps {
  open: boolean;
  message: string;
  severity: AlertColor;
  onClose: () => void;
}

const ToastContainer = (props: ToastContainerProps) => {
  return (
    <Snackbar
      open={props.open}
      autoHideDuration={5000}
      onClose={props.onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <StyledAlert onClose={props.onClose} severity={props.severity} variant="standard">
        {props.message}
      </StyledAlert>
    </Snackbar>
  );
};

export const ToastProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [toastState, setToastState] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  const handleClose = useCallback(() => {
    setToastState((prev) => ({ ...prev, open: false }));
  }, []);

  const showToast = useCallback((message: string, severity: AlertColor = "info") => {
    setToastState({
      open: true,
      message,
      severity,
    });
  }, []);

  const success = useCallback((msg: string) => showToast(msg, "success"), [showToast]);
  const error = useCallback((msg: string) => showToast(msg, "error"), [showToast]);
  const warn = useCallback((msg: string) => showToast(msg, "warning"), [showToast]);
  const info = useCallback((msg: string) => showToast(msg, "info"), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, error, warn, info }}>
      {children}
      <ToastContainer 
        open={toastState.open} 
        message={toastState.message} 
        severity={toastState.severity} 
        onClose={handleClose} 
      />
    </ToastContext.Provider>
  );
};

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
