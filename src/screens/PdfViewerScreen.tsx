// Uniconnect/src/screens/PdfViewerScreen.tsx
import {useNavigation, useRoute} from '@react-navigation/native';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {CustomSafeAreaView, TabHeader} from '../components/GlobalComponents';
import Pdf from 'react-native-pdf';

export const PdfViewerScreen: FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {uri, title} = route.params as {uri: string; title: string};

  return (
    <CustomSafeAreaView contentContainerStyle={{flex: 1}}>
      <TabHeader title={title} leftIconClick={() => navigation.goBack()} />
      <View style={styles.container}>
        <Pdf
          source={{uri}}
          style={styles.pdf}
          onLoadComplete={numberOfPages => {
            console.log(`PDF loaded with ${numberOfPages} pages`);
          }}
          onError={error => {
            console.error('PDF loading error:', error);
          }}
        />
      </View>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
