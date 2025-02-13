import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
  ActivityIndicator,
  Linking,
  Alert,
} from "react-native";
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { movieService } from '../services/movie';
import { watchlistService } from '../services/watchlist';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NetflixLogo } from '../components/shared/NetflixLogo';

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

const HeaderLeft = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerLeftContainer}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={28} color={theme.colors.text.primary} />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <NetflixLogo style={styles.headerLogo} />
      </TouchableOpacity>
    </View>
  );
};

const MovieDetailScreen = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);

  // Use a default movieId for testing if none is provided
  const movieId = route?.params?.movieId || 550;

  const fetchWatchlistMovies = async () => {
    try {
      if (!user) return;
      
      console.log('Fetching watchlist for user:', user.id);
      const watchlist = await watchlistService.getWatchlist(user.id, user.id);
      console.log('Watchlist items:', watchlist);
      
      const moviePromises = watchlist.map(item => 
        movieService.getMovieDetails(item.movie_id)
      );
      const movies = await Promise.all(moviePromises);
      console.log('Watchlist movies details:', movies);
      setWatchlistMovies(movies);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        console.log('Fetching movie data for ID:', movieId);
        const [movieData, similarMoviesData] = await Promise.all([
          movieService.getMovieDetails(movieId),
          movieService.getSimilarMovies(movieId)
        ]);
        
        setMovie(movieData);
        setSimilarMovies(similarMoviesData.slice(0, 10));

        // Check if movie is in watchlist
        if (user) {
          console.log('Checking if movie is in watchlist');
          const inWatchlist = await watchlistService.isInWatchlist(
            user.id,
            user.id,
            movieId
          );
          console.log('Is movie in watchlist:', inWatchlist);
          setIsInWatchlist(inWatchlist);
          // Fetch watchlist movies
          await fetchWatchlistMovies();
        }
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, user]);

  const handlePlayTrailer = async () => {
    try {
      const trailerUrl = await movieService.getMovieTrailer(movieId);
      if (trailerUrl) {
        await Linking.openURL(trailerUrl);
      } else {
        Alert.alert('Error', 'No trailer available for this movie');
      }
    } catch (error) {
      console.error('Error playing trailer:', error);
      Alert.alert('Error', 'Failed to play trailer');
    }
  };

  const handleWatchlist = async () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to use the watchlist feature');
      return;
    }

    try {
      setWatchlistLoading(true);
      if (isInWatchlist) {
        await watchlistService.removeFromWatchlist(
          user.id,
          user.id,
          movieId
        );
        setIsInWatchlist(false);
        // Remove movie from watchlist movies
        setWatchlistMovies(prev => prev.filter(m => m.id !== movieId));
        Alert.alert('Success', 'Movie removed from watchlist');
      } else {
        await watchlistService.addToWatchlist(
          user.id,
          user.id,
          movieId
        );
        setIsInWatchlist(true);
        // Add current movie to watchlist movies
        if (movie) {
          setWatchlistMovies(prev => [...prev, movie]);
        }
        Alert.alert('Success', 'Movie added to watchlist');
      }
      // Refresh watchlist after adding/removing
      await fetchWatchlistMovies();
    } catch (error) {
      console.error('Error updating watchlist:', error);
      Alert.alert('Error', 'Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

  // Add this function to refresh the watchlist
  const refreshWatchlist = async () => {
    if (!user) return;
    try {
      await fetchWatchlistMovies();
    } catch (error) {
      console.error('Error refreshing watchlist:', error);
    }
  };

  // Add useEffect to refresh watchlist when the screen comes into focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refreshWatchlist();
    });

    return unsubscribe;
  }, [navigation, user]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => <HeaderLeft />,
      headerRight: () => <LogoutButton />,
      headerTitle: () => null,
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!movie) return null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = 'TV-MA'; // You might want to fetch this from a different API
  const duration = '2h 15m'; // You might want to fetch this from a different API
  const matchPercentage = Math.round(movie.vote_average * 10);

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          source={{ uri: movie.backdrop_path }}
          style={styles.bannerImage}
          resizeMode="cover"
        >
          <View style={styles.bannerOverlay}>
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={styles.matchText}>{matchPercentage}% Match</Text>
                <Text style={styles.metaText}>{releaseYear}</Text>
                <Text style={styles.metaText}>{rating}</Text>
                <Text style={styles.metaText}>{duration}</Text>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handlePlayTrailer}
        >
          <Ionicons name="play" size={24} color="black" />
          <Text style={styles.playButtonText}>Play Trailer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.myListButton}
          onPress={handleWatchlist}
          disabled={watchlistLoading}
        >
          <Ionicons 
            name={isInWatchlist ? "checkmark" : "add"} 
            size={24} 
            color="white" 
          />
          <Text style={styles.myListButtonText}>
            {watchlistLoading ? 'Loading...' : isInWatchlist ? 'Remove' : 'My List'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{movie.overview}</Text>
      </View>

      {/* My List Section */}
      <View style={styles.similarContent}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My List</Text>
          <TouchableOpacity onPress={refreshWatchlist}>
            <Ionicons name="refresh" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        </View>
        {watchlistMovies.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {watchlistMovies.map((watchlistMovie) => (
              <TouchableOpacity 
                key={watchlistMovie.id} 
                style={styles.similarItem}
                onPress={() => {
                  navigation.push('MovieDetail', { movieId: watchlistMovie.id });
                }}
              >
                <Image
                  source={{ uri: watchlistMovie.poster_path }}
                  style={styles.similarImage}
                  resizeMode="cover"
                />
                <Text style={styles.similarTitle}>{watchlistMovie.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noContentText}>No movies in your watchlist yet</Text>
        )}
      </View>

      {/* Similar Content */}
      {similarMovies.length > 0 && (
        <View style={styles.similarContent}>
          <Text style={styles.sectionTitle}>More Like This</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarMovies.map((similar) => (
              <TouchableOpacity 
                key={similar.id} 
                style={styles.similarItem}
                onPress={() => {
                  navigation.push('MovieDetail', { movieId: similar.id });
                }}
              >
                <Image
                  source={{ uri: similar.poster_path }}
                  style={styles.similarImage}
                  resizeMode="cover"
                />
                <Text style={styles.similarTitle}>{similar.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
    padding: theme.spacing.lg,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.typography.fontSize.lg,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
  },
  buttonText: {
    color: theme.colors.background.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  headerLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  backButton: {
    marginRight: theme.spacing.sm,
    padding: theme.spacing.xs,
  },
  homeButton: {
    padding: theme.spacing.xs,
  },
  headerLogo: {
    fontSize: 20,
  },
  noContentText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.md,
    marginLeft: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
});

export default MovieDetailScreen;