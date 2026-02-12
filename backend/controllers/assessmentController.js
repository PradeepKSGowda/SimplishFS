const db = require('../config/db');
const scoring = require('../utils/scoring');
const ocr = require('../utils/ocr');
const transcription = require('../utils/transcription');

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
    // req.body contains JSON if sent via JSON, or strings if sent via FormData
    // If multipart/form-data, req.files will contain uploaded media
    const { userId, assessmentId } = req.body;
    let answers = typeof req.body.answers === 'string' ? JSON.parse(req.body.answers) : req.body.answers;

    try {
        const questionsResult = await db.query('SELECT * FROM questions WHERE assessment_id = $1', [assessmentId]);
        const questions = questionsResult.rows;

        // Step 1: Process any media files (Voice/OCR)
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // The filename/fieldname should contain the questionId
                // Convention: fieldname is 'media_[questionId]'
                const questionId = file.fieldname.split('_')[1];
                const question = questions.find(q => q.id === questionId);

                if (question) {
                    let extractedText = "";
                    if (question.question_type === 'Voice') {
                        extractedText = await transcription.transcribeAudio(file.path);
                    } else if (question.question_type === 'Image') {
                        extractedText = await ocr.extractTextFromImage(file.path);
                    }
                    answers[questionId] = extractedText;
                }
            }
        }

        // Calculate score
        const { score, passed } = scoring.calculateScore(questions, answers);

        // Store result
        const result = await db.query(
            'INSERT INTO assessment_results (user_id, assessment_id, score, passed) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, assessmentId, score, passed]
        );

        // Update user streak
        await db.query('UPDATE users SET streak_count = streak_count + 1 WHERE id = $1', [userId]);

        res.json({
            message: 'Assessment submitted',
            result: result.rows[0],
            processedAnswers: answers
        });
    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ message: 'Error submitting assessment' });
    }
};

exports.processMedia = async (req, res) => {
    const { type } = req.body;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        let extractedText = "";
        if (type === 'Voice') {
            extractedText = await transcription.transcribeAudio(file.path);
        } else if (type === 'Image') {
            extractedText = await ocr.extractTextFromImage(file.path);
        }

        res.json({ text: extractedText });
    } catch (error) {
        console.error("Media Processing Error:", error);
        res.status(500).json({ message: 'Error processing media' });
    }
};
