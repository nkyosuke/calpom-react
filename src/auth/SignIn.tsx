import React, { useState } from 'react';
import { loginAnonymously, loginWithEmail, registerWithEmail } from './authService';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAnonymousLogin = async () => {
    try {
      await loginAnonymously();
      alert('✅ 匿名ログイン成功');
    } catch (error) {
      console.error('❌ 匿名ログイン失敗:', error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
      alert('✅ メールログイン成功');
    } catch (error) {
      console.error('❌ メールログイン失敗:', error);
    }
  };

  const handleRegister = async () => {
    try {
      await registerWithEmail(email, password);
      alert('✅ 登録成功');
    } catch (error) {
      console.error('❌ 登録失敗:', error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-lg font-bold">ログイン</h2>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full my-2"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full mb-2"
      />
      <button onClick={handleEmailLogin} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
        メールでログイン
      </button>
      <button onClick={handleRegister} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
        新規登録
      </button>
      <button onClick={handleAnonymousLogin} className="bg-gray-500 text-white px-4 py-2 rounded">
        匿名ログイン
      </button>
    </div>
  );
};

export default SignIn;