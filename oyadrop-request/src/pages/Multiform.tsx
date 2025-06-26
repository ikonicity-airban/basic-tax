import { AnimatePresence, motion } from "framer-motion";
import type { FormData, FormProps } from "@/types";

import { Button } from "@/components/ui/button";
import DropOffDetails from "@/components/sections/DropOffDetails";
import Footer from "@/components/sections/Footer";
import Header from "@/components/sections/Header";
import Information from "@/components/sections/Information";
import PickupDetails from "@/components/sections/PickupDetails";
import PricingAndPayment from "@/components/sections/PricingAndPayment";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useState } from "react";

const steps = [
  {
    id: "Step 1",
    name: "Pickup Details",
    component: PickupDetails,
  },
  {
    id: "Step 2",
    name: "Drop-off Details",
    component: DropOffDetails,
  },
  {
    id: "Step 3",
    name: "Information",
    component: Information,
  },
  {
    id: "Step 4",
    name: "Pricing and Payment",
    component: PricingAndPayment,
  },
];

function Multiform() {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>();
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const debouncedAddressChange = (
    type: "pickup" | "dropOff",
    value: string,
    coords?: [number, number]
  ) => {
    console.log(type, value, coords);
    // placeholder for debounced logic
  };

  const formProps: Omit<FormProps, "register" | "errors"> = {
    watch,
    setValue,
    isSubmitting,
    watchPickupAddress: watch("pickupAddress"),
    debouncedAddressChange,
    watchDropOffAddress: watch("dropOffAddress"),
    estimatedPrice,
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((step) => step + 1);
    }
  };

  const prev = () => {
    if (currentStep > 0) {
      setCurrentStep((step) => step - 1);
    }
  };

  const CurrentComponent = steps[currentStep].component;

  return (
    <main className="max-w-4xl mx-auto md:pt-10">
      <Header />
      <section className="flex flex-col justify-between min-h-[60vh] p-4 md:p-8">
        <div>
          {/* <div className="flex items-center justify-center gap-4">
            <h1 className="text-xl font-semibold">
              {steps[currentStep].id}: {steps[currentStep].name}
            </h1>
          </div> */}

          <div className="items-center min-w-full inline-flex ">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-center w-full -space-x-2",
                  index !== steps.length - 2 && "grow"
                )}
              >
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(index)}
                  className={`${
                    currentStep === index
                      ? "bg-oyadrop-light text-oyadrop"
                      : "bg-oyadrop/ text-oyadrop-foreground/90"
                  } px-3 py-1 rounded-full z-10`}
                >
                  {index + 1}
                </button>
                {index !== steps.length - 1 && (
                  <Progress
                    value={currentStep - 1 < index ? 0 : 100}
                    className="h-2 flex -z-10"
                  />
                )}
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="mt-8"
            >
              <CurrentComponent
                register={register}
                errors={errors}
                {...formProps}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-between mt-8">
          <Button onClick={prev} disabled={currentStep === 0} variant="outline">
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button onClick={next}>Next</Button>
          ) : (
            <Button>Submit</Button>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

export default Multiform;
