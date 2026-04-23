import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface SerializedAttachment {
  attachmentUrls: string[];
}

export interface BaseEntity {
  id: string;
  createdAt: string; 
  updatedAt: string;
}

export interface McqQuestion extends BaseEntity, SerializedAttachment {
  questionText: string;
  options: string; 
  correctOptions?: string;
  questionMark: number;
  explanation?: string;
}

export interface RedactionQuestion extends BaseEntity, SerializedAttachment {
  questionText: string;
  questionMark: number;
}

export interface Assessment extends BaseEntity {
  courseId: string;
  title: string;
  description: string;
  totalMarks: number;
  mcqs: McqQuestion[];
  redactionQuestions: RedactionQuestion[];
}

export interface Chapter extends BaseEntity, SerializedAttachment {
  courseId: string;
  title: string;
  description: string;
}

export interface SerializedCourse {
  id: string;
  name: string;
  description: string;
  term: number;
  professorFirstname: string;
  professorLastname: string;
  chapters: Chapter[];
  exams: Assessment[];
  tests: Assessment[];
}

export default function useCourses() {
  return useQuery({
    queryKey: ["student-courses"],
    queryFn: async () => {
      const response = await api.get<SerializedCourse[]>("/student");
      return response.data;
    },
  });
}
