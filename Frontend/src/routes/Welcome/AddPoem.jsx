import styles from './AddPoem.module.scss';

export default function AddPoem() {
	return (
		<div className={styles.container}>
			<div style={{ width: '40%', textAlign: 'center' }}>
				<span>Theme / keywords</span>
			</div>
			<div
				style={{
					width: '20%',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				<label className={styles.switch}>
					<input type="checkbox" />
					<span className={`${styles.slider} ${styles.round}`}></span>
				</label>
			</div>
			<div style={{ width: '40%', textAlign: 'center' }}>
				<span>Poem</span>
			</div>
		</div>
	);
}
