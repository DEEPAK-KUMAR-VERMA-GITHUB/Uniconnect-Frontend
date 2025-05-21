import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Colors} from '../constants/Constants';
import {EventRegister} from 'react-native-event-listeners';
import {LOADING_EVENT} from '../store/apis/queryClient';

export const GlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const subscription = EventRegister.addEventListener(
      LOADING_EVENT,
      (loading: boolean) => {
        setIsLoading(loading);
      },
    );

    return () => {
      EventRegister.removeEventListener(subscription as string);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
}); 
