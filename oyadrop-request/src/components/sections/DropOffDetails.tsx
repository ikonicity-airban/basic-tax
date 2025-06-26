import { Card, CardContent } from "@/components/ui/card";
import {
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  useFieldArray,
} from "react-hook-form";
import { FormData, FormProps } from "@/types";
import { Phone, Plus, Trash, User } from "lucide-react";

import AddressInput from "@/components/AddressInput";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DateTimePicker from "@/components/DateTimePicker";
import ImageUpload from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/form/InputField";
import { PhoneInput } from "@/components/form/PhoneInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DropOffDetailsProps
  extends Omit<FormProps, "watchPickupAddress" | "debouncedAddressChange"> {}

const DropOffDetails: React.FC<DropOffDetailsProps> = ({
  register,
  errors,
  watch,
  setValue,
  control,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "additionalDropOffs",
  });
  const dropOffAddress = watch("dropOffAddress");
  const debouncedAddressChange = (
    type: "pickup" | "dropOff",
    value: string,
    coords?: [number, number]
  ) => {
    console.log(type, value, coords);
    // placeholder for debounced logic
  };
  return (
    <Card className="form-section overflow-hidden">
      <div className="bg-gradient-to-r from-oyadrop/10 to-transparent px-6 py-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Badge
            variant="outline"
            className="mr-2 bg-oyadrop/10 text-oyadrop border-0"
          >
            2
          </Badge>
          Drop-off Details
        </h2>
      </div>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient's Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                {...register("dropOffName", {
                  required: "Recipient name is required",
                })}
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                placeholder="Recipient's name"
              />
            </div>
            {errors.dropOffName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dropOffName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Recipient's Phone <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <div className="bg-muted px-3 py-2 border rounded-l-md border-r-0 flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">+234</span>
              </div>
              <input
                {...register("dropOffPhone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message:
                      "Enter a valid Nigerian phone number without the country code",
                  },
                })}
                type="tel"
                className="flex-1 px-3 py-2 border rounded-r-md"
                placeholder="Phone number"
              />
            </div>
            {errors.dropOffPhone && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dropOffPhone.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <AddressInput
              label="Drop-off Address"
              id="dropOffAddress"
              placeholder="Enter drop-off address"
              value={dropOffAddress}
              onChange={(value, coords) =>
                debouncedAddressChange("dropOff", value, coords)
              }
              required
              error={errors.dropOffAddress?.message}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Item Quantity <span className="text-red-500">*</span>
            </label>
            <Input
              {...register("itemQuantity", {
                required: "Quantity is required",
                min: { value: 1, message: "Quantity must be at least 1" },
              })}
              type="number"
              min="1"
              placeholder="Enter quantity"
            />
            {errors.itemQuantity && (
              <p className="text-red-500 text-xs mt-1">
                {errors.itemQuantity.message}
              </p>
            )}
          </div>

          <div>
            <DateTimePicker
              label="Latest Drop-off Date/Time"
              value={watch("dropOffDateTime")}
              onChange={(date) => setValue("dropOffDateTime", date || null)}
              required
              error={errors.dropOffDateTime?.message}
              minDate={new Date()}
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              label="Upload Item Image"
              value={watch("itemImage")}
              onChange={(file) => setValue("itemImage", file)}
              error={errors.itemImage?.message}
              maxSize={10} // 10MB max file size
            />
          </div>

          {/* Additional DropOffs */}
          {fields.length > 0 && (
            <div className="md:col-span-2 mt-2">
              <div className="p-4 bg-muted/40 rounded-md">
                <h3 className="text-sm font-medium mb-3">
                  Additional Drop-offs
                </h3>
                <ScrollArea className="max-h-64">
                  {fields.map((_, index) => (
                    <div
                      key={index}
                      className="mb-4 p-3 bg-white rounded-md shadow-sm"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium">
                          Drop-off #{index + 2}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => remove(index)}
                          className="h-7 w-7"
                        >
                          <Trash className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <Input
                            {...register(
                              `additionalDropOffs.${index}.name` as const,
                              {
                                required: "Name is required",
                              }
                            )}
                            placeholder="Recipient's name"
                          />
                        </div>
                        <div>
                          <AddressInput
                            label=""
                            id={`additionalDropOffs.${index}.address`}
                            placeholder="Drop-off address"
                            value={
                              watch(
                                `additionalDropOffs.${index}.address` as const
                              ) || ""
                            }
                            onChange={(value) =>
                              setValue(
                                `additionalDropOffs.${index}.address` as const,
                                value
                              )
                            }
                            showLabel={false}
                          />
                        </div>
                        <div className="flex">
                          <div className="bg-muted px-3 py-2 border rounded-l-md border-r-0 flex items-center">
                            <span className="text-sm">+234</span>
                          </div>
                          <Input
                            {...register(
                              `additionalDropOffs.${index}.phone` as const,
                              {
                                required: "Phone is required",
                                pattern: {
                                  value: /^\d{10}$/,
                                  message:
                                    "Enter a valid Nigerian phone number",
                                },
                              }
                            )}
                            type="tel"
                            className="rounded-l-none"
                            placeholder="Phone number"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            Item Quantity
                          </label>
                          <Input
                            {...register(
                              `additionalDropOffs.${index}.itemQuantity` as const,
                              {
                                required: "Quantity is required",
                                min: {
                                  value: 1,
                                  message: "Quantity must be at least 1",
                                },
                              }
                            )}
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                          />
                        </div>
                        <div>
                          <ImageUpload
                            label="Upload Item Image"
                            value={watch(
                              `additionalDropOffs.${index}.itemImage` as const
                            )}
                            onChange={(file) =>
                              setValue(
                                `additionalDropOffs.${index}.itemImage` as const,
                                file
                              )
                            }
                            maxSize={10} // 10MB max file size
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <Button
              type="button"
              variant="outline"
              className="flex items-center text-oyadrop"
              onClick={() => append({})}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add more Drop-off addresses
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DropOffDetails;
