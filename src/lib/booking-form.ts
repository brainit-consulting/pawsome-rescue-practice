export type DogSize = "small" | "medium" | "large";

export type BookingForm = {
  serviceId: string;
  dogSize: DogSize | "";
  slot: string;
  customerName: string;
  phone: string;
  address: string;
  dogName: string;
};

export const emptyForm: BookingForm = {
  serviceId: "",
  dogSize: "",
  slot: "",
  customerName: "",
  phone: "",
  address: "",
  dogName: "",
};

/** Valid US phone number */
export function isValidPhone(phone: string): boolean {
  return /^\d{10}$/.test(phone);
}

/** Can the customer press Confirm booking? */
export function canConfirm(form: BookingForm): boolean {
  return (
    form.serviceId !== "" &&
    form.dogSize !== "" &&
    form.slot !== "" &&
    form.customerName.trim() !== "" &&
    form.address.trim() !== "" &&
    form.dogName.trim() !== "" &&
    isValidPhone(form.phone)
  );
}
