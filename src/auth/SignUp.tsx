// ✅ 新規登録画面（SignUp.tsx）
import React, { useState } from 'react';
import { registerWithEmail } from './authService';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
      setSuccess(true);
      setError(null);
    } catch (err) {
      console.error('❌ 登録失敗:', err);
      setError('登録に失敗しました。');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">新規登録</h2>

        <input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-400 text-sm mb-4">✅ 登録に成功しました！</p>}

        <button
          onClick={handleRegister}
          className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md w-full transition duration-200"
        >
          登録する
        </button>
      </div>
    </div>
  );
};

export default SignUp;