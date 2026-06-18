// ═══════════════════════════════════════════════
//  GRADE POINTS
// ═══════════════════════════════════════════════

const gradePoints = {
  O: 10,
  E: 9,
  A: 8,
  B: 7,
  C: 6,
  D: 5,
  U: 0
};

// Marks → Grade conversion
function marksToGrade(marks) {
  const m = Number(marks);
  if (m >= 90) return "O";
  if (m >= 80) return "E";
  if (m >= 70) return "A";
  if (m >= 60) return "B";
  if (m >= 50) return "C";
  if (m >= 40) return "D";
  return "U";
}

// ═══════════════════════════════════════════════
//  SEMESTER DATA
// ═══════════════════════════════════════════════

const semesterData = {

  // ── 1st Year – Semester 1 ──
  "1yr-1": {
    label: "1st Year • Semester 1",
    subjects: [
      { name: "ODE & Matrix Algebra", credit: 3, type: "theory" },
      { name: "Engineering Chemistry / Engineering Physics", credit: 3, type: "theory" },
      { name: "Basic Electronics Engineering / Basic Electrical Engineering", credit: 3, type: "theory" },
      { name: "Engineering Mechanics / Engineering Thermodynamics", credit: 2, type: "theory" },
      { name: "Computer Programming", credit: 3, type: "theory" },
      { name: "Constitution of India & Professional Ethics / Environmental Science", credit: 0, type: "theory" },
      { name: "Basic Electronics Engineering Lab / Basic Electrical Engineering Lab", credit: 1, type: "practical" },
      { name: "Computer Programming Lab", credit: 2, type: "practical" },
      { name: "Communicative & Technical English", credit: 2, type: "practical" },
      { name: "Workbench Practices / Engineering Graphics", credit: 1, type: "practical" }
    ]
  },

  // ── 1st Year – Semester 2 ──
  "1yr-2": {
    label: "1st Year • Semester 2",
    subjects: [
      { name: "Probability & Statistics", credit: 3, type: "theory" },
      { name: "Engineering Physics / Engineering Chemistry", credit: 3, type: "theory" },
      { name: "Basic Electrical Engineering / Basic Electronics Engineering", credit: 3, type: "theory" },
      { name: "Engineering Thermodynamics / Engineering Mechanics", credit: 2, type: "theory" },
      { name: "Data Structures & Algorithms", credit: 3, type: "theory" },
      { name: "Constitution of India & Professional Ethics / Environmental Science", credit: 0, type: "theory" },
      { name: "Basic Electronics Engineering Lab / Basic Electrical Engineering Lab", credit: 1, type: "practical" },
      { name: "Data Structures & Algorithms Lab", credit: 2, type: "practical" },
      { name: "Corporate Communication Skills", credit: 2, type: "practical" },
      { name: "Engineering Graphics / Workbench Practices", credit: 1, type: "practical" }
    ]
  },

  // ── CSE – Semester 3 ──
  "cse-3": {
    label: "CSE • Semester 3",
    subjects: [
      { name: "Discrete Mathematics", credit: 3, type: "theory" },
      { name: "OOP Using Java", credit: 3, type: "theory" },
      { name: "Management & Economics for Engineers / Biology for Engineers", credit: 3, type: "theory" },
      { name: "Design & Analysis of Algorithms", credit: 4, type: "theory" },
      { name: "Operating Systems", credit: 3, type: "theory" },
      { name: "Digital Electronics", credit: 3, type: "theory" },
      { name: "OOP Using Java Lab", credit: 1, type: "practical" },
      { name: "Design & Analysis of Algorithms Lab", credit: 1, type: "practical" },
      { name: "Operating Systems Lab", credit: 1, type: "practical" },
      { name: "Digital Electronics Lab", credit: 1, type: "practical" },
      { name: "Summer Internship I", credit: 1, type: "project" }
    ]
  },

  // ── CSE – Semester 4 ──
  "cse-4": {
    label: "CSE • Semester 4",
    subjects: [
      { name: "Optimization Techniques", credit: 3, type: "theory" },
      { name: "Programming in Python", credit: 3, type: "theory" },
      { name: "Management & Economics for Engineers / Biology for Engineers", credit: 3, type: "theory" },
      { name: "Computer Organization & Architecture", credit: 3, type: "theory" },
      { name: "Database Management Systems", credit: 4, type: "theory" },
      { name: "Program Elective - I", credit: 3, type: "theory" },
      { name: "Honours / Minor - I", credit: 3, optional: true, type: "optional" },
      { name: "Programming in Python Lab", credit: 1, type: "practical" },
      { name: "Computer Organization & Architecture Lab", credit: 1, type: "practical" },
      { name: "Database Management Systems Lab", credit: 2, type: "practical" },
      { name: "Internet & Web Technology Lab", credit: 2, type: "practical" }
    ]
  },

  // ── CSE – Semester 5 ──
  "cse-5": {
    label: "CSE • Semester 5",
    subjects: [
      { name: "Computer Networks", credit: 3, type: "theory" },
      { name: "Machine Learning", credit: 4, type: "theory" },
      { name: "Software Engineering", credit: 3, type: "theory" },
      { name: "Formal Languages & Automata Theory", credit: 3, type: "theory" },
      { name: "Program Elective - II", credit: 3, type: "theory" },
      { name: "Program Elective - III", credit: 3, type: "theory" },
      { name: "Honours / Minor - II", credit: 3, optional: true, type: "optional" },
      { name: "Computer Networks Lab", credit: 1, type: "practical" },
      { name: "Machine Learning Lab", credit: 1, type: "practical" },
      { name: "Software Engineering Lab", credit: 1, type: "practical" },
      { name: "Soft Skills for Professionals", credit: 1, type: "practical" },
      { name: "Summer Internship - II", credit: 1, type: "project" }
    ]
  },

  // ── CSE – Semester 6 ──
  "cse-6": {
    label: "CSE • Semester 6",
    subjects: [
      { name: "Internet of Things", credit: 3, type: "theory" },
      { name: "Soft Computing", credit: 3, type: "theory" },
      { name: "Compiler Design", credit: 3, type: "theory" },
      { name: "Program Elective - IV", credit: 3, type: "theory" },
      { name: "Program Elective - V", credit: 3, type: "theory" },
      { name: "Program Elective - VI", credit: 3, type: "theory" },
      { name: "Honours / Minor - III", credit: 4, optional: true, type: "optional" },
      { name: "Internet of Things Lab", credit: 1, type: "practical" },
      { name: "Soft Computing Lab", credit: 1, type: "practical" },
      { name: "Emerging Technologies Lab / Entrepreneurship & Innovation", credit: 2, type: "practical" },
      { name: "Technical & Research Writing", credit: 1, type: "practical" },
      { name: "Yoga / NSS / NCC / PES / CPA", credit: 0, type: "practical" }
    ]
  },

  // ── CSE – Semester 7 ──
  "cse-7": {
    label: "CSE • Semester 7",
    subjects: [
      { name: "Open Elective - I", credit: 3, type: "theory" },
      { name: "MOOC - I", credit: 3, type: "theory" },
      { name: "Honours / Minor - IV", credit: 4, optional: true, type: "optional" },
      { name: "Project Phase - I", credit: 6, type: "project" },
      { name: "Industrial Training / Internship", credit: 4, type: "project" }
    ]
  },

  // ── CSE – Semester 8 ──
  "cse-8": {
    label: "CSE • Semester 8",
    subjects: [
      { name: "Open Elective - II", credit: 3, type: "theory" },
      { name: "MOOC - II", credit: 3, type: "theory" },
      { name: "Honours / Minor - V", credit: 4, optional: true, type: "optional" },
      { name: "Project Phase - II", credit: 8, type: "project" }
    ]
  },

  // ── CSE – Semester 7 (Project School) ──
  "cse-7-ps": {
    label: "CSE • Semester 7 (PS)",
    subjects: [
      { name: "Project Phase - I (PS)", credit: 8, type: "project" },
      { name: "Professional Elective - I (PS)", credit: 3, type: "theory" },
      { name: "Honours / Minor - IV", credit: 4, optional: true, type: "optional" }
    ]
  },

  // ── CSE – Semester 8 (Project School) ──
  "cse-8-ps": {
    label: "CSE • Semester 8 (PS)",
    subjects: [
      { name: "Project Phase - II (PS)", credit: 12, type: "project" },
      { name: "Professional Elective - II (PS)", credit: 3, type: "theory" },
      { name: "Honours / Minor - V", credit: 4, optional: true, type: "optional" }
    ]
  },

  // ── ECE – Semester 3 ──
  "ece-3": {
    label: "ECE • Semester 3",
    subjects: [
      { name: "Mathematics - III (Transform Techniques)", credit: 3, type: "theory" },
      { name: "Electronic Devices & Circuits", credit: 3, type: "theory" },
      { name: "Signals & Systems", credit: 3, type: "theory" },
      { name: "Digital Electronics", credit: 3, type: "theory" },
      { name: "Management & Economics for Engineers", credit: 3, type: "theory" },
      { name: "Electronic Devices & Circuits Lab", credit: 2, type: "practical" },
      { name: "Digital Electronics Lab", credit: 2, type: "practical" },
      { name: "Summer Internship I", credit: 1, type: "project" }
    ]
  },

  // ── ECE – Semester 4 ──
  "ece-4": {
    label: "ECE • Semester 4",
    subjects: [
      { name: "Analog Communication", credit: 3, type: "theory" },
      { name: "Linear Integrated Circuits", credit: 3, type: "theory" },
      { name: "Microprocessors & Microcontrollers", credit: 3, type: "theory" },
      { name: "Electromagnetic Theory", credit: 3, type: "theory" },
      { name: "Biology for Engineers / Management & Economics", credit: 3, type: "theory" },
      { name: "Program Elective - I", credit: 3, type: "theory" },
      { name: "Honours / Minor - I", credit: 3, optional: true, type: "optional" },
      { name: "Analog Communication Lab", credit: 1, type: "practical" },
      { name: "Linear Integrated Circuits Lab", credit: 1, type: "practical" },
      { name: "Microprocessors & Microcontrollers Lab", credit: 2, type: "practical" }
    ]
  },

  // ── EEE – Semester 3 ──
  "eee-3": {
    label: "EEE • Semester 3",
    subjects: [
      { name: "Mathematics - III", credit: 3, type: "theory" },
      { name: "Electrical Machines - I", credit: 3, type: "theory" },
      { name: "Electric Circuit Theory", credit: 3, type: "theory" },
      { name: "Digital Electronics", credit: 3, type: "theory" },
      { name: "Management & Economics for Engineers", credit: 3, type: "theory" },
      { name: "Electrical Machines - I Lab", credit: 2, type: "practical" },
      { name: "Electric Circuit Theory Lab", credit: 2, type: "practical" },
      { name: "Summer Internship I", credit: 1, type: "project" }
    ]
  },

  // ── EIE – Semester 3 ──
  "eie-3": {
    label: "EIE • Semester 3",
    subjects: [
      { name: "Mathematics - III", credit: 3, type: "theory" },
      { name: "Transducers & Instrumentation", credit: 3, type: "theory" },
      { name: "Electronic Devices & Circuits", credit: 3, type: "theory" },
      { name: "Signals & Systems", credit: 3, type: "theory" },
      { name: "Management & Economics for Engineers", credit: 3, type: "theory" },
      { name: "Transducers & Instrumentation Lab", credit: 2, type: "practical" },
      { name: "Electronic Devices & Circuits Lab", credit: 2, type: "practical" },
      { name: "Summer Internship I", credit: 1, type: "project" }
    ]
  }

};

// ═══════════════════════════════════════════════
//  MOTIVATION MESSAGES
// ═══════════════════════════════════════════════

function getMotivation(sgpa) {
  if (sgpa >= 9.5) return { title: "Outstanding!", message: "You're in the top tier. Truly exceptional performance!" };
  if (sgpa >= 9.0) return { title: "Excellent!", message: "Brilliant work! Keep this momentum going." };
  if (sgpa >= 8.0) return { title: "Very Good!", message: "Strong performance. You're on the right path." };
  if (sgpa >= 7.0) return { title: "Good Job!", message: "Solid results. A little more effort and you'll be excellent." };
  if (sgpa >= 6.0) return { title: "Above Average", message: "You're doing okay. Focus more to level up." };
  if (sgpa >= 5.0) return { title: "Average", message: "There's significant room for improvement. Stay consistent." };
  if (sgpa >= 1.0) return { title: "Below Average", message: "Don't give up! Plan better and seek help if needed." };
  return { title: "Failed", message: "This is a setback, not the end. Analyse, adapt, and come back stronger." };
}

function getCgpaMotivation(cgpa) {
  if (cgpa >= 9.5) return { title: "Outstanding!", message: "Exceptional cumulative performance across all semesters." };
  if (cgpa >= 9.0) return { title: "Excellent!", message: "You are among the top performers. Incredible work!" };
  if (cgpa >= 8.0) return { title: "Very Good!", message: "Strong CGPA! You're building a great academic record." };
  if (cgpa >= 7.0) return { title: "Good!", message: "Decent CGPA. With more focus you can reach new heights." };
  if (cgpa >= 6.0) return { title: "Average", message: "Work harder each semester to improve your cumulative score." };
  return { title: "Needs Improvement", message: "Focus on consistent performance in upcoming semesters." };
}
