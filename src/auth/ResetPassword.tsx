import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('パスワードリセット用のメールを送信しました。');
      setError(null);
    } catch (err) {
      console.error('❌ パスワードリセット失敗:', err);
      setError('送信に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">パスワードリセット</h2>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {message && <p className="text-green-400 text-sm mb-4">{message}</p>}

        <button
          onClick={handleReset}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md w-full transition duration-200"
        >
          リセットメール送信
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;