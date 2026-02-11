// LOGIC: Assessment Scoring
// 1. MCQ: Exact match between user choice and 'correct_answer'.
// 2. Text: Case-insensitive match or fuzzy matching (can be improved with AI).
// 3. Voice/OCR: In Step 4, these will yield 'transcribedText' or 'extractedText', 
//    which we then compare against the correct answer.

exports.calculateScore = (questions, answers) => {
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(q => {
        totalPoints += q.points;
        const userAnswer = answers[q.id];

        if (!userAnswer) return;

        switch (q.question_type) {
            case 'MCQ':
                if (userAnswer === q.correct_answer) {
                    earnedPoints += q.points;
                }
                break;
            case 'Text':
            case 'Voice': // Voice transcription is treated as text
            case 'Image': // OCR extraction is treated as text
                if (userAnswer.trim().toLowerCase() === q.correct_answer.toLowerCase()) {
                    earnedPoints += q.points;
                }
                break;
            default:
                break;
        }
    });

    const score = Math.round((earnedPoints / totalPoints) * 100);
    return {
        score,
        passed: score >= 80, // Configurable passing criteria
        earnedPoints,
        totalPoints
    };
};
