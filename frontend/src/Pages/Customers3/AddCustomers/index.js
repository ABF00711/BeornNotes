import React, { useEffect, useState, useMemo } from "react";
import "./style.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import useDynamicData from "../../../Hooks/useDynamicData";
import { useNavigate, useLocation } from "react-router-dom";
import InputableSelectField from "../../../Components/InputableSelect/InputableSelectField";
import useJob from "../../../Hooks/useJob";
import useCustomers3 from "../../../Hooks/useCustomers3";
import { z } from "zod";

function AddCustomers() {
    const location = useLocation();
    const data = location.state || null;
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const {jobs, getJobs} = useJob();
    const [options, setOptions] = useState([]);
    const {formatDateForInput, getLabels, labels, mandatoryFields, getMandatoryFields} = useCustomers3();

    // Dynamic schema based on mandatory fields from database
    const customersSchema = useMemo(() => {
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
                : z.union([z.string(), z.null(), z.undefined()])
                    .optional()
                    .transform((val) => val === null || val === undefined ? undefined : val)
        };

        return z.object(schemaFields);
    }, [mandatoryFields]);

    // Prepare default values with formatted date
    const defaultValues = data ? {
        ...data,
        birthday: formatDateForInput(data.birthday)
    } : {};

    const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitted }, trigger } = useForm({
        resolver: zodResolver(customersSchema),
        defaultValues,
    });

    // Reset form with formatted data when data changes
    useEffect(() => {
        if (data) {
            const formattedData = {...data, birthday: formatDateForInput(data.birthday)
            };
            reset(formattedData);

            const formattedBirthday = formatDateForInput(data.birthday);

            setValue('birthday', formattedBirthday);
        }
    }, [data, reset, setValue]);
    const { createDynamicData, updateDynamicData } = useDynamicData();
    const navigate = useNavigate();

    const onSubmit = async (newData) => {
        setIsLoading(true);
        try {
            if (data) {
                newData.id = data.id;
                await updateDynamicData("customers", newData);
            } else {
                await createDynamicData("customers", newData);
            }
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/customers3");
            }, 1500);
        } catch (error) {
            console.error("Error creating customer:", error);
        } finally {
            setIsLoading(false);
        }
    } 

    useEffect(() => {
        setOptions(jobs.map((job) => {
            return job.name;
        }))
    }, [jobs])

    useEffect(() => {
        getJobs();
        getLabels();
        getMandatoryFields();
    }, [])

    // Trigger validation after mandatory fields are loaded and schema is updated
    useEffect(() => {
        if (Object.keys(mandatoryFields).length > 0) {
            trigger();
        }
    }, [mandatoryFields, trigger]);

    return (
        <div className="addCustomers">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="title">{data ? 'Update Customer' : 'Add New customer'}</div>
                <div className={`field-container ${errors.fullname ? 'has-error' : ''} ${isSubmitted && !errors.fullname ? 'has-success' : ''}`}>
                    <label>{labels.fullname}</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            {...register("fullname")}
                            className={errors.fullname ? 'error' : ''}
                        />
                        {errors.fullname && <p>{errors.fullname.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.displayname ? 'has-error' : ''} ${isSubmitted && !errors.displayname ? 'has-success' : ''}`}>
                    <label>{labels.displayname}</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            {...register("displayname")}
                            className={errors.displayname ? 'error' : ''}
                        />
                        {errors.displayname && <p>{errors.displayname.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.birthday ? 'has-error' : ''} ${isSubmitted && !errors.birthday ? 'has-success' : ''}`}>
                    <label>{labels.birthday}</label>
                    <div className="input-wrapper">
                        <input
                            type="date"
                            {...register("birthday")}
                            className={errors.birthday ? 'error' : ''}
                        />
                        {errors.birthday && <p>{errors.birthday.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.age ? 'has-error' : ''} ${isSubmitted && !errors.age ? 'has-success' : ''}`}>
                    <label>{labels.age}</label>
                    <div className="input-wrapper">
                        <input
                            type="number"
                            {...register("age")}
                            min="1"
                            max="120"
                            className={errors.age ? 'error' : ''}
                        />
                        {errors.age && <p>{errors.age.message}</p>}
                    </div>
                </div>

                <div className={`field-container ${errors.job ? 'has-error' : ''} ${isSubmitted && !errors.job ? 'has-success' : ''}`}>
                    <label>{labels.job}</label>
                    <div className="input-wrapper">
                        <Controller
                            name="job"
                            control={control}
                            render={({ field }) => (
                                <InputableSelectField
                                    {...field}
                                    options = {options}
                                    submitted={false}
                                    error={!!errors.job}
                                    className={errors.job ? 'error' : ''}
                                />
                            )}
                        />
                        {errors.job && <p>{errors.job.message}</p>}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className={`${isLoading ? 'loading' : ''} ${isSuccess ? 'success' : ''}`}
                >
                    {isLoading
                        ?
                        (data ? 'Updating...' : 'Creating...')
                        :
                        isSuccess
                            ?
                            (data ? 'Customer Updated!' : 'Customer Created!')
                            :
                            (data ? 'Update Customer' : 'Create Customer')}
                </button>
                <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => navigate("/customers3")}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
}

export default AddCustomers;