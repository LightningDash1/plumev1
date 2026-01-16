import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { quizQuestions, QuizQuestion } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Brain } from 'lucide-react';

interface MiniQuizProps {
  open: boolean;
  onClose: () => void;
}

export const MiniQuiz = ({ open, onClose }: MiniQuizProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  // Get 3 random questions
  const [questions] = useState(() => {
    const shuffled = [...quizQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });

  const question = questions[currentQuestion];

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index);
  };

  const handleNext = () => {
    if (selectedAnswer === question.correctIndex) {
      setCorrectCount(prev => prev + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleClose = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    onClose();
  };

  const isCorrect = selectedAnswer === question?.correctIndex;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center flex items-center justify-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            Quick Quiz!
          </DialogTitle>
        </DialogHeader>

        {!showResult ? (
          <div className="space-y-6 py-4">
            {/* Progress */}
            <div className="flex gap-2">
              {questions.map((_, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex-1 h-1.5 rounded-full transition-all",
                    i < currentQuestion ? "bg-primary" :
                    i === currentQuestion ? "bg-primary/50" : "bg-secondary"
                  )}
                />
              ))}
            </div>

            {/* Question */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
              <p className="text-lg font-bold text-foreground">{question?.question}</p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {question?.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={selectedAnswer !== null}
                  className={cn(
                    "w-full p-4 rounded-xl text-left font-medium transition-all",
                    selectedAnswer === null
                      ? "bg-secondary hover:bg-secondary/80"
                      : selectedAnswer === index
                        ? index === question.correctIndex
                          ? "bg-success/20 border-2 border-success"
                          : "bg-destructive/20 border-2 border-destructive"
                        : index === question.correctIndex
                          ? "bg-success/20 border-2 border-success"
                          : "bg-secondary opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {selectedAnswer !== null && index === question.correctIndex && (
                      <CheckCircle className="w-5 h-5 text-success" />
                    )}
                    {selectedAnswer !== null && selectedAnswer === index && index !== question.correctIndex && (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Explanation */}
            {selectedAnswer !== null && (
              <div className={cn(
                "p-4 rounded-xl animate-fade-in",
                isCorrect ? "bg-success/10" : "bg-accent-soft"
              )}>
                <p className="text-sm text-foreground">{question?.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {selectedAnswer !== null && (
              <Button
                onClick={handleNext}
                className="w-full h-12 font-bold rounded-2xl gradient-primary"
              >
                {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6 py-4 text-center">
            <div className="text-6xl">
              {correctCount === questions.length ? '🎉' : correctCount >= 2 ? '👏' : '💪'}
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground mb-2">
                {correctCount}/{questions.length} correct!
              </p>
              <p className="text-muted-foreground">
                {correctCount === questions.length 
                  ? "Perfect score! You're a money whiz!"
                  : correctCount >= 2 
                    ? "Great job! Keep learning!"
                    : "Nice try! Every answer teaches something new."}
              </p>
            </div>
            <Button
              onClick={handleClose}
              className="w-full h-12 font-bold rounded-2xl gradient-primary"
            >
              Done ✓
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};