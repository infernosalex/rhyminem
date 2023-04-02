import style from './Poem.module.scss';
import { useRouteLoaderData } from 'react-router';
import { useEffect, useState } from 'react';
import { HiSpeakerWave, HiSpeakerXMark } from 'react-icons/hi2';
import { motion } from 'framer-motion';

let utterance;

export default function Poem() {
	const [playAudio, setPlayAudio] = useState(false);
	const poem = useRouteLoaderData('poem').poem;
	const poemLines = poem.text.split('\n');

	function speak() {
		utterance = new SpeechSynthesisUtterance(poem.text.replace(/\n/g, ' '));
		utterance.lang = 'en-US';
		utterance.rate = 0.8;
		speechSynthesis.speak(utterance);
		setPlayAudio(true);
		utterance.onend = () => {
			setPlayAudio(false);
			utterance = null;
		};
	}

	function stop() {
		speechSynthesis.cancel();
		utterance = null;
		setPlayAudio(false);
	}

	function handleClick() {
		if (utterance) {
			stop();
		} else {
			speak();
		}
	}

	return (
		<div className={style.container}>
			<h1>&#8222;{poem.prompt}&#8220;</h1>
			{playAudio ? (
				<HiSpeakerXMark className={style.speak} onClick={handleClick} />
			) : (
				<HiSpeakerWave className={style.speak} onClick={handleClick} />
			)}
			<div className={style.card}>
				<img src={poem.image} />
				<div className={style.textCont}>
					{poemLines.map((line, index) => (
						<motion.p
							key={index}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: index }}
						>
							{line}
						</motion.p>
					))}
				</div>
				<div className={style.hastag}>
					{poem.hashtags.map((hashtag, index) => (
						<span key={index}>#{hashtag}</span>
					))}
				</div>
			</div>
		</div>
	);
}
