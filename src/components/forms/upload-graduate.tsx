import React from "react";
import z from "zod";

const FormValues = z.object({
  graduateFirstname: z
    .string()
    .trim()
    .min(1, "Firstname is required")
    .min(2, "Firstname must be at least 3 characters long"),
  graduateSurname: z
    .string()
    .trim()
    .min(1, "Surname is required")
    .min(2, "Surname must be at least 3 characters long"),
  graduateGender: z.enum(["FEMALE", "MALE"], "Gender must be MALE or FEMALE"),
  graduatePhoneNumber: z.string().trim().min(1, "Phone number is required"),
  nameOfUniversity: z.string().trim().min(1, "University is required"),
  courseOfStudy: z.string().trim().min(1, "Course of study is required"),
  graduationYear: z.string().trim().min(1, "Year of graduation is required"),
  chapter: z.string().trim().min(1, "Chapter is required"),
  nameOfZonalPastor: z.string().trim().min(1, "Zonal Pastor name is required"),
  nameOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor name is required"),
  phoneNumberOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
  emailOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
  kingschatIDOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
});

const UploadGraduateForm = () => {
  return <form></form>;
};

export default UploadGraduateForm;
