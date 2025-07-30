import LocationAutocomplete from "@/components/Elements/utils/location-autocomplete";
import { Location } from "@/lib/definitions";
import { toast } from "react-toastify";
import { useState } from "react";
import { countryCodes } from "@/api/countryCodes";
import SubmitButton from "@/components/Elements/utils/SubmitButton";
import CancelButton from "@/components/Elements/utils/CancelButton";

const AddClient = ({
  formik,
  autoClose,
}: {
  formik: any;
  autoClose: () => void;
}) => {

  const handleCancel = () => {
    formik.resetForm();
    autoClose();
  };


  return (
    <div className="py-8 mt-6">
      <div className="bg-white shadow-lg rounded-2xl mx-auto ">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Add New Client</h1>
        </div>

        <form className="p-6" onSubmit={formik.handleSubmit}>
          {/* Basic Details Section */}
          <div className="mb-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 mb-4">
              {/* Client Name */}
              <div className="lg:col-span-2">
                <label
                  htmlFor="clientName"
                  className="block font-semibold text-gray-700 mb-2"
                >
                  Client Name
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="clientName"
                  name="clientName"
                  type="text"
                  className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                  placeholder="Enter client name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.clientName}
                />
                {formik.touched.clientName && formik.errors.clientName ? (
                  <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                    <span>{formik.errors.clientName}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Billing Details Section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-cyan-500 mb-4">
              Billing Details
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* CIN Number */}
              <div>
                <label
                  htmlFor="cinnumber"
                  className="block font-semibold text-gray-700 mb-2"
                >
                  CIN Number
                </label>
                <input
                  id="cinnumber"
                  name="cinnumber"
                  type="text"
                  className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                  placeholder="56P-XXX-XXXX"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cinnumber}
                />
                {formik.touched.cinnumber && formik.errors.cinnumber ? (
                  <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                    <span>{formik.errors.cinnumber}</span>
                  </div>
                ) : null}
              </div>

              {/* PAN Number */}
              <div>
                <label
                  htmlFor="pannumber"
                  className="block font-semibold text-gray-700 mb-2"
                >
                  PAN Number
                </label>
                <input
                  id="pannumber"
                  name="pannumber"
                  type="text"
                  className="w-full flex items-center gap-2 py-3 bg-white border-b-2 border-gray-300 focus-within:border-cyan-500 transition-colors"
                  placeholder="AQYXXX9O"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.pannumber}
                />
                {formik.touched.pannumber && formik.errors.pannumber ? (
                  <div className="flex items-center mt-4 text-center gap-1 text-red-600 font-medium">
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
                    <span>{formik.errors.pannumber}</span>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-end">
            <CancelButton executable={handleCancel}></CancelButton>
            <SubmitButton label="Submit"></SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;
