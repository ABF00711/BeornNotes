import { Modal } from "antd";
import { getDocumentSchema } from "./documentSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import Input from "smart-webcomponents-react/input";
import useDocuments from "../../Hooks/useDocuments";

function DocumentModal({ isOpen, setIsOpen, role, initData = {}, documentData, customer }) {
    const [isLoading, setLoading] = useState(false);
    const {createDocument, updateDocument} = useDocuments();
    const [defaultValues, setDefaultValues] = useState(initData);

    const customerSchema = useMemo(() => {
        return getDocumentSchema(documentData.mandatories, documentData.labels);
    }, [documentData]);

    const { handleSubmit, control, reset, formState: { errors, isSubmitting }, trigger } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues
    });

    useEffect(() => {
        setDefaultValues(initData);
        if(role == "update"){
            reset(initData);
        }
    }, [initData])

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const documentInfo = {
                name: data.file.name,
                description: data.description,
            }

            const documentFile = data.file;

            documentInfo.customer = customer;
            for (const key in documentInfo) {
                if (typeof (documentInfo[key]) == "string") documentInfo[key] = documentInfo[key].trim();
            }
            if (role === "update") {
                documentInfo.id = initData.id;
                documentInfo.documentUrl = initData.documentUrl
                await updateDocument(documentFile, documentInfo);
            } else {
                await createDocument(documentFile, documentInfo);
            }
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setLoading(false);
        }
    };

    const onCancel = () => {
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
                    {role === "update" ? 'Update Customer' : 'Add New Customer'}
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

                <div className={`field-container ${errors.file ? 'has-error' : ''}`}>
                    <label>{documentData.labels.file}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="file"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="file"
                                    onChange={(e) => { field.onChange(e.target.files[0]) }}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {errors.file && <p>{errors.file.message}</p>}
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default DocumentModal;