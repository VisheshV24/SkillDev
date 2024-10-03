import React, { useState } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

const ImageUpload = () => {
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            setImage(file);
            setImagePreviewUrl(URL.createObjectURL(file));
            setResult(''); // Clear previous results when replacing the image
        }
    });
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setResult('Please select an image.');
            return;
        }

        const formData = new FormData();
        formData.append('image', image);

        setLoading(true);

        try {
            const response = await axios.post('/api/analyze', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const detectedItems = response.data.map(item => `${item.label} (${(item.score * 100).toFixed(2)}%)`).join(', ');
            setResult(`Detected: ${detectedItems}`);
        } catch (error) {
            console.error(error);
            setResult('Failed to analyze the image: ' + (error.response ? error.response.data : error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreviewUrl('');
        setResult('');
    };

    const handleReplaceImage = () => {
        setImage(null); // Clear current image
        setImagePreviewUrl(''); // Clear image preview
        setResult(''); // Clear results
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-gray-900 text-white">
            <header className="absolute top-5 left-5 right-5 flex justify-between items-center">
                <h1 className="text-2xl font-bold">ImageDecode</h1>
                <div className="flex space-x-2">
                    <button className="bg-blue-600 text-white py-1 px-3 rounded hover:bg-blue-700 transition">Home</button>
                    <button className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700 transition">About Us</button>
                </div>
            </header>
            <div className="flex-grow flex items-center justify-center">
                <div className="max-w-md w-full p-8 bg-gray-800 rounded-lg shadow-lg transform transition duration-300 hover:shadow-xl">
                    <h1 className="text-3xl font-bold mb-6 text-center">Upload an Image to Analyze</h1>
                    <form onSubmit={handleSubmit} className="flex flex-col">
                        {!image ? (
                            <div 
                                {...getRootProps()} 
                                className={`mb-4 border-dashed border-2 border-gray-600 rounded p-4 transition duration-300 ${isDragActive ? 'bg-gray-700' : 'bg-gray-800'}`}
                            >
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                        <p className="text-gray-400 text-center">Drop the image here ...</p> :
                                        <p className="text-gray-400 text-center">Drag & drop an image here, or click to select one</p>
                                }
                            </div>
                        ) : (
                            <div className="mb-4">
                                <img 
                                    src={imagePreviewUrl} 
                                    alt="Preview" 
                                    className="mb-4 rounded-lg border border-gray-600 transition-transform transform hover:scale-105" 
                                />
                                <div className="flex justify-between">
                                    <button
                                        type="button"
                                        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                                        onClick={handleRemoveImage}
                                    >
                                        Remove Image
                                    </button>
                                    <button
                                        type="button"
                                        className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition duration-300"
                                        onClick={handleReplaceImage}
                                    >
                                        Replace Image
                                    </button>
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            className={`bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={loading}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Image'}
                        </button>
                    </form>
                    <pre className="mt-4 p-4 border rounded bg-gray-700 border-gray-600">{result}</pre>
                </div>
            </div>
            <footer className="text-center py-4 bg-gray-800">
                <p className="text-gray-400">© 2024 ImageDecode. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ImageUpload;
