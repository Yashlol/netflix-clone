import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
} from "react-native";
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const LogoutButton = () => {
  const { setUser } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setUser(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.logoutButton}
      onPress={handleLogout}
    >
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );
};

const MovieDetailScreen = () => {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => <LogoutButton />,
    });
  }, [navigation]);

  // Sample movie data - replace with actual API data later
  const movie = {
    title: "Stranger Things",
    year: "2024",
    duration: "2h 15m",
    rating: "TV-MA",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    genre: ["Sci-Fi", "Horror", "Drama"],
    matchPercentage: 97,
    bannerImage: "https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    thumbnailImage: "https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
  };

  const similarMovies = [
    { id: 1, title: "Dark", image: "https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg" },
    { id: 2, title: "The OA", image: "https://image.tmdb.org/t/p/w500/pq8p1umEnJjdFAP1nB26yfhqtBz.jpg" },
    { id: 3, title: "Black Mirror", image: "https://image.tmdb.org/t/p/w500/7PRddO7z7mcPi21nZTCMGShAyy1.jpg" },
    { id: 4, title: "The Witcher", image: "https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg" },
  ];

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          source={{ uri: movie.bannerImage }}
          style={styles.bannerImage}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={styles.matchText}>{movie.matchPercentage}% Match</Text>
                <Text style={styles.metaText}>{movie.year}</Text>
                <Text style={styles.metaText}>{movie.rating}</Text>
                <Text style={styles.metaText}>{movie.duration}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.playButton}>
          <Ionicons name="play" size={24} color="black" />
          <Text style={styles.playButtonText}>Play</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.myListButton}>
          <Ionicons name="add" size={24} color="white" />
          <Text style={styles.myListButtonText}>My List</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{movie.description}</Text>
        <View style={styles.genreContainer}>
          {movie.genre.map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Similar Content */}
      <View style={styles.similarContent}>
        <Text style={styles.sectionTitle}>More Like This</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {similarMovies.map((similar) => (
            <TouchableOpacity key={similar.id} style={styles.similarItem}>
              <Image
                source={{ uri: similar.image }}
                style={styles.similarImage}
                resizeMode="cover"
              />
              <Text style={styles.similarTitle}>{similar.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  heroSection: {
    height: SCREEN_HEIGHT * 0.5,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    flex: 1,
    background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.9) 100%)',
    justifyContent: 'flex-end',
    padding: theme.spacing.lg,
  },
  movieInfo: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: 'bold',
    marginBottom: theme.spacing.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  matchText: {
    color: theme.colors.success,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  metaText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  playButton: {
    flex: 1,
    backgroundColor: theme.colors.text.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.sm,
  },
  playButtonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  myListButton: {
    flex: 1,
    backgroundColor: theme.colors.background.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    gap: theme.spacing.sm,
  },
  myListButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  descriptionContainer: {
    padding: theme.spacing.lg,
  },
  description: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  genreTag: {
    backgroundColor: theme.colors.background.secondary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  genreText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
  },
  similarContent: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.xl,
    fontWeight: 'bold',
    marginBottom: theme.spacing.lg,
  },
  similarItem: {
    width: 140,
    marginRight: theme.spacing.md,
  },
  similarImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  similarTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
  logoutButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  logoutButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
});

export default MovieDetailScreen;