import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useRef, type KeyboardEventHandler } from "react";
import { TextField } from "../components/form/TextField.tsx"
import { Button } from "../components/form/Button.tsx"
import CheckIcon from '../components/icons/CheckIcon.tsx';

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [generalError,  setGeneralError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const usernameRef: any = useRef(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const validate = () => {
    let valid: boolean = true;
    
    if (!username.trim()) {
      setUsernameError("Username is required.");
      valid = false;
    }
    
    if (!password) {
      setPasswordError("Password is required.");
      valid = false;
    }

    return valid;
  };

  const handleLogin = () => {
    setGeneralError("");
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      //setGeneralError("Unexpected error.");
      setSuccess(true);
    }, 1800);
  };
  
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") handleLogin();
  };

  return (
    <>
      <div
        className="hz-root flex items-center justify-center min-h-screen bg-[#0f2135]"
        style={{ backgroundImage: "radial-gradient(ellipse at 60% 30%, #1a3a5c 0%, #0f2135 70%)" }}
      >
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(#5ba3d9 1px, transparent 1px), linear-gradient(90deg, #5ba3d9 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative w-[390px] shadow-2xl" style={{ borderRadius: 2, overflow: "hidden" }}>
          <div className="bg-[#1a3a5c] px-8 pt-7 pb-6">
            <h1 className="text-[19px] font-light text-[#f0f4f8] leading-snug mb-1">
              Sign in to workspace
            </h1>
            <p className="text-[11.5px] text-[#5a89aa] tracking-wide">
              POLYMPIADS JUDGE &nbsp;·&nbsp; v0.0.0
            </p>
          </div>

          <div className="bg-white px-8 pt-7 pb-8">
            {success ? (
              <div className="flex flex-col items-center justify-center gap-4 py-6">
                <div className="w-12 h-12 rounded-full bg-[#1a5f9a] flex items-center justify-center">
                  <CheckIcon size={24} />
                </div>
                <p className="text-[13.5px] text-gray-500 text-center leading-relaxed">
                  Authentication successful.<br />Launching workspace...
                </p>
              </div>
            ) : (
              <>
                {/* Username */}
                <div className='mb-[18px]'>
                  <TextField
                    ref={usernameRef}
                    type="text"
                    title="Username"
                    autoComplete="username"
                    placeholder="username or user@domain.com"
                    value={username}
                    error={usernameError}
                    setValue={setUsername}
                    setError={setUsernameError}
                    handleKeyDown={onKeyDown}/>
                </div>
                
                {/* Password */}
                <div className='mb-5'>
                  <TextField
                    type="password"
                    title="Password"
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={password}
                    error={passwordError}
                    setValue={setPassword}
                    setError={setPasswordError}
                    handleKeyDown={onKeyDown}/>
                </div>
                
                {/* Sign In button */}
                <Button
                  onClick={handleLogin}
                  loading={loading}
                  text="Sign in"
                  loadingText="Authenticating..."
                  variant="primary"
                />
                {generalError && (
                  <p className="text-[11.5px] text-red-600 mt-1">{generalError}</p>
                )}
              </>
            )}
          </div>

          {/* ── Footer ── */}
          <div className="bg-gray-50 border-t border-gray-200 px-8 py-3 flex justify-center">
            <span className="text-[10.5px] text-gray-400 tracking-wide">
              © 2026 Polympiads &nbsp;·&nbsp; Contest Control System
            </span>
          </div>
        </div>
      </div>
    </>
  );
}