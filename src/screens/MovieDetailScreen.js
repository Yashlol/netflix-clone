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
  Animated,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../constants/theme';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { movieService } from '../services/movie';
import { watchlistService } from '../services/watchlist';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { BrandLogo } from '../components/shared/NetflixLogo';

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
        <BrandLogo style={styles.headerLogo} />
      </TouchableOpacity>
    </View>
  );
};

const MovieItem = ({ movie, onPress, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scaleAnim = useState(new Animated.Value(1))[0];
  const opacityAnim = useState(new Animated.Value(0))[0];

  const handleHoverIn = () => {
    setIsHovered(true);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={[styles.movieItemContainer, style]}
      activeOpacity={0.9}
    >
      <Animated.View
        style={[
          styles.movieItemInner,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Image
          source={{ uri: movie.poster_path }}
          style={styles.similarImage}
          resizeMode="cover"
        />
        <Animated.View
          style={[
            styles.movieItemOverlay,
            {
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.movieItemContent}>
            <Text style={styles.movieItemTitle} numberOfLines={2}>{movie.title}</Text>
            <Text style={styles.movieItemYear}>
              {new Date(movie.release_date).getFullYear()}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    </TouchableOpacity>
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

  const movieId = route?.params?.movieId || 550;

  // Fetch watchlist movies
  const fetchWatchlistMovies = async () => {
    try {
      if (!user) return;
      
      const watchlist = await watchlistService.getWatchlist(user.id, user.id);
      const movieIds = watchlist.map(item => item.movie_id);
      const movies = await movieService.getMultipleMovieDetails(movieIds);
      setWatchlistMovies(movies);
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Navigator:', navigator);

        // if (!navigator.onLine) {
        //   throw new Error('No internet connection. Please check your network and try again.');
        // }

        const [movieData, similarMoviesData] = await Promise.all([
          movieService.getMovieDetails(movieId),
          movieService.getSimilarMovies(movieId)
        ]);
        
        if (!movieData) {
          throw new Error('Failed to load movie details. Please try again.');
        }

        setMovie(movieData);
        setSimilarMovies(similarMoviesData.slice(0, 10));

        // Check if movie is in watchlist and fetch watchlist movies
        if (user) {
          try {
            const [inWatchlist] = await Promise.all([
              watchlistService.isInWatchlist(user.id, user.id, movieId),
              fetchWatchlistMovies()
            ]);
            setIsInWatchlist(inWatchlist);
          } catch (watchlistError) {
            console.error('Error fetching watchlist:', watchlistError);
          }
        }
      } catch (err) {
        console.error('Error fetching movie data:', err);
        setError(err.message || 'Failed to load movie data. Please try again.');
        Alert.alert(
          'Error',
          err.message || 'Failed to load movie data. Please try again.',
          [
            { text: 'Retry', onPress: () => fetchMovieData() },
            { text: 'Go Back', onPress: () => navigation.goBack(), style: 'cancel' }
          ]
        );
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
        await watchlistService.removeFromWatchlist(user.id, user.id, movieId);
        setIsInWatchlist(false);
      } else {
        await watchlistService.addToWatchlist(user.id, user.id, movieId);
        setIsInWatchlist(true);
      }
      // Refresh watchlist movies after adding/removing
      await fetchWatchlistMovies();
    } catch (error) {
      console.error('Error updating watchlist:', error);
      Alert.alert('Error', error.message || 'Failed to update watchlist');
    } finally {
      setWatchlistLoading(false);
    }
  };

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
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home'); // Or any safe screen
            }
          }}
        >
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  

  if (!movie) return null;

  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : '';
  const rating = 'TV-MA';
  const duration = '2h 15m';

  return (
    <ScrollView style={styles.container} bounces={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <ImageBackground
          source={{ uri: movie.backdrop_path }}
          style={styles.bannerImage}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['transparent', 'rgba(15, 23, 30, 0.8)', 'rgba(15, 23, 30, 1)']}
            style={styles.bannerOverlay}
          >
            <View style={styles.movieInfo}>
              <Text style={styles.title}>{movie.title}</Text>
              <View style={styles.metaInfo}>
                <Text style={styles.metaText}>{releaseYear}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{rating}</Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaText}>{duration}</Text>
              </View>
            </View>
          </LinearGradient>
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
      {watchlistMovies.length > 0 && (
        <View style={styles.similarContent}>
          <Text style={styles.sectionTitle}>My List</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {watchlistMovies.map((watchlistMovie) => (
              <MovieItem
                key={watchlistMovie.id}
                movie={watchlistMovie}
                onPress={() => {
                  navigation.push('MovieDetail', { movieId: watchlistMovie.id });
                }}
                style={styles.similarItem}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Similar Content */}
      {similarMovies.length > 0 && (
        <View style={styles.similarContent}>
          <Text style={styles.sectionTitle}>More Like This</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {similarMovies.map((similar) => (
              <MovieItem
                key={similar.id}
                movie={similar}
                onPress={() => {
                  navigation.push('MovieDetail', { movieId: similar.id });
                }}
                style={styles.similarItem}
              />
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
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
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
    textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  metaText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
  },
  metaDot: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    marginHorizontal: theme.spacing.xs,
    textShadow: '0px 1px 2px rgba(0, 0, 0, 0.5)',
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
  movieItemContainer: {
    width: 140,
    marginRight: theme.spacing.md,
    cursor: 'pointer',
  },
  movieItemInner: {
    position: 'relative',
    borderRadius: theme.borderRadius.sm,
    overflow: 'hidden',
    backgroundColor: theme.colors.background.card,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  movieItemOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 30, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
  },
  movieItemContent: {
    width: '100%',
    alignItems: 'center',
  },
  movieItemTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MovieDetailScreen;