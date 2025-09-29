import React, { useEffect, useState } from "react";
import "./style.css";
import { customersSchema } from "./customerSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import useDynamicData from "../../../Hooks/useDynamicData";
import { useNavigate, useLocation } from "react-router-dom";
import InputableSelectField from "../../../Components/InputableSelect/InputableSelectField";
import useJob from "../../../Hooks/useJob";
import useCustomers3 from "../../../Hooks/useCustomers3";

function AddCustomers() {
    const location = useLocation();
    const data = location.state || null;
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const {jobs, getJobs} = useJob();
    const [options, setOptions] = useState([]);
    const {formatDateForInput} = useCustomers3();

    // Prepare default values with formatted date
    const defaultValues = data ? {
        ...data,
        birthday: formatDateForInput(data.birthday)
    } : {};

    const { register, handleSubmit, control, reset, setValue, formState: { errors, isSubmitted } } = useForm({
        resolver: zodResolver(customersSchema),
        defaultValues
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
    }, [])

    return (
        <div className="addCustomers">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`field-container ${errors.fullname ? 'has-error' : ''} ${isSubmitted && !errors.fullname ? 'has-success' : ''}`}>
                    <label>Fullname</label>
                    <input
                        type="text"
                        {...register("fullname")}
                        placeholder="Enter full name"
                        className={errors.fullname ? 'error' : ''}
                    />
                    {errors.fullname && <p>{errors.fullname.message}</p>}
                </div>

                <div className={`field-container ${errors.displayname ? 'has-error' : ''} ${isSubmitted && !errors.displayname ? 'has-success' : ''}`}>
                    <label>Displayname</label>
                    <input
                        type="text"
                        {...register("displayname")}
                        placeholder="Enter display name"
                        className={errors.displayname ? 'error' : ''}
                    />
                    {errors.displayname && <p>{errors.displayname.message}</p>}
                </div>

                <div className={`field-container ${errors.birthday ? 'has-error' : ''} ${isSubmitted && !errors.birthday ? 'has-success' : ''}`}>
                    <label>Birthday</label>
                    <input
                        type="date"
                        {...register("birthday")}
                        className={errors.birthday ? 'error' : ''}
                    />
                    {errors.birthday && <p>{errors.birthday.message}</p>}
                </div>

                <div className={`field-container ${errors.age ? 'has-error' : ''} ${isSubmitted && !errors.age ? 'has-success' : ''}`}>
                    <label>Age</label>
                    <input
                        type="number"
                        {...register("age")}
                        placeholder="Enter age"
                        min="1"
                        max="120"
                        className={errors.age ? 'error' : ''}
                    />
                    {errors.age && <p>{errors.age.message}</p>}
                </div>

                <div className={`field-container ${errors.job ? 'has-error' : ''} ${isSubmitted && !errors.job ? 'has-success' : ''}`}>
                    <label>Job</label>
                    <Controller
                        name="job"
                        control={control}
                        render={({ field }) => (
                            <InputableSelectField
                                {...field}
                                placeholder="Search and select a job..."
                                options = {options}
                                submitted={isSubmitted}
                                error={!!errors.job}
                                className={errors.job ? 'error' : ''}
                            />
                        )}
                    />
                    {errors.job && <p>{errors.job.message}</p>}
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