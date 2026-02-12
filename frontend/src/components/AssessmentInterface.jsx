import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, Trophy, Loader2 } from 'lucide-react';
import { assessmentApi } from '../utils/api';
import VoiceRecorder from './VoiceRecorder';
import ImageUpload from './ImageUpload';

const AssessmentInterface = ({ lessonId = 'any' }) => {
    const [questions, setQuestions] = useState([]);
    const [assessment, setAssessment] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [currentMedia, setCurrentMedia] = useState(null); // Blob or File
    const [checking, setChecking] = useState(false);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'
    const [loading, setLoading] = useState(true);
    const [isFinished, setIsFinished] = useState(false);
    const [resultData, setResultData] = useState(null);
    const [answers, setAnswers] = useState({});

    useEffect(() => {
        const fetchAssessment = async () => {
            try {
                // If it's a demo/any, we could fetch a specific one or the first one
                // For this implementation, we assume we have a lessonId or fetch first
                const response = await assessmentApi.getByLesson(lessonId);
                setAssessment(response.data.assessment);
                setQuestions(response.data.questions);
            } catch (err) {
                console.error("Error fetching assessment:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAssessment();
    }, [lessonId]);

    const handleCheck = async () => {
        const q = questions[currentQuestion];
        setChecking(true);

        try {
            let userResultText = "";

            if (q.type === 'MCQ') {
                userResultText = selectedOption;
            } else if (q.type === 'Voice' || q.type === 'Image') {
                if (!currentMedia) return;

                const formData = new FormData();
                formData.append('media', currentMedia);
                formData.append('type', q.type);

                const response = await assessmentApi.processMedia(formData);
                userResultText = response.data.text;
                console.log(`Extracted text: ${userResultText}`);
            }

            const isCorrect = userResultText.toLowerCase().trim() === (q.correct_answer || "").toLowerCase().trim() ||
                (q.type === 'MCQ' && userResultText === q.correct_answer);

            setAnswers({ ...answers, [q.id]: userResultText });
            setFeedback(isCorrect ? 'correct' : 'incorrect');
        } catch (err) {
            console.error("Check Error:", err);
            alert("Processing failed. Please try again.");
        } finally {
            setChecking(false);
        }
    };

    const handleNext = async () => {
        if (currentQuestion + 1 < questions.length) {
            setFeedback(null);
            setSelectedOption(null);
            setCurrentMedia(null);
            setCurrentQuestion((prev) => prev + 1);
        } else {
            // Last question - Submit everything to backend
            setLoading(true);
            try {
                const response = await assessmentApi.submit({
                    userId: 'f0000000-0000-0000-0000-000000000000', // Mock User ID for demo
                    assessmentId: assessment.id,
                    answers: answers
                });
                setResultData(response.data.result);
                setIsFinished(true);
            } catch (err) {
                console.error("Error submitting assessment:", err);
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 glass-card">
                <Loader2 className="animate-spin" size={48} color="var(--primary)" />
            </div>
        );
    }

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center p-10 glass-card">
                <Trophy size={64} color="var(--primary)" />
                <h2 className="mt-4">ಅಭಿನಂದನೆಗಳು! (Congratulations!)</h2>
                <p>ನಿಮ್ಮ ಸ್ಕೋರ್ (Your Score): {resultData?.score}%</p>
                <p>{resultData?.passed ? 'ನೀವು ಉತ್ತೀರ್ಣರಾಗಿದ್ದೀರಿ! (You Passed!)' : 'ಇನ್ನೂ ಸ್ವಲ್ಪ ಪ್ರಯತ್ನಿಸಿ (Keep Practicing)'}</p>
                <button className="btn btn-primary mt-6" onClick={() => window.location.reload()}>Finish</button>
            </div>
        );
    }

    if (!questions.length) {
        return (
            <div className="glass-card p-10 text-center">
                <h2>No questions found for this lesson.</h2>
                <p className="mt-4">Create questions in the database first.</p>
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

                <div style={{ flex: 1 }}>
                    {q.type === 'MCQ' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {(q.options || []).map((opt) => (
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
                    )}

                    {q.type === 'Voice' && !feedback && (
                        <VoiceRecorder onRecordingComplete={setCurrentMedia} />
                    )}

                    {q.type === 'Image' && !feedback && (
                        <ImageUpload onImageSelected={setCurrentMedia} />
                    )}

                    {feedback && (q.type === 'Voice' || q.type === 'Image') && (
                        <div className="glass-card" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', textAlign: 'center' }}>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>DETERMINED ANSWER:</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>"{answers[q.id]}"</p>
                        </div>
                    )}
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
                            disabled={checking || (!selectedOption && !currentMedia)}
                            style={{ opacity: (selectedOption || currentMedia) ? 1 : 0.5, marginLeft: 'auto', minWidth: '120px' }}
                        >
                            {checking ? <Loader2 className="animate-spin" size={18} /> : "Check Answer"}
                        </button>
                    ) : (
                        <button
                            className="btn btn-primary"
                            onClick={handleNext}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}
                        >
                            {currentQuestion + 1 < questions.length ? 'Next' : 'Submit'} <ArrowRight size={18} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AssessmentInterface;
