import React from "react";
import { Form, Input } from "antd";
import type { FormItemProps } from "antd/es/form";
import type { Rule } from "antd/es/form";
import styles from "./FormTextField.module.css";

const { TextArea } = Input;

interface FormTextFieldProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  type?: "text" | "email" | "textarea";
  rows?: number; // For textarea
  showCount?: boolean; // For textarea
  tooltip?: string;
  disabled?: boolean;
  // Allow custom rules to be passed in addition to auto-generated ones
  customRules?: Rule[];
}

export const FormTextField: React.FC<FormTextFieldProps> = ({
  label,
  name,
  placeholder,
  required = false,
  minLength,
  maxLength,
  type = "text",
  rows = 4,
  tooltip,
  customRules = [],
  disabled = false,
}) => {
  // Build validation rules based on props
  const rules: Rule[] = [...customRules];

  if (required) {
    rules.push({
      required: true,
      message: `Please enter ${label.toLowerCase()}`,
    });
  }

  if (minLength) {
    rules.push({
      min: minLength,
      message: `${label} must be at least ${minLength} characters`,
    });
  }

  if (maxLength) {
    rules.push({
      max: maxLength,
      message: `${label} must not exceed ${maxLength} characters`,
    });
  }

  if (type === "email") {
    rules.push({
      type: "email",
      message: "Please enter a valid email address",
    });
  }

  const formItemProps: FormItemProps = {
    label,
    name,
    rules: rules,
    className: styles.formTextField,
  };

  if (tooltip) {
    formItemProps.tooltip = tooltip;
  }

  return (
    <Form.Item {...formItemProps}>
      {type === "textarea" ? (
        <TextArea
          showCount={maxLength ? true : false}
          rows={rows}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
        />
      ) : (
        <Input
          showCount={maxLength ? true : false}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
        />
      )}
    </Form.Item>
  );
};
