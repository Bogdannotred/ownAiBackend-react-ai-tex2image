import React, { useEffect, useRef, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';
import { useNavigate } from 'react-router-dom';

const images = [
  'https://images.pexels.com/photos/4245826/pexels-photo-4245826.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/39811/pexels-photo-39811.jpeg?w=940&h=650&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/210546/pexels-photo-210546.jpeg?w=940&h=650&auto=compress&cs=tinysrgb',
  'https://images.pexels.com/photos/3244513/pexels-photo-3244513.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
];

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Stare pentru a comuta între login și register
  const [user, setUser] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const blockRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLSpanElement>(null);
  const animationFrame = useRef<number | null>(null);
  const current = useRef({ cx: 0, cy: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!blockRef.current) return;

    const rect = blockRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - blockRef.current.offsetWidth / 2;
    const y = e.clientY - rect.top - blockRef.current.offsetHeight / 2;

    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home");
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/home");
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    const animate = () => {
      current.current.cx += (mousePos.x - current.current.cx) / 12;
      current.current.cy += (mousePos.y - current.current.cy) / 12;

      if (blockRef.current) {
        blockRef.current.style.transform = `scale(1.03) translate(${current.current.cx * 0.05}px, ${current.current.cy * 0.05}px) rotateX(${current.current.cy * 0.05}deg) rotateY(${current.current.cx * 0.05}deg)`;
      }

      if (lightRef.current) {
        lightRef.current.style.background = `radial-gradient(circle at ${mousePos.x + blockRef.current!.offsetWidth / 2}px ${mousePos.y + blockRef.current!.offsetHeight / 2}px, #fff, transparent)`;
      }

      animationFrame.current = requestAnimationFrame(animate);
    };

    animationFrame.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, [mousePos]);

  return (
    <div className="slider">
      <div className="items-group">
        {images.map((img, i) => (
          <div
            key={i}
            className={`item ${i === activeIndex ? 'active' : ''}`}
            id={`slide-${i}`}
          >
            <div
              className="blur"
              style={{ backgroundImage: `url(${img})` }}
            ></div>
            <div
              className="bg"
              style={{ backgroundImage: `url(${img})` }}
            ></div>

            <div
              className="block"
              ref={i === activeIndex ? blockRef : null}
              style={{ backgroundImage: `url(${img})` }}
              onMouseMove={i === activeIndex ? handleMouseMove : undefined}
              onMouseLeave={i === activeIndex ? handleMouseLeave : undefined}
            >
              <span className="circleLight" ref={i === activeIndex ? lightRef : null}></span>
              <div className="text">
                <h3 className="login-title">{isLogin ? 'Login' : 'Register'}</h3>
                <form onSubmit={isLogin ? handleLogin : handleRegister}>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  {!isLogin && (
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  )}
                  <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                {errorMessage && <p className="error">{errorMessage}</p>}
                {user && <p>Welcome, {user.email}!</p>}
                <p className="signup-text">
                     {isLogin ? (
                        <>Don’t have an account? <span onClick={() => setIsLogin(false)} style={{ cursor: 'pointer' }}>Sign up</span></>
                       ) : (
                <>Already have an account? <span onClick={() => setIsLogin(true)} style={{ cursor: 'pointer' }}>Login</span></>
                   )}
                </p>

              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="navigations">
        <ul className="dots">
          {images.map((_, i) => (
            <li
              key={i}
              className={i === activeIndex ? 'active' : ''}
              onClick={() => setActiveIndex(i)}
            ></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Login;
