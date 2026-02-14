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

            if (q.type === 'MCQ' || q.type === 'Text') {
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

            const cleanText = (text) => (text || "").toString().trim().toLowerCase().replace(/[^a-z0-9\u0C80-\u0CFF\s]/gi, "");

            const userClean = cleanText(userResultText);
            const correctClean = cleanText(q.correct_answer);

            // Resilient check: compare cleaned versions, or exact match for index/strings
            const isCorrect = userClean === correctClean && userClean !== "";

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
            <div className="flex flex-col items-center justify-center p-10 glass-card text-center" style={{ minHeight: '400px' }}>
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 12 }}
                >
                    <Trophy size={80} color="var(--primary)" style={{ filter: 'drop-shadow(0 0 15px var(--primary))' }} />
                </motion.div>

                <h2 className="mt-6" style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                    {resultData?.passed ? 'ಅಭಿನಂದನೆಗಳು! (Congratulations!)' : 'ಉತ್ತಮ ಪ್ರಯತ್ನ! (Good Effort!)'}
                </h2>

                <div style={{ margin: '2rem 0', position: 'relative' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <motion.circle
                            cx="60" cy="60" r="54" fill="none"
                            stroke="var(--primary)" strokeWidth="8"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: (resultData?.score || 0) / 100 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            transform="rotate(-90 60 60)"
                        />
                    </svg>
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        fontSize: '1.8rem', fontWeight: 'bold'
                    }}>
                        {resultData?.score}%
                    </div>
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '300px' }}>
                    {resultData?.passed
                        ? 'ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಉತ್ತೀರ್ಣರಾಗಿದ್ದೀರಿ! (You have successfully passed!)'
                        : 'ಮುಂದಿನ ಬಾರಿ ಇನ್ನಷ್ಟು ಉತ್ತಮವಾಗಿ ಮಾಡಿ. (Better luck next time.)'}
                </p>

                <button
                    className="btn btn-primary mt-8"
                    onClick={() => window.location.href = '/'}
                    style={{ padding: '0.75rem 3rem', fontSize: '1.1rem', fontWeight: 'bold' }}
                >
                    OK
                </button>
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
        <div className="max-w-4xl mx-auto p-6">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Question {currentQuestion + 1} of {questions.length}</span>
                <div style={{ width: '200px', height: '8px', background: 'var(--border)', borderRadius: '4px' }}>
                    <div className="progress-fill" style={{
                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                        height: '100%',
                        background: 'var(--primary)',
                        borderRadius: '4px',
                        transition: 'width 0.3s ease'
                    }}></div>
                </div>
            </div>

            <motion.div
                key={q.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ padding: '3rem', minHeight: '400px', display: 'flex', flexDirection: 'column', backgroundColor: '#ffffff' }}
            >
                <div style={{ marginBottom: '2.5rem' }}>
                    <span style={{
                        padding: '0.25rem 0.75rem',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase'
                    }}>
                        {q.type} Assessment
                    </span>
                    <h2 style={{ marginTop: '1rem', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>{q.text}</h2>
                </div>

                <div style={{ flex: 1 }}>
                    {q.type === 'MCQ' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            {(q.options || []).map((opt) => (
                                <motion.div
                                    key={opt}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => !feedback && setSelectedOption(opt)}
                                    className="glass-card"
                                    style={{
                                        padding: '1.5rem',
                                        cursor: feedback ? 'default' : 'pointer',
                                        borderColor: selectedOption === opt ? 'var(--primary)' : 'var(--border)',
                                        background: selectedOption === opt ? 'var(--primary-light)' : '#ffffff',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        color: 'var(--text-main)',
                                        fontWeight: 600
                                    }}
                                >
                                    <div style={{
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        border: `2px solid ${selectedOption === opt ? 'var(--primary)' : 'var(--border)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        {selectedOption === opt && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }} />}
                                    </div>
                                    {opt}
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {q.type === 'Text' && !feedback && (
                        <div>
                            <textarea
                                className="glass-card"
                                style={{
                                    width: '100%', padding: '1.5rem', fontSize: '1.1rem',
                                    background: '#f8fafc', color: 'var(--text-main)',
                                    height: '150px', resize: 'none', border: '1px solid var(--border)'
                                }}
                                value={selectedOption || ''}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                placeholder="ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಇಲ್ಲಿ ಬರೆಯಿರಿ (Type your answer here...)"
                                autoFocus
                            />
                        </div>
                    )}

                    {q.type === 'Voice' && !feedback && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <VoiceRecorder onRecordingComplete={setCurrentMedia} />
                        </div>
                    )}

                    {q.type === 'Image' && !feedback && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                            <ImageUpload onImageSelected={setCurrentMedia} />
                        </div>
                    )}

                    {feedback && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card"
                            style={{
                                padding: '2rem',
                                background: feedback === 'correct' ? '#f0fdf4' : '#fef2f2',
                                textAlign: 'center',
                                border: `1px solid ${feedback === 'correct' ? '#bbf7d0' : '#fecaca'}`
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', color: feedback === 'correct' ? '#16a34a' : '#dc2626' }}>
                                {feedback === 'correct' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                                    {feedback === 'correct' ? 'ಸರಿಯಾಗಿದೆ! (Success!)' : 'ತಪ್ಪಾಗಿದೆ (Try Again)'}
                                </span>
                            </div>

                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Your Answer:</p>
                            <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>"{answers[q.id] || selectedOption || 'No input detected'}"</p>

                            {feedback === 'incorrect' && (
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Expected Answer:</p>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>"{q.correct_answer}"</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>

                <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem' }}>
                    {!feedback ? (
                        <button
                            className="btn btn-primary"
                            onClick={handleCheck}
                            disabled={checking || (!selectedOption && !currentMedia)}
                            style={{
                                padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 700,
                                opacity: (selectedOption || currentMedia) ? 1 : 0.5,
                                backgroundColor: 'var(--primary)', color: '#ffffff'
                            }}
                        >
                            {checking ? <Loader2 className="animate-spin" size={24} /> : "Check Answer"}
                        </button>
                    ) : (
                        <button
                            className="btn"
                            onClick={handleNext}
                            style={{
                                padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 700,
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                backgroundColor: currentQuestion + 1 < questions.length ? '#f1f5f9' : '#16a34a',
                                color: currentQuestion + 1 < questions.length ? 'var(--text-main)' : 'white',
                                border: currentQuestion + 1 < questions.length ? '1px solid var(--border)' : 'none'
                            }}
                        >
                            {currentQuestion + 1 < questions.length ? 'Next Question' : 'Submit Assessment'}
                            <ArrowRight size={20} />
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default AssessmentInterface;
