import "react-phone-number-input/style.css";

import {
  FieldError,
  FieldErrors,
  FieldValues,
  UseFormRegister,
  ValidationRule,
} from "react-hook-form";
import PhoneInputWithCountrySelect, {
  isPossiblePhoneNumber,
} from "react-phone-number-input";

import { FormData } from "@/types";
import { Input } from "@/components/ui/input";
import { Phone } from "lucide-react";

interface PhoneInputProps {
  name: keyof FormData;
  label: string;
  register: UseFormRegister<FormData>;
  error?: FieldError;
  required?: boolean;
}

export const PhoneInput = ({
  name,
  label,
  register,
  error,
  required,
}: PhoneInputProps) => {
  const { ref, ...rest } = register(name, {
    required: required ? "Phone number is required" : false,
    validate: (value) =>
      isPossiblePhoneNumber(value) || "Please enter a valid phone number",
  });

  return (
    <div>
      <label className="block text-sm font-medium mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="bg-muted px-3 py-2 border rounded-l-md border-r-0 flex items-center">
          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
          <span className="text-sm">+234</span>
        </div>
        <Input
          {...rest}
          type="tel"
          className="flex-1 rounded-l-none"
          placeholder="Phone number"
          aria-invalid={error ? "true" : "false"}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
};
