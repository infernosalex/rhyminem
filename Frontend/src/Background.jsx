import style from './Background.module.scss';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router';
// import useFollowPointer from "../../hooks/useFollowPointer";
import useMouse from '@react-hook/mouse-position';

export default function Background() {
	const ref = useRef(document.body);
	const mouse = useMouse(document.body, {
		fps: 15,
		enterDelay: 0,
		leaveDelay: 0
	});

	return (
		<>
			<section className={style.bg}>
				<motion.div
					ref={ref}
					className={style.mask}
					animate={{
						x:
							(mouse.x || window.innerWidth / 2) -
							ref.current.offsetLeft -
							ref.current.offsetWidth / 2,
						y:
							(mouse.y || window.innerHeight / 2) -
							ref.current.offsetTop -
							ref.current.offsetHeight / 2
					}}
					transition={{
						type: 'spring',
						damping: 25,
						stiffness: 300,
						restDelta: 0.001
					}}
				/>
				Rhyminem <br /> Rhyminem <br /> Rhyminem <br /> Rhyminem <br /> Rhyminem{' '}
				<br /> Rhyminem
			</section>
			<Outlet />
		</>
	);
}
