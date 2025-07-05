// SignUp.tsx
import React, { useState } from 'react';
import { registerWithEmail } from './authService';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
      setSuccess(true);
      setError(null);
      setTimeout(() => navigate('/'), 1000); // トップに自動で戻る
    } catch (err) {
      console.error('登録失敗:', err);
      setError('登録に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-2xl text-white font-semibold text-center mb-4">新規登録</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
          className="w-full px-4 py-2 mb-3 text-white bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
          className="w-full px-4 py-2 mb-4 text-white bg-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        />

        {error && <p className="text-sm text-red-400 mb-2">{error}</p>}
        {success && <p className="text-sm text-green-400 mb-2">✅ 登録成功！</p>}

        <button
          onClick={handleRegister}
          className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
        >
          登録する
        </button>

        <button
          onClick={() => navigate('/')}
          className="mt-4 w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md"
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
};

export default SignUp;
