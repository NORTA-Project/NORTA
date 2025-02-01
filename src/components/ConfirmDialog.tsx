import React from "react";
import "./ConfirmDialog.css";

interface ConfirmDialogProps {
message: string;
onConfirm: () => void;
onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ message, onConfirm, onCancel }) => {
return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
    <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <p>{message}</p>
        <div className="confirm-dialog-buttons">
        <button onClick={onConfirm} className="confirm-dialog-button confirm-dialog-confirm">Yes</button>
        <button onClick={onCancel} className="confirm-dialog-button confirm-dialog-cancel">No</button>
        </div>
    </div>
    </div>
);
};

export default ConfirmDialog;