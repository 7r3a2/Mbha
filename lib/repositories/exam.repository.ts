import { prisma } from '../prisma';
import { CreateExamInput } from '../types/exam';

export const getAllExams = async () => {
  return prisma.exam.findMany({
    orderBy: [
      { subject: 'asc' },
      { order: 'asc' },
    ],
  });
};

export const getExamById = async (id: string) => {
  return prisma.exam.findUnique({
    where: { id },
  });
};

export const createExam = async (examData: CreateExamInput) => {
  return prisma.exam.create({
    data: {
      title: examData.title,
      subject: examData.subject,
      examTime: examData.examTime,
      secretCode: examData.secretCode,
      questions: examData.questions,
      order: 1,
    },
  });
};

export const updateExam = async (id: string, data: Partial<CreateExamInput & { order: number }>) => {
  return prisma.exam.update({
    where: { id },
    data,
  });
};

export const deleteExam = async (examId: string) => {
  return prisma.exam.delete({
    where: { id: examId },
  });
};
