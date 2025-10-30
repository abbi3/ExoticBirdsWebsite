import logoImage from '@assets/og-image.jpg_1761307925834.jpeg';

interface AnimatedLogoProps {
  className?: string;
}

export default function AnimatedLogo({ className = "h-6 w-6 md:h-7 md:w-7" }: AnimatedLogoProps) {
  return (
    <img 
      src={logoImage} 
      alt="Fancy Feathers India Logo" 
      className={`${className} object-contain animate-float rounded-full`}
    />
  );
}
