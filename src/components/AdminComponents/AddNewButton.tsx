import {Dispatch, FC, SetStateAction} from 'react';
import {StyleSheet, TouchableHighlight} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../constants/Constants';

export const AddNewButton: FC<{
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}> = ({setModalVisible}) => {
  return (
    <TouchableHighlight
      style={styles.buttonContainer}
      onPress={() => setModalVisible(true)}>
      <MaterialIcons name="add" size={50} color={Colors.white} />
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    backgroundColor: Colors.primary,
    bottom: 50,
    right: 20,
    borderRadius: 100,
    zIndex: 10,
    padding: 10,
  },
});
