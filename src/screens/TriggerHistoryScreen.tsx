import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import { body, h2, caption } from '../constants/typography';
import triggerService, { TriggerStats } from '../services/triggerService';
import { TriggerEntry } from '../lib/supabase';

const { width } = Dimensions.get('window');

const TriggerHistoryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [triggerHistory, setTriggerHistory] = useState<TriggerEntry[]>([]);
  const [stats, setStats] = useState<TriggerStats>({
    totalEpisodes: 0,
    thisWeek: 0,
    mostCommonTime: 'Evening',
    mostCommonTrigger: 'Stress',
    mostCommonTriggerCount: 0,
  });

  // Load trigger history from storage
  useEffect(() => {
    loadTriggerHistory();
  }, []);

  // Refresh data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTriggerHistory();
    }, [])
  );

  const loadTriggerHistory = async () => {
    const history = await triggerService.getTriggerHistory();
    setTriggerHistory(history);
    const stats = triggerService.calculateStats(history);
    setStats(stats);
  };

  const getFilteredHistory = () => {
    return triggerService.getFilteredHistory(triggerHistory, selectedFilter);
  };

  const formatTime = (timestamp: string | Date) => {
    // Handle the case where timestamp might be undefined or null
    if (!timestamp) {
      return 'Unknown time';
    }

    // Convert string timestamp to Date object if needed
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    // Get the time in 12-hour format
    const timeString = date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    
    // If it's today, show just the time
    if (diffInDays === 0) {
      return timeString;
    }
    
    // If it's yesterday, show "Yesterday, time"
    if (diffInDays === 1) {
      return `Yesterday, ${timeString}`;
    }
    
    // If it's within the last 7 days, show "Day, time"
    if (diffInDays < 7) {
      const dayName = date.toLocaleDateString([], { weekday: 'short' });
      return `${dayName}, ${timeString}`;
    }
    
    // For older dates, show "Month Day, time"
    const monthDay = date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric' 
    });
    return `${monthDay}, ${timeString}`;
  };

  // Helper function to capitalize trigger names
  const capitalizeTrigger = (trigger: string): string => {
    return trigger.charAt(0).toUpperCase() + trigger.slice(1).toLowerCase();
  };


  const filters = ['All', 'Stress', 'Anxiety', 'Boredom'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Consistent background gradient */}
      <LinearGradient
        colors={['#0A0A1A', '#1A1A2E', '#16213E']} // Same as main page
        style={styles.backgroundGradient}
      />
      
      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
             {/* Header */}
       <View style={styles.header}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home' as never)}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primaryText} />
        </TouchableOpacity>
         <Text style={styles.headerTitle}>Trigger History</Text>
         <View style={styles.headerSpacer} />
       </View>

                 {/* Most Common Trigger Section */}
         <View style={styles.section}>
           <Text style={styles.sectionLabel}>Most Common Trigger</Text>
           <LinearGradient
             colors={['rgba(59, 130, 246, 0.08)', 'rgba(59, 130, 246, 0.03)', 'rgba(255, 255, 255, 0.01)']}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
             style={styles.triggerCard}
           >
             <View style={styles.mostCommonTrigger}>
               <Text style={styles.triggerEmoji}>{triggerService.getTriggerEmoji(stats.mostCommonTrigger)}</Text>
               <Text style={styles.triggerName}>{capitalizeTrigger(stats.mostCommonTrigger)}</Text>
               <Text style={styles.triggerCount}>{stats.mostCommonTriggerCount}x</Text>
             </View>
             
             <View style={styles.statsRow}>
               <View style={styles.statItem}>
                 <Text style={styles.statNumber}>{stats.totalEpisodes}</Text>
                 <Text style={styles.statLabel}>Total Episodes</Text>
               </View>
               <View style={styles.statItem}>
                 <Text style={styles.statNumber}>{stats.thisWeek}</Text>
                 <Text style={styles.statLabel}>This Week</Text>
               </View>
               <View style={styles.statItem}>
                 <Text style={styles.statNumber}>44%</Text>
                 <Text style={styles.statLabel}>{stats.mostCommonTime}</Text>
               </View>
             </View>
           </LinearGradient>
         </View>

                 {/* Pattern Detected Section */}
         <View style={styles.section}>
           <LinearGradient
             colors={['rgba(59, 130, 246, 0.08)', 'rgba(59, 130, 246, 0.03)', 'rgba(255, 255, 255, 0.01)']}
             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 1 }}
             style={styles.patternCard}
           >
             <View style={styles.patternHeader}>
               <Ionicons name="flash" size={16} color={COLORS.primaryAccent} />
               <Text style={styles.patternTitle}>Pattern Detected</Text>
             </View>
             <Text style={styles.patternText}>
               You tend to bite your nails when{' '}
               <Text style={styles.highlightedText}>stressed</Text> in the{' '}
               <Text style={styles.highlightedText}>evening</Text>, especially between{' '}
               <Text style={styles.highlightedText}>8-10 PM</Text>. Consider a bedtime routine to manage stress.
             </Text>
           </LinearGradient>
         </View>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter.toLowerCase() && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.toLowerCase())}
            >
              <Text 
                style={[
                  styles.filterButtonText,
                  selectedFilter === filter.toLowerCase() && styles.filterButtonTextActive
                ]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Episodes */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Episodes</Text>
                     {getFilteredHistory().map((entry) => (
             <LinearGradient
               key={entry.id}
               colors={['rgba(255, 255, 255, 0.03)', 'rgba(255, 255, 255, 0.01)']}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 0 }}
               style={styles.episodeItem}
             >
               <Text style={styles.episodeEmoji}>{entry.emoji}</Text>
               <View style={styles.episodeContent}>
                 <Text style={styles.episodeTrigger}>{capitalizeTrigger(entry.trigger)}</Text>
                 <Text style={styles.episodeDetails}>
                   {entry.details || 'No details provided'}
                 </Text>
               </View>
                               <Text style={styles.episodeTime}>
                  {formatTime(entry.timestamp)}
                </Text>
             </LinearGradient>
           ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
     backButton: {
     padding: SPACING.sm,
   },
   headerTitle: {
     ...h2,
     color: COLORS.primaryText,
     flex: 1,
     textAlign: 'center',
   },
   headerSpacer: {
     width: 48, // Same width as back button for balance
   },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xxxl,
  },
  sectionLabel: {
    ...caption,
    color: COLORS.primaryAccent,
    marginBottom: SPACING.lg,
    fontWeight: '600',
    fontSize: 13,
    textTransform: 'none',
  },
  triggerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mostCommonTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  triggerEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  triggerName: {
    ...h2,
    color: COLORS.primaryText,
    flex: 1,
    fontWeight: '600',
    fontSize: 18,
  },
  triggerCount: {
    ...h2,
    color: COLORS.primaryBackground,
    backgroundColor: COLORS.destructiveAction,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    ...h2,
    color: COLORS.primaryText,
    marginBottom: SPACING.xs,
    fontWeight: '700',
    fontSize: 20,
  },
  statLabel: {
    ...caption,
    color: COLORS.secondaryText,
    fontWeight: '400',
    fontSize: 12,
  },
  patternCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: SPACING.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  patternTitle: {
    ...h2,
    color: COLORS.primaryText,
    marginLeft: SPACING.sm,
    fontWeight: '600',
    fontSize: 16,
  },
  patternText: {
    ...body,
    color: COLORS.primaryText,
    lineHeight: 24,
  },
  highlightedText: {
    color: COLORS.primaryAccent,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  filterButton: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    flex: 1,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primaryAccent,
    borderColor: COLORS.primaryAccent,
    shadowColor: COLORS.primaryAccent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  filterButtonText: {
    ...body,
    color: COLORS.primaryAccent,
    fontWeight: '500',
    fontSize: 12,
    textAlign: 'center',
  },
  filterButtonTextActive: {
    color: COLORS.primaryBackground,
    fontWeight: '600',
    fontSize: 12,
  },
  episodeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  episodeEmoji: {
    fontSize: 18,
    marginRight: SPACING.md,
  },
  episodeContent: {
    flex: 1,
  },
  episodeTrigger: {
    ...body,
    color: COLORS.primaryText,
    marginBottom: SPACING.xs,
    fontWeight: '600',
    fontSize: 14,
  },
  episodeDetails: {
    ...caption,
    color: COLORS.secondaryText,
    fontWeight: '400',
    fontSize: 12,
  },
  episodeTime: {
    ...caption,
    color: COLORS.primaryText,
    fontWeight: '500',
    fontSize: 12,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default TriggerHistoryScreen; 