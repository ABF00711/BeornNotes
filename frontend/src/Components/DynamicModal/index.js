import React, { useEffect, useState, useMemo } from "react";
import { Modal } from "antd";
import "./style.css";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useDynamicData from "../../Hooks/useDynamicData";
import useJob from "../../Hooks/useJob";
import useCustomers3 from "../../Hooks/useCustomers3";
import InputableSelectField from "../InputableSelect/InputableSelectField";

function DynamicModal({ table_name, isOpen, setIsOpen, title, role, initData = {} }) {
    const [isLoading, setIsLoading] = useState(false);
    const { jobs, getJobs } = useJob();
    const { formatDateForInput, getLabels, labels, mandatoryFields, getMandatoryFields } = useCustomers3();
    const { createDynamicData, updateDynamicData } = useDynamicData();

    // Dynamic schema for the 5 specific fields based on mandatory fields from database
    const customerSchema = useMemo(() => {
        const schemaFields = {
            fullname: mandatoryFields.fullname 
                ? z.string().min(1, "Fullname is required")
                : z.union([z.string(), z.null(), z.undefined()])
                    .optional()
                    .transform((val) => val === null || val === undefined ? undefined : val),
            displayname: mandatoryFields.displayname 
                ? z.string().min(1, "Displayname is required")
                : z.union([z.string(), z.null(), z.undefined()])
                    .optional()
                    .transform((val) => val === null || val === undefined ? undefined : val),
            birthday: mandatoryFields.birthday 
                ? z.string().min(1, "Birthday is required").transform((str) => new Date(str))
                : z.union([z.string(), z.null(), z.undefined()])
                    .optional()
                    .transform((val) => {
                        if (val === null || val === undefined) return undefined;
                        return val ? new Date(val) : undefined;
                    }),
            age: mandatoryFields.age 
                ? z.union([z.string(), z.number()])
                    .refine((val) => {
                        if (typeof val === 'string') {
                            return val.trim() !== '' && !isNaN(parseInt(val, 10)) && parseInt(val, 10) > 0;
                        }
                        return val !== null && val !== undefined && val > 0;
                    }, "Age is required")
                    .transform((val) => {
                        if (typeof val === 'string') {
                            return parseInt(val, 10);
                        }
                        return val;
                    })
                : z.union([z.string(), z.number(), z.null(), z.undefined()])
                    .optional()
                    .transform((val) => {
                        if (val === null || val === undefined) return undefined;
                        if (typeof val === 'string' && val.trim() !== '') {
                            return parseInt(val, 10);
                        }
                        return val;
                    }),
            job: mandatoryFields.job 
                ? z.string().min(1, "Job is required")
                : z.union([z.string(), z.null(), z.undefined(), z.number()])
                    .optional()
                    .transform((val) => val === null || val === undefined ? undefined : val)
        };

        return z.object(schemaFields);
    }, [mandatoryFields]);

    // Prepare default values with formatted date
    const defaultValues = useMemo(() => {
        if (!initData || Object.keys(initData).length === 0) return {};
        
        const formattedData = { ...initData };
        if (formattedData.birthday) {
            formattedData.birthday = formatDateForInput(formattedData.birthday);
        }
        return formattedData;
    }, [initData]);

    const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isSubmitted }, trigger } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues,
    });

    useEffect(() => {
        if(isOpen){
            trigger();
        }
    }, [isOpen])

    // Reset form when initData changes
    useEffect(() => {
        if (initData && Object.keys(initData).length > 0) {
            const formattedData = { ...initData };
            if (formattedData.birthday) {
                formattedData.birthday = formatDateForInput(formattedData.birthday);
            }
            reset(formattedData);
        }
    }, [initData, reset]);

    // Load data on mount
    useEffect(() => {
        getJobs();
        getLabels();
        getMandatoryFields();
    }, []);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (role === "update") {
                data.id = initData.id;
                await updateDynamicData(table_name, data);
            } else {
                await createDynamicData(table_name, data);
            }
            setTimeout(() => {
                setIsOpen(false);
            }, 1500);
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


    return (
        <Modal 
            open={isOpen} 
            onCancel={onCancel} 
            onOk={handleSubmit(onSubmit)}
            title={title}
            okText={isLoading ? (role === "update" ? "Updating..." : "Creating...") : (role === "update" ? "Update" : "Create")}
            cancelText="Cancel"
            okButtonProps={{ disabled: isSubmitting || isLoading }}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="title" onClick={() => {trigger()}}>{role === "update" ? 'Update Customer' : 'Add New Customer'}</div>
                
                {/* Fullname Field */}
                <div className={`field-container ${errors.fullname ? 'has-error' : ''} ${isSubmitted && !errors.fullname ? 'has-success' : ''}`}>
                    <label>{labels.fullname}</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            {...register("fullname")}
                            className={`inputable-select-input ${errors.fullname ? 'error' : ''}`}
                        />
                        {errors.fullname && <p>{errors.fullname.message}</p>}
                    </div>
                </div>

                {/* Displayname Field */}
                <div className={`field-container ${errors.displayname ? 'has-error' : ''} ${isSubmitted && !errors.displayname ? 'has-success' : ''}`}>
                    <label>{labels.displayname}</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            {...register("displayname")}
                            className={`inputable-select-input ${errors.displayname ? 'error' : ''}`}
                        />
                        {errors.displayname && <p>{errors.displayname.message}</p>}
                    </div>
                </div>

                {/* Birthday Field */}
                <div className={`field-container ${errors.birthday ? 'has-error' : ''} ${isSubmitted && !errors.birthday ? 'has-success' : ''}`}>
                    <label>{labels.birthday}</label>
                    <div className="input-wrapper">
                        <input
                            type="date"
                            {...register("birthday")}
                            className={`inputable-select-input ${errors.birthday ? 'error' : ''}`}
                        />
                        {errors.birthday && <p>{errors.birthday.message}</p>}
                    </div>
                </div>

                {/* Age Field */}
                <div className={`field-container ${errors.age ? 'has-error' : ''} ${isSubmitted && !errors.age ? 'has-success' : ''}`}>
                    <label>{labels.age}</label>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            {...register("age")}
                            min="1"
                            max="120"
                            className={`inputable-select-input ${errors.age ? 'error' : ''}`}
                        />
                        {errors.age && <p>{errors.age.message}</p>}
                    </div>
                </div>

                {/* Job Field */}
                <div className={`field-container ${errors.job ? 'has-error' : ''} ${isSubmitted && !errors.job ? 'has-success' : ''}`}>
                    <label>{labels.job}</label>
                    <div className="input-wrapper">
                        <Controller
                            name="job"
                            control={control}
                            render={({ field }) => (
                                <InputableSelectField
                                    {...field}
                                    options={jobs}
                                    submitted={false}
                                    error={!!errors.job}
                                    className={errors.job ? 'error' : ''}
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