import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { theme } from '../constants/theme';

const MovieDetailScreen = () => {
  // Dummy data - replace with actual movie data later
  const movie = {
    title: "Sample Movie",
    year: "2024",
    duration: "2h 15m",
    rating: "TV-MA",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    genre: ["Action", "Drama", "Thriller"],
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{movie.title}</Text>
        <View style={styles.metaInfo}>
          <Text style={styles.metaText}>{movie.year}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>{movie.rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.metaText}>{movie.duration}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.playButton}>
          <Text style={styles.playButtonText}>▶ Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ My List</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.description}>{movie.description}</Text>
      </View>

      <View style={styles.genreContainer}>
        <Text style={styles.genreTitle}>Genres:</Text>
        <View style={styles.genreList}>
          {movie.genre.map((genre, index) => (
            <View key={index} style={styles.genreTag}>
              <Text style={styles.genreText}>{genre}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  header: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
  },
  dot: {
    color: theme.colors.text.secondary,
    marginHorizontal: theme.spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  playButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    flex: 2,
    alignItems: 'center',
  },
  playButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: theme.colors.background.secondary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    flex: 1,
    alignItems: 'center',
  },
  addButtonText: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.md,
  },
  descriptionContainer: {
    padding: theme.spacing.lg,
  },
  description: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 24,
  },
  genreContainer: {
    padding: theme.spacing.lg,
  },
  genreTitle: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
  },
  genreList: {
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
});

export default MovieDetailScreen;