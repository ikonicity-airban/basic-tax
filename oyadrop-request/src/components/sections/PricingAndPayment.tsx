import { AlertTriangle, Loader2, MoveRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { FieldErrors, UseFormSetValue } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FormProps } from "@/types/index";
import PaymentOptions from "@/components/PaymentOptions";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/utils/priceCalculation";

const PricingAndPayment: React.FC<Partial<FormProps>> = ({
  watch,
  setValue,
  estimatedPrice,
  errors,
  isSubmitting,
}) => {
  const paymentMethod = watch?.("paymentMethod");
  return (
    <Card className="form-section overflow-hidden">
      <div className="bg-linear-to-r from-oyadrop/10 to-transparent px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Badge
            variant="outline"
            className="mr-2 bg-oyadrop/10 text-oyadrop border-0"
          >
            4
          </Badge>
          Pricing & Payment
        </h2>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimated Price
            </label>
            <div className="bg-muted/40 rounded-md p-4 flex items-center justify-between">
              {!estimatedPrice ? (
                <div className="flex items-center text-sm text-muted-foreground">
                  <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                  Enter pickup and drop-off addresses to calculate
                </div>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    Based on distance between locations:
                  </span>
                  <span className="text-lg font-bold text-oyadrop">
                    {formatPrice(estimatedPrice)}
                  </span>
                </>
              )}
            </div>
          </div>

          <div>
            <PaymentOptions
              value={paymentMethod}
              onChange={(value) =>
                setValue?.("paymentMethod", value as "pay_after" | "pay_now")
              }
              estimatedPrice={estimatedPrice}
              error={errors.paymentMethod?.message}
            />
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-oyadrop hover:bg-oyadrop-dark text-white px-6 py-2 rounded-md transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Submit Request
                  <MoveRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingAndPayment;
