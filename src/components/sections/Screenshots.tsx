import { AnimatePresence, motion } from "framer-motion";
import { memo, useState, useMemo, useEffect } from "react";
import type { ScreenshotsProps } from "config";
import { areImagesEqual } from "config";
import DeviceToggle from "../ui/DeviceToggle";

function getScreenshotHeight(device: string): string {
	switch (device) {
		case 'iphone':
			return 'min-h-[400px]';
		case 'ipad':
			return 'min-h-[300px]';
		default:
			return 'min-h-[350px]';
	}
}

const Screenshots = ({ images }: ScreenshotsProps) => {
	const availablePlatforms = useMemo(() => {
		const platforms: string[] = [];
		
		if (images.iphone && images.iphone.length > 0) platforms.push('iphone');
		if (images.ipad && images.ipad.length > 0) platforms.push('ipad');
		
		for (const key in images) {
			if (key !== 'iphone' && key !== 'ipad' && 
				images[key] && (images[key] as string[]).length > 0) {
				platforms.push(key);
			}
		}
		
		return platforms;
	}, [images]);

	const [activeDevice, setActiveDevice] = useState<string>(availablePlatforms[0] || "");

	useEffect(() => {
		// Workaround for TypeScript error with includes method
		let deviceExists = false;
		for (let i = 0; i < availablePlatforms.length; i++) {
			if (availablePlatforms[i] === activeDevice) {
				deviceExists = true;
				break;
			}
		}
		
		if (!deviceExists && availablePlatforms.length > 0) {
			setActiveDevice(availablePlatforms[0]);
		}
	}, [availablePlatforms, activeDevice]);

	if (availablePlatforms.length === 0) {
		return null;
	}

	const currentImages = images[activeDevice] || [];

	return (
		<div className="mb-16">
			<div className="mb-6 flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Screenshots</h2>
				<DeviceToggle 
					activeDevice={activeDevice} 
					onToggle={setActiveDevice} 
					availablePlatforms={availablePlatforms} 
				/>
			</div>
			<div
				className={`relative overflow-hidden ${getScreenshotHeight(activeDevice)}`}
			>
				<AnimatePresence mode="wait">
					<motion.div
						key={activeDevice}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3 }}
						className="screenshots-container scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20"
						onAnimationComplete={() => {
							const container = document.querySelector(
								".screenshots-container",
							);
							if (container) container.classList.add("overflow-x-auto");
						}}
						onAnimationStart={() => {
							const container = document.querySelector(
								".screenshots-container",
							);
							if (container) container.classList.remove("overflow-x-auto");
						}}
					>
						<div className="flex gap-6 pb-4">
							{currentImages.map((image, index) => (
								<motion.button
									key={image}
									initial={{ opacity: 0, y: 20 }}
									animate={{
										opacity: 1,
										y: 0,
										transition: { delay: index * 0.1 },
									}}
									exit={{ opacity: 0, y: 20 }}
									type="button"
									onClick={() => window.openLightbox?.(index, activeDevice)}
									className="relative flex-shrink-0 overflow-hidden rounded-xl focus:outline-none"
								>
									<img
										src={image}
										alt={`Screenshot ${index + 1}`}
										className={`rounded-xl border border-white/10 object-cover ${
											activeDevice === "iphone"
												? "aspect-[9/16] w-[260px]"
												: "aspect-[4/3] w-[360px]"
										}`}
										loading="lazy"
									/>
								</motion.button>
							))}
						</div>
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
};

export default memo(Screenshots, areImagesEqual);
