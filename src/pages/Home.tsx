import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';

const DUMMY_ADMIN = {
  username: 'admin',
  password: 'admin@123',
  name: 'Admin User',
  email: 'admin@example.com',
};

const Home = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      username === DUMMY_ADMIN.username &&
      password === DUMMY_ADMIN.password
    ) {
      dispatch(
        setUser({
          id: 'admin-id',
          name: DUMMY_ADMIN.name,
          email: DUMMY_ADMIN.email,
          role: 'admin',
        }),
      );
      setError('');
      // Redirect is handled by useEffect
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-4">
        <h2 className="text-xl font-semibold">Admin Login</h2>
        <input
          type="text"
          placeholder="Username"
          className="input input-bordered w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input input-bordered w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Login
        </button>
      </form>
    </div>
  );
};

export default Home;
