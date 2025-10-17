import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "antd";
import "./style.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useDynamicData from "../../Hooks/useDynamicData";
import useJob from "../../Hooks/useJob";
import useCustomers3 from "../../Hooks/useCustomers3";
import { ComboBox } from "smart-webcomponents-react/combobox";
import { Input } from "smart-webcomponents-react/input";
import { DateTimePicker } from "smart-webcomponents-react/datetimepicker";
import 'smart-webcomponents-react/source/styles/smart.default.css';
import { getCustomerSchema } from "./customerSchema";
import useSearchConfig from "../../Hooks/useSearchConfig";

function DynamicModal({ table_name, isOpen, setIsOpen, role, initData = {} }) {
    const [isLoading, setIsLoading] = useState(false);
    const { jobs, getJobs } = useJob();
    const { searchConfig } = useSearchConfig();
    const { formatDateForInput, getLabels, labels, mandatoryFields, getMandatoryFields } = useCustomers3();
    const { createDynamicData, updateDynamicData } = useDynamicData();

    const customerSchema = useMemo(() => {
        return getCustomerSchema(mandatoryFields);
    }, [mandatoryFields]);

    const defaultValues = useMemo(() => {
        if (!initData || Object.keys(initData).length === 0) return {};

        const formattedData = { ...initData };
        if (formattedData.birthday) {
            formattedData.birthday = formatDateForInput(formattedData.birthday);
        }
        return formattedData;
    }, [initData]);

    const { handleSubmit, control, reset, formState: { errors, isSubmitting }, trigger } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues,
    });

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const selectedJob = jobs.find((job) => job.name == data.job);
            if(selectedJob){
                data.job = selectedJob.id;
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
        } finally {
            setIsLoading(false);
        }
    };

    const onCancel = () => {
        setIsOpen(false);
        reset();
    };

    useEffect(() => {
        if (isOpen) {
            getJobs();
            trigger();
        }
    }, [isOpen])

    useEffect(() => {
        getLabels();
        getMandatoryFields();
    }, [searchConfig])

    useEffect(() => {
        if (initData && Object.keys(initData).length > 0) {
            const formattedData = { ...initData };
            if (formattedData.birthday) {
                formattedData.birthday = formatDateForInput(formattedData.birthday);
            }
            reset(formattedData);
        }
    }, [initData, reset]);

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

                {/* Fullname */}
                <div className={`field-container ${errors.fullname ? 'has-error' : ''}`}>
                    <label>{labels.fullname}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="fullname"
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
                        {errors.fullname && <p>{errors.fullname.message}</p>}
                    </div>
                </div>

                {/* Displayname */}
                <div className={`field-container ${errors.displayname ? 'has-error' : ''}`}>
                    <label>{labels.displayname}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="displayname"
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
                        {errors.displayname && <p>{errors.displayname.message}</p>}
                    </div>
                </div>

                {/* Birthday (Date Picker) */}
                <div className={`field-container ${errors.birthday ? 'has-error' : ''}`}>
                    <label>{labels.birthday}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="birthday"
                            control={control}
                            render={({ field }) => (
                                <input
                                    type="date"
                                    className="dateTimePicker"
                                    value={field.value ? field.value.split('T')[0] : ''}
                                    onChange={(e) => {
                                        const dateValue = e.target.value
                                            ? new Date(e.target.value).toISOString()
                                            : null;
                                        field.onChange(dateValue);
                                    }}
                                />
                            )}
                        />
                        {errors.birthday && <p>{errors.birthday.message}</p>}
                    </div>
                </div>

                {/* Age (Numeric Input) */}
                <div className={`field-container ${errors.age ? 'has-error' : ''}`}>
                    <label>{labels.age}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="age"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="number"
                                    value={field.value != null ? String(field.value) : ''}
                                    onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value, 10) : undefined)}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {errors.age && <p>{errors.age.message}</p>}
                    </div>
                </div>

                {/* Job (ComboBox) */}
                <div className={`field-container ${errors.job ? 'has-error' : ''}`}>
                    <label>{labels.job}</label>
                    <div style={{ width: "60%" }}>
                        <Controller
                            name="job"
                            control={control}
                            render={({ field }) => (
                                <ComboBox
                                    dataSource={jobs}
                                    displayMember="name"   // what user sees
                                    valueMember="name"     // what the ComboBox uses as actual value
                                    value={field.value ?? initData?.job ?? ''}
                                    onChange={(event) => {
                                        field.onChange(event.detail.value);
                                    }}
                                    style={{ height: "40px" }}
                                />
                            )}
                        />
                        {errors.job && <p>{errors.job.message}</p>}
                    </div>
                </div>
            </form>

        </Modal>
    );
}

export default DynamicModal;