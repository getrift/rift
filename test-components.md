# Test Components for Rift

Copy/paste these into Rift to test the parser and preview.

---

## 1. Pricing Card

```tsx
import { useState } from 'react';
import { Check } from 'lucide-react';

export default function PricingCard() {
  const [isAnnual, setIsAnnual] = useState(true);
  
  const price = isAnnual ? 29 : 39;
  const period = isAnnual ? '/month, billed annually' : '/month';
  
  const features = [
    'Unlimited projects',
    'Priority support',
    'Advanced analytics',
    'Custom integrations',
    'Team collaboration',
  ];

  return (
    <div className="w-80 bg-gradient-to-b from-zinc-900 to-zinc-950 rounded-2xl p-8 border border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <span className="text-zinc-400 text-sm font-medium">Pro Plan</span>
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-2 py-1 rounded ${isAnnual ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            Annual
          </button>
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-2 py-1 rounded ${!isAnnual ? 'bg-white text-black' : 'text-zinc-500'}`}
          >
            Monthly
          </button>
        </div>
      </div>
      
      <div className="mb-6">
        <span className="text-5xl font-bold text-white">${price}</span>
        <span className="text-zinc-500 text-sm">{period}</span>
      </div>
      
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-3 text-zinc-300 text-sm">
            <Check className="w-4 h-4 text-emerald-500" />
            {feature}
          </li>
        ))}
      </ul>
      
      <button className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200 transition-colors">
        Get Started
      </button>
    </div>
  );
}
```

---

## 2. User Profile Card

```tsx
import { MapPin, Calendar, Link2, Twitter } from 'lucide-react';

export default function ProfileCard() {
  return (
    <div className="w-96 bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-violet-500 to-purple-600" />
      
      <div className="px-6 pb-6">
        <div className="relative -mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
            JD
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900">Jane Doe</h2>
        <p className="text-gray-500 text-sm mb-4">Product Designer at Acme Inc.</p>
        
        <p className="text-gray-600 text-sm mb-4">
          Designing digital experiences that people love. Previously at Stripe, Figma, and Linear.
        </p>
        
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            San Francisco
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            Joined Mar 2021
          </span>
        </div>
        
        <div className="flex gap-3">
          <button className="flex-1 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800">
            Follow
          </button>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50">
            <Twitter className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 3. Notification Toast

```tsx
import { useState } from 'react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

export default function Toast() {
  const [visible, setVisible] = useState(true);
  
  if (!visible) {
    return (
      <button 
        onClick={() => setVisible(true)}
        className="px-4 py-2 bg-zinc-800 text-white rounded-lg text-sm"
      >
        Show Toast
      </button>
    );
  }

  return (
    <div className="w-80 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-2xl">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white">Successfully saved!</p>
          <p className="text-sm text-zinc-400 mt-1">
            Your changes have been saved and deployed to production.
          </p>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="flex-shrink-0 text-zinc-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="mt-4 flex gap-2">
        <button className="px-3 py-1.5 text-sm font-medium text-white bg-zinc-800 rounded-lg hover:bg-zinc-700">
          View changes
        </button>
        <button className="px-3 py-1.5 text-sm text-zinc-400 hover:text-white">
          Dismiss
        </button>
      </div>
    </div>
  );
}
```

---

## 4. Stats Dashboard Card

```tsx
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Eye } from 'lucide-react';

export default function StatsCard() {
  const stats = [
    { label: 'Revenue', value: '$45,231', change: '+20.1%', up: true, icon: DollarSign },
    { label: 'Users', value: '2,350', change: '+15.2%', up: true, icon: Users },
    { label: 'Orders', value: '1,247', change: '-4.5%', up: false, icon: ShoppingCart },
    { label: 'Page Views', value: '52.1K', change: '+32.8%', up: true, icon: Eye },
  ];

  return (
    <div className="w-full max-w-2xl bg-zinc-950 rounded-2xl p-6 border border-zinc-800">
      <h2 className="text-lg font-semibold text-white mb-6">Overview</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-400 text-sm">{stat.label}</span>
              <stat.icon className="w-4 h-4 text-zinc-600" />
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-white">{stat.value}</span>
              <span className={`flex items-center gap-1 text-sm ${stat.up ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 5. Command Palette / Search

```tsx
import { useState } from 'react';
import { Search, FileText, Settings, Users, Zap, ArrowRight } from 'lucide-react';

export default function CommandPalette() {
  const [query, setQuery] = useState('');
  
  const commands = [
    { icon: FileText, label: 'Search documentation', shortcut: '/' },
    { icon: Settings, label: 'Open settings', shortcut: 'S' },
    { icon: Users, label: 'Invite team members', shortcut: 'I' },
    { icon: Zap, label: 'Quick actions', shortcut: 'Q' },
  ];
  
  const filtered = commands.filter(cmd => 
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="w-96 bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
        <Search className="w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search commands..."
          className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-zinc-600"
        />
        <kbd className="px-2 py-0.5 text-xs text-zinc-500 bg-zinc-800 rounded">ESC</kbd>
      </div>
      
      <div className="p-2">
        {filtered.map((cmd, i) => (
          <button
            key={i}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-zinc-800 group"
          >
            <cmd.icon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
            <span className="flex-1 text-sm text-zinc-300 group-hover:text-white">{cmd.label}</span>
            <kbd className="px-1.5 py-0.5 text-xs text-zinc-600 bg-zinc-800 rounded group-hover:bg-zinc-700">
              {cmd.shortcut}
            </kbd>
          </button>
        ))}
        
        {filtered.length === 0 && (
          <p className="text-center text-zinc-500 text-sm py-6">No commands found</p>
        )}
      </div>
    </div>
  );
}
```

---

## 6. Feature Section

```tsx
import { Sparkles, Shield, Zap, Globe } from 'lucide-react';

export default function FeatureSection() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Built for speed with optimized rendering and minimal bundle size.',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'Enterprise-grade security with SOC 2 compliance and encryption.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered',
      description: 'Smart suggestions and automations powered by machine learning.',
    },
    {
      icon: Globe,
      title: 'Global CDN',
      description: 'Deploy to the edge with 99.99% uptime guarantee worldwide.',
    },
  ];

  return (
    <div className="w-full max-w-3xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">
          Everything you need to ship faster
        </h2>
        <p className="text-zinc-400 max-w-xl mx-auto">
          Powerful features designed for modern development teams who want to build and deploy without limits.
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        {features.map((feature, i) => (
          <div key={i} className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-zinc-700 transition-colors">
            <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 7. Login Form

```tsx
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-96 bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded border-gray-300" />
            <span className="text-gray-600">Remember me</span>
          </label>
          <a href="#" className="text-gray-900 font-medium hover:underline">Forgot password?</a>
        </div>
        
        <button className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
          Sign in
        </button>
      </div>
      
      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account? <a href="#" className="text-gray-900 font-medium hover:underline">Sign up</a>
      </p>
    </div>
  );
}
```

---

## 8. Testimonial Card

```tsx
import { Star } from 'lucide-react';

export default function TestimonialCard() {
  return (
    <div className="w-96 bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-8 text-white">
      <div className="flex gap-1 mb-6">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
        ))}
      </div>
      
      <blockquote className="text-lg leading-relaxed mb-6">
        "Rift has completely transformed how we design components. What used to take hours now takes minutes. The visual feedback is instant and the export is clean."
      </blockquote>
      
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
          SK
        </div>
        <div>
          <p className="font-semibold">Sarah Kim</p>
          <p className="text-violet-200 text-sm">Lead Designer at Vercel</p>
        </div>
      </div>
    </div>
  );
}
```

---

## 9. Tabs Component

```tsx
import { useState } from 'react';
import { Code, Eye, Settings } from 'lucide-react';

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('preview');
  
  const tabs = [
    { id: 'preview', label: 'Preview', icon: Eye },
    { id: 'code', label: 'Code', icon: Code },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="w-96 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex border-b border-zinc-800">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-white bg-zinc-800 border-b-2 border-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-6">
        {activeTab === 'preview' && (
          <div className="h-32 bg-zinc-800 rounded-lg flex items-center justify-center text-zinc-500">
            Preview content
          </div>
        )}
        {activeTab === 'code' && (
          <pre className="h-32 bg-zinc-800 rounded-lg p-4 text-sm text-emerald-400 font-mono overflow-auto">
            {`export default function Component() {\n  return <div>Hello</div>\n}`}
          </pre>
        )}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-zinc-300 text-sm">Dark mode</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-zinc-300 text-sm">Animations</span>
              <input type="checkbox" defaultChecked className="rounded" />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 10. Alert Banner

```tsx
import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function AlertBanner() {
  const [visible, setVisible] = useState(true);

  if (!visible) {
    return (
      <button 
        onClick={() => setVisible(true)}
        className="px-4 py-2 bg-amber-500 text-black rounded-lg text-sm font-medium"
      >
        Show Alert
      </button>
    );
  }

  return (
    <div className="w-full max-w-xl bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
      <div className="flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
        <div className="flex-1">
          <h4 className="text-amber-500 font-semibold text-sm">Scheduled Maintenance</h4>
          <p className="text-amber-200/80 text-sm mt-1">
            We'll be performing scheduled maintenance on Saturday, Jan 25 from 2:00 AM to 4:00 AM UTC. 
            Some services may be temporarily unavailable.
          </p>
          <div className="mt-3 flex gap-3">
            <button className="text-sm font-medium text-amber-500 hover:text-amber-400">
              Learn more
            </button>
            <button 
              onClick={() => setVisible(false)}
              className="text-sm text-amber-200/60 hover:text-amber-200"
            >
              Dismiss
            </button>
          </div>
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="text-amber-200/60 hover:text-amber-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
```
