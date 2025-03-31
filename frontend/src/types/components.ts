// Common component props and types

// Button variants and sizes
export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';
export type ButtonSize = 'small' | 'medium' | 'large';

// Card variants and elevations
export type CardVariant = 'default' | 'gradient' | 'frosted';
export type CardElevation = 'low' | 'medium' | 'high';

// Input types
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';

// Form field types
export type FormFieldType = InputType | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';

// Modal sizes
export type ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';

// Typography variants
export type TypographyVariant = 
  | 'h1' 
  | 'h2' 
  | 'h3' 
  | 'h4' 
  | 'h5' 
  | 'h6' 
  | 'body1' 
  | 'body2' 
  | 'subtitle1' 
  | 'subtitle2' 
  | 'caption' 
  | 'button' 
  | 'overline';

// Button props interface
export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}

// Input props interface
export interface InputProps {
  type?: InputType;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  error?: boolean;
  errorMessage?: string;
  autoComplete?: string;
  maxLength?: number;
  minLength?: number;
  pattern?: string;
  className?: string;
}

// Typography props interface
export interface TypographyProps {
  variant?: TypographyVariant;
  color?: 'primary' | 'secondary' | 'textPrimary' | 'textSecondary' | 'error';
  align?: 'left' | 'center' | 'right';
  gutterBottom?: boolean;
  noWrap?: boolean;
  paragraph?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Form field props interface
export interface FormFieldProps {
  label?: string;
  type?: FormFieldType;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  error?: boolean;
  errorMessage?: string;
  options?: Array<{ value: string | number; label: string }>;
  className?: string;
}

// Card props interface
export interface CardProps {
  title?: string;
  subtitle?: string;
  elevation?: CardElevation;
  variant?: CardVariant;
  animate?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

// Modal props interface
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  showCloseButton?: boolean;
  closeOnClickOutside?: boolean;
  closeOnEsc?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Animation props for Framer Motion
export interface AnimationProps {
  initial?: any;
  animate?: any;
  exit?: any;
  transition?: any;
  variants?: any;
  whileHover?: any;
  whileTap?: any;
  whileFocus?: any;
  whileDrag?: any;
  drag?: boolean | 'x' | 'y';
  dragConstraints?: any;
  dragElastic?: number;
  dragMomentum?: boolean;
}

// Video background props
export interface VideoBackgroundProps {
  type?: 'particles' | 'waves' | 'gradient';
  intensity?: number;
  colorScheme?: 'theme' | 'custom';
  customColors?: string[];
  disabled?: boolean;
}

// Sentiment gauge props
export interface SentimentGaugeProps {
  positive: number;
  negative: number;
  neutral: number;
  mixed: number;
}

// Key phrase cloud props
export interface KeyPhraseCloudProps {
  keyPhrases: Array<{ text: string; score: number }>;
}