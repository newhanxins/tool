import './index.css';
import Popup from './popup.jsx';
import { createRoot } from 'react-dom/client';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<Popup />);
}
