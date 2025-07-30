import React from "react";
import { useFormik } from "formik";
import { clientLocationFormValues } from "@/lib/models/client";
import { clientLocationSchema } from "@/lib/models/client";
import { Popup } from "@/components/Elements/cards/popup";
import { updateClientLocation } from "@/api/client/locations";
import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { Location as locations } from "@/lib/definitions";
import { toast } from "react-toastify";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CancelButton from "@/components/Elements/utils/CancelButton";

const UpdateClientLocation = ({
  currentClientLocation,
  masterLocations,
  locationId,
  autoClose,
}: {
  locationId: number;
  autoClose: () => void;
  masterLocations: locations[];
  currentClientLocation: any;
}) => {
  const getUpdatedFields = (initialValues: any, values: any) => {
    return Object.keys(values).reduce((acc: Record<string, any>, key) => {
      if (values[key] !== initialValues[key]) {
        acc[key] = values[key];
      }
      return acc;
    }, {});
  };

  const handleCancel = () => {
    formik.resetForm();
    autoClose();
  };

  const formik = useFormik<clientLocationFormValues>({
    initialValues: currentClientLocation,
    // validationSchema: clientLocationSchema,
    validateOnChange: true,
    validateOnBlur: true,

    onSubmit: async (values) => {
      console.log(currentClientLocation);
      const updatedFields = getUpdatedFields(currentClientLocation, values);
      console.log(updatedFields);
      console.log(locationId);
      try {
        updateClientLocation(locationId, updatedFields).then((data) => {
          console.log(data);
          if (data.status === 200) {
            toast.success("Branch updated successfully", {
              position: "top-right",
            });
            autoClose();
          } else {
            toast.error(data.message, {
              position: "top-right",
            });
          }
        });
      } catch (error) {
        console.error("Form submission error", error);
      }
    },
  });
  const onChangeState = (location: locations) => {
    formik.setFieldValue("state", { locationId: location.locationId });
  };

  const UpdateNewState = async (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik.setFieldValue("state", location);
    autoClose();
  };

  const onChangeCity = (location: locations) => {
    formik.setFieldValue("cityId", {
      locationId: location.locationId,
      locationDetails: location.locationDetails,
    });
  };

  const UpdateNewCity = async (location: locations) => {
    if (masterLocations.includes(location)) {
      toast.error("Location already exists");
      return;
    }
    formik.setFieldValue("cityId", location);
    autoClose();
  };

  return (
    <Popup onClose={() => autoClose()}>
      <div className="min-h-screen my-8">
        <div className="bg-white shadow-lg rounded-2xl mx-auto max-w-4xl">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900">Update Branch</h1>
          </div>

          <form className="p-8" onSubmit={formik.handleSubmit}>
            {/* Address Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                Address Details
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                {/* Address */}
                <div className="col-span-2">
                  <label
                    htmlFor="address1"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Address
                  </label>
                  <input
                    id="address1"
                    name="address1"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter Address"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address1}
                  />
                  {formik.touched.address1 && formik.errors.address1 && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.address1}
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div className="col-span-2">
                  <label
                    htmlFor="pincode"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    name="pincode"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter Pincode"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.pincode}
                  />
                  {formik.touched.pincode && formik.errors.pincode && (
                    <div className="text-red-500 text-sm mt-1">
                      {formik.errors.pincode}
                    </div>
                  )}
                </div>
                {/* State */}
                <div>
                  <label
                    htmlFor="state"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    State
                  </label>
                  <LocationAutocomplete
                    name="state"
                    id="state"
                    placeholder="Select State"
                    styleMod="w-full border-0 border-b border-gray-300 focus:ring-0 text-sm placeholder-gray-400 rounded-none py-1"
                    value={formik.values.state?.locationDetails ?? ""}
                    onChange={onChangeState}
                    options={masterLocations}
                    onAdd={UpdateNewState}
                  />
                </div>

                {/* City */}
                <div>
                  <label
                    htmlFor="city"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    City
                  </label>
                  <LocationAutocomplete
                    name="city"
                    id="city"
                    placeholder="Select City"
                    styleMod="w-full py-1 border-0 border-b border-gray-300 focus:ring-0 text-sm placeholder-gray-400 rounded-none"
                    value={formik.values.cityId?.locationDetails ?? ""}
                    onChange={onChangeCity}
                    options={masterLocations}
                    onAdd={UpdateNewCity}
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                Contact Details
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* HR Contact Person */}
                <div className="col-span-2">
                  <label
                    htmlFor="hrContactPerson"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    HR Contact Person
                  </label>
                  <input
                    id="hrContactPerson"
                    name="hrContactPerson"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter HR Contact Person Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.hrContactPerson}
                  />
                  {formik.touched.hrContactPerson &&
                    formik.errors.hrContactPerson && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.hrContactPerson}
                      </div>
                    )}
                </div>

                {/* Technical Person */}
                <div>
                  <label
                    htmlFor="technicalPerson"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Technical Person
                  </label>
                  <input
                    id="technicalPerson"
                    name="technicalPerson"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter Technical Person Name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.technicalPerson}
                  />
                  {formik.touched.technicalPerson &&
                    formik.errors.technicalPerson && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.technicalPerson}
                      </div>
                    )}
                </div>

                {/* HR Mobile Number */}
                <div>
                  <label
                    htmlFor="hrMobileNumber"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    HR Mobile Number
                  </label>
                  <input
                    id="hrMobileNumber"
                    name="hrMobileNumber"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter HR Mobile Number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.hrMobileNumber}
                  />
                  {formik.touched.hrMobileNumber &&
                    formik.errors.hrMobileNumber && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.hrMobileNumber}
                      </div>
                    )}
                </div>

                {/* Company Landline */}
                <div>
                  <label
                    htmlFor="companyLandline"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Company Landline
                  </label>
                  <input
                    id="companyLandline"
                    name="companyLandline"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter Company Landline"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.companyLandline}
                  />
                  {formik.touched.companyLandline &&
                    formik.errors.companyLandline && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.companyLandline}
                      </div>
                    )}
                </div>

                {/* HR Contact Email */}
                <div>
                  <label
                    htmlFor="hrContactPersonEmail"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    HR Contact Email
                  </label>
                  <input
                    id="hrContactPersonEmail"
                    name="hrContactPersonEmail"
                    type="email"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter HR Contact Email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.hrContactPersonEmail}
                  />
                  {formik.touched.hrContactPersonEmail &&
                    formik.errors.hrContactPersonEmail && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.hrContactPersonEmail}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Finance Details */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-cyan-500 mb-8">
                Finance Details
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Finance Person Name */}
                <div>
                  <label
                    htmlFor="financePocName"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Finance Person Name
                  </label>
                  <input
                    id="financePocName"
                    name="financePocName"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="Enter full name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.financePocName}
                  />
                  {formik.touched.financePocName &&
                  formik.errors.financePocName ? (
                    <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formik.errors.financePocName.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="financeEmail"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Finance Email
                  </label>
                  <input
                    id="financeEmail"
                    name="financeEmail"
                    type="email"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="abc@acme.com"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.financeEmail}
                  />
                  {formik.touched.financeEmail && formik.errors.financeEmail ? (
                    <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formik.errors.financeEmail.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* Contact Number */}
                <div>
                  <label
                    htmlFor="financeNumber"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    Contact Number
                  </label>
                  <input
                    id="financeNumber"
                    name="financeNumber"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="9876543340"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.financeNumber}
                  />
                  {formik.touched.financeNumber &&
                  formik.errors.financeNumber ? (
                    <div className="flex text-sm items-center mt-4 text-center text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formik.errors.financeNumber.toString()}</span>
                    </div>
                  ) : null}
                </div>

                {/* GST number */}
                <div>
                  <label
                    htmlFor="gstnumber"
                    className="block font-semibold text-gray-700 mb-2"
                  >
                    GST Number
                  </label>
                  <input
                    id="gstnumber"
                    name="gstnumber"
                    type="text"
                    className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors focus:outline-none"
                    placeholder="22AAAAA0000A1Z5"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.gstnumber}
                  />
                  {formik.touched.gstnumber && formik.errors.gstnumber ? (
                    <div className="flex items-center text-sm mt-4 text-center text-red-600 font-medium">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-1.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10A8 8 0 11 2 10a8 8 0 0116 0zm-8-4a1 1 0 00-1 1v3a1 1 0 002 0V7a1 1 0 00-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0010 14z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formik.errors.gstnumber?.toString()}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
              <CancelButton executable={handleCancel}></CancelButton>
              <SubmitButton label="Submit"></SubmitButton>
            </div>
          </form>
        </div>
      </div>
    </Popup>
  );
};

export default UpdateClientLocation;
