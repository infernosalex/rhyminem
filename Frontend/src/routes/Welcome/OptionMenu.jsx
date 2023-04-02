import styles from './OptionMenu.module.scss';
import { BsFillGearFill } from 'react-icons/bs';
import { FaLanguage, FaPenNib } from 'react-icons/fa';
import { VscWholeWord } from 'react-icons/vsc';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function OptionMenu(props) {
	const [selectedMenu, setSelectedMenu] = useState(0);
	function handleMenuSelect(number) {
		if (selectedMenu === number) {
			setSelectedMenu(0);
		} else {
			setSelectedMenu(number);
		}
	}

	return (
		<>
			<motion.div
				className={styles.card}
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 50 }}
			>
				<div className={styles.option} onClick={() => handleMenuSelect(1)}>
					<FaLanguage />
					{selectedMenu !== 1 && <p />}
					{selectedMenu === 1 && (
						<LanguageMenu
							options={props.options}
							setOptions={props.setOptions}
						/>
					)}
				</div>
				<div className={styles.option} onClick={() => handleMenuSelect(2)}>
					<FaPenNib />
					{selectedMenu !== 2 && <p />}
					{selectedMenu === 2 && (
						<StyleMenu options={props.options} setOptions={props.setOptions} />
					)}
				</div>
				<div
					className={`${styles.option} ${
						props.options.style === 'haiku' ? styles.disabled : ''
					}`}
					onClick={() => handleMenuSelect(3)}
				>
					<VscWholeWord />
					{selectedMenu !== 3 && <p />}
					{selectedMenu === 3 && (
						<CustomizationMenu
							options={props.options}
							setOptions={props.setOptions}
						/>
					)}
				</div>
				<div className={styles.option} onClick={() => handleMenuSelect(4)}>
					<BsFillGearFill />
					{selectedMenu !== 4 && <p />}
					{selectedMenu === 4 && (
						<AdvancedMenu
							options={props.options}
							setOptions={props.setOptions}
						/>
					)}
				</div>
			</motion.div>
		</>
	);
}

function LanguageMenu({ options, setOptions }) {
	const [language, setLanguage] = useState(options.language);

	useEffect(() => {
		setOptions({ ...options, language });
	}, [language]);

	return (
		<div className={styles.menu}>
			<button
				className={`${styles.menuItem} ${
					language === 'en' ? styles.active : ''
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setLanguage('en');
				}}
			>
				<p>English</p>
			</button>
			<button
				className={`${styles.menuItem} ${
					language === 'ro' ? styles.active : ''
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setLanguage('ro');
				}}
			>
				<p>Romanian</p>
			</button>
		</div>
	);
}

function StyleMenu({ options, setOptions }) {
	const [style, setStyle] = useState(options.style);

	useEffect(() => {
		setOptions({ ...options, style });
	}, [style]);

	return (
		<div className={styles.menu}>
			<button
				className={`${styles.menuItem} ${
					style === 'default' ? styles.active : ''
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setStyle('default');
				}}
			>
				<p>Default</p>
			</button>
			<button
				className={`${styles.menuItem} ${
					style === 'haiku' ? styles.active : ''
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setStyle('haiku');
				}}
			>
				<p>Haiku</p>
			</button>
			<button
				className={`${styles.menuItem} ${
					style === 'acrostic' ? styles.active : ''
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setStyle('acrostic');
				}}
			>
				<p>Acrostic</p>
			</button>
			<button
				className={`${styles.menuItem} ${
					style === 'freeverse' ? styles.active : ''
				}`}
				onClick={(e) => {
					e.stopPropagation();
					setStyle('freeverse');
				}}
			>
				<p>Free Verse</p>
			</button>
		</div>
	);
}

function CustomizationMenu({ options, setOptions }) {
	const [lines, setLines] = useState(options.lines);
	const [word, setWord] = useState(options.word || 'rhyminem');

	useEffect(() => {
		setOptions({ ...options, lines, word });
	}, [lines, word]);

	let customizationOptions = [];
	switch (options.style) {
		case 'default':
			customizationOptions = [
				<p
					key="defaultRangeTitle"
					className={styles.noLines}
					style={{
						paddingBottom: '0.5rem'
					}}
				>
					Number of lines: {lines}
				</p>,
				<input
					type="range"
					min="2"
					max="20"
					key="defaultRange"
					value={lines}
					onChange={(e) => {
						setLines(e.target.value);
						setOptions({ ...options, lines: e.target.value });
					}}
					className={styles.rangeInput}
				/>
			];
			break;
		case 'acrostic':
			customizationOptions = [
				<p
					key="acrosticWordTitle"
					className={styles.noLines}
					style={{
						paddingBottom: '0.5rem'
					}}
				>
					Word
				</p>,
				<input
					type="text"
					key="acrosticWord"
					value={word}
					onChange={(e) => {
						setWord(e.target.value);
						setOptions({ ...options, word: e.target.value });
					}}
					className={styles.textInput}
				/>
			];
			break;
		case 'freeverse':
			customizationOptions = [
				<p
					key="freeverseRangeTitle"
					className={styles.noLines}
					style={{
						paddingBottom: '0.5rem'
					}}
				>
					Number of lines
				</p>,
				<input
					type="range"
					min="2"
					max="20"
					key="freeverseRange"
					className={styles.rangeInput}
				/>
			];
			break;
	}

	return (
		<div
			className={styles.menu}
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			{customizationOptions}
		</div>
	);
}

function AdvancedMenu({ options, setOptions }) {
	const [model, setModel] = useState(options.model);
	const [temperature, setTemperature] = useState(options.temperature);
	const [frequencyPenalty, setFrequencyPenalty] = useState(
		options.frequencyPenalty
	);

	return (
		<div
			className={styles.menu}
			onClick={(e) => {
				e.stopPropagation();
			}}
		>
			{' '}
			<span>GPT 3.5</span>
			<label className={styles.switch}>
				<input
					type="checkbox"
					value={model}
					onChange={(e) => {
						setModel(e.target.checked);
						setOptions({ ...options, model: e.target.checked });
					}}
				/>
				<span className={`${styles.slider} ${styles.round}`}></span>
			</label>
			<span>GPT 4</span>
			<p
				className={styles.noLines}
				style={{
					paddingBottom: '0.5rem'
				}}
			>
				Temperture: {temperature}
			</p>
			<input
				type="range"
				min="0"
				max="2"
				step="0.1"
				className={styles.rangeInput}
				value={temperature}
				onChange={(e) => {
					setTemperature(e.target.value);
					setOptions({ ...options, temperature: e.target.value });
				}}
			/>
			<p
				className={styles.noLines}
				style={{
					paddingBottom: '0.5rem'
				}}
			>
				Frequency panelty: {frequencyPenalty}
			</p>
			<input
				type="range"
				min="-2"
				max="2"
				step="0.1"
				className={styles.rangeInput}
				value={frequencyPenalty}
				onChange={(e) => {
					setFrequencyPenalty(e.target.value);
					setOptions({ ...options, frequencyPenalty: e.target.value });
				}}
			/>
		</div>
	);
}
