import { Menu, Settings, User } from 'lucide-react';
import { useAppDispatch } from '../redux/hooks';
import { clearUser } from '../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { persistor } from '../redux/store';

interface Props {
  onMenuClick?: () => void;
}

export default function AdminTopbar({ onMenuClick }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSignout = () => {
    dispatch(clearUser());
    persistor.purge();
    navigate('/');
    console.log('signout');
  };

  return (
    <header className="bg-base-100 shadow border-b border-base-300 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden btn btn-ghost btn-circle btn-sm"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg font-semibold text-base-content">
          Admin Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end">
          <button className="btn btn-ghost btn-circle btn-sm">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-8">
                <span className="text-sm">A</span>
              </div>
            </div>
          </button>
          <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
            <li>
              <a>
                <User size={16} />
                Profile
              </a>
            </li>
            <li>
              <a>
                <Settings size={16} />
                Settings
              </a>
            </li>
            <div className="divider"></div>
            <li>
              <button className="text-error" onClick={handleSignout}>
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
