import { Card, CardContent } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import type { FormProps } from "@/types";
import { InputField } from "@/components/form/InputField";
import { Textarea } from "@/components/ui/textarea";

const Information: React.FC<Partial<FormProps>> = ({ register, errors }) => {
  return (
    <Card className="form-section overflow-hidden">
      <div className="bg-linear-to-r from-oyadrop/10 to-transparent px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Badge
            variant="outline"
            className="mr-2 bg-oyadrop/10 text-oyadrop border-0"
          >
            3
          </Badge>
          Other Information
        </h2>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label
              htmlFor="itemDescription"
              className="block text-sm font-medium mb-2"
            >
              Item Description
            </label>
            <Textarea
              id="itemDescription"
              placeholder="Describe the item you're sending"
              {...register?.("itemDescription")}
              className={errors?.itemDescription ? "border-destructive" : ""}
            />
            {errors?.itemDescription && (
              <p className="text-sm text-destructive mt-1">
                {errors.itemDescription.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="itemComments"
              className="block text-sm font-medium mb-2"
            >
              Comments/Instructions
            </label>
            <Textarea
              id="itemComments"
              placeholder="Any special instructions for the delivery"
              {...register?.("itemComments")}
            />
          </div>
          <InputField
            name="referral"
            label="Referral Code (Optional)"
            icon="tag"
            placeholder="Enter referral code"
            register={register}
            error={errors?.referral}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Information;
