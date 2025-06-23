import React, { useState } from 'react';
import { loginAnonymously, loginWithEmail, registerWithEmail } from './authService';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAnonymousLogin = async () => {
    try {
      await loginAnonymously();
    } catch (error) {
      console.error('❌ 匿名ログイン失敗:', error);
      setError('匿名ログインに失敗しました');
    }
  };

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
    } catch (error) {
      console.error('❌ メールログイン失敗:', error);
      setError('メールログインに失敗しました');
    }
  };

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
    } catch (error) {
      console.error('❌ 登録失敗:', error);
      setError('登録に失敗しました');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">カレンダーにログイン</h2>

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

        <div className="flex flex-col gap-2">
          <button
            onClick={handleEmailLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition duration-200"
          >
            メールでログイン
          </button>
          <button
            onClick={handleRegister}
            className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-md transition duration-200"
          >
            新規登録
          </button>
          <button
            onClick={handleAnonymousLogin}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 rounded-md transition duration-200"
          >
            匿名ログイン
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;