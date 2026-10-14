import { DailyTask } from '../types';

/**
 * Calculates number of tasks based on the plan investment amount.
 * As requested: "ye tasks jitna bara plan hoo os hisaab se tasks mille"
 * - $30 plan -> 2 tasks
 * - $50 plan -> 3 tasks
 * - $100 plan -> 5 tasks
 * - $300 plan -> 8 tasks
 * - $500 plan -> 10 tasks
 * - $1000+ whale plans -> 15 tasks
 */
export function getTaskCountForAmount(amount: number): number {
  if (amount <= 35) return 2;
  if (amount <= 65) return 3;
  if (amount <= 150) return 5;
  if (amount <= 350) return 8;
  if (amount <= 600) return 10;
  return 15;
}

/**
 * Generates simple, fun math verification challenges
 * As requested: "jaise math ke . simple se"
 */
export function generateMathQuestion(): {
  question: string;
  options: number[];
  correctAnswer: number;
} {
  const operations = ['add', 'sub', 'mul'] as const;
  const op = operations[Math.floor(Math.random() * operations.length)];
  let q = '';
  let ans = 0;

  if (op === 'add') {
    const a = Math.floor(Math.random() * 40) + 12;
    const b = Math.floor(Math.random() * 40) + 8;
    q = `${a} + ${b} = ?`;
    ans = a + b;
  } else if (op === 'sub') {
    const a = Math.floor(Math.random() * 50) + 35;
    const b = Math.floor(Math.random() * 30) + 5;
    q = `${a} - ${b} = ?`;
    ans = a - b;
  } else {
    // Multiplication with simple single/double digits
    const a = Math.floor(Math.random() * 9) + 4;
    const b = Math.floor(Math.random() * 8) + 3;
    q = `${a} × ${b} = ?`;
    ans = a * b;
  }

  // Create 4 distinct options including the correct answer
  const optionsSet = new Set<number>();
  optionsSet.add(ans);
  const deltas = [-4, -3, -2, -1, 1, 2, 3, 4, 5, -5, 10, -10];
  while (optionsSet.size < 4) {
    const d = deltas[Math.floor(Math.random() * deltas.length)];
    const val = ans + d;
    if (val > 0 && val !== ans) {
      optionsSet.add(val);
    }
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  return { question: q, options, correctAnswer: ans };
}

/**
 * Generates dynamic human verification captcha code
 * As requested: "and task complete kre to verification captcha bhii maange"
 */
export function generateCaptchaCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Avoid confusing 0/O, 1/I
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Generates daily tasks set for an active investment
 */
export function generateTasksForInvestment(
  userId: string,
  investmentId: string,
  planName: string,
  amount: number,
  dailyProfit: number,
  dayIndex = 1
): DailyTask[] {
  const count = getTaskCountForAmount(amount);
  const rewardPerTask = Number((dailyProfit / count).toFixed(4));

  const tasks: DailyTask[] = [];
  for (let i = 0; i < count; i++) {
    const math = generateMathQuestion();
    tasks.push({
      id: `task_${investmentId}_d${dayIndex}_${i}_${Math.random().toString(36).slice(2, 6)}`,
      userId,
      investmentId,
      planName,
      question: math.question,
      options: math.options,
      correctAnswer: math.correctAnswer,
      rewardAmount: rewardPerTask,
      completed: false,
      dayIndex,
    });
  }

  return tasks;
}
