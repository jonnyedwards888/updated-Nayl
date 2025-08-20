# React Native Best Practices & Performance Techniques

This document outlines the most important techniques and best practices for building high-performance, professional React Native applications.

## 🚀 **1. Eliminating Screen Loading Jolting (CRITICAL)**

### **Problem Description**
When navigating between screens in React Native, content often appears to "jolt" or "jump" from a higher position to the correct position. This creates a poor user experience and makes the app feel unprofessional.

**Symptoms:**
- Content briefly appears higher than intended
- Elements "jump" into place after initial render
- Inconsistent positioning during navigation transitions
- Poor perceived performance

### **Root Cause Analysis**
The jolting is caused by **React Native's SafeAreaView behavior** combined with **navigation transitions**:

1. **SafeAreaView calculates insets AFTER render** - it doesn't know the safe area until after the first paint
2. **Navigation transitions** can cause layout recalculation
3. **Content starts at `top: 0`** (ignoring safe area) then jumps to the correct position
4. **Layout calculation timing** is asynchronous and causes visual shifts

### **The Solution: Absolute Positioning + useSafeAreaInsets**

#### **Step 1: Import useSafeAreaInsets**
```typescript
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MyScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  // ... rest of component
};
```

#### **Step 2: Replace SafeAreaView with View**
```typescript
// ❌ BEFORE (causes jolting)
return (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>...</View>
    <ScrollView style={styles.content}>...</ScrollView>
  </SafeAreaView>
);

// ✅ AFTER (no jolting)
return (
  <View style={styles.container}>
    <View style={[styles.header, { top: insets.top + 20 }]}>...</View>
    <ScrollView style={[styles.content, { top: insets.top + 120 }]}>...</ScrollView>
  </View>
);
```

#### **Step 3: Update Styles to Use Absolute Positioning**
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    zIndex: 10,
  },
  content: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: SPACING.lg,
  },
  contentContainer: {
    paddingBottom: SPACING.lg,
  },
});
```

### **Why This Solution Works**

1. **`useSafeAreaInsets()`** provides safe area dimensions **immediately** (no waiting)
2. **Absolute positioning** ensures content appears in the **exact correct position** from the start
3. **No layout shifts** because positions are calculated before render
4. **No SafeAreaView recalculation** delays

### **Implementation Checklist**

- [ ] Import `useSafeAreaInsets` from `react-native-safe-area-context`
- [ ] Replace `SafeAreaView` with `View`
- [ ] Add `insets` variable to component
- [ ] Apply `position: 'absolute'` to header and content
- [ ] Use `top: insets.top + [offset]` for positioning
- [ ] Add `contentContainerStyle` to ScrollView for bottom padding

---

## 🖼️ **2. Preventing Image Loading Jolting (NEW!)**

### **Problem Description**
Even after fixing layout positioning, images can still cause visual jolting as they load from top to bottom, creating a "sliding down" effect.

**Symptoms:**
- Images appear to "slide down" from the top as they load
- Background images cause content to shift during loading
- Profile pictures and icons cause layout shifts
- Poor perceived performance despite fixed positioning

### **Root Cause Analysis**
Image loading jolting is caused by:

1. **Images start with 0 height** until fully loaded
2. **No fixed dimensions** cause layout recalculation
3. **Fade-in animations** can cause visual shifts
4. **Missing placeholders** don't reserve space

### **The Solution: Fixed Dimensions + Preloading + No Fade**

#### **Step 1: Fixed Image Dimensions**
```typescript
// ❌ BEFORE (causes jolting)
<Image 
  source={require('./mountain-background.webp')}
  style={styles.backgroundImage}
  resizeMode="cover"
/>

// ✅ AFTER (no jolting)
<Image 
  source={require('./mountain-background.webp')}
  style={styles.backgroundImage}
  resizeMode="cover"
  fadeDuration={0} // Disable fade animation
/>
```

```typescript
const styles = StyleSheet.create({
  backgroundImage: {
    width: '100%',
    height: 300, // Fixed height prevents jolting
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
});
```

#### **Step 2: Perfect Placeholder Matching**
```typescript
// Profile image with perfect placeholder matching
{profileImage ? (
  <Image 
    source={{ uri: profileImage }} 
    style={styles.profileImage}
    fadeDuration={0}
  />
) : (
  <View style={styles.profileImagePlaceholder}>
    <Ionicons name="person" size={48} color={COLORS.secondaryText} />
  </View>
)}
```

```typescript
const styles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'transparent',
  },
  profileImagePlaceholder: {
    width: 120, // Exact same dimensions
    height: 120, // Exact same dimensions
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
});
```

#### **Step 3: Image Preloading (SAFER APPROACH)**
```typescript
// ❌ AVOID: Image.prefetch() can cause URL request handler errors
// const criticalImages = [require('./assets/image.webp')];
// criticalImages.forEach((imageSource) => {
//   Image.prefetch(imageSource); // This can cause "No suitable URL request handler" errors
// });

// ✅ SAFER: Use static require statements and proper image sizing
// The static require statements in your components will handle preloading automatically
// Just ensure all images have proper dimensions and fadeDuration={0}
```

### **Alternative Preloading Strategies**

#### **1. Static Require (Recommended)**
```typescript
// In your component, use static require - React Native handles this automatically
<Image 
  source={require('./assets/mountain-background.webp')}
  style={styles.backgroundImage}
  fadeDuration={0}
/>
```

#### **2. Conditional Loading with Placeholders**
```typescript
// Use placeholders that match exact dimensions
{imageLoaded ? (
  <Image 
    source={{ uri: imageUrl }} 
    style={styles.image}
    fadeDuration={0}
  />
) : (
  <View style={styles.imagePlaceholder} />
)}
```

#### **3. Progressive Image Loading**
```typescript
// Load low-res version first, then high-res
const [imageQuality, setImageQuality] = useState('low');

useEffect(() => {
  // Start with low quality
  setImageQuality('low');
  
  // Upgrade to high quality after a delay
  const timer = setTimeout(() => setImageQuality('high'), 100);
  return () => clearTimeout(timer);
}, []);

<Image 
  source={imageQuality === 'high' ? highResImage : lowResImage}
  style={styles.image}
  fadeDuration={0}
/>
```

### **Why This Solution Works**

1. **Fixed dimensions** ensure images occupy their final space immediately
2. **`fadeDuration={0}`** eliminates fade-in animations that cause shifts
3. **Perfect placeholder matching** ensures no size differences
4. **Image preloading** ensures images are ready before display
5. **Absolute positioning** prevents layout recalculation

### **Implementation Checklist**

- [ ] Add `fadeDuration={0}` to all critical images
- [ ] Set fixed `width` and `height` for background images
- [ ] Ensure placeholders match loaded image dimensions exactly
- [ ] Preload critical images in App.tsx
- [ ] Use `resizeMode="cover"` for background images
- [ ] Test on both fast and slow networks

---

## ⚡ **2. Lightning-Fast Data Loading**

### **Problem Description**
Traditional loading patterns show skeletons or spinners, making users wait for data. This creates poor perceived performance.

### **Solution: Immediate Data Display + Background Sync**

#### **Pattern: Local Data First, Database Sync Second**
```typescript
const loadData = useCallback(async () => {
  try {
    // 🚀 LIGHTNING FAST: Show data instantly from memory
    const localData = await service.getLocalData();
    setData(localData);
    
    // 🔄 Background sync (non-blocking, user doesn't wait)
    setTimeout(async () => {
      try {
        const dbData = await service.getDatabaseData();
        setData(dbData);
      } catch (dbError) {
        console.warn('Background sync failed, using local data:', dbError);
      }
    }, 50); // Minimal delay to not block UI
    
  } catch (error) {
    console.error('Error loading data:', error);
  }
}, []);
```

#### **Benefits**
- **Instant visual feedback** - users see content immediately
- **No loading spinners** - eliminates perceived waiting time
- **Background sync** - data updates seamlessly
- **Graceful fallback** - local data if network fails

---

## 🎯 **3. Performance Optimization Techniques**

### **Selective Database Queries**
```typescript
// ❌ BEFORE (inefficient)
const { data } = await supabase
  .from('users')
  .select('*') // Fetches ALL columns

// ✅ AFTER (efficient)
const { data } = await supabase
  .from('users')
  .select('id, name, email, created_at') // Only needed columns
```

### **Database Indexing Strategy**
```sql
-- Single column indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Composite indexes for complex queries
CREATE INDEX IF NOT EXISTS idx_users_user_created ON users(user_id, created_at);

-- Partial indexes for filtered queries
CREATE INDEX IF NOT EXISTS idx_users_active ON users(user_id) 
WHERE is_active = true;
```

### **Database Views for Complex Queries**
```sql
CREATE OR REPLACE VIEW user_dashboard AS
SELECT 
  u.id,
  u.name,
  COUNT(s.id) as total_sessions,
  SUM(s.duration) as total_duration,
  MAX(s.created_at) as last_session
FROM users u
LEFT JOIN sessions s ON u.id = s.user_id
GROUP BY u.id, u.name;
```

---

## 🎨 **4. UI/UX Best Practices**

### **Consistent Spacing System**
```typescript
const SPACING = {
  xs: 4,    // 4px - minimal spacing
  sm: 8,    // 8px - small spacing
  md: 16,   // 16px - medium spacing
  lg: 24,   // 24px - large spacing
  xl: 32,   // 32px - extra large spacing
  xxl: 48,  // 48px - section spacing
  xxxl: 64, // 64px - major section spacing
};
```

### **Typography Scale**
```typescript
const TYPOGRAPHY = {
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  headingSmall: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
  },
  headingMedium: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
  },
  headingLarge: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
  },
  displayLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
  },
};
```

### **Color System**
```typescript
const COLORS = {
  // Primary colors
  primaryBackground: '#0F172A',
  secondaryBackground: '#1E293B',
  
  // Text colors
  primaryText: '#FFFFFF',
  secondaryText: '#94A3B8',
  mutedText: '#64748B',
  
  // Accent colors
  primaryAccent: '#C1FF72',
  secondaryAccent: '#0A4F6B',
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#0EA5E9',
};
```

---

## 🔧 **5. Code Organization & Architecture**

### **Service Layer Pattern**
```typescript
// services/userService.ts
class UserService {
  async getLocalUser(): Promise<User> {
    // Return cached/mock data immediately
  }
  
  async getUserFromDatabase(): Promise<User> {
    // Fetch from Supabase
  }
  
  async updateUser(user: User): Promise<void> {
    // Update both local and database
  }
}

export default new UserService();
```

### **Context Pattern for State Management**
```typescript
// context/UserContext.tsx
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const value = {
    user,
    setUser,
    updateUser: useCallback(async (updates: Partial<User>) => {
      // Implementation
    }, []),
  };
  
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
```

---

## 📱 **6. Mobile-Specific Optimizations**

### **Haptic Feedback**
```typescript
import hapticService, { HapticType, HapticIntensity } from '../services/hapticService';

// Trigger appropriate haptics for user actions
await hapticService.trigger(HapticType.SUCCESS, HapticIntensity.NORMAL);
await hapticService.trigger(HapticType.IMPACT, HapticIntensity.MEDIUM);
```

### **Image Optimization**
```typescript
// Use appropriate image sizes
const iconSizes = {
  small: 24,
  medium: 40,
  large: 80,
  extraLarge: 160,
};

// Pre-load critical images
const preloadImages = () => {
  Image.prefetch(require('../assets/critical-image.webp'));
};
```

### **Animation Performance**
```typescript
// Use native driver for better performance
Animated.timing(animationValue, {
  toValue: 1,
  duration: 300,
  useNativeDriver: true, // ✅ Use native driver
}).start();
```

---

## 🧪 **7. Testing & Quality Assurance**

### **Error Boundaries**
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### **Performance Monitoring**
```typescript
import { PerformanceMeasureView } from '@shopify/react-native-performance';

<PerformanceMeasureView
  screenName="HomeScreen"
  interactive={true}
>
  <HomeScreen />
</PerformanceMeasureView>
```

---

## 📚 **8. Resources & Further Reading**

### **Official Documentation**
- [React Native Performance](https://reactnative.dev/docs/performance)
- [React Native Navigation](https://reactnavigation.org/docs/performance)
- [Expo Performance](https://docs.expo.dev/guides/performance/)

### **Community Resources**
- [React Native Performance Monitor](https://github.com/Shopify/react-native-performance)
- [Flipper for React Native](https://fbflipper.com/)
- [React Native Debugger](https://github.com/jhen0409/react-native-debugger)

---

## 🎯 **Priority Implementation Order**

1. **🔥 HIGH PRIORITY: Fix Screen Jolting** - Implement absolute positioning solution
2. **⚡ HIGH PRIORITY: Lightning-Fast Loading** - Implement local data + background sync
3. **🎨 MEDIUM PRIORITY: Consistent Design System** - Implement spacing, typography, colors
4. **🔧 MEDIUM PRIORITY: Service Layer** - Organize data fetching logic
5. **📱 LOW PRIORITY: Mobile Optimizations** - Add haptics, image optimization
6. **🧪 LOW PRIORITY: Testing & Monitoring** - Add error boundaries, performance monitoring

---

*This document should be updated regularly as new best practices emerge and the React Native ecosystem evolves.*
