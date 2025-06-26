import { Card, CardContent } from "@/components/ui/card";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormData, FormProps } from "@/types/index";

import AddressInput from "@/components/AddressInput";
import { Badge } from "@/components/ui/badge";
import { InputField } from "@/components/form/InputField";
import { PhoneInput } from "@/components/form/PhoneInput";

interface PickupDetailsProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: FormProps["watch"];
  debouncedAddressChange: FormProps["debouncedAddressChange"];
}

const PickupDetails: React.FC<PickupDetailsProps> = ({
  register,
  errors,
  watch,
  debouncedAddressChange,
}) => {
  const pickupAddress = watch("pickupAddress");
  return (
    <Card className="form-section overflow-hidden">
      <div className="bg-gradient-to-r from-oyadrop/10 to-transparent px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Badge
            variant="outline"
            className="mr-2 bg-oyadrop/10 text-oyadrop border-0"
          >
            1
          </Badge>
          Pickup Details
        </h2>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            name="pickupName"
            label="Name"
            icon="user"
            placeholder="Your name"
            register={register}
            rules={{ required: "Name is required" }}
            error={errors.pickupName}
            required
          />

          <InputField
            name="pickupEmail"
            label="Email address"
            type="email"
            icon="mail"
            placeholder="Your email"
            register={register}
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                message: "Please enter a valid email address",
              },
            }}
            error={errors.pickupEmail}
            required
          />

          <div className="md:col-span-2 z-50">
            <AddressInput
              label="Pickup Address"
              id="pickupAddress"
              placeholder="Enter pickup address"
              value={pickupAddress}
              onChange={(value, coords) =>
                debouncedAddressChange?.("pickup", value, coords)
              }
              required
              error={errors.pickupAddress?.message}
            />
          </div>

          <PhoneInput
            name="pickupPhone"
            label="Phone Number"
            register={register}
            error={errors.pickupPhone}
            required
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PickupDetails;
