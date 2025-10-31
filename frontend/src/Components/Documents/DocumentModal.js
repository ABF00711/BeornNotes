import { Modal } from "antd";
import { getDocumentSchema } from "./documentSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState, useRef } from "react";
import Input from "smart-webcomponents-react/input";
import useDocuments from "../../Hooks/useDocuments";

function DocumentModal({ isOpen, setIsOpen, role, initData = null, documentData, customer }) {
    const [isLoading, setLoading] = useState(false);
    const { createDocument, updateDocument } = useDocuments();
    const fileInputRef = useRef(null);

    const customerSchema = useMemo(() => {
        return getDocumentSchema(documentData.mandatories, documentData.labels, role);
    }, [documentData, role]);

    const defaultValues = useMemo(() => {
        if (!initData || Object.keys(initData).length === 0) {
            // Add mode: empty defaults
            return {
                description: "",
                name: undefined
            };
        }
        // Update mode: use initData but don't set file field (can't pre-populate file inputs)
        return {
            description: initData.description || "",
            name: undefined // File input stays empty, user can select new file or keep existing
        };
    }, [initData]);

    const { handleSubmit, control, reset, formState: { errors, isSubmitting }, trigger } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues,
    });

    // Helper function to clear file input
    const clearFileInput = () => {
        // Method 1: Use ref if available
        if (fileInputRef.current) {
            const input = fileInputRef.current.nativeElement || fileInputRef.current.querySelector?.('input[type="file"]') || fileInputRef.current;
            if (input && input.value !== undefined) {
                input.value = '';
            }
        }
        // Method 2: Find within modal (wait for DOM to be ready)
        setTimeout(() => {
            // Find modal container and then file input within it
            const modal = document.querySelector('.ant-modal-content');
            if (modal) {
                const fileInput = modal.querySelector('input[type="file"]');
                if (fileInput) {
                    fileInput.value = '';
                }
            }
        }, 0);
    };

    useEffect(() => {
        if (isOpen) {
            // Clear file input when modal opens (especially for Add mode)
            clearFileInput();
            
            if (role === "update" && initData && Object.keys(initData).length > 0) {
                // Reset with description, but keep file field undefined (can't pre-populate)
                reset({
                    description: initData.description || "",
                    name: undefined
                });
            } else {
                // Reset to empty for Add mode
                reset({
                    description: "",
                    name: undefined
                });
            }
        }
    }, [isOpen, role, initData, reset])

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // data.name is a File object if user selected a new file, or undefined if keeping existing
            const documentFile = data.name; // Field name is "name", not "file"
            const fileName = documentFile?.name || (initData?.name || ''); // Use new file name or existing name

            const documentInfo = {
                name: fileName,
                description: data.description,
            }

            documentInfo.customer = customer;
            for (const key in documentInfo) {
                if (typeof (documentInfo[key]) == "string") documentInfo[key] = documentInfo[key].trim();
            }
            if (role === "update") {
                documentInfo.id = initData.id;
                documentInfo.documentUrl = initData.documentUrl;
                // If no new file selected (documentFile is undefined), pass null to keep existing file
                await updateDocument(documentFile || null, documentInfo);
            } else {
                // In Add mode, documentFile is required
                await createDocument(documentFile, documentInfo);
            }
            // Clear file input directly (reset() doesn't clear file inputs)
            clearFileInput();
            reset({
                description: "",
                name: undefined
            });
            setIsOpen(false);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
        // Clear file input directly
        clearFileInput();
        setIsOpen(false);
        reset();
    };

    useEffect(() => {
        if (isOpen) {
            trigger();
        }
    }, [isOpen])

    return (
        <Modal
            open={isOpen}
            onCancel={onCancel}
            onOk={handleSubmit(onSubmit)}
            okText={isLoading ? (role === "update" ? "Updating..." : "Creating...") : (role === "update" ? "Update" : "Create")}
            cancelText="Cancel"
            okButtonProps={{ disabled: isSubmitting || isLoading }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="title">
                    {role === "update" ? 'Update' : 'Add'}
                </div>

                <div className={`field-container ${errors.description ? 'has-error' : ''}`}>
                    <label>{documentData.labels.description}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    value={field.value || ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {errors.description && <p>{errors.description.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.name ? 'has-error' : ''}`}>
                    <label>{documentData.labels.name}</label>
                    <div style={{ width: "60%" }}>
                        {role === "update" && initData?.name && (
                            <div style={{ marginBottom: "8px", fontSize: "12px", color: "#666" }}>
                                Current file: <strong>{initData.name}</strong>
                                {initData.documentUrl && (
                                    <a
                                        href={initData.documentUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ marginLeft: "8px", color: "#1890ff" }}
                                    >
                                        (View)
                                    </a>
                                )}
                            </div>
                        )}
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    ref={(el) => {
                                        // Get the underlying native input element
                                        if (el) {
                                            fileInputRef.current = el.nativeElement || el.querySelector('input[type="file"]') || el;
                                        }
                                    }}
                                    type="file"
                                    onChange={(e) => { field.onChange(e.target.files[0] || undefined) }}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {role === "update" && (
                            <div style={{ marginTop: "4px", fontSize: "12px", color: "#666" }}>
                                Leave empty to keep existing file
                            </div>
                        )}
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default DocumentModal;