import React, { useState } from 'react';
import { loginAnonymously, loginWithEmail } from './authService';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
      alert('✅ ログイン成功');
      navigate('/calendar');
    } catch (error) {
      alert('❌ ログイン失敗');
      console.error(error);
    }
  };

  const handleAnonymousLogin = async () => {
    try {
      await loginAnonymously();
      alert('✅ 匿名ログイン成功');
      navigate('/calendar');
    } catch (error) {
      alert('❌ 匿名ログイン失敗');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img src="./logo.svg" alt="logo" className="h-12 mb-4" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">サインイン</h2>
        </div>
        <div className="rounded-lg shadow-md bg-white p-6 space-y-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
          <button
            onClick={handleEmailLogin}
            className="w-full bg-black text-white py-2 rounded-md hover:opacity-90 transition"
          >
            ログイン
          </button>
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <button onClick={() => navigate('/signup')} className="hover:underline">
              新規登録
            </button>
            <button onClick={() => navigate('/reset')} className="hover:underline">
              パスワードをお忘れですか？
            </button>
          </div>
          <hr className="my-4" />
          <button
            onClick={handleAnonymousLogin}
            className="w-full border border-gray-400 py-2 rounded-md hover:bg-gray-100 transition"
          >
            匿名で続ける
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
