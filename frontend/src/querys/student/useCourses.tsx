import { useMutation } from "@tanstack/react-query";
import { api } from "../axios";

export interface SerializedAttachment {
  // Assuming attachmentUrls is an array of strings based on the docs
  attachmentUrls: string[];
}

export interface BaseEntity extends SerializedAttachment {
  id: string;
  createdAt: string; // ISO string format
  updatedAt: string;
}

export interface McqQuestion extends BaseEntity {
  questionText: string;
  options: string; // JSON string or comma-separated as per docs
  correctOptions: string;
  questionMark: number;
  explanation?: string;
}

export interface RedactionQuestion extends BaseEntity {
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

export interface Chapter extends BaseEntity {
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
  return useMutation({
    mutationFn: async () => {
      const response = await api.post<SerializedCourse[]>("/student");
      return response.data;
    },
  });
}
