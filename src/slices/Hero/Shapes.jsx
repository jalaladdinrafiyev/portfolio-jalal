'use client';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, Float, Environment } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const Shapes = () => {
	return (
		<div className='row-span-1 row-start-1 -mt-9 aspect-square md:col-span-1 md:col-start-2 md:mt-0'>
			<Canvas
				className='z-0'
				shadows
				gl={{ antialias: false }}
				dpr={[1, 1.5]}
				camera={{ position: [0, 0, 25], fov: 30, near: 1, far: 40 }}>
				<Suspense fallback={null}>
					<Geometries />
					<ContactShadows
						position={[0, -3.5, 0]}
						opacity={0.65}
						scale={40}
						blur={1}
						far={9}
					/>
					<Environment preset='studio' />
				</Suspense>
			</Canvas>
		</div>
	);
};

function Geometries() {
	const geometries = [
		{
			position: [0, 0, 0],
			r: 0.3,
			geometry: new THREE.IcosahedronGeometry(3) // Gem
		},
		{
			position: [1, -0.75, 4],
			r: 0.4,
			geometry: new THREE.CapsuleGeometry(0.5, 1.6, 2, 16) // Pill
		},
		{
			position: [-1.4, 2, -4],
			r: 0.6,
			geometry: new THREE.DodecahedronGeometry(1.5) // Soccer Ball
		},
		{
			position: [-0.8, -0.75, 5],
			r: 0.5,
			geometry: new THREE.TorusGeometry(0.6, 0.25, 16, 32) // Donut
		},
		{
			position: [1.6, 1.6, -4],
			r: 0.7,
			geometry: new THREE.OctahedronGeometry(1.5) // Diamond
		}
	];

	const materials = [
		new THREE.MeshNormalMaterial(),
		new THREE.MeshStandardMaterial({ color: 0xff1493, roughness: 0.0001, metalness: 0.5 }), // Deep Pink
		new THREE.MeshStandardMaterial({ color: 0xff4500, roughness: 0.0001, metalness: 0.5 }), // Orange Red
		new THREE.MeshStandardMaterial({ color: 0x32cd32, roughness: 0.0001, metalness: 0.5 }), // Lime Green
		new THREE.MeshStandardMaterial({ color: 0x800000, roughness: 0.0001, metalness: 0.5 }), // Maroon
		new THREE.MeshStandardMaterial({ color: 0x9932cc, roughness: 0.0001, metalness: 0.5 }), // Dark Orchid
		new THREE.MeshStandardMaterial({ color: 0x4682b4, roughness: 0.0001, metalness: 0.5 }), // Steel Blue
		new THREE.MeshStandardMaterial({ color: 0x8b4513, roughness: 0.0001, metalness: 0.5 }), // SaddleBrown
		new THREE.MeshStandardMaterial({ color: 0xd2691e, roughness: 0.0001, metalness: 0.5 }), // Chocolate
		new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.0001, metalness: 0.5 }), // SeaGreen
		new THREE.MeshStandardMaterial({ color: 0x708090, roughness: 0.0001, metalness: 0.5 }), // SlateGray
		new THREE.MeshStandardMaterial({ color: 0x6a5acd, roughness: 0.0001, metalness: 0.5 }), // SlateBlue
		new THREE.MeshStandardMaterial({ color: 0x87cefa, roughness: 0.0001, metalness: 0.5 }), // LightSkyBlue
		new THREE.MeshStandardMaterial({ color: 0xff69b4, roughness: 0.0001, metalness: 0.5 }), // HotPink
		new THREE.MeshStandardMaterial({ color: 0xf0e68c, roughness: 0.0001, metalness: 0.5 }) // Khaki // White
	];

	const soundEffects = [
		new Audio('/sounds/knock1.ogg'),
		new Audio('/sounds/knock2.ogg'),
		new Audio('/sounds/knock3.ogg')
	];

	return geometries.map(({ position, r, geometry }) => (
		<Geometry
			key={JSON.stringify(position)}
			position={position.map(p => p * 2)}
			soundEffects={soundEffects}
			geometry={geometry}
			materials={materials}
			r={r}
		/>
	));
}

function Geometry({ r, position, geometry, materials, soundEffects }) {
	const meshRef = useRef();

	const [visible, setVisible] = useState(false);

	const startingMaterial = getRandomMaterial();

	function getRandomMaterial() {
		return gsap.utils.random(materials);
	}

	function handleClick(e) {
		const mesh = e.object;

		gsap.utils.random(soundEffects).play();

		gsap.to(mesh.rotation, {
			x: `+=${gsap.utils.random(0, 2)}`,
			y: `+=${gsap.utils.random(0, 2)}`,
			z: `+=${gsap.utils.random(0, 2)}`,
			duration: 1.3,
			ease: 'elastic.out(1, 0.3)',
			yoyo: true
		});

		mesh.material = getRandomMaterial();
	}

	const handlePointerOver = e => {
		document.body.style.cursor = 'pointer';
	};

	const handlePointerOut = e => {
		document.body.style.cursor = 'default';
	};

	useEffect(() => {
		let ctx = gsap.context(() => {
			setVisible(true);
			gsap.from(meshRef.current.scale, {
				duration: 1,
				x: 0,
				y: 0,
				z: 0,
				ease: 'elastic.out(1, 0.3)',
				delay: 0.3
			});
		});

		return () => ctx.revert(); //cleanup
	}, []);

	return (
		<group
			position={position}
			ref={meshRef}>
			<Float
				speed={5 * r}
				rotationIntensity={6 * r}
				floatIntensity={5 * r}>
				<mesh
					geometry={geometry}
					onClick={handleClick}
					onPointerOver={handlePointerOver}
					onPointerOut={handlePointerOut}
					visible={visible}
					material={startingMaterial}
				/>
			</Float>
		</group>
	);
}

export default Shapes;
