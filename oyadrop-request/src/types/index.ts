import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

// Define the form data interface
export interface FormData {
  // Pickup details
  pickupName: string;
  pickupEmail: string;
  pickupAddress: string;
  pickupPhone: string;
  pickupDateTime: Date | null;

  // Additional pickup locations
  additionalPickups: Array<{
    name: string;
    address: string;
    phone: string;
    dateTime: Date | null;
  }>;

  // DropOff details
  dropOffName: string;
  dropOffAddress: string;
  dropOffPhone: string;
  dropOffDateTime: Date | null;
  itemQuantity: string;
  itemImage: File | null;

  // Additional dropOffs
  additionalDropOffs: Array<{
    name: string;
    address: string;
    phone: string;
    itemQuantity: string;
    itemImage: File | null;
  }>;

  // Item details
  itemDescription: string;
  itemComments: string;
  referral: string;

  // Payment details
  paymentMethod: "pay_after" | "pay_now";
}

// Props for form components
export interface FormProps {
  register: UseFormRegister<FormData>;
  errors: FieldErrors<FormData>;
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
  isSubmitting: boolean;
  // Pickup
  watchPickupAddress: string;
  debouncedAddressChange: (
    type: "pickup" | "dropOff",
    value: string,
    coords?: [number, number]
  ) => void;
  // DropOff
  watchDropOffAddress: string;
  // Pricing
  estimatedPrice: number | null;
}
