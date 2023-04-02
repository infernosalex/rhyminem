import style from './WelcomePage.module.scss';
import PromptInput from './PromptInput';
import Header from './Header';
import OptionsToggle from './OptionsToggle';
import WelcomeFooter from './WelcomeFooter';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsGearFill } from 'react-icons/bs';

export default function WelcomePage() {
	const navigate = useNavigate();
	const [options, setOptions] = useState({
		language: 'en',
		style: 'default',
		lines: 8,
		word: '',
		temperature: 0.7,
		frequencyPenalty: 0.0,
		model: 0
	});

	const [prompt, setPrompt] = useState('');
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e) {
		setLoading(true);
		e.preventDefault();
		const response = await axios.post('/api/generate', {
			userPrompt: prompt,
			lines: options.lines,
			word: options.word,
			language: options.language,
			model: options.model,
			style: options.style,
			temperature: options.temperature,
			frequencyPenalty: options.frequencyPenalty
		});
		console.log(response.data);
		navigate(`/poem/${response.data.id}`);
	}

	return (
		<div className={style.container}>
			{loading && <LoadingScreen />}
			<div className={style.content}>
				<Header />
				<div className={style.prompt}>
					<h2>Enter your prompt</h2>
					<form className={style.formPrompt} onSubmit={handleSubmit}>
						<PromptInput prompt={prompt} setPrompt={setPrompt} />
					</form>
					<OptionsToggle options={options} setOptions={setOptions} />
				</div>
				<WelcomeFooter />
			</div>
		</div>
	);
}

function LoadingScreen() {
	return (
		<div className={style.loadingScreen}>
			<div className={style.loadingScreenContent}>
				<h1>Generating your poem...</h1>
				<div className={style.loadingScreenSpinner}>
					<BsGearFill />
				</div>
			</div>
		</div>
	);
}
