"use client";

import { useDispatch, useSelector } from "react-redux";
import { updateCandidateFormData } from "@/Features/candidateSlice";
import { useField } from "formik";
// import { FaGlobe, FaBloggerB, FaGithub, FaLinkedin } from "react-icons/fa";

export default function Step5SocialLinks() {
  const dispatch = useDispatch();
  const formData = useSelector((state: any) => state.candidate.formData);

  // Formik hooks
  const [websiteField] = useField("website");
  const [blogField] = useField("blog");
  const [githubField] = useField("github");
  const [linkedinField] = useField("linkedin");

  const handleInputChange = (field: string, value: string) => {
    dispatch(updateCandidateFormData({ [field]: value }));
  };

  return (
    <div className=" bg-white rounded-lg space-y-10">
      <h2 className="text-cyan-600 font-semibold text-lg">Social Links</h2>

      {/* Website */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Website</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaGlobe className="text-gray-400" /> */}
          <input
            {...websiteField}
            value={formData.website || ""}
            onChange={(e) => {
              websiteField.onChange(e);
              handleInputChange("website", e.target.value);
            }}
            placeholder="https://myweb.co"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      {/* Blog */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Blog</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaBloggerB className="text-gray-400" /> */}
          <input
            {...blogField}
            value={formData.blog || ""}
            onChange={(e) => {
              blogField.onChange(e);
              handleInputChange("blog", e.target.value);
            }}
            placeholder="https://www.blog.my_blog_name"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      {/* Github */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Github</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaGithub className="text-gray-400" /> */}
          <input
            {...githubField}
            value={formData.github || ""}
            onChange={(e) => {
              githubField.onChange(e);
              handleInputChange("github", e.target.value);
            }}
            placeholder="https://github.com/username"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>

      {/* Linkedin */}
      <div className="space-y-4">
        <label className="block font-semibold mb-1">Linkedin</label>
        <div className="flex items-center gap-2 border-b pb-1">
          {/* <FaLinkedin className="text-gray-400" /> */}
          <input
            {...linkedinField}
            value={formData.linkedin || ""}
            onChange={(e) => {
              linkedinField.onChange(e);
              handleInputChange("linkedin", e.target.value);
            }}
            placeholder="https://www.linkedin.com/in/username"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
          />
        </div>
      </div>
    </div>
  );
}
