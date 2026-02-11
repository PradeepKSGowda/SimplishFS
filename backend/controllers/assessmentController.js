const db = require('../config/db');
const scoring = require('../utils/scoring');

exports.getAssessmentByLesson = async (req, res) => {
    const { lessonId } = req.params;

    try {
        const assessmentResult = await db.query('SELECT * FROM assessments WHERE lesson_id = $1', [lessonId]);
        const assessment = assessmentResult.rows[0];

        if (!assessment) {
            return res.status(404).json({ message: 'Assessment not found' });
        }

        const questionsResult = await db.query('SELECT * FROM questions WHERE assessment_id = $1', [assessment.id]);

        res.json({
            assessment,
            questions: questionsResult.rows.map(q => ({
                id: q.id,
                text: q.question_text,
                type: q.question_type,
                options: q.options // Only for MCQ
            }))
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching assessment' });
    }
};

exports.submitAssessment = async (req, res) => {
    const { userId, assessmentId, answers } = req.body; // 'answers' is an object { questionId: answer }

    try {
        // Fetch questions to validate answers
        const questionsResult = await db.query('SELECT * FROM questions WHERE assessment_id = $1', [assessmentId]);
        const questions = questionsResult.rows;

        // Calculate score
        const { score, passed } = scoring.calculateScore(questions, answers);

        // Store result
        const result = await db.query(
            'INSERT INTO assessment_results (user_id, assessment_id, score, passed) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, assessmentId, score, passed]
        );

        // Update user streak (Logic: Simple increment for now)
        await db.query('UPDATE users SET streak_count = streak_count + 1 WHERE id = $1', [userId]);

        res.json({
            message: 'Assessment submitted',
            result: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error submitting assessment' });
    }
};
