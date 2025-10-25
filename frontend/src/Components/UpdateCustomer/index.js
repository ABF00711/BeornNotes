import { zodResolver } from "@hookform/resolvers/zod";
import useCustomers3 from "../../Hooks/useCustomers3";
import useDynamicData from "../../Hooks/useDynamicData";
import "./style.css";
import { Controller, useForm } from "react-hook-form";
import Input from "smart-webcomponents-react/input";
import ComboBox from "smart-webcomponents-react/combobox";
import useJob from "../../Hooks/useJob";
import { useEffect, useMemo, useState } from "react";
import { getCustomerSchema } from "../DynamicModal/customerSchema";

function UpdateCustomer({ updateData, customerData }) {
    const { jobs, getJobs } = useJob();
    const { formatDateForInput } = useCustomers3();
    const { updateDynamicData } = useDynamicData();

    const customerSchema = useMemo(() => {
        return getCustomerSchema(customerData.labels, customerData.mandatories);
    }, [customerData]);

    const getDefaultValue = (initData) => {
        try {
            if (!initData || Object.keys(initData).length === 0) return {};

            const formattedData = { ...initData };
            if (formattedData.birthday) {
                formattedData.birthday = formatDateForInput(formattedData.birthday);
            }
            if(initData.age == 0) formattedData.age = null;
            return formattedData;
        } catch (error) {
            console.log("getDefaultValue: ", error);
        }
    }

    const [defaultValues, setDefaultValues] = useState(getDefaultValue(updateData));

    const { handleSubmit, control, reset, formState: { errors }, trigger } = useForm({
        resolver: zodResolver(customerSchema),
        defaultValues,
    });


    const onSubmit = async (data) => {
        try {
            data.id = updateData.id;
            setDefaultValues(getDefaultValue(data));

            const selectedJob = jobs.find((job) => job.name == data.job);
            if (selectedJob) {
                data.job = selectedJob.id;
            }
            for (const key in data) {
                if (typeof (data[key]) == "string") data[key] = data[key].trim();
            }
            
            await updateDynamicData("customers", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
        }
    };

    useEffect(() => {
        getJobs();
        trigger();
    }, [])

    return (
        <div className="updateCustomer">
            <div className="updateCustomer-main">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Fullname */}
                    <div className={`field-container ${errors.fullname ? 'has-error' : ''}`}>
                        <label>{customerData.labels.fullname}</label>
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
                        <label>{customerData.labels.displayname}</label>
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
                        <label>{customerData.labels.birthday}</label>
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
                        <label>{customerData.labels.age}</label>
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
                        <label>{customerData.labels.job}</label>
                        <div style={{ width: "60%" }}>
                            <Controller
                                name="job"
                                control={control}
                                render={({ field }) => (
                                    <ComboBox
                                        dataSource={jobs}
                                        displayMember="name"
                                        valueMember="name"
                                        value={field.value ?? updateData?.job ?? ''}
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
                <div className="updateCustomer-btns">
                    <button className="btn btn-primary" onClick={handleSubmit(onSubmit)} >Save</button>
                    <button className="btn btn-dangerous" onClick={() => { reset(defaultValues) }}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateCustomer;