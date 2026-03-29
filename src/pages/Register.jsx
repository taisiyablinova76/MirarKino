import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!agreement) {
      setError('Необходимо принять условия использования');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }

    try {
      const response = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        setSuccess('Регистрация прошла успешно! Перенаправляем...');
        
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        setError(response.error || 'Ошибка при регистрации');
      }
    } catch (err) {
      setError(err.error || 'Ошибка при регистрации');
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
    maxWidth: '480px'
  };

  const inputStyle = {
    width: '100%',
    padding: '0.9rem',
    background: '#1f1818',
    border: '2px solid #2f1c1c',
    borderRadius: '12px',
    color: '#f0e6e6',
    fontSize: '1rem',
    marginBottom: '1rem'
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
    cursor: 'pointer',
    marginTop: '1rem'
  };

  const errorStyle = {
    background: '#2c1414',
    border: '1px solid #a23b3b',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    color: '#f0c9c9'
  };

  const successStyle = {
    background: '#1a2c14',
    border: '1px solid #3ba23b',
    padding: '0.8rem',
    marginBottom: '1rem',
    borderRadius: '8px',
    color: '#c9f0c9'
  };

  return (
    <>
      <Header />
      <main style={containerStyle}>
        <div style={cardStyle}>
          <h1 style={{ textAlign: 'center', color: '#eed4d4', marginBottom: '2rem' }}>СОЗДАТЬ АККАУНТ</h1>
          
          {error && <div style={errorStyle}>{error}</div>}
          {success && <div style={successStyle}>{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              style={inputStyle}
              required
            />
            
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
            
            <input
              type="password"
              placeholder="Подтверждение пароля"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              style={inputStyle}
              required
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="agreement"
                checked={agreement}
                onChange={(e) => setAgreement(e.target.checked)}
                style={{ width: '18px', height: '18px' }}
                required
              />
              <label htmlFor="agreement" style={{ color: '#c9b0b0', fontSize: '0.9rem' }}>
                Я принимаю условия использования
              </label>
            </div>
            
            <button type="submit" style={buttonStyle}>
              ЗАРЕГИСТРИРОВАТЬСЯ
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default Register;