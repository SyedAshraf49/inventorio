
import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, LucideIcon } from "lucide-react";

// Card Component
interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-card border border-border rounded-lg ${className}`}>
    {children}
  </div>
);

// Form Header Component
interface FormHeaderProps {
  title: string;
  subtitle: string;
}

const FormHeader = ({ title, subtitle }: FormHeaderProps) => (
  <div className="text-center space-y-2">
    <h1 className="text-3xl font-bold tracking-tight text-foreground">
      {title}
    </h1>
    <p className="text-muted-foreground">
      {subtitle}
    </p>
  </div>
);

// Input Field Component
interface InputFieldProps {
  id: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: LucideIcon;
  required?: boolean;
  className?: string;
}

const InputField = ({ 
  id, 
  type, 
  label, 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  required = false,
  className = ""
}: InputFieldProps) => (
  <div className="space-y-2">
    <label 
      htmlFor={id} 
      className="text-sm font-medium text-foreground"
    >
      {label}
    </label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-11 pl-10 pr-3 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ${className}`}
        required={required}
      />
    </div>
  </div>
);

// Password Field Component
interface PasswordFieldProps {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  required?: boolean;
  className?: string;
}

const PasswordField = ({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  showPassword, 
  onTogglePassword, 
  required = false,
  className = ""
}: PasswordFieldProps) => (
  <div className="space-y-2">
    <label 
      htmlFor={id} 
      className="text-sm font-medium text-foreground"
    >
      {label}
    </label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full h-11 pl-10 pr-10 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all duration-300 ${className}`}
        required={required}
      />
      <button
        type="button"
        onClick={onTogglePassword}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-300"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  </div>
);

// Checkbox Component
interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ id, label, checked, onChange }: CheckboxProps) => (
  <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
    <input
      id={id}
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-input text-primary focus:ring-primary focus:ring-offset-background"
    />
    <span className="text-muted-foreground select-none text-sm">{label}</span>
  </label>
);

// Link Component
interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const Link = ({ href, children, className = "" }: LinkProps) => (
  <a
    href={href}
    className={`text-primary hover:opacity-80 font-medium transition-opacity duration-300 ${className}`}
  >
    {children}
  </a>
);

// Button Component
interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "outline";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button = ({ 
  type = "button", 
  variant = "primary", 
  onClick, 
  children, 
  className = "",
  fullWidth = false,
  disabled = false,
}: ButtonProps) => {
  const baseStyles = "h-11 rounded-md font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-lg hover:bg-primary-hover",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline: "border border-border bg-background hover:bg-secondary text-foreground"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
    >
      {children}
    </button>
  );
};

// Animated Blob Component
interface AnimatedBlobProps {
  color: string;
  position: string;
  delay?: string;
}

const AnimatedBlob = ({ color, position, delay = "" }: AnimatedBlobProps) => (
  <div className={`absolute ${position} w-72 h-72 ${color} rounded-full mix-blend-screen filter blur-xl opacity-70 animate-blob ${delay}`} />
);

// Gradient Wave Component
const GradientWave = () => (
  <div className="absolute inset-0 opacity-20">
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 560">
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
          <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path fill="url(#gradient1)" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,218.7C672,235,768,245,864,234.7C960,224,1056,192,1152,186.7C1248,181,1344,203,1392,213.3L1440,224L1440,560L1392,560C1344,560,1248,560,1152,560C1056,560,960,560,864,560C768,560,672,560,576,560C480,560,384,560,288,560C192,560,96,560,48,560L0,560Z" />
    </svg>
  </div>
);

// Icon Badge Component
interface IconBadgeProps {
  icon: React.ReactNode;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}

const IconBadge = ({ icon, size = "md", variant = "light" }: IconBadgeProps) => {
  const sizes = {
    sm: "p-2",
    md: "p-3",
    lg: "p-4"
  };

  const variants = {
    light: "bg-white/10 backdrop-blur-sm text-white",
    dark: "bg-black/10 backdrop-blur-sm text-foreground"
  };

  return (
    <div className={`inline-flex rounded-full ${sizes[size]} ${variants[variant]} mb-4`}>
      {icon}
    </div>
  );
};

// Hero Section Component
interface HeroSectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  showProgress?: boolean;
}

const HeroSection = ({ title, description, icon, showProgress = true }: HeroSectionProps) => (
  <div className="text-center space-y-6 max-w-md">
    {icon && (
      <IconBadge icon={icon} size="md" variant="light" />
    )}
    <h2 className="text-3xl lg:text-4xl font-bold text-white">
      {title}
    </h2>
    <p className="text-lg text-white/80">
      {description}
    </p>
  </div>
);

// Gradient Background Component
interface GradientBackgroundProps {
  children: React.ReactNode;
  variant?: "default" | "dark" | "light";
}

const GradientBackground = ({ children, variant = "dark" }: GradientBackgroundProps) => {
  const variants = {
    default: "bg-gradient-to-br from-background to-secondary",
    dark: "bg-gradient-to-br from-slate-950 via-indigo-800 to-slate-950",
    light: "bg-gradient-to-br from-white via-blue-50 to-purple-50"
  };

  return (
    <div className={`hidden lg:flex flex-1 relative overflow-hidden`}>
      <div className={`absolute inset-0 ${variants[variant]}`} />
      
      <div className="absolute inset-0">
        <AnimatedBlob color="bg-indigo-600/30" position="top-0 -left-4" />
        <AnimatedBlob color="bg-blue-600/30" position="top-0 -right-4" delay="animation-delay-2000" />
        <AnimatedBlob color="bg-indigo-700/30" position="-bottom-8 left-20" delay="animation-delay-4000" />
      </div>

      <GradientWave />
      
      <div className="relative z-10 flex items-center justify-center p-8 lg:p-12 w-full">
        {children}
      </div>
    </div>
  );
};

// Form Footer Component
interface FormFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

const FormFooter = ({ text, linkText, linkHref }: FormFooterProps) => (
  <p className="mt-6 text-center text-sm text-muted-foreground">
    {text}{" "}
    <Link href={linkHref}>
      {linkText}
    </Link>
  </p>
);

interface SignInProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

const SignIn = ({ onLogin }: SignInProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      // Use email as the username for the existing login function
      await onLogin(email, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialClick = (user: string, pass: string) => {
    setEmail(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row w-full">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <FormHeader 
            title="Welcome back"
            subtitle="Sign in to your account to continue"
          />

          <Card className="p-6 sm:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-lg" role="alert">
                  {error}
                </div>
              )}
              <InputField
                id="email"
                type="text"
                label="Username"
                placeholder="admin or staff"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={Mail}
                required
              />

              <PasswordField
                id="password"
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
                required
              />

              <div className="flex items-center justify-between text-sm">
                <Checkbox
                  id="remember"
                  label="Remember me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <Link href="#">Forgot password?</Link>
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 p-4 text-sm text-muted-foreground bg-secondary rounded-lg border border-border">
              <h4 className="font-bold text-foreground mb-2">Login Credentials</h4>
              <p className="mb-3">Click a role to automatically fill.</p>
              <ul className="space-y-2">
                <li 
                  onClick={() => handleCredentialClick('admin', 'admin')} 
                  className="cursor-pointer p-2 rounded-md hover:bg-background transition-colors"
                  aria-label="Fill admin credentials"
                >
                  <p><span className="font-semibold text-foreground">Admin:</span> admin / admin</p>
                </li>
                <li 
                  onClick={() => handleCredentialClick('staff', 'staff')} 
                  className="cursor-pointer p-2 rounded-md hover:bg-background transition-colors"
                  aria-label="Fill staff credentials"
                >
                  <p><span className="font-semibold text-foreground">Staff:</span> staff / staff</p>
                </li>
              </ul>
            </div>

            <FormFooter 
              text="Don't have an account?"
              linkText="Sign up"
              linkHref="#"
            />
          </Card>
        </div>
      </div>

      {/* Right Side - Hero Section with Gradient Background */}
      <GradientBackground variant="dark">
        <HeroSection
          title="Inventorio"
          description="A sleek and efficient system to manage stock items, track availability, and reduce manual errors in inventory handling."
          icon={
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4M4 7l8 4.5 8-4.5M12 12v9" />
            </svg>
          }
          showProgress={false}
        />
      </GradientBackground>
    </div>
  );
};

export default SignIn;
