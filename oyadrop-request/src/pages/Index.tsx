import {
  generatePaymentReference,
  initializePaystackPayment,
} from "@/utils/paystackIntegration";
import { useEffect, useMemo, useRef, useState } from "react";

import DropOffDetails from "@/components/sections/DropOffDetails";
import Footer from "@/components/sections/Footer";
import { FormData } from "@/types/index";
import Header from "@/components/sections/Header";
import Information from "@/components/sections/Information";
import PickupDetails from "@/components/sections/PickupDetails";
import PricingAndPayment from "@/components/sections/PricingAndPayment";
import WhatsAppSupport from "@/components/WhatsAppSupport";
import debounce from "lodash/debounce";
import { estimatePrice } from "@/utils/priceCalculation";
import { sendDeliveryRequest } from "@/utils/emailService";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const Index = () => {
  // Form state
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      pickupName: "",
      pickupEmail: "",
      pickupAddress: "",
      pickupPhone: "",
      pickupDateTime: null,
      additionalPickups: [],
      dropOffName: "",
      dropOffAddress: "",
      dropOffPhone: "",
      dropOffDateTime: null,
      itemQuantity: "1",
      itemImage: null,
      additionalDropOffs: [],
      itemDescription: "",
      itemComments: "",
      referral: "",
      paymentMethod: "pay_after",
    },
    mode: "onBlur", // Add validation mode
  });

  // Watch form values for conditional logic
  const watchPickupAddress = watch("pickupAddress");
  const watchDropOffAddress = watch("dropOffAddress");
  const watchPaymentMethod = watch("paymentMethod");

  // State for coordinates (for price calculation)
  const [coordinates, setCoordinates] = useState<{
    pickup: [number, number] | null;
    dropOff: [number, number] | null;
  }>({
    pickup: null,
    dropOff: null,
  });

  // State for estimated price
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  // Additional pickup/dropOff states
  const [showAdditionalPickups, setShowAdditionalPickups] = useState(false);
  const [showAdditionalDropOffs, setShowAdditionalDropOffs] = useState(false);

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form ref for scrolling
  const formRef = useRef<HTMLDivElement>(null);

  // Debounced address change handler
  const debouncedAddressChange = useMemo(
    () =>
      debounce(
        (
          type: "pickup" | "dropOff",
          value: string,
          coords?: [number, number]
        ) => {
          handleAddressChange(type, value, coords);
        },
        350
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Memoized price calculation
  const calculatedPrice = useMemo(() => {
    if (coordinates.pickup && coordinates.dropOff) {
      return estimatePrice(coordinates);
    }
    return null;
  }, [coordinates]);

  // Calculate price when both addresses are available
  useEffect(() => {
    if (coordinates.pickup && coordinates.dropOff) {
      const price = estimatePrice(coordinates);
      setEstimatedPrice(price);
    } else {
      setEstimatedPrice(null);
    }
  }, [coordinates]);

  // Handle address selection with coordinates
  const handleAddressChange = (
    type: "pickup" | "dropOff",
    value: string,
    coords?: [number, number]
  ) => {
    setValue(type === "pickup" ? "pickupAddress" : "dropOffAddress", value);

    if (coords) {
      setCoordinates((prev) => ({
        ...prev,
        [type]: coords,
      }));
    }
  };

  // Image validation
  const validateImage = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast.error("Please upload only JPG, PNG or WebP images");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("Image size should be less than 10MB");
      return false;
    }

    return true;
  };

  // Handle image upload
  const handleImageUpload = (file: File | null) => {
    if (file && !validateImage(file)) return;
    setValue("itemImage", file);
  };

  const handleAdditionalDropOffImageUpload = (
    index: number,
    file: File | null
  ) => {
    if (file && !validateImage(file)) return;
    const currentDropOffs = [...watch("additionalDropOffs")];
    currentDropOffs[index].itemImage = file;
    setValue("additionalDropOffs", currentDropOffs);
  };

  // Add additional pickup
  const addPickup = () => {
    const currentPickups = watch("additionalPickups") || [];
    setValue("additionalPickups", [
      ...currentPickups,
      { name: "", address: "", phone: "", dateTime: null },
    ]);
    setShowAdditionalPickups(true);
  };

  // Remove additional pickup
  const removePickup = (index: number) => {
    const currentPickups = watch("additionalPickups") || [];
    setValue(
      "additionalPickups",
      currentPickups.filter((_, i) => i !== index)
    );
  };

  // Add additional dropOff
  const addDropOff = () => {
    const currentDropOffs = watch("additionalDropOffs") || [];
    setValue("additionalDropOffs", [
      ...currentDropOffs,
      { name: "", address: "", phone: "", itemQuantity: "1", itemImage: null },
    ]);
    setShowAdditionalDropOffs(true);
  };

  // Remove additional dropOff
  const removeDropOff = (index: number) => {
    const currentDropOffs = watch("additionalDropOffs") || [];
    setValue(
      "additionalDropOffs",
      currentDropOffs.filter((_, i) => i !== index)
    );
  };

  // Submit handler
  const onSubmit = async (data: FormData) => {
    // Validate essential data
    if (!coordinates.pickup || !coordinates.dropOff) {
      toast.error("Please select valid pickup and drop-off addresses");
      return;
    }

    if (!estimatedPrice) {
      toast.error("Unable to calculate price. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data for submission
      const formData = {
        ...data,
        coordinates,
        estimatedPrice,
      };

      // Handle payment method
      if (data.paymentMethod === "pay_now") {
        // Initialize Paystack payment
        const reference = generatePaymentReference();

        await initializePaystackPayment({
          amount: estimatedPrice,
          email: data.pickupEmail,
          reference,
          metadata: {
            pickupName: data.pickupName,
            dropOffName: data.dropOffName,
            pickupAddress: data.pickupAddress,
            dropOffAddress: data.dropOffAddress,
          },
          onSuccess: async () => {
            // Send delivery request after successful payment
            await sendDeliveryRequest(formData, () => {
              // Redirect to OyaDrop website after success
              window.location.href = "https://www.oyadrop.com.ng";
            });
            setIsSubmitting(false);
          },
          onCancel: () => {
            setIsSubmitting(false);
          },
        });
      } else {
        // Send delivery request directly for pay-after-pickup
        await sendDeliveryRequest(formData, () => {
          // Redirect to OyaDrop website after success
          window.location.href = "https://www.oyadrop.com.ng";
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while processing your request");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 py-8 px-4 md:py-12">
      {/* WhatsApp Support Button */}

      <WhatsAppSupport
        phoneNumber="+2349045684257" // Replace with your actual WhatsApp number with country code
        message="Hello OyaDrop, I need help with my delivery request."
      />

      <div className="w-full max-w-3xl mx-auto">
        <Header />

        {/* Main Form */}
        <div ref={formRef}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <PickupDetails
              register={register}
              errors={errors}
              watchPickupAddress={watchPickupAddress}
              debouncedAddressChange={debouncedAddressChange}
            />

            <DropOffDetails
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              watchDropOffAddress={watchDropOffAddress}
              debouncedAddressChange={debouncedAddressChange}
              showAdditionalDropOffs={showAdditionalDropOffs}
              addDropOff={addDropOff}
              removeDropOff={removeDropOff}
              handleImageUpload={handleImageUpload}
              handleAdditionalDropOffImageUpload={
                handleAdditionalDropOffImageUpload
              }
            />

            <Information register={register} errors={errors} />

            <PricingAndPayment
              watchPaymentMethod={watchPaymentMethod}
              setValue={setValue}
              estimatedPrice={estimatedPrice}
              errors={errors}
              isSubmitting={isSubmitting}
            />
          </form>
        </div>

        <Footer />
      </div>

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="loading-overlay">
          <div className="glass rounded-lg p-6 flex flex-col items-center">
            <div className="loading-spinner mb-4"></div>
            <p className="text-foreground font-medium">
              Processing your request...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
