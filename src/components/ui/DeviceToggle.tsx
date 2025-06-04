import { motion } from "framer-motion";
import { memo, useCallback, useMemo } from "react";
import type { DeviceToggleProps } from "config";

// Helper function to get proper display label for each platform
const getDeviceLabel = (platform: string): string => {
	switch (platform) {
		case 'iphone': return 'iPhone';
		case 'ipad': return 'iPad';
		case 'vision': return 'Vision';
		default: return platform.charAt(0).toUpperCase() + platform.slice(1);
	}
};

const DeviceToggle = ({ activeDevice, onToggle, availablePlatforms }: DeviceToggleProps) => {
	const platformHandlers = useMemo(() => {
		const handlers: Record<string, () => void> = {};
		
		availablePlatforms.forEach(platform => {
			handlers[platform] = () => onToggle(platform);
		});
		
		return handlers;
	}, [availablePlatforms, onToggle]);

	return (
		<div className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] p-1">
			{availablePlatforms.map(platform => (
				<DeviceButton
					key={platform}
					isActive={activeDevice === platform}
					onClick={platformHandlers[platform]}
					label={getDeviceLabel(platform)}
				/>
			))}
		</div>
	);
};

interface DeviceButtonProps {
	isActive: boolean;
	onClick: () => void;
	label: string;
}

const DeviceButton = memo(({ isActive, onClick, label }: DeviceButtonProps) => (
	<motion.button
		type="button"
		onClick={onClick}
		className={`relative rounded-md px-3.5 py-1.5 text-sm transition-colors ${
			isActive ? "text-white" : "text-white/60 hover:text-white"
		}`}
		whileTap={{ scale: 0.95 }}
	>
		{isActive && (
			<motion.div
				layoutId="activeDevice"
				className="absolute inset-0 rounded-md bg-white/10"
				transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
			/>
		)}
		<span className="relative z-10">{label}</span>
	</motion.button>
));

DeviceButton.displayName = "DeviceButton";

export default memo(DeviceToggle);
