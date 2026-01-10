import z from "zod";

export const uploadGraduateSchema = z.object({
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
  graduateGender: z.enum(["FEMALE", "MALE"], {
    message: "Gender must be MALE or FEMALE",
  }),
  graduatePhoneNumber: z.string().trim().min(1, "Phone number is required"),
  nameOfUniversity: z.string().trim().min(1, "University is required"),
  courseOfStudy: z.string().trim().min(1, "Course of study is required"),
  graduationYear: z
    .string()
    .min(1, "Graduation year is required")
    .refine(
      (val) => {
        const year = parseInt(val, 10);
        return !isNaN(year) && year >= 1990 && year <= 2030;
      },
      { message: "Graduation year must be between 1990 and 2030" }
    ),
  chapterId: z.string().trim().min(1, "Chapter is required"),
  nameOfZonalPastor: z.string().trim().min(1, "Zonal Pastor name is required"),
  nameOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor name is required"),
  phoneNumberOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),

  kingschatIDOfChapterPastor: z
    .string()
    .trim()
    .min(1, "Chapter Pastor Phone number is required"),
});
