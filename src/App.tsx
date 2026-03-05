import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { 
  Trophy, 
  Users, 
  Zap, 
  ShieldCheck, 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Timer, 
  CheckCircle2, 
  XCircle,
  Award,
  Calendar,
  MapPin,
  Info,
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cn } from './lib/utils';

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch('/api/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
    body: formData
  });
  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();
  return data.url;
};

// --- Types ---
interface Team {
  id: string;
  name: string;
  member1: string;
  member2: string;
  member3: string;
  round1_score: number;
  round2_score: number;
  round3_score: number;
  round1_mystery_boxes_opened: number[];
  current_question_index: number;
  is_finished_r1: number;
  is_finished_r2: number;
}

interface Question {
  id: string;
  question_text: string;
  image_url: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  correct_option: number;
}

interface R1Question {
  id: string;
  box_number: number;
  difficulty: string;
  question_text: string;
}

interface R3Set {
  id: string;
  name: string;
}

interface MysteryBoxQuestion {
  id: string;
  box_number: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question_text: string;
  correct_answer?: string;
}

interface QuestionSet {
  id: string;
  name: string;
  is_used?: boolean;
}

// --- Components ---

const Button = ({ children, className, variant = 'primary', ...props }: any) => {
  const variants = {
    primary: 'bg-neon-yellow hover:bg-neon-yellow/80 text-black shadow-[0_0_15px_rgba(255,255,0,0.4)]',
    secondary: 'bg-neon-orange hover:bg-neon-orange/80 text-white shadow-[0_0_15px_rgba(255,69,0,0.4)]',
    outline: 'border border-white/20 hover:bg-white/10 text-white',
    ghost: 'hover:bg-white/5 text-white/70 hover:text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white'
  };

  return (
    <button 
      className={cn(
        'px-6 py-2.5 rounded-lg font-display font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
        variants[variant as keyof typeof variants],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: any) => (
  <div className={cn('glass-card', className)}>
    {children}
  </div>
);

// --- Pages ---

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1 rounded-full border border-neon-yellow/30 bg-neon-yellow/10 text-neon-yellow text-sm font-display tracking-widest uppercase">
          <Award size={16} />
          TECHTRECK 2026 – Technical Quiz Battle
        </div>
        <h1 className="text-4xl md:text-8xl font-display font-black mb-6 tracking-tighter bg-gradient-to-r from-neon-yellow via-neon-orange to-neon-red bg-clip-text text-transparent">
          TECHTRECK
        </h1>
        <p className="text-lg md:text-2xl text-white/70 mb-12 font-light max-w-2xl mx-auto leading-relaxed px-4">
          The ultimate technical quiz battleground organized by the <span className="text-neon-yellow font-bold">CSE Department</span> of St Anns College of Engineering & Technology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="glass-card p-4 flex flex-col items-center gap-2 border-neon-yellow/20">
            <ShieldCheck className="text-neon-yellow" />
            <span className="text-sm text-white/50 uppercase tracking-widest">Round 1</span>
            <span className="font-display font-bold">Mystery Box</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center gap-2 border-neon-cyan/20">
            <Zap className="text-neon-cyan" />
            <span className="text-sm text-white/50 uppercase tracking-widest">Round 2</span>
            <span className="font-display font-bold">Visual Challenge</span>
          </div>
          <div className="glass-card p-4 flex flex-col items-center gap-2 border-neon-orange/20">
            <Award className="text-neon-orange" />
            <span className="text-sm text-white/50 uppercase tracking-widest">Round 3</span>
            <span className="font-display font-bold">Rapid Fire</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-left">
          <Card className="border-neon-yellow/20">
            <h3 className="text-2xl font-display font-bold mb-4 text-neon-yellow flex items-center gap-2">
              <Calendar size={24} /> Event Details
            </h3>
            <div className="space-y-4 text-white/70">
              <div className="flex items-center gap-3">
                <MapPin className="text-neon-yellow" size={18} />
                <span>Seminar Hall, Room No: 131, SACET</span>
              </div>
              <div className="flex items-center gap-3">
                <Users className="text-neon-yellow" size={18} />
                <span>Open to CSE Engineering Students</span>
              </div>
              <div className="flex items-center gap-3">
                <Timer className="text-neon-yellow" size={18} />
                <span>Scores accumulate across all rounds</span>
              </div>
            </div>
          </Card>
          <Card className="border-neon-orange/20">
            <h3 className="text-2xl font-display font-bold mb-4 text-neon-orange flex items-center gap-2">
              <Info size={24} /> General Rules
            </h3>
            <ul className="text-white/70 space-y-2 list-disc list-inside">
              <li>All rounds are team-based.</li>
              <li>No elimination - all teams play all three rounds.</li>
              <li>Scores from each round are added to the previous total.</li>
              <li>Malpractice leads to immediate disqualification.</li>
              <li>Judge's decision is final and binding.</li>
            </ul>
          </Card>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/round1"><Button variant="primary">Start Round 1</Button></Link>
          <Link to="/round2"><Button variant="secondary">Start Round 2</Button></Link>
          <Link to="/round3"><Button variant="outline">Start Round 3</Button></Link>
        </div>

        <footer className="mt-24 pt-8 border-t border-white/10 text-white/30 text-xs">
          <p>© 2026 St Anns College of Engineering & Technology</p>
          <p className="mt-2">Department of CSE - TechTreck 2026</p>
          <Link to="/admin" className="mt-4 inline-block hover:text-neon-yellow transition-colors">Organizer Portal</Link>
        </footer>
      </motion.div>
    </div>
  );
};

const Round1 = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<MysteryBoxQuestion[]>([]);
  const [currentTeamIdx, setCurrentTeamIdx] = useState(0);
  const [selectedBox, setSelectedBox] = useState<number | null>(null);
  const [activeQuestion, setActiveQuestion] = useState<MysteryBoxQuestion | null>(null);
  const [showDifficulty, setShowDifficulty] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);

  const fetchTeams = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data);
    return data;
  };

  const fetchQuestions = async () => {
    const res = await fetch('/api/round1/mystery-box/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchTeams();
    fetchQuestions();
  }, []);

  useEffect(() => {
    let timer: any;
    if (showQuestion && timeLeft > 0 && !isAnswering) {
      timer = setInterval(() => {
        //playSound('/tiktok1.mp3');
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && showQuestion && !isAnswering) {
      handleAnswer(false);
    }
    return () => clearInterval(timer);
  }, [showQuestion, timeLeft, isAnswering]);

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => {
      if (url.startsWith('/')) {
        const relativeAudio = new Audio(url.substring(1));
        relativeAudio.play().catch(() => {});
      }
    });
  };

  const handleBoxClick = (boxNum: number) => {
    if (selectedBox !== null || isRoundStarted === false) return;
    const q = questions.find(q => q.box_number === boxNum);
    if (!q) return;

    setSelectedBox(boxNum);
    setActiveQuestion(q);
    setShowDifficulty(true);
    playSound('/q.mp3');

    setTimeout(() => {
      setShowDifficulty(false);
      setShowQuestion(true);
      setTimeLeft(15);
    }, 3000);
  };

  const handleAnswer = async (isCorrect: boolean) => {
    if (isAnswering || !activeQuestion) return;
    setIsAnswering(true);

    const team = teams[currentTeamIdx];
    const score = activeQuestion.difficulty === 'Easy' ? 10 : activeQuestion.difficulty === 'Medium' ? 15 : 20;

    try {
      await fetch('/api/quiz/round1/mystery-box/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: team.id,
          boxNumber: activeQuestion.box_number,
          isCorrect,
          score
        })
      });

      if (isCorrect) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#FFFF00', '#FFFFFF'] });
        playSound('/alright.mp3');
      } else {
        playSound('/fahhh.mp3');
      }

      setShowCorrectAnswer(true);

      setTimeout(() => {
        setIsAnswering(false);
        setShowCorrectAnswer(false);
        setShowQuestion(false);
        setSelectedBox(null);
        setActiveQuestion(null);
        
        // Check if round is finished (each team answered 5 questions)
        fetchTeams().then((updatedTeams) => {
          const teamsToUse = updatedTeams || teams;
          const totalOpened = teamsToUse.reduce((acc: number, t: Team) => acc + (t.round1_mystery_boxes_opened?.length || 0), 0);
          
          if (totalOpened >= teams.length * 5) {
            setShowLeaderboard(true);
          } else {
            const nextTeamIdx = (currentTeamIdx + 1) % teams.length;
            setCurrentTeamIdx(nextTeamIdx);
          }
        });
      }, 4000);
    } catch (err) {
      console.error(err);
      setIsAnswering(false);
    }
  };

  const activeTeam = teams[currentTeamIdx];
  const allOpenedBoxes = teams.reduce((acc: number[], t) => {
    const opened = t.round1_mystery_boxes_opened || [];
    return [...acc, ...opened];
  }, []);

  if (showLeaderboard) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-black relative overflow-hidden">
        <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 z-30">
          <ChevronRight className="rotate-180" size={16} /> Home
        </Link>
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-neon-yellow neon-text">Congratulations!</h2>
        <h3 className="text-xl md:text-2xl font-display text-white/50 mb-8 md:mb-12 uppercase tracking-widest">Round 1 Completed</h3>
        <div className="w-full max-w-3xl space-y-4 px-4">
          {teams.sort((a, b) => b.round1_score - a.round1_score).map((team, idx) => (
            <div key={team.id} className="flex justify-between items-center p-4 md:p-6 glass border border-white/10 rounded-2xl">
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-2xl md:text-3xl font-display text-white/20">#{idx + 1}</span>
                <h3 className="font-bold text-xl md:text-2xl text-white">{team.name}</h3>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-neon-yellow">{team.round1_score}</div>
            </div>
          ))}
        </div>
        <div className="mt-16 flex gap-6">
          <Link to="/"><Button variant="outline">Home</Button></Link>
          <Link to="/round2"><Button variant="secondary">Proceed to Round 2</Button></Link>
        </div>
      </div>
    );
  }

  if (!isRoundStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-8 relative">
        <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2">
          <ChevronRight className="rotate-180" size={16} /> Home
        </Link>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center glass p-8 md:p-16 border-neon-yellow/30 rounded-3xl max-w-2xl w-full">
          <ShieldCheck size={64} className="text-neon-yellow mx-auto mb-6 md:mb-8 animate-bounce" />
          <h1 className="text-4xl md:text-6xl font-display font-black mb-4 md:mb-6 text-neon-yellow neon-text">Round 1</h1>
          <h2 className="text-xl md:text-2xl text-white/70 mb-8 md:mb-12 uppercase tracking-widest">Mystery Box</h2>
          <div className="text-left space-y-3 md:space-y-4 mb-8 md:mb-12 bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
            <h3 className="text-neon-yellow font-display text-lg md:text-xl border-b border-neon-yellow/20 pb-2">Rules</h3>
            <ul className="text-white/60 space-y-2 md:space-y-3 text-sm md:text-base list-disc list-inside">
              <li>Pick a box number to reveal a question.</li>
              <li>Difficulty levels: Easy (+10), Medium (+15), Hard (+20).</li>
              <li>No negative marking.</li>
              <li>Timer: 15 seconds.</li>
            </ul>
          </div>
          <Button onClick={() => setIsRoundStarted(true)} className="text-xl md:text-3xl px-10 py-5 md:px-20 md:py-10">START ROUND 1</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black relative">
      <Link to="/" className="absolute top-4 left-4 text-white/30 hover:text-white flex items-center gap-2 z-50">
        <ChevronRight className="rotate-180" size={16} /> Home
      </Link>
      <div className="w-full md:w-80 glass border-r border-white/10 p-6 overflow-y-auto pt-16">
        <h2 className="text-xl font-display font-bold text-neon-yellow flex items-center gap-2 mb-8"><Users size={20} /> Teams & Score</h2>
        <div className="space-y-3">
          {teams.map((team) => (
            <div key={team.id} className={cn("p-4 rounded-xl border transition-all", activeTeam?.id === team.id ? "bg-neon-yellow/20 border-neon-yellow shadow-[0_0_10px_rgba(255,255,0,0.1)]" : "border-white/5 bg-white/5 opacity-60")}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white truncate">{team.name}</span>
                <span className="font-display text-neon-yellow text-xl">{team.round1_score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-4xl text-center mb-8 md:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
            <div className="text-center md:text-left">
              <div className="text-neon-yellow font-display text-xs md:text-sm uppercase tracking-[0.3em] mb-2">Current Team</div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white">{activeTeam?.name}</h2>
            </div>
            <div className="text-center md:text-right">
              <div className="text-white/30 font-display text-xs md:text-sm uppercase tracking-widest mb-2">Round Progress</div>
              <div className="text-xl md:text-3xl font-display text-white">
                Turn {allOpenedBoxes.length + 1} <span className="text-white/20">/ {teams.length * 5}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-4 max-w-6xl w-full">
          {questions.sort((a, b) => a.box_number - b.box_number).map((q) => {
            const boxNum = q.box_number;
            const isOpened = allOpenedBoxes.includes(boxNum);
            const isSelected = selectedBox === boxNum;
            return (
              <motion.button
                key={q.id}
                whileHover={!isOpened ? { scale: 1.05, rotate: 2 } : {}}
                whileTap={!isOpened ? { scale: 0.95 } : {}}
                onClick={() => handleBoxClick(boxNum)}
                disabled={isOpened || selectedBox !== null}
                className={cn(
                  "aspect-square rounded-2xl border-4 flex items-center justify-center text-4xl font-display font-black transition-all",
                  isOpened ? "bg-white/5 border-white/10 text-white/10" : "bg-neon-yellow/10 border-neon-yellow text-neon-yellow shadow-[0_0_15px_rgba(255,255,0,0.2)]",
                  isSelected && "bg-neon-yellow text-black scale-125 z-20 shadow-[0_0_50px_rgba(255,255,0,0.5)]"
                )}
              >
                {boxNum}
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {showDifficulty && activeQuestion && (
            <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.5 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
              <div className="text-center">
                <h3 className="text-4xl font-display text-white/50 uppercase tracking-[0.5em] mb-4">Difficulty Level</h3>
                <h2 className={cn("text-8xl font-display font-black uppercase neon-text", activeQuestion.difficulty === 'Easy' ? "text-green-400" : activeQuestion.difficulty === 'Medium' ? "text-yellow-400" : "text-red-500")}>{activeQuestion.difficulty} Question</h2>
              </div>
            </motion.div>
          )}

          {showQuestion && activeQuestion && (
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-xl p-4 md:p-12">
              <div className="max-w-5xl w-full text-center space-y-6 md:space-y-12">
                <div className="flex justify-between items-center">
                  <div className="text-left">
                    <div className="text-neon-yellow font-display text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2">Team Answering</div>
                    <h3 className="text-2xl md:text-4xl font-display font-bold text-white">{activeTeam?.name}</h3>
                  </div>
                  <div className={cn("w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 flex items-center justify-center text-2xl md:text-4xl font-display", timeLeft < 10 ? "border-red-500 text-red-500 animate-pulse" : "border-neon-yellow text-neon-yellow")}>{timeLeft}</div>
                </div>
                
                <h2 className="text-3xl md:text-6xl font-mono font-medium leading-tight text-white whitespace-pre-wrap">{activeQuestion.question_text}</h2>
                
                {showCorrectAnswer && activeQuestion.correct_answer && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="p-6 bg-white/10 rounded-2xl border border-neon-yellow/30">
                    <div className="text-neon-yellow text-xs uppercase tracking-widest mb-2">Correct Answer</div>
                    <div className="text-2xl md:text-4xl font-bold text-white whitespace-pre-wrap">{activeQuestion.correct_answer}</div>
                  </motion.div>
                )}

                <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center pt-6 md:pt-12">
                  <Button onClick={() => handleAnswer(true)} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 md:px-12 md:py-6 text-xl md:text-2xl">CORRECT (+{activeQuestion.difficulty === 'Easy' ? 10 : activeQuestion.difficulty === 'Medium' ? 15 : 20})</Button>
                  <Button onClick={() => handleAnswer(false)} className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 md:px-12 md:py-6 text-xl md:text-2xl">WRONG (0)</Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Round2 = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentTurn, setCurrentTurn] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isRoundStarted, setIsRoundStarted] = useState(false);
  const [isTurnStarted, setIsTurnStarted] = useState(false);
  const [bombEffect, setBombEffect] = useState<'none' | 'correct' | 'wrong'>('none');
  const [celebration, setCelebration] = useState(false);

  const fetchTeams = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    setTeams(data);
  };

  const fetchQuestions = async () => {
    const res = await fetch('/api/round2/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchTeams();
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (isRoundStarted && isTurnStarted && timeLeft > 0 && !isAnswering && !showLeaderboard) {
      const timer = setTimeout(() => {
        //playSound('/tiktok1.mp3');
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isRoundStarted && isTurnStarted && timeLeft === 0 && !isAnswering && !showLeaderboard) {
      handleAnswer(-1); // Timeout
    }
  }, [timeLeft, isAnswering, isRoundStarted, isTurnStarted, showLeaderboard]);

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => {
      if (url.startsWith('/')) {
        const relativeAudio = new Audio(url.substring(1));
        relativeAudio.play().catch(() => {});
      }
    });
  };

  const handleAnswer = async (optionIndex: number) => {
    if (isAnswering || showLeaderboard || !isRoundStarted) return;
    
    const activeTeam = teams[currentTurn % teams.length];
    const currentQuestion = questions[currentTurn];
    
    if (!activeTeam || !currentQuestion) {
      setShowLeaderboard(true);
      return;
    }

    setIsAnswering(true);
    const isCorrect = optionIndex === currentQuestion.correct_option;

    try {
      const res = await fetch('/api/quiz/round2/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: activeTeam.id,
          isCorrect
        })
      });
      
      if (!res.ok) throw new Error('Failed to submit answer');
      
      if (isCorrect) {
        setBombEffect('correct');
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ['#00FF00', '#FFFFFF'] });
        playSound('/alright.mp3');
      } else {
        setBombEffect('wrong');
        confetti({ particleCount: 100, spread: 50, origin: { y: 0.6 }, colors: ['#FF0000', '#8B0000'] });
        playSound('/fahhh.mp3');
      }

      setTimeout(() => {
        setBombEffect('none');
        setIsAnswering(false);
        const nextTurn = currentTurn + 1;
        if (nextTurn >= teams.length * 5 || nextTurn >= questions.length) {
          setShowLeaderboard(true);
          setCelebration(true);
          playSound('/claps.mp3');
          fetchTeams();
        } else {
          setCurrentTurn(nextTurn);
          setTimeLeft(15);
          setIsTurnStarted(false);
          fetchTeams();
        }
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setIsAnswering(false);
    }
  };

  const activeTeam = teams[currentTurn % teams.length];
  const currentQuestion = questions[currentTurn];

  if (showLeaderboard) {
    return (
      <div className="min-h-screen p-8 flex flex-col items-center justify-center bg-black relative overflow-hidden">
        <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 z-30">
          <ChevronRight className="rotate-180" size={16} /> Home
        </Link>
        {celebration && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-10 text-center z-20 px-4">
            <h1 className="text-3xl md:text-6xl font-display font-black text-neon-cyan neon-text mb-2">ROUND 2 COMPLETE!</h1>
            <p className="text-xs md:text-sm text-white/60 uppercase tracking-[0.3em] md:tracking-[0.5em]">Scores are saved. Proceed to Round 3.</p>
          </motion.div>
        )}
        
        <h2 className="text-3xl md:text-5xl font-display font-bold mb-8 md:mb-12 text-neon-cyan neon-text mt-24">Round 2 Results</h2>
        <div className="w-full max-w-3xl space-y-4 relative z-10 px-4">
          {teams.sort((a, b) => (b.round1_score + b.round2_score) - (a.round1_score + a.round2_score)).map((team, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={team.id} 
              className="flex justify-between items-center p-4 md:p-6 glass border border-white/10 rounded-2xl"
            >
              <div className="flex items-center gap-4 md:gap-6">
                <span className="text-2xl md:text-3xl font-display text-white/20">#{idx + 1}</span>
                <div>
                  <h3 className="font-bold text-xl md:text-2xl text-white">{team.name}</h3>
                  <p className="text-[10px] md:text-sm text-white/40">{team.member1}, {team.member2}, {team.member3}</p>
                </div>
              </div>
              <div className="text-2xl md:text-4xl font-display font-bold text-neon-cyan">{team.round1_score + team.round2_score}</div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 flex gap-6">
          <Link to="/"><Button variant="outline" className="px-8 py-4">Home</Button></Link>
          <Link to="/round3"><Button variant="primary" className="px-8 py-4">Proceed to Round 3</Button></Link>
        </div>
      </div>
    );
  }

  if (!isRoundStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-8 relative">
        <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2">
          <ChevronRight className="rotate-180" size={16} /> Home
        </Link>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center glass p-8 md:p-16 border-neon-cyan/30 rounded-3xl max-w-2xl w-full">
          <Zap size={64} className="text-neon-cyan mx-auto mb-6 md:mb-8 animate-pulse" />
          <h1 className="text-4xl md:text-6xl font-display font-black mb-4 md:mb-6 text-neon-cyan neon-text">Round 2</h1>
          <h2 className="text-xl md:text-2xl text-white/70 mb-8 md:mb-12 uppercase tracking-widest">Visual Challenge</h2>
          <div className="text-left space-y-3 md:space-y-4 mb-8 md:mb-12 bg-white/5 p-6 md:p-8 rounded-2xl border border-white/10">
            <h3 className="text-neon-cyan font-display text-lg md:text-xl border-b border-neon-cyan/20 pb-2">Rules</h3>
            <ul className="text-white/60 space-y-2 md:space-y-3 text-sm md:text-base list-disc list-inside">
              <li>Turn-based visual quiz.</li>
              <li>Each team answers <span className="text-white font-bold">5 questions</span>.</li>
              <li>Timer: <span className="text-white font-bold">15 seconds</span> per question.</li>
              <li>Scoring: <span className="text-green-400 font-bold">+10</span> for correct, <span className="text-white font-bold">0</span> for wrong.</li>
            </ul>
          </div>
          <Button onClick={() => setIsRoundStarted(true)} className="text-xl md:text-3xl px-10 py-5 md:px-20 md:py-10 rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.3)] hover:shadow-[0_0_60px_rgba(0,243,255,0.5)]">START ROUND 2</Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black relative">
      <Link to="/" className="absolute top-4 left-4 text-white/30 hover:text-white flex items-center gap-2 z-50">
        <ChevronRight className="rotate-180" size={16} /> Home
      </Link>
      <div className="w-full md:w-80 glass border-r border-white/10 p-6 overflow-y-auto pt-16">
        <h2 className="text-xl font-display font-bold text-neon-cyan flex items-center gap-2 mb-8"><Users size={20} /> Teams & Total</h2>
        <div className="space-y-3">
          {teams.map((team) => (
            <div key={team.id} className={cn("p-4 rounded-xl border transition-all", activeTeam?.id === team.id ? "bg-neon-cyan/20 border-neon-cyan shadow-[0_0_10px_rgba(0,243,255,0.1)]" : "border-white/5 bg-white/5 opacity-60")}>
              <div className="flex justify-between items-center">
                <span className="font-bold text-white truncate">{team.name}</span>
                <span className="font-display text-neon-cyan text-xl">{team.round1_score + team.round2_score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 p-8 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence>
          {bombEffect !== 'none' && (
            <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 5, opacity: 0.8 }} exit={{ opacity: 0 }} className={cn("absolute inset-0 rounded-full blur-[120px] z-0", bombEffect === 'correct' ? "bg-green-500" : "bg-red-600")} />
          )}
        </AnimatePresence>
        <div className="w-full max-w-4xl relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 md:mb-12 gap-6">
            <div className="text-center md:text-left">
              <div className="text-neon-cyan font-display text-xs md:text-sm uppercase tracking-[0.3em] mb-2">Team Turn</div>
              <h2 className="text-3xl md:text-5xl font-display font-black text-white">{activeTeam?.name}</h2>
            </div>
            <div className="flex flex-col items-center order-first md:order-none">
              <div className={cn("w-16 h-16 md:w-24 md:h-24 rounded-full border-2 md:border-4 flex items-center justify-center font-display text-2xl md:text-4xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)]", timeLeft < 5 ? "border-red-500 text-red-500 animate-bounce bg-red-500/10" : "border-neon-cyan text-neon-cyan bg-neon-cyan/10")}>{timeLeft}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest mt-2 font-bold">Seconds Left</div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-white/30 font-display text-xs md:text-sm uppercase tracking-widest mb-2">Round Progress</div>
              <div className="text-xl md:text-3xl font-display text-white">Turn {currentTurn + 1} <span className="text-white/20">/ {teams.length * 5}</span></div>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {!isTurnStarted ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-20 glass p-12 rounded-3xl border-neon-cyan/20">
                <h3 className="text-3xl font-display text-white/50 mb-4 uppercase tracking-widest">Ready?</h3>
                <h2 className="text-6xl font-display font-black text-white mb-12">{activeTeam?.name}</h2>
                <Button onClick={() => setIsTurnStarted(true)} className="text-2xl px-12 py-6">Start Turn</Button>
              </motion.div>
            ) : currentQuestion ? (
              <motion.div key={currentQuestion.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-8">
                <Card className="p-6 md:p-10 border-white/10 bg-white/5 backdrop-blur-xl">
                  {currentQuestion.image_url && <img src={currentQuestion.image_url} alt="Question" className="w-full max-h-48 md:max-h-64 object-contain mb-6 md:mb-8 rounded-2xl bg-black/40 p-4" />}
                  <h3 className="text-xl md:text-3xl font-mono font-medium leading-tight text-white whitespace-pre-wrap">{currentQuestion.question_text}</h3>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {[1, 2, 3, 4].map(idx => (
                    <button key={idx} disabled={isAnswering} onClick={() => handleAnswer(idx)} className={cn("p-4 md:p-8 rounded-2xl border-2 text-left transition-all relative group overflow-hidden", "border-white/10 bg-white/5 hover:border-neon-cyan/50 hover:bg-neon-cyan/5", isAnswering && currentQuestion.correct_option === idx && "border-green-500 bg-green-500/20 shadow-[0_0_20px_rgba(34,197,94,0.2)]", isAnswering && currentQuestion.correct_option !== idx && "opacity-40 grayscale")}>
                      <div className="flex items-center gap-3 md:gap-4">
                        <span className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/5 flex items-center justify-center text-neon-cyan font-display text-lg md:text-xl group-hover:bg-neon-cyan group-hover:text-black transition-colors">{String.fromCharCode(64 + idx)}</span>
                        <span className="text-lg md:text-xl text-white/90 whitespace-pre-wrap">{(currentQuestion as any)[`option${idx}`]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-neon-cyan mx-auto mb-6"></div>
                <p className="text-white/40 font-display text-xl uppercase tracking-widest">Preparing next question...</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const Round3 = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<Team[]>([]);
  const [activeTeam, setActiveTeam] = useState<Team | null>(null);
  const [isTeamReady, setIsTeamReady] = useState(false);
  const [sets, setSets] = useState<QuestionSet[]>([]);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isActive, setIsActive] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [winner, setWinner] = useState<Team | null>(null);

  useEffect(() => {
    // Cleanup confetti on mount and unmount
    const cleanup = () => {
      if ((window as any).r2Interval) {
        clearInterval((window as any).r2Interval);
        (window as any).r2Interval = null;
      }
      if ((window as any).winnerInterval) {
        clearInterval((window as any).winnerInterval);
        (window as any).winnerInterval = null;
      }
    };
    cleanup();
    return cleanup;
  }, []);

  const fetchTeams = async () => {
    const res = await fetch('/api/teams');
    const data = await res.json();
    // No elimination, all teams play
    setTeams(data.sort((a: Team, b: Team) => (b.round1_score + b.round2_score + b.round3_score) - (a.round1_score + a.round2_score + a.round3_score)));
    
    if (activeTeam) {
      const updatedActive = data.find((t: Team) => t.id === activeTeam.id);
      if (updatedActive) setActiveTeam(updatedActive);
    }
  };

  const fetchSets = async () => {
    const res = await fetch('/api/round3/sets');
    const data = await res.json();
    setSets(data);
  };

  useEffect(() => {
    fetchTeams();
    fetchSets();
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        //playSound('/tiktok1.mp3');
        setTimer(t => t - 1);
      }, 1000);
    } else if (timer === 0 && isActive) {
      setIsActive(false);
      setShowTimeUp(true);
      //playSound('/fahhh.mp3');
      if ('speechSynthesis' in window) {
        const msg = new SpeechSynthesisUtterance("Time Completed! Next team be Prepared");
        window.speechSynthesis.speak(msg);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  const startRapidFire = async (setId: string) => {
    try {
      // Mark set as used
      await fetch(`/api/round3/sets/${setId}/use`, { method: 'POST' });
      fetchSets();

      const res = await fetch(`/api/round3/questions/${setId}`);
      const data = await res.json();
      setQuestions(data);
      setSelectedSet(setId);
      setCurrentQIndex(0);
      setTimer(60);
      setIsActive(true);
    } catch (err) {
      console.error("Error starting rapid fire:", err);
    }
  };

  const randomizeSet = () => {
    if (sets.length === 0) return;
    const randomSet = sets[Math.floor(Math.random() * sets.length)];
    startRapidFire(randomSet.id);
  };

  const playSound = (url: string) => {
    const audio = new Audio(url);
    audio.play().catch(() => {
      if (url.startsWith('/')) {
        const relativeAudio = new Audio(url.substring(1));
        relativeAudio.play().catch(() => {});
      }
    });
  };

  const updateScore = async (teamId: string, change: number) => {
    const res = await fetch('/api/quiz/round3/update-score', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ teamId, scoreChange: change })
    });
    
    if (res.ok) {
      fetchTeams();
      if (change > 0) {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.8 },
          colors: ['#FFFF00']
        });
        playSound('/alright.mp3');
      } else {
        playSound('/fahhh.mp3');
      }
    } else {
      const data = await res.json();
      alert(`Failed to update score: ${data.error || 'Unknown error'}`);
    }
  };

  const declareWinner = () => {
    const sorted = [...teams].sort((a, b) => (b.round1_score + b.round2_score + b.round3_score) - (a.round1_score + a.round2_score + a.round3_score));
    setWinner(sorted[0]);
    
    // Continuous crackers
    const duration = 15 * 60 * 1000; // 15 minutes
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Store interval in window to clear if needed, though user wants it to keep going
    (window as any).winnerInterval = interval;

    playSound('/claps.mp3');
  };

  if (winner) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black/90 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm pointer-events-auto">
        <Link to="/" className="absolute top-8 left-8 text-white/50 hover:text-white flex items-center gap-2 z-[10005]">
          <ChevronRight className="rotate-180" size={16} /> Home
        </Link>
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative z-[10000] pointer-events-auto"
        >
          <div className="absolute -inset-20 bg-neon-yellow/20 blur-[100px] rounded-full animate-pulse pointer-events-none"></div>
          <Trophy size={120} className="text-yellow-400 mx-auto mb-8 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
          <h2 className="text-4xl font-display text-white/50 uppercase tracking-[0.5em] mb-4">Winner</h2>
          <h1 className="text-5xl md:text-9xl font-display font-black text-white mb-8 neon-text">
            {winner.name}
          </h1>
          <div className="text-xl md:text-2xl font-display text-neon-yellow">
            Final Score: {winner.round1_score + winner.round2_score + winner.round3_score}
          </div>
          <div className="flex flex-col md:flex-row gap-4 justify-center mt-12 relative z-[10001]">
            <button 
              onClick={() => {
                if ((window as any).winnerInterval) clearInterval((window as any).winnerInterval);
                setWinner(null);
              }}
              className="px-8 py-3 rounded-xl font-display font-bold border border-white/20 hover:bg-white/10 text-white transition-all active:scale-95 z-[10002]"
            >
              Back to Round 3
            </button>
            <button 
              onClick={() => {
                if ((window as any).winnerInterval) clearInterval((window as any).winnerInterval);
                navigate('/');
              }}
              className="px-8 py-3 rounded-xl font-display font-bold bg-neon-yellow hover:bg-neon-yellow/80 text-black shadow-[0_0_15px_rgba(255,255,0,0.4)] transition-all active:scale-95 z-[10002]"
            >
              Home Page
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <Link to="/" className="absolute top-4 left-4 text-white/30 hover:text-white flex items-center gap-2 z-50">
        <ChevronRight className="rotate-180" size={16} /> Home
      </Link>
      {/* Sidebar */}
      <div className="w-full md:w-80 glass border-r border-white/10 p-6 pt-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-neon-orange flex items-center gap-2">
            <Zap size={20} /> Finalists
          </h2>
          <Link to="/" className="hidden md:flex text-white/30 hover:text-white items-center gap-1 text-xs">
            Home
          </Link>
        </div>
        <div className="space-y-4">
          {teams.map(team => (
            <div 
              key={team.id} 
              className={cn(
                "p-4 rounded-xl border transition-all cursor-pointer",
                activeTeam?.id === team.id ? "bg-neon-orange/10 border-neon-orange" : "border-white/5 bg-white/5"
              )}
              onClick={() => {
                setActiveTeam(team);
                setIsTeamReady(false);
                setSelectedSet(null);
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">{team.name}</span>
                <span className="font-display text-neon-orange text-xl">{team.round1_score + team.round2_score + team.round3_score}</span>
              </div>
            </div>
          ))}
        </div>
        <Button onClick={declareWinner} variant="secondary" className="w-full mt-8">Declare Winner</Button>
      </div>

      {/* Main Panel */}
      <div className="flex-1 p-8 flex flex-col items-center justify-center">
        {!activeTeam ? (
          <div className="text-center text-white/30">
            <Users size={64} className="mx-auto mb-4 opacity-20" />
            <p className="text-xl font-display">Select a team to start Rapid Fire</p>
          </div>
        ) : !isTeamReady ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center glass-card p-12 border-neon-orange/30"
          >
            <div className="w-24 h-24 bg-neon-orange/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-neon-orange/20">
              <Zap size={48} className="text-neon-orange" />
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-neon-orange">{activeTeam.name}</h2>
            <div className="text-left max-w-md mx-auto mb-12 space-y-4">
              <h3 className="text-neon-orange font-display text-lg md:text-xl border-b border-neon-orange/20 pb-2">Rapid Fire Rules</h3>
              <ul className="text-white/70 space-y-2 text-sm md:text-base list-disc list-inside">
                <li>Answer as many questions as possible in <span className="text-white font-bold">60 seconds</span>.</li>
                <li>Questions will be presented one after another.</li>
                <li><span className="text-green-400 font-bold">+10 points</span> for each correct answer.</li>
                <li><span className="text-white font-bold">0 points</span> for incorrect answer (No Negative Marking).</li>
                <li>The team with the highest total score (R1 + R2 + R3) wins!</li>
              </ul>
            </div>
            <Button 
              onClick={() => setIsTeamReady(true)} 
              variant="secondary"
              className="text-xl md:text-3xl px-8 py-4 md:px-16 md:py-8 rounded-2xl shadow-[0_0_30px_rgba(255,69,0,0.3)] hover:shadow-[0_0_50px_rgba(255,69,0,0.5)]"
            >
              START RAPID FIRE
            </Button>
          </motion.div>
        ) : !selectedSet ? (
          <div className="w-full max-w-2xl px-4">
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-8 text-center">Select Question Set for {activeTeam.name}</h2>
            <div className="flex flex-col gap-6">
              <Button onClick={randomizeSet} className="text-xl md:text-2xl py-6 md:py-8">Randomly Select Set</Button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sets.map(set => (
                  <button
                    key={set.id}
                    disabled={set.is_used}
                    onClick={() => startRapidFire(set.id)}
                    className={cn(
                      "p-6 md:p-8 rounded-2xl border-2 transition-all text-center group",
                      set.is_used 
                        ? "border-white/5 bg-white/5 opacity-40 cursor-not-allowed" 
                        : "border-white/10 bg-white/5 hover:border-neon-orange hover:bg-neon-orange/10"
                    )}
                  >
                    <div className={cn(
                      "text-xl md:text-2xl font-display font-bold transition-transform",
                      !set.is_used && "group-hover:scale-110"
                    )}>
                      {set.name}
                      {set.is_used && <div className="text-[10px] uppercase tracking-widest mt-1 opacity-50">Already Used</div>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-3xl px-4">
            <div className="flex justify-between items-center mb-8 md:mb-12">
              <div className="text-xl md:text-2xl font-display text-neon-orange">{activeTeam.name}</div>
              <div className={cn(
                "text-3xl md:text-5xl font-display",
                timer < 20 ? "text-red-500 animate-pulse" : "text-white"
              )}>
                {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {questions[currentQIndex] && (
                <motion.div
                  key={currentQIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Card className="min-h-[250px] md:min-h-[300px] flex flex-col items-center justify-center text-center p-6">
                    {questions[currentQIndex].image_url && (
                      <img src={questions[currentQIndex].image_url} className="max-h-32 md:max-h-48 mb-6 rounded" />
                    )}
                    <h3 className="text-2xl md:text-4xl font-mono font-medium leading-tight whitespace-pre-wrap">{questions[currentQIndex].question_text}</h3>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 justify-between items-center">
              <Button 
                variant="primary" 
                onClick={() => updateScore(activeTeam.id, 10)} 
                className="w-full md:w-auto bg-green-500 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]"
              >
                Correct (+10)
              </Button>
              <div className="flex gap-4 w-full md:w-auto">
                <Button variant="ghost" onClick={() => setCurrentQIndex(i => Math.max(0, i - 1))} className="flex-1 md:flex-none">Previous</Button>
                <Button variant="primary" onClick={() => setCurrentQIndex(i => i + 1)} className="flex-1 md:flex-none">Next Question</Button>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showTimeUp && activeTeam && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
              <Card className="max-w-md w-full text-center p-12 border-neon-orange/50 relative overflow-hidden">
                <div className="absolute -inset-10 bg-neon-orange/5 blur-[50px] rounded-full pointer-events-none" />
                <Timer size={80} className="text-neon-orange mx-auto mb-6 animate-pulse relative z-10" />
                <h2 className="text-4xl font-display font-black text-white mb-4 uppercase tracking-widest relative z-10">Time Completed!</h2>
                <div className="text-white/60 mb-8 relative z-10">
                  <p className="text-xl mb-2 text-white font-bold">{activeTeam.name}</p>
                  <p className="text-3xl font-display text-neon-orange">Round Score: {activeTeam.round3_score}</p>
                  <p className="text-sm mt-2">Total Score: {activeTeam.round1_score + activeTeam.round2_score + activeTeam.round3_score}</p>
                </div>
                <Button 
                  onClick={() => {
                    setShowTimeUp(false);
                    setActiveTeam(null);
                    setIsTeamReady(false);
                    setSelectedSet(null);
                  }}
                  className="w-full py-4 text-xl relative z-10 shadow-[0_0_20px_rgba(255,69,0,0.3)]"
                >
                  Next Team
                </Button>
              </Card>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('teams');
  const [teams, setTeams] = useState<Team[]>([]);
  const [r1Sets, setR1Sets] = useState<any[]>([]);
  const [r2Sets, setR2Sets] = useState<QuestionSet[]>([]);
  const [r3Sets, setR3Sets] = useState<QuestionSet[]>([]);
  const [status, setStatus] = useState<any>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const { token } = await res.json();
        localStorage.setItem('adminToken', token);
        setIsLoggedIn(true);
      } else {
        const data = await res.json().catch(() => ({ error: 'Server returned an invalid response' }));
        alert(`Login failed: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed. Please check your internet connection or server status.');
    }
  };

  const fetchData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` };
      
      const [tRes, r1Res, r2Res, r3Res, sRes] = await Promise.all([
        fetch('/api/teams'),
        fetch('/api/round1/mystery-box/questions'),
        fetch('/api/round2/sets'),
        fetch('/api/round3/sets'),
        fetch('/api/admin/status', { headers })
      ]);

      if (sRes.status === 401 || sRes.status === 403) {
        localStorage.removeItem('adminToken');
        setIsLoggedIn(false);
        return;
      }

      const [t, r1, r2, r3, s] = await Promise.all([
        tRes.json(),
        r1Res.json(),
        r2Res.json(),
        r3Res.json(),
        sRes.json()
      ]);

      setTeams(t);
      setR1Sets(r1);
      setR2Sets(r2);
      setR3Sets(r3);
      setStatus(s);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) fetchData();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <div className="text-center mb-8">
            <ShieldCheck size={48} className="text-neon-yellow mx-auto mb-4" />
            <h2 className="text-2xl font-display font-bold">Admin Portal</h2>
            <p className="text-white/50">Secure access for event organizers</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Username</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-neon-yellow outline-none transition-all"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/50 mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:border-neon-yellow outline-none transition-all"
                placeholder="Harini@CSE123"
              />
            </div>
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-4 p-3 bg-white/5 rounded border border-white/10 text-[10px] text-white/40 text-center">
            Default: <span className="text-neon-yellow">admin</span> / <span className="text-neon-yellow">Harini@CSE123</span>
          </div>
          <div className="mt-6 text-center">
            <Link to="/" className="text-white/30 hover:text-neon-yellow transition-colors text-sm flex items-center justify-center gap-2">
              <ChevronRight className="rotate-180" size={14} /> Back to Home Page
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="glass border-b border-white/10 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors mr-2" title="Back to Home">
            <ChevronRight className="rotate-180 text-white/50" size={20} />
          </Link>
          <LayoutDashboard className="text-neon-yellow" />
          <h1 className="text-xl font-display font-bold">Admin Dashboard</h1>
          <Button variant="ghost" size="sm" onClick={fetchData} className="ml-4">
            Refresh Data
          </Button>
        </div>
        <Button variant="ghost" onClick={() => { localStorage.removeItem('adminToken'); setIsLoggedIn(false); }}>
          <LogOut size={18} className="mr-2" /> Logout
        </Button>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <nav className="w-full md:w-64 glass border-b md:border-b-0 md:border-r border-white/10 p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible">
          {[
            { id: 'teams', icon: Users, label: 'Teams' },
            { id: 'r1-mystery', icon: Box, label: 'Round 1 Mystery' },
            { id: 'r2-questions', icon: Zap, label: 'Round 2 Questions' },
            { id: 'r3-sets', icon: Trophy, label: 'Round 3 Sets' },
            { id: 'controls', icon: ShieldCheck, label: 'Event Controls' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-shrink-0 md:w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                activeTab === tab.id ? "bg-neon-yellow/10 text-neon-yellow" : "hover:bg-white/5 text-white/50"
              )}
            >
              <tab.icon size={18} /> <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </nav>

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {status && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4 mb-8">
              {[
                { label: 'Teams', value: status.teams?.count || 0 },
                { label: 'R1 Mystery', value: status.r1MysteryQuestions?.count || 0 },
                { label: 'R2 Qs', value: status.r2Questions?.count || 0 },
                { label: 'R3 Sets', value: status.r3Sets?.count || 0 },
                { label: 'R3 Qs', value: status.r3Questions?.count || 0 }
              ].map(stat => (
                <div key={stat.label} className="glass p-3 md:p-4 rounded-xl text-center">
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">{stat.label}</p>
                  <p className="text-lg md:text-2xl font-display font-bold text-neon-yellow">{stat.value}</p>
                </div>
              ))}
            </div>
          )}
          {activeTab === 'teams' && <TeamManager teams={teams} onUpdate={fetchData} />}
          {activeTab === 'r1-mystery' && <Round1MysteryBoxManager onUpdate={fetchData} />}
          {activeTab === 'r2-questions' && <Round2QuestionManager onUpdate={fetchData} />}
          {activeTab === 'r3-sets' && <SetManager type="round3" sets={r3Sets} onUpdate={fetchData} />}
          {activeTab === 'controls' && <EventControls onUpdate={fetchData} />}
        </main>
      </div>
    </div>
  );
};

const TeamManager = ({ teams, onUpdate }: any) => {
  const [showAdd, setShowAdd] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', member1: '', member2: '', member3: '' });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(newTeam)
    });
    if (res.ok) {
      setShowAdd(false);
      setNewTeam({ name: '', member1: '', member2: '', member3: '' });
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this team?')) return;
    const res = await fetch(`/api/teams/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
    } else {
      const data = await res.json();
      alert(`Failed to delete team: ${data.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Manage Teams</h2>
        <Button onClick={() => setShowAdd(true)}><Plus size={18} className="mr-2" /> Add Team</Button>
      </div>

      {showAdd && (
        <Card className="mb-8">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Team Name" className="bg-white/5 border border-white/10 p-2 rounded" value={newTeam.name} onChange={e => setNewTeam({...newTeam, name: e.target.value})} required />
            <input placeholder="Member 1" className="bg-white/5 border border-white/10 p-2 rounded" value={newTeam.member1} onChange={e => setNewTeam({...newTeam, member1: e.target.value})} required />
            <input placeholder="Member 2" className="bg-white/5 border border-white/10 p-2 rounded" value={newTeam.member2} onChange={e => setNewTeam({...newTeam, member2: e.target.value})} required />
            <input placeholder="Member 3" className="bg-white/5 border border-white/10 p-2 rounded" value={newTeam.member3} onChange={e => setNewTeam({...newTeam, member3: e.target.value})} required />
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">Save</Button>
              <Button type="button" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team: Team) => (
          <Card key={team.id} className="relative group">
            <button onClick={() => handleDelete(team.id)} className="absolute top-4 right-4 text-white/20 hover:text-red-500 transition-colors">
              <Trash2 size={18} />
            </button>
            <h3 className="text-xl font-bold mb-2">{team.name}</h3>
            <div className="text-sm text-white/50 space-y-1">
              <p>• {team.member1}</p>
              <p>• {team.member2}</p>
              <p>• {team.member3}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
              <span className="text-xs uppercase tracking-widest text-white/30">Total Score</span>
              <span className="font-display text-neon-yellow">{team.round1_score + team.round2_score + team.round3_score}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

const Round1MysteryBoxManager = ({ onUpdate }: any) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newQ, setNewQ] = useState({ box_number: 1, difficulty: 'Easy', question_text: '', correct_answer: '' });

  const fetchQuestions = async () => {
    const res = await fetch('/api/round1/mystery-box/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAdd = async () => {
    const res = await fetch('/api/round1/mystery-box/questions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify(newQ)
    });
    if (res.ok) {
      setShowAdd(false);
      setNewQ({ box_number: questions.length + 2, difficulty: 'Easy', question_text: '', correct_answer: '' });
      fetchQuestions();
      onUpdate();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    const res = await fetch(`/api/round1/mystery-box/questions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      fetchQuestions();
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Round 1 Mystery Box Questions</h2>
        <Button onClick={() => setShowAdd(true)}><Plus size={18} className="mr-2" /> Add Question</Button>
      </div>

      {showAdd && (
        <Card className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Box Number</label>
              <input type="number" className="w-full bg-white/5 border border-white/10 p-2 rounded" value={newQ.box_number} onChange={e => setNewQ({...newQ, box_number: parseInt(e.target.value)})} />
            </div>
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Difficulty</label>
              <select className="w-full bg-white/5 border border-white/10 p-2 rounded" value={newQ.difficulty} onChange={e => setNewQ({...newQ, difficulty: e.target.value})}>
                <option value="Easy">Easy (+10)</option>
                <option value="Medium">Medium (+15)</option>
                <option value="Hard">Hard (+20)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Question Text</label>
            <textarea placeholder="Question Text" className="w-full bg-white/5 border border-white/10 p-2 rounded h-24 font-mono" value={newQ.question_text} onChange={e => setNewQ({...newQ, question_text: e.target.value})} />
          </div>
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest mb-2 block">Correct Answer</label>
            <input placeholder="Correct Answer" className="w-full bg-white/5 border border-white/10 p-2 rounded" value={newQ.correct_answer} onChange={e => setNewQ({...newQ, correct_answer: e.target.value})} />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd}>Add</Button>
            <Button variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {questions.sort((a, b) => a.box_number - b.box_number).map((q) => (
          <div key={q.id} className="p-4 glass rounded-lg flex justify-between items-start group">
            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-lg bg-neon-yellow/10 border border-neon-yellow/30 flex items-center justify-center font-display text-xl text-neon-yellow">
                {q.box_number}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-[10px] uppercase tracking-widest px-2 py-0.5 rounded",
                    q.difficulty === 'Easy' ? "bg-green-500/20 text-green-400" :
                    q.difficulty === 'Medium' ? "bg-yellow-500/20 text-yellow-400" :
                    "bg-red-500/20 text-red-400"
                  )}>
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm text-white/80 mb-1 whitespace-pre-wrap font-mono">{q.question_text}</p>
                {q.correct_answer && (
                  <div className="text-[10px] text-neon-yellow uppercase tracking-widest font-bold">
                    Ans: {q.correct_answer}
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={() => handleDelete(q.id)}
              className="text-white/20 hover:text-red-500 transition-all"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const Round2QuestionManager = ({ onUpdate }: any) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQ, setNewQ] = useState({ question_text: '', image_url: '', option1: '', option2: '', option3: '', option4: '', correct_option: 1 });

  const fetchQuestions = async () => {
    const res = await fetch('/api/round2/questions');
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleAddQ = async () => {
    let finalImageUrl = newQ.image_url;
    const fileInput = document.getElementById('r2-image-upload') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      try {
        finalImageUrl = await uploadFile(fileInput.files[0]);
      } catch (err) {
        alert('Image upload failed');
        return;
      }
    }

    const res = await fetch('/api/round2/questions', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ ...newQ, image_url: finalImageUrl })
    });
    if (res.ok) {
      setShowAddQ(false);
      setNewQ({ question_text: '', image_url: '', option1: '', option2: '', option3: '', option4: '', correct_option: 1 });
      fetchQuestions();
      onUpdate();
    }
  };

  const handleDeleteQ = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    const res = await fetch(`/api/round2/questions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      fetchQuestions();
      onUpdate();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">Round 2 Questions</h2>
        <Button onClick={() => setShowAddQ(true)}><Plus size={18} className="mr-2" /> Add Question</Button>
      </div>

      {showAddQ && (
        <Card className="space-y-4">
          <textarea placeholder="Question Text" className="w-full bg-white/5 border border-white/10 p-2 rounded font-mono" value={newQ.question_text} onChange={e => setNewQ({...newQ, question_text: e.target.value})} />
          <div className="space-y-2">
            <label className="text-xs text-white/40 uppercase tracking-widest">Question Image</label>
            <input id="r2-image-upload" type="file" accept="image/*" className="w-full bg-white/5 border border-white/10 p-2 rounded text-sm" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex gap-2">
                <input 
                  placeholder={`Option ${i}`} 
                  className="flex-1 bg-white/5 border border-white/10 p-2 rounded" 
                  value={(newQ as any)[`option${i}`]} 
                  onChange={e => setNewQ({...newQ, [`option${i}`]: e.target.value})} 
                />
                <input 
                  type="radio" 
                  name="correct" 
                  checked={newQ.correct_option === i} 
                  onChange={() => setNewQ({...newQ, correct_option: i})} 
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddQ}>Add</Button>
            <Button variant="outline" onClick={() => setShowAddQ(false)}>Cancel</Button>
          </div>
        </Card>
      )}

      <div className="space-y-2">
        {questions.map((q, idx) => (
          <div key={q.id} className="p-4 glass rounded-lg flex justify-between items-center group">
            <div className="flex gap-4 items-center">
              <span className="text-white/30 font-display">{idx + 1}</span>
              <p className="truncate max-w-md whitespace-pre-wrap font-mono">{q.question_text}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-neon-yellow uppercase">Correct: {String.fromCharCode(64 + q.correct_option)}</span>
              <button 
                onClick={() => handleDeleteQ(q.id)}
                className="text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SetManager = ({ type, sets, onUpdate }: any) => {
  const [activeSet, setActiveSet] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [showAddSet, setShowAddSet] = useState(false);
  const [setName, setSetName] = useState('');
  const [showAddQ, setShowAddQ] = useState(false);
  const [newQ, setNewQ] = useState({
    question_text: '',
    image_url: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    correct_option: 1
  });

  const fetchQuestions = async (setId: number) => {
    const res = await fetch(`/api/${type}/questions/${setId}`);
    const data = await res.json();
    setQuestions(data);
  };

  useEffect(() => {
    if (activeSet && !sets.find((s: any) => s.id === activeSet.id)) {
      setActiveSet(null);
      setQuestions([]);
    }
  }, [sets, activeSet]);

  const handleAddSet = async () => {
    const res = await fetch(`/api/${type}/sets`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ name: setName })
    });
    if (res.ok) {
      setShowAddSet(false);
      setSetName('');
      onUpdate();
    }
  };

  const handleAddQ = async () => {
    let finalImageUrl = newQ.image_url;
    const fileInput = document.getElementById('r3-image-upload') as HTMLInputElement;
    if (fileInput?.files?.[0]) {
      try {
        finalImageUrl = await uploadFile(fileInput.files[0]);
      } catch (err) {
        alert('Image upload failed');
        return;
      }
    }

    const res = await fetch(`/api/${type}/questions`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      },
      body: JSON.stringify({ ...newQ, set_id: activeSet.id, image_url: finalImageUrl })
    });
    if (res.ok) {
      setShowAddQ(false);
      setNewQ({ question_text: '', image_url: '', option1: '', option2: '', option3: '', option4: '', correct_option: 1 });
      fetchQuestions(activeSet.id);
    }
  };

  const handleDeleteSet = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this set and all its questions?')) return;
    const res = await fetch(`/api/${type}/sets/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
    } else {
      const data = await res.json();
      alert(`Failed to delete set: ${data.error || 'Unknown error'}`);
    }
  };

  const handleDeleteQ = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    const res = await fetch(`/api/${type}/questions/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      fetchQuestions(activeSet.id);
    } else {
      const data = await res.json();
      alert(`Failed to delete question: ${data.error || 'Unknown error'}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">{type === 'round2' ? 'Round 2 Sets' : 'Round 3 Sets'}</h2>
        <Button onClick={() => setShowAddSet(true)}><Plus size={18} className="mr-2" /> New Set</Button>
      </div>

      {showAddSet && (
        <Card className="flex gap-4">
          <input placeholder="Set Name (e.g. Set A)" className="flex-1 bg-white/5 border border-white/10 p-2 rounded" value={setName} onChange={e => setSetName(e.target.value)} />
          <Button onClick={handleAddSet}>Create</Button>
          <Button variant="outline" onClick={() => setShowAddSet(false)}>Cancel</Button>
        </Card>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {sets.map((s: any) => (
          <div key={s.id} className="relative group">
            <button
              onClick={() => { setActiveSet(s); fetchQuestions(s.id); }}
              className={cn(
                "px-6 py-3 rounded-xl border-2 whitespace-nowrap transition-all pr-10",
                activeSet?.id === s.id ? "border-neon-cyan bg-neon-cyan/10" : "border-white/10 bg-white/5"
              )}
            >
              {s.name}
            </button>
            <button 
              onClick={(e) => handleDeleteSet(s.id, e)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {activeSet && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-display">Questions in {activeSet.name}</h3>
            <Button onClick={() => setShowAddQ(true)} variant="secondary"><Plus size={16} className="mr-2" /> Add Question</Button>
          </div>

          {showAddQ && (
            <Card className="space-y-4">
              <textarea placeholder="Question Text" className="w-full bg-white/5 border border-white/10 p-2 rounded font-mono" value={newQ.question_text} onChange={e => setNewQ({...newQ, question_text: e.target.value})} />
              <div className="space-y-2">
                <label className="text-xs text-white/40 uppercase tracking-widest">Question Image</label>
                <input id="r3-image-upload" type="file" accept="image/*" className="w-full bg-white/5 border border-white/10 p-2 rounded text-sm" />
              </div>
              
              {type === 'round2' && (
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex gap-2">
                      <input 
                        placeholder={`Option ${i}`} 
                        className="flex-1 bg-white/5 border border-white/10 p-2 rounded" 
                        value={(newQ as any)[`option${i}`]} 
                        onChange={e => setNewQ({...newQ, [`option${i}`]: e.target.value})} 
                      />
                      <input 
                        type="radio" 
                        name="correct" 
                        checked={newQ.correct_option === i} 
                        onChange={() => setNewQ({...newQ, correct_option: i})} 
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleAddQ}>Add</Button>
                <Button variant="outline" onClick={() => setShowAddQ(false)}>Cancel</Button>
              </div>
            </Card>
          )}

          <div className="space-y-2">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-4 glass rounded-lg flex justify-between items-center group">
                <div className="flex gap-4 items-center">
                  <span className="text-white/30 font-display">{idx + 1}</span>
                  <p className="truncate max-w-md whitespace-pre-wrap font-mono">{q.question_text}</p>
                </div>
                <div className="flex items-center gap-4">
                  {type === 'round2' && <span className="text-xs text-neon-cyan uppercase">Correct: {String.fromCharCode(64 + q.correct_option)}</span>}
                  <button 
                    onClick={() => handleDeleteQ(q.id)}
                    className="text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const EventControls = ({ onUpdate }: any) => {
  const handleReset = async () => {
    if (!confirm('RESET ALL SCORES? This cannot be undone.')) return;
    const res = await fetch('/api/quiz/reset', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
      alert('Scores reset successfully');
    } else {
      const data = await res.json();
      alert(`Failed to reset scores: ${data.error || 'Unknown error'}`);
    }
  };

  const handleResetR3 = async () => {
    if (!confirm('RESET ROUND 3 SCORES?')) return;
    const res = await fetch('/api/quiz/reset-r3', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
      alert('Round 3 scores reset successfully');
    } else {
      const data = await res.json();
      alert(`Failed to reset Round 3 scores: ${data.error || 'Unknown error'}`);
    }
  };

  const handleResetPassword = async () => {
    if (!confirm('Reset admin password to default?')) return;
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      alert('Admin password reset to default: Harini@CSE123');
    } else {
      alert('Failed to reset password');
    }
  };

  const handleClearTeams = async () => {
    if (!confirm('DELETE ALL TEAMS? This cannot be undone.')) return;
    const res = await fetch('/api/teams', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
      alert('All teams deleted successfully');
    } else {
      const data = await res.json();
      alert(`Failed to delete teams: ${data.error || 'Unknown error'}`);
    }
  };

  const handleClearR2 = async () => {
    if (!confirm('DELETE ALL ROUND 2 DATA? This cannot be undone.')) return;
    const res = await fetch('/api/round2/all', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
      alert('Round 2 data deleted successfully');
    } else {
      const data = await res.json();
      alert(`Failed to delete Round 2 data: ${data.error || 'Unknown error'}`);
    }
  };

  const handleClearR3 = async () => {
    if (!confirm('DELETE ALL ROUND 3 DATA? This cannot be undone.')) return;
    const res = await fetch('/api/round3/all', {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
      alert('Round 3 data deleted successfully');
    } else {
      const data = await res.json();
      alert(`Failed to delete Round 3 data: ${data.error || 'Unknown error'}`);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('DELETE EVERYTHING? All teams, questions, and sets will be gone. This is IRREVERSIBLE.')) return;
    try {
      const headers = { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` };
      const res1 = await fetch('/api/teams', { method: 'DELETE', headers });
      const res2 = await fetch('/api/round2/all', { method: 'DELETE', headers });
      const res3 = await fetch('/api/round3/all', { method: 'DELETE', headers });
      
      if (res1.ok && res2.ok && res3.ok) {
        onUpdate();
        alert('System wiped successfully');
      } else {
        alert('Some data failed to delete. Please check status.');
      }
    } catch (err) {
      alert('Failed to wipe system');
    }
  };

  const handleQualify = async () => {
    if (!confirm('Qualify top 5 teams for Round 3?')) return;
    const res = await fetch('/api/quiz/qualify', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
    });
    if (res.ok) {
      onUpdate();
      alert('Top 5 teams qualified successfully');
    } else {
      const data = await res.json();
      alert(`Failed to qualify teams: ${data.error || 'Unknown error'}`);
    }
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (!e.target.files?.[0]) return;
    const formData = new FormData();
    formData.append('file', e.target.files[0]);
    formData.append('name', name);
    const res = await fetch('/api/upload-asset', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      body: formData
    });
    if (res.ok) {
      alert(`${name} uploaded successfully`);
    } else {
      alert(`Failed to upload ${name}`);
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-display font-bold">Event Controls</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-red-500/30">
          <h3 className="text-xl font-bold mb-4 text-red-500">Danger Zone</h3>
          <p className="text-white/50 mb-6">Reset all team scores and progress to start a new event.</p>
          <div className="space-y-4">
            <Button variant="danger" onClick={handleReset} className="w-full">Reset All Progress</Button>
            <Button variant="danger" onClick={handleResetR3} className="w-full bg-red-500/50">Reset R3 Scores Only</Button>
            <Button variant="danger" onClick={handleClearTeams} className="w-full">Clear All Teams</Button>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="danger" onClick={handleClearR2} className="text-xs py-2">Clear R2 Questions</Button>
              <Button variant="danger" onClick={handleClearR3} className="text-xs py-2">Clear R3 Questions</Button>
            </div>
            <Button variant="danger" onClick={handleClearAll} className="w-full border-2 border-red-500 bg-transparent hover:bg-red-500/20">
              WIPE ALL DATA
            </Button>
            <Button variant="ghost" onClick={handleResetPassword} className="w-full text-xs opacity-50 hover:opacity-100">
              Reset Admin Password to Default
            </Button>
          </div>
        </Card>
        <Card className="border-neon-yellow/30">
          <h3 className="text-xl font-bold mb-4 text-neon-yellow">Round Transition</h3>
          <p className="text-white/50 mb-6">Automatically select the top 5 teams from Round 2 to participate in Round 3.</p>
          <Button variant="primary" onClick={handleQualify} className="w-full">Qualify Top 5</Button>
        </Card>
        <Card className="border-neon-cyan/30">
          <h3 className="text-xl font-bold mb-4 text-neon-cyan">Sound Assets</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest">Correct Answer Sound (alright.mp3)</label>
              <input type="file" accept="audio/mpeg" onChange={(e) => handleAssetUpload(e, 'alright.mp3')} className="w-full bg-white/5 border border-white/10 p-2 rounded text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest">Wrong Answer Sound (fahhh.mp3)</label>
              <input type="file" accept="audio/mpeg" onChange={(e) => handleAssetUpload(e, 'fahhh.mp3')} className="w-full bg-white/5 border border-white/10 p-2 rounded text-sm" />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-white/40 uppercase tracking-widest">Timer Sound (tiktock.mp3)</label>
              <input type="file" accept="audio/mpeg" onChange={(e) => handleAssetUpload(e, 'tiktock.mp3')} className="w-full bg-white/5 border border-white/10 p-2 rounded text-sm" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// --- App Root ---

const RouteWatcher = () => {
  const location = useLocation();
  useEffect(() => {
    if ((window as any).r2Interval) {
      clearInterval((window as any).r2Interval);
      (window as any).r2Interval = null;
    }
    if ((window as any).winnerInterval) {
      clearInterval((window as any).winnerInterval);
      (window as any).winnerInterval = null;
    }
  }, [location]);
  return null;
};

export default function App() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 200);
      mouseY.set(e.clientY - 200);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <Router>
      <RouteWatcher />
      <div className="animated-bg">
        <motion.div 
          style={{ x: springX, y: springY }}
          className="glow-orb bg-neon-cyan opacity-20" 
        />
        <motion.div 
          style={{ 
            x: springX, 
            y: springY,
            translateX: '50vw',
            translateY: '50vh'
          }}
          className="glow-orb bg-neon-orange opacity-20" 
        />
      </div>
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/round1" element={<Round1 />} />
          <Route path="/round2" element={<Round2 />} />
          <Route path="/round3" element={<Round3 />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}
