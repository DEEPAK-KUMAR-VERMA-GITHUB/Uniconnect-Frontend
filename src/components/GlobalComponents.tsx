import {
  Text,
  TouchableOpacity,
  StyleSheet,
  DimensionValue,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import {Colors} from '../constants/Constants';
import {Dispatch, FC, ReactNode, SetStateAction} from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Picker} from '@react-native-picker/picker';
import MultiSelect from 'react-native-multiple-select';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
  borderRadius?: number;
  width?: undefined | DimensionValue;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
  fontSize?: number;
  fontWeight?:
    | 'bold'
    | 'normal'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
  shadowColor?: string;
  shadowOffset?: {width: number; height: number};
  shadowOpacity?: number;
  elevation?: number;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: 'solid' | 'dotted' | 'dashed';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
};

const CustomButton: FC<CustomButtonProps> = ({
  title,
  onPress,
  color = Colors.white,
  borderRadius = 10,
  width = '100%',
  padding = 12,
  paddingHorizontal = 12,
  paddingVertical = 12,
  fontSize = 18,
  fontWeight = 'bold',
  shadowColor = Colors.black,
  shadowOffset = {width: 0, height: 2},
  shadowOpacity = 0.25,
  elevation = 5,
  backgroundColor = Colors.primary,
  borderColor = Colors.transparent,
  borderWidth = 2,
  borderStyle = 'solid',
  alignItems = 'center',
}) => {
  const buttonStyles = StyleSheet.create({
    button: {
      backgroundColor,
      borderRadius,
      width,
      padding,
      paddingHorizontal,
      paddingVertical,
      alignItems,
      shadowColor,
      shadowOffset,
      shadowOpacity,
      elevation,
      borderColor,
      borderWidth,
      borderStyle,
    },
    text: {
      color,
      fontWeight,
      fontSize,
    },
  });

  return (
    <TouchableOpacity style={buttonStyles.button} onPress={onPress}>
      <Text style={buttonStyles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

type CustomeSafeAreaViewProps = {
  children: ReactNode | undefined;
  containerStyle?: object;
  contentContainerStyle?: object;
};

const CustomSafeAreaView: FC<CustomeSafeAreaViewProps> = ({
  children,
  containerStyle,
  contentContainerStyle,
}) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light,
      ...containerStyle,
    },
    contentContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 30,
      rowGap: 20,
      ...contentContainerStyle,
    },
  });
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          bounces={false}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

type LinkTextProps = {
  text?: string;
  linkText: string | undefined;
  onPress?: () => void;
};

const LinkText: FC<LinkTextProps> = ({text, linkText, onPress}) => {
  return (
    <View style={{flexDirection: 'row', columnGap: 5}}>
      <Text>{text}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={{color: Colors.primary, fontWeight: 'bold'}}>
          {linkText}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

type CustomInputProps = {
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  onChangeText?: (text: string) => void;
  value?: string;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  onleftIconClick?: () => void;
  onRightIconCLick?: () => void;
  error?: string;
};

const CustomInput: FC<CustomInputProps> = ({
  label,
  placeholder,
  secureTextEntry,
  leftIcon,
  rightIcon,
  onChangeText,
  value,
  keyboardType,
  onleftIconClick,
  onRightIconCLick,
  error,
}) => {
  const styles = StyleSheet.create({
    label: {
      fontSize: 16,
      color: Colors.current,
      marginBottom: 10,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
    inputBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: Colors.white,
      padding: 10,
      borderRadius: 10,
      width: '100%',
    },
    textInput: {
      flex: 1,
    },
    errorText: {
      color: Colors.danger,
      fontSize: 12,
      marginTop: 5,
    },
  });

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputBox}>
        {leftIcon && (
          <MaterialIcons
            name={leftIcon}
            size={24}
            color={Colors.gray}
            onPress={onleftIconClick}
          />
        )}
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onChangeText={onChangeText}
          value={value}
          keyboardType={keyboardType}
        />
        {rightIcon && (
          <MaterialIcons
            name={rightIcon}
            size={24}
            color={Colors.gray}
            onPress={onRightIconCLick}
          />
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

type CustomPickerProps = {
  label: string;
  selectedItem: string;
  setSelectedItem: Dispatch<SetStateAction<string>>;
  itemsList: Array<{label: string; value: string}>;
};

const CustomPicker: FC<CustomPickerProps> = ({
  label,
  selectedItem,
  setSelectedItem,
  itemsList,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: '100%',
    },
    selectBox: {
      paddingHorizontal: 10,
      borderRadius: 10,
      width: '100%',
      backgroundColor: Colors.white,
      paddingInline: 10,
    },
    labelStyle: {
      fontSize: 16,
      color: Colors.current,
      marginBottom: 10,
      fontWeight: 'bold',
      alignSelf: 'flex-start',
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.labelStyle}>{label}</Text>
      <View style={styles.selectBox}>
        <Picker selectedValue={selectedItem} onValueChange={setSelectedItem}>
          {itemsList.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

type CustomMultiSelectProps = {
  items: Array<{label: string; value: string}>;
  uniqueKey: string;
  displayKey: string;
  onSelectedItemsChange: (items: Array<{label: string; value: string}>) => void;
  selectedItems: Array<{label: string; value: string}>;
  selectText: string;
  searchInputPlaceholderText: string;
  onChangeInput: (text: string) => void;
  selectedItemTextColor?: string;
  submitButtonText?: string;
  submitButtonColor?: string;
  hideSubmitButton?: boolean;
  fixedHeight?: boolean;
  noItemsText: string;
  styleMainWrapper?: object;
};

const CustomMultiSelecter: FC<CustomMultiSelectProps> = ({
  items,
  uniqueKey = 'label',
  displayKey = 'label',
  onSelectedItemsChange,
  selectedItems,
  selectText,
  searchInputPlaceholderText,
  onChangeInput,
  selectedItemTextColor = Colors.green,
  submitButtonText = 'Done',
  submitButtonColor = Colors.green,
  hideSubmitButton = false,
  fixedHeight = false,
  noItemsText,
  styleMainWrapper = {
    width: '100%',
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  ...props
}) => {
  return (
    <MultiSelect
      items={items}
      uniqueKey="label"
      displayKey="value"
      onSelectedItemsChange={onSelectedItemsChange}
      selectedItems={selectedItems}
      selectText={selectText}
      searchInputPlaceholderText={searchInputPlaceholderText}
      onChangeInput={onChangeInput}
      selectedItemTextColor={selectedItemTextColor}
      submitButtonText={submitButtonText}
      submitButtonColor={submitButtonColor}
      hideSubmitButton={false}
      fixedHeight={true}
      noItemsText={noItemsText}
      styleMainWrapper={styleMainWrapper}
      {...props}
    />
  );
};

type SectionProps = {
  title: string;
  children: ReactNode;
  style?: object;
  link?: string;
  handleClick?: () => void;
};

const CustomSection: FC<SectionProps> = ({
  title,
  children,
  style,
  link,
  handleClick,
}) => {
  const styles = StyleSheet.create({
    container: {
      width: '97%',
      padding: 20,
      backgroundColor: Colors.white,
      elevation: 5,
      borderRadius: 10,
    },
    topRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.black,
    },
    ...style,
  });

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <LinkText linkText={link} onPress={handleClick} />
      </View>
      {children}
    </View>
  );
};

type CustomSectionItemsProps = {
  itemIcon: string;
  itemTitle: string;
  itemSubtitle?: string;
  itemStatus?: 'Pending' | 'Completed' | 'In Progress';
  itemStatusTextColor?: string;
  itemStatusBackgroundColor?: string;
  itemStatusBorderRadius?: number;
  iconColor?: string;
};

const CustomSectionItems: FC<CustomSectionItemsProps> = ({
  itemIcon,
  itemTitle,
  itemSubtitle,
  itemStatus,
  itemStatusTextColor = Colors.white,
  itemStatusBackgroundColor = Colors.primary,
  itemStatusBorderRadius = 20,
  iconColor = Colors.primary,
}) => {
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: 10,
      backgroundColor: Colors.light,
      borderRadius: 10,
      marginBottom: 10,
      gap: 10,
    },
  });

  return (
    <View>
      <View style={styles.itemContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
          <MaterialIcon name={itemIcon} size={30} color={iconColor} />
          <View>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {' '}
              {itemTitle}{' '}
            </Text>
            <Text style={{fontSize: 12, color: Colors.muted}}>
              {itemSubtitle}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: `${
              itemStatus === 'Pending'
                ? Colors.primary
                : itemStatus === 'Completed'
                ? Colors.success
                : itemStatus === 'In Progress'
                ? Colors.secondary
                : itemStatusBackgroundColor
            }`,
            paddingHorizontal: 20,
            paddingVertical: 8,
            borderRadius: itemStatusBorderRadius,
          }}>
          <Text style={{color: itemStatusTextColor}}>{itemStatus}</Text>
        </View>
      </View>
    </View>
  );
};

export {
  CustomButton,
  CustomInput,
  CustomSafeAreaView,
  LinkText,
  CustomPicker,
  CustomMultiSelecter,
  CustomSection,
  CustomSectionItems,
};
