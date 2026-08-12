import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { App } from './App.tsx';
import { store } from './redux/store.ts';
import './index.css';

const container = document.getElementById('root');
if (container) {
    createRoot(container).render(
        <Provider store={store}>
            <App />
        </Provider>
    );
}
