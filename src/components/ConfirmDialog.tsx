import "./ConfirmDialog.css";

interface ConfirmDialogProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    title?: string;
    confirmText?: string;
    cancelText?: string;
}

const ConfirmDialog = ({ 
    message, 
    onConfirm, 
    onCancel, 
    title = "確認",
    confirmText = "削除",
    cancelText = "キャンセル"
}: ConfirmDialogProps) => {
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="confirm-dialog-overlay" onClick={handleBackdropClick}>
            <div className="confirm-dialog">
                <div className="confirm-dialog-header">
                    <h3>{title}</h3>
                </div>
                <div className="confirm-dialog-body">
                    <p>{message}</p>
                </div>
                <div className="confirm-dialog-actions">
                    <button 
                        onClick={onCancel} 
                        className="confirm-dialog-button cancel-button"
                    >
                        {cancelText}
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="confirm-dialog-button confirm-button"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;