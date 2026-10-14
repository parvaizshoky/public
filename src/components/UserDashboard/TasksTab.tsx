import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DailyTask } from '../../types';
import { generateCaptchaCode } from '../../utils/taskGenerator';
import {
  CheckCircle2,
  ListTodo,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Clock,
  Layers,
  Coins,
  AlertCircle,
  X,
  HelpCircle,
  Award,
} from 'lucide-react';

export const TasksTab: React.FC = () => {
  const {
    currentUser,
    investments,
    dailyTasks,
    completeDailyTask,
    simulateYieldCycle,
    setActiveTab,
  } = useApp();

  const [activeTask, setActiveTask] = useState<DailyTask | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [captchaInput, setCaptchaInput] = useState<string>('');
  const [currentCaptcha, setCurrentCaptcha] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!currentUser) return null;

  const activeInvestments = investments.filter(
    (inv) => inv.userId === currentUser.id && inv.status === 'active'
  );

  const userTasks = dailyTasks.filter((t) => t.userId === currentUser.id);
  const completedTasks = userTasks.filter((t) => t.completed);
  const pendingTasks = userTasks.filter((t) => !t.completed);

  const totalEarnedToday = completedTasks.reduce((sum, t) => sum + t.rewardAmount, 0);
  const potentialTotalToday = userTasks.reduce((sum, t) => sum + t.rewardAmount, 0);
  const progressPercent = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

  // Generate / refresh captcha
  const refreshCaptcha = () => {
    const code = generateCaptchaCode();
    setCurrentCaptcha(code);
    setCaptchaInput('');
    setErrorMessage(null);
  };

  // Draw stylized security captcha on canvas
  useEffect(() => {
    if (!currentCaptcha || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background gradient with light security tint
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#f1f5f9');
    grad.addColorStop(1, '#e2e8f0');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Security interference lines
    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = `rgba(16, 185, 129, ${0.15 + Math.random() * 0.25})`;
      ctx.lineWidth = 1 + Math.random() * 2;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    // Security interference dots
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = `rgba(15, 23, 42, ${0.1 + Math.random() * 0.2})`;
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1 + Math.random() * 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Render characters with slight rotation
    const chars = currentCaptcha.split('');
    const charSpacing = canvas.width / (chars.length + 1);

    chars.forEach((char, index) => {
      ctx.save();
      const x = charSpacing * (index + 0.8);
      const y = canvas.height / 2 + 7;
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.fillStyle = index % 2 === 0 ? '#0f766e' : '#047857';
      ctx.fillText(char, -8, 0);
      ctx.restore();
    });
  }, [currentCaptcha, activeTask]);

  const handleOpenTask = (task: DailyTask) => {
    setActiveTask(task);
    setSelectedAnswer(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    refreshCaptcha();
  };

  const handleVerifyAndSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setErrorMessage(null);
    setSuccessMessage(null);

    if (selectedAnswer === null) {
      setErrorMessage('Please select an answer to the math question.');
      return;
    }

    if (!captchaInput || captchaInput.trim().length === 0) {
      setErrorMessage('Please enter the security verification captcha.');
      return;
    }

    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      const res = completeDailyTask(
        activeTask.id,
        selectedAnswer,
        captchaInput.trim(),
        currentCaptcha
      );

      if (!res.success) {
        setErrorMessage(res.message || 'Verification failed. Please try again.');
        refreshCaptcha();
        return;
      }

      setSuccessMessage(
        `Task Verified Successfully! +$${res.earned?.toFixed(2) || activeTask.rewardAmount.toFixed(2)} USDT credited to your wallet!`
      );

      setTimeout(() => {
        setActiveTask(null);
        setSuccessMessage(null);
      }, 1600);
    }, 400);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Headline */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <ListTodo className="w-4 h-4" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Daily Earning Tasks
            </h2>
            <span className="text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Work & Earn
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete daily math challenges and captcha security verifications to unlock your daily yield profits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={simulateYieldCycle}
            disabled={activeInvestments.length === 0}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeInvestments.length > 0
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs'
                : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
            }`}
            title="Simulate 24H cycle to advance day and generate fresh daily tasks"
          >
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Next 24H Cycle</span>
          </button>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed Tasks */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasks Completed Today</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {completedTasks.length} <span className="text-sm text-slate-400 font-sans">/ {userTasks.length}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Earned Today */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tasks Revenue Earned</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-700 font-mono">
              +${totalEarnedToday.toFixed(2)} <span className="text-xs font-sans text-slate-400">USDT</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Credited directly to wallet
            </span>
          </div>
        </div>

        {/* Card 3: Pending Tasks */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Tasks</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-amber-800 font-mono">
              {pendingTasks.length}
            </div>
            <span className="text-[11px] text-amber-800 font-medium block mt-1">
              Ready to verify & claim
            </span>
          </div>
        </div>

        {/* Card 4: Active Contracts */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Task Generators</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900 font-mono">
              {activeInvestments.length} <span className="text-xs font-sans text-slate-400">Plans</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Max today: ${potentialTotalToday.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* If User Has No Active Investment */}
      {activeInvestments.length === 0 ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-dashed border-slate-300 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900">
            Activate a Plan to Unlock Daily Tasks
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-md mx-auto">
            Daily earning tasks are unlocked when you activate any investment plan. The higher the plan, the more daily math verification tasks you receive to earn USDT every day from your home!
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveTab('plans')}
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              <span>Explore Investment Plans</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('deposit')}
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
            >
              Deposit USDT (TRC-20)
            </button>
          </div>
        </div>
      ) : (
        /* Tasks List Container */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <span>Today&apos;s Math & Captcha Verification Tasks</span>
                <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                  {pendingTasks.length} Available
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Solve the arithmetic challenge, input the security captcha, and your wallet balance will be credited instantly.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 flex items-center gap-1.5 self-start sm:self-auto">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Anti-Bot Verification Active</span>
            </div>
          </div>

          {/* Tasks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {userTasks.map((task, index) => {
              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                    task.completed
                      ? 'bg-emerald-50/40 border-emerald-200 shadow-2xs'
                      : 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Task #{index + 1}
                      </span>
                      <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        +${task.rewardAmount.toFixed(2)} USDT
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm">{task.planName}</h4>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-center font-mono font-bold text-base text-slate-800">
                      {task.question}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {task.completed ? (
                      <div className="flex items-center justify-center gap-1.5 text-xs font-extrabold text-emerald-800 bg-emerald-100/70 py-2 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Completed & Paid (+${task.rewardAmount.toFixed(2)})</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenTask(task)}
                        className="w-full py-2.5 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 group"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                        <span>Solve & Verify Captcha</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Task Solving & Captcha Verification Modal */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setActiveTask(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs">
                <ListTodo className="w-4 h-4" />
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Daily Verification Task
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Reward for completion: <span className="font-bold text-emerald-700 font-mono">+${activeTask.rewardAmount.toFixed(2)} USDT</span>
            </p>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAndSubmit} className="space-y-4">
              {/* Step 1: Math Challenge */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Step 1: Solve Simple Math Challenge</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Select answer</span>
                </div>

                <div className="py-3 px-4 bg-white rounded-xl border border-slate-200 text-center font-mono font-black text-2xl text-slate-900 mb-3 shadow-2xs">
                  {activeTask.question}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {activeTask.options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedAnswer(opt)}
                      className={`py-2 px-3 rounded-xl text-sm font-mono font-bold transition-all border ${
                        selectedAnswer === opt
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Human Verification Captcha */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>Step 2: Human Security Captcha</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Anti-bot check</span>
                </div>

                {/* Captcha Canvas & Refresh */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-center overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={180}
                      height={46}
                      className="rounded select-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={refreshCaptcha}
                    className="p-2.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-colors shadow-2xs"
                    title="Refresh Captcha Code"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </div>

                {/* Captcha Input */}
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="Type the 5 characters above"
                    value={captchaInput}
                    onChange={(e) => setCaptchaInput(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 text-xs font-mono font-bold uppercase tracking-widest bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder:normal-case placeholder:font-normal placeholder:tracking-normal"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Characters are case-insensitive.
                  </p>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTask(null)}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isVerifying || selectedAnswer === null || captchaInput.trim().length === 0}
                  className={`flex-1 py-2.5 px-4 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 ${
                    selectedAnswer !== null && captchaInput.trim().length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify & Claim USDT</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
