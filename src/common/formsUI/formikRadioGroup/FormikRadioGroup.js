import React from "react";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";

const renderOptions = (options) => {
    return options.map((option) => (
        <FormControlLabel
            key={option}
            value={option}
            control={<Radio />}
            label={option}
        />
    ));
};

const FormikRadioGroup = ({
    field,
    form: { touched, errors },
    name,
    options,
    children,
    ...props
}) => {
    const fieldName = name || field.name;

    return (
        <div>
            <RadioGroup {...field} {...props} name={fieldName}>
                {/* Here you either map over the props and render radios from them,
         or just render the children if you're using the function as a child*/}
                {options ? renderOptions(options) : children}
            </RadioGroup>

            {touched[fieldName] && errors[fieldName] && (
                <span style={{ color: "red", fontFamily: "sans-serif" }}>
                    {errors[fieldName]}
                </span>
            )}
        </div>
    );
};

export default FormikRadioGroup;
