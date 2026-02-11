import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

const AssessmentInterface = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'

    const questions = [
        {
            id: 1,
            text: "What is the Kannada word for 'Hello'?",
            options: ["Namaskara", "Hogibanni", "Dhanyavadagalu", "Oota ayita?"],
            correct: "Namaskara"
        },
        {
            id: 2,
            text: "Translate: 'ನಾನು ಓದುತ್ತಿದ್ದೇನೆ' (Nanu oduttiddene)",
            options: ["I am eating", "I am reading", "I am sleeping", "I am walking"],
            correct: "I am reading"
        }
    ];

    const handleCheck = () => {
        if (selectedOption === questions[currentQuestion].correct) {
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }
    };

    const handleNext = () => {
        setFeedback(null);
        setSelectedOption(null);
        setCurrentQuestion((prev) => prev + 1);
    };

    if (currentQuestion >= questions.length) {
        return (
            <div className="flex flex-col items-center justify-center p-10 glass-card">
                <Trophy size={64} color="var(--primary)" />
                <h2 className="mt-4">ಅಭಿನಂದನೆಗಳು! (Congratulations!)</h2>
                <p>You've completed the assessment.</p>
                <button className="btn btn-primary mt-6">Go to Dashboard</button>
            </div>
        );
    }

    const q = questions[currentQuestion];

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Question {currentQuestion + 1} of {questions.length}</span>
                <div style={{ width: '100px' }} className="progress-bar">
                    <div className="progress-fill" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <motion.div
                key={q.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card"
                style={{ padding: '2.5rem' }}
            >
                <h2 style={{ marginBottom: '2rem' }}>{q.text}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {q.options.map((opt) => (
                        <motion.div
                            key={opt}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => !feedback && setSelectedOption(opt)}
                            className="glass-card"
                            style={{
                                padding: '1.25rem',
                                cursor: feedback ? 'default' : 'pointer',
                                borderColor: selectedOption === opt ? 'var(--primary)' : 'var(--border)',
                                background: selectedOption === opt ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-card)',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            {opt}
                        </motion.div>
                    ))}
                </div>

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AnimatePresence>
                        {feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: feedback === 'correct' ? '#4ade80' : '#f87171',
                                    fontWeight: 'bold'
                                }}
                            >
                                {feedback === 'correct' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                                <span>{feedback === 'correct' ? 'ಸರಿಯಾಗಿದೆ! (Success!)' : 'ತಪ್ಪಾಗಿದೆ (Try Again)'}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {!feedback ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleCheck}
                            disabled={!selectedOption}
                            style={{ opacity: selectedOption ? 1 : 0.5, marginLeft: 'auto' }}
                        >
                            Check
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AssessmentInterface;
