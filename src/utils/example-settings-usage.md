# Global Settings Usage Guide

The settings are now globally accessible throughout your application! Here's how to use them:

## 🚀 Quick Usage

### In any component:

```tsx
"use client"

import { useSettings } from '@/hooks/useSettings';

export default function MyComponent() {
  const { settings, loading, error, updateSettings } = useSettings();

  if (loading) return <div>Loading settings...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>{settings?.siteName}</h1>
      <p>{settings?.siteDescription}</p>
      <p>Contact: {settings?.contactEmail}</p>
      <p>Phone: {settings?.contactPhone}</p>
      <p>Currency: {settings?.currency}</p>
    </div>
  );
}
```

## 📋 Available Settings

### General Settings
- `siteName` - Your website name
- `siteDescription` - Website description
- `contactEmail` - Contact email address
- `contactPhone` - Contact phone number
- `address` - Business address
- `currency` - Currency symbol (₦, $, €, etc.)
- `propertiesPerPage` - Number of properties per page

### Feature Toggles
- `enableRegistration` - Enable/disable user registration
- `enableFavorites` - Enable/disable favorites feature
- `maintenanceMode` - Put site in maintenance mode

### Social Media
- `facebookUrl`, `twitterUrl`, `instagramUrl`, `linkedinUrl`, `youtubeUrl`

### SEO Settings
- `metaTitle` - Default page title
- `metaDescription` - Default meta description
- `googleAnalyticsId` - Google Analytics tracking ID

## 🎨 Real Examples

### 1. Dynamic Site Header
```tsx
export default function Header() {
  const { settings } = useSettings();
  
  return (
    <header>
      <h1>{settings?.siteName || 'Default Site Name'}</h1>
      <nav>
        <a href={`tel:${settings?.contactPhone}`}>
          {settings?.contactPhone}
        </a>
        <a href={`mailto:${settings?.contactEmail}`}>
          {settings?.contactEmail}
        </a>
      </nav>
    </header>
  );
}
```

### 2. Currency Display
```tsx
export default function PropertyPrice({ price }: { price: number }) {
  const { settings } = useSettings();
  
  return (
    <div className="price">
      {settings?.currency || '₦'}{price.toLocaleString()}
    </div>
  );
}
```

### 3. Maintenance Mode
```tsx
export default function MaintenanceCheck({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  
  if (settings?.maintenanceMode) {
    return (
      <div className="maintenance-page">
        <h1>Site Under Maintenance</h1>
        <p>We'll be back soon!</p>
      </div>
    );
  }
  
  return <>{children}</>;
}
```

### 4. Feature Toggles
```tsx
export default function AuthButtons() {
  const { settings } = useSettings();
  
  return (
    <div>
      {settings?.enableRegistration && (
        <button>Register</button>
      )}
      <button>Login</button>
    </div>
  );
}
```

### 5. SEO Meta Tags
```tsx
export default function SeoHead() {
  const { settings } = useSettings();
  
  return (
    <Head>
      <title>{settings?.metaTitle || 'Default Title'}</title>
      <meta name="description" content={settings?.metaDescription} />
      {settings?.googleAnalyticsId && (
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${settings.googleAnalyticsId}`} />
      )}
    </Head>
  );
}
```

## 🔧 Update Settings

You can update settings programmatically:

```tsx
const { updateSettings } = useSettings();

const handleUpdate = async () => {
  const success = await updateSettings({
    siteName: 'New Site Name',
    maintenanceMode: true,
  });
  
  if (success) {
    console.log('Settings updated successfully!');
  }
};
```

## 🌍 Global Access

Settings are available in:
- ✅ All frontend pages
- ✅ All admin pages  
- ✅ All components
- ✅ Layouts
- ✅ API routes (via service functions)

## 📝 Notes

- Settings auto-load on app start
- Changes are persisted to database
- Default values are used if settings don't exist
- Loading states are handled automatically
- Type-safe with TypeScript
