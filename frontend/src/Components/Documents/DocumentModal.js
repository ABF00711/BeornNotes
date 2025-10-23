import { Modal } from "antd";
import useDynamicData from "../../Hooks/useDynamicData";
import { getDocumentSchema } from "./documentSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useCustomers from "../../Hooks/useCustomers";
import { useState } from "react";
import Input from "smart-webcomponents-react/input";

function DocumentModal ({ table_name, isOpen, setIsOpen, role, initData = {}, documentData }) {
    const [isLoading, setLoading] = useState(false);
    const {customers, getCustomers} = useCustomers();
    const { createDynamicData, updateDynamicData } = useDynamicData();

    const customerSchema = useMemo(() => {
        return getDocumentSchema(documentData.labels, documentData.mandatories);
    }, [documentData]);

    const { handleSubmit, control, reset, formState: { errors, isSubmitting }, trigger } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues: initData,
    });

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const selectedCustomer = customers.find((customer) => customer.displayname == data.customer);
            if(selectedCustomer){
                data.customer = selectedCustomer.id;
            }
            for (const key in data) {
                if(typeof(data[key]) == "string") data[key] = data[key].trim();
            }
            if (role === "update") {
                data.id = initData.id;
                await updateDynamicData(table_name, data);
            } else {
                await createDynamicData(table_name, data);
            }
            setIsOpen(false);
            reset();
        } catch (error) {
            console.error("Error submitting form:", error);
        }finally{
            setLoading(false);
        }
    };

    const onCancel = () => {
        setIsOpen(false);
        reset();
    };

    useEffect(() => {
        if (isOpen) {
            getCustomers();
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

                <div className={`field-container ${errors.name ? 'has-error' : ''}`}>
                    <label>{labels.name}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="name"
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
                        {errors.name && <p>{errors.name.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.description ? 'has-error' : ''}`}>
                    <label>{labels.description}</label>
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
                    <label>{labels.file}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="file"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="file"
                                    value={field.value != null ? String(field.value) : ''}
                                    onChange={(e) => field.onChange(e.target.value)}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {errors.file && <p>{errors.age.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.customer ? 'has-error' : ''}`}>
                    <label>{labels.customer}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="customer"
                            control={control}
                            render={({ field }) => (
                                <ComboBox
                                    dataSource={customers}
                                    displayMember="name"   // what user sees
                                    valueMember="name"     // what the ComboBox uses as actual value
                                    value={field.value ?? initData?.customer ?? ''}
                                    onChange={(event) => {
                                        field.onChange(event.detail.value);
                                    }}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {errors.customer && <p>{errors.customer.message}</p>}
                    </div>
                </div>
            </form>
        </Modal>
    );
}

export default DocumentModal;