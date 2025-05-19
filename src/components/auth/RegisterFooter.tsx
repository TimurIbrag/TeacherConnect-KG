
import React from 'react';
import { Link } from 'react-router-dom';

const RegisterFooter: React.FC = () => {
  return (
    <>
      <div className="text-center text-sm">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-primary hover:underline">
          Войти
        </Link>
      </div>
      <p className="text-xs text-muted-foreground text-center">
        Регистрируясь, вы соглашаетесь с нашими{' '}
        <Link to="/terms" className="text-primary hover:underline">
          Условиями использования
        </Link>{' '}
        и{' '}
        <Link to="/privacy" className="text-primary hover:underline">
          Политикой конфиденциальности
        </Link>
        .
      </p>
    </>
  );
};

export default RegisterFooter;
