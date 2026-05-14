import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Ошибка входа');
      }
    } catch (err) {
      setError('Ошибка входа. Проверьте подключение к серверу.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: 'calc(100vh - 90px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: 'linear-gradient(145deg, #0b0a0a 0%, #1a0f0f 100%)'
  };

  const cardStyle = {
    background: '#141111',
    border: '2px solid #6a1e1e',
    borderRadius: '32px',
    padding: '3rem 2.5rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 30px 50px rgba(100, 20, 20, 0.5)'
  };

  const titleStyle = {
    textAlign: 'center',
    color: '#eed4d4',
    marginBottom: '2rem',
    fontSize: '2rem'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.9rem',
    background: '#1f1818',
    border: '2px solid #2f1c1c',
    borderRadius: '12px',
    color: '#f0e6e6',
    fontSize: '1rem',
    marginBottom: '1rem',
    outline: 'none'
  };

  const buttonStyle = {
    width: '100%',
    background: '#831e1e',
    color: '#f0e0e0',
    border: 'none',
    borderRadius: '40px',
    padding: '1rem',
    fontSize: '1.2rem',
    fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: '1rem',
    opacity: loading ? 0.7 : 1
  };

  const errorStyle = {
    background: '#2c1414',
    border: '1px solid #a23b3b',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    color: '#f0c9c9'
  };

  const linkStyle = {
    textAlign: 'center',
    marginTop: '2rem',
    color: '#8f6b6b'
  };

  const linkAnchorStyle = {
    color: '#d47b7b',
    marginLeft: '0.5rem',
    textDecoration: 'none'
  };

  return (
    <>
      
      <main style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={titleStyle}>ВХОД В АККАУНТ</h1>
          
          {error && <div style={errorStyle}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={inputStyle}
              required
            />
            
            <input
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              style={inputStyle}
              required
            />
            
            <button type="submit" style={buttonStyle} disabled={loading}>
              {loading ? 'ВХОД...' : 'ВОЙТИ'}
            </button>
          </form>
          
          <div style={linkStyle}>
            Нет аккаунта?
            <a href="/register" style={linkAnchorStyle}>
              Зарегистрироваться
            </a>
          </div>
        </div>
      </main>
    </>
  );
};

export default Login;