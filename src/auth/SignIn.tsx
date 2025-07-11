import React, { useState } from "react";
import { loginWithEmail } from "./authService";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailLogin = async () => {
    try {
      await loginWithEmail(email, password);
      navigate("/calendar");
    } catch (error) {
      console.error(error);
    }
  };

  /*const handleAnonymousLogin = async () => {
    try {
      await loginAnonymously();
      navigate("/calendar");
    } catch (error) {
      console.error(error);
    }
  };*/

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <img src="./CalPom.png" alt="logo" className="h-12 mb-4" />
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
            <button
              onClick={() => navigate("/signup")}
              className="hover:underline"
            >
              新規登録
            </button>
            <button
              onClick={() => navigate("/reset")}
              className="hover:underline"
            >
              パスワードをお忘れですか？
            </button>
          </div>
          <hr className="my-4" />
          <p className="text-sm text-center mt-4">
            <Link to="/" className="text-blue-600 hover:underline">
              トップページに戻る
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
