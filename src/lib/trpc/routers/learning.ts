import { z } from 'zod'
import { router, publicProcedure, protectedProcedure, adminProcedure } from '../init'

export const learningRouter = router({
  // Get all published learning paths
  listPaths: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.learningPath.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { modules: true },
        },
      },
    })
  }),

  // Get learning path by ID with modules
  getPath: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.learningPath.findUnique({
        where: { id: input.id },
        include: {
          modules: {
            orderBy: { sortOrder: 'asc' },
            include: {
              quizzes: {
                orderBy: { sortOrder: 'asc' },
              },
            },
          },
        },
      })
    }),

  // Get module by ID
  getModule: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.learningModule.findUnique({
        where: { id: input.id },
        include: {
          learningPath: true,
          quizzes: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })
    }),

  // Admin: Get all learning paths including unpublished
  adminListPaths: adminProcedure.query(async ({ ctx }) => {
    return ctx.prisma.learningPath.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        _count: {
          select: { modules: true },
        },
      },
    })
  }),

  // Admin: Create learning path
  createPath: adminProcedure
    .input(
      z.object({
        titleEn: z.string().min(1),
        titleAm: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAm: z.string().optional(),
        coverImage: z.string().url().optional().or(z.literal('')),
        difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        estimatedDurationMinutes: z.number().optional(),
        isPublished: z.boolean().default(false),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.learningPath.create({
        data: {
          ...input,
          coverImage: input.coverImage || null,
          createdById: ctx.userId,
        },
      })
    }),

  // Admin: Update learning path
  updatePath: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        titleEn: z.string().min(1).optional(),
        titleAm: z.string().optional(),
        descriptionEn: z.string().optional(),
        descriptionAm: z.string().optional(),
        coverImage: z.string().url().optional().or(z.literal('')).nullable(),
        difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
        estimatedDurationMinutes: z.number().optional().nullable(),
        isPublished: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.learningPath.update({
        where: { id },
        data,
      })
    }),

  // Admin: Delete learning path
  deletePath: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.learningPath.delete({ where: { id: input.id } })
      return { success: true }
    }),

  // Admin: Create module
  createModule: adminProcedure
    .input(
      z.object({
        learningPathId: z.string().uuid(),
        titleEn: z.string().min(1),
        titleAm: z.string().optional(),
        contentEn: z.string().optional(),
        contentAm: z.string().optional(),
        videoUrl: z.string().url().optional().or(z.literal('')),
        sortOrder: z.number().default(0),
        estimatedDurationMinutes: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.learningModule.create({
        data: {
          ...input,
          videoUrl: input.videoUrl || null,
        },
      })
    }),

  // Admin: Update module
  updateModule: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        titleEn: z.string().min(1).optional(),
        titleAm: z.string().optional(),
        contentEn: z.string().optional(),
        contentAm: z.string().optional(),
        videoUrl: z.string().url().optional().or(z.literal('')).nullable(),
        sortOrder: z.number().optional(),
        estimatedDurationMinutes: z.number().optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.learningModule.update({
        where: { id },
        data,
      })
    }),

  // Admin: Delete module
  deleteModule: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.learningModule.delete({ where: { id: input.id } })
      return { success: true }
    }),

  // Admin: Create quiz
  createQuiz: adminProcedure
    .input(
      z.object({
        moduleId: z.string().uuid(),
        questionEn: z.string().min(1),
        questionAm: z.string().optional(),
        optionsEn: z.array(z.string()).min(2),
        optionsAm: z.array(z.string()).optional(),
        correctIndex: z.number().min(0),
        explanationEn: z.string().optional(),
        explanationAm: z.string().optional(),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.quiz.create({
        data: input,
      })
    }),

  // Admin: Update quiz
  updateQuiz: adminProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        questionEn: z.string().min(1).optional(),
        questionAm: z.string().optional(),
        optionsEn: z.array(z.string()).min(2).optional(),
        optionsAm: z.array(z.string()).optional(),
        correctIndex: z.number().min(0).optional(),
        explanationEn: z.string().optional(),
        explanationAm: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input
      return ctx.prisma.quiz.update({
        where: { id },
        data,
      })
    }),

  // Admin: Delete quiz
  deleteQuiz: adminProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.quiz.delete({ where: { id: input.id } })
      return { success: true }
    }),

  // User: Submit quiz answers
  submitQuiz: protectedProcedure
    .input(
      z.object({
        moduleId: z.string().uuid(),
        answers: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { moduleId, answers } = input
      const userId = ctx.userId

      // Get the module with quizzes
      const module = await ctx.prisma.learningModule.findUnique({
        where: { id: moduleId },
        include: {
          quizzes: {
            orderBy: { sortOrder: 'asc' },
          },
        },
      })

      if (!module) {
        throw new Error('Module not found')
      }

      // Calculate score
      let correctCount = 0
      const results = module.quizzes.map((quiz, index) => {
        const userAnswer = answers[index]
        const isCorrect = userAnswer === quiz.correctIndex
        if (isCorrect) correctCount++
        return {
          questionId: quiz.id,
          userAnswer,
          correctAnswer: quiz.correctIndex,
          isCorrect,
          explanationEn: quiz.explanationEn,
          explanationAm: quiz.explanationAm,
        }
      })

      const score = Math.round((correctCount / module.quizzes.length) * 100)
      const passed = score >= 70 // 70% to pass

      // Update or create user module progress
      const existingProgress = await ctx.prisma.userModuleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId,
          },
        },
      })

      if (existingProgress) {
        await ctx.prisma.userModuleProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId,
            },
          },
          data: {
            quizScore: score,
            quizAttempts: existingProgress.quizAttempts + 1,
            status: passed ? 'completed' : 'in_progress',
            completedAt: passed ? new Date() : null,
          },
        })
      } else {
        await ctx.prisma.userModuleProgress.create({
          data: {
            userId,
            moduleId,
            quizScore: score,
            quizAttempts: 1,
            status: passed ? 'completed' : 'in_progress',
            completedAt: passed ? new Date() : null,
          },
        })
      }

      return {
        score,
        passed,
        correctCount,
        totalQuestions: module.quizzes.length,
        results,
      }
    }),

  // User: Get user progress for a learning path
  getUserProgress: protectedProcedure
    .input(z.object({ pathId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const { pathId } = input
      const userId = ctx.userId

      const path = await ctx.prisma.learningPath.findUnique({
        where: { id: pathId },
        include: {
          modules: {
            orderBy: { sortOrder: 'asc' },
            include: {
              userProgress: {
                where: { userId },
              },
            },
          },
        },
      })

      if (!path) {
        throw new Error('Learning path not found')
      }

      const completedModules = path.modules.filter(
        (m) => m.userProgress.length > 0 && m.userProgress[0].status === 'completed'
      )

      const currentModule = path.modules.find(
        (m) => m.userProgress.length === 0 || m.userProgress[0].status !== 'completed'
      )

      const pathComplete = completedModules.length === path.modules.length

      return {
        pathId,
        totalModules: path.modules.length,
        completedModules: completedModules.length,
        currentModuleId: currentModule?.id || null,
        pathComplete,
        progressPercent: Math.round((completedModules.length / path.modules.length) * 100),
      }
    }),

  // User: Mark module as complete (without quiz)
  completeModule: protectedProcedure
    .input(z.object({ moduleId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { moduleId } = input
      const userId = ctx.userId

      const existingProgress = await ctx.prisma.userModuleProgress.findUnique({
        where: {
          userId_moduleId: {
            userId,
            moduleId,
          },
        },
      })

      if (existingProgress) {
        await ctx.prisma.userModuleProgress.update({
          where: {
            userId_moduleId: {
              userId,
              moduleId,
            },
          },
          data: {
            status: 'completed',
            completedAt: new Date(),
          },
        })
      } else {
        await ctx.prisma.userModuleProgress.create({
          data: {
            userId,
            moduleId,
            status: 'completed',
            completedAt: new Date(),
          },
        })
      }

      return { success: true }
    }),
})
