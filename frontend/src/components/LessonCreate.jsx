import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { lessonApi } from '../utils/api';

const LessonCreate = ({ onBack }) => {
    const [formData, setFormData] = useState({
        title: '',
        level: 'Basic',
        description: '',
        mediaType: 'video',
        displayOrder: 1
    });
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (file) data.append('media', file);

            await lessonApi.upload(data);
            setStatus('success');
            setMessage('Lesson uploaded successfully!');
            setTimeout(() => {
                setStatus('idle');
                onBack(); // Go back to dashboard after success
            }, 2000);
        } catch (err) {
            console.error(err);
            setStatus('error');
            setMessage('Failed to upload lesson. Check backend console.');
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>ಹೊಸ ಪಾಠ ಸೇರಿಸಿ (Add New Lesson)</h2>
                <button className="btn" onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)' }}>Discard</button>
            </header>

            <motion.form
                onSubmit={handleSubmit}
                className="glass-card"
                style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Title</label>
                    <input
                        className="glass-card"
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(255,255,255,0.05)' }}
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Level</label>
                        <select
                            className="glass-card"
                            style={{ width: '100%', padding: '0.75rem', color: 'black' }}
                            value={formData.level}
                            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        >
                            <option value="Basic">Basic</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                            <option value="Expert">Expert</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Media Type</label>
                        <select
                            className="glass-card"
                            style={{ width: '100%', padding: '0.75rem', color: 'black' }}
                            value={formData.mediaType}
                            onChange={(e) => setFormData({ ...formData, mediaType: e.target.value })}
                        >
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="pdf">PDF</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Description</label>
                    <textarea
                        className="glass-card"
                        style={{ width: '100%', padding: '0.75rem', color: 'white', background: 'rgba(255,255,255,0.05)', height: '100px' }}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Multimedia File</label>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ padding: '0.5rem 0' }}
                    />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="btn btn-primary"
                        type="submit"
                        disabled={status === 'loading'}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                        Save Lesson
                    </button>

                    {status === 'success' && (
                        <div style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={20} /> <span>{message}</span>
                        </div>
                    )}
                    {status === 'error' && (
                        <div style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <XCircle size={20} /> <span>{message}</span>
                        </div>
                    )}
                </div>
            </motion.form>
        </div>
    );
};

export default LessonCreate;
