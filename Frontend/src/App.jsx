import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import WelcomePage from './routes/Welcome/WelcomePage';
import PoemPage from './routes/Poem/Poem';
import Background from './Background';
import axios from 'axios';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Background />,
		children: [
			{
				path: '',
				element: <WelcomePage />
			},
			{
				path: '/poem/:id',
				element: <PoemPage />,
				id: 'poem',
				loader: async ({ params }) => {
					const { id } = params;
					const poem = await axios.get(`/api/generate/${id}`);
					return {
						poem: poem.data
					};
				}
			}
		]
	}
]);

export default function App() {
	return <RouterProvider router={router} />;
}
