// src/lib/utils/registration-validation.ts

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface RegistrationFormData {
  // Personal Information
  placeOfBirth: string;
  dateOfBirth: string;
  stateOfOrigin: string;
  homeAddress: string;
  graduatePhoneNumber: string;
  email: string;
  maritalStatus: "SINGLE" | "MARRIED";

  // Posting Preferences
  preferredCityOfPosting: string;
  accommodation: string;
  whereAccommodation: string;
  kindAccommodation: string;
  contactOfPersonLivingWith: string;

  // Spiritual Journey
  whereWhenChrist: string;
  whereWhenHolyGhost: string;
  whereWhenBaptism: string;
  whereWhenFoundationSchool: string;
  hasCertificate: boolean;
  localAssemblyAfterGraduation: string;

  // Family Information
  fatherName: string;
  fatherPhoneNumber: string;
  fatherEmailAddress: string;
  fatherOccupation: string;
  nameOfFatherChurch: string;
  motherName: string;
  motherPhoneNumber: string;
  motherEmailAddress: string;
  motherOccupation: string;
  nameOfMotherChurch: string;
  howManyInFamily: string;
  whatPositionInFamily: string;
  familyResidence: string;
  parentsTogether: boolean;
  parentsAwareOfVgssIntention: boolean;

  // Education Information
  nameOfUniversity: string;
  courseOfStudy: string;
  graduationYear: string;
  grade: string;
  nyscStatus: "COMPLETED" | "IN_PROGRESS" | "NOT_STARTED" | "EXEMPTED";

  // Skills and Experience
  skillsPossessed: string;
  leadershipRolesInMinistryAndFellowship: string;
  ministryProgramsAttended: string;

  // Test Questions
  visionMissionPurpose: string;
  explainWithExamples: string;
  partnershipArms: string;
  fullMeaning: string;
  variousTasksResponsibleFor: string;
  projectProudOfAndRolePlayed: string;
  exampleDifficultSituation: string;
  recentConflict: string;
  convictions: string;
  whyVgss: string;
  plansAfterVgss: string;

  // Password for account creation
  password: string;
  confirmPassword: string;
}

// Validate personal information
export function validatePersonalInfo(
  data: Partial<RegistrationFormData>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.placeOfBirth?.trim()) errors.push("Place of birth is required");
  if (!data.dateOfBirth) errors.push("Date of birth is required");
  if (!data.stateOfOrigin?.trim()) errors.push("State of origin is required");
  if (!data.homeAddress?.trim()) errors.push("Home address is required");
  if (!data.graduatePhoneNumber?.trim())
    errors.push("Phone number is required");
  if (!data.email?.trim()) errors.push("Email address is required");

  // Email validation
  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push("Please enter a valid email address");
    }
  }

  // Phone number validation
  if (data.graduatePhoneNumber) {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
    if (!phoneRegex.test(data.graduatePhoneNumber)) {
      errors.push("Please enter a valid phone number");
    }
  }

  // Date of birth validation
  if (data.dateOfBirth) {
    const birthDate = new Date(data.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      errors.push("You must be at least 18 years old to register");
    }
    if (age > 35) {
      warnings.push("VGSS typically accepts graduates under 35 years old");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate family information
export function validateFamilyInfo(
  data: Partial<RegistrationFormData>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.fatherName?.trim()) errors.push("Father's name is required");
  if (!data.fatherPhoneNumber?.trim())
    errors.push("Father's phone number is required");
  if (!data.fatherOccupation?.trim())
    errors.push("Father's occupation is required");
  if (!data.motherName?.trim()) errors.push("Mother's name is required");
  if (!data.motherPhoneNumber?.trim())
    errors.push("Mother's phone number is required");
  if (!data.motherOccupation?.trim())
    errors.push("Mother's occupation is required");
  if (!data.howManyInFamily?.trim()) errors.push("Family size is required");
  if (!data.whatPositionInFamily?.trim())
    errors.push("Your position in family is required");
  if (!data.familyResidence?.trim())
    errors.push("Family residence is required");

  // Numeric validation
  const familySize = parseInt(data.howManyInFamily || "0");
  const position = parseInt(data.whatPositionInFamily || "0");

  if (familySize < 1) {
    errors.push("Family size must be at least 1");
  }
  if (position < 1 || position > familySize) {
    errors.push(
      "Your position in family must be between 1 and the total family size"
    );
  }

  // Email validation for parents (optional)
  if (data.fatherEmailAddress && !isValidEmail(data.fatherEmailAddress)) {
    errors.push("Father's email address is not valid");
  }
  if (data.motherEmailAddress && !isValidEmail(data.motherEmailAddress)) {
    errors.push("Mother's email address is not valid");
  }

  // Parent awareness warning
  if (!data.parentsAwareOfVgssIntention) {
    warnings.push(
      "It's recommended that your parents are aware of your VGSS intention"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate education information
export function validateEducationInfo(
  data: Partial<RegistrationFormData>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!data.nameOfUniversity?.trim())
    errors.push("University name is required");
  if (!data.courseOfStudy?.trim()) errors.push("Course of study is required");
  if (!data.graduationYear?.trim()) errors.push("Graduation year is required");
  if (!data.grade?.trim()) errors.push("Grade/class of degree is required");
  if (!data.nyscStatus) errors.push("NYSC status is required");

  // Graduation year validation
  if (data.graduationYear) {
    const year = parseInt(data.graduationYear);
    const currentYear = new Date().getFullYear();

    if (year < 2000 || year > currentYear + 2) {
      errors.push("Please enter a valid graduation year");
    }
    if (year > currentYear) {
      warnings.push("Future graduation dates should be confirmed");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate spiritual journey
export function validateSpiritualJourney(
  data: Partial<RegistrationFormData>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  const requiredFields = [
    { field: "whereWhenChrist", label: "Your born-again experience" },
    {
      field: "whereWhenHolyGhost",
      label: "Your Holy Spirit baptism experience",
    },
    { field: "whereWhenBaptism", label: "Your water baptism experience" },
    {
      field: "whereWhenFoundationSchool",
      label: "Your Foundation School attendance",
    },
  ];

  requiredFields.forEach(({ field, label }) => {
    const value = data[field as keyof RegistrationFormData] as string;
    if (!value?.trim()) {
      errors.push(`${label} is required`);
    } else if (value.trim().length < 20) {
      warnings.push(
        `${label} should be more detailed (at least 20 characters)`
      );
    }
  });

  // Foundation School certificate warning
  if (!data.hasCertificate) {
    warnings.push(
      "Having a Foundation School certificate is highly recommended for VGSS"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate test questions
export function validateTestQuestions(
  data: Partial<RegistrationFormData>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const requiredQuestions = [
    {
      field: "visionMissionPurpose",
      label: "Vision, Mission and Purpose of Christ Embassy",
      minLength: 50,
    },
    {
      field: "explainWithExamples",
      label: "Taking Divine Presence to your world",
      minLength: 100,
    },
    {
      field: "partnershipArms",
      label: "The 5 partnership arms",
      minLength: 30,
    },
    { field: "fullMeaning", label: "Full meaning of Rehoboth", minLength: 20 },
    {
      field: "variousTasksResponsibleFor",
      label: "Tasks in local assembly",
      minLength: 50,
    },
    {
      field: "projectProudOfAndRolePlayed",
      label: "Project you are proud of",
      minLength: 50,
    },
    {
      field: "exampleDifficultSituation",
      label: "Difficult situation example",
      minLength: 50,
    },
    {
      field: "recentConflict",
      label: "Recent conflict resolution",
      minLength: 50,
    },
    { field: "convictions", label: "Your convictions", minLength: 30 },
    { field: "whyVgss", label: "Why you want to join VGSS", minLength: 50 },
    { field: "plansAfterVgss", label: "Plans after VGSS", minLength: 30 },
  ];

  requiredQuestions.forEach(({ field, label, minLength }) => {
    const value = data[field as keyof RegistrationFormData] as string;
    if (!value?.trim()) {
      errors.push(`${label} is required`);
    } else if (value.trim().length < minLength) {
      warnings.push(
        `${label} should be more detailed (at least ${minLength} characters)`
      );
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate password
export function validatePassword(
  password: string,
  confirmPassword: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!password) {
    errors.push("Password is required");
  } else {
    if (password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (password.length < 8) {
      warnings.push(
        "Consider using a password with at least 8 characters for better security"
      );
    }
    if (!/[A-Z]/.test(password)) {
      warnings.push(
        "Consider including uppercase letters for stronger password"
      );
    }
    if (!/[0-9]/.test(password)) {
      warnings.push("Consider including numbers for stronger password");
    }
  }

  if (!confirmPassword) {
    errors.push("Password confirmation is required");
  } else if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Validate entire form
export function validateCompleteForm(
  data: RegistrationFormData
): ValidationResult {
  const personalResult = validatePersonalInfo(data);
  const familyResult = validateFamilyInfo(data);
  const educationResult = validateEducationInfo(data);
  const spiritualResult = validateSpiritualJourney(data);
  const testResult = validateTestQuestions(data);
  const passwordResult = validatePassword(data.password, data.confirmPassword);

  // Posting preferences validation
  const postingErrors: string[] = [];
  if (!data.preferredCityOfPosting?.trim()) {
    postingErrors.push("Preferred city of posting is required");
  }

  const allErrors = [
    ...personalResult.errors,
    ...familyResult.errors,
    ...educationResult.errors,
    ...spiritualResult.errors,
    ...testResult.errors,
    ...passwordResult.errors,
    ...postingErrors,
  ];

  const allWarnings = [
    ...personalResult.warnings,
    ...familyResult.warnings,
    ...educationResult.warnings,
    ...spiritualResult.warnings,
    ...testResult.warnings,
    ...passwordResult.warnings,
  ];

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };
}

// Helper function to validate email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Get validation for specific tab
export function validateTab(
  tabId: string,
  data: Partial<RegistrationFormData>
): ValidationResult {
  switch (tabId) {
    case "personal":
      return validatePersonalInfo(data);
    case "family":
      return validateFamilyInfo(data);
    case "education":
      return validateEducationInfo(data);
    case "spiritual":
      return validateSpiritualJourney(data);
    case "test":
      return validateTestQuestions(data);
    case "account":
      return validatePassword(data.password || "", data.confirmPassword || "");
    case "posting":
      return {
        isValid: !!data.preferredCityOfPosting?.trim(),
        errors: !data.preferredCityOfPosting?.trim()
          ? ["Preferred city of posting is required"]
          : [],
        warnings: [],
      };
    default:
      return { isValid: true, errors: [], warnings: [] };
  }
}

// Calculate completion percentage
export function calculateCompletionPercentage(
  data: Partial<RegistrationFormData>
): number {
  const allFields = [
    "placeOfBirth",
    "dateOfBirth",
    "stateOfOrigin",
    "homeAddress",
    "graduatePhoneNumber",
    "email",
    "maritalStatus",
    "preferredCityOfPosting",
    "whereWhenChrist",
    "whereWhenHolyGhost",
    "whereWhenBaptism",
    "whereWhenFoundationSchool",
    "fatherName",
    "fatherPhoneNumber",
    "fatherOccupation",
    "motherName",
    "motherPhoneNumber",
    "motherOccupation",
    "howManyInFamily",
    "whatPositionInFamily",
    "familyResidence",
    "nameOfUniversity",
    "courseOfStudy",
    "graduationYear",
    "grade",
    "nyscStatus",
    "visionMissionPurpose",
    "explainWithExamples",
    "partnershipArms",
    "fullMeaning",
    "variousTasksResponsibleFor",
    "projectProudOfAndRolePlayed",
    "exampleDifficultSituation",
    "recentConflict",
    "convictions",
    "whyVgss",
    "plansAfterVgss",
    "password",
    "confirmPassword",
  ];

  const completedFields = allFields.filter((field) => {
    const value = data[field as keyof RegistrationFormData];
    if (typeof value === "boolean") return true;
    if (typeof value === "string") return value.trim() !== "";
    return false;
  });

  return Math.round((completedFields.length / allFields.length) * 100);
}
